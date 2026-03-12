import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Plus, Edit, Trash2, X, Award } from 'lucide-react';

const AdminRanks = () => {
  const toast = useToast();
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    required_team_size: '',
    required_directs: '',
    reward: ''
  });

  useEffect(() => {
    fetchRanks();
  }, []);

  const fetchRanks = async () => {
    try {
      const res = await api.get('/admin/ranks');
      setRanks(res.data);
    } catch (e) {
      toast.error('Failed to load ranks');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      name: '',
      required_team_size: '',
      required_directs: '',
      reward: ''
    });
    setModal('add');
  };

  const handleEdit = (rank) => {
    setFormData({
      name: rank.name,
      required_team_size: rank.required_team_size,
      required_directs: rank.required_directs,
      reward: rank.reward
    });
    setModal(rank.id);
  };

  const handleSubmit = async () => {
    try {
      if (modal === 'add') {
        await api.post('/admin/ranks', {
          ...formData,
          required_team_size: parseInt(formData.required_team_size),
          required_directs: parseInt(formData.required_directs),
          reward: parseFloat(formData.reward)
        });
        toast.success('Rank created successfully');
      } else {
        await api.put(`/admin/ranks/${modal}`, {
          ...formData,
          required_team_size: parseInt(formData.required_team_size),
          required_directs: parseInt(formData.required_directs),
          reward: parseFloat(formData.reward)
        });
        toast.success('Rank updated successfully');
      }
      setModal(null);
      fetchRanks();
    } catch (e) {
      toast.error('Failed to save rank');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this rank?')) return;
    try {
      await api.delete(`/admin/ranks/${id}`);
      toast.success('Rank deleted');
      fetchRanks();
    } catch (e) {
      toast.error('Failed to delete rank');
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
    <div className="max-w-5xl mx-auto space-y-6" data-testid="admin-ranks-page">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-slate-900">Leadership Ranks</h2>
        <button
          onClick={handleAdd}
          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
          data-testid="add-rank-btn"
        >
          <Plus className="w-4 h-4" /> Add Rank
        </button>
      </div>

      {/* Ranks Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {ranks.map((rank) => (
          <div key={rank.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center relative">
            <div className="absolute top-4 right-4 flex gap-1">
              <button onClick={() => handleEdit(rank)} className="text-slate-400 hover:text-slate-700 p-1">
                <Edit className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete(rank.id)} className="text-slate-400 hover:text-red-600 p-1">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-amber-200">
              <Award className="w-7 h-7" />
            </div>
            
            <h3 className="font-semibold text-slate-900 mb-1">{rank.name}</h3>
            <p className="text-xl font-bold text-emerald-600 mb-4">${rank.reward} Reward</p>
            
            <div className="text-sm text-slate-500 space-y-1">
              <p>Team Size: {rank.required_team_size}</p>
              <p>Direct Referrals: {rank.required_directs}</p>
            </div>
          </div>
        ))}
      </div>

      {ranks.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No ranks configured. Add your first rank!</p>
        </div>
      )}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {modal === 'add' ? 'Add Rank' : 'Edit Rank'}
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
                  placeholder="e.g., Gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Team Size</label>
                  <input
                    type="number"
                    value={formData.required_team_size}
                    onChange={(e) => setFormData(prev => ({ ...prev, required_team_size: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Direct Referrals</label>
                  <input
                    type="number"
                    value={formData.required_directs}
                    onChange={(e) => setFormData(prev => ({ ...prev, required_directs: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Reward ($)</label>
                <input
                  type="number"
                  value={formData.reward}
                  onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
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

export default AdminRanks;
