import { OfertaHero } from "@/components/landing/oferta-hero";
import { ComparisonPricing } from "@/components/landing/comparison-pricing";
import { LandingFAQ } from "@/components/landing/faq";
import { CtaFooter } from "@/components/landing/cta-footer";
import { Shield, Zap, TrendingUp, Cpu, Lock, Clock } from "lucide-react";

export default function OfertaPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-background selection:bg-green-500/30">
            {/* Standardized Hero */}
            <OfertaHero />

            {/* Differential / Value Section - Focused on Features */}
            <section className="py-12 bg-zinc-50 dark:bg-zinc-950/50 border-y border-zinc-200 dark:border-zinc-800">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs">
                        <div className="space-y-1">
                            <div className="text-3xl font-black text-green-600 dark:text-green-500 flex justify-center items-center gap-2">
                                <Cpu className="w-6 h-6" /> IA
                            </div>
                            <div>Inteligência Pura</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl font-black text-blue-600 dark:text-blue-500 flex justify-center items-center gap-2">
                                <Lock className="w-6 h-6" /> 256
                            </div>
                            <div>Criptografia SSL</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl font-black text-green-600 dark:text-green-500 flex justify-center items-center gap-2">
                                <Shield className="w-6 h-6" /> 100%
                            </div>
                            <div>Privacidade</div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-3xl font-black text-blue-600 dark:text-blue-500 flex justify-center items-center gap-2">
                                <Clock className="w-6 h-6" /> 24/7
                            </div>
                            <div>Disponível</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Conversion Point: Pricing Comparison */}
            <ComparisonPricing />

            {/* Feature Highlights - Authority through Functionality */}
            <section className="py-20 bg-zinc-50 dark:bg-zinc-900/30">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-12 text-zinc-900 dark:text-white">A Escolha de quem busca eficiência financeira</h2>
                    <div className="grid md:grid-cols-3 gap-8 text-left">
                        <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <Zap className="w-10 h-10 text-yellow-500 mb-6" />
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Agilidade no WhatsApp</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">Registre gastos em segundos apenas conversando com a Júlia. Nada de aplicativos lentos.</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <TrendingUp className="w-10 h-10 text-green-600 mb-6" />
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Economia Inteligente</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">O plano anual foi desenhado para quem entende que o tempo poupado é o lucro do futuro.</p>
                        </div>
                        <div className="p-8 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
                            <Shield className="w-10 h-10 text-blue-600 mb-6" />
                            <h3 className="text-xl font-bold mb-3 text-zinc-900 dark:text-white">Controle Absoluto</h3>
                            <p className="text-zinc-600 dark:text-zinc-400">Tenha uma visão clara de onde seu dinheiro está indo com relatórios gerados automaticamente.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Common Doubts */}
            <LandingFAQ />

            {/* Final Call to Action */}
            <section className="py-24 bg-gradient-to-br from-green-600 to-emerald-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/grid.svg')] bg-center pointer-events-none" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">COMECE SUA JORNADA <br /> RUMO À LIBERDADE</h2>
                    <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto font-medium">Assuma o controle definitivo da sua vida financeira. Escolha o plano anual e economize desde o primeiro dia.</p>
                    <div className="flex justify-center">
                        <a href="#pricing-compare" className="h-20 px-12 rounded-full bg-white text-green-600 text-2xl font-black flex items-center justify-center hover:scale-105 transition-all shadow-2xl shadow-green-900/40">
                            QUERO COMEÇAR
                        </a>
                    </div>
                </div>
            </section>

            {/* Simplified Footer */}
            <CtaFooter />
        </main>
    );
}
