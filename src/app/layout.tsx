import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import { CurrencyProvider } from "@/contexts/currency-context";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { BrandingProvider } from "@/contexts/branding-context";
import { BrandingStyleInjector } from "@/components/branding-style-injector";
import { DynamicMetadata } from "@/components/dynamic-metadata";
import { PWARegister } from "@/components/pwa-register";
import { createClient } from "@/lib/supabase/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const supabase = await createClient();

  try {
    const { data } = await supabase.rpc('get_system_settings').single();

    const appName = (data as any)?.app_name || 'Assistente Julia';
    const faviconUrl = (data as any)?.favicon_url || (data as any)?.app_logo_url;
    const primaryColor = (data as any)?.primary_color || '#22C55E';

    return {
      title: appName,
      description: `Sistema de gestão financeira - ${appName}`,
      manifest: '/api/manifest',
      appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: appName,
      },
      formatDetection: {
        telephone: false,
      },
      themeColor: primaryColor,
      viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
      },
      icons: faviconUrl ? {
        icon: faviconUrl,
        apple: faviconUrl,
      } : undefined,
    };
  } catch (error) {
    return {
      title: 'Assistente Julia',
      description: 'Sistema de gestão financeira',
      manifest: '/api/manifest',
      appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Assistente Julia',
      },
      themeColor: '#22C55E',
      viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1,
        userScalable: false,
      },
    };
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <BrandingStyleInjector />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <LanguageProvider>
              <CurrencyProvider>
                <BrandingProvider>
                  <DynamicMetadata />
                  <PWARegister />
                  {children}
                </BrandingProvider>
              </CurrencyProvider>
            </LanguageProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
