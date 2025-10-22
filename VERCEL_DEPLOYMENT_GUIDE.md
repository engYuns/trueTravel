# True Travel B2B Booking Platform - Vercel Deployment Guide

## 🚀 Complete Deployment Steps

### Prerequisites
- ✅ GitHub account with repository access
- ✅ Vercel account (free tier works)
- ✅ Amadeus API credentials (API Key & Secret)

---

## Step 1: Prepare Your Repository

Your code has been pushed to GitHub at: `https://github.com/engYuns/trueTravel`

---

## Step 2: Deploy to Vercel

### 2.1 Connect to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Click **"Import Git Repository"**
4. Select your repository: **engYuns/trueTravel**
5. Click **"Import"**

### 2.2 Configure Project Settings

**Framework Preset:** Next.js (Auto-detected)

**Root Directory:** 
```
frontend
```
⚠️ **IMPORTANT**: Set root directory to `frontend` since your Next.js app is inside the frontend folder

**Build Settings:**
- Build Command: `npm run build` (default)
- Output Directory: `.next` (default)
- Install Command: `npm install` (default)

---

## Step 3: Configure Environment Variables

### 3.1 Add Environment Variables

Click **"Environment Variables"** section and add the following:

#### Required Variables:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `AMADEUS_API_KEY` | `dvRgOd4N3TlUmhyu36irY6dPPyNLMF7w` | Production, Preview, Development |
| `AMADEUS_API_SECRET` | `3WfsKdu63T9aeQwd` | Production, Preview, Development |
| `AMADEUS_API_ENDPOINT` | `https://test.api.amadeus.com` | Production, Preview, Development |

**How to add:**
1. Enter variable name in "Key" field
2. Enter value in "Value" field
3. Select all environments: ☑️ Production ☑️ Preview ☑️ Development
4. Click **"Add"**
5. Repeat for all variables

### 3.2 Environment Variables Screenshot
```
┌─────────────────────────┬────────────────────────────────────┬─────────────────────────┐
│ Key                     │ Value                              │ Environments            │
├─────────────────────────┼────────────────────────────────────┼─────────────────────────┤
│ AMADEUS_API_KEY         │ dvRgOd4N3TlUmhyu36irY6dPPyNLMF7w  │ Production, Preview, Dev│
│ AMADEUS_API_SECRET      │ 3WfsKdu63T9aeQwd                   │ Production, Preview, Dev│
│ AMADEUS_API_ENDPOINT    │ https://test.api.amadeus.com       │ Production, Preview, Dev│
└─────────────────────────┴────────────────────────────────────┴─────────────────────────┘
```

---

## Step 4: Deploy

1. After adding environment variables, click **"Deploy"**
2. Vercel will:
   - ✅ Clone your repository
   - ✅ Install dependencies
   - ✅ Build your Next.js application
   - ✅ Deploy to production
3. Wait 2-5 minutes for deployment to complete

---

## Step 5: Verify Deployment

### 5.1 Check Deployment Status

Once deployed, you'll see:
- ✅ **Deployment URL**: `https://your-project-name.vercel.app`
- ✅ **Status**: Ready

### 5.2 Test Your Application

1. **Visit Homepage:**
   ```
   https://your-project-name.vercel.app
   ```

2. **Test Login:**
   - Go to: `https://your-project-name.vercel.app/login`
   - Username: `admin`
   - Password: `admin123`
   - Click "Sign In"

3. **Test Dashboard:**
   - Should redirect to: `https://your-project-name.vercel.app/dashboard`
   - Verify all navigation works

4. **Test API Health:**
   ```
   https://your-project-name.vercel.app/api/health
   ```
   **Expected Response:**
   ```json
   {
     "status": "ok",
     "timestamp": "2025-10-22T...",
     "environment": "production",
     "amadeusConfigured": true
   }
   ```

5. **Test Flight Search:**
   - Go to Dashboard
   - Select: From: **Erbil (EBL)** → To: **Dubai (DXB)**
   - Date: Any future date
   - Passengers: 1 Adult
   - Click "Search Flight"
   - Should redirect to `/flightResult` with real flight data

---

## Step 6: Custom Domain (Optional)

### 6.1 Add Your Domain

1. Go to **Project Settings** → **Domains**
2. Click **"Add"**
3. Enter your domain: `trutravel.com` or `www.trutravel.com`
4. Follow DNS configuration instructions
5. Vercel will automatically handle SSL certificates

### 6.2 DNS Configuration

Add these records to your domain provider:

