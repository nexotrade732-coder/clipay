import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api, useToast } from '@/lib/context';
import { Users, ArrowDownLeft, ArrowUpRight, Package, DollarSign, Loader2, RefreshCw, TrendingUp, Activity, AlertCircle, CheckCircle } from 'lucide-react';

const AdminDashboard = () => {
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data);
    } catch (e) {
      toast.error('Failed to load dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6" data-testid="admin-dashboard">
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden animate-slideUp">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800"></div>
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-medium text-emerald-400">System Online</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Admin Control Center</h2>
            <p className="text-slate-400 text-sm mt-1">Monitor and manage your platform</p>
          </div>
          <button
            onClick={fetchStats}
            className="btn-secondary flex items-center gap-2 text-sm"
            data-testid="refresh-stats-btn"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 card-hover group animate-slideUp stagger-1">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total Users</p>
          <h3 className="text-2xl font-bold text-white" data-testid="total-users">
            {stats?.total_users?.toLocaleString() || 0}
          </h3>
          <p className="mt-2 text-xs text-slate-500">Registered members</p>
        </div>

        <div className="glass rounded-2xl p-5 card-hover group animate-slideUp stagger-2">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/20 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-6 h-6 text-amber-400" />
            </div>
            {stats?.pending_withdrawals > 0 && (
              <span className="badge-warning">{stats.pending_withdrawals}</span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Pending Payouts</p>
          <h3 className="text-2xl font-bold text-amber-400" data-testid="pending-withdrawals">
            {stats?.pending_withdrawals || 0}
          </h3>
          <Link to="/admin/withdrawals" className="mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors">
            Review now →
          </Link>
        </div>

        <div className="glass rounded-2xl p-5 card-hover group animate-slideUp stagger-3">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Active Packages</p>
          <h3 className="text-2xl font-bold text-white" data-testid="active-packages">
            {stats?.active_packages || 0}
          </h3>
          <p className="mt-2 text-xs text-slate-500">Users with packages</p>
        </div>

        <div className="glass rounded-2xl p-5 card-hover group animate-slideUp stagger-4">
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">Total Paid</p>
          <h3 className="text-2xl font-bold text-emerald-400" data-testid="total-paid">
            ${stats?.total_paid_out?.toLocaleString() || 0}
          </h3>
          <p className="mt-2 text-xs text-slate-500">Processed withdrawals</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass rounded-3xl p-6 animate-slideUp">
        <h3 className="text-lg font-semibold text-white mb-6">Action Required</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="glass-light rounded-2xl p-5 flex items-center justify-between group hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <ArrowDownLeft className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <p className="font-medium text-white">Pending Deposits</p>
                <p className="text-sm text-slate-400">{stats?.pending_deposits || 0} awaiting approval</p>
              </div>
            </div>
            <Link 
              to="/admin/deposits" 
              className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-400 text-sm font-medium border border-amber-500/30 hover:bg-amber-500/30 transition-colors"
            >
              Review
            </Link>
          </div>
          
          <div className="glass-light rounded-2xl p-5 flex items-center justify-between group hover:bg-white/10 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <p className="font-medium text-white">Pending Withdrawals</p>
                <p className="text-sm text-slate-400">{stats?.pending_withdrawals || 0} awaiting approval</p>
              </div>
            </div>
            <Link 
              to="/admin/withdrawals" 
              className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-sm font-medium border border-red-500/30 hover:bg-red-500/30 transition-colors"
            >
              Review
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-slideUp">
        <Link to="/admin/users" className="glass rounded-2xl p-5 text-center card-hover group">
          <Users className="w-8 h-8 text-blue-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-white">Manage Users</p>
        </Link>
        <Link to="/admin/packages" className="glass rounded-2xl p-5 text-center card-hover group">
          <Package className="w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-white">Packages</p>
        </Link>
        <Link to="/admin/links" className="glass rounded-2xl p-5 text-center card-hover group">
          <Activity className="w-8 h-8 text-orange-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-white">Watch Links</p>
        </Link>
        <Link to="/admin/settings" className="glass rounded-2xl p-5 text-center card-hover group">
          <DollarSign className="w-8 h-8 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
          <p className="text-sm font-medium text-white">Settings</p>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
