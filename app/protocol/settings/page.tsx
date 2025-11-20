"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { SiteSettingsFormData } from "@/types/settings";
import { Github, Linkedin, Mail, MessageSquare, Loader2 } from "lucide-react";

export default function AdminSettings() {
    const [formData, setFormData] = useState<SiteSettingsFormData>({
        github: "",
        linkedin: "",
        discord: "",
        email: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "site");
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setFormData(docSnap.data() as SiteSettingsFormData);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const docRef = doc(db, "settings", "site");
            await setDoc(docRef, {
                ...formData,
                updatedAt: serverTimestamp(),
            });

            alert("✅ Settings saved successfully!");
        } catch (error) {
            console.error("Error saving settings:", error);
            alert("❌ Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="mt-4 text-muted-foreground font-mono">LOADING_SETTINGS...</p>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-primary tracking-tighter">SITE_SETTINGS</h1>

            <div className="p-6 rounded-xl border border-border bg-card/50 space-y-6">
                <div>
                    <h2 className="text-xl font-bold mb-4 text-foreground">SOCIAL_LINKS</h2>
                    <p className="text-sm text-muted-foreground mb-6">
                        Configure your social media and contact links. These will be displayed in the contact section and footer.
                    </p>
                </div>

                <div className="space-y-4">
                    {/* GitHub */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Github className="w-4 h-4 text-primary" />
                            GitHub Profile URL
                        </label>
                        <input
                            type="url"
                            value={formData.github}
                            onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                            className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                            placeholder="https://github.com/yourusername"
                        />
                    </div>

                    {/* LinkedIn */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Linkedin className="w-4 h-4 text-primary" />
                            LinkedIn Profile URL
                        </label>
                        <input
                            type="url"
                            value={formData.linkedin}
                            onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                            className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                            placeholder="https://linkedin.com/in/yourusername"
                        />
                    </div>

                    {/* Discord */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-primary" />
                            Discord Username
                        </label>
                        <input
                            type="text"
                            value={formData.discord}
                            onChange={(e) => setFormData(prev => ({ ...prev, discord: e.target.value }))}
                            className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                            placeholder="username#1234 or @username"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-primary" />
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                            placeholder="your.email@example.com"
                        />
                    </div>
                </div>

                <div className="pt-4 border-t border-border">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-3 px-4 bg-primary text-black font-bold rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                SAVING...
                            </>
                        ) : (
                            "SAVE_SETTINGS"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
