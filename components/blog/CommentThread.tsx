"use client";

import { useState } from "react";
import { Comment, CommentFormData } from "@/types/comment";
import { CommentForm } from "./CommentForm";
import { useAuth } from "@/components/providers/AuthProvider";
import { Trash2, Reply, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommentThreadProps {
    comment: Comment;
    replies: Comment[];
    postId: string;
    onReply: (parentId: string, data: CommentFormData) => Promise<void>;
    onDelete: (commentId: string) => Promise<void>;
    depth?: number;
}

export function CommentThread({ comment, replies, postId, onReply, onDelete, depth = 0 }: CommentThreadProps) {
    const { user } = useAuth();
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isAdmin = user?.email === "harisjosinpeter@gmail.com";
    const maxDepth = 3; // Maximum nesting level

    const handleDelete = async () => {
        if (!confirm("Delete this comment?")) return;

        setIsDeleting(true);
        try {
            await onDelete(comment.id);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleReplySubmit = async (data: CommentFormData) => {
        await onReply(comment.id, data);
        setShowReplyForm(false);
    };

    if (comment.deleted) {
        return (
            <div className="p-4 rounded-md bg-muted/30 border border-dashed border-border">
                <p className="text-sm text-muted-foreground italic">
                    [Comment deleted by admin]
                </p>
            </div>
        );
    }

    return (
        <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-6'}`}>
            <div className="p-4 rounded-lg border border-border bg-card/50">
                {/* Comment Header */}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                            {comment.author.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">{comment.author.name}</span>
                                {comment.author.isAdmin && (
                                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-xs font-bold rounded flex items-center gap-1">
                                        <Shield className="w-3 h-3" />
                                        ADMIN
                                    </span>
                                )}
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                            </span>
                        </div>
                    </div>

                    {/* Admin Actions */}
                    {isAdmin && (
                        <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="p-1 text-destructive hover:bg-destructive/10 rounded transition-colors"
                            title="Delete comment"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {/* Comment Content */}
                <p className="text-foreground whitespace-pre-wrap break-words mb-3">
                    {comment.content}
                </p>

                {/* Reply Button */}
                {depth < maxDepth && (
                    <button
                        onClick={() => setShowReplyForm(!showReplyForm)}
                        className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                    >
                        <Reply className="w-3 h-3" />
                        REPLY
                    </button>
                )}
            </div>

            {/* Reply Form */}
            {showReplyForm && (
                <div className="ml-8 mt-3 p-4 rounded-lg border border-border bg-muted/30">
                    <CommentForm
                        postId={postId}
                        parentId={comment.id}
                        onSubmit={handleReplySubmit}
                        onCancel={() => setShowReplyForm(false)}
                        isReply
                    />
                </div>
            )}

            {/* Nested Replies */}
            {replies.length > 0 && (
                <div className="space-y-2">
                    {replies.map((reply) => (
                        <CommentThread
                            key={reply.id}
                            comment={reply}
                            replies={[]} // Replies are already organized hierarchically
                            postId={postId}
                            onReply={onReply}
                            onDelete={onDelete}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
