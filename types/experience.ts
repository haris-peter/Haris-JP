export interface Experience {
    id: string;
    company: string;
    position: string;
    duration: string; // e.g., "Jan 2023 - Present"
    description: string;
    technologies: string[];
    logo?: string; // optional company logo URL
    order: number; // for sorting
    featured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ExperienceFormData {
    company: string;
    position: string;
    duration: string;
    description: string;
    technologies: string[];
    logo?: string;
    order: number;
    featured: boolean;
}
