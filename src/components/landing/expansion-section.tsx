"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Check } from "lucide-react";

export function ExpansionSection() {
    const [activeTab, setActiveTab] = useState<'pf' | 'pj'>('pf');

    return (
        <section className="py-24 bg-muted/30 border-y border-border">
            <div className="container mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                            Comece na pessoa física.<br />
                            <span className="text-blue-400">Cresça para a jurídica.</span>
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8">
                            A Julia acompanha sua evolução. Gerencie suas finanças pessoais hoje e, quando precisar, ative o modo PJ sem mudar de plataforma.
                        </p>

                        <div className="flex gap-4 mb-4">
                            <button
                                onClick={() => setActiveTab('pf')}
                                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${activeTab === 'pf' ? 'bg-blue-600 text-white shadow-lg' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                            >
                                Pessoa Física
                            </button>
                            <button
                                onClick={() => setActiveTab('pj')}
                                className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all ${activeTab === 'pj' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-secondary text-muted-foreground hover:text-foreground'}`}
                            >
                                Pessoa Jurídica
                            </button>
                        </div>

                        <div className="bg-card p-6 rounded-2xl border border-border min-h-[160px]">
                            {activeTab === 'pf' ? (
                                <motion.ul
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-3"
                                >
                                    <li className="flex items-center gap-3 text-muted-foreground">
                                        <Check className="w-5 h-5 text-blue-500" /> Controle de Metas e Sonhos
                                    </li>
                                    <li className="flex items-center gap-3 text-muted-foreground">
                                        <Check className="w-5 h-5 text-blue-500" /> Lançamentos futuros e recorrentes
                                    </li>
                                    <li className="flex items-center gap-3 text-muted-foreground">
                                        <Check className="w-5 h-5 text-blue-500" /> Convide sua família para gerenciar junto
                                    </li>
                                </motion.ul>
                            ) : (
                                <motion.ul
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-3"
                                >
                                    <li className="flex items-center gap-3 text-muted-foreground">
                                        <Check className="w-5 h-5 text-indigo-500" /> Separação total contas Empresa
                                    </li>
                                    <li className="flex items-center gap-3 text-muted-foreground">
                                        <Check className="w-5 h-5 text-indigo-500" /> Fluxo de caixa profissional
                                    </li>
                                    <li className="flex items-center gap-3 text-muted-foreground">
                                        <Check className="w-5 h-5 text-indigo-500" /> Convide sócios ou colaboradores
                                    </li>
                                </motion.ul>
                            )}
                        </div>
                    </div>

                    {/* Visual representation toggle */}
                    <div className="relative h-[400px] bg-card rounded-2xl border border-border p-8 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5" />

                        <motion.div
                            animate={{
                                rotateY: activeTab === 'pf' ? 0 : 180,
                            }}
                            transition={{ duration: 0.6 }}
                            style={{ transformStyle: "preserve-3d" }}
                            className="relative w-64 h-80"
                        >
                            {/* PF Face (Front) */}
                            <div className="absolute inset-0 bg-popover rounded-xl border border-border flex flex-col items-center justify-center p-6 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                                <div className="w-20 h-20 bg-blue-500/20 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl">👤</span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Você</h3>
                                <p className="text-center text-muted-foreground text-sm">Controle sua liberdade financeira.</p>
                            </div>

                            {/* PJ Face (Back) */}
                            <div className="absolute inset-0 bg-popover rounded-xl border border-indigo-500/30 flex flex-col items-center justify-center p-6" style={{ backfaceVisibility: 'hidden', transform: "rotateY(180deg)" }}>
                                <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mb-4">
                                    <span className="text-3xl">🏢</span>
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">Sua Empresa</h3>
                                <p className="text-center text-muted-foreground text-sm">Profissionalize seu negócio.</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
