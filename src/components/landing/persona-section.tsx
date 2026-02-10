"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export function PersonaSection() {
    return (
        <section className="py-20 bg-background relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Image Column */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="relative mx-auto lg:mx-0"
                    >
                        <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 rounded-full overflow-hidden border-4 border-green-500/20 shadow-2xl shadow-green-500/10">
                            <Image
                                src="/img/persona-julia.jpg"
                                alt="Assistente Júlia Avatar"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        {/* Decorative elements */}
                        <div className="absolute -z-10 top-0 left-0 w-full h-full bg-green-500/5 rounded-full blur-3xl scale-110" />
                    </motion.div>

                    {/* Text Column */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="space-y-6 text-center lg:text-left"
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-emerald-600">
                            Quem é a Júlia?
                        </h2>

                        <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                            <p>
                                A Júlia é uma assistente financeira pensada para o dia a dia real.
                            </p>
                            <p>
                                Você conversa com ela no WhatsApp, informa seus gastos e receitas, e ela organiza tudo em relatórios claros, dashboards profissionais e lembretes de pagamentos.
                            </p>
                            <p>
                                A Júlia existe para quem quer controle financeiro sem burocracia, seja para uso pessoal ou para o negócio.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
