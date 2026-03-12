import React, { useState, useEffect } from 'react';
import { useAuth, api, useToast } from '@/lib/context';
import { Copy, Users, Link2, Loader2, TrendingUp } from 'lucide-react';

const UserReferrals = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [stats, setStats] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, listRes] = await Promise.all([
        api.get('/referrals/stats'),
        api.get('/referrals/list')
      ]);
      setStats(statsRes.data);
      setReferrals(listRes.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/signup/${user?.referral_code}`;
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied!');
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user?.referral_code || '');
    toast.success('Referral code copied!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6" data-testid="referrals-page">
      {/* Referral Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10">
          <h3 className="text-xl font-semibold mb-2">Grow Your Network</h3>
          <p className="text-slate-300 text-sm mb-6 max-w-md">
            Earn commissions on your direct referrals' earnings, plus level commissions down your matrix.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={`${window.location.origin}/signup/${user?.referral_code || ''}`}
                readOnly
                className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-xl pl-10 pr-4 py-2.5 outline-none"
                data-testid="referral-link-input"
              />
            </div>
            <button
              onClick={copyReferralLink}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
              data-testid="copy-link-btn"
            >
              <Copy className="w-4 h-4" /> Copy Link
            </button>
          </div>
          
          <div className="mt-4 flex items-center gap-4">
            <p className="text-sm text-slate-400">
              Your Code: <span className="text-white font-mono">{user?.referral_code}</span>
            </p>
            <button
              onClick={copyReferralCode}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium"
            >
              Copy Code
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Total Network</p>
          <h4 className="text-2xl font-bold text-slate-900" data-testid="total-network">
            {stats?.total_network || 0}
          </h4>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Direct (Lvl 1)</p>
          <h4 className="text-2xl font-bold text-slate-900" data-testid="direct-referrals">
            {stats?.direct_referrals || 0}
          </h4>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Level 2</p>
          <h4 className="text-2xl font-bold text-slate-900">{stats?.level2_referrals || 0}</h4>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm text-center">
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-1">Level 3</p>
          <h4 className="text-2xl font-bold text-slate-900">{stats?.level3_referrals || 0}</h4>
        </div>
      </div>

      {/* Commission Earned */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm">Total Commission Earned</p>
            <h3 className="text-3xl font-bold" data-testid="total-commission">
              ${stats?.total_commission?.toFixed(2) || '0.00'}
            </h3>
          </div>
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Commission Structure */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Commission Structure</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <p className="text-sm text-blue-600 font-medium">Level 1 (Direct)</p>
            <p className="text-2xl font-bold text-blue-700">15%</p>
            <p className="text-xs text-blue-500">On referral earnings</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <p className="text-sm text-indigo-600 font-medium">Level 2</p>
            <p className="text-2xl font-bold text-indigo-700">5%</p>
            <p className="text-xs text-indigo-500">On sub-referral earnings</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <p className="text-sm text-purple-600 font-medium">Level 3</p>
            <p className="text-2xl font-bold text-purple-700">2%</p>
            <p className="text-xs text-purple-500">On 3rd level earnings</p>
          </div>
        </div>
      </div>

      {/* Direct Referrals List */}
      {referrals.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">Direct Referrals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Package</th>
                  <th className="px-6 py-3">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-900">{ref.name}</td>
                    <td className="px-6 py-4">{ref.email}</td>
                    <td className="px-6 py-4">
                      {ref.active_package ? (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {ref.active_package}
                        </span>
                      ) : (
                        <span className="text-slate-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4">{new Date(ref.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {referrals.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No referrals yet. Share your link to start building your network!</p>
        </div>
      )}
    </div>
  );
};

export default UserReferrals;
