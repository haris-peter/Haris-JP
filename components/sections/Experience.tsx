"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Experience } from "@/types/experience";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot } from "firebase/firestore";
import { Briefcase, Calendar, Code2 } from "lucide-react";

export function ExperienceSection() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "experiences"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const experiencesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Experience[];

            experiencesData.sort((a, b) => a.order - b.order);
            setExperiences(experiencesData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching experiences:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <section id="experience" className="py-24 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="mt-4 text-muted-foreground font-mono">LOADING_EXPERIENCE...</p>
                    </div>
                </div>
            </section>
        );
    }

    if (experiences.length === 0) {
        return null;
    }

    return (
        <section id="experience" className="py-24 bg-background relative overflow-hidden">
            {/* Subtle grid background */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />

            <div className="container mx-auto px-4 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-20"
                >
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/50">
                            EXPERIENCE
                        </span>
                    </h2>
                    <p className="text-muted-foreground font-mono text-sm md:text-base max-w-2xl mx-auto">
                        Journey through the digital grid
                    </p>
                </motion.div>

                {/* Clean Timeline */}
                <div className="max-w-4xl mx-auto">
                    {experiences.map((experience, index) => (
                        <motion.div
                            key={experience.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="relative pl-8 md:pl-12 pb-16 last:pb-0 group"
                        >
                            {/* Vertical line */}
                            {index !== experiences.length - 1 && (
                                <div className="absolute left-[11px] md:left-[19px] top-8 bottom-0 w-px bg-gradient-to-b from-primary/50 via-primary/30 to-transparent" />
                            )}

                            {/* Timeline dot with glow */}
                            <div className="absolute left-0 md:left-2 top-2 w-6 h-6 rounded-full border-2 border-primary bg-background flex items-center justify-center group-hover:scale-125 transition-all duration-300 z-20">
                                <div className="w-2 h-2 rounded-full bg-primary group-hover:shadow-[0_0_12px_rgba(0,240,255,0.8)] transition-all duration-300" />
                            </div>

                            {/* Content card */}
                            <div className="bg-card/30 backdrop-blur-sm border border-border rounded-lg p-6 md:p-8 hover:border-primary/50 hover:bg-card/50 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)] transition-all duration-300">
                                {/* Header */}
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                                    <div className="flex-1">
                                        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                                            {experience.position}
                                        </h3>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1.5">
                                                <Briefcase className="w-4 h-4" />
                                                {experience.company}
                                            </span>
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-4 h-4" />
                                                {experience.duration}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Company logo */}
                                    {experience.logo && (
                                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-background border border-border flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:border-primary/50 transition-colors">
                                            <img
                                                src={experience.logo}
                                                alt={experience.company}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Description */}
                                <p className="text-foreground/80 mb-4 leading-relaxed">
                                    {experience.description}
                                </p>

                                {/* Technologies */}
                                {experience.technologies.length > 0 && (
                                    <div className="flex items-start gap-2">
                                        <Code2 className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                                        <div className="flex flex-wrap gap-2">
                                            {experience.technologies.map((tech, i) => (
                                                <span
                                                    key={i}
                                                    className="px-2.5 py-1 text-xs font-mono bg-primary/10 text-primary/90 border border-primary/20 rounded hover:bg-primary/20 hover:border-primary/40 transition-colors"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
