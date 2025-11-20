export interface Project {
    id: string;
    title: string;
    description: string; // Short description for card
    summary: string; // Full description for modal
    techStack: string[]; // Array of technologies
    link?: string; // Live project URL
    github?: string; // GitHub repository URL
    image?: string; // Image URL or path
    featured: boolean; // Show on homepage
    order: number; // Display order
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectFormData {
    title: string;
    description: string;
    summary: string;
    techStack: string[];
    link?: string;
    github?: string;
    image?: string;
    featured: boolean;
}
