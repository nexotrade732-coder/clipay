# CLIPAY - Product Requirements Document

## Original Problem Statement
Build a production-ready web application called "CLIPAY" - a social media monetization platform with an MLM matrix system. Features include user/admin authentication, manual payment processing with QR codes, video watching with rewards, referral system, and rank progression.

## Technology Stack
- **Frontend:** React + TailwindCSS + Framer Motion
- **Backend:** FastAPI (Python)
- **Database:** MongoDB
- **Authentication:** JWT

## User Personas
1. **Regular User:** Signs up via referral, purchases packages, watches videos to earn, withdraws earnings
2. **Admin:** Manages users, deposits, withdrawals, packages, links, MLM settings, ranks, and system settings

## Core Requirements

### User Features
- [x] Referral-only signup with mobile number and confirm password
- [x] Signin/Signout with JWT authentication
- [x] Manual deposits with QR code payment methods
- [x] Package purchasing
- [x] **50-second video timer** - mandatory watch duration before earning rewards
- [x] Daily quotas based on active package
- [x] Earnings calculation
- [x] Withdrawal requests with 2-referral requirement
- [x] **USD to PKR conversion** on Deposit and Withdraw pages
- [x] Referral system with 3-level commission structure
- [x] Rank progression with bonuses
- [x] Transaction history

### Admin Features
- [x] Full CRUD management for users
- [x] Deposits management (approve/reject)
- [x] Withdrawals management (approve/reject)
- [x] Package management
- [x] Watch links management
- [x] MLM settings (commission percentages)
- [x] Ranks management
- [x] System settings including:
  - [x] Payment methods with QR code uploads
  - [x] **USD to PKR exchange rate configuration**
  - [x] Withdrawal fee and minimum settings

## What's Been Implemented (December 2025)

### Phase 1: Core Application (Completed)
- Full-stack application with React frontend and FastAPI backend
- MongoDB integration with all required collections
- JWT-based authentication for users and admin
- Complete user dashboard with all features
- Complete admin dashboard with all management features

### Phase 2: UI/UX Redesign (Completed)
- Professional dark theme with animations
- New CLIPAY logos throughout the application
- FAQ section on landing page
- Social media partner section
- Responsive design for all pages

### Phase 3: Payment System Enhancement (Completed)
- QR code upload functionality for payment methods
- QR codes visible on user deposit page
- Three payment methods: USDT TRC20, USDT BEP20, JazzCash

### Phase 4: Latest Features (Completed - Dec 14, 2025)
- **50-second Video Watch Timer**
  - Mandatory wait before claiming rewards
  - Visual countdown with progress ring
  - Warning if user closes early (video locked for day)
  - Claim button enabled only after 50 seconds
- **USD to PKR Currency Conversion**
  - Admin configurable exchange rate in Settings
  - Deposit page shows PKR equivalent
  - Withdraw page shows gross PKR, fee deduction, net PKR
  - History tables show PKR amounts

### Phase 5: Logo Update (Completed - Dec 14, 2025)
- **Updated CLIPAY Logo** across all pages:
  - Landing page navbar and footer
  - Sign-in/Sign-up page
  - User dashboard sidebar
  - Admin dashboard sidebar
  - Metadata (favicon, apple-touch-icon)
  - Open Graph and Twitter images
  - PWA manifest.json with proper icons

## Key API Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User/Admin login
- `GET /api/deposits/settings` - Get payment settings including USD to PKR rate
- `PUT /api/admin/settings` - Update system settings including exchange rate
- `POST /api/watch/{link_id}` - Claim video watch reward

## Database Schema (Key Collections)
- **users:** id, email, password, balance, referral_code, active_package, etc.
- **settings:** platform_name, withdrawal settings, payment addresses, QR codes, usd_to_pkr_rate
- **packages, deposits, withdrawals, watch_links, transactions, ranks, mlm_settings**

## Credentials
- **User Account:** masteruser@clipay.com / password
- **Admin Account:** admin@clipay.com / password

## Testing Status
- Iteration 4: 100% pass rate (backend + frontend)
- All new features verified working

## Backlog / Future Tasks
- **P1:** Deployment preparation
- **P2:** SendGrid email integration (requires user API key)
- **P3:** Server.py refactoring into separate router files
