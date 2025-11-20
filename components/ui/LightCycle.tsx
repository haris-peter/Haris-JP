"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface LightCycleProps {
    count?: number;
    color?: string;
}

export function LightCycle({ count = 5, color = "cyan" }: LightCycleProps) {
    const [cycles, setCycles] = useState<any[]>([]);

    useEffect(() => {
        // Initialize cycles with random properties
        const newCycles = Array.from({ length: count }).map((_, i) => ({
            id: i,
            y: Math.random() * 100, // Random vertical position (%)
            delay: Math.random() * 5, // Random start delay
            duration: 3 + Math.random() * 4, // Random duration
            width: 100 + Math.random() * 200, // Random trail length
        }));
        setCycles(newCycles);
    }, [count]);

    const pathname = usePathname();

    // Don't show on blog pages or any admin pages
    if (pathname?.startsWith("/blog") || pathname?.startsWith("/protocol")) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {cycles.map((cycle) => (
                <motion.div
                    key={cycle.id}
                    initial={{ x: "-100%" }}
                    animate={{ x: "200%" }}
                    transition={{
                        duration: cycle.duration,
                        repeat: Infinity,
                        delay: cycle.delay,
                        ease: "linear",
                    }}
                    style={{ top: `${cycle.y}%` }}
                    className="absolute h-[2px] flex items-center"
                >
                    {/* Trailing Tail (Now First) */}
                    <div
                        style={{ width: cycle.width }}
                        className="h-[2px] bg-gradient-to-r from-transparent via-primary to-primary/50 opacity-50"
                    />

                    {/* Glowing Head (Now Second) */}
                    <div className="w-20 h-[4px] bg-white rounded-full shadow-[0_0_20px_rgba(0,255,255,1),0_0_40px_rgba(0,255,255,0.8)] z-10" />
                </motion.div>
            ))}
        </div>
    );
}
