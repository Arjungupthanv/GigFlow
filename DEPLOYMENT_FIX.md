# Fixing 404 API Errors in Production

## Problem
Your frontend (hosted on Netlify) is trying to call API endpoints using relative paths like `/api/auth/register`, which resolves to `https://storied-souffle-1d3a92.netlify.app/api/auth/register` instead of your actual backend at `https://gigflow-production.up.railway.app/api/auth/register`.

## Solution
Configure the frontend to use the full backend URL in production.

## Steps to Fix

### 1. Set Environment Variable in Netlify

1. Go to your Netlify dashboard: https://app.netlify.com
2. Select your site (storied-souffle-1d3a92)
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Add the following:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://gigflow-production.up.railway.app/api`
6. Click **Save**

### 2. Redeploy Your Frontend

After adding the environment variable, you need to trigger a new deployment:

**Option A: Trigger from Netlify Dashboard**
1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**

**Option B: Push a new commit**
```bash
cd frontend
git add .
git commit -m "Fix API configuration for production"
git push
```

### 3. Verify Backend CORS Settings

Make sure your backend allows requests from your Netlify domain. Check your backend `.env` file should have:

```
FRONTEND_URL=https://storied-souffle-1d3a92.netlify.app
```

If you need to update this on Railway:
1. Go to Railway dashboard
2. Select your backend project
3. Go to **Variables** tab
4. Update `FRONTEND_URL` to: `https://storied-souffle-1d3a92.netlify.app`
5. Redeploy if needed

### 4. Test the Fix

After redeployment:
1. Open https://storied-souffle-1d3a92.netlify.app
2. Try to register a new account
3. Check browser console (F12) - you should see requests going to `https://gigflow-production.up.railway.app/api/...`
4. Registration should work without 404 errors

## For Local Development

Create a `.env` file in the `frontend` folder:

```
VITE_API_URL=http://localhost:5000/api
```

This ensures local development still works with your local backend.

## What Changed

- Updated `frontend/src/api/axios.js` to use `import.meta.env.VITE_API_URL` environment variable
- Created `.env.example` as a template
- The code now uses the environment variable in production and falls back to `/api` if not set

## Troubleshooting

If you still see 404 errors:

1. **Check Network Tab**: Open browser DevTools (F12) → Network tab → Look at the failed requests. The URL should be `https://gigflow-production.up.railway.app/api/...`

2. **Verify Backend is Running**: Visit https://gigflow-production.up.railway.app/api/gigs directly in your browser - you should see JSON data, not a 404

3. **Check CORS**: If you see CORS errors instead of 404, update the `FRONTEND_URL` in Railway as mentioned above

4. **Clear Browser Cache**: Hard refresh (Ctrl+Shift+R) or clear cache and cookies for your Netlify site
