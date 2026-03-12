import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, api } from '@/lib/context';
import { Play, Package, Users, ArrowRight, Star, Check, Shield, Zap, Globe, TrendingUp, Sparkles, ChevronRight, ChevronDown, Youtube, Instagram, Facebook, MessageCircle, Send } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_7a7ddfe3-1bcc-44e3-8f6f-b4e056ab769d/artifacts/y50yreb7_Gemini_Generated_Image_i21q2mi21q2mi21q-removebg-preview.png";

// FAQ Data
const faqs = [
  {
    question: "What is CLIPAY and how does it work?",
    answer: "CLIPAY is a social media rewards platform where you earn by watching and engaging with content from popular platforms like YouTube, Instagram, Facebook, and TikTok. Simply purchase a package, complete your daily tasks, and watch your earnings grow!"
  },
  {
    question: "How do I start earning with CLIPAY?",
    answer: "Getting started is easy! Sign up using a referral code, choose a package that suits your goals, and start completing daily tasks. Your earnings are credited instantly to your account balance."
  },
  {
    question: "What payment methods are supported?",
    answer: "We support multiple payment options including USDT (TRC20 & BEP20) for cryptocurrency users and JazzCash for local payments. Withdrawals are processed within 24-48 hours."
  },
  {
    question: "How does the referral commission system work?",
    answer: "Our 3-level commission system rewards you for building your network. Earn 15% from Level 1 (direct referrals), 5% from Level 2, and 2% from Level 3 referrals. The more you grow your team, the more you earn!"
  },
  {
    question: "Is there a minimum withdrawal amount?",
    answer: "Yes, the minimum withdrawal amount is $10. This ensures efficient processing of all payout requests. Withdrawals are typically processed within 24-48 hours."
  },
  {
    question: "How secure is CLIPAY?",
    answer: "Security is our top priority. We use bank-level encryption for all transactions, secure JWT authentication, and follow industry best practices to protect your account and earnings."
  }
];

// Social Media Partners
const socialPartners = [
  { name: "YouTube", icon: Youtube, color: "text-red-500", bgColor: "from-red-500/20 to-red-600/10", borderColor: "border-red-500/30" },
  { name: "Instagram", icon: Instagram, color: "text-pink-500", bgColor: "from-pink-500/20 to-purple-600/10", borderColor: "border-pink-500/30" },
  { name: "Facebook", icon: Facebook, color: "text-blue-500", bgColor: "from-blue-500/20 to-blue-600/10", borderColor: "border-blue-500/30" },
  { name: "TikTok", icon: Play, color: "text-purple-400", bgColor: "from-purple-500/20 to-pink-500/10", borderColor: "border-purple-500/30" },
  { name: "Telegram", icon: Send, color: "text-cyan-400", bgColor: "from-cyan-500/20 to-blue-500/10", borderColor: "border-cyan-500/30" },
  { name: "WhatsApp", icon: MessageCircle, color: "text-green-500", bgColor: "from-green-500/20 to-emerald-500/10", borderColor: "border-green-500/30" },
];

// FAQ Item Component
const FAQItem = ({ faq, isOpen, onClick }) => (
  <div className="glass rounded-2xl overflow-hidden card-hover">
    <button
      onClick={onClick}
      className="w-full px-6 py-5 flex items-center justify-between text-left"
    >
      <span className="font-semibold text-white pr-4">{faq.question}</span>
      <ChevronDown className={`w-5 h-5 text-cyan-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
    </button>
    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48' : 'max-h-0'}`}>
      <p className="px-6 pb-5 text-slate-400 text-sm leading-relaxed">{faq.answer}</p>
    </div>
  </div>
);

const LandingPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openFAQ, setOpenFAQ] = useState(0);

  useEffect(() => {
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
    <div className="min-h-screen relative overflow-hidden" data-testid="landing-page">
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[80px] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute inset-0 grid-bg opacity-30"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 animate-slideDown">
        <div className="glass border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-xl group-hover:bg-cyan-500/30 transition-all"></div>
                  <img src={LOGO_URL} alt="CLIPAY" className="h-14 w-auto relative" />
                </div>
              </Link>
              <div className="flex items-center gap-4">
                {user ? (
                  <Link
                    to={user.role === 'admin' ? '/admin' : '/dashboard'}
                    className="btn-primary flex items-center gap-2"
                    data-testid="go-to-dashboard-btn"
                  >
                    Dashboard
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/auth"
                      className="px-5 py-2.5 text-slate-300 text-sm font-medium hover:text-white transition-colors"
                      data-testid="login-btn"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth"
                      className="btn-primary text-sm"
                      data-testid="signup-btn"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-8 animate-slideUp">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span className="text-sm font-medium text-slate-300">
                Revolutionizing Social Media Rewards
              </span>
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-8 leading-tight tracking-tight animate-slideUp stagger-1">
              <span className="text-white">Turn Your </span>
              <span className="gradient-text">Screen Time</span>
              <br />
              <span className="text-white">Into </span>
              <span className="gradient-text-orange">Real Rewards</span>
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slideUp stagger-2">
              Watch videos from top social platforms, build your network, and earn unlimited commissions through our powerful MLM matrix system.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slideUp stagger-3">
              <button
                onClick={handleGetStarted}
                className="btn-primary w-full sm:w-auto text-lg px-8 py-4 flex items-center justify-center gap-3 group"
                data-testid="hero-cta-btn"
              >
                Start Earning Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <Link
                to="/auth"
                className="btn-secondary w-full sm:w-auto text-lg px-8 py-4"
              >
                View Packages
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto animate-slideUp stagger-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">$2M+</div>
                <div className="text-sm text-slate-500">Total Payouts</div>
              </div>
              <div className="text-center border-x border-white/10">
                <div className="text-3xl font-bold text-white mb-1">15K+</div>
                <div className="text-sm text-slate-500">Active Members</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-sm text-slate-500">Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media Partners Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/10 to-transparent"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full glass-light text-sm font-medium text-cyan-400 mb-4">
              OUR PARTNERS
            </span>
            <h2 className="text-3xl font-bold text-white mb-4">
              Powered by <span className="gradient-text">Leading Platforms</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Earn rewards by engaging with content from the world's most popular social media platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {socialPartners.map((partner, index) => (
              <div 
                key={partner.name}
                className={`glass rounded-2xl p-6 card-hover text-center animate-slideUp`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${partner.bgColor} border ${partner.borderColor} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <partner.icon className={`w-8 h-8 ${partner.color}`} />
                </div>
                <h3 className="font-semibold text-white text-sm">{partner.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full glass-light text-sm font-medium text-cyan-400 mb-4">
              HOW IT WORKS
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Three Simple Steps to <span className="gradient-text">Success</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Start earning in minutes with our streamlined process
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass rounded-3xl p-8 card-hover group animate-slideUp stagger-1">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Package className="w-8 h-8 text-cyan-400" />
              </div>
              <div className="text-sm font-semibold text-cyan-400 mb-2">STEP 01</div>
              <h3 className="text-xl font-bold text-white mb-3">Choose Your Package</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Select a rewards package that matches your goals. Higher packages unlock more daily tasks and bigger rewards.
              </p>
            </div>

            {/* Step 2 */}
            <div className="glass rounded-3xl p-8 card-hover group animate-slideUp stagger-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Play className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-sm font-semibold text-purple-400 mb-2">STEP 02</div>
              <h3 className="text-xl font-bold text-white mb-3">Watch & Earn Daily</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Complete your daily quota by watching and engaging with social media content. Rewards are credited instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="glass rounded-3xl p-8 card-hover group animate-slideUp stagger-3">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users className="w-8 h-8 text-orange-400" />
              </div>
              <div className="text-sm font-semibold text-orange-400 mb-2">STEP 03</div>
              <h3 className="text-xl font-bold text-white mb-3">Build Your Network</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Invite friends using your unique referral link and earn up to 22% commission on their activities across 3 levels.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Packages Preview */}
      <section className="py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-950/10 to-transparent"></div>
        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full glass-light text-sm font-medium text-orange-400 mb-4">
              PRICING PLANS
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Rewards <span className="gradient-text-orange">Packages</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Choose the plan that fits your earning potential
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="glass rounded-3xl p-8 card-hover animate-slideUp stagger-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center">
                  <Star className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-slate-400 font-medium">Starter</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$20</span>
                <span className="text-slate-500">/one-time</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  4 Daily ad views
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  $0.25 per view
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  30 days duration
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  Level 1 Matrix access
                </li>
              </ul>
              <button onClick={handleGetStarted} className="w-full py-3 rounded-xl font-semibold transition-all duration-300 bg-slate-700/50 text-white border border-slate-600 hover:bg-slate-700 hover:border-slate-500">
                Get Started
              </button>
            </div>

            {/* Premium - Featured */}
            <div className="relative animate-slideUp stagger-2">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-orange-500 rounded-3xl blur opacity-30"></div>
              <div className="relative glass rounded-3xl p-8 border border-cyan-500/30">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-cyan-500 to-orange-500 text-white shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-4 mt-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-cyan-400 font-medium">Premium</span>
                </div>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold text-white">$100</span>
                  <span className="text-slate-500">/one-time</span>
                </div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3 text-slate-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-cyan-400" />
                    </div>
                    10 Daily ad views
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-cyan-400" />
                    </div>
                    $0.50 per view
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-cyan-400" />
                    </div>
                    30 days duration
                  </li>
                  <li className="flex items-center gap-3 text-slate-300 text-sm">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-cyan-400" />
                    </div>
                    Level 3 Matrix access
                  </li>
                </ul>
                <button onClick={handleGetStarted} className="btn-primary w-full">
                  Get Premium
                </button>
              </div>
            </div>

            {/* Elite */}
            <div className="glass rounded-3xl p-8 card-hover animate-slideUp stagger-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-orange-400" />
                </div>
                <span className="text-orange-400 font-medium">Elite</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">$500</span>
                <span className="text-slate-500">/one-time</span>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  20 Daily ad views
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  $1.00 per view
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  30 days duration
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-orange-400" />
                  </div>
                  Unlimited Matrix access
                </li>
              </ul>
              <button onClick={handleGetStarted} className="btn-accent w-full">
                Go Elite
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 relative" data-testid="faq-section">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full glass-light text-sm font-medium text-purple-400 mb-4">
              FAQs
            </span>
            <h2 className="text-4xl font-bold text-white mb-4">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto">
              Everything you need to know about CLIPAY
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                faq={faq}
                isOpen={openFAQ === index}
                onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-3xl p-12">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div className="animate-slideUp stagger-1">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-emerald-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">100% Secure</h4>
                <p className="text-sm text-slate-400">Bank-level encryption for all transactions</p>
              </div>
              <div className="animate-slideUp stagger-2">
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-cyan-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Instant Payouts</h4>
                <p className="text-sm text-slate-400">24-48 hours withdrawal processing</p>
              </div>
              <div className="animate-slideUp stagger-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-7 h-7 text-orange-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">Global Platform</h4>
                <p className="text-sm text-slate-400">Available in 100+ countries worldwide</p>
              </div>
              <div className="animate-slideUp stagger-4">
                <div className="w-14 h-14 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-7 h-7 text-purple-400" />
                </div>
                <h4 className="font-semibold text-white mb-2">15K+ Members</h4>
                <p className="text-sm text-slate-400">Join our growing community today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 via-teal-600 to-orange-500 opacity-90"></div>
            <div className="absolute inset-0 grid-bg opacity-20"></div>
            <div className="relative p-12 md:p-16 text-center">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Start Your <br />Earning Journey?
              </h2>
              <p className="text-white/80 mb-10 text-lg max-w-xl mx-auto">
                Join thousands of members already earning daily with CLIPAY. Start your journey today!
              </p>
              <button
                onClick={handleGetStarted}
                className="px-10 py-4 bg-white text-slate-900 rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/20 hover:-translate-y-1 transition-all duration-300"
                data-testid="cta-join-btn"
              >
                Join CLIPAY Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="CLIPAY" className="h-10 w-auto" />
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} CLIPAY. Secure Payments & Rewards. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-sm text-slate-500 hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
