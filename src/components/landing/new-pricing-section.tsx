"use client";

import { motion } from "framer-motion";
import { Check, Star, Zap, Shield, Crown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlans } from "@/hooks/use-plans";

export function NewPricingSection() {
    const { plans, loading } = usePlans();

    if (loading) {
        return (
            <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-[#1a0b2e] via-[#0A0F1C] to-black">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-center">
                        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                </div>
            </section>
        );
    }

    const activePlans = plans.filter(plan => plan.ativo);

    return (
        <section id="pricing" className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-[#1a0b2e] via-[#0A0F1C] to-black">
            {/* Background Elements */}
            <div className="absolute inset-0">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />
                <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6 backdrop-blur-sm">
                        <Crown className="w-4 h-4 text-green-400" />
                        <span className="text-sm font-semibold text-green-400">
                            Planos e Preços
                        </span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
                        Escolha o plano ideal
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                            para sua liberdade financeira
                        </span>
                    </h2>

                    <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                        Todos os planos incluem acesso completo ao WhatsApp e Dashboard Web
                    </p>
                </motion.div>

                {/* Pricing Cards */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {activePlans.map((plan, index) => {
                        const recursos = typeof plan.recursos === 'string'
                            ? JSON.parse(plan.recursos)
                            : plan.recursos || [];

                        const isPopular = plan.destaque;
                        const isPremium = plan.tipo_periodo === 'anual';

                        return (
                            <motion.div
                                key={plan.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`relative ${isPopular ? 'lg:scale-105' : ''}`}
                            >
                                {/* Popular Badge */}
                                {isPopular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                                        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5 animate-pulse">
                                            <Star className="w-3 h-3 fill-current" />
                                            Mais Popular
                                        </div>
                                    </div>
                                )}

                                {/* Premium Badge */}
                                {isPremium && !isPopular && (
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 z-20">
                                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold px-4 py-2 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1.5">
                                            <Crown className="w-3 h-3 fill-current" />
                                            Melhor Valor
                                        </div>
                                    </div>
                                )}

                                {/* Card */}
                                <div
                                    className={`relative h-full bg-white/5 backdrop-blur-xl border rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 ${isPopular
                                        ? 'border-green-500/50 shadow-2xl shadow-green-500/20'
                                        : 'border-white/10 hover:border-white/20'
                                        }`}
                                >
                                    {/* Glow Effect */}
                                    {isPopular && (
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 -z-10" />
                                    )}

                                    {/* Plan Name */}
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {plan.nome}
                                    </h3>
                                    <p className="text-sm text-zinc-400 mb-6 h-10">
                                        {plan.descricao}
                                    </p>

                                    {/* Price */}
                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm text-zinc-400 font-medium">R$</span>
                                            <span className="text-5xl font-bold text-white tracking-tight">
                                                {Number(plan.valor).toFixed(2).replace('.', ',').split(',')[0]}
                                            </span>
                                            <span className="text-2xl font-bold text-zinc-400">
                                                ,{Number(plan.valor).toFixed(2).split('.')[1]}
                                            </span>
                                            <span className="text-sm text-zinc-500 ml-1">
                                                /{plan.tipo_periodo === 'mensal' ? 'mês' :
                                                    plan.tipo_periodo === 'trimestral' ? 'trimestre' :
                                                        plan.tipo_periodo === 'anual' ? 'ano' : 'período'}
                                            </span>
                                        </div>

                                        {plan.tipo_periodo === 'anual' && (
                                            <p className="text-xs text-green-400 mt-2 font-medium">
                                                Economize 20% em comparação ao mensal
                                            </p>
                                        )}
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-4 mb-8">
                                        {recursos.map((recurso: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3">
                                                <div className={`mt-0.5 rounded-full p-1 flex-shrink-0 ${isPopular
                                                    ? 'bg-green-500/20 text-green-400'
                                                    : 'bg-white/10 text-zinc-400'
                                                    }`}>
                                                    <Check className="w-4 h-4" />
                                                </div>
                                                <span className="text-sm text-zinc-300 leading-relaxed">
                                                    {recurso}
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <Button
                                        className={`w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 group ${isPopular
                                            ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105'
                                            : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                                            }`}
                                        onClick={() => window.location.href = plan.link_checkout || '#'}
                                    >
                                        {isPopular ? 'Começar Agora' : 'Assinar Plano'}
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Trust Indicators */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 pt-12 border-t border-white/10"
                >
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 text-zinc-400">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                                <Shield className="w-5 h-5 text-green-400" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-white">Pagamento Seguro</div>
                                <div className="text-xs">Criptografia SSL</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                                <Zap className="w-5 h-5 text-blue-400" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-white">Acesso Imediato</div>
                                <div className="text-xs">Ativação instantânea</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center">
                                <Crown className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="text-left">
                                <div className="text-sm font-semibold text-white">Garantia de 7 dias</div>
                                <div className="text-xs">Ou seu dinheiro de volta</div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
