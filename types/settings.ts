export interface SiteSettings {
    id: string;
    github?: string;
    linkedin?: string;
    discord?: string;
    email?: string;
    updatedAt: Date;
}

export interface SiteSettingsFormData {
    github?: string;
    linkedin?: string;
    discord?: string;
    email?: string;
}
