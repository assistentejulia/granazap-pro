"use client";

import { motion } from "framer-motion";

export function AboutSection() {
    return (
        <section className="py-16 bg-muted/30 border-t border-border/50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-bold mb-6">Sobre a Assistente Júlia</h2>

                        <div className="space-y-6 text-muted-foreground leading-relaxed">
                            <p>
                                A Assistente Júlia é criada por um time jovem e multidisciplinar, reunindo especialistas em tecnologia, inteligência artificial, programação e marketing digital.
                            </p>
                            <p>
                                O projeto faz parte de um ecossistema de soluções digitais desenvolvidas e operadas por profissionais com experiência prática em produtos tecnológicos, automação e crescimento digital.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
