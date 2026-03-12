# CLIPAY - Social Media Monetization Platform with MLM Matrix System

## Project Overview
CLIPAY is a complete social media monetization platform where users earn money by watching videos and building referral networks through an MLM matrix system.

## Architecture
- **Frontend**: React 18 + TailwindCSS + Lucide Icons
- **Backend**: FastAPI (Python) with async MongoDB
- **Database**: MongoDB
- **Authentication**: JWT-based (72-hour expiry)
- **Email**: SendGrid (placeholder configured)

## Core Features Implemented

### User Side
- [x] Landing page with hero, features, and package preview
- [x] Signup with mandatory referral code
- [x] Login/Logout with JWT
- [x] Dashboard with balance, earnings, team stats
- [x] Package purchase (Starter $20, Premium $100, Elite $500)
- [x] Watch & Earn - daily quota tracking with video links
- [x] Deposit funds (USDT TRC20/BEP20, JazzCash manual)
- [x] Withdraw (requires 2 direct referrals minimum)
- [x] Referral system with copy link/code
- [x] Rank progression (Bronze, Silver, Gold)
- [x] Transaction history
- [x] Profile management

### Admin Side
- [x] Dashboard with platform stats
- [x] User management (view, edit, block, delete)
- [x] Deposit approval/rejection
- [x] Withdrawal approval/rejection
- [x] Package CRUD operations
- [x] Watch links management
- [x] MLM commission settings (Level 1: 15%, Level 2: 5%, Level 3: 2%)
- [x] Rank management
- [x] Payment settings (USDT addresses, JazzCash details)
- [x] Transaction viewer

### MLM System
- 3-level commission structure
- Automatic commission distribution on watch earnings and package purchases
- Rank bonuses when milestones achieved

## Test Accounts
- **Master User**: masteruser@clipay.com / password (Balance: $450.50, Premium package)
- **Admin**: admin@clipay.com / password (Full admin access)

## API Endpoints
- POST /api/auth/signup - User registration
- POST /api/auth/login - User login
- GET /api/auth/me - Get current user
- PUT /api/auth/profile - Update profile
- GET /api/packages - List packages
- POST /api/packages/purchase/{id} - Purchase package
- GET /api/deposits/settings - Get payment addresses
- POST /api/deposits - Create deposit
- POST /api/withdrawals - Create withdrawal
- GET /api/watch/links - Get watch links
- POST /api/watch/{id} - Record watch
- GET /api/referrals/stats - Get referral stats
- GET /api/ranks/progress - Get rank progress
- GET /api/transactions - Get transaction history
- GET /api/admin/* - Admin endpoints

## What's Been Implemented (Jan 2026)
1. Complete backend with all 40+ API endpoints
2. Full React frontend with 20+ pages/components
3. Test data seeding (users, packages, ranks, links, settings)
4. MLM commission distribution system
5. Rank progression system
6. Manual payment system with admin approval

## Backlog / Future Enhancements
### P0 (Critical)
- [ ] Configure SendGrid API key for email notifications

### P1 (High Priority)
- [ ] Add QR code generation for payment addresses
- [ ] Real-time notifications with WebSocket
- [ ] Password reset flow

### P2 (Nice to Have)
- [ ] Two-factor authentication
- [ ] Export transactions to CSV
- [ ] Dashboard charts with Recharts
- [ ] User activity analytics

## Environment Variables
### Backend (.env)
- MONGO_URL
- DB_NAME
- JWT_SECRET
- SENDGRID_API_KEY (to be configured)
- SENDER_EMAIL

### Frontend (.env)
- REACT_APP_BACKEND_URL
