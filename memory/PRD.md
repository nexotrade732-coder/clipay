# CLIPAY - Social Media Monetization Platform

## Product Requirements Document

### Original Problem Statement
Build a production-ready web application called "CLIPAY," a social media monetization platform with an MLM matrix system. The user provided a complete HTML/CSS/JavaScript prototype and a logo.

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
- **Master User**: masteruser@clipay.com / password (Premium package, $451.00 balance)
- **Admin**: admin@clipay.com / password (full admin privileges)

---

## Changelog

### December 12, 2025 - Theme Update & Signup Enhancements

**Completed:**
- ✅ New CLIPAY logo with transparent background (teal/cyan clip icon, orange dollar sign)
- ✅ New color scheme: Teal (#0891b2) + Orange (#f97316) replacing dark blue
- ✅ Updated background gradients to match new brand colors
- ✅ Mobile Number field added to signup form
- ✅ Confirm Password field added with validation
- ✅ Password match indicator (green checkmark when matching)
- ✅ Backend updated to accept mobile number in signup

**Testing Status:**
- Backend: 100% pass rate (iteration_3)
- Frontend: 100% pass rate (iteration_3)

### December 12, 2025 - Initial UI/UX Redesign

**Completed:**
- ✅ Complete professional dark theme implementation
- ✅ Gradient backgrounds with mesh gradient effects
- ✅ Glass morphism card designs with hover effects
- ✅ Framer Motion animations (slide-up, fade-in, scale)
- ✅ All admin and user pages redesigned

---

## Roadmap

### P0 - Completed
- [x] Full backend implementation
- [x] User and admin authentication
- [x] Database integration (MongoDB)
- [x] Complete frontend scaffolding
- [x] Professional dark theme redesign
- [x] Animations and transitions
- [x] New brand colors (teal/orange)
- [x] New CLIPAY logo integration
- [x] Mobile number in signup
- [x] Confirm password validation

### P1 - Pending User Action
- [ ] SendGrid email configuration (user needs to provide API key)
- [ ] Production deployment

### P2 - Future Enhancements
- [ ] Real-time notifications (WebSocket)
- [ ] Mobile responsive improvements
- [ ] Advanced analytics dashboard
- [ ] Email verification flow
- [ ] 2FA authentication
- [ ] Backend refactoring (split server.py into routers)

---

## Architecture

```
/app/
├── backend/
│   ├── .env              # MongoDB URL, JWT secret
│   ├── requirements.txt  # Python dependencies
│   └── server.py         # Monolithic FastAPI server
└── frontend/
    ├── .env              # REACT_APP_BACKEND_URL
    ├── package.json      # React dependencies
    ├── tailwind.config.js
    ├── src/
    │   ├── index.css     # Global styles, teal/orange theme
    │   ├── App.js        # Main router
    │   ├── lib/context.js # Auth context, API client
    │   ├── components/
    │   │   └── DashboardLayout.js
    │   └── pages/
    │       ├── Landing.js, Auth.js
    │       ├── admin/    # All admin pages
    │       └── user/     # All user pages
```

---

## Design System

### Brand Colors (Updated)
- Primary Teal: #0891b2
- Light Teal: #22d3ee
- Primary Orange: #f97316
- Gold: #fbbf24
- Emerald: #10b981
- Background: Dark slate gradient (#0f172a to #1e293b)

### Components
- Glass cards with backdrop blur
- Gradient text effects (teal-to-orange)
- Icon boxes with teal/orange color coding
- Badge variants (success, warning, error, info)
- Animated buttons with shine effect

### Logo
- URL: https://customer-assets.emergentagent.com/job_7a7ddfe3-1bcc-44e3-8f6f-b4e056ab769d/artifacts/y7efvap2_Gemini_Generated_Image_i21q2mi21q2mi21q.png
- Colors: Teal clip icon, Orange dollar sign, Navy text
- Tagline: "SECURE PAYMENTS & REWARDS"

---

## API Endpoints

### Authentication
- POST `/api/auth/signup` - User registration (name, email, password, referral_code, mobile)
- POST `/api/auth/login` - User/Admin login

### User APIs
- GET `/api/users/me` - Current user profile
- GET `/api/packages/` - Available packages
- POST `/api/packages/purchase/{id}` - Purchase package
- GET `/api/links/` - Available watch links
- POST `/api/links/watch/{id}` - Watch and earn
- POST `/api/deposits/` - Create deposit request
- POST `/api/withdrawals/` - Create withdrawal request

### Admin APIs
- GET `/api/admin/dashboard` - Dashboard stats
- GET/PUT/DELETE `/api/admin/users/*` - User management
- GET/PUT `/api/admin/deposits/*` - Deposit management
- GET/PUT `/api/admin/withdrawals/*` - Withdrawal management
- CRUD `/api/admin/packages/*` - Package management
- CRUD `/api/admin/links/*` - Link management
- GET/PUT `/api/admin/mlm-settings` - MLM configuration
- CRUD `/api/admin/ranks/*` - Rank management
- GET/PUT `/api/admin/settings` - System settings

---

## Signup Form Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Full Name | text | Yes | Non-empty |
| Mobile Number | tel | Yes (frontend) | Min 10 characters |
| Referral Code | text | Yes | Must exist in system |
| Email Address | email | Yes | Valid email format |
| Password | password | Yes | Min 6 characters |
| Confirm Password | password | Yes | Must match password |
