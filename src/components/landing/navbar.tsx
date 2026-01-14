"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Assistente Julia
                </Link>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                        Entrar
                    </Link>
                    <Link href="/cadastro">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-4 sm:px-6">
                            <span className="hidden sm:inline">Criar conta</span>
                            <span className="sm:hidden">Criar</span>
                            <MoveRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
