"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";

export function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F1C]/80 backdrop-blur-lg border-b border-white/5">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                    Assistente Julia
                </Link>

                <div className="flex items-center gap-4">
                    <Link href="/login" className="text-sm text-zinc-400 hover:text-white transition-colors hidden sm:block">
                        Entrar
                    </Link>
                    <Link href="/cadastro">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6">
                            Criar conta
                            <MoveRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
