"use client";

import { cn } from "@/lib/utils";

interface LandingLogoProps {
    className?: string;
}

export function LandingLogo({ className }: LandingLogoProps) {
    return (
        <div className={cn("relative flex items-center justify-center w-10 h-10", className)}>
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-md transition-transform hover:scale-110 duration-500"
            >
                <defs>
                    <linearGradient id="julia-gradient" x1="0%" y1="100%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#10b981" /> {/* emerald-500 (Finance) */}
                        <stop offset="100%" stopColor="#8b5cf6" /> {/* violet-500 (AI) */}
                    </linearGradient>

                    <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Abstract Container - Subtle Tech Ring (Optional, kept minimal) */}
                <circle cx="50" cy="50" r="45" stroke="url(#julia-gradient)" strokeWidth="1.5" strokeOpacity="0.3" strokeDasharray="4 4" className="animate-spin-slow" style={{ animationDuration: '20s' }} />

                {/* 
           The Symbol: "Intelligent Growth"
           3 Bars varying in height (Growth) + Connected by a "Neural" line (AI)
        */}

                {/* Bar 1 - Base */}
                <rect x="20" y="55" width="12" height="25" rx="4" fill="url(#julia-gradient)" style={{ filter: "url(#soft-glow)" }} opacity="0.8" />

                {/* Bar 2 - Mid Growth */}
                <rect x="44" y="40" width="12" height="40" rx="4" fill="url(#julia-gradient)" style={{ filter: "url(#soft-glow)" }} />

                {/* Bar 3 - Peak Success */}
                <rect x="68" y="25" width="12" height="55" rx="4" fill="url(#julia-gradient)" style={{ filter: "url(#soft-glow)" }} />

                {/* The "Spark" - A connecting node implying the AI analysis behind the data */}
                <path
                    d="M26 55 C 26 45, 50 40, 50 35 S 74 25, 74 25"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeOpacity="0.9"
                    className="dark:stroke-white stroke-white"
                />

                {/* Central AI Node */}
                <circle cx="50" cy="35" r="4" fill="white" className="dark:fill-white fill-white shadow-lg" />

            </svg>
        </div>
    );
}