**For Root Domain (trutravel.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For Subdomain (www.trutravel.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

---

## Troubleshooting

### Build Fails

**Error: "An unexpected error happened"**

**Solution:**
1. Check Build Logs in Vercel dashboard
2. Verify environment variables are set correctly
3. Ensure root directory is set to `frontend`
4. Check `VERCEL_TROUBLESHOOTING.md` in repository

### API Returns 503 Error

**Error: "API credentials not configured"**

**Solution:**
1. Go to **Project Settings** → **Environment Variables**
2. Verify all three variables are present:
   - AMADEUS_API_KEY
   - AMADEUS_API_SECRET
   - AMADEUS_API_ENDPOINT
3. Ensure they're enabled for "Production" environment
4. **Redeploy** the project (Deployments → ⋯ → Redeploy)

### Flight Search Returns No Results

**Possible Issues:**
1. Invalid airport codes (use IATA codes like EBL, IST, DXB)
2. Amadeus API rate limits exceeded
3. Check browser console for errors
4. Verify `/api/health` shows `amadeusConfigured: true`

---

## Post-Deployment Checklist

- [ ] ✅ Project deployed successfully
- [ ] ✅ Environment variables configured
- [ ] ✅ `/api/health` returns `amadeusConfigured: true`
- [ ] ✅ Login works (admin/admin123)
- [ ] ✅ Dashboard loads correctly
- [ ] ✅ Location autocomplete works (shows Middle East airports)
- [ ] ✅ Flight search redirects to results page
- [ ] ✅ Flight results display real Amadeus data
- [ ] ✅ Filters work (Airlines, Price, Cabin Type)
- [ ] ✅ All navigation links work
- [ ] ✅ Mobile responsive design works
- [ ] 🔧 Custom domain configured (if applicable)

---

## Automatic Deployments

Vercel automatically deploys when you push to GitHub:

### Production Deployments (master branch)
```bash
git add .
git commit -m "your message"
git push origin master
```
Deploys to: `https://your-project-name.vercel.app`

### Preview Deployments (other branches)
```bash
git checkout -b feature-branch
git add .
git commit -m "test feature"
git push origin feature-branch
```
Deploys to: `https://your-project-name-git-feature-branch.vercel.app`

---

## Monitoring & Analytics

### 6.1 View Logs
1. Go to **Deployments** tab
2. Click on latest deployment
3. View **Build Logs** or **Function Logs**
4. Filter by API route: `/api/flights/search`

### 6.2 Analytics (Pro Plan)
- Page views
- API calls
- Performance metrics
- User behavior

---

## Production URL

After deployment, your application will be available at:

```
🌐 Production: https://true-travel-[your-unique-id].vercel.app
```

Or with custom domain:
```
🌐 Custom Domain: https://trutravel.com
```

---

## Support & Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Amadeus API Docs**: https://developers.amadeus.com/
- **Troubleshooting Guide**: See `VERCEL_TROUBLESHOOTING.md` in repository

---

## Quick Reference Commands

### Local Development
```bash
cd frontend
npm install
npm run dev
# Visit: http://localhost:3000
```

### Environment Variables (Local)
File: `frontend/.env.local`
```env
AMADEUS_API_KEY=dvRgOd4N3TlUmhyu36irY6dPPyNLMF7w
AMADEUS_API_SECRET=3WfsKdu63T9aeQwd
AMADEUS_API_ENDPOINT=https://test.api.amadeus.com
```

### Git Commands
```bash
# Check status
git status

# Add all changes
git add .

# Commit with message
git commit -m "your message here"

# Push to GitHub (triggers Vercel deployment)
git push origin master

# View commit history
git log --oneline
```

---

## Important Notes

### Security
- ✅ API credentials are server-side only (not exposed to browser)
- ✅ Next.js API routes act as secure proxy
- ✅ Environment variables are encrypted in Vercel
- ⚠️ Never commit `.env.local` to Git

### Performance
- ⚡ Vercel Edge Network (CDN)
- ⚡ Automatic HTTPS/SSL
- ⚡ Image optimization
- ⚡ Serverless functions for API routes

### Amadeus API Limits (Test Environment)
- **Rate Limit**: 10 requests per second
- **Monthly Quota**: Check your Amadeus dashboard
- **Caching**: OAuth tokens cached for ~30 minutes

---

## Success Indicators

Your deployment is successful when:

1. ✅ Build completes without errors
2. ✅ Homepage loads with True Travel branding
3. ✅ Login redirects to dashboard
4. ✅ Dashboard shows all 6 service cards
5. ✅ Location autocomplete shows 18 Middle East airports
6. ✅ Flight search returns real results from Amadeus API
7. ✅ Flight results page displays with filters
8. ✅ All prices and flight details are accurate
9. ✅ No console errors in browser developer tools
10. ✅ `/api/health` shows all systems operational

---

## Next Steps After Deployment

1. **Testing**: Test all features thoroughly in production
2. **Monitoring**: Set up monitoring for errors and performance
3. **Analytics**: Enable Vercel Analytics to track usage
4. **Custom Domain**: Add your company domain
5. **Production API**: Switch from Amadeus test to production API
6. **Scaling**: Monitor usage and upgrade Vercel plan if needed
7. **Features**: Continue adding hotel, transfer, car rental services

---

**Deployment Date**: October 22, 2025
**Version**: 1.0.0
**Status**: Ready for Production ✅
