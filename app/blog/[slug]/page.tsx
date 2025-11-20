"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Navbar } from "@/components/layout/Navbar";
import { CommentSection } from "@/components/blog/CommentSection";
import ReactMarkdown from "react-markdown";
import { useParams } from "next/navigation";

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;
        const fetchPost = async () => {
            const q = query(collection(db, "posts"), where("slug", "==", slug));
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                setPost({ id: snapshot.docs[0].id, ...snapshot.docs[0].data() });
            }
            setLoading(false);
        };
        fetchPost();
    }, [slug]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    if (!post) return <div className="min-h-screen flex items-center justify-center">Post not found</div>;

    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />
            <div className="h-32" />

            <article className="container mx-auto px-4 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter">{post.title}</h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown>{post.content}</ReactMarkdown>
                </div>

                {/* Comments Section */}
                <CommentSection postId={post.id} />
            </article>
        </main>
    );
}
