# ORO API Deployment Guide

## Quick Deploy to Render (Recommended)

1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository: `OROORACLE/oro-mvp`
5. Configure:
   - **Name**: `oro-api`
   - **Root Directory**: `api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Click "Create Web Service"
7. Wait for deployment (2-3 minutes)
8. Copy the URL (e.g., `https://oro-api.onrender.com`)

## Alternative: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Set **Root Directory** to `api`
4. Deploy

## After Deployment

1. Test the API: `https://your-api-url.com/health`
2. Update the smart contract's `baseMetadataURI` to point to your API
3. Deploy the frontend to Vercel with the API URL

## Environment Variables

No environment variables needed for basic deployment.
