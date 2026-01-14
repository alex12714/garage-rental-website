# 📦 Git Repository Setup Guide

## ✅ Prerequisites Complete

Your project is now ready to be uploaded to GitHub:
- All features implemented
- Build successful
- Terms & Conditions added
- SMS and video walkthrough notifications configured
- Terms agreement required before payment

---

## 🚀 Quick Setup (Recommended)

### Step 1: Initialize Git Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: Garage rental website with booking system"
```

###Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `garage-rental-website` (or your preferred name)
3. Description: "Hourly garage rental website with Stripe payments and multi-language support"
4. Choose: **Private** (recommended) or Public
5. **Do NOT** initialize with README, .gitignore, or license
6. Click **"Create repository"**

### Step 3: Connect and Push

GitHub will show you commands. Use these:

```bash
# Add GitHub as remote
git remote add origin https://github.com/YOUR_USERNAME/garage-rental-website.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## 📝 What to Include in .gitignore

Create a `.gitignore` file to exclude sensitive and unnecessary files:

```bash
cat << 'GITIGNORE' > .gitignore
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Next.js
/.next/
/out/

# Production
/build

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env*.local
.env

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
GITIGNORE
```

---

## ⚠️ IMPORTANT: Protect Your API Keys

Your `.env.local` file contains sensitive API keys and should **NEVER** be committed to Git.

### Current API Keys (Keep Secret):
- Stripe API Key (live)
- Google Maps API Key
- Webhook URL

### ✅ Verified:
`.env.local` is already in `.gitignore` ✓

---

## 📊 Repository Structure After Upload

```
garage-rental-website/
├── .git/                    # Git metadata (auto-created)
├── .gitignore              # Files to ignore
├── app/                    # Next.js app directory
├── components/             # React components
├── lib/                    # Utilities
├── locales/                # Translations (LV/EN/RU)
├── public/                 # Static files
├── styles/                 # CSS files
├── node_modules/           # NOT uploaded (in .gitignore)
├── .env.local             # NOT uploaded (in .gitignore)
├── package.json
├── README.md
├── PRD.md
└── ...config files
```

---

## 🔐 Environment Variables for Deployment

When deploying (Vercel/Netlify/etc.), manually add these environment variables in the hosting platform dashboard:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyBuhdQHrF4713cD...
WEBHOOK_URL=https://hook.eu1.make.com/wjoytd8mobl...
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## 🎯 Full Git Commands

```bash
# 1. Create .gitignore file
cat << 'GITIGNORE' > .gitignore
/node_modules
/.next/
/out/
.env*.local
.env
.DS_Store
*.pem
npm-debug.log*
.vercel
*.tsbuildinfo
next-env.d.ts
GITIGNORE

# 2. Initialize Git
git init

# 3. Add all files
git add .

# 4. Create initial commit
git commit -m "Initial commit: Complete garage rental website

Features:
- Multi-language support (LV/EN/RU)
- Stripe payment integration
- Google Maps integration
- Booking calendar with custom form
- Terms & Conditions page
- SMS and email notifications
- Video walkthrough for access
- Responsive design
- 12 page sections

Tech stack: Next.js 14, React, TypeScript, Tailwind CSS"

# 5. Connect to GitHub (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/garage-rental-website.git

# 6. Push to GitHub
git branch -M main
git push -u origin main
```

---

## 📱 GitHub Repository Settings (After Upload)

### Recommended Settings:

1. **About Section:**
   - Description: "Hourly garage rental platform with Stripe payments"
   - Website: https://yourdomain.com (when deployed)
   - Topics: `nextjs`, `typescript`, `stripe`, `tailwindcss`, `rental`, `booking-system`

2. **Branch Protection (Optional):**
   - Protect main branch
   - Require pull request reviews
   - Enable status checks

3. **Secrets (for GitHub Actions if using):**
   - Add environment variables as secrets
   - Never expose in public repository

---

## 🚀 Quick Deployment to Vercel (After GitHub Upload)

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (will auto-detect Next.js)
vercel

# Add environment variables in Vercel dashboard

# Deploy to production
vercel --prod
```

---

## ✅ Verification Checklist

Before pushing to GitHub:

- [x] `.gitignore` file created
- [x] `.env.local` is NOT being tracked
- [x] Build is successful (`npm run build` passes)
- [x] No sensitive data in code
- [x] README.md is complete
- [x] All files are committed

---

## 🔄 Future Updates

After making changes:

```bash
# Stage changed files
git add .

# Commit with meaningful message
git commit -m "Add feature: XYZ"

# Push to GitHub
git push
```

---

## 📞 Need Help?

If you encounter issues:
1. Check GitHub's documentation: https://docs.github.com
2. Verify `.gitignore` is working: `git status` (should not show `.env.local`)
3. Check remote connection: `git remote -v`

---

**Your project is ready to be uploaded to GitHub! 🎉**

Run the commands above to get started.
