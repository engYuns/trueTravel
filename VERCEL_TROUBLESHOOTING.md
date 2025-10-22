# Vercel Deployment Troubleshooting Guide

## Issue: "An unexpected error happened when running this build"

This error typically occurs due to one of the following reasons:

### ✅ Solutions Applied

1. **Added `force-dynamic` export to API routes**
   - This tells Vercel to treat these as dynamic routes
   - Prevents static generation errors with environment variables

2. **Improved error handling**
   - Better messages when environment variables are missing
   - Returns 503 (Service Unavailable) instead of 500 when credentials not configured

3. **Created health check endpoint**
   - New endpoint: `GET /api/health`
   - Helps verify deployment status
   - Shows if Amadeus credentials are configured

### 🔍 How to Diagnose

#### Step 1: Check Vercel Build Logs
1. Go to https://vercel.com/dashboard
2. Click on your **trueTravel** project
3. Click on the latest deployment
4. Look at the **Build Logs** tab
5. Look for specific error messages

#### Step 2: Verify Environment Variables
1. In Vercel dashboard, go to **Settings** → **Environment Variables**
2. Make sure these are configured:
   ```
   AMADEUS_API_KEY
   AMADEUS_API_SECRET
   AMADEUS_API_ENDPOINT
   ```
3. Make sure they're enabled for **Production**, **Preview**, and **Development**

#### Step 3: Test Health Endpoint
After deployment succeeds:
1. Visit: `https://your-domain.vercel.app/api/health`
2. Should return:
   ```json
   {
     "status": "ok",
     "timestamp": "2025-10-20T...",
     "environment": "production",
     "amadeusConfigured": true
   }
   ```
3. If `amadeusConfigured` is `false`, environment variables aren't set

### 🛠️ Common Build Errors

#### Error: "Module not found"
**Cause**: Missing dependency or incorrect import path
**Solution**: 
```bash
cd frontend
npm install
```
Then commit and push again.

#### Error: "Environment variable not found"
**Cause**: Using environment variables during build time
**Solution**: Use them only at runtime in API routes (already fixed)

#### Error: "Cannot find module '@/lib/...'"
**Cause**: TypeScript path alias not configured
**Solution**: Verify `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### Error: "Type error in route.ts"
**Cause**: TypeScript compilation error
**Solution**: Run `npm run build` locally to find the error

### 📋 Deployment Checklist

- [ ] **Push succeeded** (check `git status` shows clean)
- [ ] **Vercel detected push** (check deployments tab)
- [ ] **Build started** (see "Building..." status)
- [ ] **Environment variables configured** (Settings → Environment Variables)
- [ ] **Build logs show no errors** (Deployments → View Build Logs)
- [ ] **Deployment successful** (see "Ready" status with URL)
- [ ] **Health endpoint works** (visit `/api/health`)
- [ ] **Frontend loads** (visit your Vercel URL)
- [ ] **Autocomplete works** (test location search)
- [ ] **Flight search works** (test full search flow)

### 🔄 If Build Still Fails

#### Option 1: Redeploy from Vercel Dashboard
1. Go to Deployments tab
2. Click three dots (•••) on latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache** (faster) or clear cache

#### Option 2: Check Next.js Version
Verify `frontend/package.json`:
```json
{
  "dependencies": {
    "next": "^15.5.4"  // Should be compatible
  }
}
```

#### Option 3: Clear Vercel Cache
1. In project settings
2. Find **Build & Development Settings**
3. Toggle **Clear Build Cache** option
4. Redeploy

#### Option 4: Enable Detailed Logging
Add to `frontend/next.config.mjs`:
```javascript
const nextConfig = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};
```

### 📞 Getting Help

#### Check Vercel Status
- https://www.vercel-status.com/
- Ensure Vercel platform is operational

#### Vercel Support
If the issue persists:
1. Copy the full build log
2. Visit: https://vercel.com/support
3. Or contact via Vercel dashboard Help button

#### Check Deployment URL
After successful deployment:
- **Production**: Assigned automatically by Vercel
- **Preview**: Created for each push
- **Check**: Deployments tab shows URL

### ✅ Success Indicators

When deployment succeeds, you'll see:
- ✅ Green checkmark in Vercel dashboard
- ✅ "Deployment Ready" notification
- ✅ Assigned URL (e.g., `true-travel-xyz.vercel.app`)
- ✅ Health endpoint returns `{"status": "ok"}`
- ✅ Frontend loads without errors
- ✅ API routes respond correctly

### 🎯 Next Steps After Successful Deployment

1. **Add Environment Variables** (if not done)
   ```
   AMADEUS_API_KEY=dvRgOd4N3TlUmhyu36irY6dPPyNLMF7w
   AMADEUS_API_SECRET=3WfsKdu63T9aeQwd
   AMADEUS_API_ENDPOINT=https://test.api.amadeus.com
   ```

2. **Redeploy** after adding variables
   - Automatic redeploy OR
   - Manual redeploy from dashboard

3. **Test Live Site**
   - Visit your Vercel URL
   - Test location autocomplete
   - Test flight search
   - Verify results display

4. **Monitor Performance**
   - Check Vercel Analytics
   - Monitor API usage
   - Watch for errors in logs

### 📝 Recent Changes Pushed

**Commit**: `fix: Improve Vercel build compatibility and error handling`

Changes:
- ✅ Added `export const dynamic = 'force-dynamic'` to all API routes
- ✅ Improved error messages for missing credentials
- ✅ Created `/api/health` endpoint for monitoring
- ✅ Changed error status to 503 when credentials not configured
- ✅ Added helpful messages in error responses

**Expected Result**: Build should now succeed, but will return 503 errors until you add environment variables.

---

**Last Updated**: October 20, 2025
**Status**: Awaiting Vercel deployment after latest push
