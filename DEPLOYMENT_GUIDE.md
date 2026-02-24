# QuickProfile - Deployment Guide

## Overview

This guide covers deploying QuickProfile to production using:

- **Backend**: Render (Node.js/Express)
- **Frontend**: Vercel (React)

## Prerequisites

- GitHub account with both repositories set up
- Render account (free tier available)
- Vercel account (free tier available)
- MongoDB Atlas account (free tier available)

---

## MongoDB Atlas Setup

### 1. Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in
3. Click "Create a New Project" → "Create Project"
4. Create a **Shared Free Cluster**:
   - Provider: AWS
   - Region: Choose closest to you
   - Click "Create Cluster"

### 2. Create Database User

1. Go to "Database Access"
2. Click "Add New Database User"
3. Create user credentials:
   - Username: `quickprofile_user`
   - Password: Generate secure password
   - Permissions: "Read and write to any database"
4. Click "Create User"

### 3. Configure IP Whitelist

1. Go to "Network Access"
2. Click "Add IP Address"
3. Add:
   - Render's IP: `0.0.0.0/0` (or specific Render ranges)
   - Your local IP: For testing
4. Click "Confirm"

### 4. Get Connection String

1. Click "Connect" on your cluster
2. Select "Drivers" → Node.js
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Format: `mongodb+srv://quickprofile_user:password@cluster.mongodb.net/quickprofile?retryWrites=true&w=majority`

---

## Backend Deployment (Render)

### 1. Prepare Render Configuration

The `render.yaml` file is already set up. It includes:

- Node.js environment
- Start command: `npm start`
- Environment variables placeholders
- 1GB persistent disk for uploads

### 2. Connect GitHub to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub account
4. Select `quick-profile-backend` repository
5. Configure:
   - **Name**: `quickprofile-api`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Publish directory**: Leave empty
   - **Plan**: Free

### 3. Set Environment Variables

In Render dashboard, add these environment variables:

| Key            | Value                                          |
| -------------- | ---------------------------------------------- |
| `MONGODB_URI`  | Your MongoDB connection string                 |
| `JWT_SECRET`   | Generate a strong random string (min 32 chars) |
| `NODE_ENV`     | `production`                                   |
| `PORT`         | `10000` (or leave for Render default)          |
| `CORS_ORIGINS` | `https://your-frontend-domain.vercel.app`      |

### 4. Deploy

1. Click "Deploy"
2. Wait for build completion (2-3 minutes)
3. You'll get a backend URL like: `https://quickprofile-api.onrender.com`
4. Note this URL for frontend configuration

### 5. Test Backend

```bash
curl https://quick-profile-backend.onrender.com/api/health
```

---

## Frontend Deployment (Vercel)

### 1. Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Click "Import Git Repository"
4. Select `quick-profile-frontend`
5. Click "Import"

### 2. Configure Environment Variables

In Vercel project settings, add these environment variables:

| Key                  | Value                                                                                          |
| -------------------- | ---------------------------------------------------------------------------------------------- |
| `REACT_APP_API_URL`  | `https://quick-profile-backend.onrender.com/api`                                               |
| `REACT_APP_BASE_URL` | Your Vercel domain (will be shown after first deploy, e.g., `https://quickprofile.vercel.app`) |

**Important:**

- Set these directly in Vercel's **Settings → Environment Variables** dashboard
- Do NOT use the `@secret_name` syntax
- You can update `REACT_APP_BASE_URL` after your first deploy when you know your Vercel domain

### 3. Configure Build Settings

- **Framework**: Create React App
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Install Command**: `npm install`

These are usually auto-detected correctly.

### 4. Deploy

1. Click "Deploy"
2. Wait for build completion (2-3 minutes)
3. Get your frontend URL (e.g., `https://quickprofile.vercel.app`)
4. **Important:** Note this URL for the next step

### 5. Update Environment Variables After First Deploy

After getting your Vercel domain:

1. Go to **Project Settings** → **Environment Variables**
2. Update `REACT_APP_BASE_URL` with your actual Vercel domain:
   ```
   REACT_APP_BASE_URL=https://quickprofile.vercel.app
   ```
3. Click "Save"
4. Go to **Deployments** and click "Redeploy" on the latest deployment
5. Choose "Redeploy" to rebuild with the new environment variable

---

## Connect Backend and Frontend

### 1. Update Backend CORS

In Render environment variables, add:

```
CORS_ORIGINS=https://your-frontend-domain.vercel.app
```

### 2. Update Frontend API URL

In Vercel environment variables, update:

```
REACT_APP_API_URL=https://quick-profile-backend.onrender.com/api
```

This is already configured in `vercel.json`, so no changes needed unless the backend URL changes.

### 3. Verify Connection

1. Open your frontend in browser
2. Login to admin dashboard
3. Create a new client
4. Verify the QR code shows the correct frontend domain
5. Test the link works

---

## Create Production Admin Account

Once deployed, create an admin user:

### Option 1: Using Render Shell (Recommended)

1. Go to your Render service
2. Click "Shell" tab
3. Run:

```bash
node scripts/createAdmin.js admin@yourdomain.com YourSecurePassword123
```

