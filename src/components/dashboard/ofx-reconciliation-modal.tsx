"use client";

import { useState, useRef } from "react";
import { X, Upload, CheckCircle2, AlertCircle, FileText, ArrowRight, ArrowLeft, Edit2, Tag, ArrowUpRight, ArrowDownRight, Plus, Check } from "lucide-react";
import { useOFXImport } from "@/hooks/use-ofx-import";
import { useAccounts } from "@/hooks/use-accounts";
import { useCategories } from "@/hooks/use-categories";
import { useCurrency } from "@/contexts/currency-context";
import { useLanguage } from "@/contexts/language-context";
import { useUser } from "@/hooks/use-user";
import { createClient } from "@/lib/supabase/client";
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
    const { categories } = useCategories();
    const { profile } = useUser();
    const { uploadOFX, importTransactions, reset, isProcessing, error, groupedResults, ofxData } = useOFXImport();

    const [step, setStep] = useState<Step>('upload');
    const [selectedAccountId, setSelectedAccountId] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [selectedMatches, setSelectedMatches] = useState<Set<string>>(new Set());
    const [editedDescriptions, setEditedDescriptions] = useState<Map<string, string>>(new Map());
    const [selectedCategories, setSelectedCategories] = useState<Map<string, string>>(new Map());
    const [editingId, setEditingId] = useState<string | null>(null);

    // Category creation state
    const [creatingCategoryForTxId, setCreatingCategoryForTxId] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [isCreatingCategory, setIsCreatingCategory] = useState(false);
    const [localError, setLocalError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleClose = () => {
        reset();
        setStep('upload');
        setSelectedAccountId('');
        setSelectedFile(null);
        setSelectedMatches(new Set());
        setEditedDescriptions(new Map());
        setSelectedCategories(new Map());
        setEditingId(null);
        setLocalError(null);
        onClose();
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setLocalError(null);
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

    // Helper functions for inline editing
    const updateDescription = (txId: string, newDescription: string) => {
        const newMap = new Map(editedDescriptions);
        newMap.set(txId, newDescription);
        setEditedDescriptions(newMap);
    };

    const updateCategory = (txId: string, categoryId: string) => {
        const newMap = new Map(selectedCategories);
        newMap.set(txId, categoryId);
        setSelectedCategories(newMap);
    };

    const getDisplayDescription = (txId: string, originalDescription: string) => {
        return editedDescriptions.get(txId) || originalDescription;
    };

    const getDisplayCategory = (txId: string) => {
        return selectedCategories.get(txId) || '';
    };

    const handleCreateCategory = async (txId: string, tipo: 'entrada' | 'saida') => {
        if (!newCategoryName.trim() || !profile?.id) return;

        try {
            setIsCreatingCategory(true);
            const supabase = createClient();

            // Insert new category
            const { data, error } = await supabase
                .from('categoria_trasacoes')
                .insert({
                    descricao: newCategoryName.trim(),
                    tipo: tipo === 'entrada' ? 'entrada' : 'saida', // 'entrada' | 'saida'
                    usuario_id: profile.id,
                    tipo_conta: 'pessoal', // Default for now, could be dynamic
                    icon_key: 'FileText' // Default icon
                })
                .select()
                .single();

            if (error) throw error;

            if (data) {
                // Dispatch event to refresh categories list
                window.dispatchEvent(new Event('categoriesChanged'));

                // Select the new category for this transaction
                updateCategory(txId, data.id.toString());

                // Reset creation state
                setCreatingCategoryForTxId(null);
                setNewCategoryName("");
            }
        } catch (error) {
            console.error('Error creating category:', error);
            // Optionally show error toast
        } finally {
            setIsCreatingCategory(false);
        }
    };


    const handleImport = async () => {
        const matchesToImport = [
            ...groupedResults.new,
            ...groupedResults.suggestions,
        ].filter(match => selectedMatches.has(match.ofxTransaction.id));

        const result = await importTransactions(
            matchesToImport,
            selectedAccountId,
            undefined, // defaultCategoryId
            editedDescriptions, // Pass edited descriptions
            selectedCategories // Pass selected categories
        );

        if (result.success) {
            window.dispatchEvent(new CustomEvent('accountsChanged'));
            window.dispatchEvent(new CustomEvent('transactionsChanged'));
            setStep('confirm');
            onSuccess?.();
        }
    };

    const stats = getMatchStatistics([...groupedResults.exact, ...groupedResults.suggestions, ...groupedResults.new]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-card border border-border rounded-xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden flex flex-col">
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
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                                            const file = e.dataTransfer.files[0];
                                            if (file.name.endsWith('.ofx')) {
                                                setSelectedFile(file);
                                                setLocalError(null);
                                            } else {
                                                setLocalError('Por favor, selecione um arquivo .ofx válido');
                                            }
                                        }
                                    }}
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

                            {(error || localError) && (
                                <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                                    <AlertCircle className="w-5 h-5 text-red-500" />
                                    <p className="text-sm text-red-500">{error || localError}</p>
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
                                    <p className="text-sm text-yellow-600">Possíveis Duplicatas</p>
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
                                    <h3 className="text-lg font-semibold mb-1 flex items-center gap-2">
                                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                                        Possíveis Duplicatas ({groupedResults.suggestions.length})
                                    </h3>
                                    <div className="mb-3 px-3 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm text-yellow-600/90">
                                        <p>
                                            <strong>Atenção:</strong> Encontramos transações no sistema com data e valor similares a estes itens.
                                        </p>
                                        <p className="mt-1">
                                            Isso geralmente indica que a transação já foi registrada anteriormente.
                                            Selecione apenas se tiver certeza de que se trata de um novo lançamento (ex: duas compras de mesmo valor no mesmo dia).
                                        </p>
                                    </div>
                                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                        {groupedResults.suggestions.map((match) => (
                                            <TransactionRow
                                                key={match.ofxTransaction.id}
                                                match={match}
                                                isSelected={selectedMatches.has(match.ofxTransaction.id)}
                                                onToggle={() => toggleMatch(match.ofxTransaction.id)}
                                                isEditing={editingId === match.ofxTransaction.id}
                                                onEditStart={() => setEditingId(match.ofxTransaction.id)}
                                                onEditEnd={() => setEditingId(null)}
                                                displayDescription={getDisplayDescription(match.ofxTransaction.id, match.ofxTransaction.description)}
                                                onUpdateDescription={(val) => updateDescription(match.ofxTransaction.id, val)}
                                                selectedCategoryId={getDisplayCategory(match.ofxTransaction.id)}
                                                onUpdateCategory={(val) => updateCategory(match.ofxTransaction.id, val)}
                                                isCreating={creatingCategoryForTxId === match.ofxTransaction.id}
                                                newCategoryName={newCategoryName}
                                                onNewCategoryNameChange={setNewCategoryName}
                                                onCreateCategory={(tipo) => handleCreateCategory(match.ofxTransaction.id, tipo)}
                                                onStartCreatingCategory={() => {
                                                    setCreatingCategoryForTxId(match.ofxTransaction.id);
                                                    setNewCategoryName("");
                                                }}
                                                onCancelCreatingCategory={() => {
                                                    setCreatingCategoryForTxId(null);
                                                    setNewCategoryName("");
                                                }}
                                                isCreatingCategory={isCreatingCategory}
                                                formatCurrency={formatCurrency}
                                                categories={categories}
                                                showConfidence={true}
                                            />
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
                                    <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                        {groupedResults.new.map((match) => (
                                            <TransactionRow
                                                key={match.ofxTransaction.id}
                                                match={match}
                                                isSelected={selectedMatches.has(match.ofxTransaction.id)}
                                                onToggle={() => toggleMatch(match.ofxTransaction.id)}
                                                isEditing={editingId === match.ofxTransaction.id}
                                                onEditStart={() => setEditingId(match.ofxTransaction.id)}
                                                onEditEnd={() => setEditingId(null)}
                                                displayDescription={getDisplayDescription(match.ofxTransaction.id, match.ofxTransaction.description)}
                                                onUpdateDescription={(val) => updateDescription(match.ofxTransaction.id, val)}
                                                selectedCategoryId={getDisplayCategory(match.ofxTransaction.id)}
                                                onUpdateCategory={(val) => updateCategory(match.ofxTransaction.id, val)}
                                                isCreating={creatingCategoryForTxId === match.ofxTransaction.id}
                                                newCategoryName={newCategoryName}
                                                onNewCategoryNameChange={setNewCategoryName}
                                                onCreateCategory={(tipo) => handleCreateCategory(match.ofxTransaction.id, tipo)}
                                                onStartCreatingCategory={() => {
                                                    setCreatingCategoryForTxId(match.ofxTransaction.id);
                                                    setNewCategoryName("");
                                                }}
                                                onCancelCreatingCategory={() => {
                                                    setCreatingCategoryForTxId(null);
                                                    setNewCategoryName("");
                                                }}
                                                isCreatingCategory={isCreatingCategory}
                                                formatCurrency={formatCurrency}
                                                categories={categories}
                                                showConfidence={false}
                                            />
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

// Transaction Row Component for consistent rendering
interface TransactionRowProps {
    match: MatchResult;
    isSelected: boolean;
    onToggle: () => void;
    isEditing: boolean;
    onEditStart: () => void;
    onEditEnd: () => void;
    displayDescription: string;
    onUpdateDescription: (val: string) => void;
    selectedCategoryId: string;
    onUpdateCategory: (val: string) => void;
    isCreating: boolean;
    newCategoryName: string;
    onNewCategoryNameChange: (val: string) => void;
    onCreateCategory: (tipo: 'entrada' | 'saida') => void;
    onStartCreatingCategory: () => void;
    onCancelCreatingCategory: () => void;
    isCreatingCategory: boolean;
    formatCurrency: (val: number) => string;
    categories: any[];
    showConfidence?: boolean;
}

function TransactionRow({
    match,
    isSelected,
    onToggle,
    isEditing,
    onEditStart,
    onEditEnd,
    displayDescription,
    onUpdateDescription,
    selectedCategoryId,
    onUpdateCategory,
    isCreating,
    newCategoryName,
    onNewCategoryNameChange,
    onCreateCategory,
    onStartCreatingCategory,
    onCancelCreatingCategory,
    isCreatingCategory,
    formatCurrency,
    categories,
    showConfidence
}: TransactionRowProps) {
    // Visual distinction
    const isCredit = match.ofxTransaction.type === 'CREDIT';
    const amountColor = isCredit ? 'text-green-600' : 'text-red-600';
    const AmountIcon = isCredit ? ArrowUpRight : ArrowDownRight;
    // For suggestions (potential duplicates), use yellow border to indicate warning, otherwise use green/red based on type
    const boxBorder = showConfidence ? 'border-yellow-500/20' : (isCredit ? 'border-green-500/20' : 'border-red-500/20');
    const bgClass = showConfidence ? 'bg-yellow-500/5' : 'bg-card';

    // Filter categories based on transaction type and remove "Saldo Inicial"
    const allowedType = isCredit ? 'entrada' : 'saida';
    const filteredCategories = categories.filter(c =>
        (c.tipo === 'ambos' || c.tipo === allowedType) &&
        c.descricao !== 'Saldo Inicial'
    );

    return (
        <div className={`p-3 border ${boxBorder} ${bgClass} rounded-lg space-y-2`}>
            {/* First row: Checkbox, Description, Amount */}
            <div className="flex items-start gap-3">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggle}
                    className="w-4 h-4 mt-1"
                />
                <div className="flex-1 space-y-1">
                    {/* Description - Editable */}
                    {isEditing ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={displayDescription}
                                onChange={(e) => onUpdateDescription(e.target.value)}
                                className="flex-1 px-2 py-1 text-sm bg-background border border-primary/40 rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                                autoFocus
                            />
                            <button
                                onClick={onEditEnd}
                                className="px-2 py-1 text-xs bg-primary/20 text-primary rounded hover:bg-primary/30"
                            >
                                Salvar
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            {/* REMOVED truncate to allow text wrapping */}
                            <p className="font-medium flex-1 break-words">{displayDescription}</p>
                            <button
                                onClick={onEditStart}
                                className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
                                title="Editar descrição"
                            >
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{match.ofxTransaction.date}</span>
                        {showConfidence && (
                            <span className="text-yellow-600 font-medium">• {match.confidence}% similar</span>
                        )}
                        {isCredit ? (
                            <span className="flex items-center text-green-500 text-xs bg-green-500/10 px-1.5 py-0.5 rounded">
                                <ArrowUpRight className="w-3 h-3 mr-1" /> Receita
                            </span>
                        ) : (
                            <span className="flex items-center text-red-500 text-xs bg-red-500/10 px-1.5 py-0.5 rounded">
                                <ArrowDownRight className="w-3 h-3 mr-1" /> Despesa
                            </span>
                        )}
                    </div>
                </div>
                <div className={`font-mono font-semibold flex items-center ${amountColor}`}>
                    <AmountIcon className="w-4 h-4 mr-1" />
                    {formatCurrency(match.ofxTransaction.amount)}
                </div>
            </div>

            {/* Second row: Category selector */}
            <div className="flex items-center gap-2 pl-7">
                <Tag className="w-4 h-4 text-muted-foreground" />

                {isCreating ? (
                    <div className="flex items-center gap-2 flex-1 animate-in fade-in slide-in-from-left-2">
                        <input
                            type="text"
                            value={newCategoryName}
                            onChange={(e) => onNewCategoryNameChange(e.target.value)}
                            placeholder="Nome da nova categoria..."
                            className="flex-1 px-2 py-1 text-sm bg-background border border-primary/40 rounded focus:outline-none focus:ring-2 focus:ring-primary/50 h-8"
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') onCreateCategory(allowedType);
                                if (e.key === 'Escape') onCancelCreatingCategory();
                            }}
                        />
                        <button
                            onClick={() => onCreateCategory(allowedType)}
                            disabled={!newCategoryName.trim() || isCreatingCategory}
                            className="p-1.5 bg-green-500/20 text-green-500 rounded hover:bg-green-500/30 disabled:opacity-50"
                            title="Salvar Categoria"
                        >
                            {isCreatingCategory ? <span className="animate-spin">⌛</span> : <Check className="w-4 h-4" />}
                        </button>
                        <button
                            onClick={onCancelCreatingCategory}
                            className="p-1.5 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30"
                            title="Cancelar"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ) : (
                    <select
                        value={selectedCategoryId}
                        onChange={(e) => {
                            if (e.target.value === 'NEW') {
                                onStartCreatingCategory();
                            } else {
                                onUpdateCategory(e.target.value);
                            }
                        }}
                        className="flex-1 px-2 py-1 text-sm bg-background/50 border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 h-8"
                    >
                        <option value="">Sem categoria (usar padrão)</option>
                        <option value="NEW" className="font-semibold text-primary">
                            + Criar Nova Categoria
                        </option>
                        <optgroup label="Minhas Categorias">
                            {filteredCategories.map((cat) => (
                                <option key={cat.id} value={cat.id.toString()}>
                                    {cat.descricao}
                                </option>
                            ))}
                        </optgroup>
                    </select>
                )}
            </div>
        </div>
    );
}
