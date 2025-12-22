# True Travel B2B Booking Platform

B2B travel booking platform for True Travel (Erbil, Iraq) - Built for speed, scalability, and high-volume booking transactions.

## Architecture Overview

**Monorepo Structure**: Frontend + Backend microservices + Shared database
- **Frontend**: Next.js 15 (App Router) with Turbopack, deployed to Vercel
- **Backend**: 4 microservices (API Gateway, Booking, User, Payment) - Node.js + TypeScript
- **Database**: PostgreSQL with UUID-based schemas (`users.*`, `bookings.*`, `payments.*`)
- **Caching**: Redis for session management and API response caching
- **External APIs**: Amadeus Flight API (self-service OAuth2)

### Service Communication
- **API Gateway** (port 3001) → Proxies to microservices using `http-proxy-middleware`
- Routes: `/api/bookings` → booking-service (3002), `/api/users` → user-service (3003), `/api/payments` → payment-service (3004)
- Frontend → Direct API routes (`/api/*`) for flight search, bypassing gateway

## Development Workflow

### Quick Start
```bash
npm run dev              # Runs both frontend (3000) + backend (3001-3004)
npm run docker:up        # Start PostgreSQL + Redis via docker-compose
npm run install:all      # Install all dependencies (root + frontend + backend)
```

### Key Commands
- **Frontend**: `cd frontend && npm run dev` (Next.js with Turbopack)
- **Backend**: `cd backend && npm run dev` (Concurrently runs all 4 services)
- **Docker**: `docker-compose up -d` → Starts Postgres (5432) + Redis (6379)

### Environment Variables
**Frontend** (`.env.local`):
```
AMADEUS_API_KEY=your_key
AMADEUS_API_SECRET=your_secret
AMADEUS_API_ENDPOINT=https://test.api.amadeus.com  # or production URL
```

**Backend Services**: Each service expects `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET` (see `docker-compose.yml`)

## Frontend Patterns

### App Router Structure
- **Middleware**: Cookie-based auth check (`isLoggedIn`) → Redirects `/dashboard` if unauthenticated
- **API Routes**: Server-side only (`route.ts`) for Amadeus integration - handles OAuth2 token caching
- **Page Components**: All client components (`'use client'`) with state management via React hooks

### Key Features
1. **Multi-language Support**: `LanguageContext` (English/Kurdish) - All strings in `contexts/LanguageContext.tsx`
2. **Location Autocomplete**: Debounced Amadeus API calls (300ms) in `components/FlightSearchForm.tsx`
3. **Icon System**: Material Design SVG icons (20x20px, solid fill) - See `ICON_SYSTEM.md`
4. **Recent Searches**: localStorage persistence with fallback for SSR compatibility

### Critical Files
- `lib/amadeusService.ts` → OAuth2 token caching + API wrappers (`searchFlights`, `searchLocations`)
- `middleware.ts` → Route protection for `/dashboard/*`
- `app/dashboard/page.tsx` → Main B2B interface (1585 lines) with embedded search, stats, menu system

## Backend Patterns

### Microservice Structure
Each service follows: `Dockerfile` + `src/index.ts` + Express setup with:
- **Helmet** (security headers), **CORS**, **Morgan** (logging), **Rate limiting** (100 req/15min)
- Health check: `GET /health` returns `{ status: 'OK', service: 'ServiceName' }`

### Database
- **Schema separation**: Use `users.*`, `bookings.*`, `payments.*` namespaces
- **Migrations**: Manual via `database/init.sql` (loaded on container startup)
- **UUIDs**: All primary keys use `uuid_generate_v4()`

### Integration Points
- **API Gateway**: Proxies requests with path rewriting (`/api/bookings` → booking-service root)
- **Redis**: Used for caching Amadeus tokens (expires_in - 300s safety margin)

## Project-Specific Conventions

### TypeScript
- **Strict mode enabled** across all services
- Interface naming: `FlightSearchParams`, `AmadeusConfig` (descriptive, no `I` prefix)
- API responses: Always `{ success: boolean, data?: any, error?: string }`

### Error Handling
- **API Routes**: Try-catch with detailed console.error + 500/400/503 status codes
- **Frontend**: User-facing error messages via state (`error` string in components)
- **Backend**: Structured logging with service name in health checks

### Deployment
- **Vercel**: Frontend only (`frontend/` as root directory)
- **Backend**: Railway/Heroku/Docker (not Vercel) - See `DEPLOYMENT_GUIDE.md`
- **Environment**: Test credentials during dev, production keys for live deployment

## Documentation
- **AMADEUS_API_SETUP.md**: Complete Amadeus onboarding guide
- **IMPLEMENTATION_SUMMARY.md**: Flight search feature breakdown
- **DEPLOYMENT_GUIDE.md**: Step-by-step Vercel + backend deployment
- **ICON_SYSTEM.md**: SVG icon standards and implementation

## Critical Notes
- **Do NOT** use emoji icons - Use Material Design SVG (see dashboard for examples)
- **Cookie auth**: Simple `isLoggedIn` cookie (replace with JWT in production)
- **Popular cities**: Hardcoded in `dashboard/page.tsx` (Middle East focus: EBL, IST, DXB, DOH, etc.)
- **Turbopack**: Default dev server for faster builds (Next.js 15 feature)