### Option 2: Local Script

1. Update `.env` with production MongoDB URI
2. Run locally:

```bash
node scripts/createAdmin.js admin@yourdomain.com YourSecurePassword123
```

---

## Deployment Checklist

### Before Going Live

- [ ] MongoDB Atlas cluster created and configured
- [ ] Connection string added to Render
- [ ] JWT_SECRET changed to strong random string
- [ ] Backend deployed to Render and running
- [ ] Frontend deployed to Vercel
- [ ] Environment variables set on both platforms
- [ ] CORS configured correctly
- [ ] Production admin account created
- [ ] Test full workflow:
  - [ ] Admin login works
  - [ ] Create client works
  - [ ] QR code displays correct URL
  - [ ] Public profile link works
  - [ ] PDF displays correctly

### Post-Deployment

- [ ] Set up custom domain (optional)
- [ ] Enable HTTPS (automatic on both platforms)
- [ ] Monitor logs in Render/Vercel
- [ ] Backup MongoDB regularly
- [ ] Update admin password
- [ ] Document production credentials securely

---

## Custom Domain Setup (Optional)

### For Render Backend

1. Go to your Render service
2. Click "Settings" → "Custom Domain"
3. Add your domain (e.g., `api.yourdomain.com`)
4. Add DNS records as shown
5. Update frontend env vars with custom domain

### For Vercel Frontend

1. Go to project settings
2. Click "Domains"
3. Add your domain (e.g., `app.yourdomain.com`)
4. Follow DNS setup instructions
5. Update backend CORS if needed

---

## Troubleshooting

### Backend Won't Start

- Check MongoDB URI format in Render env vars
- Verify network access in MongoDB Atlas
- Check Render logs for errors
- Ensure JWT_SECRET is set

### Frontend Can't Connect to Backend

- Verify REACT_APP_API_URL is correct
- Check backend is running in Render
- Verify CORS_ORIGINS includes your frontend URL
- Clear browser cache and try again

### Environment Variable Error in Vercel

If you see: `Environment Variable "X" references Secret "x", which does not exist`

**Solution:**

- Don't use the `@variable_name` syntax in vercel.json
- Set environment variables directly in Vercel dashboard: Settings → Environment Variables
- Use simple values, not references
- Example:
  ```
  REACT_APP_API_URL=https://quick-profile-backend.onrender.com/api
  REACT_APP_BASE_URL=https://your-domain.vercel.app
  ```

### PDF Uploads Fail

- Check Render disk mount is working (see below)
- Verify file size < 10MB
- Check browser console for errors

### PDF Not Loading After Deployment

**Solution:** PDFs are now properly served from the backend using absolute URLs. If PDFs still don't load:

1. Verify the backend is serving uploads:

   ```bash
   curl https://quick-profile-backend.onrender.com/api/health
   ```

2. Check that the Render persistent disk is mounted correctly:
   - Render Dashboard → Your service → "Disks" tab
   - Should show disk named "uploads" at `/opt/render/project/src/uploads`

3. Verify a PDF exists in the database but can't be downloaded:
   - Login to admin dashboard
   - Create a new client and upload a PDF
   - Check if it downloads from dashboard

4. Test direct PDF URL:
   ```
   https://quick-profile-backend.onrender.com/uploads/pdf-XXXXX.pdf
   ```
   Replace XXXXX with the actual filename

### Render Persistent Disk Issues

If PDFs disappear after service restart:

1. The `render.yaml` includes a 1GB persistent disk
2. This disk survives service restarts but not code redeployments
3. To keep files across deploys, files must be uploaded AFTER deployment

**Important:** Do not redeploy the service if you have important uploaded PDFs, as redeployment may reset the disk.

### QR Code Shows Wrong URL

- Verify REACT_APP_BASE_URL in Vercel env vars
- Re-run build and deploy after updating
- Clear browser cache

---

## Environment Files Reference

### Backend (.env for production via Render)

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/quickprofile
JWT_SECRET=your-super-secret-key-min-32-characters
PORT=10000
NODE_ENV=production
CORS_ORIGINS=https://your-frontend.vercel.app
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
```

### Frontend (.env.local for production via Vercel)

```
REACT_APP_API_URL=https://quick-profile-backend.onrender.com/api
REACT_APP_BASE_URL=https://your-vercel-frontend-domain.vercel.app
```

---

## Monitoring and Maintenance

### View Logs

**Render Backend:**

1. Go to service dashboard
2. Click "Logs" tab
3. Filter by error to troubleshoot

**Vercel Frontend:**

1. Go to project dashboard
2. Click "Deployments"
3. View build and deployment logs

### Update Code

1. Make changes locally
2. Commit and push to GitHub
3. Render/Vercel auto-deploy on push (if enabled)
4. Deploy manually from dashboard if needed

### Database Backups

In MongoDB Atlas:

1. Go to "Backup" tab
2. Enable "Automatic Backups"
3. Configure retention policy
4. Download backups as needed

---

## Support & Resources

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com
- QuickProfile README: See repository

---

**Last Updated**: February 2026

For issues or questions, check the GitHub repositories or contact support.
