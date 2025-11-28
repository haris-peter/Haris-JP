import { db } from "@/lib/firebase";
import { doc, updateDoc, increment, setDoc, getDoc } from "firebase/firestore";

/**
 * Tracks a general website visit.
 * Uses sessionStorage to prevent duplicate counts within the same session.
 */
export const trackVisit = async () => {
    if (typeof window === 'undefined') return;

    const visited = sessionStorage.getItem('visited');
    if (visited) return;

    try {
        const docRef = doc(db, "analytics", "general");

        // Check if doc exists, if not create it
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            await setDoc(docRef, { totalVisits: 1 });
        } else {
            await updateDoc(docRef, {
                totalVisits: increment(1)
            });
        }

        sessionStorage.setItem('visited', 'true');
    } catch (error) {
        console.error("Error tracking visit:", error);
    }
};

/**
 * Tracks a resume download for a specific role.
 * @param roleId The ID of the role (e.g., 'devops', 'software')
 */
export const trackResumeDownload = async (roleId: string) => {
    try {
        const docRef = doc(db, "analytics", "resumes");

        // Check if doc exists, if not create it
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            await setDoc(docRef, { [roleId]: 1 });
        } else {
            await updateDoc(docRef, {
                [roleId]: increment(1)
            });
        }
    } catch (error) {
        console.error("Error tracking resume download:", error);
    }
};

/**
 * Tracks a view for a specific blog post.
 * Uses sessionStorage to prevent duplicate counts for the same post in the same session.
 * @param slug The slug of the blog post
 */
export const trackBlogView = async (slug: string) => {
    if (typeof window === 'undefined') return;

    const viewedKey = `viewed_blog_${slug}`;
    const viewed = sessionStorage.getItem(viewedKey);
    if (viewed) return;

    try {
        const docRef = doc(db, "analytics", "blogs");

        // Check if doc exists, if not create it
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
            await setDoc(docRef, { [slug]: 1 });
        } else {
            await updateDoc(docRef, {
                [slug]: increment(1)
            });
        }

        sessionStorage.setItem(viewedKey, 'true');
    } catch (error) {
        console.error("Error tracking blog view:", error);
    }
};
