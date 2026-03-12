import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Plus, Edit, Trash2, X, Link2, Youtube, Instagram, Facebook, Globe } from 'lucide-react';

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
      case 'youtube': return <Youtube className="w-4 h-4 text-red-500" />;
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'facebook': return <Facebook className="w-4 h-4 text-blue-600" />;
      default: return <Globe className="w-4 h-4 text-slate-500" />;
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
    <div className="max-w-7xl mx-auto space-y-6" data-testid="admin-links-page">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Daily Links/Ads</h3>
          <button
            onClick={handleAdd}
            className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2"
            data-testid="add-link-btn"
          >
            <Plus className="w-4 h-4" /> Add Link
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">URL</th>
                <th className="px-6 py-3">Platform</th>
                <th className="px-6 py-3">Earning</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {links.map((link) => (
                <tr key={link.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4 font-medium text-slate-900">{link.title}</td>
                  <td className="px-6 py-4">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-xs truncate max-w-[200px] block">
                      {link.url}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <span className="flex items-center gap-1.5">
                      {getPlatformIcon(link.platform)}
                      {link.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-emerald-600">${link.earning?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggle(link)}
                      className={`px-2 py-0.5 rounded text-xs font-medium border ${
                        link.is_active 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-50 text-slate-500 border-slate-200'
                      }`}
                    >
                      {link.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <button onClick={() => handleEdit(link)} className="text-blue-500 hover:text-blue-700 p-1">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(link.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md animate-slideUp">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {modal === 'add' ? 'Add Link' : 'Edit Link'}
              </h3>
              <button onClick={() => setModal(null)} className="p-1 hover:bg-slate-100 rounded-lg">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  placeholder="e.g., Product Review"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">URL</label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Platform</label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData(prev => ({ ...prev, platform: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Facebook">Facebook</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Earning ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.earning}
                    onChange={(e) => setFormData(prev => ({ ...prev, earning: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500"
                  />
                </div>
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

export default AdminLinks;
