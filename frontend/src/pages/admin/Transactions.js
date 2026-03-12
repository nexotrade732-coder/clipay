import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, ArrowUpRight, ArrowDownLeft, DollarSign, Award, Play, Filter, History } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminTransactions = () => {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/admin/transactions');
      setTransactions(res.data);
    } catch (e) {
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    const iconClass = "w-4 h-4";
    switch (type) {
      case 'deposit': return <ArrowDownLeft className={`${iconClass} text-emerald-400`} />;
      case 'withdrawal': return <ArrowUpRight className={`${iconClass} text-red-400`} />;
      case 'package_purchase': return <DollarSign className={`${iconClass} text-blue-400`} />;
      case 'watch_earning': return <Play className={`${iconClass} text-purple-400`} />;
      case 'commission': return <ArrowDownLeft className={`${iconClass} text-cyan-400`} />;
      case 'rank_bonus': return <Award className={`${iconClass} text-amber-400`} />;
      default: return <DollarSign className={`${iconClass} text-slate-400`} />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'deposit': return <span className="badge-success">Deposit</span>;
      case 'withdrawal': return <span className="badge-error">Withdrawal</span>;
      case 'package_purchase': return <span className="badge-info">Package</span>;
      case 'watch_earning': return <span className="badge-purple">Earnings</span>;
      case 'commission': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">Commission</span>;
      case 'rank_bonus': return <span className="badge-warning">Rank Bonus</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">{type}</span>;
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  // Calculate stats
  const totalDeposits = transactions.filter(t => t.type === 'deposit').reduce((sum, t) => sum + t.amount, 0);
  const totalWithdrawals = transactions.filter(t => t.type === 'withdrawal').reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalEarnings = transactions.filter(t => ['watch_earning', 'commission', 'rank_bonus'].includes(t.type)).reduce((sum, t) => sum + t.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6" data-testid="admin-transactions-page">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="absolute inset-0 grid-bg opacity-30"></div>
        <div className="relative p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl icon-box-blue flex items-center justify-center">
              <History className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Transaction History</h2>
              <p className="text-slate-400 text-sm mt-1">View all platform transactions</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-2xl p-5 card-hover"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl icon-box-emerald flex items-center justify-center">
              <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-400">${totalDeposits.toFixed(2)}</p>
              <p className="text-xs text-slate-400">Total Deposits</p>
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
            <div className="w-10 h-10 rounded-xl icon-box-red flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-red-400">${totalWithdrawals.toFixed(2)}</p>
              <p className="text-xs text-slate-400">Total Withdrawals</p>
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
            <div className="w-10 h-10 rounded-xl icon-box-purple flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-purple-400">${totalEarnings.toFixed(2)}</p>
              <p className="text-xs text-slate-400">User Earnings</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Transactions Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-3xl overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h3 className="text-lg font-semibold text-white">All Transactions</h3>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-dark py-2 text-sm w-auto"
              data-testid="filter-select"
            >
              <option value="all">All Types</option>
              <option value="deposit">Deposits</option>
              <option value="withdrawal">Withdrawals</option>
              <option value="package_purchase">Packages</option>
              <option value="watch_earning">Earnings</option>
              <option value="commission">Commissions</option>
              <option value="rank_bonus">Rank Bonuses</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-2xl bg-slate-700/50 flex items-center justify-center">
                          <History className="w-8 h-8 text-slate-500" />
                        </div>
                        <p className="text-slate-400">No transactions found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.slice(0, 100).map((tx, index) => (
                    <motion.tr 
                      key={tx.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.02 }}
                      className="hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-mono text-slate-400 bg-slate-800/50 px-2 py-1 rounded">
                          {tx.user_id?.slice(0, 8)}...
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                            {getTypeIcon(tx.type)}
                          </div>
                          {getTypeBadge(tx.type)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-400 max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${tx.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                          {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="badge-success">{tx.status}</span>
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminTransactions;
