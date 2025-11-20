"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { ProjectModal } from "@/components/ui/ProjectModal";
import { Project } from "@/types/project";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

export function Projects() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const q = query(
                    collection(db, "projects"),
                    orderBy("order", "asc")
                );
                const querySnapshot = await getDocs(q);
                const projectsData = querySnapshot.docs
                    .map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        createdAt: doc.data().createdAt?.toDate(),
                        updatedAt: doc.data().updatedAt?.toDate(),
                    }) as Project)
                    .filter(project => project.featured);
                setProjects(projectsData);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, []);

    const handleProjectClick = (project: Project) => {
        setSelectedProject(project);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProject(null), 300);
    };

    return (
        <section id="projects" className="py-24 relative bg-background overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50 drop-shadow-[0_0_10px_rgba(0,255,255,0.3)]">
                        SYSTEM_MODULES
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto font-mono">
                        // DEPLOYED_PROJECTS_AND_EXPERIMENTS
                    </p>
                </motion.div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        <p className="mt-4 text-muted-foreground font-mono">LOADING_MODULES...</p>
                    </div>
                ) : projects.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground font-mono">NO_PROJECTS_AVAILABLE</p>
                        <p className="text-sm text-muted-foreground mt-2">Add projects from the admin panel</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group relative cursor-pointer"
                                onClick={() => handleProjectClick(project)}
                            >
                                {/* Card Border Gradient */}
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-xl opacity-0 group-hover:opacity-100 transition duration-500 blur group-hover:blur-md" />

                                <div className="relative h-full p-6 rounded-xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/80 transition-colors flex flex-col overflow-hidden">
                                    <BorderBeam size={250} duration={12} delay={9} />

                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    <div className="relative z-10 flex-1">
                                        {project.image && (
                                            <div className="mb-4 rounded-lg overflow-hidden border border-primary/20">
                                                <img
                                                    src={project.image}
                                                    alt={project.title}
                                                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                                                />
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="p-2 rounded-md bg-primary/10 text-primary">
                                                <Layers className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">
                                                {project.title}
                                            </h3>
                                        </div>

                                        <p className="text-muted-foreground mb-6 line-clamp-3">
                                            {project.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {project.techStack.slice(0, 3).map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="px-2 py-1 text-xs font-mono rounded-md bg-primary/10 text-primary border border-primary/20"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.techStack.length > 3 && (
                                                <span className="px-2 py-1 text-xs font-mono rounded-md bg-muted text-muted-foreground">
                                                    +{project.techStack.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="relative z-10 flex items-center gap-4 mt-auto pt-4 border-t border-border/50">
                                        {project.github && (
                                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors">
                                                <Github className="w-4 h-4" />
                                                SOURCE
                                            </div>
                                        )}
                                        {project.link && (
                                            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-primary transition-colors ml-auto">
                                                DEPLOY
                                                <ExternalLink className="w-4 h-4" />
                                            </div>
                                        )}
                                        {!project.github && !project.link && (
                                            <div className="text-sm font-medium text-muted-foreground">
                                                CLICK_FOR_DETAILS
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <ProjectModal
                project={selectedProject}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </section>
    );
}
