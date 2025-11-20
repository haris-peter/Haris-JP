"use client";

import { Navbar } from "@/components/layout/Navbar";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { ExperienceSection } from "@/components/sections/Experience";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";

export default function Home() {
  return (
    <main className="min-h-screen bg-background selection:bg-primary selection:text-black">
      <Navbar />
      <Hero />
      <Projects />
      <ExperienceSection />
      <About />
      <Contact />

      {/* Footer */}
      <footer className="py-8 border-t border-border bg-card/50 text-center">
        <p className="text-sm text-muted-foreground font-mono">
          END_OF_LINE // © {new Date().getFullYear()} HARIS.JP
        </p>
      </footer>
    </main>
  );
}
