"use client";

import { motion } from "framer-motion";
import {
    MessageCircle,
    BarChart3,
    TrendingUp,
    Target,
    FileText,
    Shield,
    Smartphone,
    FolderTree,
    Building2,
} from "lucide-react";

const features = [
    {
        icon: MessageCircle,
        title: "Controle via WhatsApp",
        description: "Registre despesas, receitas e consulte relatórios direto do WhatsApp com comandos simples",
        color: "from-green-400 to-green-600",
        iconBg: "bg-green-500/10",
        iconColor: "text-green-500",
    },
    {
        icon: BarChart3,
        title: "Dashboard Web Completo",
        description: "Acesse gráficos detalhados, análises e visualizações completas em tempo real",
        color: "from-blue-400 to-blue-600",
        iconBg: "bg-blue-500/10",
        iconColor: "text-blue-500",
    },
    {
        icon: TrendingUp,
        title: "Gestão de Investimentos",
        description: "Acompanhe ações, FIIs, ETFs, renda fixa, criptomoedas e BDRs em um só lugar",
        color: "from-purple-400 to-purple-600",
        iconBg: "bg-purple-500/10",
        iconColor: "text-purple-500",
    },
    {
        icon: Target,
        title: "Metas Financeiras",
        description: "Defina objetivos, acompanhe progresso e alcance suas metas com planejamento inteligente",
        color: "from-pink-400 to-pink-600",
        iconBg: "bg-pink-500/10",
        iconColor: "text-pink-500",
    },
    {
        icon: FileText,
        title: "Relatórios Inteligentes",
        description: "Relatórios automáticos personalizados com insights poderosos sobre suas finanças",
        color: "from-orange-400 to-orange-600",
        iconBg: "bg-orange-500/10",
        iconColor: "text-orange-500",
    },
    {
        icon: Shield,
        title: "Segurança Total",
        description: "Proteção de dados com criptografia de ponta a ponta e conformidade LGPD",
        color: "from-red-400 to-red-600",
        iconBg: "bg-red-500/10",
        iconColor: "text-red-500",
    },
    {
        icon: Smartphone,
        title: "Acesso Multi-dispositivo",
        description: "Use no celular, tablet ou computador. Seus dados sincronizados em todos os dispositivos",
        color: "from-cyan-400 to-cyan-600",
        iconBg: "bg-cyan-500/10",
        iconColor: "text-cyan-500",
    },
    {
        icon: FolderTree,
        title: "Categorias Personalizáveis",
        description: "Crie e organize categorias do seu jeito para um controle financeiro sob medida",
        color: "from-yellow-400 to-yellow-600",
        iconBg: "bg-yellow-500/10",
        iconColor: "text-yellow-500",
    },
    {
        icon: Building2,
        title: "Contas PJ e Pessoal",
        description: "Gerencie finanças pessoais e empresariais separadamente com total organização",
        color: "from-indigo-400 to-indigo-600",
        iconBg: "bg-indigo-500/10",
        iconColor: "text-indigo-500",
    },
];

export function FeaturesGridSection() {
    return (
        <section className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-b from-black via-[#0A0F1C] to-black">
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
                    className="text-center mb-16 lg:mb-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6 backdrop-blur-sm">
                        <span className="text-sm font-semibold text-green-400">
                            Recursos Completos
                        </span>
                    </div>

                    <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-6">
                        Tudo que você precisa para
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                            dominar suas finanças
                        </span>
                    </h2>

                    <p className="text-xl text-zinc-400 max-w-3xl mx-auto">
                        Uma plataforma completa com todas as ferramentas necessárias para transformar sua gestão financeira
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                whileHover={{
                                    scale: 1.05,
                                    transition: { duration: 0.2 }
                                }}
                                className="group relative"
                            >
                                {/* Card */}
                                <div className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 lg:p-8 transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:shadow-2xl hover:shadow-green-500/10">
                                    {/* Glow Effect on Hover */}
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/0 to-blue-500/0 group-hover:from-green-500/5 group-hover:to-blue-500/5 transition-all duration-300" />

                                    {/* Icon */}
                                    <div className={`relative w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className={`w-7 h-7 ${feature.iconColor}`} />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-green-400 transition-colors">
                                        {feature.title}
                                    </h3>

                                    <p className="text-zinc-400 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Decorative Corner */}
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-500/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-16 text-center"
                >
                    <p className="text-zinc-400 text-lg mb-6">
                        E muito mais recursos sendo adicionados constantemente
                    </p>
                    <div className="flex items-center justify-center gap-2 text-green-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm font-semibold">Atualizações semanais</span>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
