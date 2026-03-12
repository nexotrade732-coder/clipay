import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, api } from '@/lib/context';
import { Play, Package, Users, ArrowRight, Star, Check, Shield, Zap, Globe } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_4a166503-bc53-49ed-ab97-fc691e864fef/artifacts/2wqdbjxc_WhatsApp%20Image%202026-03-12%20at%204.43.20%20AM.jpeg";

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Seed data on first load
    api.post('/seed').catch(() => {});
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate(user.role === 'admin' ? '/admin' : '/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50" data-testid="landing-page">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <img src={LOGO_URL} alt="CLIPAY" className="h-10 w-auto" />
            </Link>
            <div className="flex items-center gap-3">
              {user ? (
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                  data-testid="go-to-dashboard-btn"
                >
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/auth"
                    className="px-4 py-2 text-slate-600 text-sm font-medium hover:text-slate-900 transition-colors"
                    data-testid="login-btn"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth"
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors"
                    data-testid="signup-btn"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-medium mb-6">
              <Star className="w-4 h-4" />
              New Era of Social Rewards
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight tracking-tight">
              Earn Money Watching{' '}
              <span className="gradient-text">Social Media</span>{' '}
              Videos
            </h1>
            <p className="text-lg text-slate-500 mb-8 max-w-2xl mx-auto">
              Turn your screen time into real earnings. Purchase a package, watch daily links from top platforms, and build your network for unlimited commissions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={handleGetStarted}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 text-white rounded-xl font-medium shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-0.5 btn-press flex items-center justify-center gap-2"
                data-testid="hero-cta-btn"
              >
                Start Earning Now
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to="/auth"
                className="w-full sm:w-auto px-6 py-3 bg-white text-slate-700 border border-slate-200 rounded-xl font-medium shadow-sm hover:bg-slate-50 transition-all"
              >
                Member Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">How It Works</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Simple 3-step process to start earning money from social media
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center card-hover">
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Package className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">1. Choose a Package</h3>
              <p className="text-sm text-slate-500">Select an earning plan that fits your goals to unlock daily viewing quotas.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center card-hover">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Play className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">2. Watch & Earn</h3>
              <p className="text-sm text-slate-500">Complete your daily quota of watching videos and interacting with social links.</p>
            </div>
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center card-hover">
              <div className="w-14 h-14 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">3. Build Network</h3>
              <p className="text-sm text-slate-500">Invite friends via our Matrix MLM system and earn commissions on their activity.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Earning Packages</h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              Choose the package that matches your earning goals
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
              <h3 className="text-lg font-medium text-slate-900 mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-slate-900">$20</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  4 Ads per day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  $0.25 per ad
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  30 Days duration
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Premium */}
            <div className="bg-slate-900 p-6 rounded-2xl shadow-xl transform md:-translate-y-2 relative">
              <div className="absolute -top-3 right-6">
                <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                  Popular
                </span>
              </div>
              <h3 className="text-lg font-medium text-slate-300 mb-2">Premium</h3>
              <div className="flex items-baseline gap-1 mb-6 text-white">
                <span className="text-3xl font-bold">$100</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-400" />
                  10 Ads per day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-400" />
                  $0.50 per ad
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-blue-400" />
                  Level 3 Matrix Unlock
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-2.5 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Elite */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm card-hover">
              <h3 className="text-lg font-medium text-slate-900 mb-2">Elite</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold text-slate-900">$500</span>
              </div>
              <ul className="space-y-3 mb-8 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  20 Ads per day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  $1.00 per ad
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-emerald-500" />
                  Unlimited Matrix
                </li>
              </ul>
              <button
                onClick={handleGetStarted}
                className="w-full py-2.5 rounded-xl border border-slate-200 text-slate-700 text-sm font-medium hover:bg-slate-50 transition-colors"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Secure Platform</h4>
              <p className="text-sm text-slate-500">Bank-level security for your funds</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Instant Payouts</h4>
              <p className="text-sm text-slate-500">Quick withdrawal processing</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">Global Access</h4>
              <p className="text-sm text-slate-500">Available worldwide 24/7</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-1">1000+ Members</h4>
              <p className="text-sm text-slate-500">Growing community</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2220%22 height=%2220%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cpath d=%22M0 0h20v20H0z%22 fill=%22none%22/%3E%3Ccircle cx=%221%22 cy=%221%22 r=%221%22 fill=%22rgba(255,255,255,0.05)%22/%3E%3C/svg%3E')] opacity-50"></div>
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Start Earning?
              </h2>
              <p className="text-slate-300 mb-8 max-w-xl mx-auto">
                Join thousands of members who are already earning daily from watching social media content.
              </p>
              <button
                onClick={handleGetStarted}
                className="px-8 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors shadow-lg"
                data-testid="cta-join-btn"
              >
                Join CLIPAY Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={LOGO_URL} alt="CLIPAY" className="h-8 w-auto" />
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CLIPAY. Secure Payments & Rewards.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
