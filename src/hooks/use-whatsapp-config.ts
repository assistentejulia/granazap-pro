"use client";

import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/lib/supabase/client';

export interface WhatsAppConfig {
  whatsapp_enabled: boolean;
  whatsapp_contact_text: string;
  video_url_instalacao: string | null;
  whatsapp_contact_url?: string;
  whatsapp_suporte_url?: string;
}

export function useWhatsAppConfig() {
  return useQuery<WhatsAppConfig>({
    queryKey: ['whatsapp-config'],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('configuracoes_sistema')
        .select('whatsapp_enabled, whatsapp_contact_text, video_url_instalacao, whatsapp_contact_url, whatsapp_suporte_url')
        .eq('id', 1)
        .single();
      
      if (error) throw error;
      return data as WhatsAppConfig;
    }
  });
}
