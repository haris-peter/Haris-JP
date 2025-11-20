"use client";

import { useState, useEffect } from "react";
import { ExperienceEditor } from "@/components/admin/ExperienceEditor";
import { ExperienceFormData } from "@/types/experience";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";

export default function EditExperience() {
    const router = useRouter();
    const params = useParams();
    const [initialData, setInitialData] = useState<ExperienceFormData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperience = async () => {
            if (!params.id) return;

            try {
                const docRef = doc(db, "experiences", params.id as string);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setInitialData({
                        company: data.company,
                        position: data.position,
                        duration: data.duration,
                        description: data.description,
                        technologies: data.technologies,
                        logo: data.logo,
                        order: data.order,
                        featured: data.featured,
                    });
                }
            } catch (error) {
                console.error("Error fetching experience:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchExperience();
    }, [params.id]);

    const handleSave = async (data: ExperienceFormData) => {
        try {
            const docRef = doc(db, "experiences", params.id as string);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });

            router.push("/protocol/experience");
        } catch (error) {
            console.error("Error updating experience:", error);
            alert("Failed to update experience");
            throw error;
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground font-mono">LOADING...</p>
            </div>
        );
    }

    if (!initialData) {
        return (
            <div className="p-8 text-center">
                <p className="text-destructive font-mono">EXPERIENCE_NOT_FOUND</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <ExperienceEditor initialData={initialData} onSave={handleSave} />
        </div>
    );
}
