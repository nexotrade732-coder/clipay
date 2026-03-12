import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Save, Users, Layers, TrendingUp, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminMLM = () => {
  const toast = useToast();
  const [settings, setSettings] = useState({
    level1_percent: 15,
    level2_percent: 5,
    level3_percent: 2,
    matrix_width: 5
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/admin/mlm-settings');
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
      await api.put('/admin/mlm-settings', {
        level1_percent: parseFloat(settings.level1_percent),
        level2_percent: parseFloat(settings.level2_percent),
        level3_percent: parseFloat(settings.level3_percent),
        matrix_width: parseInt(settings.matrix_width)
      });
      toast.success('MLM settings saved successfully');
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

  const totalCommission = parseFloat(settings.level1_percent) + parseFloat(settings.level2_percent) + parseFloat(settings.level3_percent);

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-testid="admin-mlm-page">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-blue-600/20"></div>
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl icon-box-purple flex items-center justify-center">
              <GitBranch className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">MLM Configuration</h2>
              <p className="text-slate-400 text-sm mt-1">Configure matrix and commission settings</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Commission Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 text-center card-hover"
        >
          <div className="w-12 h-12 rounded-xl icon-box-blue flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-blue-400">L1</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{settings.level1_percent}%</p>
          <p className="text-xs text-slate-400 mt-1">Level 1 (Direct)</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5 text-center card-hover"
        >
          <div className="w-12 h-12 rounded-xl icon-box-purple flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-purple-400">L2</span>
          </div>
          <p className="text-2xl font-bold text-purple-400">{settings.level2_percent}%</p>
          <p className="text-xs text-slate-400 mt-1">Level 2</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 text-center card-hover"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/30 flex items-center justify-center mx-auto mb-3">
            <span className="text-lg font-bold text-pink-400">L3</span>
          </div>
          <p className="text-2xl font-bold text-pink-400">{settings.level3_percent}%</p>
          <p className="text-xs text-slate-400 mt-1">Level 3</p>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5 text-center card-hover"
        >
          <div className="w-12 h-12 rounded-xl icon-box-emerald flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{totalCommission}%</p>
          <p className="text-xs text-slate-400 mt-1">Total Commission</p>
        </motion.div>
      </div>

      {/* Settings Form */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-6 sm:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Commission Section */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl icon-box-blue flex items-center justify-center">
                <Layers className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Commission Percentages</h3>
                <p className="text-xs text-slate-400">Set referral earnings for each level</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Level 1 (Direct) %</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.level1_percent}
                  onChange={(e) => setSettings(prev => ({ ...prev, level1_percent: e.target.value }))}
                  className="input-dark"
                  data-testid="level1-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Level 2 %</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.level2_percent}
                  onChange={(e) => setSettings(prev => ({ ...prev, level2_percent: e.target.value }))}
                  className="input-dark"
                  data-testid="level2-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Level 3 %</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.level3_percent}
                  onChange={(e) => setSettings(prev => ({ ...prev, level3_percent: e.target.value }))}
                  className="input-dark"
                  data-testid="level3-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Matrix Width</label>
                <input
                  type="number"
                  value={settings.matrix_width}
                  onChange={(e) => setSettings(prev => ({ ...prev, matrix_width: e.target.value }))}
                  className="input-dark"
                  data-testid="matrix-width-input"
                />
              </div>
            </div>
          </div>

          {/* Visual Preview */}
          <div className="glass-light rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-slate-400" />
              <h4 className="text-sm font-medium text-white">Commission Flow Preview</h4>
            </div>
            
            <div className="flex items-center justify-center gap-4 py-6">
              {/* Level 1 */}
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/30 to-blue-600/20 border border-blue-500/30 flex items-center justify-center mx-auto mb-2 animate-pulse-glow">
                  <span className="text-xl font-bold text-blue-400">{settings.level1_percent}%</span>
                </div>
                <p className="text-xs text-slate-400">Direct Referral</p>
              </div>
              
              {/* Arrow */}
              <div className="w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500"></div>
              
              {/* Level 2 */}
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-purple-600/20 border border-purple-500/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-lg font-bold text-purple-400">{settings.level2_percent}%</span>
                </div>
                <p className="text-xs text-slate-400">Level 2</p>
              </div>
              
              {/* Arrow */}
              <div className="w-12 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500"></div>
              
              {/* Level 3 */}
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500/30 to-pink-600/20 border border-pink-500/30 flex items-center justify-center mx-auto mb-2">
                  <span className="text-md font-bold text-pink-400">{settings.level3_percent}%</span>
                </div>
                <p className="text-xs text-slate-400">Level 3</p>
              </div>
            </div>

            <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
              <p className="text-xs text-slate-400 mb-1">Total Commission per Sale</p>
              <p className="text-2xl font-bold text-emerald-400">{totalCommission}%</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="btn-primary flex items-center gap-2"
            data-testid="save-mlm-btn"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            Save Configuration
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminMLM;
