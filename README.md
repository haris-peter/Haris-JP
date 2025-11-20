# Portfolio Website

A modern, TRON-themed portfolio built with Next.js, Firebase, and Framer Motion.

## Features

- 🎨 TRON-inspired design with smooth animations
- 📝 Dynamic blog with comments system
- 💼 Project showcase with detailed modals
- 🎯 Experience timeline
- 📧 Contact form with email integration
- 🔐 Admin panel for content management
- 🌓 Dark/Light theme toggle
- 📱 Fully responsive design

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Email:** Resend API
- **Deployment:** Vercel

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables in `.env.local`:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
   NEXT_PUBLIC_FIREBASE_APP_ID=
   RESEND_API_KEY=
   CONTACT_EMAIL=
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## Admin Panel

Access the admin panel at `/protocol/login` to manage:
- Blog posts
- Projects
- Experience entries
- Comments
- Site settings
- Resumes

## License

MIT
