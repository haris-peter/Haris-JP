"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { Loader2, BarChart3, FileText, Download, Users } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminAnalytics() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        visits: 0,
        downloads: {} as Record<string, number>,
        blogViews: {} as Record<string, number>
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch visits
                const visitsDoc = await getDoc(doc(db, "analytics", "general"));
                const visits = visitsDoc.exists() ? visitsDoc.data().totalVisits : 0;

                // Fetch downloads
                const downloadsDoc = await getDoc(doc(db, "analytics", "resumes"));
                const downloads = downloadsDoc.exists() ? downloadsDoc.data() : {};

                // Fetch blog views
                const blogsDoc = await getDoc(doc(db, "analytics", "blogs"));
                const blogViews = blogsDoc.exists() ? blogsDoc.data() : {};

                setStats({
                    visits,
                    downloads,
                    blogViews
                });
            } catch (error) {
                console.error("Error fetching analytics:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="p-8 flex justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-primary tracking-tighter">ANALYTICS_DASHBOARD</h1>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 rounded-xl border border-primary/20 bg-card/50"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Total Visits</h3>
                    </div>
                    <p className="text-4xl font-bold tracking-tighter">{stats.visits.toLocaleString()}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="p-6 rounded-xl border border-primary/20 bg-card/50"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            <Download className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Total Downloads</h3>
                    </div>
                    <p className="text-4xl font-bold tracking-tighter">
                        {Object.values(stats.downloads).reduce((a: any, b: any) => a + b, 0).toLocaleString()}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 rounded-xl border border-primary/20 bg-card/50"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary">
                            <FileText className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-lg">Total Blog Views</h3>
                    </div>
                    <p className="text-4xl font-bold tracking-tighter">
                        {Object.values(stats.blogViews).reduce((a: any, b: any) => a + b, 0).toLocaleString()}
                    </p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Resume Downloads Breakdown */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="p-6 rounded-xl border border-border bg-card/30"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-primary" />
                        Resume Downloads by Role
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(stats.downloads).length === 0 ? (
                            <p className="text-muted-foreground text-sm">No downloads yet.</p>
                        ) : (
                            Object.entries(stats.downloads)
                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                .map(([role, count]) => (
                                    <div key={role} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                                        <span className="font-mono text-sm capitalize">{role.replace(/-/g, ' ')}</span>
                                        <span className="font-bold text-primary">{count as number}</span>
                                    </div>
                                ))
                        )}
                    </div>
                </motion.div>

                {/* Blog Views Breakdown */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-6 rounded-xl border border-border bg-card/30"
                >
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        Top Blog Posts
                    </h3>
                    <div className="space-y-4">
                        {Object.entries(stats.blogViews).length === 0 ? (
                            <p className="text-muted-foreground text-sm">No views yet.</p>
                        ) : (
                            Object.entries(stats.blogViews)
                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                .map(([slug, count]) => (
                                    <div key={slug} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border">
                                        <span className="font-mono text-sm truncate max-w-[200px]" title={slug}>{slug}</span>
                                        <span className="font-bold text-primary">{count as number}</span>
                                    </div>
                                ))
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
