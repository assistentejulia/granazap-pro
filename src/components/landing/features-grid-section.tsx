"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
    MessageCircle,
    BarChart3,
    Brain,
    FileText,
    Target,
    Tag,
    Smartphone,
    Shield
} from "lucide-react";

const features = [
    {
        icon: MessageCircle,
        title: "Controle via WhatsApp",
        description: "Registre receitas e despesas conversando naturalmente com a Julia",
        gradient: "from-green-400 to-emerald-500"
    },
    {
        icon: BarChart3,
        title: "Dashboard Profissional",
        description: "Visualize suas finanças com gráficos e relatórios em tempo real",
        gradient: "from-blue-400 to-cyan-500"
    },
    {
        icon: Brain,
        title: "Assistente com IA",
        description: "Inteligência artificial que aprende seus padrões financeiros",
        gradient: "from-purple-400 to-pink-500"
    },
    {
        icon: FileText,
        title: "Relatórios Automáticos",
        description: "Exporte para PDF e Excel com um clique, sempre atualizados",
        gradient: "from-orange-400 to-red-500"
    },
    {
        icon: Target,
        title: "Metas Financeiras",
        description: "Defina objetivos e acompanhe seu progresso automaticamente",
        gradient: "from-teal-400 to-green-500"
    },
    {
        icon: Tag,
        title: "Categorias Personalizadas",
        description: "Organize seus gastos do seu jeito com categorias customizáveis",
        gradient: "from-indigo-400 to-purple-500"
    },
    {
        icon: Smartphone,
        title: "Acesso Multi-Dispositivo",
        description: "Sincronize dados entre celular, tablet e computador",
        gradient: "from-pink-400 to-rose-500"
    },
    {
        icon: FileText,
        title: "Conciliação Bancária",
        description: "Sincronize seus extratos importando arquivos OFX de forma simples",
        gradient: "from-emerald-400 to-teal-500"
    }
];

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: "circOut" as any
        }
    }
};

export function FeaturesGridSection() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });

    return (
        <section id="recursos" className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-b from-background via-muted/30 to-background dark:from-black dark:via-[#0A0F1C] dark:to-black">
            {/* Background Elements */}
            <div className="absolute inset-0">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '60px 60px'
                    }}
                />

                {/* Glowing Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-1/3 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1.1, 1, 1.1],
                        opacity: [0.08, 0.15, 0.08],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 2
                    }}
                    className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl"
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6 backdrop-blur-sm"
                    >
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                            Recursos Completos
                        </span>
                    </motion.div>

                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-4">
                        Tudo que você precisa para{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                            dominar suas finanças
                        </span>
                    </h2>
                    <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
                        Ferramentas poderosas que trabalham juntas para transformar sua gestão financeira
                    </p>
                </motion.div>

                {/* Features Grid */}
                <motion.div
                    ref={ref}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.2 }
                            }}
                            className="group relative p-6 rounded-2xl bg-card/50 dark:bg-white/5 backdrop-blur-sm border border-border/50 hover:border-green-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-green-500/20"
                        >
                            {/* Gradient Glow on Hover */}
                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <motion.div
                                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                                    transition={{ duration: 0.5 }}
                                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} p-3 mb-4 shadow-lg group-hover:shadow-2xl transition-shadow duration-300`}
                                >
                                    <feature.icon className="w-full h-full text-white" />
                                </motion.div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover Indicator */}
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileHover={{ width: "100%" }}
                                    transition={{ duration: 0.3 }}
                                    className={`h-1 rounded-full bg-gradient-to-r ${feature.gradient} mt-4`}
                                />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.8 }}
                    className="text-center mt-16"
                >
                    <p className="text-muted-foreground mb-4">
                        E muito mais recursos sendo desenvolvidos...
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-foreground font-medium">Atualizações semanais</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                            <span className="text-foreground font-medium">Suporte prioritário</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                            <span className="text-foreground font-medium">Sem custo adicional</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
