import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Users, ArrowDownLeft, ArrowUpRight, Package, DollarSign, Loader2, RefreshCw } from 'lucide-react';

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
      <div className="bg-slate-900 rounded-2xl p-6 text-white flex justify-between items-center shadow-xl">
        <div>
          <h2 className="text-2xl font-bold">Admin Control Panel</h2>
          <p className="text-slate-400 text-sm mt-1">Platform overview and management.</p>
        </div>
        <button
          onClick={fetchStats}
          className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
          data-testid="refresh-stats-btn"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-500">Total Users</p>
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900" data-testid="total-users">
            {stats?.total_users?.toLocaleString() || 0}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-500">Pending Withdrawals</p>
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-amber-600" data-testid="pending-withdrawals">
            {stats?.pending_withdrawals || 0}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-500">Active Packages</p>
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-slate-900" data-testid="active-packages">
            {stats?.active_packages || 0}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm card-hover">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-slate-500">Total Paid Out</p>
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-emerald-600" data-testid="total-paid">
            ${stats?.total_paid_out?.toLocaleString() || 0}
          </h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Pending Actions</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-xl border border-amber-100">
            <div className="flex items-center gap-3">
              <ArrowDownLeft className="w-5 h-5 text-amber-600" />
              <div>
                <p className="font-medium text-slate-900">Pending Deposits</p>
                <p className="text-sm text-slate-500">{stats?.pending_deposits || 0} awaiting approval</p>
              </div>
            </div>
            <a 
              href="/admin/deposits" 
              className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors"
            >
              Review
            </a>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center gap-3">
              <ArrowUpRight className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-slate-900">Pending Withdrawals</p>
                <p className="text-sm text-slate-500">{stats?.pending_withdrawals || 0} awaiting approval</p>
              </div>
            </div>
            <a 
              href="/admin/withdrawals" 
              className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
            >
              Review
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
