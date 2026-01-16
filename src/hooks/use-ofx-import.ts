import { useState } from 'react';
import { parseOFXFile, normalizeOFXTransaction, type OFXTransaction } from '@/lib/ofx-parser';
import { matchTransactions, groupMatchResults, type MatchResult } from '@/lib/transaction-matcher';
import { useAllTransactions } from './use-all-transactions';
import { createClient } from '@/lib/supabase/client';
import { useUser } from './use-user';

export function useOFXImport() {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
    const [ofxData, setOfxData] = useState<any>(null);

    const { transactions } = useAllTransactions('year', null);
    const { profile } = useUser();

    /**
     * Upload and process OFX file
     */
    const uploadOFX = async (file: File, accountId: string) => {
        setIsProcessing(true);
        setError(null);

        try {
            // Parse OFX file
            const parsedData = await parseOFXFile(file);
            setOfxData(parsedData);

            // Match transactions
            const existingTransactions = transactions.map(t => ({
                id: t.id.toString(),
                data: t.data,
                valor: Number(t.valor),
                descricao: t.descricao,
                tipo: t.tipo,
                conta_id: t.conta_id || '',
            }));

            const results = matchTransactions(
                parsedData.transactions,
                existingTransactions,
                accountId
            );

            setMatchResults(results);
            return { success: true, results };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao processar arquivo OFX';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Import selected transactions
     */
    const importTransactions = async (
        selectedMatches: MatchResult[],
        accountId: string,
        defaultCategoryId?: string
    ) => {
        setIsProcessing(true);
        setError(null);

        try {
            if (!profile?.id) {
                throw new Error('Usuário não autenticado');
            }

            const supabase = createClient();

            // Only import "new" and "suggestion" transactions that user confirmed
            const transactionsToInsert = selectedMatches
                .filter(match => match.matchType === 'new' || match.matchType === 'suggestion')
                .map(match =>
                    normalizeOFXTransaction(match.ofxTransaction, accountId, defaultCategoryId)
                )
                .map(tx => ({
                    ...tx,
                    usuario_id: profile.id,
                    // conta_id is already a UUID string, no conversion needed
                    categoria_id: tx.categoria_id ? parseInt(tx.categoria_id as string) : null, // Convert to integer or null
                    is_transferencia: false, // Add default value
                }));

            if (transactionsToInsert.length === 0) {
                return { success: true, count: 0 };
            }

            console.log('Transactions to insert (first 3):', transactionsToInsert.slice(0, 3));

            // Bulk insert
            const { data, error: insertError } = await supabase
                .from('transacoes')
                .insert(transactionsToInsert)
                .select();

            if (insertError) {
                console.error('Supabase insert error:', insertError);
                throw new Error(`Erro ao importar transações: ${insertError.message}`);
            }

            return { success: true, count: data?.length || 0 };
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Erro ao importar transações';
            setError(errorMessage);
            console.error('Import error:', err);
            return { success: false, error: errorMessage };
        } finally {
            setIsProcessing(false);
        }
    };

    /**
     * Reset state
     */
    const reset = () => {
        setMatchResults([]);
        setOfxData(null);
        setError(null);
    };

    return {
        uploadOFX,
        importTransactions,
        reset,
        isProcessing,
        error,
        matchResults,
        ofxData,
        groupedResults: groupMatchResults(matchResults),
    };
}
