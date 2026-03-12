# CLIPAY - Social Media Monetization Platform

## Product Requirements Document

### Original Problem Statement
Build a production-ready web application called "CLIPAY," a social media monetization platform with an MLM matrix system.

### Technology Stack
- **Frontend**: React with TailwindCSS, Framer Motion
- **Backend**: FastAPI (Python)
- **Database**: MongoDB
- **Authentication**: JWT-based with passlib for password hashing

### Core Features Implemented

#### User Features
- Referral-only signup system (with mobile number & confirm password)
- JWT-based authentication (signin/signout)
- Manual deposit requests (USDT TRC20/BEP20, JazzCash)
- Package purchasing system
- Watch video links to earn daily
- Daily quota tracking
- Earnings calculation and display
- Withdrawal requests
- Referral system with unique codes
- Rank progression system
- Transaction history

#### Admin Features
- Comprehensive dashboard with stats
- User management (CRUD, block/unblock)
- Deposit approval/rejection
- Withdrawal processing
- Package management
- Watch link management
- MLM commission settings (3-level)
- Rank configuration
- System settings (payment addresses, fees)

### Pre-seeded Accounts
- **Master User**: masteruser@clipay.com / password
- **Admin**: admin@clipay.com / password

---

## Changelog

### December 12, 2025 - Final Updates Before Deployment

**Completed:**
- ✅ Updated CLIPAY logo (transparent background version)
- ✅ Added professional FAQ section (6 expandable questions) on homepage
- ✅ Added Social Media Partners section (YouTube, Instagram, Facebook, TikTok, Telegram, WhatsApp)
- ✅ Removed all prohibited words ("investment" replaced with "rewards")
- ✅ Moved Referral Code field to end of signup form
- ✅ Updated footer with "Secure Payments & Rewards" tagline

### December 12, 2025 - Theme Update & Signup Enhancements

**Completed:**
- ✅ New color scheme: Teal (#0891b2) + Orange (#f97316)
- ✅ Mobile Number field added to signup form
- ✅ Confirm Password field with validation
- ✅ Backend updated to accept mobile number

### December 12, 2025 - Initial UI/UX Redesign

**Completed:**
- ✅ Complete professional dark theme
- ✅ Gradient backgrounds with mesh effects
- ✅ Glass morphism cards with hover effects
- ✅ Framer Motion animations
- ✅ All admin and user pages redesigned

---

## Roadmap

### P0 - Completed ✅
- [x] Full backend implementation
- [x] User and admin authentication
- [x] Database integration (MongoDB)
- [x] Complete frontend scaffolding
- [x] Professional dark theme redesign
- [x] New brand colors (teal/orange)
- [x] New CLIPAY logo
- [x] Mobile number & confirm password in signup
- [x] FAQ section on homepage
- [x] Social Media Partners section
- [x] Removed prohibited words

### P1 - Ready for Deployment
- [ ] SendGrid email configuration (optional - user needs API key)
- [ ] Production deployment

### P2 - Future Enhancements
- [ ] Real-time notifications (WebSocket)
- [ ] Email verification flow
- [ ] 2FA authentication

---

## Design System

### Brand Colors
- Primary Teal: #0891b2
- Light Teal: #22d3ee
- Primary Orange: #f97316
- Gold: #fbbf24
- Emerald: #10b981
- Background: Dark gradient (#0f172a to #1e293b)

### Logo
- URL: https://customer-assets.emergentagent.com/job_7a7ddfe3-1bcc-44e3-8f6f-b4e056ab769d/artifacts/y50yreb7_Gemini_Generated_Image_i21q2mi21q2mi21q-removebg-preview.png
- Transparent background
- Colors: Teal clip icon, Orange dollar sign

---

## Signup Form Fields Order

1. Full Name
2. Mobile Number
3. Email Address
4. Password
5. Confirm Password
6. Referral Code (at the end)

---

## Landing Page Sections

1. Hero - "Turn Your Screen Time Into Real Rewards"
2. Social Media Partners (YouTube, Instagram, Facebook, TikTok, Telegram, WhatsApp)
3. How It Works (3 steps)
4. Rewards Packages (Starter, Premium, Elite)
5. FAQ Section (6 questions)
6. Trust Section (Security, Payouts, Global, Members)
7. CTA Section
8. Footer
