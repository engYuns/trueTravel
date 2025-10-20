# Amadeus API Setup Guide

## Overview
Complete guide to set up and test Amadeus Flight Search API integration for True Travel B2B booking platform.

## Table of Contents
1. [Getting Amadeus Credentials](#getting-amadeus-credentials)
2. [Environment Configuration](#environment-configuration)
3. [Testing the Integration](#testing-the-integration)
4. [API Endpoints](#api-endpoints)
5. [Troubleshooting](#troubleshooting)
6. [Moving to Production](#moving-to-production)

---

## Getting Amadeus Credentials

### Step 1: Create Amadeus Account
1. Go to [Amadeus for Developers](https://developers.amadeus.com/)
2. Click **"Register"** in the top right
3. Fill in your details:
   - Full Name
   - Email Address
   - Company Name: **True Travel**
   - Company Location: **Erbil, Iraq**
   - Purpose: **B2B Booking Platform**
4. Verify your email address

### Step 2: Create Self-Service App
1. Log in to [Amadeus Developer Portal](https://developers.amadeus.com/signin)
2. Click **"My Self-Service Workspace"**
3. Click **"Create New App"**
4. Configure your app:
   - **App Name**: `True Travel B2B Production` (or similar)
   - **App Description**: B2B flight booking platform for travel agencies
   - **APIs to Enable**:
     - ✅ **Flight Offers Search** (required)
     - ✅ **Airport & City Search** (required)
     - ✅ **Flight Offers Price** (recommended)
     - ✅ **Flight Create Orders** (for booking, optional now)
5. Click **"Create"**

### Step 3: Get API Credentials
1. In your app dashboard, find:
   - **API Key** (also called Client ID)
   - **API Secret** (also called Client Secret)
2. **IMPORTANT**: Copy these immediately - you cannot see the secret again!

### Test vs Production Credentials
- **Test Environment**: Free, limited data, rate limits
- **Production Environment**: Requires agreement, real data, higher limits
- Start with **Test** for development

---

## Environment Configuration

### Step 1: Update .env.local
Open `frontend/.env.local` and replace placeholder values:

```env
# Amadeus API Configuration
AMADEUS_API_KEY=YOUR_ACTUAL_API_KEY_HERE
AMADEUS_API_SECRET=YOUR_ACTUAL_API_SECRET_HERE

# Test Environment (default)
AMADEUS_API_ENDPOINT=https://test.api.amadeus.com

# Production Environment (when ready)
# AMADEUS_API_ENDPOINT=https://api.amadeus.com
```

**Example with Real Credentials**:
```env
AMADEUS_API_KEY=Ab12Cd34Ef56Gh78
AMADEUS_API_SECRET=xYz987WvU654tSr321
AMADEUS_API_ENDPOINT=https://test.api.amadeus.com
```

### Step 2: Restart Next.js Dev Server
Environment variables only load on server start:

```bash
# Stop the current server (Ctrl+C)

# Restart
npm run dev
```

**Important**: Any changes to `.env.local` require a server restart!

---

## Testing the Integration

### Test 1: Location Autocomplete

1. **Start the Application**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Open Dashboard**
   - Navigate to `http://localhost:3000/dashboard`
   - Go to "Book a Flight" section

3. **Test "From" Field**
   - Click in the "From" input
   - Type: `Erbil`
   - **Expected**: Dropdown appears with:
     ```
     ✈ EBL - Erbil International Airport
        Erbil, Iraq
     ```

4. **Test "To" Field**
   - Click in the "To" input
   - Type: `Istanbul`
   - **Expected**: Dropdown shows:
     ```
     ✈ IST - Istanbul Airport
        Istanbul, Turkey
     ```

5. **Select Suggestions**
   - Click any suggestion
   - **Expected**: Input fills with formatted text like:
     ```
     EBL - Erbil International Airport, Erbil, IQ
     ```

### Test 2: Flight Search

1. **Fill Search Form**
   - **From**: Select "EBL - Erbil..."
   - **To**: Select "IST - Istanbul..."
   - **Departure**: Choose tomorrow's date
   - **Return**: Choose date +7 days
   - **Passengers**: 1 Adult
   - **Class**: Economy

2. **Click "Search Flights"**
   - **Expected**: Loading spinner appears
   - **Expected**: Search completes within 2-5 seconds
   - **Expected**: Flight results display with:
     - Airline name and flight number
     - Departure/arrival times
     - Duration and stops
     - Base price
     - Markup (if configured)
     - Total price

3. **Check Console (F12)**
   - Should see: `Searching for flights from EBL to IST...`
   - No error messages

### Test 3: Different Routes

Try these common routes:

| From | To | Expected Airlines |
|------|----|--------------------|
| EBL (Erbil) | IST (Istanbul) | Turkish Airlines, Pegasus |
| EBL (Erbil) | DXB (Dubai) | Emirates, FlyDubai, Iraqi Airways |
| IST (Istanbul) | LHR (London) | Turkish Airlines, British Airways |
| DXB (Dubai) | JFK (New York) | Emirates, Turkish Airlines (connect) |

### Test 4: Edge Cases

1. **Direct Flights Only**
   - Toggle "Direct Flights Only" checkbox
   - Search EBL → IST
   - **Expected**: Only non-stop flights shown

2. **Multiple Passengers**
   - Set 2 Adults, 1 Child, 1 Infant
   - Search any route
   - **Expected**: Prices reflect all passengers

3. **Business Class**
   - Select "Business" class
   - Search any route
   - **Expected**: Only business class fares shown

4. **No Results**
   - From: EBL
   - To: EBL (same airport)
   - **Expected**: Error message about validation

---

## API Endpoints

### 1. Flight Search
**Endpoint**: `POST /api/flights/search`

**Request Body**:
```json
{
  "originLocationCode": "EBL",
  "destinationLocationCode": "IST",
  "departureDate": "2024-06-15",
  "returnDate": "2024-06-22",
  "adults": 1,
  "children": 0,
  "infants": 0,
  "travelClass": "ECONOMY",
  "nonStop": false,
  "currencyCode": "USD"
}
```

**Response**:
```json
{
  "data": [
    {
      "id": "1",
      "airline": "Turkish Airlines",
      "flightNumber": "TK352",
      "departure": {
        "airport": "EBL",
        "time": "2024-06-15T10:30:00"
      },
      "arrival": {
        "airport": "IST",
        "time": "2024-06-15T13:45:00"
      },
      "duration": "3h 15m",
      "stops": 0,
      "cabinClass": "Economy",
      "price": {
        "amount": 250.00,
        "currency": "USD"
      }
    }
  ]
}
```

### 2. Location Search
**Endpoint**: `GET /api/locations/search?keyword={query}`

**Example Request**:
```
GET /api/locations/search?keyword=erbil
```

**Response**:
```json
{
  "data": [
    {
      "code": "EBL",
      "name": "Erbil International Airport",
      "city": "Erbil",
      "country": "Iraq",
      "displayText": "EBL - Erbil International Airport, Erbil, IQ"
    }
  ]
}
```

---

## Troubleshooting

### Issue: "Failed to fetch flights"

**Possible Causes**:
1. **Invalid Credentials**
   - Check `.env.local` has correct API key/secret
   - Verify no extra spaces or quotes
   - Restart dev server after changing `.env.local`

2. **Network Issues**
   - Check internet connection
   - Test: `ping test.api.amadeus.com`

3. **API Quota Exceeded**
   - Amadeus test accounts have rate limits
   - Wait 1 hour or contact Amadeus support

**Solution**:
```bash
# Check logs in terminal running npm run dev
# Should see error details
```

### Issue: "Autocomplete not working"

**Possible Causes**:
1. **Environment Variables Not Loaded**
   - Restart Next.js server
   - Verify `.env.local` is in `frontend/` directory

2. **Typing Too Fast**
   - Debounce delay is 300ms
   - Wait after typing 2+ characters

3. **No Results Found**
   - Try common cities: "London", "Dubai", "Paris"
   - Check Amadeus API dashboard for errors

### Issue: "401 Unauthorized"

**Solution**:
1. Verify credentials are correct
2. Check Amadeus app is active (not suspended)
3. Test credentials with cURL:
   ```bash
   curl -X POST https://test.api.amadeus.com/v1/security/oauth2/token \
     -H "Content-Type: application/x-www-form-urlencoded" \
     -d "grant_type=client_credentials&client_id=YOUR_KEY&client_secret=YOUR_SECRET"
   ```

### Issue: "No flights found"

**Possible Causes**:
1. **Route Not Available**
   - Test environment has limited routes
   - Try major routes: EBL-IST, DXB-LHR, IST-JFK

2. **Date Too Far in Future**
   - Try dates within next 30 days
   - Test environment may have older schedules

3. **Invalid Airport Codes**
   - Use autocomplete to ensure valid codes
   - Check: https://www.iata.org/en/publications/directories/code-search/

---

## Moving to Production

### Step 1: Get Production Credentials
1. Contact Amadeus sales: https://developers.amadeus.com/pricing
2. Sign production agreement
3. Receive production API credentials

### Step 2: Update Environment
```env
# Production Configuration
AMADEUS_API_KEY=production_api_key_here
AMADEUS_API_SECRET=production_api_secret_here
AMADEUS_API_ENDPOINT=https://api.amadeus.com
```

### Step 3: Test Thoroughly
- [ ] Test all major routes
- [ ] Verify pricing accuracy
- [ ] Test high-volume scenarios
- [ ] Confirm error handling
- [ ] Load testing (100+ searches/minute)

### Step 4: Monitor Usage
- Check Amadeus dashboard daily
- Set up alerts for quota limits
- Monitor API response times
- Track error rates

---

## API Rate Limits

### Test Environment
- **Free Tier**: 2,000 calls/month
- **Shared Test**: 10 calls/second
- **No SLA**: Best effort basis

### Production Environment
- **Custom Limits**: Based on agreement
- **Guaranteed SLA**: 99.5%+ uptime
- **Priority Support**: 24/7 assistance

---

## Cost Estimation

### Test (Free)
- $0 for development/testing
- Limited to test data
- Not for production use

### Production Pricing (Estimated)
- **Pay-per-call**: ~$0.001 - $0.005 per search
- **Monthly Volume Tiers**: Discounts at scale
- **Example**: 100,000 searches/month ≈ $300-500

**Note**: Contact Amadeus for exact pricing based on your volume.

---

## Security Best Practices

### 1. Never Expose Credentials
❌ **Don't**:
```javascript
// Client-side code - WRONG!
const apiKey = 'YOUR_KEY_HERE';
```

✅ **Do**:
```javascript
// Server-side API route - CORRECT!
const apiKey = process.env.AMADEUS_API_KEY;
```

### 2. Use Environment Variables
- Keep `.env.local` out of git (already in `.gitignore`)
- Use different credentials for dev/staging/production
- Rotate credentials regularly (every 90 days)

### 3. Implement Rate Limiting
```typescript
// Add to API routes
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 10 // 10 requests per minute per user
});
```

---

## Useful Resources

- **Amadeus Docs**: https://developers.amadeus.com/self-service
- **API Reference**: https://developers.amadeus.com/self-service/category/flights
- **Test Data**: https://github.com/amadeus4dev/data-collection
- **Status Page**: https://status.amadeus.com/
- **Support**: https://developers.amadeus.com/support

---

## Quick Reference

### Common Airport Codes
| City | Code | Airport Name |
|------|------|--------------|
| Erbil | EBL | Erbil International Airport |
| Baghdad | BGW | Baghdad International Airport |
| Istanbul | IST | Istanbul Airport |
| Dubai | DXB | Dubai International Airport |
| London | LHR | London Heathrow |
| Paris | CDG | Paris Charles de Gaulle |
| New York | JFK | John F. Kennedy International |

### Error Codes
| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request | Check request parameters |
| 401 | Unauthorized | Verify credentials |
| 429 | Too Many Requests | Wait or upgrade plan |
| 500 | Server Error | Retry or contact support |

---

## Next Steps

After successful setup:
1. ✅ Test flight searches with multiple routes
2. ✅ Verify location autocomplete works smoothly
3. ✅ Configure markup percentages for pricing
4. ✅ Set up error logging and monitoring
5. ✅ Plan production deployment strategy

**Need Help?**
- Check [LOCATION_AUTOCOMPLETE.md](./LOCATION_AUTOCOMPLETE.md) for autocomplete details
- Review [BOOK_A_FLIGHT_FEATURES.md](./BOOK_A_FLIGHT_FEATURES.md) for feature list
- Check console logs in browser (F12)
- Review terminal logs where `npm run dev` is running
