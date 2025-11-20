"use client";

import { ExperienceEditor } from "@/components/admin/ExperienceEditor";
import { ExperienceFormData } from "@/types/experience";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function NewExperience() {
    const router = useRouter();

    const handleSave = async (data: ExperienceFormData) => {
        try {
            await addDoc(collection(db, "experiences"), {
                ...data,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            router.push("/protocol/experience");
        } catch (error) {
            console.error("Error creating experience:", error);
            alert("Failed to create experience");
            throw error;
        }
    };

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <ExperienceEditor onSave={handleSave} />
        </div>
    );
}
