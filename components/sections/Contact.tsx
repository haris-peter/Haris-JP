"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Loader2, CheckCircle2, Github, Linkedin, Mail, MessageSquare } from "lucide-react";
import { BorderBeam } from "@/components/ui/BorderBeam";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [socialLinks, setSocialLinks] = useState({
        github: "",
        linkedin: "",
        discord: "",
        email: "",
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "site");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSocialLinks(docSnap.data() as any);
                }
            } catch (error) {
                console.error("Error fetching social links:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        setErrorMessage("");

        try {
            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            setStatus("success");
            setFormData({ name: "", email: "", message: "" });

            // Reset success message after 5 seconds
            setTimeout(() => setStatus("idle"), 5000);
        } catch (error) {
            console.error("Contact form error:", error);
            setStatus("error");
            setErrorMessage("Failed to send message. Please try again.");
        }
    };

    return (
        <section id="contact" className="py-24 relative bg-background overflow-hidden">
            <div className="container mx-auto px-4 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative p-8 md:p-12 rounded-2xl border border-primary/30 bg-card/50 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,255,0.1)] overflow-hidden"
                >
                    <BorderBeam size={300} duration={20} delay={0} />

                    {/* Decorative Corners */}
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-primary" />
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-primary" />
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-primary" />
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-primary" />

                    <div className="text-center mb-10 relative z-10">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">
                            ESTABLISH_CONNECTION
                        </h2>
                        <p className="text-muted-foreground font-mono">
                            Send a transmission to the grid.
                        </p>
                    </div>

                    {status === "success" ? (
                        <div className="text-center py-12 relative z-10">
                            <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-green-500 mb-2">TRANSMISSION_SUCCESSFUL</h3>
                            <p className="text-muted-foreground">Your message has been received. I'll respond soon!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-primary tracking-widest">USER_ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full p-3 bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-none transition-all outline-none font-mono"
                                        placeholder="John Doe"
                                        disabled={status === "sending"}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-mono text-primary tracking-widest">EMAIL_PROTOCOL</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                                        className="w-full p-3 bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-none transition-all outline-none font-mono"
                                        placeholder="john@example.com"
                                        disabled={status === "sending"}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono text-primary tracking-widest">DATA_PACKET</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                                    className="w-full p-3 bg-background/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary rounded-none transition-all outline-none font-mono resize-none"
                                    placeholder="Your message here..."
                                    disabled={status === "sending"}
                                />
                            </div>

                            {status === "error" && (
                                <div className="p-3 bg-destructive/10 border border-destructive text-destructive text-sm font-mono">
                                    ERROR: {errorMessage}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="w-full py-4 bg-primary/10 border border-primary text-primary font-bold tracking-[0.2em] hover:bg-primary hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {status === "sending" ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        TRANSMITTING...
                                    </>
                                ) : (
                                    <>
                                        TRANSMIT
                                        <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </motion.div>

                {/* Social Links */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="mt-12 flex flex-wrap justify-center gap-6"
                >
                    {socialLinks.github && (
                        <a
                            href={socialLinks.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-card/50 border border-primary/20 rounded-full text-muted-foreground hover:text-primary hover:border-primary/50 transition-all group"
                        >
                            <Github className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-mono text-sm">GITHUB</span>
                        </a>
                    )}
                    {socialLinks.linkedin && (
                        <a
                            href={socialLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-card/50 border border-primary/20 rounded-full text-muted-foreground hover:text-primary hover:border-primary/50 transition-all group"
                        >
                            <Linkedin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-mono text-sm">LINKEDIN</span>
                        </a>
                    )}
                    {socialLinks.discord && (
                        <div className="flex items-center gap-2 px-6 py-3 bg-card/50 border border-primary/20 rounded-full text-muted-foreground hover:text-primary hover:border-primary/50 transition-all group cursor-default">
                            <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-mono text-sm">{socialLinks.discord}</span>
                        </div>
                    )}
                    {socialLinks.email && (
                        <a
                            href={`mailto:${socialLinks.email}`}
                            className="flex items-center gap-2 px-6 py-3 bg-card/50 border border-primary/20 rounded-full text-muted-foreground hover:text-primary hover:border-primary/50 transition-all group"
                        >
                            <Mail className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span className="font-mono text-sm">EMAIL</span>
                        </a>
                    )}
                </motion.div>
            </div>
        </section>
    );
}
