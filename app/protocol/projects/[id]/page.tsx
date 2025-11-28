"use client";

import { useState, useEffect } from "react";
import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { ProjectFormData, Project } from "@/types/project";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";

export default function EditProject() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;

    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const docRef = doc(db, "projects", projectId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProject({
                        id: docSnap.id,
                        ...docSnap.data(),
                        createdAt: docSnap.data().createdAt?.toDate(),
                        updatedAt: docSnap.data().updatedAt?.toDate(),
                    } as Project);
                } else {
                    alert("Project not found");
                    router.push("/protocol/projects");
                }
            } catch (error) {
                console.error("Error fetching project:", error);
                alert("Failed to load project");
                router.push("/protocol/projects");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, router]);

    const handleSave = async (data: ProjectFormData) => {
        try {
            const docRef = doc(db, "projects", projectId);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });

            alert("✅ Project updated successfully!");
            router.push("/protocol/projects");
        } catch (error) {
            console.error("Error updating project:", error);
            alert("❌ Failed to update project");
        }
    };

    const handleCancel = () => {
        router.push("/protocol/projects");
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground font-mono">LOADING_PROJECT...</p>
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-primary tracking-tighter">EDIT_PROJECT</h1>
            <div className="p-6 rounded-xl border border-border bg-card/50">
                <ProjectEditor
                    initialData={project}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}
