import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Gift, Save, ToggleLeft, ToggleRight, Play, DollarSign, Target, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminFreePackage = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    is_enabled: true,
    name: 'Free Trial',
    daily_ads: 4,
    earning_per_ad: 0.50,
    withdrawal_target: 100.0,
    description: 'Watch ads daily and earn up to $100. Activate a paid package to withdraw your earnings.'
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/free-package');
      setSettings(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/admin/free-package', settings);
      toast.success('Free package settings saved successfully');
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="admin-free-package">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-6"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
            <Gift className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Free Package Settings</h1>
            <p className="text-slate-400">Configure the free trial package for new users</p>
          </div>
        </div>
      </motion.div>

      {/* Settings Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-3xl p-6 space-y-6"
      >
        {/* Enable/Disable Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50">
          <div className="flex items-center gap-4">
            {settings.is_enabled ? (
              <ToggleRight className="w-6 h-6 text-emerald-400" />
            ) : (
              <ToggleLeft className="w-6 h-6 text-slate-400" />
            )}
            <div>
              <h3 className="font-medium text-white">Free Package Status</h3>
              <p className="text-sm text-slate-400">
                {settings.is_enabled ? 'New users will receive the free package on signup' : 'New users will not receive any package on signup'}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleChange('is_enabled', !settings.is_enabled)}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              settings.is_enabled 
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                : 'bg-slate-700/50 text-slate-400'
            }`}
          >
            {settings.is_enabled ? 'Enabled' : 'Disabled'}
          </button>
        </div>

        {/* Package Name */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            Package Name
          </label>
          <input
            type="text"
            value={settings.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="input-dark"
            placeholder="Free Trial"
          />
        </div>

        {/* Daily Ads */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Play className="w-4 h-4 text-cyan-400" />
            Daily Ads Limit
          </label>
          <input
            type="number"
            value={settings.daily_ads}
            onChange={(e) => handleChange('daily_ads', parseInt(e.target.value) || 0)}
            className="input-dark"
            min="1"
            max="100"
          />
          <p className="text-xs text-slate-500 mt-1">Number of videos/ads users can watch per day</p>
        </div>

        {/* Earning Per Ad */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            Earning Per Ad ($)
          </label>
          <input
            type="number"
            value={settings.earning_per_ad}
            onChange={(e) => handleChange('earning_per_ad', parseFloat(e.target.value) || 0)}
            className="input-dark"
            min="0.01"
            step="0.01"
          />
          <p className="text-xs text-slate-500 mt-1">Amount users earn per watched video</p>
        </div>

        {/* Withdrawal Target */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <Target className="w-4 h-4 text-amber-400" />
            Withdrawal Target ($)
          </label>
          <input
            type="number"
            value={settings.withdrawal_target}
            onChange={(e) => handleChange('withdrawal_target', parseFloat(e.target.value) || 0)}
            className="input-dark"
            min="1"
            step="1"
          />
          <p className="text-xs text-slate-500 mt-1">
            Users must earn this amount before they can request withdrawal (after activating a paid package)
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2">
            <FileText className="w-4 h-4 text-slate-400" />
            Description
          </label>
          <textarea
            value={settings.description}
            onChange={(e) => handleChange('description', e.target.value)}
            className="input-dark min-h-[100px] resize-none"
            placeholder="Describe the free package to users..."
          />
        </div>

        {/* Summary Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30">
          <h4 className="font-medium text-white mb-3">Package Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-slate-400">Max Daily Earnings:</span>
              <span className="text-cyan-400 font-bold ml-2">
                ${(settings.daily_ads * settings.earning_per_ad).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-slate-400">Days to Target:</span>
              <span className="text-amber-400 font-bold ml-2">
                ~{Math.ceil(settings.withdrawal_target / (settings.daily_ads * settings.earning_per_ad))} days
              </span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full btn-primary py-4 text-base flex items-center justify-center gap-2"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5" />
              Save Settings
            </>
          )}
        </button>
      </motion.div>
    </div>
  );
};

export default AdminFreePackage;
