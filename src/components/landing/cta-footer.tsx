"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
    Instagram,
    Linkedin,
    Youtube,
    Mail,
    ArrowUp,
    Check,
    MessageCircle,
    BarChart3,
    Target,
    Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LandingLogo } from "@/components/landing/logo";
import Link from "next/link";

const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/assistente.julia/", label: "Instagram", color: "from-pink-500 to-purple-500" },
];

const footerLinks = {
    produto: [
        { name: "Dashboard", href: "/cadastro" },
        { name: "Relatórios", href: "/cadastro" },
        { name: "Metas", href: "/cadastro" },
        { name: "Categorias", href: "/cadastro" },
    ],
    recursos: [
        { name: "Funcionalidades", href: "#recursos" },
        { name: "Como Funciona", href: "#investimentos" },
        { name: "Planos", href: "#pricing" },
    ],
};

export function CtaFooter() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.2 });
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Show scroll to top button after scrolling
    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', () => {
            setShowScrollTop(window.scrollY > 500);
        });
    }

    const handleNewsletterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email) {
            setSubscribed(true);
            setEmail("");
            setTimeout(() => setSubscribed(false), 3000);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer ref={ref} className="relative bg-gradient-to-b from-muted/20 to-background dark:from-[#0A0F1C] dark:to-black border-t border-border/50">
            {/* Background Grid */}
            <div
                className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: `linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />



            {/* Links Section */}
            <div className="relative py-16">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 lg:gap-12">
                        {/* Logo & Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 0.3 }}
                            className="col-span-2"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <LandingLogo />
                                <span className="text-xl font-bold text-foreground">Assistente Julia</span>

                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={index}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`w-8 h-8 rounded-lg bg-gradient-to-br ${social.color} flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow ml-2`}
                                        aria-label={social.label}
                                    >
                                        <social.icon className="w-4 h-4 text-white" />
                                    </motion.a>
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground mb-6 max-w-xs">
                                Transforme seu WhatsApp em um poderoso sistema de gestão financeira pessoal e empresarial.
                            </p>
                        </motion.div>

                        {/* Link Columns */}
                        {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                transition={{ delay: 0.4 + categoryIndex * 0.1 }}
                            >
                                <h4 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
                                    {category}
                                </h4>
                                <ul className="space-y-3">
                                    {links.map((link, linkIndex) => (
                                        <li key={linkIndex}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-muted-foreground hover:text-green-600 dark:hover:text-green-400 transition-colors relative group inline-block"
                                            >
                                                {link.name}
                                                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-500 group-hover:w-full transition-all duration-300" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="relative py-8 border-t border-border/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                        <div>
                            © 2026 <span className="font-semibold text-foreground">Assistente Julia</span>. Todos os direitos reservados.
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll to Top Button */}
            {showScrollTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-2xl shadow-green-500/30 flex items-center justify-center text-white hover:scale-110 transition-transform z-50"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ArrowUp className="w-6 h-6" />
                </motion.button>
            )}
        </footer>
    );
}
