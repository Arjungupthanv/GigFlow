# GigFlow Frontend Deployment Guide

## Quick Deploy to Vercel

### Option 1: Deploy via Vercel CLI (Fastest)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy from the root directory**:
   ```bash
   cd C:\GigFlow
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - Project name? **gigflow** (or your preferred name)
   - In which directory is your code located? **./**
   - Want to override settings? **N**

5. **Set environment variable**:
   ```bash
   vercel env add VITE_API_URL production
   ```
   When prompted, enter: `https://gigflow-production.up.railway.app/api`

6. **Deploy to production**:
   ```bash
   vercel --prod
   ```

### Option 2: Deploy via Vercel Dashboard (Recommended for beginners)

1. **Go to** [vercel.com](https://vercel.com) and sign in with GitHub

2. **Click "Add New Project"**

3. **Import your GitHub repository**:
   - Select `Arjungupthanv/GigFlow`
   - Click "Import"

4. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave as is)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `cd frontend && npm install`

5. **Add Environment Variable**:
   - Click "Environment Variables"
   - Name: `VITE_API_URL`
   - Value: `https://gigflow-production.up.railway.app/api`
   - Environment: Production

6. **Click "Deploy"**

7. **Wait for deployment** (usually 1-2 minutes)

8. **Your app will be live** at `https://gigflow-[random].vercel.app`

## After Deployment

### Update Backend CORS Settings

Once you have your Vercel URL, update the backend `.env` file on Railway:

1. Go to Railway dashboard
2. Select your backend service
3. Go to Variables tab
4. Update `FRONTEND_URL` to your Vercel URL (e.g., `https://gigflow-abc123.vercel.app`)
5. Redeploy the backend

### Test Your Application

1. Visit your Vercel URL
2. Test user registration
3. Test user login
4. Create a gig
5. Submit a bid
6. Check real-time notifications

## Troubleshooting

### Build Fails
- Check that `vercel.json` is in the root directory
- Verify all dependencies are in `package.json`

### API Calls Fail
- Check browser console for CORS errors
- Verify `VITE_API_URL` environment variable is set correctly
- Ensure backend `FRONTEND_URL` matches your Vercel URL

### 404 on Page Refresh
- The `vercel.json` rewrites configuration should handle this
- If still occurring, verify the rewrites section in `vercel.json`
