import React, { useState, useEffect, useRef } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Save, Settings, Wallet, Globe, CreditCard, AlertTriangle, Upload, X, QrCode, Image } from 'lucide-react';
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
    usdt_qr_trc20: '',
    usdt_qr_bep20: '',
    jazzcash_number: '',
    jazzcash_name: '',
    jazzcash_qr: '',
    usd_to_pkr_rate: 300
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState({});

  const fileInputRefs = {
    usdt_qr_trc20: useRef(null),
    usdt_qr_bep20: useRef(null),
    jazzcash_qr: useRef(null)
  };

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

  const handleFileUpload = async (field, file) => {
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('File size must be less than 2MB');
      return;
    }

    setUploading(prev => ({ ...prev, [field]: true }));

    try {
      // Convert to base64
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({ ...prev, [field]: reader.result }));
        setUploading(prev => ({ ...prev, [field]: false }));
        toast.success('QR code uploaded successfully');
      };
      reader.onerror = () => {
        toast.error('Failed to read file');
        setUploading(prev => ({ ...prev, [field]: false }));
      };
      reader.readAsDataURL(file);
    } catch (e) {
      toast.error('Failed to upload QR code');
      setUploading(prev => ({ ...prev, [field]: false }));
    }
  };

  const removeQR = (field) => {
    setSettings(prev => ({ ...prev, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/admin/settings', {
        ...settings,
        min_withdrawal: parseFloat(settings.min_withdrawal),
        withdrawal_fee_percent: parseFloat(settings.withdrawal_fee_percent),
        usd_to_pkr_rate: parseFloat(settings.usd_to_pkr_rate)
      });
      toast.success('Settings saved successfully');
    } catch (e) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const QRUploadBox = ({ field, label, networkColor }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-300">{label} QR Code</label>
      <div className={`relative border-2 border-dashed rounded-2xl transition-all ${
        settings[field] ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-slate-600 hover:border-slate-500'
      }`}>
        {settings[field] ? (
          <div className="p-4 text-center">
            <div className="relative inline-block">
              <img 
                src={settings[field]} 
                alt={`${label} QR`} 
                className="w-40 h-40 object-contain rounded-xl mx-auto bg-white p-2"
              />
              <button
                type="button"
                onClick={() => removeQR(field)}
                className="absolute -top-2 -right-2 p-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-emerald-400 mt-2 flex items-center justify-center gap-1">
              <QrCode className="w-3 h-3" />
              QR Code uploaded
            </p>
          </div>
        ) : (
          <div 
            className="p-6 text-center cursor-pointer"
            onClick={() => fileInputRefs[field].current?.click()}
          >
            {uploading[field] ? (
              <Loader2 className="w-8 h-8 animate-spin text-slate-400 mx-auto mb-2" />
            ) : (
              <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${networkColor} border border-white/10 flex items-center justify-center mx-auto mb-3`}>
                <Upload className="w-6 h-6 text-white/70" />
              </div>
            )}
            <p className="text-sm text-slate-400 mb-1">Click to upload QR code</p>
            <p className="text-xs text-slate-500">PNG, JPG up to 2MB</p>
          </div>
        )}
        <input
          ref={fileInputRefs[field]}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileUpload(field, e.target.files?.[0])}
        />
      </div>
    </div>
  );

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
              <p className="text-slate-400 text-sm mt-1">Configure platform settings and payment methods</p>
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
              <Globe className="w-5 h-5 text-cyan-400" />
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
          
          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">USD to PKR Rate</label>
              <input
                type="number"
                step="1"
                value={settings.usd_to_pkr_rate}
                onChange={(e) => setSettings(prev => ({ ...prev, usd_to_pkr_rate: e.target.value }))}
                className="input-dark"
                placeholder="300"
                data-testid="usd-pkr-rate-input"
              />
            </div>
          </div>
        </motion.div>

        {/* USDT TRC20 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-3xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 border border-red-500/30 flex items-center justify-center">
              <span className="text-sm font-bold text-red-400">TRC</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">USDT (TRC20 Network)</h3>
              <p className="text-xs text-slate-400">TRON network payment details</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Address</label>
              <input
                type="text"
                value={settings.usdt_address_trc20 || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, usdt_address_trc20: e.target.value }))}
                placeholder="Enter TRC20 wallet address"
                className="input-dark font-mono text-sm"
                data-testid="usdt-trc20-input"
              />
            </div>
            <QRUploadBox 
              field="usdt_qr_trc20" 
              label="USDT TRC20" 
              networkColor="from-red-500/30 to-red-600/20"
            />
          </div>
        </motion.div>

        {/* USDT BEP20 */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-3xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center">
              <span className="text-sm font-bold text-amber-400">BEP</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">USDT (BEP20 Network)</h3>
              <p className="text-xs text-slate-400">Binance Smart Chain payment details</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Wallet Address</label>
              <input
                type="text"
                value={settings.usdt_address_bep20 || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, usdt_address_bep20: e.target.value }))}
                placeholder="Enter BEP20 wallet address"
                className="input-dark font-mono text-sm"
                data-testid="usdt-bep20-input"
              />
            </div>
            <QRUploadBox 
              field="usdt_qr_bep20" 
              label="USDT BEP20" 
              networkColor="from-amber-500/30 to-amber-600/20"
            />
          </div>
        </motion.div>

        {/* JazzCash */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass rounded-3xl p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30 flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-pink-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">JazzCash</h3>
              <p className="text-xs text-slate-400">Local mobile payment details</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
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
                <label className="block text-sm font-medium text-slate-300 mb-2">Account Holder Name</label>
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
            <QRUploadBox 
              field="jazzcash_qr" 
              label="JazzCash" 
              networkColor="from-pink-500/30 to-pink-600/20"
            />
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
