import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Plus, Edit, Trash2, X, Settings } from 'lucide-react';

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6" data-testid="admin-packages-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Manage Packages</h2>
        <button
          onClick={handleAdd}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
          data-testid="add-package-btn"
        >
          <Plus className="w-4 h-4" /> Add Package
        </button>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 relative">
            <button
              onClick={() => handleEdit(pkg)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-900"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <h3 className="font-semibold text-slate-900 mb-1">{pkg.name}</h3>
            <p className="text-2xl font-bold text-slate-900 mb-4">${pkg.price}</p>
            
            <div className="text-sm text-slate-500 space-y-1 mb-4">
              <p>{pkg.daily_ads} Ads / day</p>
              <p>${pkg.earning_per_ad.toFixed(2)} / ad</p>
              <p>{pkg.duration_days} Days</p>
              <p>Matrix Level {pkg.matrix_level}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(pkg)}
                className="flex-1 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100"
              >
                <Edit className="w-4 h-4 inline mr-1" /> Edit
              </button>
              <button
                onClick={() => handleDelete(pkg.id)}
                className="px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {modal === 'add' ? 'Add Package' : 'Edit Package'}
              </h3>
              <button onClick={() => setModal(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  placeholder="e.g., Premium"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Daily Ads</label>
                  <input
                    type="number"
                    value={formData.daily_ads}
                    onChange={(e) => setFormData(prev => ({ ...prev, daily_ads: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Earning/Ad ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.earning_per_ad}
                    onChange={(e) => setFormData(prev => ({ ...prev, earning_per_ad: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Duration (Days)</label>
                  <input
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) => setFormData(prev => ({ ...prev, duration_days: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Matrix Level</label>
                <input
                  type="number"
                  value={formData.matrix_level}
                  onChange={(e) => setFormData(prev => ({ ...prev, matrix_level: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setModal(null)}
                className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 px-4 py-2.5 bg-blue-500 text-white rounded-xl text-sm font-medium hover:bg-blue-600"
              >
                {modal === 'add' ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPackages;
