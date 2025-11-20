"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText } from "lucide-react";

const roles = [
    { id: "devops", label: "DevOps Engineer", file: "/resumes/devops.pdf" },
    { id: "ai-ml", label: "AI/ML Engineer", file: "/resumes/ai-ml.pdf" },
    { id: "software", label: "Software Engineer", file: "/resumes/software.pdf" },
    { id: "backend", label: "Backend Developer", file: "/resumes/backend.pdf" },
];

interface ResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
    const [selectedRole, setSelectedRole] = useState<string>("");

    const handleDownload = () => {
        const role = roles.find(r => r.id === selectedRole);
        if (role) {
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = role.file;
            link.download = `${role.label.replace(/\s+/g, '_')}_Resume.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            onClose();
        }
    };

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
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-card border border-primary/20 rounded-xl p-8 max-w-md w-full relative shadow-[0_0_50px_rgba(0,255,255,0.2)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <FileText className="w-6 h-6 text-primary" />
                            </div>
                            <h2 className="text-2xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">
                                SELECT_ROLE
                            </h2>
                        </div>

                        <p className="text-sm text-muted-foreground mb-6 font-mono">
                            // CHOOSE_YOUR_PREFERRED_RESUME_VERSION
                        </p>

                        <div className="space-y-3 mb-6">
                            {roles.map((role) => (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all text-left font-medium ${selectedRole === role.id
                                            ? "border-primary bg-primary/10 text-primary shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                                            : "border-border hover:border-primary/50 text-foreground"
                                        }`}
                                >
                                    {role.label}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={handleDownload}
                            disabled={!selectedRole}
                            className="w-full py-3 px-4 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 tracking-widest"
                        >
                            <Download className="w-4 h-4" />
                            DOWNLOAD_RESUME
                        </button>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
