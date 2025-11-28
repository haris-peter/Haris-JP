"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { MazeGrid } from "@/components/ui/MazeGrid";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function Hero() {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });

    const [tagline, setTagline] = useState("Full Stack Developer. System Architect. Digital Frontier Explorer.");

    useEffect(() => {
        const fetchTagline = async () => {
            try {
                const docRef = doc(db, "settings", "profile");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().tagline) {
                    setTagline(docSnap.data().tagline);
                }
            } catch (error) {
                console.error("Error fetching tagline:", error);
            }
        };
        fetchTagline();
    }, []);

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section
            ref={ref}
            className="relative h-screen w-full overflow-hidden flex items-center justify-center bg-background"
        >
            {/* TRON Grid Background */}
            <div className="absolute inset-0 w-full h-full bg-grid-pattern [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_100%)] z-0" />
            <MazeGrid className="absolute inset-0 z-0" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background z-0" />

            {/* Glowing Orb Effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] z-0" />

            <motion.div
                style={{ y, opacity }}
                className="relative z-10 text-center px-4 max-w-5xl mx-auto"
            >
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/50 drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                >
                    THE GRID <br /> AWAITS.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-mono"
                >
                    {tagline}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
                >
                    <button
                        onClick={() => scrollToSection("projects")}
                        className="px-8 py-3 rounded-none border border-primary bg-primary/10 text-primary font-bold tracking-widest hover:bg-primary hover:text-black transition-all duration-300 shadow-[0_0_10px_rgba(0,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,255,255,0.6)]"
                    >
                        ENTER_SYSTEM
                    </button>
                    <button
                        onClick={() => scrollToSection("contact")}
                        className="px-8 py-3 rounded-none border border-muted-foreground/50 text-muted-foreground font-bold tracking-widest hover:border-primary hover:text-primary transition-all duration-300"
                    >
                        CONTACT
                    </button>
                </motion.div>
            </motion.div>
        </section>
    );
}
