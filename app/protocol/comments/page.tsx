"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, query, orderBy, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { Comment } from "@/types/comment";
import { Trash2, MessageSquare, Shield, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AdminComments() {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "active" | "deleted">("all");
    const [deleting, setDeleting] = useState<string | null>(null);

    useEffect(() => {
        const q = query(collection(db, "comments"));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const commentsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                createdAt: doc.data().createdAt?.toDate() || new Date(),
                updatedAt: doc.data().updatedAt?.toDate() || new Date(),
            })) as Comment[];

            // Sort by newest first in JavaScript
            commentsData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            setComments(commentsData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (commentId: string) => {
        if (!confirm("Delete this comment permanently?")) return;

        setDeleting(commentId);
        try {
            await deleteDoc(doc(db, "comments", commentId));
        } catch (error) {
            console.error("Error deleting comment:", error);
            alert("Failed to delete comment");
        } finally {
            setDeleting(null);
        }
    };

    const handleRestore = async (commentId: string) => {
        try {
            await updateDoc(doc(db, "comments", commentId), {
                deleted: false,
                deletedBy: null,
            });
        } catch (error) {
            console.error("Error restoring comment:", error);
            alert("Failed to restore comment");
        }
    };

    const filteredComments = comments.filter(comment => {
        if (filter === "active") return !comment.deleted;
        if (filter === "deleted") return comment.deleted;
        return true;
    });

    const stats = {
        total: comments.length,
        active: comments.filter(c => !c.deleted).length,
        deleted: comments.filter(c => c.deleted).length,
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground font-mono">LOADING_COMMENTS...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-primary tracking-tighter">COMMENT_MODERATION</h1>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-lg border border-border bg-card/50">
                    <p className="text-sm text-muted-foreground mb-1">Total Comments</p>
                    <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card/50">
                    <p className="text-sm text-muted-foreground mb-1">Active</p>
                    <p className="text-2xl font-bold text-green-500">{stats.active}</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-card/50">
                    <p className="text-sm text-muted-foreground mb-1">Deleted</p>
                    <p className="text-2xl font-bold text-destructive">{stats.deleted}</p>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 mb-6">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <button
                    onClick={() => setFilter("all")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filter === "all" ? "bg-primary text-black" : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                >
                    All
                </button>
                <button
                    onClick={() => setFilter("active")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filter === "active" ? "bg-primary text-black" : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                >
                    Active
                </button>
                <button
                    onClick={() => setFilter("deleted")}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${filter === "deleted" ? "bg-primary text-black" : "bg-muted text-foreground hover:bg-muted/80"
                        }`}
                >
                    Deleted
                </button>
            </div>

            {/* Comments List */}
            {filteredComments.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground font-mono">NO_COMMENTS_FOUND</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredComments.map((comment) => (
                        <div
                            key={comment.id}
                            className={`p-6 rounded-xl border ${comment.deleted
                                ? "border-destructive/30 bg-destructive/5"
                                : "border-border bg-card/50"
                                }`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                        {comment.author.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">{comment.author.name}</span>
                                            {comment.author.isAdmin && (
                                                <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded flex items-center gap-1">
                                                    <Shield className="w-3 h-3" />
                                                    ADMIN
                                                </span>
                                            )}
                                            {comment.deleted && (
                                                <span className="px-2 py-0.5 bg-destructive/20 text-destructive text-xs font-bold rounded">
                                                    DELETED
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {comment.author.email} • {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    {comment.deleted ? (
                                        <button
                                            onClick={() => handleRestore(comment.id)}
                                            className="px-3 py-1 text-xs bg-green-500/10 text-green-500 border border-green-500/30 rounded-md hover:bg-green-500/20"
                                        >
                                            RESTORE
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            disabled={deleting === comment.id}
                                            className="p-2 text-destructive hover:bg-destructive/10 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <p className="text-foreground whitespace-pre-wrap break-words mb-2">
                                {comment.content}
                            </p>

                            <div className="text-xs text-muted-foreground font-mono">
                                Post ID: {comment.postId} {comment.parentId && `• Reply to: ${comment.parentId}`}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
