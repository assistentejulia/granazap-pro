"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Phone, Video, MoreVertical, ChevronLeft, Mic, Paperclip, Camera } from "lucide-react";

interface Message {
    id: string;
    type: "user" | "other";
    text: React.ReactNode;
    time: string;
}

export function WhatsAppChatAnimation() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingText, setTypingText] = useState("");
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const hasRun = useRef(false);

    useEffect(() => {
        if (hasRun.current) return;
        hasRun.current = true;

        const sequence = async () => {
            // Helper delay
            const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

            // Initial delay
            await wait(1000);

            // --- Interaction 1: User adds transaction ---
            setTypingText("Paguei 8,75 de uber");
            // Simulate user typing in input (visual only, we'll just show the message appearing after a bit)
            await wait(1000);
            setTypingText("");

            const msg1: Message = {
                id: "1",
                type: "user",
                text: "Paguei 8,75 de uber",
                time: "01:33"
            };
            setMessages(prev => [...prev, msg1]);

            await wait(1000);
            setIsTyping(true); // Julia typing
            await wait(1500);
            setIsTyping(false);

            const msg2: Message = {
                id: "2",
                type: "other",
                text: (
                    <div className="text-sm leading-relaxed">
                        <p className="font-bold">Transação registrada com sucesso!</p>
                        <p>Identificador: 90</p>
                        <br />
                        <p className="font-bold">📋 Resumo da transação:</p>
                        <div className="border-b border-gray-300 my-1"></div>
                        <p>🏷️ Descrição: uber</p>
                        <p>💸 Valor: R$ 8,75</p>
                        <p>🔄 Tipo: 🟥 Despesa</p>
                        <p>🏷️ Categoria: Transporte</p>
                        <p>🏦 Conta: Pessoal</p>
                        <p>📅 Data: 14/01/2026</p>
                        <br />
                        <p>❌ Para excluir diga: "Excluir transação 90".</p>
                        <br />
                        <p>📊 Consulte gráficos e relatórios completos em:</p>
                        <p className="text-blue-500">https://www.assistentejulia.com.br/dashboard</p>
                    </div>
                ),
                time: "02:52"
            };
            setMessages(prev => [...prev, msg2]);

            // --- Interaction 2: User asks for report ---
            await wait(2000);
            setTypingText("Relatório de despesas em janeiro de 2026");
            await wait(1500);
            setTypingText("");

            const msg3: Message = {
                id: "3",
                type: "user",
                text: "Relatório de despesas em janeiro de 2026",
                time: "23:48"
            };
            setMessages(prev => [...prev, msg3]);

            await wait(1000);
            setIsTyping(true); // Julia typing
            await wait(2000);
            setIsTyping(false);

            const msg4: Message = {
                id: "4",
                type: "other",
                text: (
                    <div className="text-sm leading-relaxed">
                        <p className="font-bold">📋 Relatório Financeiro</p>
                        <br />
                        <p className="font-bold">📊 Resumo de despesas em janeiro de 2026, ordenado por data:</p>
                        <br />
                        <p>💸 29/01/2026: R$ 88,76 - Abastecimento (Combustível)</p>
                        <p>💸 29/01/2026: R$ 11,29 - Lanche - Andrade (Lanches)</p>
                        <p>💸 29/01/2026: R$ 15,00 - Uber</p>
                        <p>💸 30/01/2026: R$ 67,98 - Lanche (Padaria)</p>
                        <p>💸 30/01/2026: R$ 64,88 - Supermercado</p>
                        <p>💸 30/01/2026: R$ 6,06 - Uber</p>
                        <p>💸 31/01/2026: R$ 90,00 - Corte Cabelo</p>
                        <br />
                        <p>💡 Quer ver mais detalhes ou outro período?</p>
                    </div>
                ),
                time: "23:50"
            };
            setMessages(prev => [...prev, msg4]);
        };

        sequence();
    }, []);

    return (
        <div className="w-full h-full bg-[#E5DDD5] flex flex-col font-sans relative overflow-hidden">
            {/* Wallpaper Pattern Overlay - CSS only to avoid "print" look */}
            <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='64' height='64' viewBox='0 0 64 64' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 16c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm0-2c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm33.414-6l5.95-5.95L45.95.636 40 6.586 34.05.636 32.636 2.05 38.586 8l-5.95 5.95 1.414 1.414 5.95-5.95 5.95 5.95zM4 28h4v20H4V28zm6 0h4v20h-4V28zM28 32h20v4H28v-4zm0 12h20v4H28v-4z' fill='%23000000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    backgroundSize: '400px'
                }}
            />

            {/* Header */}
            <div className="bg-[#008069] p-3 flex items-center justify-between text-white shrink-0 z-10 shadow-sm relative">
                <div className="flex items-center gap-2">
                    <ChevronLeft className="w-6 h-6 -ml-1" />
                    <div className="h-9 w-auto overflow-hidden shrink-0">
                        <img src="/img/logo-julia.png" alt="Julia" className="h-full w-auto object-contain" />
                    </div>
                    <div className="ml-1">
                        <div className="font-medium text-[16px] leading-none">Assistente Julia</div>
                        {isTyping && <div className="text-[12px] text-white/90 mt-0.5">digitando...</div>}
                    </div>
                </div>
                <div className="flex gap-4 opacity-90 pr-1">
                    <Video className="w-5 h-5" />
                    <Phone className="w-5 h-5" />
                    <MoreVertical className="w-5 h-5" />
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10"
            >
                <style jsx>{`
                    div::-webkit-scrollbar {
                        width: 4px;
                    }
                    div::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    div::-webkit-scrollbar-thumb {
                        background: rgba(0, 0, 0, 0.2);
                        border-radius: 4px;
                    }
                `}</style>
                {/* Date bubble */}
                <div className="flex justify-center mb-4">
                    <span className="bg-[#E1F3FB] text-zinc-600 text-xs py-1 px-3 rounded-lg shadow-sm">
                        Hoje
                    </span>
                </div>

                <AnimatePresence initial={false}>
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`
                  max-w-[85%] rounded-lg px-3 py-2 shadow-sm relative text-[14px] leading-snug
                  ${msg.type === 'user'
                                        ? 'bg-[#DCF8C6] text-black rounded-tr-none'
                                        : 'bg-white text-black rounded-tl-none'}
                `}
                            >
                                {/* Bubble Tail */}
                                <div
                                    className={`absolute top-0 w-0 h-0 border-[8px] border-transparent 
                    ${msg.type === 'user'
                                            ? '-right-2 border-t-[#DCF8C6] border-l-[#DCF8C6]'
                                            : '-left-2 border-t-white border-r-white'}
                    `}
                                />

                                <div className="break-words">
                                    {msg.text}
                                </div>
                                <div className="flex justify-end items-center gap-1 mt-1 opacity-60">
                                    <span className="text-[10px]">{msg.time}</span>
                                    {msg.type === 'user' && (
                                        <span className="text-blue-500 text-[14px]">✓✓</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Footer / Input */}
            <div className="bg-[#F0F0F0] p-2 flex items-center gap-2 shrink-0 z-10 relative">
                <div className="flex items-center gap-3 p-2 rounded-full text-zinc-500">
                    <div className="p-1">😊</div>
                </div>

                <div className="flex-1 bg-white rounded-full px-4 py-2 text-sm text-zinc-600 flex items-center shadow-sm">
                    {typingText || "Digite uma mensagem"}
                    {!typingText && <Paperclip className="w-4 h-4 ml-auto text-zinc-400 rotate-[-45deg]" />}
                    {!typingText && <Camera className="w-4 h-4 ml-3 text-zinc-400" />}
                </div>

                <div className="w-10 h-10 bg-[#00897B] rounded-full flex items-center justify-center text-white shadow-sm shrink-0">
                    {typingText ? <Send className="w-5 h-5 ml-0.5" /> : <Mic className="w-5 h-5" />}
                </div>
            </div>
        </div>
    );
}
