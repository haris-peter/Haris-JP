"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { SiteSettingsFormData } from "@/types/settings";
import { Github, Linkedin, Mail, MessageSquare, Loader2, User, Code, FileText } from "lucide-react";

export default function AdminSettings() {
    const [formData, setFormData] = useState<SiteSettingsFormData>({
        github: "",
        linkedin: "",
        discord: "",
        email: "",
    });
    const [profileData, setProfileData] = useState({
        tagline: "",
        bio: "",
        skills: [] as string[],
    });
    const [skillInput, setSkillInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                // Fetch Site Settings
                const siteDoc = await getDoc(doc(db, "settings", "site"));
                if (siteDoc.exists()) {
                    setFormData(siteDoc.data() as SiteSettingsFormData);
                }

                // Fetch Profile Settings
                const profileDoc = await getDoc(doc(db, "settings", "profile"));
                if (profileDoc.exists()) {
                    setProfileData(profileDoc.data() as any);
                } else {
                    // Set defaults if not exists
                    setProfileData({
                        tagline: "Full Stack Developer. System Architect. Digital Frontier Explorer.",
                        bio: "I am a creative technologist with a passion for building immersive digital experiences. My code is my craft, and the browser is my canvas. I specialize in bridging the gap between robust backend architecture and fluid frontend design.",
                        skills: ["Next.js / React", "TypeScript", "Firebase / Cloud", "Tailwind CSS", "Node.js", "AI Integration"]
                    });
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
            // Save Site Settings
            await setDoc(doc(db, "settings", "site"), {
                ...formData,
                updatedAt: serverTimestamp(),
            });

            // Save Profile Settings
            await setDoc(doc(db, "settings", "profile"), {
                ...profileData,
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

    const addSkill = () => {
        if (skillInput.trim() && !profileData.skills.includes(skillInput.trim())) {
            setProfileData(prev => ({
                ...prev,
                skills: [...prev.skills, skillInput.trim()]
            }));
            setSkillInput("");
        }
    };

    const removeSkill = (skill: string) => {
        setProfileData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill)
        }));
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

            <div className="grid gap-8">
                {/* Profile Settings */}
                <div className="p-6 rounded-xl border border-border bg-card/50 space-y-6">
                    <div>
                        <h2 className="text-xl font-bold mb-4 text-foreground flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" />
                            PROFILE_IDENTITY
                        </h2>
                        <p className="text-sm text-muted-foreground mb-6">
                            Customize your homepage identity, tagline, and skills.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {/* Tagline */}
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <Code className="w-4 h-4 text-primary" />
                                Tagline (Hero Section)
                            </label>
                            <input
                                type="text"
                                value={profileData.tagline}
                                onChange={(e) => setProfileData(prev => ({ ...prev, tagline: e.target.value }))}
                                className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                                placeholder="e.g. Full Stack Developer..."
                            />
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-primary" />
                                Bio (About Section)
                            </label>
                            <textarea
                                value={profileData.bio}
                                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                                className="w-full px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm h-32"
                                placeholder="Your bio..."
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Skills Detected</label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    className="flex-1 px-4 py-2 bg-muted border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                                    placeholder="Add skill (press Enter)"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-4 py-2 bg-primary text-black font-medium rounded-md hover:bg-primary/90"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {profileData.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1 bg-primary/10 border border-primary/30 rounded-md text-sm flex items-center gap-2 font-mono"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(skill)}
                                            className="text-primary hover:text-primary/70"
                                        >
                                            &times;
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Settings */}
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

                </div>
            </div>

            <div className="mt-8 pt-4 border-t border-border">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full py-4 px-6 bg-primary text-black font-bold text-lg rounded-md hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_30px_rgba(0,255,255,0.5)] transition-all"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            SAVING_SYSTEM_CONFIG...
                        </>
                    ) : (
                        "SAVE_ALL_SETTINGS"
                    )}
                </button>
            </div>
        </div>
    );
}
