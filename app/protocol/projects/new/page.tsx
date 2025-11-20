"use client";

import { ProjectEditor } from "@/components/admin/ProjectEditor";
import { ProjectFormData } from "@/types/project";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function NewProject() {
    const router = useRouter();

    const handleSave = async (data: ProjectFormData) => {
        try {
            // Get the highest order number
            const projectsRef = collection(db, "projects");

            await addDoc(projectsRef, {
                ...data,
                order: Date.now(), // Simple ordering by creation time
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            alert("✅ Project created successfully!");
            router.push("/protocol/projects");
        } catch (error) {
            console.error("Error creating project:", error);
            alert("❌ Failed to create project");
        }
    };

    const handleCancel = () => {
        router.push("/protocol/projects");
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-primary tracking-tighter">CREATE_NEW_PROJECT</h1>
            <div className="p-6 rounded-xl border border-border bg-card/50">
                <ProjectEditor onSave={handleSave} onCancel={handleCancel} />
            </div>
        </div>
    );
}
