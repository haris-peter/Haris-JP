"use client";

import { useState, useEffect } from "react";
import { ProjectFormData } from "@/types/project";
import { X } from "lucide-react";

interface ProjectEditorProps {
    initialData?: ProjectFormData & { id?: string };
    onSave: (data: ProjectFormData) => Promise<void>;
    onCancel: () => void;
}

export function ProjectEditor({ initialData, onSave, onCancel }: ProjectEditorProps) {
    const [formData, setFormData] = useState<ProjectFormData>({
        title: "",
        description: "",
        summary: "",
        techStack: [],
        link: "",
        github: "",
        image: "",
        featured: true,
        ...initialData,
    });

    const [techInput, setTechInput] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(formData);
        } finally {
            setSaving(false);
        }
    };

    const addTech = () => {
        if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
            setFormData(prev => ({
                ...prev,
                techStack: [...prev.techStack, techInput.trim()]
            }));
            setTechInput("");
        }
    };

    const removeTech = (tech: string) => {
        setFormData(prev => ({
            ...prev,
            techStack: prev.techStack.filter(t => t !== tech)
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium mb-2">Title *</label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Project Title"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium mb-2">Short Description * (for card)</label>
                <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-20"
                    placeholder="Brief description shown on project card"
                />
            </div>

            {/* Summary */}
            <div>
                <label className="block text-sm font-medium mb-2">Full Summary * (for modal)</label>
                <textarea
                    required
                    value={formData.summary}
                    onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-32"
                    placeholder="Detailed description shown in modal"
                />
            </div>

            {/* Tech Stack */}
            <div>
                <label className="block text-sm font-medium mb-2">Tech Stack *</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                        className="flex-1 px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Add technology (press Enter)"
                    />
                    <button
                        type="button"
                        onClick={addTech}
                        className="px-4 py-2 bg-primary text-black font-medium rounded-md hover:bg-primary/90"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.techStack.map((tech) => (
                        <span
                            key={tech}
                            className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-md text-sm flex items-center gap-2"
                        >
                            {tech}
                            <button
                                type="button"
                                onClick={() => removeTech(tech)}
                                className="text-primary hover:text-primary/70"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Live Demo URL</label>
                    <input
                        type="url"
                        value={formData.link}
                        onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="https://example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">GitHub URL</label>
                    <input
                        type="url"
                        value={formData.github}
                        onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="https://github.com/username/repo"
                    />
                </div>
            </div>

            {/* Image */}
            <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/image.jpg"
                />
            </div>

            {/* Featured */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                    Show on homepage (featured)
                </label>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    type="submit"
                    disabled={saving || formData.techStack.length === 0}
                    className="flex-1 py-3 px-4 bg-primary text-black font-bold rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? "SAVING..." : "SAVE_PROJECT"}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={saving}
                    className="px-6 py-3 bg-muted border border-border text-foreground font-medium rounded-md hover:bg-muted/80"
                >
                    CANCEL
                </button>
            </div>
        </form>
    );
}
