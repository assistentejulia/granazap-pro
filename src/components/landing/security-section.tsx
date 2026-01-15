"use client";

import { Shield, Lock, Server, Smartphone } from "lucide-react";

export function SecuritySection() {
    return (
        <section className="py-16 bg-background">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center mb-12">
                    <h2 className="text-2xl font-bold text-foreground mb-4">Seus dados financeiros, sempre seguros.</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { icon: Lock, title: "Criptografia", desc: "Dados ponta-a-ponta." },
                        { icon: Shield, title: "Privacidade", desc: "Seus dados são seus." },
                        { icon: Server, title: "Backups", desc: "Automáticos e diários." },
                        { icon: Smartphone, title: "Acesso", desc: "Seguro em qualquer device." }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center text-center">
                            <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mb-3">
                                <item.icon className="w-5 h-5 text-muted-foreground" />
                            </div>
                            <h3 className="text-foreground font-medium mb-1">{item.title}</h3>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
