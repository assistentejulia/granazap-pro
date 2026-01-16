"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAccountFilter } from '@/hooks/use-account-filter';
import { useAccounts, BankAccount } from '@/hooks/use-accounts';

interface DashboardFilterContextType {
    accountId: string;
    setAccountId: (id: string) => void;
    startDate: string | null;
    setStartDate: (date: string | null) => void;
    endDate: string | null;
    setEndDate: (date: string | null) => void;
    resetFilters: () => void;
    isLoading: boolean;
    accounts: BankAccount[];
}

const DashboardFilterContext = createContext<DashboardFilterContextType | undefined>(undefined);

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
    const { filter: accountType } = useAccountFilter(); // 'pessoal' | 'pj'
    const { accounts, loading } = useAccounts(accountType);

    // States
    const [accountId, setAccountId] = useState<string>('all');

    // Default to current year
    const currentYear = new Date().getFullYear();
    const [startDate, setStartDate] = useState<string | null>(`${currentYear}-01-01`);
    const [endDate, setEndDate] = useState<string | null>(`${currentYear}-12-31`);

    // Set default account when accounts are loaded or accountType changes
    // Set default account when accounts are loaded or accountType changes
    useEffect(() => {
        // Always reset to 'all' when switching between PJ/Personal or loading new accounts
        // We do NOT auto-select the 'default' account to force "Todas as contas"
        setAccountId('all');
    }, [accountType]);

    // Reset function
    const resetFilters = () => {
        const defaultAccount = accounts.find(acc => acc.is_default);
        if (defaultAccount) {
            setAccountId(defaultAccount.id.toString());
        } else if (accounts.length > 0) {
            setAccountId(accounts[0].id.toString());
        } else {
            setAccountId('all');
        }

        const currentYear = new Date().getFullYear();
        setStartDate(`${currentYear}-01-01`);
        setEndDate(`${currentYear}-12-31`);
    };

    return (
        <DashboardFilterContext.Provider value={{
            accountId,
            setAccountId,
            startDate,
            setStartDate,
            endDate,
            setEndDate,
            resetFilters,
            isLoading: loading,
            accounts
        }}>
            {children}
        </DashboardFilterContext.Provider>
    );
}

export function useDashboardFilter() {
    const context = useContext(DashboardFilterContext);
    if (context === undefined) {
        throw new Error('useDashboardFilter must be used within a DashboardFilterProvider');
    }
    return context;
}
