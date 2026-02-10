"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, ChevronDown } from "lucide-react";

interface FAQItem {
    question: string;
    answer: string | React.ReactNode;
}

const faqs: FAQItem[] = [
    {
        question: "1. A Assistente Júlia usa inteligência artificial?",
        answer: "Sim. A Assistente Júlia utiliza inteligência artificial para entender mensagens enviadas no WhatsApp, identificar valores, categorias e contexto, e registrar automaticamente receitas e despesas. A IA aprende com o uso para tornar os registros cada vez mais precisos, sem exigir que o usuário siga formatos rígidos."
    },
    {
        question: "2. Como funciona o controle financeiro pelo WhatsApp?",
        answer: "Você conversa com a Júlia como conversa com qualquer contato no WhatsApp. Pode enviar texto, áudio ou foto, informando seus gastos ou receitas. A Júlia interpreta essas mensagens, registra os dados e organiza tudo no painel financeiro automaticamente."
    },
    {
        question: "3. O teste grátis precisa de cartão de crédito?",
        answer: "Não. O teste grátis da Assistente Júlia dura 7 dias e não exige cartão de crédito. Você pode usar o sistema, conversar com a Júlia e acessar o dashboard normalmente durante esse período."
    },
    {
        question: "4. O que posso ver no dashboard?",
        answer: (
            <div className="space-y-2">
                <p>No dashboard você acompanha suas finanças de forma clara e visual, com:</p>
                <ul className="space-y-1 list-none">
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Resumo de receitas e despesas</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Gráficos por período e categoria</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Relatórios organizados</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-green-500" /> Exportação para PDF e Excel</li>
                </ul>
                <p>O acesso funciona tanto no celular quanto no computador.</p>
            </div>
        )
    },
    {
        question: "5. A Assistente Júlia é só para empresários?",
        answer: "Não. A Júlia foi criada para pessoas comuns que querem organizar suas finanças pessoais, assim como para autônomos, profissionais liberais e empresários que precisam de controle financeiro simples e eficiente."
    },
    {
        question: "6. Posso usar a Assistente Júlia para minha empresa?",
        answer: "Sim. Existem planos específicos para empresas que permitem controlar finanças pessoais e jurídicas no mesmo sistema, mantendo organização e visão clara do negócio, sem a complexidade de sistemas tradicionais."
    },
    {
        question: "7. Existe plano para casais ou famílias?",
        answer: "Sim. O plano Família permite o compartilhamento da conta entre duas pessoas, ideal para casais ou famílias que desejam acompanhar gastos em conjunto, mantendo tudo organizado em um único painel."
    },
    {
        question: "8. Meus dados financeiros estão seguros?",
        answer: "Sim. A Assistente Júlia utiliza boas práticas de segurança para proteger os dados dos usuários. As informações são armazenadas de forma segura e utilizadas apenas para o funcionamento do sistema, respeitando a privacidade e a confidencialidade dos dados."
    },
    {
        question: "9. Posso cancelar minha conta quando quiser?",
        answer: "Sim. O cancelamento pode ser feito a qualquer momento, sem burocracia. Após o cancelamento, o acesso ao sistema é encerrado conforme as regras do plano contratado, sem cobranças futuras."
    }
];

export function LandingFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-20 bg-background relative overflow-hidden" id="faq">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Perguntas Frequentes
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        Tire suas dúvidas sobre como a Assistente Júlia pode transformar sua gestão financeira
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className={`border border-border rounded-xl bg-card overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-lg border-green-500/30' : 'hover:border-green-500/20'}`}
                            initial={false}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="flex items-center justify-between w-full p-6 text-left"
                            >
                                <span className={`font-semibold text-lg ${openIndex === index ? 'text-green-500' : 'text-foreground'}`}>
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-green-500' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {openIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
