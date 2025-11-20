export interface Comment {
    id: string;
    postId: string;
    parentId: string | null; // null for top-level comments, commentId for replies
    author: {
        name: string;
        email: string;
        isAdmin: boolean;
    };
    content: string;
    createdAt: Date;
    updatedAt: Date;
    deleted: boolean;
    deletedBy: string | null; // admin email who deleted it
}

export interface CommentFormData {
    name: string;
    email: string;
    content: string;
}
