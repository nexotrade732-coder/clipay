import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Check, X } from 'lucide-react';

const AdminWithdrawals = () => {
  const toast = useToast();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const res = await api.get('/admin/withdrawals');
      setWithdrawals(res.data);
    } catch (e) {
      toast.error('Failed to load withdrawals');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setProcessing(id);
    try {
      await api.put(`/admin/withdrawals/${id}/approve`);
      toast.success('Withdrawal approved successfully');
      fetchWithdrawals();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to approve withdrawal');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id) => {
    setProcessing(id);
    try {
      await api.put(`/admin/withdrawals/${id}/reject`);
      toast.success('Withdrawal rejected and funds returned');
      fetchWithdrawals();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to reject withdrawal');
    } finally {
      setProcessing(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">Approved</span>;
      case 'rejected':
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 border border-red-200">Rejected</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');
  const processedWithdrawals = withdrawals.filter(w => w.status !== 'pending');

  return (
    <div className="max-w-7xl mx-auto space-y-6" data-testid="admin-withdrawals-page">
      {/* Pending Withdrawals */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Pending Withdrawals ({pendingWithdrawals.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Gateway</th>
                <th className="px-6 py-3">Wallet</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No pending withdrawals</td>
                </tr>
              ) : (
                pendingWithdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-900">{withdrawal.user_name}</p>
                        <p className="text-xs text-slate-500">{withdrawal.user_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">${withdrawal.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">{withdrawal.gateway}</td>
                    <td className="px-6 py-4 text-xs font-mono max-w-[150px] truncate">{withdrawal.wallet_address}</td>
                    <td className="px-6 py-4">{new Date(withdrawal.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleApprove(withdrawal.id)}
                        disabled={processing === withdrawal.id}
                        className="bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-emerald-200 hover:bg-emerald-100 transition-colors disabled:opacity-50"
                        data-testid={`approve-withdrawal-${withdrawal.id}`}
                      >
                        {processing === withdrawal.id ? <Loader2 className="w-3 h-3 animate-spin inline" /> : <Check className="w-3 h-3 inline mr-1" />}
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(withdrawal.id)}
                        disabled={processing === withdrawal.id}
                        className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        <X className="w-3 h-3 inline mr-1" />
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Processed Withdrawals */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200">
          <h3 className="text-base font-semibold text-slate-900">Processed Withdrawals</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-medium border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Gateway</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedWithdrawals.slice(0, 20).map((withdrawal) => (
                <tr key={withdrawal.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-slate-900">{withdrawal.user_name}</p>
                      <p className="text-xs text-slate-500">{withdrawal.user_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium">${withdrawal.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">{withdrawal.gateway}</td>
                  <td className="px-6 py-4">{new Date(withdrawal.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{getStatusBadge(withdrawal.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminWithdrawals;
