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
- Referral-only signup system
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

### December 12, 2025 - Complete UI/UX Redesign

**Completed:**
- ✅ Complete professional dark theme implementation across all pages
- ✅ Gradient backgrounds with mesh gradient effects
- ✅ Glass morphism card designs with hover effects
- ✅ Framer Motion animations (slide-up, fade-in, scale)
- ✅ Professional color scheme (blue, purple, orange, emerald accents)
- ✅ Colorful icon boxes with gradient backgrounds
- ✅ Enhanced Auth page with split layout and feature cards
- ✅ All admin pages redesigned (Dashboard, Users, Deposits, Withdrawals, Packages, Links, MLM, Ranks, Settings, Transactions)
- ✅ User dashboard with prominent stat cards
- ✅ Custom CSS utilities (input-dark, btn-primary, btn-secondary, badges)
- ✅ Responsive design maintained
- ✅ All functionality verified working via testing agent

**Testing Status:**
- Backend: All APIs tested and working (iteration_1)
- Frontend: 100% pass rate on UI redesign tests (iteration_2)

---

## Roadmap

### P0 - Completed
- [x] Full backend implementation
- [x] User and admin authentication
- [x] Database integration (MongoDB)
- [x] Complete frontend scaffolding
- [x] Professional dark theme redesign
- [x] Animations and transitions

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
    │   ├── index.css     # Global styles, dark theme, animations
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

## API Endpoints

### Authentication
- POST `/api/auth/signup` - User registration (requires referral code)
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

## Design System

### Colors
- Primary: Blue (#3b82f6)
- Accent: Orange (#f97316)
- Purple: (#8b5cf6)
- Emerald: (#10b981)
- Background: Dark slate (#0a0f1a)

### Components
- Glass cards with backdrop blur
- Gradient text effects
- Icon boxes with color coding
- Badge variants (success, warning, error, info)
- Animated buttons with hover effects

### Animations
- Slide-up on page load
- Fade-in transitions
- Scale on hover for cards
- Pulse glow effects
- Gradient shift animations
