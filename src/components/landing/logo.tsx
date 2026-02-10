"use client";

import { cn } from "@/lib/utils";

interface LandingLogoProps {
    className?: string;
}

export function LandingLogo({ className }: LandingLogoProps) {
    return (
        <div className={cn("relative flex items-center justify-center h-10 w-auto overflow-hidden", className)}>
            <img
                src="/img/logos/logo-white.png"
                alt="Assistente Julia Logo"
                className="h-full w-auto object-contain transition-transform hover:scale-105 duration-500"
            />
        </div>
    );
}
