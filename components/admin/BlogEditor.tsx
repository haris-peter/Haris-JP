"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";

interface BlogEditorProps {
    initialData?: {
        title: string;
        slug: string;
        content: string;
        excerpt?: string;
    };
    onSave?: (data: { title: string; slug: string; content: string; excerpt: string }) => Promise<void>;
}

export function BlogEditor({ initialData, onSave }: BlogEditorProps) {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [content, setContent] = useState("");
    const [excerpt, setExcerpt] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Load initial data if editing
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title || "");
            setSlug(initialData.slug || "");
            setContent(initialData.content || "");
            setExcerpt(initialData.excerpt || "");
        }
    }, [initialData]);

    const handlePublish = async () => {
        if (!title || !slug || !content) {
            alert("Please fill in all required fields");
            return;
        }

        setLoading(true);
        try {
            if (onSave) {
                // Edit mode - use custom save handler
                await onSave({ title, slug, content, excerpt });
            } else {
                // Create mode - add new document
                await addDoc(collection(db, "posts"), {
                    title,
                    slug,
                    content,
                    excerpt,
                    publishedAt: serverTimestamp(),
                });
                alert("✅ Post published successfully!");
                router.push("/protocol/blog");
            }
        } catch (error) {
            console.error("Error publishing post:", error);
            alert("❌ Failed to publish post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-primary tracking-tighter">
                    {initialData ? "EDIT_POST" : "CREATE_NEW_POST"}
                </h1>
                <button
                    onClick={handlePublish}
                    disabled={loading}
                    className="px-6 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary/90 disabled:opacity-50"
                >
                    {loading ? "SAVING..." : "PUBLISH_POST"}
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                        type="text"
                        placeholder="Post Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2 text-2xl font-bold bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">URL Slug *</label>
                    <input
                        type="text"
                        placeholder="url-slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                        className="w-full p-2 rounded-md border border-border bg-muted font-mono text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Excerpt (optional)</label>
                    <textarea
                        placeholder="Short description for preview..."
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                        className="w-full h-20 p-4 rounded-md border border-border bg-muted resize-none focus:ring-2 focus:ring-primary/20"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Content * (Markdown)</label>
                    <textarea
                        placeholder="Write your story in Markdown..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-[50vh] p-4 rounded-xl border border-border bg-muted resize-none focus:ring-2 focus:ring-primary/20 font-mono"
                    />
                </div>
            </div>
        </div>
    );
}

// Default export for backward compatibility
export default BlogEditor;
