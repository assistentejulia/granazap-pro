"use client";

import { useState, useRef } from "react";
import { X, Upload, CheckCircle2, AlertCircle, FileText, ArrowRight, ArrowLeft } from "lucide-react";
import { useOFXImport } from "@/hooks/use-ofx-import";
import { useAccounts } from "@/hooks/use-accounts";
import { useCurrency } from "@/contexts/currency-context";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import type { MatchResult } from "@/lib/transaction-matcher";
import { getMatchStatistics } from "@/lib/transaction-matcher";

interface OFXReconciliationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

type Step = 'upload' | 'review' | 'confirm';

export function OFXReconciliationModal({ isOpen, onClose, onSuccess }: OFXReconciliationModalProps) {
    const { t } = useLanguage();
    const { formatCurrency } = useCurrency();
    const { accounts } = useAccounts('pessoal');
    const { uploadOFX, importTransactions, reset, isProcessing, error, groupedResults, ofxData } = useOFXImport();

    const [step, setStep] = useState<Step>('upload');
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedMatches, setSelectedMatches] = useState<Set<string>>(new Set());
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleClose = () => {
        reset();
        setStep('upload');
        setSelectedAccountId('');
        setSelectedFile(null);
        setSelectedMatches(new Set());
        onClose();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile || !selectedAccountId) return;

        const result = await uploadOFX(selectedFile, selectedAccountId);

        if (result.success) {
            // Auto-select all "new" transactions for import
            const newMatches = new Set<string>();
            groupedResults.new.forEach(match => {
                newMatches.add(match.ofxTransaction.id);
            });
            setSelectedMatches(newMatches);
            setStep('review');
        }
    };

    const toggleMatch = (matchId: string) => {
        const newSelected = new Set(selectedMatches);
        if (newSelected.has(matchId)) {
            newSelected.delete(matchId);
        } else {
            newSelected.add(matchId);
        }
        setSelectedMatches(newSelected);
    };

    const handleSelectAll = () => {
        const allNewAndSuggestions = new Set<string>();
        [...groupedResults.new, ...groupedResults.suggestions].forEach(match => {
            allNewAndSuggestions.add(match.ofxTransaction.id);
        });
        setSelectedMatches(allNewAndSuggestions);
    };

    const handleDeselectAll = () => {
        setSelectedMatches(new Set());
    };

    const isAllSelected = selectedMatches.size > 0 &&
        selectedMatches.size === (groupedResults.new.length + groupedResults.suggestions.length);

    const handleImport = async () => {
        const matchesToImport = [
            ...groupedResults.new,
            ...groupedResults.suggestions,
        ].filter(match => selectedMatches.has(match.ofxTransaction.id));

        const result = await importTransactions(matchesToImport, selectedAccountId);

        if (result.success) {
            setStep('confirm');
            onSuccess?.();
        }
    };

    const stats = getMatchStatistics([...groupedResults.exact, ...groupedResults.suggestions, ...groupedResults.new]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <div>
                        <h2 className="text-2xl font-bold">Conciliação Bancária (OFX)</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            {step === 'upload' && 'Faça upload do arquivo OFX do seu banco'}
                            {step === 'review' && 'Revise as transações encontradas'}
                            {step === 'confirm' && 'Importação concluída com sucesso'}
                        </p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="p-2 hover:bg-foreground/5 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 p-4 bg-foreground/5">
                    <div className={cn("flex items-center gap-2", step === 'upload' && "text-primary font-semibold")}>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center",
                            step === 'upload' ? "bg-primary text-primary-foreground" : "bg-foreground/10")}>
                            1
                        </div>
                        <span className="text-sm">Upload</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className={cn("flex items-center gap-2", step === 'review' && "text-primary font-semibold")}>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center",
                            step === 'review' ? "bg-primary text-primary-foreground" : "bg-foreground/10")}>
                            2
                        </div>
                        <span className="text-sm">Revisão</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    <div className={cn("flex items-center gap-2", step === 'confirm' && "text-primary font-semibold")}>
                        <div className={cn("w-8 h-8 rounded-full flex items-center justify-center",
                            step === 'confirm' ? "bg-primary text-primary-foreground" : "bg-foreground/10")}>
                            3
                        </div>
                        <span className="text-sm">Confirmação</span>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Step 1: Upload */}
                    {step === 'upload' && (
                        <div className="space-y-6">
                            {/* Account Selector */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Conta Bancária</label>
                                <select
                                    value={selectedAccountId}
                                    onChange={(e) => setSelectedAccountId(e.target.value)}
                                    className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="">Selecione uma conta</option>
                                    {accounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* File Upload */}
                            <div>
                                <label className="block text-sm font-medium mb-2">Arquivo OFX</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
                                >
                                    <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground">
                                        {selectedFile ? selectedFile.name : 'Clique para selecionar ou arraste o arquivo .ofx'}
                                    </p>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept=".ofx"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <p className="text-sm text-red-500">{error}</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 2: Review */}
                    {step === 'review' && (
                        <div className="space-y-6">
                            {/* Statistics */}
                            <div className="grid grid-cols-4 gap-4">
                                <div className="bg-foreground/5 rounded-lg p-4">
                                    <p className="text-sm text-muted-foreground">Total</p>
                                    <p className="text-2xl font-bold">{stats.total}</p>
                                </div>
                                <div className="bg-green-500/10 rounded-lg p-4">
                                    <p className="text-sm text-green-600">Conciliadas</p>
                                    <p className="text-2xl font-bold text-green-600">{stats.exactMatches}</p>
                                </div>
                                <div className="bg-yellow-500/10 rounded-lg p-4">
                                    <p className="text-sm text-yellow-600">Sugestões</p>
                                    <p className="text-2xl font-bold text-yellow-600">{stats.suggestions}</p>
                                </div>
                                <div className="bg-blue-500/10 rounded-lg p-4">
                                    <p className="text-sm text-blue-600">Novas</p>
                                    <p className="text-2xl font-bold text-blue-600">{stats.newTransactions}</p>
                                </div>
                            </div>

                            {/* Matched Transactions (Read-only) */}
                            {groupedResults.exact.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                                        Conciliadas ({groupedResults.exact.length})
                                    </h3>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {groupedResults.exact.map((match) => (
                                            <div key={match.ofxTransaction.id} className="flex items-center justify-between p-3 bg-green-500/5 border border-green-500/20 rounded-lg">
                                                <div className="flex-1">
                                                    <p className="font-medium">{match.ofxTransaction.description}</p>
                                                    <p className="text-sm text-muted-foreground">{match.ofxTransaction.date}</p>
                                                </div>
                                                <p className="font-mono font-semibold">{formatCurrency(match.ofxTransaction.amount)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Suggestions */}
                            {groupedResults.suggestions.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                                        Sugestões ({groupedResults.suggestions.length})
                                    </h3>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {groupedResults.suggestions.map((match) => (
                                            <div key={match.ofxTransaction.id} className="flex items-center gap-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMatches.has(match.ofxTransaction.id)}
                                                    onChange={() => toggleMatch(match.ofxTransaction.id)}
                                                    className="w-4 h-4"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium">{match.ofxTransaction.description}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {match.ofxTransaction.date} • {match.confidence}% similar
                                                    </p>
                                                </div>
                                                <p className="font-mono font-semibold">{formatCurrency(match.ofxTransaction.amount)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* New Transactions */}
                            {groupedResults.new.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-lg font-semibold flex items-center gap-2">
                                            <FileText className="w-5 h-5 text-blue-500" />
                                            Novas Transações ({groupedResults.new.length})
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
                                                className="text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                            >
                                                {isAllSelected ? 'Desmarcar Todas' : 'Selecionar Todas'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2 max-h-96 overflow-y-auto">
                                        {groupedResults.new.map((match) => (
                                            <div key={match.ofxTransaction.id} className="flex items-center gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMatches.has(match.ofxTransaction.id)}
                                                    onChange={() => toggleMatch(match.ofxTransaction.id)}
                                                    className="w-4 h-4"
                                                />
                                                <div className="flex-1">
                                                    <p className="font-medium">{match.ofxTransaction.description}</p>
                                                    <p className="text-sm text-muted-foreground">{match.ofxTransaction.date}</p>
                                                </div>
                                                <p className="font-mono font-semibold">{formatCurrency(match.ofxTransaction.amount)}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Confirmation */}
                    {step === 'confirm' && (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">Importação Concluída!</h3>
                            <p className="text-muted-foreground">
                                {selectedMatches.size} transações foram importadas com sucesso.
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-border">
                    <button
                        onClick={step === 'review' ? () => setStep('upload') : handleClose}
                        className="px-4 py-2 text-sm font-medium hover:bg-foreground/5 rounded-lg transition-colors"
                        disabled={isProcessing}
                    >
                        {step === 'confirm' ? 'Fechar' : 'Voltar'}
                    </button>

                    {step === 'upload' && (
                        <button
                            onClick={handleUpload}
                            disabled={!selectedFile || !selectedAccountId || isProcessing}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? 'Processando...' : 'Processar'}
                        </button>
                    )}

                    {step === 'review' && (
                        <button
                            onClick={handleImport}
                            disabled={selectedMatches.size === 0 || isProcessing}
                            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isProcessing ? 'Importando...' : `Importar ${selectedMatches.size} Selecionadas`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
