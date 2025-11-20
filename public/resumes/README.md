# Resume Storage - Local Alternative

Since Firebase Storage requires additional setup, we're using a simpler approach: storing resumes in the `/public` folder.

## 📁 How It Works

Resumes are stored in `/public/resumes/` and accessed via direct URLs:
- DevOps: `/resumes/devops.pdf`
- AI/ML: `/resumes/ai-ml.pdf`
- Software Engineer: `/resumes/software.pdf`
- Backend Developer: `/resumes/backend.pdf`

## 📝 Adding/Updating Resumes

### Option 1: Manual Upload (Recommended)
1. Place your PDF files in `d:\INTERNSHIP\TEST\portfolio\public\resumes\`
2. Name them according to the role:
   - `devops.pdf`
   - `ai-ml.pdf`
   - `software.pdf`
   - `backend.pdf`
3. Refresh the page - they'll be available immediately!

### Option 2: Admin Interface (Coming Soon)
We can add a file upload interface later if needed.

## ✅ Benefits
- ✅ No Firebase Storage configuration needed
- ✅ No storage limits or costs
- ✅ Faster downloads (served directly by Next.js)
- ✅ Works offline in development
- ✅ Easy to update - just replace the file

## 🚀 Deployment
When deploying to Vercel/Netlify, the `/public` folder is automatically included.

## 📋 Current Files
Place these files in `/public/resumes/`:
- [ ] `devops.pdf`
- [ ] `ai-ml.pdf`
- [ ] `software.pdf`
- [ ] `backend.pdf`
