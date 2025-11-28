"use client";

import { useState, useEffect } from "react";
import { BlogEditor } from "@/components/admin/BlogEditor";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { useRouter, useParams } from "next/navigation";

export default function EditBlogPost() {
    const router = useRouter();
    const params = useParams();
    const postId = params.id as string;

    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const docRef = doc(db, "posts", postId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPost({
                        id: docSnap.id,
                        ...docSnap.data(),
                    });
                } else {
                    alert("Post not found");
                    router.push("/protocol/blog");
                }
            } catch (error) {
                console.error("Error fetching post:", error);
                alert("Failed to load post");
                router.push("/protocol/blog");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId, router]);

    const handleSave = async (data: { title: string; slug: string; content: string; excerpt: string }) => {
        try {
            const docRef = doc(db, "posts", postId);
            await updateDoc(docRef, {
                ...data,
                updatedAt: serverTimestamp(),
            });

            alert("✅ Post updated successfully!");
            router.push("/protocol/blog");
        } catch (error) {
            console.error("Error updating post:", error);
            alert("❌ Failed to update post");
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground font-mono">LOADING_POST...</p>
            </div>
        );
    }

    if (!post) return null;

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-primary tracking-tighter">EDIT_POST</h1>
            <BlogEditor initialData={post} onSave={handleSave} />
        </div>
    );
}
