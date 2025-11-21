"use client";

import { useState, useEffect } from "react";
import { FileText, Check, AlertCircle, Upload, Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, getDoc, deleteField, updateDoc } from "firebase/firestore";

const roles = [
    { id: "devops", label: "DevOps Engineer" },
    { id: "ai-ml", label: "AI/ML Engineer" },
    { id: "software", label: "Software Engineer" },
    { id: "backend", label: "Backend Developer" },
];

interface ResumeData {
    url: string;
    publicId: string;
    uploadedAt: Date;
}

export default function AdminResumes() {
    const [resumes, setResumes] = useState<Record<string, ResumeData>>({});
    const [uploading, setUploading] = useState<string | null>(null);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadResumes();
    }, []);

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

    const handleUpload = async (roleId: string, file: File) => {
        if (!file) return;

        const role = roles.find(r => r.id === roleId);
        if (!role) return;

        setUploading(roleId);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', roleId);

            const response = await fetch('/api/upload-resume', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();

            // Save to Firestore
            const docRef = doc(db, "settings", "resumes");
            await setDoc(docRef, {
                [roleId]: {
                    url: data.url,
                    publicId: data.publicId,
                    uploadedAt: new Date(),
                }
            }, { merge: true });

            alert(`✅ ${role.label} resume uploaded successfully!`);
            await loadResumes();
        } catch (error) {
            console.error('Upload error:', error);
            alert('❌ Upload failed. Please try again.');
        } finally {
            setUploading(null);
        }
    };

    const handleDelete = async (roleId: string) => {
        const role = roles.find(r => r.id === roleId);
        if (!role) return;

        if (!confirm(`Delete ${role.label} resume?`)) return;

        setDeleting(roleId);

        try {
            const resume = resumes[roleId];
            if (!resume) return;

            // Delete from Cloudinary
            const response = await fetch('/api/upload-resume', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ publicId: resume.publicId }),
            });

            if (!response.ok) {
                throw new Error('Delete failed');
            }

            // Remove from Firestore
            const docRef = doc(db, "settings", "resumes");
            await updateDoc(docRef, {
                [roleId]: deleteField()
            });

            alert(`✅ ${role.label} resume deleted successfully!`);
            await loadResumes();
        } catch (error) {
            console.error('Delete error:', error);
            alert('❌ Delete failed. Please try again.');
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                    <p className="mt-4 text-muted-foreground font-mono">LOADING...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-4 text-primary tracking-tighter">RESUME_MANAGEMENT</h1>

            <div className="mb-8 p-6 rounded-xl border border-primary/20 bg-card/50">
                <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-primary mt-1" />
                    <div>
                        <h2 className="font-bold text-lg mb-2">Cloudinary Resume Storage</h2>
                        <p className="text-sm text-muted-foreground mb-3">
                            Upload PDF resumes for different roles. Files are stored securely on Cloudinary.
                        </p>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                            {roles.map(role => (
                                <li key={role.id} className="flex items-center gap-2">
                                    <span className="text-primary">→</span>
                                    <span>{role.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="grid gap-6">
                {roles.map((role) => {
                    const resume = resumes[role.id];
                    const hasResume = !!resume;

                    return (
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
                                    {hasResume && (
                                        <p className="text-xs text-muted-foreground">
                                            Uploaded: {new Date(resume.uploadedAt).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                {hasResume ? (
                                    <>
                                        <a
                                            href={resume.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs font-mono text-green-500 flex items-center gap-1 border border-green-500/30 px-3 py-1.5 rounded hover:bg-green-500/10 transition-colors"
                                        >
                                            <Check className="w-3 h-3" />
                                            AVAILABLE
                                        </a>

                                        <button
                                            onClick={() => handleDelete(role.id)}
                                            disabled={!!deleting}
                                            className="px-3 py-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-md hover:bg-destructive/20 transition-colors text-xs font-medium flex items-center gap-2"
                                        >
                                            {deleting === role.id ? (
                                                <Loader2 className="w-3 h-3 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-3 h-3" />
                                            )}
                                            DELETE
                                        </button>
                                    </>
                                ) : (
                                    <span className="text-xs font-mono text-muted-foreground flex items-center gap-1 border border-border px-3 py-1.5 rounded">
                                        <AlertCircle className="w-3 h-3" />
                                        NOT_UPLOADED
                                    </span>
                                )}

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
                                        {uploading === role.id ? "UPLOADING..." : hasResume ? "REPLACE" : "UPLOAD"}
                                    </div>
                                </label>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-8 p-4 rounded-lg bg-muted/50 border border-border">
                <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Note:</strong> Resumes are stored on Cloudinary and URLs are saved in Firestore.
                    Maximum file size: 10MB per resume.
                </p>
            </div>
        </div>
    );
}
