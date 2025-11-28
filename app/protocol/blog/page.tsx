"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, getDocs, deleteDoc, doc } from "firebase/firestore";
import Link from "next/link";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";

export default function AdminBlog() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchPosts = async () => {
        const q = query(collection(db, "posts"), orderBy("publishedAt", "desc"));
        const snapshot = await getDocs(q);
        setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete post "${title}"?`)) return;

        setDeleting(id);
        try {
            await deleteDoc(doc(db, "posts", id));
            setPosts(prev => prev.filter(p => p.id !== id));
            alert("✅ Post deleted successfully!");
        } catch (error) {
            console.error("Error deleting post:", error);
            alert("❌ Failed to delete post");
        } finally {
            setDeleting(null);
        }
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-primary tracking-tighter">BLOG_MANAGEMENT</h1>
                <Link
                    href="/protocol/blog/new"
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary/90"
                >
                    <Plus className="w-4 h-4" />
                    CREATE_NEW
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground font-mono">LOADING_POSTS...</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {posts.map((post) => (
                        <div key={post.id} className="p-6 rounded-xl border border-border bg-card/50 flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-bold mb-1">{post.title}</h3>
                                <p className="text-sm text-muted-foreground font-mono">/{post.slug}</p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {post.publishedAt?.toDate?.()?.toLocaleDateString() || 'No date'}
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/protocol/blog/${post.id}`}
                                    className="p-2 bg-muted border border-border rounded-md hover:bg-muted/80 transition-colors"
                                >
                                    <Pencil className="w-4 h-4" />
                                </Link>
                                <button
                                    onClick={() => handleDelete(post.id, post.title)}
                                    disabled={deleting === post.id}
                                    className="p-2 bg-destructive/10 border border-destructive/30 text-destructive rounded-md hover:bg-destructive/20 transition-colors disabled:opacity-50"
                                >
                                    {deleting === post.id ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                </button>
                            </div>
                        </div>
                    ))}
                    {posts.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl">
                            <p className="font-mono mb-4">NO_POSTS_YET</p>
                            <Link
                                href="/protocol/blog/new"
                                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary/90"
                            >
                                <Plus className="w-4 h-4" />
                                CREATE_FIRST_POST
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
