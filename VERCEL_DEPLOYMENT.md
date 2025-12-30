# Vercel Deployment Guide

## Environment Variables Required in Vercel

Add these environment variables in your Vercel project settings:

### Required
- `NEXT_PUBLIC_APIHOST` = `https://github.kuaitu.cc`

## Deployment Settings

### In Vercel Dashboard:
1. **Root Directory**: Leave as default (root)
2. **Framework Preset**: Next.js (detected automatically)
3. **Build Command**: Uses `vercel.json` config (auto-detected)
4. **Output Directory**: `next-editor/.next` (from vercel.json)
5. **Install Command**: `pnpm install --frozen-lockfile` (from vercel.json)
6. **Node.js Version**: 18.x or higher (auto-detected from engines field)

### Package Manager
- Ensure **pnpm** is selected in Settings → General → Package Manager

## What Was Fixed

### ✅ 1. Vercel Configuration (vercel.json)
- Added proper build command that builds core package first
- Set framework to "nextjs" for better optimization
- Added Singapore region (sin1) for faster deployment in Asia
- Used `--frozen-lockfile` for consistent dependencies

### ✅ 2. Environment Variables
- Created `.env.production` with production API host
- Ready for Vercel environment variable configuration

### ✅ 3. Package Configuration
- Added Node.js >= 18.18.0 requirement
- Added pnpm >= 8.0.0 requirement
- Updated build script to use `--webpack` flag for consistency

### ✅ 4. Build Process
- Build command now builds `@kuaitu/core` dependency first
- Prevents workspace dependency resolution issues

## Post-Deployment Checklist

After deploying to Vercel:

- [ ] Verify build logs show core package building first
- [ ] Check environment variables are loaded correctly
- [ ] Test API calls to ensure NEXT_PUBLIC_APIHOST is working
- [ ] Verify webpack aliases are resolving correctly
- [ ] Check all assets in /public are served correctly
- [ ] Test responsive design on mobile
- [ ] Monitor deployment size (should be < 100MB for free tier)

## Common Issues & Solutions

### Build Fails on "workspace:*" dependency
**Solution**: The build command now builds core package first: `pnpm build:core && pnpm --filter next-editor build`

### Environment variable not found
**Solution**: Add `NEXT_PUBLIC_APIHOST` in Vercel project settings → Environment Variables

### Wrong Node.js version
**Solution**: Vercel will auto-detect from engines field (>= 18.18.0)

### Build times out
**Solution**: Upgrade to Vercel Pro or optimize dependencies

## Deployment Command

To deploy from CLI:
```bash
vercel --prod
```

Or connect your GitHub repository for automatic deployments.
