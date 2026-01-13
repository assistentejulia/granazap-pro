import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Buscar configurações do sistema
    const { data, error } = await supabase.rpc('get_system_settings');
    
    if (error) {
      console.error('Error fetching system settings:', error);
      // Retornar manifest padrão em caso de erro
      return NextResponse.json(getDefaultManifest());
    }
    
    const settings = Array.isArray(data) ? data[0] : data;
    
    if (!settings) {
      return NextResponse.json(getDefaultManifest());
    }
    
    // Construir manifest dinâmico
    const manifest = {
      name: `${settings.app_name || 'GranaZap'} - Gestão Financeira`,
      short_name: settings.app_name || 'GranaZap',
      description: `Sistema completo de gestão financeira pessoal e empresarial - ${settings.app_name || 'GranaZap'}`,
      start_url: '/dashboard',
      display: 'standalone',
      background_color: '#ffffff',
      theme_color: settings.primary_color || '#22C55E',
      orientation: 'portrait-primary',
      scope: '/',
      icons: buildIcons(settings),
      screenshots: [
        {
          src: '/screenshot-mobile.png',
          sizes: '390x844',
          type: 'image/png',
          form_factor: 'narrow'
        },
        {
          src: '/screenshot-desktop.png',
          sizes: '1920x1080',
          type: 'image/png',
          form_factor: 'wide'
        }
      ],
      categories: ['finance', 'productivity', 'business'],
      shortcuts: [
        {
          name: 'Nova Receita',
          short_name: 'Receita',
          description: 'Adicionar nova receita',
          url: '/dashboard/receitas?action=new',
          icons: [{ 
            src: settings.pwa_icon_192_url || settings.favicon_url || '/icon-192.png', 
            sizes: '192x192' 
          }]
        },
        {
          name: 'Nova Despesa',
          short_name: 'Despesa',
          description: 'Adicionar nova despesa',
          url: '/dashboard/despesas?action=new',
          icons: [{ 
            src: settings.pwa_icon_192_url || settings.favicon_url || '/icon-192.png', 
            sizes: '192x192' 
          }]
        },
        {
          name: 'Relatórios',
          short_name: 'Relatórios',
          description: 'Ver relatórios financeiros',
          url: '/dashboard/relatorios',
          icons: [{ 
            src: settings.pwa_icon_192_url || settings.favicon_url || '/icon-192.png', 
            sizes: '192x192' 
          }]
        }
      ],
      share_target: {
        action: '/dashboard/transacoes',
        method: 'GET',
        params: {
          title: 'title',
          text: 'text'
        }
      }
    };
    
    return NextResponse.json(manifest, {
      headers: {
        'Content-Type': 'application/manifest+json',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    });
  } catch (error) {
    console.error('Error generating manifest:', error);
    return NextResponse.json(getDefaultManifest());
  }
}

function buildIcons(settings: any) {
  const icons = [];
  
  // Ícone 192x192
  if (settings.pwa_icon_192_url) {
    icons.push({
      src: settings.pwa_icon_192_url,
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    });
  } else if (settings.favicon_url) {
    // Fallback para favicon
    icons.push({
      src: settings.favicon_url,
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    });
  } else {
    // Fallback para arquivo estático
    icons.push({
      src: '/icon-192.png',
      sizes: '192x192',
      type: 'image/png',
      purpose: 'any maskable'
    });
  }
  
  // Ícone 512x512
  if (settings.pwa_icon_512_url) {
    icons.push({
      src: settings.pwa_icon_512_url,
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    });
  } else if (settings.favicon_url) {
    // Fallback para favicon
    icons.push({
      src: settings.favicon_url,
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    });
  } else {
    // Fallback para arquivo estático
    icons.push({
      src: '/icon-512.png',
      sizes: '512x512',
      type: 'image/png',
      purpose: 'any maskable'
    });
  }
  
  // Apple Touch Icon
  if (settings.apple_touch_icon_url) {
    icons.push({
      src: settings.apple_touch_icon_url,
      sizes: '180x180',
      type: 'image/png'
    });
  } else if (settings.favicon_url) {
    // Fallback para favicon
    icons.push({
      src: settings.favicon_url,
      sizes: '180x180',
      type: 'image/png'
    });
  } else {
    // Fallback para arquivo estático
    icons.push({
      src: '/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png'
    });
  }
  
  return icons;
}

function getDefaultManifest() {
  return {
    name: 'GranaZap - Gestão Financeira',
    short_name: 'GranaZap',
    description: 'Sistema completo de gestão financeira pessoal e empresarial',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#22C55E',
    orientation: 'portrait-primary',
    scope: '/',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable'
      },
      {
        src: '/apple-touch-icon.png',
        sizes: '180x180',
        type: 'image/png'
      }
    ],
    categories: ['finance', 'productivity', 'business']
  };
}
