"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function About() {
    const [bio, setBio] = useState("I am a creative technologist with a passion for building immersive digital experiences. My code is my craft, and the browser is my canvas. I specialize in bridging the gap between robust backend architecture and fluid frontend design.");
    const [skills, setSkills] = useState(["Next.js / React", "TypeScript", "Firebase / Cloud", "Tailwind CSS", "Node.js", "AI Integration"]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const docRef = doc(db, "settings", "profile");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.bio) setBio(data.bio);
                    if (data.skills) setSkills(data.skills);
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);
    return (
        <section id="about" className="py-24 relative bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold tracking-tighter mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                            USER_IDENTITY
                        </h2>
                        <div className="space-y-4 text-lg text-muted-foreground font-mono">
                            <p>
                                <span className="text-primary">&gt;</span> INITIALIZING BIO_SCAN...
                            </p>
                            <p>
                                {bio}
                            </p>
                            <p>
                                <span className="text-primary">&gt;</span> SKILL_SET_DETECTED:
                            </p>
                            <ul className="grid grid-cols-2 gap-2 pl-4">
                                {skills.map((skill) => (
                                    <li key={skill} className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_5px_rgba(0,255,255,0.8)]" />
                                        {skill}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </motion.div>

                    {/* Visual Element (Identity Disc Concept) */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative flex items-center justify-center"
                    >
                        <div className="relative w-80 h-80 md:w-96 md:h-96">
                            {/* Outer Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30"
                            />
                            {/* Inner Ring */}
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 rounded-full border border-primary/50 shadow-[0_0_20px_rgba(0,255,255,0.2)]"
                            />
                            {/* Core */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-32 h-32 rounded-full bg-primary/10 backdrop-blur-md border border-primary flex items-center justify-center shadow-[0_0_30px_rgba(0,255,255,0.4)]">
                                    <span className="text-4xl font-bold text-primary">HJ</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
