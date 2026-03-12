import React, { useState } from 'react';
import { useAuth, api, useToast } from '@/lib/context';
import { Loader2, User, Mail, Wallet, Lock, Copy, Shield, Calendar, Award } from 'lucide-react';

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
      <div className="glass rounded-3xl p-6 sm:p-8 animate-slideUp">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center">
            <User className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Profile Settings</h2>
            <p className="text-sm text-slate-400">Manage your account information</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <User className="w-4 h-4 inline mr-2" />Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="input-dark"
                data-testid="name-input"
              />
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />Email Address
              </label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="input-dark opacity-60 cursor-not-allowed"
              />
            </div>

            {/* USDT Wallet */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Wallet className="w-4 h-4 inline mr-2" />USDT Wallet
              </label>
              <input
                type="text"
                value={formData.usdt_wallet}
                onChange={(e) => setFormData(prev => ({ ...prev, usdt_wallet: e.target.value }))}
                placeholder="TRC20/BEP20 address"
                className="input-dark"
                data-testid="wallet-input"
              />
            </div>

            {/* JazzCash Number */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                JazzCash Number
              </label>
              <input
                type="text"
                value={formData.jazzcash_number}
                onChange={(e) => setFormData(prev => ({ ...prev, jazzcash_number: e.target.value }))}
                placeholder="03XXXXXXXXX"
                className="input-dark"
                data-testid="jazzcash-input"
              />
            </div>

            {/* Password */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />New Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Leave blank to keep current password"
                className="input-dark"
                data-testid="password-input"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="btn-primary py-3 flex items-center gap-2 disabled:opacity-50"
            data-testid="save-profile-btn"
          >
            {saving && <Loader2 className="w-5 h-5 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>

      {/* Account Info */}
      <div className="glass rounded-3xl p-6 animate-slideUp">
        <h3 className="text-lg font-semibold text-white mb-6">Account Information</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="glass-light rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Your Referral Code</p>
            <div className="flex items-center justify-between">
              <p className="font-mono font-medium text-white text-sm">{user?.referral_code}</p>
              <button
                onClick={copyReferralCode}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>
          
          <div className="glass-light rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Referred By</p>
            <p className="font-mono font-medium text-white text-sm">{user?.referred_by || 'N/A'}</p>
          </div>
          
          <div className="glass-light rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">
              <Award className="w-3 h-3 inline mr-1" />Active Package
            </p>
            <p className="font-medium text-white">{user?.active_package || 'None'}</p>
          </div>
          
          <div className="glass-light rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Current Rank</p>
            <p className="font-medium text-white">{user?.rank || 'None'}</p>
          </div>
          
          <div className="glass-light rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">
              <Calendar className="w-3 h-3 inline mr-1" />Member Since
            </p>
            <p className="font-medium text-white">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          
          <div className="glass-light rounded-xl p-4">
            <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">
              <Shield className="w-3 h-3 inline mr-1" />Account Status
            </p>
            <p className={`font-medium ${user?.is_blocked ? 'text-red-400' : 'text-emerald-400'}`}>
              {user?.is_blocked ? 'Blocked' : 'Active'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
