"use client";

import * as React from "react"
import { Calendar as CalendarIcon, X } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useAccounts } from "@/hooks/use-accounts"
import { useCategories } from "@/hooks/use-categories"
import { useLanguage } from "@/contexts/language-context"
import { useAccountFilter } from '@/hooks/use-account-filter';

export type TransactionType = 'all' | 'receita' | 'despesa' | 'transferencia';

interface TransactionFiltersProps {
    accountId: string;
    setAccountId: (id: string) => void;
    categoryId: string;
    setCategoryId: (id: string) => void;
    startDate: string | null;
    setStartDate: (date: string | null) => void;
    endDate: string | null;
    setEndDate: (date: string | null) => void;
    type: 'receita' | 'despesa' | 'all'; // 'all' indicates general page
    showTypeFilter?: boolean;
    transactionType?: TransactionType;
    setTransactionType?: (type: TransactionType) => void;
}

export function TransactionFilters({
    accountId,
    setAccountId,
    categoryId,
    setCategoryId,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    type,
    showTypeFilter = false,
    transactionType,
    setTransactionType
}: TransactionFiltersProps) {
    const { filter: accountType } = useAccountFilter();
    const { accounts } = useAccounts(accountType);

    // Determine category type to fetch based on selected transaction type
    // If we are in "Receitas" or "Despesas" page (type prop), it's fixed.
    // If we are in "Extrato" (type='all'), we look at transactionType state.
    const categoryTypeToFetch = React.useMemo(() => {
        if (type === 'receita') return 'entrada';
        if (type === 'despesa') return 'saida';

        // General page logic (type === 'all')
        if (transactionType === 'receita') return 'entrada';
        if (transactionType === 'despesa') return 'saida';
        // 'transferencia' usually doesn't have standard categories or has specific ones, 
        // but for now 'undefined' fetches all which is safe fallback.
        return undefined;
    }, [type, transactionType]);

    const { categories } = useCategories(categoryTypeToFetch);

    const { t } = useLanguage()
    const [isOpen, setIsOpen] = React.useState(false)

    // Local state for the popover inputs
    const [tempStartDate, setTempStartDate] = React.useState("")
    const [tempEndDate, setTempEndDate] = React.useState("")

    // Sync local state when popover opens or filter changes
    React.useEffect(() => {
        if (startDate) setTempStartDate(startDate)
        else setTempStartDate("")

        if (endDate) setTempEndDate(endDate)
        else setTempEndDate("")
    }, [startDate, endDate, isOpen])

    const handleApply = () => {
        if (tempStartDate && tempEndDate) {
            setStartDate(tempStartDate)
            setEndDate(tempEndDate)
            setIsOpen(false)
        }
    }

    const handleClear = () => {
        setStartDate(null)
        setEndDate(null)
        setTempStartDate("")
        setTempEndDate("")
        setIsOpen(false)
    }

    const hasActiveDateFilter = !!startDate && !!endDate

    return (
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-card border border-border rounded-xl p-4">
            {/* Transaction Type Filter (Optional) */}
            {showTypeFilter && setTransactionType && (
                <div className="w-full md:w-[250px]">
                    <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                        Tipo de Transação
                    </label>
                    <Select value={transactionType} onValueChange={(val) => setTransactionType(val as TransactionType)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas</SelectItem>
                            <SelectItem value="receita">Receitas</SelectItem>
                            <SelectItem value="despesa">Despesas</SelectItem>
                            <SelectItem value="transferencia">Transferências</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Account Filter */}
            <div className="w-full md:w-[250px]">
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                    {t('filters.account')}
                </label>
                <Select value={accountId} onValueChange={setAccountId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Todas as contas" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as contas</SelectItem>
                        {accounts.map((account) => (
                            <SelectItem key={account.id} value={account.id.toString()}>
                                {account.nome}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Category Filter */}
            <div className="w-full md:w-[250px]">
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                    {t('table.category')}
                </label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todas as categorias</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                                {category.descricao}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Date Filter */}
            <div className="w-full md:w-auto">
                <label className="text-xs text-muted-foreground font-medium mb-1.5 block">
                    {t('table.date')}
                </label>
                <Popover open={isOpen} onOpenChange={setIsOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant={hasActiveDateFilter ? "default" : "outline"}
                            className={cn(
                                "w-full md:w-[280px] justify-start text-left font-normal",
                                !hasActiveDateFilter && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {hasActiveDateFilter ? (
                                <>
                                    {format(new Date(startDate + 'T12:00:00'), "dd/MM/yyyy")} -{" "}
                                    {format(new Date(endDate + 'T12:00:00'), "dd/MM/yyyy")}
                                </>
                            ) : (
                                "Filtrar por data"
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-4" align="start">
                        <div className="space-y-4 min-w-[300px]">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium leading-none">{t('filters.advanced')}</h4>
                                {hasActiveDateFilter && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 text-muted-foreground hover:text-foreground"
                                        onClick={handleClear}
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        {t('filters.clear')}
                                    </Button>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <span className="text-xs text-muted-foreground font-medium">{t('filters.startDate')}</span>
                                        <input
                                            type="date"
                                            value={tempStartDate}
                                            onChange={(e) => setTempStartDate(e.target.value)}
                                            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:light] dark:[color-scheme:dark]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <span className="text-xs text-muted-foreground font-medium">{t('filters.endDate')}</span>
                                        <input
                                            type="date"
                                            value={tempEndDate}
                                            onChange={(e) => setTempEndDate(e.target.value)}
                                            className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [color-scheme:light] dark:[color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <Button size="sm" onClick={handleApply} disabled={!tempStartDate || !tempEndDate}>
                                    {t('filters.apply')}
                                </Button>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}
