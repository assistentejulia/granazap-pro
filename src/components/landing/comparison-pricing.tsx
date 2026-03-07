"use client";

import { motion } from "framer-motion";
import { Check, Crown, ArrowRight, Zap, TrendingUp, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlans } from "@/hooks/use-plans";

export function ComparisonPricing() {
    const { plans, loading } = usePlans();

    if (loading) return null;

    const monthlyPlan = plans.find(p => p.tipo_periodo === 'mensal' && !p.nome.toLowerCase().includes('enterprise'));
    const annualPlan = plans.find(p => p.tipo_periodo === 'anual' && !p.nome.toLowerCase().includes('enterprise'));

    if (!monthlyPlan || !annualPlan) return null;

    // Calculate savings
    const monthlyTotalInYear = monthlyPlan.valor * 12;
    const annualSavings = monthlyTotalInYear - annualPlan.valor;
    const freeMonths = Math.floor(annualSavings / monthlyPlan.valor);

    const trackClick = () => {
        if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'InitiateCheckout');
        }
    };

    return (
        <section id="pricing-compare" className="py-24 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-6 text-zinc-900 dark:text-white">A Matemática é simples: <br /> <span className="text-green-600 dark:text-green-500">Qual o melhor pra você?</span></h2>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 flex items-center justify-center gap-2">
                        <Calculator className="w-6 h-6 text-green-600" />
                        Veja quanto você economiza ao escolher o Plano Anual
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Monthly Card */}
                    <motion.div
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-8 rounded-3xl flex flex-col shadow-sm"
                    >
                        <span className="text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest text-xs mb-4">Plano Flexível</span>
                        <h3 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Mensal</h3>
                        <div className="flex items-baseline gap-1 mb-6">
                            <span className="text-2xl font-bold text-zinc-900 dark:text-white">R$</span>
                            <span className="text-5xl font-extrabold text-zinc-900 dark:text-white">{monthlyPlan.valor.toFixed(2).replace('.', ',')}</span>
                            <span className="text-zinc-500 dark:text-zinc-400 ml-1">/mês</span>
                        </div>
                        
                        <div className="space-y-4 mb-8 flex-1">
                            {['Acesso via WhatsApp', 'Dashboard Web', 'Relatórios Mensais', 'Cancelamento a qualquer momento'].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Check className="w-5 h-5 text-zinc-400" />
                                    <span className="text-zinc-600 dark:text-zinc-400">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            variant="outline" 
                            className="h-14 rounded-2xl text-lg border-2 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all text-zinc-900 dark:text-white"
                            onClick={() => {
                                trackClick();
                                window.location.href = monthlyPlan.link_checkout || '#';
                            }}
                        >
                            Quero o Mensal
                        </Button>
                        <p className="text-center text-xs text-zinc-500 mt-4">Investimento total no ano: R$ {monthlyTotalInYear.toFixed(2).replace('.', ',')}</p>
                    </motion.div>

                    {/* Annual Card */}
                    <motion.div
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.02 }}
                        className="relative bg-white dark:bg-zinc-900 border-2 border-green-500 p-8 rounded-3xl flex flex-col shadow-2xl shadow-green-500/10"
                    >
                        <div className="absolute -top-4 right-8 bg-green-600 text-white text-xs font-black px-4 py-2 rounded-full uppercase tracking-tighter">
                            A Escolha Inteligente
                        </div>

                        <div className="mb-4">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 text-xs font-bold uppercase">
                                <TrendingUp className="w-3 h-3" />
                                Recomendado por Investidores
                            </div>
                        </div>

                        <h3 className="text-3xl font-bold mb-2 text-zinc-900 dark:text-white">Anual</h3>
                        <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-2xl font-bold text-zinc-900 dark:text-white">R$</span>
                            <span className="text-5xl font-extrabold text-zinc-900 dark:text-white">{annualPlan.valor.toFixed(2).replace('.', ',')}</span>
                            <span className="text-zinc-500 dark:text-zinc-400 ml-1">/ano</span>
                        </div>
                        <p className="text-green-600 dark:text-green-400 font-bold text-sm mb-6 flex items-center gap-1">
                            <Crown className="w-4 h-4" />
                            ECONOMIA DE R$ {annualSavings.toFixed(2).replace('.', ',')} POR ANO
                        </p>

                        <div className="space-y-4 mb-8 flex-1">
                            {[
                                'Tudo do mensal +',
                                'Prioridade em Suporte',
                                'Novas funcionalidades em primeira mão',
                                <strong key="gift" className="text-green-700 dark:text-green-300">{freeMonths} Meses inteiramente GRÁTIS</strong>
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <Check className="w-6 h-6 text-green-600 dark:text-green-500 stroke-[3px]" />
                                    <span className="text-zinc-700 dark:text-zinc-200">{item}</span>
                                </div>
                            ))}
                        </div>

                        <Button 
                            className="h-16 rounded-2xl text-xl font-black bg-gradient-to-r from-green-600 via-green-500 to-green-600 hover:scale-105 shadow-xl shadow-green-600/20 group transition-all text-white"
                            onClick={() => {
                                trackClick();
                                window.location.href = annualPlan.link_checkout || '#';
                            }}
                        >
                            APROVEITAR 3 MESES GRÁTIS
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        <p className="text-center text-xs text-zinc-500 mt-4">Acesso liberado por 1 ano inteiro imediatamente.</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
