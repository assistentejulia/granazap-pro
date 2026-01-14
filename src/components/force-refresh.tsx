"use client";

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export function ForceRefresh() {
    const queryClient = useQueryClient();
    const router = useRouter();

    useEffect(() => {
        // 1. Force invalidate react-query cache for user profile
        queryClient.invalidateQueries({ queryKey: ['user-profile'] });

        // 2. Clear localStorage cache
        try {
            localStorage.removeItem('user_profile_cache');
        } catch (e) {
            console.error('Error clearing localStorage', e);
        }

        // 3. Force refresh the page data
        router.refresh();

    }, [queryClient, router]);

    return null;
}
