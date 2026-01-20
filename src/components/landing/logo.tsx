"use client";

import { cn } from "@/lib/utils";

interface LandingLogoProps {
    className?: string;
}

export function LandingLogo({ className }: LandingLogoProps) {
    return (
        <div className={cn("relative flex items-center justify-center w-10 h-10 overflow-hidden rounded-full border border-green-500/20 shadow-lg", className)}>
            <img
                src="/img/logo-julia.png"
                alt="Assistente Julia Logo"
                className="w-full h-full object-cover transition-transform hover:scale-110 duration-500"
            />
        </div>
    );
}
