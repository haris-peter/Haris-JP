"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { auth, db } from "@/lib/firebase";
import { collection, getCountFromServer } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
    const { user } = useAuth();
    const [counts, setCounts] = useState({
        posts: 0,
        projects: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCounts = async () => {
            try {
                const postsSnapshot = await getCountFromServer(collection(db, "posts"));
                const projectsSnapshot = await getCountFromServer(collection(db, "projects"));

                setCounts({
                    posts: postsSnapshot.data().count,
                    projects: projectsSnapshot.data().count,
                });
            } catch (error) {
                console.error("Error fetching counts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCounts();
    }, []);

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-border/50">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">
                        COMMAND_CENTER
                    </h1>
                    <p className="text-muted-foreground font-mono text-xs md:text-sm mt-1">
                        // WELCOME_BACK_USER: {user?.displayName}
                    </p>
                </div>
                <button
                    onClick={() => auth.signOut()}
                    className="px-4 py-2 text-xs font-mono border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors tracking-widest rounded-md w-full md:w-auto"
                >
                    TERMINATE_SESSION
                </button>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-xl border border-primary/20 bg-card/30 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                    <h3 className="text-xs font-mono text-primary tracking-widest mb-2 relative z-10">BLOG_POSTS</h3>
                    <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors relative z-10">
                        {loading ? "..." : counts.posts}
                    </p>
                </div>
                <div className="p-6 rounded-xl border border-primary/20 bg-card/30 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                    <h3 className="text-xs font-mono text-primary tracking-widest mb-2 relative z-10">PROJECTS</h3>
                    <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors relative z-10">
                        {loading ? "..." : counts.projects}
                    </p>
                </div>
                <div className="p-6 rounded-xl border border-primary/20 bg-card/30 backdrop-blur-sm relative overflow-hidden group">
                    <div className="absolute inset-0 bg-grid-pattern opacity-10" />
                    <h3 className="text-xs font-mono text-primary tracking-widest mb-2 relative z-10">ADMIN_STATUS</h3>
                    <p className="text-xl font-bold text-green-500 group-hover:text-primary transition-colors relative z-10">
                        ACTIVE
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card/50">
                    <h3 className="text-lg font-bold text-primary mb-4">QUICK_ACTIONS</h3>
                    <div className="space-y-2">
                        <a href="/protocol/blog/new" className="block p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors text-sm font-mono">
                            → CREATE_NEW_POST
                        </a>
                        <a href="/protocol/projects/new" className="block p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors text-sm font-mono">
                            → CREATE_NEW_PROJECT
                        </a>
                        <a href="/protocol/resumes" className="block p-3 rounded-md bg-muted hover:bg-muted/80 transition-colors text-sm font-mono">
                            → MANAGE_RESUMES
                        </a>
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card/50">
                    <h3 className="text-lg font-bold text-primary mb-4">SYSTEM_INFO</h3>
                    <div className="space-y-2 text-sm font-mono">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">USER:</span>
                            <span className="text-foreground">{user?.email}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">ROLE:</span>
                            <span className="text-primary">ADMIN</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">SESSION:</span>
                            <span className="text-green-500">AUTHENTICATED</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
