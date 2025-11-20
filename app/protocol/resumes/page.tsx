"use client";

import { useState } from "react";
import { FileText, Check, AlertCircle, FolderOpen, Upload, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const roles = [
    { id: "devops", label: "DevOps Engineer", file: "devops.pdf" },
    { id: "ai-ml", label: "AI/ML Engineer", file: "ai-ml.pdf" },
    { id: "software", label: "Software Engineer", file: "software.pdf" },
    { id: "backend", label: "Backend Developer", file: "backend.pdf" },
];

export default function AdminResumes() {
    const [checkedFiles, setCheckedFiles] = useState<Record<string, boolean>>({});
    const [uploading, setUploading] = useState<string | null>(null);

    const checkFileExists = async (filename: string) => {
        try {
            const response = await fetch(`/resumes/${filename}`, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    };

    const handleCheckFile = async (roleId: string, filename: string) => {
        const exists = await checkFileExists(filename);
        setCheckedFiles(prev => ({ ...prev, [roleId]: exists }));
    };

    const handleUpload = async (roleId: string, file: File) => {
        if (!file) return;

        const role = roles.find(r => r.id === roleId);
        if (!role) return;

        setUploading(roleId);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('filename', role.file);

            const response = await fetch('/api/upload-resume', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            alert(`✅ ${role.label} resume uploaded successfully!`);

            // Check file status after upload
            await handleCheckFile(roleId, role.file);
        } catch (error) {
            console.error('Upload error:', error);
            alert('❌ Upload failed. Please try again.');
        } finally {
            setUploading(null);
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-primary tracking-tighter">RESUME_MANAGEMENT</h1>

            <div className="mb-8 p-6 rounded-xl border border-primary/20 bg-card/50">
                <div className="flex items-start gap-3 mb-4">
                    <FolderOpen className="w-5 h-5 text-primary mt-1" />
                    <div>
                        <h2 className="font-bold text-lg mb-2">How to Add Resumes</h2>
                        <p className="text-sm text-muted-foreground mb-3">
                            Upload PDF files using the buttons below, or manually place them in <code className="px-2 py-1 bg-muted rounded text-primary font-mono text-xs">public/resumes/</code> with these exact names:
                        </p>
                        <ul className="space-y-1 text-sm text-muted-foreground font-mono">
                            {roles.map(role => (
                                <li key={role.id} className="flex items-center gap-2">
                                    <span className="text-primary">→</span>
                                    <code className="text-xs bg-muted px-2 py-0.5 rounded">{role.file}</code>
                                    <span className="text-xs">({role.label})</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {roles.map((role) => (
                    <motion.div
                        key={role.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-xl border border-border bg-card/50 flex items-center justify-between gap-4"
                    >
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-primary/10 text-primary">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{role.label}</h3>
                                <p className="text-sm text-muted-foreground font-mono">
                                    File: {role.file}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {checkedFiles[role.id] !== undefined && (
                                checkedFiles[role.id] ? (
                                    <a
                                        href={`/resumes/${role.file}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs font-mono text-green-500 flex items-center gap-1 border border-green-500/30 px-3 py-1.5 rounded hover:bg-green-500/10 transition-colors"
                                    >
                                        <Check className="w-3 h-3" />
                                        AVAILABLE
                                    </a>
                                ) : (
                                    <span className="text-xs font-mono text-destructive flex items-center gap-1 border border-destructive/30 px-3 py-1.5 rounded">
                                        <AlertCircle className="w-3 h-3" />
                                        MISSING
                                    </span>
                                )
                            )}

                            <button
                                onClick={() => handleCheckFile(role.id, role.file)}
                                className="px-3 py-2 bg-muted border border-border text-foreground rounded-md hover:bg-muted/80 transition-colors text-xs font-medium"
                            >
                                CHECK
                            </button>

                            <label className="cursor-pointer">
                                <input
                                    type="file"
                                    accept=".pdf"
                                    className="hidden"
                                    onChange={(e) => e.target.files?.[0] && handleUpload(role.id, e.target.files[0])}
                                    disabled={!!uploading}
                                />
                                <div className="px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2 text-sm">
                                    {uploading === role.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Upload className="w-4 h-4" />
                                    )}
                                    {uploading === role.id ? "UPLOADING..." : "UPLOAD"}
                                </div>
                            </label>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Files are saved to <code className="px-1 bg-background rounded text-primary">/public/resumes/</code>.
                    Click "CHECK" after uploading to verify availability.
                </p>
            </div>
        </div>
    );
}
