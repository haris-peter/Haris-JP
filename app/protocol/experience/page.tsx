"use client";

import { useState, useEffect } from "react";
import { Experience } from "@/types/experience";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2, Briefcase } from "lucide-react";

export default function AdminExperience() {
    const [experiences, setExperiences] = useState<Experience[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        const q = collection(db, "experiences");

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const experiencesData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Experience[];

            // Sort by order
            experiencesData.sort((a, b) => a.order - b.order);

            setExperiences(experiencesData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this experience?")) return;

        setDeleting(id);
        try {
            await deleteDoc(doc(db, "experiences", id));
        } catch (error) {
            console.error("Error deleting experience:", error);
            alert("Failed to delete experience");
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground font-mono">LOADING_EXPERIENCES...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-primary tracking-tighter">EXPERIENCE_MANAGEMENT</h1>
                <Link
                    href="/protocol/experience/new"
                    className="px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary/90 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    CREATE_NEW
                </Link>
            </div>

            {experiences.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground font-mono">NO_EXPERIENCES_YET</p>
                    <p className="text-sm text-muted-foreground mt-2">Create your first experience entry</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {experiences.map((experience) => (
                        <div
                            key={experience.id}
                            className="p-6 rounded-xl border border-border bg-card/50 hover:border-primary/30 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {experience.logo && (
                                            <img
                                                src={experience.logo}
                                                alt={experience.company}
                                                className="w-10 h-10 rounded object-contain bg-background border border-border p-1"
                                            />
                                        )}
                                        <div>
                                            <h3 className="text-xl font-bold text-primary">{experience.position}</h3>
                                            <p className="text-sm text-muted-foreground">{experience.company} • {experience.duration}</p>
                                        </div>
                                    </div>
                                    <p className="text-foreground mb-3 line-clamp-2">{experience.description}</p>
                                    <div className="flex flex-wrap gap-2">
                                        {experience.technologies.slice(0, 5).map((tech, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 text-xs bg-primary/10 text-primary border border-primary/30 rounded"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {experience.technologies.length > 5 && (
                                            <span className="px-2 py-1 text-xs text-muted-foreground">
                                                +{experience.technologies.length - 5} more
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                                        <span>Order: {experience.order}</span>
                                        {experience.featured && (
                                            <span className="px-2 py-0.5 bg-primary/20 text-primary rounded">FEATURED</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <Link
                                        href={`/protocol/experience/${experience.id}`}
                                        className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(experience.id)}
                                        disabled={deleting === experience.id}
                                        className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors disabled:opacity-50"
                                    >
                                        {deleting === experience.id ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="w-4 h-4" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
