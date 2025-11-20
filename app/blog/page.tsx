import { Navbar } from "@/components/layout/Navbar";
import { BlogList } from "@/components/blog/BlogList";
import { BlogBanner } from "@/components/ui/BlogBanner";

export const revalidate = 3600;

export default function BlogPage() {
    return (
        <main className="min-h-screen bg-background pb-20">
            <Navbar />
            <BlogBanner />

            <div className="container mx-auto px-4 max-w-4xl mt-12">

                <BlogList />
            </div>
        </main>
    );
}
