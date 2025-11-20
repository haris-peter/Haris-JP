"use client";

import { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function AdminLogin() {
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);

            // Whitelist check - replace with your actual email
            const ALLOWED_EMAIL = "harisjosinpeter@gmail.com"; // TODO: Replace with your actual email

            if (result.user.email !== ALLOWED_EMAIL) {
                await auth.signOut();
                setError(`Access denied. Only ${ALLOWED_EMAIL} is authorized.`);
                return;
            }

            router.push("/protocol");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 p-8 rounded-xl border border-primary/20 bg-card/50 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,255,0.1)] max-w-md w-full text-center overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

                <h1 className="text-3xl font-bold mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">
                    SYSTEM_ACCESS
                </h1>
                <p className="text-muted-foreground mb-8 font-mono text-sm">
                    // AUTHENTICATION_REQUIRED
                </p>

                <button
                    onClick={handleLogin}
                    className="w-full py-3 px-4 bg-primary/10 border border-primary/50 text-primary rounded-none font-bold tracking-widest hover:bg-primary hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                        <path
                            fill="currentColor"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                            fill="currentColor"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                            fill="currentColor"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                    </svg>
                    INITIALIZE_SESSION
                </button>

                {error && (
                    <p className="mt-4 text-sm text-destructive font-mono border border-destructive/50 bg-destructive/10 p-2">
                        ERROR: {error}
                    </p>
                )}
            </motion.div>
        </div>
    );
}
