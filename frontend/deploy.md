# 🚀 Vercel Deployment Guide

## 📋 Prerequisites
1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Your code should be on GitHub
3. **Vercel CLI** (optional): `npm i -g vercel`

## 🔧 Deployment Steps

### Step 1: Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository: `vcmnamban/QR-Restaurant-Menu-App`
4. Select the repository

### Step 2: Configure Project
- **Framework Preset**: Vite
- **Root Directory**: `frontend`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 3: Environment Variables
Add these environment variables in Vercel:
```
VITE_API_URL=https://your-backend-url.railway.app
VITE_APP_ENV=production
```

### Step 4: Deploy
Click "Deploy" and wait for the build to complete!

## 🌐 After Deployment
Your app will be available at: `https://your-project-name.vercel.app`

## 🔄 Backend Deployment
The backend needs to be deployed separately on:
- **Railway** (recommended - free tier)
- **Render** (free tier)
- **Heroku** (paid)

## 📱 Features Available
✅ Complete QR Restaurant Menu App
✅ All Phase 5 components working
✅ Production-ready deployment
✅ Professional URL for sharing

