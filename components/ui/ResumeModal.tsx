"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { trackResumeDownload } from "@/lib/analytics";

const defaultRoles = [
    { id: "devops", label: "DevOps Engineer" },
    { id: "ai-ml", label: "AI/ML Engineer" },
    { id: "software", label: "Software Engineer" },
    { id: "backend", label: "Backend Developer" },
];

interface ResumeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ResumeData {
    url: string;
    publicId: string;
    uploadedAt: Date;
}

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [resumes, setResumes] = useState<Record<string, ResumeData>>({});
    const [customRoles, setCustomRoles] = useState<Array<{ id: string; label: string }>>([]);
    const [loading, setLoading] = useState(true);
    const [downloading, setDownloading] = useState(false);

    const allRoles = [...defaultRoles, ...customRoles];

    useEffect(() => {
        if (isOpen) {
            loadResumes();
            loadCustomRoles();
        }
    }, [isOpen]);

    const loadCustomRoles = async () => {
        try {
            const docRef = doc(db, "settings", "resume_roles");
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                if (data.roles && Array.isArray(data.roles)) {
                    setCustomRoles(data.roles);
                }
            }
        } catch (error) {
            console.error("Error loading custom roles:", error);
        }
    };

    const loadResumes = async () => {
        try {
            const docRef = doc(db, "settings", "resumes");
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setResumes(docSnap.data() as Record<string, ResumeData>);
            }
        } catch (error) {
            console.error("Error loading resumes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        const role = allRoles.find(r => r.id === selectedRole);
        const resume = resumes[selectedRole];

        if (role && resume) {
            setDownloading(true);
            try {
                // Track download
                trackResumeDownload(role.id);

                const fileName = `${role.label.replace(/\s+/g, '_')}_Resume.pdf`;

                // Fetch the file
                const response = await fetch(resume.url);
                const blob = await response.blob();

                // Create download link
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

                onClose();
            } catch (error) {
                console.error('Download error:', error);
                alert('Failed to download resume. Please try again.');
            } finally {
                setDownloading(false);
            }
        }
    };

    const availableRoles = allRoles.filter(role => resumes[role.id]);

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

                        {loading ? (
                            <div className="flex items-center justify-center py-8">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : availableRoles.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No resumes available yet.</p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-3 mb-6">
                                    {availableRoles.map((role) => (
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
                                    disabled={!selectedRole || downloading}
                                    className="w-full py-3 px-4 bg-primary text-black font-bold rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 tracking-widest"
                                >
                                    {downloading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            DOWNLOADING...
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            DOWNLOAD_RESUME
                                        </>
                                    )}
                                </button>
                            </>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
