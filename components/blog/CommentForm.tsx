"use client";

import { useState } from "react";
import { CommentFormData } from "@/types/comment";
import { Loader2 } from "lucide-react";

interface CommentFormProps {
    postId: string;
    parentId?: string | null;
    onSubmit: (data: CommentFormData) => Promise<void>;
    onCancel?: () => void;
    isReply?: boolean;
}

export function CommentForm({ postId, parentId = null, onSubmit, onCancel, isReply = false }: CommentFormProps) {
    const [formData, setFormData] = useState<CommentFormData>({
        name: "",
        email: "",
        content: "",
    });
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.email.trim() || !formData.content.trim()) {
            alert("Please fill in all fields");
            return;
        }

        if (formData.content.length > 1000) {
            alert("Comment is too long (max 1000 characters)");
            return;
        }

        setSubmitting(true);
        try {
            await onSubmit(formData);
            // Reset form on success
            setFormData({ name: "", email: "", content: "" });
        } catch (error) {
            console.error("Error submitting comment:", error);
            alert("Failed to post comment. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {!isReply && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name *</label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Your name"
                            disabled={submitting}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Email *</label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="your@email.com"
                            disabled={submitting}
                        />
                    </div>
                </div>
            )}

            <div>
                <label className="block text-sm font-medium mb-2">
                    {isReply ? "Reply" : "Comment"} *
                </label>
                <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-24 resize-none"
                    placeholder={isReply ? "Write your reply..." : "Share your thoughts..."}
                    disabled={submitting}
                    maxLength={1000}
                />
                <p className="text-xs text-muted-foreground mt-1">
                    {formData.content.length}/1000 characters
                </p>
            </div>

            <div className="flex gap-2">
                <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center gap-2"
                >
                    {submitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            POSTING...
                        </>
                    ) : (
                        isReply ? "POST_REPLY" : "POST_COMMENT"
                    )}
                </button>
                {isReply && onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={submitting}
                        className="px-4 py-2 bg-muted border border-border text-foreground font-medium rounded-md hover:bg-muted/80"
                    >
                        CANCEL
                    </button>
                )}
            </div>
        </form>
    );
}
