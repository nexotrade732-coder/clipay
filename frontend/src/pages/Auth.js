import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, useToast } from '@/lib/context';
import { Eye, EyeOff, Loader2, ArrowLeft, Sparkles, Mail, Lock, User, Link2, Zap, Shield, TrendingUp, Phone, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_7a7ddfe3-1bcc-44e3-8f6f-b4e056ab769d/artifacts/y50yreb7_Gemini_Generated_Image_i21q2mi21q2mi21q-removebg-preview.png";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referralCode: ''
  });
  
  const { referralCode } = useParams();
  const { login, signup } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (referralCode) {
      setFormData(prev => ({ ...prev, referralCode }));
      setIsLogin(false);
    }
  }, [referralCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const user = await login(formData.email, formData.password);
        toast.success('Welcome back!');
        navigate(user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        if (!formData.referralCode) {
          toast.error('Referral code is required to sign up');
          setLoading(false);
          return;
        }
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match');
          setLoading(false);
          return;
        }
        if (!formData.mobile || formData.mobile.length < 10) {
          toast.error('Please enter a valid mobile number');
          setLoading(false);
          return;
        }
        await signup(formData.name, formData.email, formData.password, formData.referralCode, formData.mobile);
        toast.success('Account created successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const passwordsMatch = formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen flex" data-testid="auth-page">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-teal-500/5 rounded-full blur-[80px] animate-pulse" style={{animationDelay: '2s'}}></div>
          <div className="absolute inset-0 grid-bg opacity-20"></div>
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Back to Home */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>

          {/* Auth Card */}
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", duration: 0.8 }}
            className="relative"
          >
            {/* Glowing border effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-orange-500 rounded-[28px] opacity-20 blur-lg animate-gradient"></div>
            
            <div className="glass rounded-3xl p-8 relative">
              {/* Logo */}
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="flex justify-center mb-6"
              >
                <div className="relative logo-container">
                  <img src={LOGO_URL} alt="CLIPAY" className="h-16 w-auto relative" />
                </div>
              </motion.div>

              {/* Header */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mb-6"
              >
                <h2 className="text-2xl font-bold text-white mb-2" data-testid="auth-title">
                  {isLogin ? (
                    <span className="gradient-text-teal">Welcome Back</span>
                  ) : (
                    <span className="gradient-text-orange">Join CLIPAY</span>
                  )}
                </h2>
                <p className="text-sm text-slate-400">
                  {isLogin 
                    ? 'Sign in to access your dashboard' 
                    : 'Start your earning journey today'}
                </p>
              </motion.div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence mode="wait">
                  {!isLogin && (
                    <motion.div
                      key="signup-fields"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      {/* Full Name */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Full Name
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity"></div>
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required={!isLogin}
                            className="input-dark pl-12 relative"
                            placeholder="John Doe"
                            data-testid="name-input"
                          />
                        </div>
                      </motion.div>

                      {/* Mobile Number */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.15 }}
                      >
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Mobile Number
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity"></div>
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                          <input
                            type="tel"
                            name="mobile"
                            value={formData.mobile}
                            onChange={handleChange}
                            required={!isLogin}
                            className="input-dark pl-12 relative"
                            placeholder="+92 300 1234567"
                            data-testid="mobile-input"
                          />
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: isLogin ? 0.1 : 0.2 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-teal-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity"></div>
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-dark pl-12 relative"
                      placeholder="you@example.com"
                      data-testid="email-input"
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: isLogin ? 0.2 : 0.25 }}
                >
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-amber-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity"></div>
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-orange-400 transition-colors" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      minLength={6}
                      className="input-dark pl-12 pr-12 relative"
                      placeholder="••••••••"
                      data-testid="password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {/* Confirm Password & Referral Code - Only for Signup */}
                <AnimatePresence>
                  {!isLogin && (
                    <>
                      {/* Confirm Password */}
                      <motion.div
                        initial={{ opacity: 0, x: -20, height: 0 }}
                        animate={{ opacity: 1, x: 0, height: "auto" }}
                        exit={{ opacity: 0, x: -20, height: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative group">
                          <div className={`absolute inset-0 bg-gradient-to-r ${passwordsMatch ? 'from-emerald-500/20 to-teal-500/20' : 'from-orange-500/20 to-amber-500/20'} rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity`}></div>
                          <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${passwordsMatch ? 'text-emerald-400' : 'text-slate-500 group-focus-within:text-orange-400'}`} />
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required={!isLogin}
                            minLength={6}
                            className={`input-dark pl-12 pr-12 relative ${passwordsMatch ? 'border-emerald-500/50' : ''}`}
                            placeholder="••••••••"
                            data-testid="confirm-password-input"
                          />
                          {passwordsMatch && (
                            <CheckCircle className="absolute right-12 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-400" />
                          )}
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                        {formData.confirmPassword && !passwordsMatch && (
                          <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
                        )}
                      </motion.div>

                      {/* Referral Code - Now at the end */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.35 }}
                      >
                        <label className="block text-sm font-medium text-slate-300 mb-2">
                          Referral Code
                        </label>
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-100 blur transition-opacity"></div>
                          <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                          <input
                            type="text"
                            name="referralCode"
                            value={formData.referralCode}
                            onChange={handleChange}
                            required={!isLogin}
                            className={`input-dark pl-12 relative ${referralCode ? 'bg-slate-800/50' : ''}`}
                            placeholder="CLIPAY-XXXX-XXXX"
                            readOnly={!!referralCode}
                            data-testid="referral-input"
                          />
                        </div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          Required to create an account
                        </p>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: isLogin ? 0.3 : 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading || (!isLogin && !passwordsMatch)}
                  className="w-full py-4 mt-6 rounded-xl font-semibold text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group"
                  style={{
                    background: isLogin 
                      ? 'linear-gradient(135deg, #0891b2 0%, #0e7490 100%)'
                      : 'linear-gradient(135deg, #f97316 0%, #fbbf24 100%)',
                    boxShadow: isLogin 
                      ? '0 4px 20px rgba(8, 145, 178, 0.4)'
                      : '0 4px 20px rgba(249, 115, 22, 0.4)'
                  }}
                  data-testid="auth-submit-btn"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                  <span className="relative">{isLogin ? 'Sign In' : 'Create Account'}</span>
                </motion.button>
              </form>

              {/* Switch Mode */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-center text-sm text-slate-400"
              >
                <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                <button
                  onClick={() => setIsLogin(!isLogin)}
                  className="font-semibold text-cyan-400 hover:text-cyan-300 ml-2 transition-colors"
                  data-testid="auth-switch-btn"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Features (Desktop only) */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/30 via-teal-600/20 to-orange-600/30 animate-gradient"></div>
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-cyan-500/30 rounded-full blur-2xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/30 rounded-full blur-2xl animate-float" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-teal-500/30 rounded-full blur-2xl animate-float" style={{animationDelay: '2s'}}></div>
        
        <div className="relative z-10 max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Start Your <span className="gradient-text">Earning</span> Journey
            </h2>
            <p className="text-lg text-slate-300 mb-10">
              Join thousands of members earning daily through our innovative social media rewards platform.
            </p>
          </motion.div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="glass rounded-2xl p-5 flex items-center gap-4 card-hover"
            >
              <div className="w-14 h-14 rounded-xl icon-box-teal flex items-center justify-center flex-shrink-0">
                <Zap className="w-7 h-7 text-cyan-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Instant Rewards</h3>
                <p className="text-sm text-slate-400">Get paid instantly for watching videos</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass rounded-2xl p-5 flex items-center gap-4 card-hover"
            >
              <div className="w-14 h-14 rounded-xl icon-box-orange flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-7 h-7 text-orange-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">22% Commission</h3>
                <p className="text-sm text-slate-400">Earn from your team across 3 levels</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="glass rounded-2xl p-5 flex items-center gap-4 card-hover"
            >
              <div className="w-14 h-14 rounded-xl icon-box-emerald flex items-center justify-center flex-shrink-0">
                <Shield className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Secure & Trusted</h3>
                <p className="text-sm text-slate-400">Bank-level security for all transactions</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
