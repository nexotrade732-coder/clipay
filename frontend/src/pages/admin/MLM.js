import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Save } from 'lucide-react';

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
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto" data-testid="admin-mlm-page">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">
          Matrix & Commissions
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Commission Structure */}
          <div>
            <h3 className="text-sm font-medium text-slate-700 mb-4">Commission Percentages</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Level 1 (Direct) %</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.level1_percent}
                  onChange={(e) => setSettings(prev => ({ ...prev, level1_percent: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  data-testid="level1-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Level 2 %</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.level2_percent}
                  onChange={(e) => setSettings(prev => ({ ...prev, level2_percent: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  data-testid="level2-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Level 3 %</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.level3_percent}
                  onChange={(e) => setSettings(prev => ({ ...prev, level3_percent: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  data-testid="level3-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Matrix Width</label>
                <input
                  type="number"
                  value={settings.matrix_width}
                  onChange={(e) => setSettings(prev => ({ ...prev, matrix_width: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  data-testid="matrix-width-input"
                />
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
            <h4 className="text-sm font-medium text-slate-700 mb-3">Commission Preview</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Level 1</p>
                <p className="text-xl font-bold text-blue-600">{settings.level1_percent}%</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Level 2</p>
                <p className="text-xl font-bold text-indigo-600">{settings.level2_percent}%</p>
              </div>
              <div className="bg-white rounded-lg p-3 border border-slate-200">
                <p className="text-xs text-slate-500 mb-1">Level 3</p>
                <p className="text-xl font-bold text-purple-600">{settings.level3_percent}%</p>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-slate-900 text-white font-medium rounded-xl text-sm px-6 py-2.5 hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            data-testid="save-mlm-btn"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminMLM;
