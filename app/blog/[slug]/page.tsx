"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Navbar } from "@/components/layout/Navbar";
import { CommentSection } from "@/components/blog/CommentSection";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css"; // Import highlight.js style
import { useParams } from "next/navigation";
import { trackBlogView } from "@/lib/analytics";

export default function BlogPost() {
    const { slug } = useParams();
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        // Track view
        trackBlogView(slug as string);

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

                <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-p:leading-relaxed prose-li:leading-relaxed">
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                            h1: ({ node, ...props }) => (
                                <h1 className="text-3xl md:text-4xl font-bold mt-12 mb-6 text-primary border-b border-primary/20 pb-4" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2 className="text-2xl md:text-3xl font-bold mt-10 mb-5 text-foreground flex items-center gap-2" {...props}>
                                    <span className="text-primary">#</span> {props.children}
                                </h2>
                            ),
                            h3: ({ node, ...props }) => (
                                <h3 className="text-xl md:text-2xl font-bold mt-8 mb-4 text-foreground/90" {...props} />
                            ),
                            p: ({ node, ...props }) => (
                                <p className="mb-6 text-muted-foreground leading-7" {...props} />
                            ),
                            ul: ({ node, ...props }) => (
                                <ul className="list-disc list-outside ml-6 mb-6 space-y-2 text-muted-foreground" {...props} />
                            ),
                            ol: ({ node, ...props }) => (
                                <ol className="list-decimal list-outside ml-6 mb-6 space-y-2 text-muted-foreground" {...props} />
                            ),
                            li: ({ node, ...props }) => (
                                <li className="pl-2" {...props} />
                            ),
                            a: ({ node, ...props }) => (
                                <a className="text-primary hover:underline underline-offset-4 transition-colors" {...props} />
                            ),
                            code({ node, inline, className, children, ...props }: any) {
                                const match = /language-(\w+)/.exec(className || "");
                                return !inline && match ? (
                                    <div className="relative group">
                                        <div className="absolute -top-3 right-2 text-xs text-primary/50 font-mono uppercase">
                                            {match[1]}
                                        </div>
                                        <code className={className} {...props}>
                                            {children}
                                        </code>
                                    </div>
                                ) : (
                                    <code className="bg-primary/10 text-primary px-1 py-0.5 rounded font-mono text-sm" {...props}>
                                        {children}
                                    </code>
                                );
                            },
                            img: ({ node, ...props }) => (
                                <div className="my-8 relative rounded-lg overflow-hidden border border-primary/20 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
                                    <img {...props} className="w-full h-auto" alt={props.alt || "Blog Image"} />
                                </div>
                            ),
                            table: ({ node, ...props }) => (
                                <div className="overflow-x-auto my-8 border border-primary/20 rounded-lg">
                                    <table className="w-full text-left border-collapse" {...props} />
                                </div>
                            ),
                            th: ({ node, ...props }) => (
                                <th className="p-4 border-b border-primary/20 bg-primary/5 text-primary font-bold tracking-wider" {...props} />
                            ),
                            td: ({ node, ...props }) => (
                                <td className="p-4 border-b border-primary/10" {...props} />
                            ),
                            blockquote: ({ node, ...props }) => (
                                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground bg-primary/5 py-2 pr-4 rounded-r-lg my-6" {...props} />
                            ),
                        }}
                    >
                        {post.content}
                    </ReactMarkdown>
                </div>

                {/* Comments Section */}
                <CommentSection postId={post.id} />
            </article>
        </main>
    );
}
