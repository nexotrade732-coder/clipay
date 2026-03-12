import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Save, Settings, Wallet, Globe, CreditCard, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminSettings = () => {
  const toast = useToast();
  const [settings, setSettings] = useState({
    platform_name: 'CLIPAY',
    min_withdrawal: 10,
    withdrawal_fee_percent: 2,
    maintenance_mode: false,
    usdt_address_trc20: '',
    usdt_address_bep20: '',
    jazzcash_number: '',
    jazzcash_name: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/settings');
      setSettings(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/settings', {
        ...settings,
        min_withdrawal: parseFloat(settings.min_withdrawal),
        withdrawal_fee_percent: parseFloat(settings.withdrawal_fee_percent)
      });
      toast.success('Settings saved successfully');
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-testid="admin-settings-page">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-600/20 via-slate-700/20 to-slate-600/20"></div>
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-500/20 to-slate-600/10 border border-slate-500/30 flex items-center justify-center">
              <Settings className="w-7 h-7 text-slate-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">System Settings</h2>
              <p className="text-slate-400 text-sm mt-1">Configure platform settings and payment addresses</p>
            </div>
          </div>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* General Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl icon-box-blue flex items-center justify-center">
              <Globe className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">General Settings</h3>
              <p className="text-xs text-slate-400">Basic platform configuration</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Platform Name</label>
              <input
                type="text"
                value={settings.platform_name}
                onChange={(e) => setSettings(prev => ({ ...prev, platform_name: e.target.value }))}
                className="input-dark"
                data-testid="platform-name-input"
              />
            </div>
            
            {/* Maintenance Mode */}
            <div className={`p-4 rounded-2xl border transition-all ${
              settings.maintenance_mode 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-slate-800/50 border-white/5'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    settings.maintenance_mode ? 'icon-box-red' : 'bg-slate-700/50'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${settings.maintenance_mode ? 'text-red-400' : 'text-slate-400'}`} />
                  </div>
                  <div>
                    <p className="font-medium text-white">Maintenance Mode</p>
                    <p className="text-xs text-slate-400">Temporarily disable platform access</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenance_mode}
                    onChange={(e) => setSettings(prev => ({ ...prev, maintenance_mode: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Withdrawal Settings */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl icon-box-purple flex items-center justify-center">
              <Wallet className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Withdrawal Settings</h3>
              <p className="text-xs text-slate-400">Configure payout rules</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Minimum Withdrawal ($)</label>
              <input
                type="number"
                step="0.01"
                value={settings.min_withdrawal}
                onChange={(e) => setSettings(prev => ({ ...prev, min_withdrawal: e.target.value }))}
                className="input-dark"
                data-testid="min-withdrawal-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Withdrawal Fee (%)</label>
              <input
                type="number"
                step="0.1"
                value={settings.withdrawal_fee_percent}
                onChange={(e) => setSettings(prev => ({ ...prev, withdrawal_fee_percent: e.target.value }))}
                className="input-dark"
                data-testid="withdrawal-fee-input"
              />
            </div>
          </div>
        </motion.div>

        {/* Payment Addresses */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl icon-box-emerald flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Payment Addresses</h3>
              <p className="text-xs text-slate-400">Wallet addresses displayed to users for deposits</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* USDT TRC20 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                USDT Address (TRC20)
              </label>
              <input
                type="text"
                value={settings.usdt_address_trc20 || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, usdt_address_trc20: e.target.value }))}
                placeholder="Enter TRC20 wallet address"
                className="input-dark font-mono text-sm"
                data-testid="usdt-trc20-input"
              />
            </div>
            
            {/* USDT BEP20 */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                USDT Address (BEP20)
              </label>
              <input
                type="text"
                value={settings.usdt_address_bep20 || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, usdt_address_bep20: e.target.value }))}
                placeholder="Enter BEP20 wallet address"
                className="input-dark font-mono text-sm"
                data-testid="usdt-bep20-input"
              />
            </div>
            
            {/* JazzCash */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">JazzCash Number</label>
                <input
                  type="text"
                  value={settings.jazzcash_number || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, jazzcash_number: e.target.value }))}
                  placeholder="03XXXXXXXXX"
                  className="input-dark"
                  data-testid="jazzcash-number-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">JazzCash Account Name</label>
                <input
                  type="text"
                  value={settings.jazzcash_name || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, jazzcash_name: e.target.value }))}
                  placeholder="Account holder name"
                  className="input-dark"
                  data-testid="jazzcash-name-input"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={saving}
          className="btn-primary flex items-center gap-2"
          data-testid="save-settings-btn"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save All Settings
        </motion.button>
      </form>
    </div>
  );
};

export default AdminSettings;
