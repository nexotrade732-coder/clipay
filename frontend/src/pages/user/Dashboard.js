import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, api, useToast } from '@/lib/context';
import { Wallet, DollarSign, Users, ArrowUpRight, ArrowDownLeft, Play, Package, TrendingUp, Copy, Sparkles, Target, Zap, AlertTriangle, Gift, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UserDashboard = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [progress, setProgress] = useState({ watched_today: 0, daily_quota: 0, earnings_today: 0 });
  const [freePackage, setFreePackage] = useState(null);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      await refreshUser();
      if (user?.active_package) {
        const res = await api.get('/watch/progress');
        setProgress(res.data);
      }
      // Fetch free package settings if user is on free package
      if (user?.is_free_package) {
        const freeRes = await api.get('/free-package/settings');
        setFreePackage(freeRes.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Check if user reached the free package target
  useEffect(() => {
    if (user?.is_free_package && freePackage && user?.balance >= freePackage.withdrawal_target) {
      setShowTargetModal(true);
    }
  }, [user, freePackage]);

  const progressPercent = progress.daily_quota > 0 
    ? (progress.watched_today / progress.daily_quota) * 100 
    : 0;

  const freeTargetPercent = freePackage && freePackage.withdrawal_target > 0
    ? Math.min((user?.balance || 0) / freePackage.withdrawal_target * 100, 100)
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6" data-testid="user-dashboard">
      {/* Welcome Banner */}
      <div className="glass rounded-3xl p-6 relative overflow-hidden animate-slideUp">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass-light text-xs font-medium text-blue-400 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Welcome back!
          </span>
          <h2 className="text-2xl font-bold text-white mb-1">Hello, {user?.name?.split(' ')[0]} 👋</h2>
          <p className="text-slate-400 text-sm">Ready to earn? Let's check your progress today.</p>
        </div>
      </div>

      {/* Free Package Target Banner - Only show for free package users */}
      {user?.is_free_package && freePackage && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`rounded-3xl p-6 relative overflow-hidden ${
            freeTargetPercent >= 100 
              ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40' 
              : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30'
          }`}
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              freeTargetPercent >= 100 
                ? 'bg-gradient-to-br from-amber-500 to-orange-500' 
                : 'bg-gradient-to-br from-cyan-500 to-blue-500'
            }`}>
              {freeTargetPercent >= 100 ? <Gift className="w-8 h-8 text-white" /> : <Target className="w-8 h-8 text-white" />}
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-semibold">
                  {freePackage.name}
                </span>
                {freeTargetPercent >= 100 && (
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold animate-pulse">
                    Target Reached!
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {freeTargetPercent >= 100 
                  ? "Congratulations! You've reached your target!" 
                  : "Earn to Unlock Withdrawals"}
              </h3>
              <p className="text-sm text-slate-400 mb-4">
                {freeTargetPercent >= 100 
                  ? "Activate a paid package to withdraw your earnings and unlock unlimited earning potential." 
                  : freePackage.description}
              </p>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress to Withdrawal</span>
                  <span className={freeTargetPercent >= 100 ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>
                    ${user?.balance?.toFixed(2)} / ${freePackage.withdrawal_target?.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${freeTargetPercent}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${
                      freeTargetPercent >= 100 
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500' 
                        : 'bg-gradient-to-r from-cyan-500 to-blue-500'
                    }`}
                    style={{ boxShadow: freeTargetPercent >= 100 ? '0 0 10px rgba(245, 158, 11, 0.5)' : '0 0 10px rgba(8, 145, 178, 0.5)' }}
                  />
                </div>
              </div>

              {freeTargetPercent >= 100 ? (
                <Link to="/packages" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-all shadow-lg shadow-amber-500/30">
                  <Package className="w-5 h-5" />
                  Activate Paid Package Now
                </Link>
              ) : (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-400">
                    <Play className="w-4 h-4" />
                    <span>{freePackage.daily_ads} videos/day</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400">
                    <DollarSign className="w-4 h-4" />
                    <span>${freePackage.earning_per_ad?.toFixed(2)}/video</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance */}
        <div className="glass rounded-2xl p-5 card-hover group animate-slideUp stagger-1">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 text-blue-400" />
            </div>
            <span className="badge-success">Active</span>
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Balance</p>
          <h3 className="text-2xl font-bold text-white" data-testid="balance-value">
            ${user?.balance?.toFixed(2) || '0.00'}
          </h3>
          <div className="mt-3 flex items-center gap-1 text-xs text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            +${progress.earnings_today?.toFixed(2) || '0.00'} today
          </div>
        </div>

        {/* Total Earnings */}
        <div className="glass rounded-2xl p-5 card-hover group animate-slideUp stagger-2">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Earnings</p>
          <h3 className="text-2xl font-bold text-white" data-testid="earnings-value">
            ${user?.total_earnings?.toFixed(2) || '0.00'}
          </h3>
          <p className="mt-3 text-xs text-slate-500">Lifetime total</p>
        </div>

        {/* Total Withdrawn */}
        <div className="glass rounded-2xl p-5 card-hover group animate-slideUp stagger-3">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Withdrawn</p>
          <h3 className="text-2xl font-bold text-white" data-testid="withdrawn-value">
            ${user?.total_withdrawn?.toFixed(2) || '0.00'}
          </h3>
          <p className="mt-3 text-xs text-slate-500">Processed payouts</p>
        </div>

        {/* Rank */}
        <div className="glass rounded-2xl p-5 card-hover group animate-slideUp stagger-4">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-orange-400" />
            </div>
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Rank</p>
          <h3 className="text-2xl font-bold text-white" data-testid="rank-value">
            {user?.rank || 'None'}
          </h3>
          <Link to="/ranks" className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors">
            View progress →
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Activity */}
        <div className="lg:col-span-2 glass rounded-3xl p-6 animate-slideUp stagger-5">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Today's Activity</h3>
              <p className="text-xs text-slate-400 mt-1">Track your daily progress</p>
            </div>
            <Link to="/watch" className="btn-primary text-sm px-4 py-2 flex items-center gap-2">
              Watch Links <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {user?.active_package ? (
            <div className="glass-light rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6">
              {/* Progress Circle */}
              <div className="relative w-32 h-32 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-700"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-blue-500 progress-circle"
                    strokeDasharray={`${progressPercent}, 100`}
                    strokeWidth="3"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.5))' }}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    {progress.watched_today}
                  </span>
                  <span className="text-xs text-slate-400">of {progress.daily_quota}</span>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold mb-3">
                  <Zap className="w-3.5 h-3.5" />
                  {user.active_package} Package
                </span>
                <h4 className="text-lg font-semibold text-white mb-2">
                  {progress.watched_today >= progress.daily_quota ? "Daily quota completed! 🎉" : "Keep going!"}
                </h4>
                <p className="text-sm text-slate-400 mb-4">
                  {progress.watched_today >= progress.daily_quota 
                    ? "Great job! Come back tomorrow for more earnings." 
                    : `Watch ${progress.daily_quota - progress.watched_today} more videos to complete today's quota.`}
                </p>
                <div className="flex items-center gap-4">
                  <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <span className="text-emerald-400 font-bold">${progress.earnings_today?.toFixed(2)}</span>
                    <span className="text-xs text-slate-400 ml-1">earned today</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-light rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-blue-400" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">No Active Package</h4>
              <p className="text-sm text-slate-400 mb-6">Purchase a package to start earning from watching videos.</p>
              <Link to="/packages" className="btn-primary inline-flex items-center gap-2" data-testid="get-package-btn">
                Get a Package
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="glass rounded-3xl p-6 animate-slideUp stagger-5">
          <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/deposit"
              className="glass-light rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all group"
              data-testid="quick-deposit-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-slate-300">Deposit</span>
            </Link>
            <Link
              to="/withdraw"
              className="glass-light rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all group"
              data-testid="quick-withdraw-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ArrowUpRight className="w-5 h-5 text-purple-400" />
              </div>
              <span className="text-sm font-medium text-slate-300">Withdraw</span>
            </Link>
            <Link
              to="/referrals"
              className="glass-light rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all group"
              data-testid="quick-team-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-sm font-medium text-slate-300">Team</span>
            </Link>
            <Link
              to="/packages"
              className="glass-light rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-white/10 transition-all group"
              data-testid="quick-upgrade-btn"
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 text-orange-400" />
              </div>
              <span className="text-sm font-medium text-slate-300">Upgrade</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="relative rounded-3xl overflow-hidden animate-slideUp">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-90"></div>
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="relative p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Share & Earn Commission</h3>
              <p className="text-blue-100 text-sm max-w-lg">
                Invite friends using your referral code and earn up to 22% commission across 3 levels.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={user?.referral_code || ''}
                readOnly
                className="bg-white/10 border border-white/20 text-white text-sm rounded-xl px-4 py-3 outline-none font-mono min-w-[200px]"
                data-testid="referral-code-input"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(user?.referral_code || '');
                  toast.success('Referral code copied!');
                }}
                className="bg-white text-slate-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
                data-testid="copy-referral-btn"
              >
                <Copy className="w-4 h-4" />
                Copy Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Target Reached Modal */}
      <AnimatePresence>
        {showTargetModal && user?.is_free_package && freePackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass rounded-3xl p-8 w-full max-w-lg text-center relative overflow-hidden"
            >
              {/* Celebration Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10"></div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-500/30">
                  <Gift className="w-12 h-12 text-white" />
                </div>

                {/* Content */}
                <h2 className="text-2xl font-bold text-white mb-3">
                  Congratulations! 🎉
                </h2>
                <p className="text-lg text-amber-400 font-semibold mb-4">
                  You've reached ${freePackage.withdrawal_target?.toFixed(2)}!
                </p>
                <p className="text-slate-400 mb-6">
                  Your current balance is <span className="text-white font-bold">${user?.balance?.toFixed(2)}</span>. 
                  To withdraw your earnings and unlock unlimited earning potential, please activate a paid package.
                </p>

                {/* Warning */}
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 mb-6">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-400 text-left">
                      Withdrawals are locked until you activate a paid package. Your earned balance will remain safe.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setShowTargetModal(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-700/50 text-slate-300 font-medium hover:bg-slate-700 transition-colors"
                  >
                    Maybe Later
                  </button>
                  <Link
                    to="/packages"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/30"
                  >
                    <Package className="w-5 h-5" />
                    View Packages
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserDashboard;
