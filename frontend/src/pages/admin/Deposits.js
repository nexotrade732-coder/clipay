import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Check, X, ArrowDownLeft, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDeposits = () => {
  const toast = useToast();
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const res = await api.get('/admin/deposits');
      setDeposits(res.data);
    } catch (e) {
      toast.error('Failed to load deposits');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      await api.put(`/admin/deposits/${id}/approve`);
      toast.success('Deposit approved successfully');
      fetchDeposits();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to approve deposit');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    setProcessing(id);
    try {
      await api.put(`/admin/deposits/${id}/reject`);
      toast.success('Deposit rejected');
      fetchDeposits();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to reject deposit');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3" />Approved</span>;
      case 'rejected':
        return <span className="badge-error flex items-center gap-1"><X className="w-3 h-3" />Rejected</span>;
      default:
        return <span className="badge-warning flex items-center gap-1"><Clock className="w-3 h-3" />Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const processedDeposits = deposits.filter(d => d.status !== 'pending');

  return (
    <div className="max-w-7xl mx-auto space-y-6" data-testid="admin-deposits-page">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-cyan-600/20"></div>
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl icon-box-emerald flex items-center justify-center">
              <ArrowDownLeft className="w-7 h-7 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Deposit Management</h2>
              <p className="text-slate-400 text-sm mt-1">Review and process deposit requests</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 card-hover"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl icon-box-amber flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">{pendingDeposits.length}</p>
              <p className="text-xs text-slate-400">Pending</p>
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
            <div className="w-10 h-10 rounded-xl icon-box-emerald flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">{processedDeposits.filter(d => d.status === 'approved').length}</p>
              <p className="text-xs text-slate-400">Approved</p>
            </div>
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-5 card-hover"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl icon-box-red flex items-center justify-center">
              <X className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-red-400">{processedDeposits.filter(d => d.status === 'rejected').length}</p>
              <p className="text-xs text-slate-400">Rejected</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Pending Deposits */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-3xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl icon-box-amber flex items-center justify-center">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">Pending Deposits</h3>
              <p className="text-xs text-slate-400">{pendingDeposits.length} awaiting review</p>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Gateway</th>
                <th className="px-6 py-4">TXID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {pendingDeposits.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-emerald-400" />
                        </div>
                        <p className="text-slate-400">No pending deposits</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  pendingDeposits.map((deposit, index) => (
                    <motion.tr 
                      key={deposit.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-white">{deposit.user_name}</p>
                          <p className="text-xs text-slate-500">{deposit.user_email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-bold text-emerald-400">${deposit.amount.toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-lg bg-slate-700/50 text-slate-300 text-xs font-medium">
                          {deposit.gateway}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-slate-400">{deposit.txid || '-'}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-400">
                        {new Date(deposit.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleApprove(deposit.id)}
                            disabled={processing === deposit.id}
                            className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30 hover:bg-emerald-500/30 transition-all disabled:opacity-50 flex items-center gap-1.5"
                            data-testid={`approve-deposit-${deposit.id}`}
                          >
                            {processing === deposit.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(deposit.id)}
                            disabled={processing === deposit.id}
                            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/30 hover:bg-red-500/30 transition-all disabled:opacity-50 flex items-center gap-1.5"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
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

      {/* Processed Deposits */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white">Transaction History</h3>
          <p className="text-xs text-slate-400">Recent processed deposits</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Gateway</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {processedDeposits.slice(0, 20).map((deposit, index) => (
                <motion.tr 
                  key={deposit.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.03 }}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{deposit.user_name}</p>
                      <p className="text-xs text-slate-500">{deposit.user_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">${deposit.amount.toFixed(2)}</td>
                  <td className="px-6 py-4 text-slate-400">{deposit.gateway}</td>
                  <td className="px-6 py-4 text-slate-400">{new Date(deposit.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{getStatusBadge(deposit.status)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDeposits;
