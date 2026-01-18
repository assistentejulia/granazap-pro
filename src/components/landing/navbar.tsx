"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LandingLogo } from "@/components/landing/logo";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="#inicio" className="flex items-center gap-3 group">
                    <LandingLogo />
                    <span className="text-xl font-bold bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-400 dark:to-blue-400 bg-clip-text text-transparent transition-all group-hover:opacity-80">
                        Assistente Julia
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="#inicio" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors self-center">
                        Início
                    </Link>
                    <Link href="#recursos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors self-center">
                        Funcionalidades
                    </Link>
                    <Link href="#investimentos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors self-center">
                        Investimentos
                    </Link>
                    <Link href="#depoimentos" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors self-center">
                        Depoimentos
                    </Link>
                    <Link href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors self-center">
                        Planos
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <a href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Entrar
                    </a>
                    <Link href="/cadastro" prefetch={false}>
                        <Button size="sm" className="bg-[#25D366] hover:bg-[#128C7E] text-white rounded-full px-4 sm:px-6 shadow-lg shadow-green-500/20">
                            <span className="hidden sm:inline">Começar Agora</span>
                            <span className="sm:hidden">Começar</span>
                            <MoveRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
