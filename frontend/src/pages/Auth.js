import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth, useToast } from '@/lib/context';
import { Eye, EyeOff, Loader2, ArrowLeft, Sparkles, Mail, Lock, User, Link2 } from 'lucide-react';

const LOGO_URL = "https://customer-assets.emergentagent.com/job_4a166503-bc53-49ed-ab97-fc691e864fef/artifacts/2wqdbjxc_WhatsApp%20Image%202026-03-12%20at%204.43.20%20AM.jpeg";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
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
        await signup(formData.name, formData.email, formData.password, formData.referralCode);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden" data-testid="auth-page">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[100px]"></div>
        <div className="absolute inset-0 grid-bg opacity-20"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Back to Home */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>

        {/* Auth Card */}
        <div className="glass rounded-3xl p-8 animate-scaleIn">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 rounded-2xl blur-xl"></div>
              <img src={LOGO_URL} alt="CLIPAY" className="h-14 w-auto relative" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2" data-testid="auth-title">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-sm text-slate-400">
              {isLogin 
                ? 'Sign in to access your dashboard' 
                : 'Join CLIPAY and start your earning journey'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <>
                <div className="animate-slideUp">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required={!isLogin}
                      className="input-dark pl-12"
                      placeholder="John Doe"
                      data-testid="name-input"
                    />
                  </div>
                </div>
                <div className="animate-slideUp stagger-1">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Referral Code
                  </label>
                  <div className="relative">
                    <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      name="referralCode"
                      value={formData.referralCode}
                      onChange={handleChange}
                      required={!isLogin}
                      className={`input-dark pl-12 ${referralCode ? 'bg-slate-800/50' : ''}`}
                      placeholder="CLIPAY-XXXX-XXXX"
                      readOnly={!!referralCode}
                      data-testid="referral-input"
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Required to create an account
                  </p>
                </div>
              </>
            )}

            <div className="animate-slideUp stagger-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="input-dark pl-12"
                  placeholder="you@example.com"
                  data-testid="email-input"
                />
              </div>
            </div>

            <div className="animate-slideUp stagger-3">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="input-dark pl-12 pr-12"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 mt-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed animate-slideUp stagger-4"
              data-testid="auth-submit-btn"
            >
              {loading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Switch Mode */}
          <div className="mt-8 text-center text-sm text-slate-400 animate-fadeIn">
            <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold text-blue-400 hover:text-blue-300 ml-2 transition-colors"
              data-testid="auth-switch-btn"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
