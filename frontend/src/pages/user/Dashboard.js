import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, api, useToast } from '@/lib/context';
import { Wallet, DollarSign, Users, ArrowUpRight, ArrowDownLeft, Play, Package, TrendingUp, RefreshCw } from 'lucide-react';

const UserDashboard = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [progress, setProgress] = useState({ watched_today: 0, daily_quota: 0, earnings_today: 0 });
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      await refreshUser();
      if (user?.active_package) {
        const res = await api.get('/watch/progress');
        setProgress(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const progressPercent = progress.daily_quota > 0 
    ? (progress.watched_today / progress.daily_quota) * 100 
    : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-6" data-testid="user-dashboard">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Balance */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full blur-2xl group-hover:bg-blue-100 transition-colors"></div>
          <div className="flex justify-between items-start relative">
            <div>
              <p className="text-sm font-medium text-slate-500">Current Balance</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1" data-testid="balance-value">
                ${user?.balance?.toFixed(2) || '0.00'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs font-medium text-emerald-600">
            <TrendingUp className="w-3.5 h-3.5 mr-1" />
            +${progress.earnings_today?.toFixed(2) || '0.00'} today
          </div>
        </div>

        {/* Total Earnings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Earnings</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1" data-testid="earnings-value">
                ${user?.total_earnings?.toFixed(2) || '0.00'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">Lifetime platform earnings</div>
        </div>

        {/* Total Withdrawn */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Withdrawn</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1" data-testid="withdrawn-value">
                ${user?.total_withdrawn?.toFixed(2) || '0.00'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-xs text-slate-500">Successfully processed</div>
        </div>

        {/* Network Team */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm card-hover">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-slate-500">Current Rank</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1" data-testid="rank-value">
                {user?.rank || 'None'}
              </h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <Link to="/ranks" className="mt-4 text-xs text-blue-500 hover:text-blue-600 font-medium">
            View progress →
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Today's Activity</h3>
            <Link to="/watch" className="text-sm font-medium text-blue-500 hover:text-blue-600 flex items-center gap-1">
              Watch Links <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          {user?.active_package ? (
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 flex flex-col sm:flex-row items-center gap-6">
              {/* Progress Circle */}
              <div className="relative w-24 h-24 flex-shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
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
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-slate-900">
                    {progress.watched_today}<span className="text-sm text-slate-400">/{progress.daily_quota}</span>
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-200/50 mb-2">
                  <Package className="w-3.5 h-3.5" />
                  {user.active_package} Package
                </div>
                <h4 className="text-base font-medium text-slate-900 mb-1">
                  {progress.watched_today >= progress.daily_quota ? "Daily quota completed!" : "You're making progress!"}
                </h4>
                <p className="text-sm text-slate-500 mb-4">
                  {progress.watched_today >= progress.daily_quota 
                    ? "Come back tomorrow for more earnings." 
                    : `Watch ${progress.daily_quota - progress.watched_today} more videos to complete your quota.`}
                </p>
                <Link
                  to="/watch"
                  className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm"
                  data-testid="continue-watching-btn"
                >
                  {progress.watched_today >= progress.daily_quota ? 'View History' : 'Continue Watching'}
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 text-center">
              <Package className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-slate-900 mb-2">No Active Package</h4>
              <p className="text-sm text-slate-500 mb-4">Purchase a package to start earning from watching videos.</p>
              <Link
                to="/packages"
                className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-600 transition-colors"
                data-testid="get-package-btn"
              >
                Get a Package
              </Link>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <Link
              to="/deposit"
              className="flex flex-col items-center justify-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-4 hover:bg-slate-100 hover:border-slate-200 transition-all text-slate-600 hover:text-slate-900"
              data-testid="quick-deposit-btn"
            >
              <ArrowDownLeft className="w-6 h-6" />
              <span className="text-sm font-medium">Deposit</span>
            </Link>
            <Link
              to="/withdraw"
              className="flex flex-col items-center justify-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-4 hover:bg-slate-100 hover:border-slate-200 transition-all text-slate-600 hover:text-slate-900"
              data-testid="quick-withdraw-btn"
            >
              <ArrowUpRight className="w-6 h-6" />
              <span className="text-sm font-medium">Withdraw</span>
            </Link>
            <Link
              to="/referrals"
              className="flex flex-col items-center justify-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-4 hover:bg-slate-100 hover:border-slate-200 transition-all text-slate-600 hover:text-slate-900"
              data-testid="quick-team-btn"
            >
              <Users className="w-6 h-6" />
              <span className="text-sm font-medium">Team</span>
            </Link>
            <Link
              to="/packages"
              className="flex flex-col items-center justify-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-4 hover:bg-slate-100 hover:border-slate-200 transition-all text-slate-600 hover:text-slate-900"
              data-testid="quick-upgrade-btn"
            >
              <Package className="w-6 h-6" />
              <span className="text-sm font-medium">Upgrade</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h3 className="text-lg font-semibold mb-2">Your Referral Code</h3>
          <p className="text-slate-300 text-sm mb-4">Share this code to invite new members and earn commissions.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <input
              type="text"
              value={user?.referral_code || ''}
              readOnly
              className="flex-1 bg-white/10 border border-white/20 text-white text-sm rounded-xl px-4 py-2.5 outline-none"
              data-testid="referral-code-input"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(user?.referral_code || '');
                toast.success('Referral code copied!');
              }}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
              data-testid="copy-referral-btn"
            >
              Copy Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
