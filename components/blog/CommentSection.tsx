"use client";

import { useState, useEffect } from "react";
import { Comment, CommentFormData } from "@/types/comment";
import { CommentForm } from "./CommentForm";
import { CommentThread } from "./CommentThread";
import { db } from "@/lib/firebase";
import {
    collection,
    query,
    where,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    doc,
    serverTimestamp
} from "firebase/firestore";
import { useAuth } from "@/components/providers/AuthProvider";
import { MessageSquare } from "lucide-react";

interface CommentSectionProps {
    postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
    const { user } = useAuth();
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

    const isAdmin = user?.email === "harisjosinpeter@gmail.com";

    // Real-time listener for comments
    useEffect(() => {
        console.log("CommentSection: Setting up listener for postId:", postId);

        const q = query(
            collection(db, "comments"),
            where("postId", "==", postId)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            console.log("CommentSection: Received snapshot with", snapshot.docs.length, "documents");

            const commentsData = snapshot.docs.map(doc => {
                const data = doc.data();
                console.log("Comment data:", { id: doc.id, ...data });
                return {
                    id: doc.id,
                    ...data,
                    createdAt: data.createdAt?.toDate() || new Date(),
                    updatedAt: data.updatedAt?.toDate() || new Date(),
                };
            }) as Comment[];

            // Sort in JavaScript instead of Firestore to avoid index requirement
            commentsData.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

            console.log("CommentSection: Setting comments state with", commentsData.length, "comments");
            setComments(commentsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching comments:", error);
            console.error("Error code:", error.code);
            console.error("Error message:", error.message);
            // Show error but don't block the UI
            setComments([]);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [postId]);

    // Organize comments into threads
    const organizeComments = () => {
        const topLevel: Comment[] = [];
        const repliesMap: Record<string, Comment[]> = {};

        comments.forEach(comment => {
            if (comment.parentId === null) {
                topLevel.push(comment);
            } else {
                if (!repliesMap[comment.parentId]) {
                    repliesMap[comment.parentId] = [];
                }
                repliesMap[comment.parentId].push(comment);
            }
        });

        return { topLevel, repliesMap };
    };

    const handleCommentSubmit = async (data: CommentFormData) => {
        try {
            await addDoc(collection(db, "comments"), {
                postId,
                parentId: null,
                author: {
                    name: isAdmin ? "Admin" : data.name,
                    email: isAdmin ? user!.email! : data.email,
                    isAdmin: isAdmin,
                },
                content: data.content,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                deleted: false,
                deletedBy: null,
            });
        } catch (error) {
            console.error("Error posting comment:", error);
            throw error;
        }
    };

    const handleReply = async (parentId: string, data: CommentFormData) => {
        try {
            await addDoc(collection(db, "comments"), {
                postId,
                parentId,
                author: {
                    name: isAdmin ? "Admin" : data.name,
                    email: isAdmin ? user!.email! : data.email,
                    isAdmin: isAdmin,
                },
                content: data.content,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
                deleted: false,
                deletedBy: null,
            });
        } catch (error) {
            console.error("Error posting reply:", error);
            throw error;
        }
    };

    const handleDelete = async (commentId: string) => {
        try {
            const commentRef = doc(db, "comments", commentId);
            await updateDoc(commentRef, {
                deleted: true,
                deletedBy: user!.email,
                updatedAt: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error deleting comment:", error);
            throw error;
        }
    };

    const { topLevel, repliesMap } = organizeComments();
    const commentCount = comments.filter(c => !c.deleted).length;

    return (
        <div className="mt-16 border-t border-border pt-12">
            <div className="flex items-center gap-3 mb-8">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold text-primary tracking-tighter">
                    COMMENTS ({commentCount})
                </h2>
            </div>

            {/* Comment Form */}
            <div className="mb-8 p-6 rounded-xl border border-border bg-card/50">
                <h3 className="text-lg font-bold mb-4">Leave a Comment</h3>
                <CommentForm postId={postId} onSubmit={handleCommentSubmit} />
            </div>

            {/* Comments List */}
            {loading ? (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <p className="mt-4 text-muted-foreground font-mono">LOADING_COMMENTS...</p>
                </div>
            ) : topLevel.length === 0 ? (
                <div className="text-center py-12 border border-dashed border-border rounded-xl">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                    <p className="text-muted-foreground font-mono">NO_COMMENTS_YET</p>
                    <p className="text-sm text-muted-foreground mt-2">Be the first to share your thoughts!</p>
                </div>
            ) : (
                <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                    {topLevel.map((comment) => (
                        <CommentThread
                            key={comment.id}
                            comment={comment}
                            replies={repliesMap[comment.id] || []}
                            postId={postId}
                            onReply={handleReply}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
