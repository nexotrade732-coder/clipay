import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Save, Settings } from 'lucide-react';

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
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="admin-settings-page">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
            <Settings className="w-5 h-5 text-slate-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">System Settings</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-4">General</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Platform Name</label>
                <input
                  type="text"
                  value={settings.platform_name}
                  onChange={(e) => setSettings(prev => ({ ...prev, platform_name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  data-testid="platform-name-input"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="maintenance"
                  checked={settings.maintenance_mode}
                  onChange={(e) => setSettings(prev => ({ ...prev, maintenance_mode: e.target.checked }))}
                  className="w-4 h-4"
                />
                <label htmlFor="maintenance" className="text-sm text-slate-700">Maintenance Mode</label>
              </div>
            </div>
          </div>

          {/* Withdrawal */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-4">Withdrawal Settings</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Minimum Withdrawal ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={settings.min_withdrawal}
                  onChange={(e) => setSettings(prev => ({ ...prev, min_withdrawal: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  data-testid="min-withdrawal-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Withdrawal Fee (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.withdrawal_fee_percent}
                  onChange={(e) => setSettings(prev => ({ ...prev, withdrawal_fee_percent: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  data-testid="withdrawal-fee-input"
                />
              </div>
            </div>
          </div>

          {/* Payment Addresses */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-4">Payment Addresses (for Deposits)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">USDT Address (TRC20)</label>
                <input
                  type="text"
                  value={settings.usdt_address_trc20 || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, usdt_address_trc20: e.target.value }))}
                  placeholder="Enter TRC20 wallet address"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-mono"
                  data-testid="usdt-trc20-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">USDT Address (BEP20)</label>
                <input
                  type="text"
                  value={settings.usdt_address_bep20 || ''}
                  onChange={(e) => setSettings(prev => ({ ...prev, usdt_address_bep20: e.target.value }))}
                  placeholder="Enter BEP20 wallet address"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-mono"
                  data-testid="usdt-bep20-input"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">JazzCash Number</label>
                  <input
                    type="text"
                    value={settings.jazzcash_number || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, jazzcash_number: e.target.value }))}
                    placeholder="03XXXXXXXXX"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                    data-testid="jazzcash-number-input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">JazzCash Account Name</label>
                  <input
                    type="text"
                    value={settings.jazzcash_name || ''}
                    onChange={(e) => setSettings(prev => ({ ...prev, jazzcash_name: e.target.value }))}
                    placeholder="Account holder name"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                    data-testid="jazzcash-name-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-slate-900 text-white font-medium rounded-xl text-sm px-6 py-2.5 hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            data-testid="save-settings-btn"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
