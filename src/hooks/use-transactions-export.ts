import { useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Transaction {
    id: any;
    descricao: string;
    valor: number | string;
    tipo: string;
    data?: string;
    data_prevista?: string;
    categoria?: { descricao: string };
    is_transferencia?: boolean;
    status?: string;
    conta?: { nome: string }; // Optional if available
}

export function useTransactionsExport() {
    const exportTransactionsToPDF = useCallback((transactions: Transaction[], formatCurrency: (val: number) => string) => {
        try {
            const doc = new jsPDF();

            // Header
            doc.setFillColor(17, 24, 39); // Dark background
            doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(20);
            doc.text('Relatório de Transações', 14, 20);

            doc.setFontSize(10);
            doc.setTextColor(156, 163, 175);
            doc.text(`Gerado em: ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, 14, 30);

            const tableData = transactions.map(t => {
                const dateStr = (t.data || t.data_prevista || '').split('T')[0];
                const [year, month, day] = dateStr.split('-');
                const date = new Date(Number(year), Number(month) - 1, Number(day));

                return [
                    format(date, 'dd/MM/yyyy'),
                    t.descricao,
                    t.categoria?.descricao || 'Sem categoria',
                    t.tipo === 'entrada' ? 'Receita' : 'Despesa',
                    formatCurrency(Number(t.valor)),
                    t.tipo === 'entrada' ? 'Recebido' : 'Pago'
                ];
            });

            autoTable(doc, {
                startY: 45,
                head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Status']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [17, 24, 39],
                    textColor: [255, 255, 255],
                    fontSize: 10,
                    fontStyle: 'bold'
                },
                bodyStyles: {
                    textColor: [50, 50, 50],
                    fontSize: 9
                },
                alternateRowStyles: {
                    fillColor: [245, 247, 250]
                },
                columnStyles: {
                    4: { halign: 'right', fontStyle: 'bold' },
                    5: { halign: 'center' }
                },
                didParseCell: function (data) {
                    // Color amounts
                    if (data.section === 'body' && data.column.index === 4) {
                        const rawValue = transactions[data.row.index];
                        if (rawValue.tipo === 'entrada') {
                            data.cell.styles.textColor = [34, 197, 94]; // Green
                        } else {
                            data.cell.styles.textColor = [239, 68, 68]; // Red
                        }
                    }
                }
            });

            // Footer
            const pageCount = doc.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(150, 150, 150);
                doc.text(
                    `Página ${i} de ${pageCount} - Assistente Julia`,
                    doc.internal.pageSize.width / 2,
                    doc.internal.pageSize.height - 10,
                    { align: 'center' }
                );
            }

            doc.save('transacoes.pdf');
            return true;
        } catch (error) {
            console.error('Error exporting transactions:', error);
            return false;
        }
    }, []);

    const exportTransactionsToExcel = useCallback((transactions: Transaction[], formatCurrency: (val: number) => string) => {
        try {
            // Preparar dados para o Excel
            const data = transactions.map(t => {
                const dateStr = (t.data || t.data_prevista || '').split('T')[0];
                const [year, month, day] = dateStr.split('-');

                return {
                    'Data': `${day}/${month}/${year}`,
                    'Descrição': t.descricao,
                    'Categoria': t.categoria?.descricao || 'Sem categoria',
                    'Tipo': t.tipo === 'entrada' ? 'Receita' : 'Despesa',
                    'Valor': Number(t.valor), // Manter como número para cálculos no Excel
                    'Status': t.tipo === 'entrada' ? 'Recebido' : 'Pago',
                    'Conta': t.conta?.nome || '-'
                };
            });

            // Criar workbook e worksheet
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(data);

            // Ajustar largura das colunas
            const colWidths = [
                { wch: 12 }, // Data
                { wch: 40 }, // Descrição
                { wch: 20 }, // Categoria
                { wch: 10 }, // Tipo
                { wch: 15 }, // Valor
                { wch: 12 }, // Status
                { wch: 20 }  // Conta
            ];
            ws['!cols'] = colWidths;

            // Adicionar worksheet ao workbook
            XLSX.utils.book_append_sheet(wb, ws, "Transações");

            // Gerar arquivo
            XLSX.writeFile(wb, `transacoes_${format(new Date(), 'dd-MM-yyyy')}.xlsx`);
            return true;
        } catch (error) {
            console.error('Error exporting transactions to Excel:', error);
            return false;
        }
    }, []);

    return { exportTransactionsToPDF, exportTransactionsToExcel };
}
