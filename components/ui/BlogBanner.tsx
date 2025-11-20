"use client";

import { motion } from "framer-motion";

export function BlogBanner() {
    return (
        <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden flex items-center justify-center bg-background">
            {/* Animated Background Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />

            {/* Moving Gradient Line */}
            <motion.div
                className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
                className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                animate={{ x: ["100%", "-100%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />

            <div className="relative z-10 text-center px-4">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-6xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/50"
                >
                    TRANSMISSIONS
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-muted-foreground font-mono"
                >
                    // LATEST_UPDATES_FROM_THE_GRID
                </motion.p>
            </div>
        </div>
    );
}
