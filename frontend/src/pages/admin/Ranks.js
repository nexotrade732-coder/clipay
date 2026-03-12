import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Plus, Edit, Trash2, X, Award, Trophy, Crown, Star, Medal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

  const getRankIcon = (name) => {
    const lowerName = name?.toLowerCase() || '';
    if (lowerName.includes('diamond') || lowerName.includes('vip')) return <Crown className="w-8 h-8" />;
    if (lowerName.includes('platinum') || lowerName.includes('elite')) return <Trophy className="w-8 h-8" />;
    if (lowerName.includes('gold')) return <Medal className="w-8 h-8" />;
    if (lowerName.includes('silver')) return <Star className="w-8 h-8" />;
    return <Award className="w-8 h-8" />;
  };

  const getRankGradient = (index) => {
    const gradients = [
      { bg: 'from-amber-500/20 to-yellow-500/10', border: 'border-amber-500/30', text: 'text-amber-400', icon: 'from-amber-500 to-yellow-500' },
      { bg: 'from-slate-400/20 to-slate-300/10', border: 'border-slate-400/30', text: 'text-slate-300', icon: 'from-slate-400 to-slate-300' },
      { bg: 'from-purple-500/20 to-pink-500/10', border: 'border-purple-500/30', text: 'text-purple-400', icon: 'from-purple-500 to-pink-500' },
      { bg: 'from-cyan-500/20 to-blue-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', icon: 'from-cyan-500 to-blue-500' },
    ];
    return gradients[index % gradients.length];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6" data-testid="admin-ranks-page">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl icon-box-amber flex items-center justify-center">
            <Award className="w-7 h-7 text-amber-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Leadership Ranks</h2>
            <p className="text-slate-400 text-sm">Configure achievement ranks and rewards</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="btn-primary flex items-center gap-2"
          data-testid="add-rank-btn"
        >
          <Plus className="w-5 h-5" /> Add Rank
        </motion.button>
      </motion.div>

      {/* Ranks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {ranks.map((rank, index) => {
            const style = getRankGradient(index);
            return (
              <motion.div
                key={rank.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                className={`glass rounded-3xl p-6 relative overflow-hidden card-hover group`}
              >
                {/* Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${style.bg} opacity-50`}></div>
                <div className="absolute inset-0 grid-bg opacity-20"></div>
                
                {/* Action buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button
                    onClick={() => handleEdit(rank)}
                    className="p-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(rank.id)}
                    className="p-2 rounded-xl bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="relative z-10 text-center">
                  {/* Icon */}
                  <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${style.bg} ${style.border} border flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                    <span className={style.text}>{getRankIcon(rank.name)}</span>
                  </div>
                  
                  {/* Name */}
                  <h3 className={`text-xl font-bold ${style.text} mb-2`}>{rank.name}</h3>
                  
                  {/* Reward */}
                  <div className="mb-6">
                    <span className="text-3xl font-bold text-white">${rank.reward}</span>
                    <span className="text-sm text-slate-400 ml-1">reward</span>
                  </div>
                  
                  {/* Requirements */}
                  <div className="space-y-3">
                    <div className="glass-light rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-1">Team Size Required</p>
                      <p className="text-lg font-bold text-white">{rank.required_team_size} members</p>
                    </div>
                    <div className="glass-light rounded-xl p-3">
                      <p className="text-xs text-slate-400 mb-1">Direct Referrals Required</p>
                      <p className="text-lg font-bold text-white">{rank.required_directs} directs</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {ranks.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-3xl p-12 text-center"
        >
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-amber-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No ranks configured</h3>
          <p className="text-slate-400 mb-6">Create leadership ranks to reward your top performers</p>
          <button onClick={handleAdd} className="btn-primary">
            <Plus className="w-4 h-4 mr-2 inline" /> Create First Rank
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
                  <div className="w-10 h-10 rounded-xl icon-box-amber flex items-center justify-center">
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {modal === 'add' ? 'Create New Rank' : 'Edit Rank'}
                  </h3>
                </div>
                <button onClick={() => setModal(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Rank Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="input-dark"
                    placeholder="e.g., Gold, Platinum, Diamond"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Team Size Required</label>
                    <input
                      type="number"
                      value={formData.required_team_size}
                      onChange={(e) => setFormData(prev => ({ ...prev, required_team_size: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Direct Referrals</label>
                    <input
                      type="number"
                      value={formData.required_directs}
                      onChange={(e) => setFormData(prev => ({ ...prev, required_directs: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Reward Amount ($)</label>
                  <input
                    type="number"
                    value={formData.reward}
                    onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
                    className="input-dark"
                    placeholder="Bonus paid on rank achievement"
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
                  {modal === 'add' ? 'Create Rank' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminRanks;
