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

            // 2. Check date proximity
            const ofxDate = new Date(ofxTx.date);
            const existingDate = new Date(existingTx.data);
            const daysDiff = Math.abs(
                (ofxDate.getTime() - existingDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            // 3. Check description similarity using fuzzy matching
            const descriptionSimilarity = fuzzball.ratio(
                ofxTx.description.toLowerCase(),
                existingTx.descricao.toLowerCase()
            );

            // PRIORITY 1: Exact match - Same date + Same amount (description doesn't matter much)
            // This catches duplicates even if description differs slightly
            if (daysDiff === 0) {
                bestMatch = {
                    ofxTransaction: ofxTx,
                    matchType: 'exact',
                    existingTransaction: existingTx,
                    confidence: 100, // Perfect date+amount match
                };
                break; // Found exact match, no need to continue
            }

            // PRIORITY 2: Very likely duplicate - Date within 1 day + Amount exact + Description 50%+ similar
            if (daysDiff <= 1 && descriptionSimilarity >= 50) {
                bestMatch = {
                    ofxTransaction: ofxTx,
                    matchType: 'exact',
                    existingTransaction: existingTx,
                    confidence: descriptionSimilarity,
                };
                break;
            }

            // PRIORITY 3: Suggestion - Date within 3 days + Amount exact + Description 40%+ similar
            if (daysDiff <= 3 && descriptionSimilarity >= 40) {
                // Only update if this is a better match than current best
                if (
                    bestMatch.matchType === 'new' ||
                    (bestMatch.confidence && descriptionSimilarity > bestMatch.confidence)
                ) {
                    bestMatch = {
                        ofxTransaction: ofxTx,
                        matchType: 'suggestion',
                        existingTransaction: existingTx,
                        confidence: descriptionSimilarity,
                    };
                }
            }

            // PRIORITY 4: Weak suggestion - Date within 7 days + Amount exact (any description)
            if (daysDiff <= 7 && bestMatch.matchType === 'new') {
                bestMatch = {
                    ofxTransaction: ofxTx,
                    matchType: 'suggestion',
                    existingTransaction: existingTx,
                    confidence: Math.max(30, descriptionSimilarity), // Minimum 30% confidence
                };
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
