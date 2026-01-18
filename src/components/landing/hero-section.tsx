"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Mic, Image as ImageIcon, Send } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export function HeroSection() {
    // Animation state for chat
    const [typing, setTyping] = useState(false);
    const [messages, setMessages] = useState<Array<{ type: 'user' | 'ai', text: React.ReactNode }>>([]);

    useEffect(() => {
        const sequence = async () => {
            // Delay before user message
            await new Promise(r => setTimeout(r, 1000));
            setMessages(prev => [...prev, { type: 'user', text: 'Paguei 8,75 de uber' }]);

            // AI Typing
            setTyping(true);
            await new Promise(r => setTimeout(r, 1500));
            setTyping(false);

            // AI Response (formatted based on screenshot)
            setMessages(prev => [...prev, {
                type: 'ai',
                text: (
                    <div className="space-y-1">
                        <p>Transação registrada com sucesso!</p>
                        <p>Identificador: 90</p>
                        <br />
                        <p>📋 Resumo da transação:</p>
                        <hr className="border-zinc-300 dark:border-zinc-600 my-1" />
                        <p>🏷️ Descrição: uber</p>
                        <p>💸 Valor: R$ 8,75</p>
                        <p>🔄 Tipo: 🟥 Despesa</p>
                        <p>🏷️ Categoria: Transporte</p>
                        <p>🏦 Conta: Pessoal</p>
                        <p>📅 Data: 14/01/2026</p>
                        <br />
                        <p>❌ Para excluir diga: "Excluir transação 90".</p>
                    </div>
                )
            }]);
        };
        sequence();
    }, []);

    return (
        <section className="relative min-h-[95vh] flex items-center pt-20 overflow-hidden bg-background">
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-green-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
                {/* Grid pattern overlay */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            </div>

            <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center lg:text-left relative z-20"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-8 backdrop-blur-sm">
                        <MessageCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-semibold text-green-600 dark:text-green-400">Integração Total com WhatsApp</span>
                    </div>

                    <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight tracking-tight">
                        Sua assessora com IA, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-500">
                            direto no WhatsApp
                        </span>
                    </h1>

                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                        Esqueça as planilhas complexas. Envie áudios, textos ou fotos dos seus comprovantes para a <strong>Julia</strong> no WhatsApp e ela organiza tudo instantaneamente para você.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                        <Button size="lg" className="h-14 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white px-8 text-lg font-semibold shadow-xl shadow-green-500/20 transition-all hover:scale-105" asChild>
                            <Link href="/cadastro" prefetch={false}>
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Começar no WhatsApp
                            </Link>
                        </Button>

                    </div>

                    <div className="mt-10 flex items-center justify-center lg:justify-start gap-8 text-muted-foreground/60 invisible sm:visible">
                        <div className="flex items-center gap-2">
                            <Mic className="w-5 h-5" />
                            <span className="text-sm">Envie Áudios</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-current" />
                        </div>
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5" />
                            <span className="text-sm">Envie Fotos</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-current" />
                        </div>
                        <div className="flex items-center gap-2">
                            <ArrowRight className="w-5 h-5" />
                            <span className="text-sm">Relatórios Prontos</span>
                        </div>
                    </div>
                </motion.div>

                {/* Phone Chat Mockup */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="relative lg:h-[700px] flex items-center justify-center lg:justify-end perspective-1000"
                >
                    {/* Floating Elements Background */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-green-500/20 to-blue-500/20 rounded-full blur-3xl -z-10 animate-pulse-slow" />

                    {/* Phone Frame */}
                    <div className="relative w-[300px] sm:w-[350px] aspect-[9/19] bg-background rounded-[3rem] border-8 border-muted/50 shadow-2xl overflow-hidden z-20 mx-auto">
                        {/* Dynamic Header */}
                        <div className="absolute top-0 w-full h-24 bg-[#075E54] z-10 p-6 pt-10 flex items-center gap-4 text-white">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold border border-white/30">
                                J
                            </div>
                            <div>
                                <h3 className="font-semibold text-base md:text-lg leading-none">Assistente Julia</h3>
                                <span className="text-[10px] md:text-xs opacity-80">Online agora</span>
                            </div>
                            <div className="ml-auto w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        </div>

                        {/* Chat Area */}
                        <div className="absolute inset-0 pt-28 pb-20 px-4 bg-[#E5DDD5] dark:bg-[#0b141a] flex flex-col gap-4 overflow-hidden bg-opacity-90">
                            {/* Background Pattern Doodle */}
                            <div className="absolute inset-0 opacity-5 dark:opacity-[0.03] bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat z-0 pointer-events-none" />

                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className={`relative z-10 max-w-[85%] p-3 rounded-2xl shadow-sm text-sm ${msg.type === 'user'
                                        ? 'self-end bg-[#D9FDD3] dark:bg-[#005c4b] text-foreground rounded-tr-none'
                                        : 'self-start bg-white dark:bg-[#202c33] text-foreground rounded-tl-none'
                                        }`}
                                >
                                    <div className="whitespace-pre-wrap">{msg.text}</div>
                                    <div className={`text-[10px] mt-1 text-right ${msg.type === 'user' ? 'text-green-800 dark:text-green-200' : 'text-zinc-400'}`}>
                                        {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}
                                    </div>
                                </motion.div>
                            ))}

                            {typing && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="self-start bg-white dark:bg-[#202c33] p-3 rounded-2xl rounded-tl-none shadow-sm z-10"
                                >
                                    <div className="flex gap-1">
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-zinc-400 rounded-full" />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.1 }} className="w-2 h-2 bg-zinc-400 rounded-full" />
                                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-zinc-400 rounded-full" />
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Input Area Fake */}
                        <div className="absolute bottom-0 w-full h-16 bg-white dark:bg-[#202c33] px-4 flex items-center gap-3 border-t border-border z-20">
                            <Mic className="w-6 h-6 text-muted-foreground" />
                            <div className="flex-1 h-10 bg-muted/50 rounded-full px-4 flex items-center text-sm text-muted-foreground">
                                Mensagem
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#00a884] flex items-center justify-center text-white">
                                <Send className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
