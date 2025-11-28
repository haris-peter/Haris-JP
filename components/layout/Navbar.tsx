"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ResumeModal } from "@/components/ui/ResumeModal";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { Menu, X, Github } from "lucide-react";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isResumeOpen, setIsResumeOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [githubLink, setGithubLink] = useState("");

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "settings", "site");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().github) {
                    setGithubLink(docSnap.data().github);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when clicking a link
    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
                    scrolled
                        ? "bg-background/80 backdrop-blur-md border-border py-4"
                        : "bg-transparent py-6"
                )}
            >
                <div className="container mx-auto px-4 flex items-center justify-between">
                    <Link href="/" className="text-2xl font-bold tracking-tighter text-primary drop-shadow-[0_0_10px_rgba(0,255,255,0.5)]">
                        HARIS<span className="text-foreground">.JP</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link href="/#projects" className="text-sm font-medium hover:text-primary transition-colors tracking-wide">
                            PROJECTS
                        </Link>
                        <Link href="/#experience" className="text-sm font-medium hover:text-primary transition-colors tracking-wide">
                            EXPERIENCE
                        </Link>
                        <Link href="/#about" className="text-sm font-medium hover:text-primary transition-colors tracking-wide">
                            ABOUT
                        </Link>
                        <Link href="/blog" className="text-sm font-medium hover:text-primary transition-colors tracking-wide">
                            BLOG
                        </Link>
                        <Link href="/#contact" className="text-sm font-medium hover:text-primary transition-colors tracking-wide">
                            CONTACT
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        {githubLink && (
                            <a
                                href={githubLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden md:block text-muted-foreground hover:text-primary transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                        )}
                        <ThemeToggle />
                        <button
                            onClick={() => setIsResumeOpen(true)}
                            className="hidden md:block px-5 py-2 rounded-none border border-primary bg-primary/10 text-primary text-sm font-bold tracking-widest hover:bg-primary hover:text-black transition-all duration-300"
                        >
                            RESUME
                        </button>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-6 h-6" />
                            ) : (
                                <Menu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeMobileMenu}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Menu Panel */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 bottom-0 w-[280px] bg-card border-l border-border z-50 md:hidden overflow-y-auto"
                        >
                            <div className="p-6">
                                {/* Close Button */}
                                <div className="flex justify-end mb-8">
                                    <button
                                        onClick={closeMobileMenu}
                                        className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                                        aria-label="Close menu"
                                    >
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                {/* Navigation Links */}
                                <nav className="space-y-6">
                                    <Link
                                        href="/#projects"
                                        onClick={closeMobileMenu}
                                        className="block text-lg font-bold text-foreground hover:text-primary transition-colors tracking-wide"
                                    >
                                        &gt; PROJECTS
                                    </Link>
                                    <Link
                                        href="/#experience"
                                        onClick={closeMobileMenu}
                                        className="block text-lg font-bold text-foreground hover:text-primary transition-colors tracking-wide"
                                    >
                                        &gt; EXPERIENCE
                                    </Link>
                                    <Link
                                        href="/#about"
                                        onClick={closeMobileMenu}
                                        className="block text-lg font-bold text-foreground hover:text-primary transition-colors tracking-wide"
                                    >
                                        &gt; ABOUT
                                    </Link>
                                    <Link
                                        href="/blog"
                                        onClick={closeMobileMenu}
                                        className="block text-lg font-bold text-foreground hover:text-primary transition-colors tracking-wide"
                                    >
                                        &gt; BLOG
                                    </Link>
                                    <Link
                                        href="/#contact"
                                        onClick={closeMobileMenu}
                                        className="block text-lg font-bold text-foreground hover:text-primary transition-colors tracking-wide"
                                    >
                                        &gt; CONTACT
                                    </Link>

                                    <div className="pt-6 border-t border-border">
                                        <button
                                            onClick={() => {
                                                setIsResumeOpen(true);
                                                closeMobileMenu();
                                            }}
                                            className="w-full px-5 py-3 rounded-none border border-primary bg-primary/10 text-primary text-sm font-bold tracking-widest hover:bg-primary hover:text-black transition-all duration-300"
                                        >
                                            VIEW_RESUME
                                        </button>
                                    </div>
                                </nav>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <ResumeModal isOpen={isResumeOpen} onClose={() => setIsResumeOpen(false)} />
        </>
    );
}
