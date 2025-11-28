"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ExternalLink, Github, Code2 } from "lucide-react";
import { Project } from "@/types/project";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

interface ProjectModalProps {
    project: Project | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProjectModal({ project, isOpen, onClose }: ProjectModalProps) {
    const { lenis } = useSmoothScroll();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            lenis?.stop();
        } else {
            document.body.style.overflow = 'unset';
            lenis?.start();
        }
        return () => {
            document.body.style.overflow = 'unset';
            lenis?.start();
        };
    }, [isOpen, lenis]);

    if (!project) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="bg-card border border-primary/20 rounded-xl p-8 max-w-2xl w-full relative shadow-[0_0_50px_rgba(0,255,255,0.2)] max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 mb-2">
                                {project.title}
                            </h2>
                            <p className="text-sm text-muted-foreground font-mono">
                                // PROJECT_DETAILS
                            </p>
                        </div>

                        {/* Image */}
                        {project.image && (
                            <div className="mb-6 rounded-lg overflow-hidden border border-primary/20">
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-full h-64 object-cover"
                                />
                            </div>
                        )}

                        {/* Summary */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-primary mb-2 flex items-center gap-2">
                                <Code2 className="w-5 h-5" />
                                SUMMARY
                            </h3>
                            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                                {project.summary}
                            </p>
                        </div>

                        {/* Tech Stack */}
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-primary mb-3">TECH_STACK</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.techStack.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-md text-sm font-mono text-primary"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Links */}
                        <div className="flex gap-3">
                            {project.link && (
                                <a
                                    href={project.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-3 px-4 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    LIVE_DEMO
                                </a>
                            )}
                            {project.github && (
                                <a
                                    href={project.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-3 px-4 bg-muted border border-border text-foreground font-bold rounded-lg hover:bg-muted/80 transition-all flex items-center justify-center gap-2"
                                >
                                    <Github className="w-4 h-4" />
                                    VIEW_CODE
                                </a>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
