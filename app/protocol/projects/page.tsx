"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, orderBy, query } from "firebase/firestore";
import { Project } from "@/types/project";
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function AdminProjects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchProjects = async () => {
        try {
            const q = query(collection(db, "projects"), orderBy("order", "asc"));
            const querySnapshot = await getDocs(q);
            const projectsData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate(),
                updatedAt: doc.data().updatedAt?.toDate(),
            })) as Project[];
            setProjects(projectsData);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete project "${title}"?`)) return;

        setDeleting(id);
        try {
            await deleteDoc(doc(db, "projects", id));
            setProjects(prev => prev.filter(p => p.id !== id));
            alert("Project deleted successfully!");
        } catch (error) {
            console.error("Error deleting project:", error);
            alert("Failed to delete project");
        } finally {
            setDeleting(null);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground font-mono">LOADING_PROJECTS...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-primary tracking-tighter">PROJECT_MANAGEMENT</h1>
                <Link
                    href="/protocol/projects/new"
                    className="px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary/90 flex items-center gap-2"
                >
                    <Plus className="w-4 h-4" />
                    CREATE_NEW
                </Link>
            </div>

            {projects.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <p className="text-muted-foreground font-mono mb-4">NO_PROJECTS_YET</p>
                    <Link
                        href="/protocol/projects/new"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4" />
                        CREATE_FIRST_PROJECT
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-6 rounded-xl border border-border bg-card/50 flex items-start gap-6"
                        >
                            {project.image && (
                                <img
                                    src={project.image}
                                    alt={project.title}
                                    className="w-32 h-32 object-cover rounded-lg border border-primary/20"
                                />
                            )}

                            <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold">{project.title}</h3>
                                        {project.featured && (
                                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-primary/20 text-primary border border-primary/30 rounded">
                                                FEATURED
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/admin/projects/${project.id}`}
                                            className="p-2 bg-muted border border-border rounded-md hover:bg-muted/80 transition-colors"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(project.id, project.title)}
                                            disabled={deleting === project.id}
                                            className="p-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-md hover:bg-destructive/20 transition-colors disabled:opacity-50"
                                        >
                                            {deleting === project.id ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-muted-foreground mb-3">{project.description}</p>

                                <div className="flex flex-wrap gap-2 mb-3">
                                    {project.techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-2 py-0.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded font-mono"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-4 text-xs text-muted-foreground">
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                                            Live Demo →
                                        </a>
                                    )}
                                    {project.github && (
                                        <a href={project.github} target="_blank" rel="noopener noreferrer" className="hover:text-primary">
                                            GitHub →
                                        </a>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
