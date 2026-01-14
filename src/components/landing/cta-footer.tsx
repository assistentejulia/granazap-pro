"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function CtaFooter() {
    return (
        <>
            {/* Final CTA */}
            <section className="py-24 bg-gradient-to-b from-[#0F172A] to-[#0A0F1C] border-t border-white/5">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
                        Assuma o controle da sua vida financeira.
                    </h2>
                    <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                        Leva menos de 2 minutos para começar. Sem cartão de crédito. Sem compromisso.
                    </p>

                    <Link href="/cadastro">
                        <Button size="lg" className="h-14 px-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-lg shadow-xl shadow-blue-600/20">
                            Criar conta gratuita
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#05080F] py-12 border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div className="col-span-1 md:col-span-2">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                                Assistente Julia
                            </span>
                            <p className="mt-4 text-zinc-500 text-sm max-w-xs">
                                Sua assistente financeira inteligente. Organize, planeje e prospere com simplicidade.
                            </p>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-4">Produto</h4>
                            <ul className="space-y-2 text-sm text-zinc-500">
                                <li><Link href="#" className="hover:text-blue-400">Funcionalidades</Link></li>
                                <li><Link href="#" className="hover:text-blue-400">Preços</Link></li>
                                <li><Link href="#" className="hover:text-blue-400">Para Empresas</Link></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="text-white font-medium mb-4">Legal</h4>
                            <ul className="space-y-2 text-sm text-zinc-500">
                                <li><Link href="/termos" className="hover:text-blue-400">Termos de Uso</Link></li>
                                <li><Link href="/privacidade" className="hover:text-blue-400">Privacidade</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="pt-8 border-t border-white/5 text-center text-xs text-zinc-600">
                        © {new Date().getFullYear()} Assistente Julia. Todos os direitos reservados.
                    </div>
                </div>
            </footer>
        </>
    );
}
