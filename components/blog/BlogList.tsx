"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Link from "next/link";

export function BlogList() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            const q = query(collection(db, "posts"), orderBy("publishedAt", "desc"));
            const snapshot = await getDocs(q);
            setPosts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            setLoading(false);
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="text-center py-12 text-muted-foreground animate-pulse">LOADING_DATA_STREAM...</div>;

    return (
        <div className="grid gap-8">
            {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                    <article className="p-6 rounded-2xl border border-border bg-card hover:bg-accent/5 transition-colors relative overflow-hidden">
                        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
                        <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{post.title}</h2>
                        <p className="text-muted-foreground line-clamp-2 font-mono text-sm">
                            {post.content?.substring(0, 150)}...
                        </p>
                        <div className="mt-4 text-sm text-primary font-mono tracking-wider">
                            READ_PROTOCOL &gt;
                        </div>
                    </article>
                </Link>
            ))}
            {posts.length === 0 && (
                <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-xl font-mono">
                    NO_DATA_FOUND
                </div>
            )}
        </div>
    );
}
