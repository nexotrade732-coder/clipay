import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, ArrowUpRight, ArrowDownLeft, DollarSign, Award, Play, History } from 'lucide-react';

const UserHistory = () => {
  const toast = useToast();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'deposit': return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'withdrawal': return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case 'package_purchase': return <DollarSign className="w-4 h-4 text-blue-400" />;
      case 'watch_earning': return <Play className="w-4 h-4 text-purple-400" />;
      case 'commission': return <ArrowDownLeft className="w-4 h-4 text-emerald-400" />;
      case 'rank_bonus': return <Award className="w-4 h-4 text-orange-400" />;
      default: return <DollarSign className="w-4 h-4 text-slate-400" />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'deposit': return <span className="badge-success">Deposit</span>;
      case 'withdrawal': return <span className="badge-error">Withdrawal</span>;
      case 'package_purchase': return <span className="badge-info">Package</span>;
      case 'watch_earning': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-400 border border-purple-500/30">Earnings</span>;
      case 'commission': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">Commission</span>;
      case 'rank_bonus': return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-500/20 text-orange-400 border border-orange-500/30">Rank Bonus</span>;
      default: return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-500/20 text-slate-400 border border-slate-500/30">{type}</span>;
    }
  };

  const filteredTransactions = filter === 'all' 
    ? transactions 
    : transactions.filter(t => t.type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6" data-testid="history-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slideUp">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center">
            <History className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Transaction History</h2>
            <p className="text-sm text-slate-400">View all your platform transactions</p>
          </div>
        </div>
        
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-dark max-w-xs"
          data-testid="filter-select"
        >
          <option value="all">All Transactions</option>
          <option value="deposit">Deposits</option>
          <option value="withdrawal">Withdrawals</option>
          <option value="package_purchase">Packages</option>
          <option value="watch_earning">Earnings</option>
          <option value="commission">Commissions</option>
          <option value="rank_bonus">Rank Bonuses</option>
        </select>
      </div>

      {/* Transactions Table */}
      <div className="glass rounded-3xl overflow-hidden animate-slideUp">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 font-medium border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-slate-300 whitespace-nowrap">
                    {new Date(tx.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(tx.type)}
                      {getTypeBadge(tx.type)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-300 max-w-xs truncate">{tx.description}</td>
                  <td className={`px-6 py-4 font-semibold ${tx.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {tx.amount >= 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="badge-success">{tx.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTransactions.length === 0 && (
        <div className="glass rounded-3xl p-12 text-center">
          <DollarSign className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No transactions found.</p>
        </div>
      )}
    </div>
  );
};

export default UserHistory;
