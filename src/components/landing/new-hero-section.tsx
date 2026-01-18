"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { WhatsAppChatAnimation } from "./whatsapp-chat-animation";

export function NewHeroSection() {
    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/50 to-background dark:from-[#1a0b2e] dark:via-[#0A0F1C] dark:to-black">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
                        backgroundSize: '50px 50px'
                    }}
                />

                {/* Glowing Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="absolute top-0 right-0 w-[600px] h-[600px] bg-green-500/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.2, 0.4, 0.2],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                    className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px]"
                />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                    {/* Left Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center lg:text-left"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8 backdrop-blur-sm"
                        >
                            <MessageCircle className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-semibold text-green-400">
                                Integração Total com WhatsApp
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl lg:text-6xl xl:text-7xl font-bold text-foreground mb-6 leading-tight"
                        >
                            Transforme Seu{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-green-500 to-emerald-400 animate-gradient">
                                WhatsApp
                            </span>
                            <br />
                            em uma Máquina de{" "}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                                Gestão Financeira
                            </span>
                        </motion.h1>

                        {/* Subheadline */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Controle total das suas finanças pessoais e empresariais direto do WhatsApp + Dashboard Web Completo
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
                        >
                            <Button
                                size="lg"
                                className="h-14 px-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-lg font-semibold shadow-2xl shadow-green-500/30 transition-all hover:scale-105 hover:shadow-green-500/50 group"
                                asChild
                            >
                                <Link href="/cadastro" prefetch={false}>
                                    COMEÇAR AGORA
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </Button>


                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="mt-12 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground"
                        >
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 border-2 border-background"
                                        />
                                    ))}
                                </div>
                                <span className="text-sm">+10.000 usuários</span>
                            </div>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <svg
                                        key={i}
                                        className="w-5 h-5 text-yellow-500 fill-current"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                                <span className="ml-2 text-sm">4.9/5</span>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Right Content - WhatsApp Mockup */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.3 }}
                        className="relative flex items-center justify-center lg:justify-end"
                    >
                        {/* Glow Effect */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-green-500/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" />

                        {/* Phone Mockup */}
                        <div className="relative z-10">
                            <motion.div
                                animate={{
                                    y: [0, -10, 0],
                                }}
                                transition={{
                                    duration: 6,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="relative"
                            >
                                {/* Phone Frame */}
                                <div className="relative w-[320px] sm:w-[360px] aspect-[9/19] rounded-[3rem] border-[14px] border-zinc-800 shadow-2xl overflow-hidden bg-white">
                                    {/* Notch */}
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-zinc-800 rounded-b-3xl z-20" />

                                    {/* WhatsApp Animation */}
                                    <div className="absolute inset-0 overflow-hidden bg-[#E5DDD5]">
                                        <WhatsAppChatAnimation />
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
