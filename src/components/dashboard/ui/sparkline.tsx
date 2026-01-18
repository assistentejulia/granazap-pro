"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface SparklineProps {
    data: number[];
    color?: string;
    height?: number;
    width?: number;
    showArea?: boolean;
    animate?: boolean;
}

export function Sparkline({
    data,
    color = "#22C55E",
    height = 40,
    width = 100,
    showArea = true,
    animate = true,
}: SparklineProps) {
    const { path, areaPath, min, max } = useMemo(() => {
        if (!data || data.length === 0) {
            return { path: "", areaPath: "", min: 0, max: 0 };
        }

        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min || 1; // Avoid division by zero

        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * width;
            const y = height - ((value - min) / range) * height;
            return { x, y };
        });

        // Create smooth curve path using quadratic bezier curves
        const linePath = points.reduce((acc, point, index) => {
            if (index === 0) {
                return `M ${point.x},${point.y}`;
            }
            const prevPoint = points[index - 1];
            const midX = (prevPoint.x + point.x) / 2;
            return `${acc} Q ${prevPoint.x},${prevPoint.y} ${midX},${(prevPoint.y + point.y) / 2} T ${point.x},${point.y}`;
        }, "");

        // Create area path (same as line but closed to bottom)
        const area = `${linePath} L ${width},${height} L 0,${height} Z`;

        return {
            path: linePath,
            areaPath: area,
            min,
            max,
        };
    }, [data, height, width]);

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <svg
            width={width}
            height={height}
            viewBox={`0 0 ${width} ${height}`}
            className="overflow-visible"
            style={{ display: "block" }}
        >
            {/* Area fill with gradient */}
            {showArea && (
                <defs>
                    <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
            )}

            {/* Area */}
            {showArea && (
                <motion.path
                    d={areaPath}
                    fill={`url(#gradient-${color})`}
                    initial={animate ? { opacity: 0 } : undefined}
                    animate={animate ? { opacity: 1 } : undefined}
                    transition={animate ? { duration: 0.8, delay: 0.2 } : undefined}
                />
            )}

            {/* Line */}
            <motion.path
                d={path}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={animate ? { pathLength: 0, opacity: 0 } : undefined}
                animate={animate ? { pathLength: 1, opacity: 1 } : undefined}
                transition={animate ? { duration: 1, opacity: { duration: 0.5 } } : undefined}
            />
        </svg>
    );
}
