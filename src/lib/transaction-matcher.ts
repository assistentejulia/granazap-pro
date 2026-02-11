import * as fuzzball from 'fuzzball';
import type { OFXTransaction } from './ofx-parser';

export interface ExistingTransaction {
    id: string;
    data: string;
    valor: number;
    descricao: string;
    tipo: 'entrada' | 'saida';
    conta_id: string;
}

export interface MatchResult {
    ofxTransaction: OFXTransaction;
    matchType: 'exact' | 'suggestion' | 'new';
    existingTransaction?: ExistingTransaction;
    confidence?: number; // 0-100
}

/**
 * Match OFX transactions against existing transactions in the database
 * @param ofxTransactions - Transactions from OFX file
 * @param existingTransactions - Transactions already in the database
 * @param accountId - The account ID to filter by
 * @returns Categorized match results
 */
export function matchTransactions(
    ofxTransactions: OFXTransaction[],
    existingTransactions: ExistingTransaction[],
    accountId: string
): MatchResult[] {
    const results: MatchResult[] = [];

    // Filter existing transactions by account
    const accountTransactions = existingTransactions.filter(
        (t) => t.conta_id === accountId
    );

    for (const ofxTx of ofxTransactions) {
        let bestMatch: MatchResult = {
            ofxTransaction: ofxTx,
            matchType: 'new',
        };

        for (const existingTx of accountTransactions) {
            // 1. Check if amounts match (exact)
            const amountMatch = Math.abs(existingTx.valor - ofxTx.amount) < 0.01;
            if (!amountMatch) continue;

            // 2. Check if types match (income vs expense)
            const typeMatch = (ofxTx.type === 'CREDIT' && existingTx.tipo === 'entrada') ||
                (ofxTx.type === 'DEBIT' && existingTx.tipo === 'saida');
            if (!typeMatch) continue;

            // 3. Prepare data for comparison
            const ofxDate = new Date(ofxTx.date);
            const existingDate = new Date(existingTx.data);
            const daysDiff = Math.abs(
                (ofxDate.getTime() - existingDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            const descriptionSimilarity = fuzzball.ratio(
                ofxTx.description.toLowerCase(),
                existingTx.descricao.toLowerCase()
            );

            // PRIORITY 1: Exact match - Same day + High similarity (85%+)
            if (daysDiff === 0 && descriptionSimilarity >= 85) {
                bestMatch = {
                    ofxTransaction: ofxTx,
                    matchType: 'exact',
                    existingTransaction: existingTx,
                    confidence: descriptionSimilarity,
                };
                break; // Found perfect match
            }

            // PRIORITY 2: Suggestion - Same day + Medium similarity (40%+)
            if (daysDiff === 0 && descriptionSimilarity >= 40) {
                if (bestMatch.matchType === 'new' || (bestMatch.confidence || 0) < descriptionSimilarity) {
                    bestMatch = {
                        ofxTransaction: ofxTx,
                        matchType: 'suggestion',
                        existingTransaction: existingTx,
                        confidence: descriptionSimilarity,
                    };
                }
                continue; // Keep looking for better matches
            }

            // PRIORITY 3: Suggestion - Date drift (up to 3 days) + High similarity (60%+)
            if (daysDiff <= 3 && descriptionSimilarity >= 60) {
                const weightedConfidence = descriptionSimilarity * (1 - daysDiff * 0.1);
                if (bestMatch.matchType === 'new' || (bestMatch.confidence || 0) < weightedConfidence) {
                    bestMatch = {
                        ofxTransaction: ofxTx,
                        matchType: 'suggestion',
                        existingTransaction: existingTx,
                        confidence: weightedConfidence,
                    };
                }
            }
        }

        results.push(bestMatch);
    }

    return results;
}

/**
 * Group match results by type for easier UI rendering
 */
export function groupMatchResults(results: MatchResult[]) {
    return {
        exact: results.filter((r) => r.matchType === 'exact'),
        suggestions: results.filter((r) => r.matchType === 'suggestion'),
        new: results.filter((r) => r.matchType === 'new'),
    };
}

/**
 * Calculate statistics for match results
 */
export function getMatchStatistics(results: MatchResult[]) {
    const grouped = groupMatchResults(results);

    return {
        total: results.length,
        exactMatches: grouped.exact.length,
        suggestions: grouped.suggestions.length,
        newTransactions: grouped.new.length,
        matchRate: results.length > 0
            ? ((grouped.exact.length / results.length) * 100).toFixed(1)
            : '0',
    };
}
