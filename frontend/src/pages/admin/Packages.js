import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Plus, Edit, Trash2, X, Package, Sparkles, Zap, Crown, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPackages = () => {
  const toast = useToast();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    daily_ads: '',
    earning_per_ad: '',
    duration_days: 30,
    matrix_level: 1
  });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/admin/packages');
      setPackages(res.data);
    } catch (e) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      price: '',
      daily_ads: '',
      earning_per_ad: '',
      duration_days: 30,
      matrix_level: 1
    });
    setModal('add');
  };

  const handleEdit = (pkg) => {
    setFormData({
      name: pkg.name,
      price: pkg.price,
      daily_ads: pkg.daily_ads,
      earning_per_ad: pkg.earning_per_ad,
      duration_days: pkg.duration_days,
      matrix_level: pkg.matrix_level
    });
    setModal(pkg.id);
  };

  const handleSubmit = async () => {
    try {
      if (modal === 'add') {
        await api.post('/admin/packages', {
          ...formData,
          price: parseFloat(formData.price),
          daily_ads: parseInt(formData.daily_ads),
          earning_per_ad: parseFloat(formData.earning_per_ad),
          duration_days: parseInt(formData.duration_days),
          matrix_level: parseInt(formData.matrix_level)
        });
        toast.success('Package created successfully');
      } else {
        await api.put(`/admin/packages/${modal}`, {
          ...formData,
          price: parseFloat(formData.price),
          daily_ads: parseInt(formData.daily_ads),
          earning_per_ad: parseFloat(formData.earning_per_ad),
          duration_days: parseInt(formData.duration_days),
          matrix_level: parseInt(formData.matrix_level)
        });
        toast.success('Package updated successfully');
      }
      setModal(null);
      fetchPackages();
    } catch (e) {
      toast.error('Failed to save package');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;
    try {
      await api.delete(`/admin/packages/${id}`);
      toast.success('Package deleted');
      fetchPackages();
    } catch (e) {
      toast.error('Failed to delete package');
    }
  };

  const getPackageIcon = (name) => {
    const lowerName = name?.toLowerCase() || '';
    if (lowerName.includes('elite') || lowerName.includes('vip')) return <Crown className="w-8 h-8" />;
    if (lowerName.includes('premium') || lowerName.includes('pro')) return <Sparkles className="w-8 h-8" />;
    if (lowerName.includes('business')) return <Zap className="w-8 h-8" />;
    return <Star className="w-8 h-8" />;
  };

  const getPackageGradient = (index) => {
    const gradients = [
      'from-blue-500/20 to-cyan-500/20',
      'from-purple-500/20 to-pink-500/20',
      'from-orange-500/20 to-amber-500/20',
      'from-emerald-500/20 to-teal-500/20',
    ];
    return gradients[index % gradients.length];
  };

  const getIconColor = (index) => {
    const colors = ['text-blue-400', 'text-purple-400', 'text-orange-400', 'text-emerald-400'];
    return colors[index % colors.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6" data-testid="admin-packages-page">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl icon-box-purple flex items-center justify-center">
            <Package className="w-7 h-7 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Package Management</h2>
            <p className="text-slate-400 text-sm">Configure rewards packages</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
          data-testid="add-package-btn"
        >
          <Plus className="w-5 h-5" /> Add Package
        </motion.button>
      </motion.div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {packages.map((pkg, index) => (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.1 }}
              className="glass rounded-3xl p-6 relative overflow-hidden card-hover group"
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${getPackageGradient(index)} opacity-50`}></div>
              <div className="absolute inset-0 grid-bg opacity-20"></div>
              
              {/* Action buttons */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => handleEdit(pkg)}
                  className="p-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(pkg.id)}
                  className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${getPackageGradient(index)} border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <span className={getIconColor(index)}>{getPackageIcon(pkg.name)}</span>
                </div>
                
                {/* Name & Price */}
                <h3 className="text-xl font-bold text-white mb-1">{pkg.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-3xl font-bold gradient-text">${pkg.price}</span>
                  <span className="text-slate-500 text-sm">/one-time</span>
                </div>
                
                {/* Features */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Zap className="w-4 h-4 text-amber-400" />
                    </div>
                    <span className="text-slate-300">{pkg.daily_ads} Ads per day</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                    </div>
                    <span className="text-slate-300">${pkg.earning_per_ad?.toFixed(2)} per ad</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Star className="w-4 h-4 text-purple-400" />
                    </div>
                    <span className="text-slate-300">{pkg.duration_days} Days duration</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <Crown className="w-4 h-4 text-blue-400" />
                    </div>
                    <span className="text-slate-300">Level {pkg.matrix_level} Matrix</span>
                  </div>
                </div>

                {/* Daily potential */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <p className="text-xs text-slate-400 mb-1">Daily Potential</p>
                  <p className="text-xl font-bold text-emerald-400">
                    ${(pkg.daily_ads * pkg.earning_per_ad).toFixed(2)}/day
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {packages.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-3xl p-12 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-purple-500/10 flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No packages configured</h3>
          <p className="text-slate-400 mb-6">Create your first rewards package to get started</p>
          <button onClick={handleAdd} className="btn-primary">
            <Plus className="w-4 h-4 mr-2 inline" /> Add Package
          </button>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 modal-backdrop flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass rounded-3xl p-6 w-full max-w-md"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl icon-box-purple flex items-center justify-center">
                    <Package className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {modal === 'add' ? 'New Package' : 'Edit Package'}
                  </h3>
                </div>
                <button onClick={() => setModal(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Package Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-dark"
                    placeholder="e.g., Premium"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Daily Ads</label>
                    <input
                      type="number"
                      value={formData.daily_ads}
                      onChange={(e) => setFormData(prev => ({ ...prev, daily_ads: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Earning/Ad ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.earning_per_ad}
                      onChange={(e) => setFormData(prev => ({ ...prev, earning_per_ad: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Duration (Days)</label>
                    <input
                      type="number"
                      value={formData.duration_days}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration_days: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Matrix Level</label>
                  <input
                    type="number"
                    value={formData.matrix_level}
                    onChange={(e) => setFormData(prev => ({ ...prev, matrix_level: e.target.value }))}
                    className="input-dark"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setModal(null)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="btn-primary flex-1"
                >
                  {modal === 'add' ? 'Create Package' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPackages;
