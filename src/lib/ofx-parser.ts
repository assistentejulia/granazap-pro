export interface OFXTransaction {
    id: string;
    date: string; // YYYY-MM-DD
    amount: number;
    description: string;
    memo?: string;
    type: 'DEBIT' | 'CREDIT';
    fitid?: string;
}

export interface ParsedOFXData {
    accountId: string;
    bankId: string;
    startDate: string;
    endDate: string;
    transactions: OFXTransaction[];
}

/**
 * Manual OFX parser - reads OFX as plain text and extracts data using regex
 * More reliable than ofx-js library for different bank formats
 */
export async function parseOFXFile(file: File): Promise<ParsedOFXData> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = async (e) => {
            try {
                const content = e.target?.result as string;

                console.log('OFX File Content (first 500 chars):', content.substring(0, 500));

                // Extract account ID
                const acctIdMatch = content.match(/<ACCTID>([^<]+)/i) || content.match(/<ACCTNUM>([^<]+)/i);
                const accountId = acctIdMatch ? acctIdMatch[1].trim() : 'unknown';

                // Extract bank ID
                const bankIdMatch = content.match(/<BANKID>([^<]+)/i) || content.match(/<ORG>([^<]+)/i);
                const bankId = bankIdMatch ? bankIdMatch[1].trim() : '';

                // Extract date range
                const dtStartMatch = content.match(/<DTSTART>([^<]+)/i);
                const dtEndMatch = content.match(/<DTEND>([^<]+)/i);

                const formatOFXDate = (dateStr: string): string => {
                    if (!dateStr || dateStr.length < 8) return '';
                    const year = dateStr.substring(0, 4);
                    const month = dateStr.substring(4, 6);
                    const day = dateStr.substring(6, 8);
                    return `${year}-${month}-${day}`;
                };

                const startDate = dtStartMatch ? formatOFXDate(dtStartMatch[1]) : '';
                const endDate = dtEndMatch ? formatOFXDate(dtEndMatch[1]) : '';

                // Extract transactions
                const transactions: OFXTransaction[] = [];

                // Find all STMTTRN blocks
                const stmtTrnRegex = /<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi;
                let match;

                while ((match = stmtTrnRegex.exec(content)) !== null) {
                    const trnBlock = match[1];

                    // Extract transaction fields
                    const trnTypeMatch = trnBlock.match(/<TRNTYPE>([^<]+)/i);
                    const dtPostedMatch = trnBlock.match(/<DTPOSTED>([^<]+)/i) || trnBlock.match(/<DTUSER>([^<]+)/i);
                    const trnAmtMatch = trnBlock.match(/<TRNAMT>([^<]+)/i);
                    const fitIdMatch = trnBlock.match(/<FITID>([^<]+)/i);
                    const nameMatch = trnBlock.match(/<NAME>([^<]+)/i);
                    const memoMatch = trnBlock.match(/<MEMO>([^<]+)/i);

                    if (!dtPostedMatch || !trnAmtMatch) continue;

                    const date = formatOFXDate(dtPostedMatch[1]);
                    const amount = parseFloat(trnAmtMatch[1]);
                    const type = amount >= 0 ? 'CREDIT' : 'DEBIT';
                    const description = nameMatch ? nameMatch[1].trim() : (memoMatch ? memoMatch[1].trim() : 'Transação sem descrição');
                    const memo = memoMatch ? memoMatch[1].trim() : undefined;
                    const fitid = fitIdMatch ? fitIdMatch[1].trim() : undefined;

                    transactions.push({
                        id: fitid || `${date}-${Math.abs(amount)}-${Math.random().toString(36).substr(2, 9)}`,
                        date,
                        amount: Math.abs(amount),
                        description,
                        memo,
                        type,
                        fitid,
                    });
                }

                console.log(`Parsed ${transactions.length} transactions from OFX file`);
                console.log('Account ID:', accountId, 'Bank ID:', bankId);

                if (transactions.length === 0) {
                    throw new Error('Nenhuma transação encontrada no arquivo OFX');
                }

                resolve({
                    accountId,
                    bankId,
                    startDate,
                    endDate,
                    transactions,
                });
            } catch (error) {
                console.error('OFX Parse Error:', error);
                reject(new Error(`Erro ao processar arquivo OFX: ${error instanceof Error ? error.message : 'Erro desconhecido'}`));
            }
        };

        reader.onerror = () => {
            reject(new Error('Erro ao ler o arquivo'));
        };

        reader.readAsText(file);
    });
}

/**
 * Normalize OFX transaction to app transaction format
 */
export function normalizeOFXTransaction(
    ofxTx: OFXTransaction,
    contaId: string,
    categoriaId?: string
) {
    return {
        conta_id: contaId,
        descricao: ofxTx.description,
        valor: ofxTx.amount,
        data: ofxTx.date,
        tipo: ofxTx.type === 'CREDIT' ? 'entrada' : 'saida',
        categoria_id: categoriaId || null,
        origem: 'ofx_import',
    };
}
