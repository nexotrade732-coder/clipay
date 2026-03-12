import React, { useState } from 'react';
import { useAuth, api, useToast } from '@/lib/context';
import { Loader2, User, Mail, Wallet, Lock, Copy } from 'lucide-react';

const UserProfile = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    usdt_wallet: user?.usdt_wallet || '',
    jazzcash_number: user?.jazzcash_number || '',
    password: ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const updateData = {};
      if (formData.name !== user?.name) updateData.name = formData.name;
      if (formData.usdt_wallet !== user?.usdt_wallet) updateData.usdt_wallet = formData.usdt_wallet;
      if (formData.jazzcash_number !== user?.jazzcash_number) updateData.jazzcash_number = formData.jazzcash_number;
      if (formData.password) updateData.password = formData.password;

      if (Object.keys(updateData).length > 0) {
        await api.put('/auth/profile', updateData);
        await refreshUser();
        toast.success('Profile updated successfully!');
        setFormData(prev => ({ ...prev, password: '' }));
      } else {
        toast.info('No changes to save');
      }
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user?.referral_code || '');
    toast.success('Referral code copied!');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="profile-page">
      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
          Profile Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <User className="w-4 h-4 inline mr-1" /> Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                data-testid="name-input"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <Mail className="w-4 h-4 inline mr-1" /> Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full bg-slate-100 border border-slate-200 text-slate-500 text-sm rounded-xl px-4 py-2.5 cursor-not-allowed"
              />
            </div>

            {/* USDT Wallet */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <Wallet className="w-4 h-4 inline mr-1" /> USDT Wallet (TRC20/BEP20)
              </label>
              <input
                type="text"
                value={formData.usdt_wallet}
                onChange={(e) => setFormData(prev => ({ ...prev, usdt_wallet: e.target.value }))}
                placeholder="Enter your USDT wallet address"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                data-testid="wallet-input"
              />
            </div>

            {/* JazzCash Number */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                JazzCash Number
              </label>
              <input
                type="text"
                value={formData.jazzcash_number}
                onChange={(e) => setFormData(prev => ({ ...prev, jazzcash_number: e.target.value }))}
                placeholder="03XXXXXXXXX"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                data-testid="jazzcash-input"
              />
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                <Lock className="w-4 h-4 inline mr-1" /> New Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Leave blank to keep current password"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                data-testid="password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-slate-900 text-white font-medium rounded-xl text-sm px-6 py-2.5 hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            data-testid="save-profile-btn"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Your Referral Code</p>
            <div className="flex items-center justify-between">
              <p className="font-mono font-medium text-slate-900">{user?.referral_code}</p>
              <button
                onClick={copyReferralCode}
                className="p-1.5 hover:bg-slate-200 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Referred By</p>
            <p className="font-mono font-medium text-slate-900">{user?.referred_by || 'N/A'}</p>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Active Package</p>
            <p className="font-medium text-slate-900">{user?.active_package || 'None'}</p>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Current Rank</p>
            <p className="font-medium text-slate-900">{user?.rank || 'None'}</p>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Member Since</p>
            <p className="font-medium text-slate-900">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          
          <div className="bg-slate-50 rounded-xl p-4">
            <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Account Status</p>
            <p className={`font-medium ${user?.is_blocked ? 'text-red-600' : 'text-emerald-600'}`}>
              {user?.is_blocked ? 'Blocked' : 'Active'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
