# 🚀 Deployment Guide: Vercel & Render

This guide will walk you through deploying your **Hack2Hire** project. We will split it into two parts:
1. **Backend** on **Render** (Free Tier)
2. **Frontend** on **Vercel** (Free Tier)

---

## 🟢 Part 1: Deploy Backend (Render)

The backend must be deployed first so we can give its URL to the frontend.

### 1. Prepare your Code
- Ensure your project is pushed to **GitHub**.
- Ensure `backend/requirements.txt` exists.

### 2. Create Service on Render
1. Go to [dashboard.render.com](https://dashboard.render.com/) and click **New +** -> **Web Service**.
2. Connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `hack2hire-backend` (or similar)
   - **Root Directory**: `.` (leave as default)
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r backend/requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables** (Click "Advanced" or "Environment"):
   - Key: `PYTHON_VERSION` | Value: `3.10.0` (Recommended)
   - Key: `ALLOWED_ORIGINS` | Value: `*` (For now, to allow all connections. Once frontend is deployed, you can change this to your Vercel URL).
5. Click **Create Web Service**.

⏳ **Wait for it to deploy.** once done, copy the URL (e.g., `https://hack2hire-backend.onrender.com`).

---

## ▲ Part 2: Deploy Frontend (Vercel)

### 1. Create Project on Vercel
1. Go to [vercel.com/new](https://vercel.com/new).
2. Import your GitHub repository.

### 2. Configure Settings
Vercel will auto-detect Vite, but check these settings:
- **Framework Preset**: `Vite`
- **Root Directory**: `frontend` (Click "Edit" next to "Root Directory" and select the `frontend` folder).

### 3. Environment Variables
Expand the **"Environment Variables"** section and add:
- **Key**: `VITE_API_URL`
- **Value**: `https://hack2hire-backend.onrender.com/api` (Paste your Render URL from Part 1 and add `/api` at the end).

### 4. Deploy
- Click **Deploy**.
- Vercel will build your site. Once done, you will get a live URL (e.g., `https://hack2hire-frontend.vercel.app`).

---

## 🔗 Final Step: Connect them securely

Now that you have the Frontend URL:
1. Go back to **Render Dashboard** -> **Environment**.
2. Update `ALLOWED_ORIGINS` to match your Vercel URL (e.g., `https://hack2hire-frontend.vercel.app`).
   - *Note: If you want to keep testing locally, you can set it to a comma-separated list: `https://hack2hire-frontend.vercel.app,http://localhost:5173`*

🎉 **Done! Your AI Interview Platform is live!**
