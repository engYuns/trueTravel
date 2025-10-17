# True Travel B2B Booking Platform

## 🚀 Live Demo
**Client Access URL:** Will be available after Vercel deployment

## 📋 Quick Setup for Development

### Prerequisites
- Node.js 18+ installed
- Git installed

### Installation Steps

1. **Clone the repository:**
```bash
git clone <your-repo-url>
cd trueTravel
```

2. **Install dependencies:**
```bash
npm install
```

3. **Install frontend dependencies:**
```bash
cd frontend
npm install
```

4. **Start development servers:**
```bash
# From root directory
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend services: Various ports (3001-3004)

### 🔐 Login Credentials
- **Username:** Any valid text (e.g., "admin", "demo")
- **Password:** Any valid text (e.g., "password", "123456")

## 🌐 Client Access

### Live URLs (After Deployment)
- **Production Site:** https://your-app.vercel.app
- **Dashboard:** https://your-app.vercel.app/dashboard
- **Login:** https://your-app.vercel.app/login

## 📱 Features
- ✅ Multi-language support (English/Kurdish)
- ✅ Country selection dropdown
- ✅ Professional dashboard with BookingAgora-style interface
- ✅ Real-time statistics and balance management
- ✅ True Travel branding throughout
- ✅ Responsive design for all devices

## 🛠 Tech Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS
- **Backend:** Node.js, TypeScript (Microservices)
- **Database:** PostgreSQL with Redis caching
- **Deployment:** Vercel (Frontend) + Railway/Heroku (Backend)

## 📋 Project Structure
```
trueTravel/
├── frontend/          # Next.js application
├── backend/           # API Gateway
├── services/          # Microservices
│   ├── booking/       # Booking service
│   ├── user/          # User management
│   └── payment/       # Payment processing
├── database/          # PostgreSQL schemas
└── docker-compose.yml # Development environment
```

## 🔄 Development Workflow
1. Make changes to code
2. Push to GitHub
3. Vercel automatically deploys
4. Client sees updates instantly at live URL

## Development Guidelines
- Prioritize performance and scalability
- Use TypeScript for type safety
- Implement proper error handling for booking transactions
- Design for horizontal scaling
- Follow microservices best practices
- Implement proper caching strategies

## 📞 Contact
**True Travel**
- Phone: +964 750 330 3003
- Email: info@truetravel.com
- Location: Dream City Mall, Erbil, Kurdistan Region