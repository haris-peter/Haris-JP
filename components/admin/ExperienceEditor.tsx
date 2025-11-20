"use client";

import { useState, useEffect } from "react";
import { ExperienceFormData } from "@/types/experience";
import { Loader2, Plus, X } from "lucide-react";

interface ExperienceEditorProps {
    initialData?: ExperienceFormData;
    onSave: (data: ExperienceFormData) => Promise<void>;
}

export function ExperienceEditor({ initialData, onSave }: ExperienceEditorProps) {
    const [formData, setFormData] = useState<ExperienceFormData>({
        company: "",
        position: "",
        duration: "",
        description: "",
        technologies: [],
        logo: "",
        order: 0,
        featured: false,
    });
    const [techInput, setTechInput] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleAddTech = () => {
        if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
            setFormData(prev => ({
                ...prev,
                technologies: [...prev.technologies, techInput.trim()]
            }));
            setTechInput("");
        }
    };

    const handleRemoveTech = (tech: string) => {
        setFormData(prev => ({
            ...prev,
            technologies: prev.technologies.filter(t => t !== tech)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(formData);
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-primary tracking-tighter">
                {initialData ? "EDIT_EXPERIENCE" : "CREATE_NEW_EXPERIENCE"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Company *</label>
                    <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Company Name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Position *</label>
                    <input
                        type="text"
                        required
                        value={formData.position}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Job Title"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Duration *</label>
                    <input
                        type="text"
                        required
                        value={formData.duration}
                        onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Jan 2023 - Present"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Order</label>
                    <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) || 0 }))}
                        className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="0"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Description *</label>
                <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary h-32 resize-none"
                    placeholder="Describe your role and achievements..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Company Logo URL</label>
                <input
                    type="url"
                    value={formData.logo}
                    onChange={(e) => setFormData(prev => ({ ...prev, logo: e.target.value }))}
                    className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="https://example.com/logo.png"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-2">Technologies</label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={techInput}
                        onChange={(e) => setTechInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTech())}
                        className="flex-1 px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Add technology (press Enter)"
                    />
                    <button
                        type="button"
                        onClick={handleAddTech}
                        className="px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary/90"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech, index) => (
                        <span
                            key={index}
                            className="px-3 py-1 bg-primary/10 text-primary border border-primary/30 rounded-full text-sm flex items-center gap-2"
                        >
                            {tech}
                            <button
                                type="button"
                                onClick={() => handleRemoveTech(tech)}
                                className="hover:text-destructive"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-4 h-4 text-primary bg-muted border-border rounded focus:ring-primary"
                />
                <label htmlFor="featured" className="text-sm font-medium">
                    Featured Experience
                </label>
            </div>

            <button
                type="submit"
                disabled={saving}
                className="w-full px-4 py-2 bg-primary text-black font-bold rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
            >
                {saving ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        SAVING...
                    </>
                ) : (
                    initialData ? "UPDATE_EXPERIENCE" : "CREATE_EXPERIENCE"
                )}
            </button>
        </form>
    );
}
