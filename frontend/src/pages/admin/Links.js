import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Plus, Edit, Trash2, X, Link2, Youtube, Instagram, Facebook, Globe, Play, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminLinks = () => {
  const toast = useToast();
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    platform: 'YouTube',
    earning: ''
  });

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await api.get('/admin/links');
      setLinks(res.data);
    } catch (e) {
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setFormData({
      title: '',
      url: '',
      platform: 'YouTube',
      earning: ''
    });
    setModal('add');
  };

  const handleEdit = (link) => {
    setFormData({
      title: link.title,
      url: link.url,
      platform: link.platform,
      earning: link.earning
    });
    setModal(link.id);
  };

  const handleSubmit = async () => {
    try {
      if (modal === 'add') {
        await api.post('/admin/links', {
          ...formData,
          earning: parseFloat(formData.earning)
        });
        toast.success('Link created successfully');
      } else {
        await api.put(`/admin/links/${modal}`, {
          ...formData,
          earning: parseFloat(formData.earning)
        });
        toast.success('Link updated successfully');
      }
      setModal(null);
      fetchLinks();
    } catch (e) {
      toast.error('Failed to save link');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    try {
      await api.delete(`/admin/links/${id}`);
      toast.success('Link deleted');
      fetchLinks();
    } catch (e) {
      toast.error('Failed to delete link');
    }
  };

  const handleToggle = async (link) => {
    try {
      await api.put(`/admin/links/${link.id}`, { is_active: !link.is_active });
      toast.success(`Link ${link.is_active ? 'deactivated' : 'activated'}`);
      fetchLinks();
    } catch (e) {
      toast.error('Failed to update link');
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'youtube': return <Youtube className="w-5 h-5 text-red-500" />;
      case 'instagram': return <Instagram className="w-5 h-5 text-pink-500" />;
      case 'facebook': return <Facebook className="w-5 h-5 text-blue-500" />;
      case 'tiktok': return <Play className="w-5 h-5 text-purple-500" />;
      default: return <Globe className="w-5 h-5 text-slate-400" />;
    }
  };

  const getPlatformColor = (platform) => {
    switch (platform?.toLowerCase()) {
      case 'youtube': return 'from-red-500/20 to-red-600/10 border-red-500/30';
      case 'instagram': return 'from-pink-500/20 to-purple-600/10 border-pink-500/30';
      case 'facebook': return 'from-blue-500/20 to-blue-600/10 border-blue-500/30';
      case 'tiktok': return 'from-purple-500/20 to-pink-600/10 border-purple-500/30';
      default: return 'from-slate-500/20 to-slate-600/10 border-slate-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  const activeLinks = links.filter(l => l.is_active);
  const inactiveLinks = links.filter(l => !l.is_active);

  return (
    <div className="max-w-7xl mx-auto space-y-6" data-testid="admin-links-page">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl icon-box-purple flex items-center justify-center">
              <Link2 className="w-7 h-7 text-purple-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Watch Links</h2>
              <p className="text-slate-400 text-sm mt-1">Manage daily video links for users</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleAdd}
            className="btn-primary flex items-center gap-2"
            data-testid="add-link-btn"
          >
            <Plus className="w-5 h-5" /> Add Link
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 card-hover"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl icon-box-emerald flex items-center justify-center">
              <Eye className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{activeLinks.length}</p>
              <p className="text-xs text-slate-400">Active Links</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-5 card-hover"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl icon-box-amber flex items-center justify-center">
              <EyeOff className="w-5 h-5 text-slate-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-400">{inactiveLinks.length}</p>
              <p className="text-xs text-slate-400">Inactive Links</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Links Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-3xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">All Links</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Title</th>
                <th className="px-6 py-4">Platform</th>
                <th className="px-6 py-4">URL</th>
                <th className="px-6 py-4">Earning</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {links.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                          <Link2 className="w-8 h-8 text-purple-400" />
                        </div>
                        <p className="text-slate-400">No links configured</p>
                        <button onClick={handleAdd} className="btn-primary text-sm">Add First Link</button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  links.map((link, index) => (
                    <motion.tr 
                      key={link.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.03 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-white">{link.title}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r ${getPlatformColor(link.platform)} border`}>
                          {getPlatformIcon(link.platform)}
                          <span className="text-sm text-white">{link.platform}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <a 
                          href={link.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-400 hover:text-blue-300 text-xs truncate max-w-[180px] block transition-colors"
                        >
                          {link.url}
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-emerald-400">${link.earning?.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggle(link)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                            link.is_active 
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/30' 
                              : 'bg-slate-500/20 text-slate-400 border-slate-500/30 hover:bg-slate-500/30'
                          }`}
                        >
                          {link.is_active ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(link)} 
                            className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(link.id)} 
                            className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>

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
                    <Link2 className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white">
                    {modal === 'add' ? 'Add New Link' : 'Edit Link'}
                  </h3>
                </div>
                <button onClick={() => setModal(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-dark"
                    placeholder="e.g., Product Review Video"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Video URL</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    className="input-dark"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Platform</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                      className="input-dark"
                    >
                      <option value="YouTube">YouTube</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="TikTok">TikTok</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Earning ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.earning}
                      onChange={(e) => setFormData(prev => ({ ...prev, earning: e.target.value }))}
                      className="input-dark"
                    />
                  </div>
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
                  {modal === 'add' ? 'Create Link' : 'Save Changes'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLinks;
