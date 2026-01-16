"use client";

import * as React from "react"
import { Calendar as CalendarIcon, Filter, X } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

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
import { useDashboardFilter } from "@/contexts/dashboard-filter-context"
import { useLanguage } from "@/contexts/language-context"

export function DashboardFilters() {
    const {
        accountId,
        setAccountId,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        accounts
    } = useDashboardFilter()

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
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            {/* Account Filter */}
            <div className="w-full md:w-[250px]">
                <Select value={accountId} onValueChange={setAccountId}>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecione uma conta" />
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

            {/* Date Filter */}
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant={hasActiveDateFilter ? "default" : "outline"}
                        className={cn(
                            "w-full md:w-auto justify-start text-left font-normal",
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
    )
}
