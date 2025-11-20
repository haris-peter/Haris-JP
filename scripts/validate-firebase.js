// Firebase Configuration Validator
// Run this in your browser console on the admin page to check Firebase setup

console.log("🔍 Firebase Configuration Check\n");

// 1. Check if Firebase is initialized
console.log("1. Firebase Initialization:");
try {
    const { auth, db, storage } = require("@/lib/firebase");
    console.log("✅ Firebase modules imported successfully");
} catch (e) {
    console.error("❌ Firebase import failed:", e);
}

// 2. Check environment variables
console.log("\n2. Environment Variables:");
const requiredVars = [
    "NEXT_PUBLIC_FIREBASE_API_KEY",
    "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
    "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
    "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
    "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
    "NEXT_PUBLIC_FIREBASE_APP_ID"
];

requiredVars.forEach(varName => {
    const value = process.env[varName];
    if (!value || value.includes("mock")) {
        console.error(`❌ ${varName}: Missing or using mock value`);
    } else {
        console.log(`✅ ${varName}: ${value.substring(0, 20)}...`);
    }
});

// 3. Check Storage Bucket format
console.log("\n3. Storage Bucket Validation:");
const bucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
if (bucket) {
    if (bucket.endsWith(".appspot.com")) {
        console.log(`✅ Correct format: ${bucket}`);
    } else if (bucket.endsWith(".firebasestorage.app")) {
        console.error(`❌ Wrong format: ${bucket}`);
        console.log(`   Should be: ${bucket.replace(".firebasestorage.app", ".appspot.com")}`);
    } else {
        console.error(`❌ Invalid format: ${bucket}`);
    }
}

// 4. Test Firebase Auth
console.log("\n4. Firebase Auth Status:");
import { auth } from "@/lib/firebase";
auth.onAuthStateChanged(user => {
    if (user) {
        console.log(`✅ Signed in as: ${user.email}`);
        console.log(`   UID: ${user.uid}`);
    } else {
        console.log("⚠️  Not signed in");
    }
});

// 5. Test Storage Access
console.log("\n5. Testing Storage Access:");
import { storage } from "@/lib/firebase";
import { ref, listAll } from "firebase/storage";

const resumesRef = ref(storage, "resumes");
listAll(resumesRef)
    .then(result => {
        console.log(`✅ Storage accessible. Found ${result.items.length} files in /resumes`);
        result.items.forEach(item => console.log(`   - ${item.name}`));
    })
    .catch(error => {
        console.error("❌ Storage access failed:", error.message);
        if (error.code === "storage/unauthorized") {
            console.log("   💡 Check Firebase Storage rules");
        }
    });

console.log("\n✨ Validation complete! Check results above.");
