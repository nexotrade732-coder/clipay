import React, { useState, useEffect } from 'react';
import { useAuth, api, useToast } from '@/lib/context';
import { Copy, Users, Link2, Loader2, TrendingUp, Sparkles, Award } from 'lucide-react';

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
      <div className="relative rounded-3xl overflow-hidden animate-slideUp">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600"></div>
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-medium text-blue-100">Earn up to 22% Commission</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">Grow Your Network</h3>
          <p className="text-blue-100 text-sm mb-6 max-w-lg">
            Invite friends using your unique referral link and earn commissions on their activities across 3 levels.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 max-w-2xl">
            <div className="relative flex-1">
              <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
              <input
                type="text"
                value={`${window.location.origin}/signup/${user?.referral_code || ''}`}
                readOnly
                className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-xl pl-12 pr-4 py-3 outline-none"
                data-testid="referral-link-input"
              />
            </div>
            <button
              onClick={copyReferralLink}
              className="bg-white text-slate-900 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2 shadow-lg"
              data-testid="copy-link-btn"
            >
              <Copy className="w-4 h-4" /> Copy Link
            </button>
          </div>
          
          <div className="mt-4 flex items-center gap-4">
            <p className="text-sm text-blue-200">
              Code: <span className="font-mono text-white">{user?.referral_code}</span>
            </p>
            <button onClick={copyReferralCode} className="text-yellow-300 hover:text-yellow-200 text-sm font-medium transition-colors">
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 text-center card-hover animate-slideUp stagger-1">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Total Network</p>
          <h4 className="text-3xl font-bold text-white" data-testid="total-network">
            {stats?.total_network || 0}
          </h4>
        </div>
        <div className="glass rounded-2xl p-5 text-center card-hover animate-slideUp stagger-2">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Level 1</p>
          <h4 className="text-3xl font-bold text-blue-400" data-testid="direct-referrals">
            {stats?.direct_referrals || 0}
          </h4>
        </div>
        <div className="glass rounded-2xl p-5 text-center card-hover animate-slideUp stagger-3">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Level 2</p>
          <h4 className="text-3xl font-bold text-purple-400">{stats?.level2_referrals || 0}</h4>
        </div>
        <div className="glass rounded-2xl p-5 text-center card-hover animate-slideUp stagger-4">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Level 3</p>
          <h4 className="text-3xl font-bold text-orange-400">{stats?.level3_referrals || 0}</h4>
        </div>
      </div>

      {/* Commission Earned */}
      <div className="relative rounded-2xl overflow-hidden animate-slideUp">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500"></div>
        <div className="relative p-6 flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm mb-1">Total Commission Earned</p>
            <h3 className="text-4xl font-bold text-white" data-testid="total-commission">
              ${stats?.total_commission?.toFixed(2) || '0.00'}
            </h3>
          </div>
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Commission Structure */}
      <div className="glass rounded-3xl p-6 animate-slideUp">
        <h3 className="text-lg font-semibold text-white mb-4">Commission Structure</h3>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="glass-light rounded-2xl p-5 border border-blue-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-blue-400" />
              </div>
              <p className="text-sm text-blue-400 font-medium">Level 1</p>
            </div>
            <p className="text-3xl font-bold text-white mb-1">15%</p>
            <p className="text-xs text-slate-400">Direct referral earnings</p>
          </div>
          <div className="glass-light rounded-2xl p-5 border border-purple-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-sm text-purple-400 font-medium">Level 2</p>
            </div>
            <p className="text-3xl font-bold text-white mb-1">5%</p>
            <p className="text-xs text-slate-400">Sub-referral earnings</p>
          </div>
          <div className="glass-light rounded-2xl p-5 border border-orange-500/20">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                <Award className="w-4 h-4 text-orange-400" />
              </div>
              <p className="text-sm text-orange-400 font-medium">Level 3</p>
            </div>
            <p className="text-3xl font-bold text-white mb-1">2%</p>
            <p className="text-xs text-slate-400">3rd level earnings</p>
          </div>
        </div>
      </div>

      {/* Direct Referrals List */}
      {referrals.length > 0 && (
        <div className="glass rounded-3xl overflow-hidden animate-slideUp">
          <div className="px-6 py-5 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Direct Referrals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 font-medium border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Package</th>
                  <th className="px-6 py-4">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {referrals.map((ref) => (
                  <tr key={ref.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{ref.name}</td>
                    <td className="px-6 py-4 text-slate-300">{ref.email}</td>
                    <td className="px-6 py-4">
                      {ref.active_package ? (
                        <span className="badge-success">{ref.active_package}</span>
                      ) : (
                        <span className="text-slate-500">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-slate-300">{new Date(ref.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {referrals.length === 0 && (
        <div className="glass rounded-3xl p-12 text-center animate-slideUp">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No referrals yet. Share your link to start building your network!</p>
        </div>
      )}
    </div>
  );
};

export default UserReferrals;
