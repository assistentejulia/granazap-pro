"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { LandingLogo } from "@/components/landing/logo";

export function Navbar() {
    return (
        <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
            <nav className="pointer-events-auto h-16 max-w-5xl w-full bg-[#030712]/60 backdrop-blur-2xl border border-white/10 rounded-full px-6 flex items-center justify-between shadow-2xl shadow-black/50">
                <div className="flex items-center gap-2 lg:gap-8">
                    <Link href="#inicio" className="flex items-center gap-2 group shrink-0">
                        <LandingLogo className="w-32 h-10 sm:w-48 sm:h-14" />
                    </Link>

                    <div className="hidden lg:flex items-center gap-8">
                        {[
                            { name: "Início", href: "#inicio" },
                            { name: "Recursos", href: "#recursos" },
                            { name: "Como Funciona", href: "#investimentos" },
                            { name: "Planos", href: "#pricing" },
                        ].map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-green-400 transition-colors relative group py-1"
                            >
                                {link.name}
                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-green-500 transition-all group-hover:w-full" />
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="hidden sm:block scale-90">
                        <ThemeToggle />
                    </div>

                    <a href="/login" className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors">
                        Entrar
                    </a>

                    <Link href="/cadastro" prefetch={false} className="shrink-0">
                        <Button size="sm" className="h-9 px-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-green-500/10 active:scale-95 transition-all border-none">
                            Começar
                        </Button>
                    </Link>
                </div>
            </nav>
        </header>
    );
}
