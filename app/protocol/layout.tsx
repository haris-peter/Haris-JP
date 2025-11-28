"use client";

import { useAuth } from "@/components/providers/AuthProvider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Don't apply auth check to login page
    const isLoginPage = pathname === "/protocol/login";

    useEffect(() => {
        if (!loading && !user && !isLoginPage) {
            router.push("/protocol/login");
        }
    }, [user, loading, router, isLoginPage]);

    // Show loading spinner only for protected pages
    if (loading && !isLoginPage) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    // For login page, render without layout
    if (isLoginPage) {
        return <>{children}</>;
    }

    // For protected pages, require authentication
    if (!user) return null;

    const closeSidebar = () => setIsSidebarOpen(false);

    const navLinks = [
        { href: "/protocol", label: "OVERVIEW" },
        { href: "/protocol/blog", label: "MANAGE_BLOG" },
        { href: "/protocol/projects", label: "MANAGE_PROJECTS" },
        { href: "/protocol/experience", label: "MANAGE_EXPERIENCE" },
        { href: "/protocol/comments", label: "MANAGE_COMMENTS" },
        { href: "/protocol/resumes", label: "MANAGE_RESUMES" },
        { href: "/protocol/settings", label: "SETTINGS" },
        { href: "/protocol/analytics", label: "ANALYTICS" },
    ];

    return (
        <div className="min-h-screen flex">
            {/* Desktop Sidebar */}
            <aside className="w-64 border-r border-border bg-card p-6 hidden md:block">
                <h2 className="text-xl font-bold mb-8 tracking-wider text-primary">DASHBOARD</h2>
                <nav className="space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors font-mono text-sm"
                        >
                            &gt; {link.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Mobile Menu Button */}
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="md:hidden fixed top-2 left-2 z-40 p-1.5 bg-card/90 backdrop-blur-sm border border-border rounded-md text-primary hover:bg-primary/10 transition-colors shadow-lg"
                aria-label="Open menu"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeSidebar}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
                        />

                        {/* Sidebar Panel */}
                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 bottom-0 w-[280px] bg-card border-r border-border z-50 md:hidden overflow-y-auto p-6"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold tracking-wider text-primary">DASHBOARD</h2>
                                <button
                                    onClick={closeSidebar}
                                    className="p-2 text-primary hover:bg-primary/10 rounded transition-colors"
                                    aria-label="Close menu"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="space-y-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.href}
                                        href={link.href}
                                        onClick={closeSidebar}
                                        className="block px-4 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors font-mono text-sm"
                                    >
                                        &gt; {link.label}
                                    </Link>
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            <main className="flex-1 p-4 md:p-8 overflow-y-auto bg-background pt-14 md:pt-8">
                {children}
            </main>
        </div>
    );
}
