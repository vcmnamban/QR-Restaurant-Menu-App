# 🚀 Production Deployment Guide

## 🎯 **Deployment Overview**
This guide will help you deploy your QR Restaurant Menu App to production using:
- **Frontend**: Vercel (React app)
- **Backend**: Railway (Node.js API)
- **Database**: Railway PostgreSQL

## 📋 **Prerequisites**
1. **GitHub Account** with your repository: `vcmnamban/QR-Restaurant-Menu-App`
2. **Vercel Account**: [vercel.com](https://vercel.com)
3. **Railway Account**: [railway.app](https://railway.app)

---

## 🌐 **Step 1: Deploy Backend to Railway**

### 1.1 Setup Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Select "Deploy from GitHub repo"

### 1.2 Configure Backend
1. **Repository**: `vcmnamban/QR-Restaurant-Menu-App`
2. **Root Directory**: `backend`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`

### 1.3 Add Environment Variables
In Railway, add these environment variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
SMTP_HOST=smtp.gmail.com
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

### 1.4 Deploy Backend
1. Click "Deploy"
2. Wait for build to complete
3. Note your backend URL: `https://your-project.railway.app`

---

## 🎨 **Step 2: Deploy Frontend to Vercel**

### 2.1 Setup Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository

### 2.2 Configure Frontend
1. **Repository**: `vcmnamban/QR-Restaurant-Menu-App`
2. **Root Directory**: `frontend`
3. **Framework Preset**: Vite
4. **Build Command**: `npm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `npm install`

### 2.3 Add Environment Variables
In Vercel, add these environment variables:
```env
VITE_API_URL=https://your-backend-url.railway.app
VITE_APP_ENV=production
VITE_APP_VERSION=1.0.0
```

### 2.4 Deploy Frontend
1. Click "Deploy"
2. Wait for build to complete
3. Your app will be live at: `https://your-project.vercel.app`

---

## 🔗 **Step 3: Connect Frontend to Backend**

### 3.1 Update API Configuration
1. In Vercel, update `VITE_API_URL` with your Railway backend URL
2. Redeploy if necessary

### 3.2 Test Connection
1. Open your Vercel app
2. Check browser console for API connection
3. Test login/registration functionality

---

## 🗄️ **Step 4: Database Setup (Optional)**

### 4.1 MongoDB Atlas (Recommended)
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free cluster
3. Get connection string
4. Update `MONGODB_URI` in Railway

### 4.2 Railway PostgreSQL (Alternative)
1. Add PostgreSQL service in Railway
2. Update database connection in backend
3. Run migrations: `npm run migrate`

---

## ✅ **Deployment Checklist**

- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Database connected
- [ ] API endpoints working
- [ ] Frontend connecting to backend
- [ ] All features functional
- [ ] SSL certificates active
- [ ] Domain configured (optional)

---

## 🌟 **After Deployment**

### **Your App Will Be Available At:**
- **Frontend**: `https://your-project.vercel.app`
- **Backend API**: `https://your-project.railway.app`
- **Health Check**: `https://your-project.railway.app/health`

### **Features Available:**
✅ Complete QR Restaurant Menu App  
✅ All Phase 5 components working  
✅ Production-ready deployment  
✅ Professional URL for sharing  
✅ Scalable infrastructure  
✅ SSL encryption  
✅ Global CDN  

---

## 🚨 **Troubleshooting**

### **Common Issues:**
1. **Build Failures**: Check environment variables
2. **API Connection**: Verify `VITE_API_URL` in Vercel
3. **Database Issues**: Check connection strings
4. **CORS Errors**: Update allowed origins in backend

### **Support:**
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Railway Docs**: [docs.railway.app](https://docs.railway.app)

---

## 🎉 **Congratulations!**
Your QR Restaurant Menu App is now live and ready for:
- 🏪 **Restaurant Onboarding**
- 👥 **User Registration**
- 📱 **QR Code Generation**
- 💳 **Payment Processing**
- 📊 **Analytics & Reporting**

**Ready to launch your restaurant empire! 🚀**

