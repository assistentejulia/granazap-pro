"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "João Silva",
        role: "Empresário",
        avatar: "JS",
        rating: 5,
        text: "A Assistente Julia transformou completamente a forma como gerencio minhas finanças. Agora consigo registrar tudo pelo WhatsApp em segundos!",
        color: "from-blue-400 to-blue-600"
    },
    {
        name: "Maria Santos",
        role: "Investidora",
        avatar: "MS",
        rating: 5,
        text: "Finalmente consigo acompanhar meus investimentos em tempo real. O dashboard é incrível e os relatórios são muito detalhados!",
        color: "from-green-400 to-green-600"
    },
    {
        name: "Pedro Costa",
        role: "Autônomo",
        avatar: "PC",
        rating: 5,
        text: "Separar as finanças pessoais da empresa ficou muito mais fácil. A integração com WhatsApp é perfeita para quem está sempre em movimento.",
        color: "from-purple-400 to-purple-600"
    },
];

export function TestimonialsSection() {
    return (
        <section id="depoimentos" className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background dark:from-black dark:via-[#0A0F1C] dark:to-black">
            {/* Background Elements */}
            <div className="absolute inset-0 opacity-30">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(34, 197, 94, 0.15) 1px, transparent 0)`,
                        backgroundSize: '40px 40px'
                    }}
                />
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
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-6 backdrop-blur-sm">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-semibold text-yellow-400">
                            Depoimentos
                        </span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-6">
                        O que nossos usuários
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                            dizem sobre nós
                        </span>
                    </h2>

                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Mais de 10.000 pessoas já transformaram suas finanças com a Assistente Julia
                    </p>
                </motion.div>

                {/* Testimonials Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {testimonials.map((testimonial, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ scale: 1.05 }}
                            className="group relative"
                        >
                            {/* Card */}
                            <div className="relative h-full bg-card/50 dark:bg-white/5 backdrop-blur-xl border border-border/50 dark:border-white/10 rounded-2xl p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/10">
                                {/* Quote Icon */}
                                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <Quote className="w-12 h-12 text-green-400" />
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                                    ))}
                                </div>

                                {/* Testimonial Text */}
                                <p className="text-foreground/80 dark:text-zinc-300 leading-relaxed mb-6 relative z-10">
                                    "{testimonial.text}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-sm`}>
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="text-foreground font-semibold">{testimonial.name}</div>
                                        <div className="text-muted-foreground text-sm">{testimonial.role}</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-20 text-center"
                >
                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-green-500/10 border border-green-500/20 backdrop-blur-sm">
                        <div className="flex -space-x-2">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div
                                    key={i}
                                    className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 border-2 border-background"
                                />
                            ))}
                        </div>
                        <span className="text-green-400 font-semibold">
                            Mais de 10.000 usuários confiam na Assistente Julia
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
