import React, { useState, useEffect } from 'react';
import { useAuth, api, useToast } from '@/lib/context';
import { Loader2, AlertCircle, Users } from 'lucide-react';

const UserWithdraw = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [gateway, setGateway] = useState('usdt_trc20');
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawals, setWithdrawals] = useState([]);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [withdrawalsRes, statsRes] = await Promise.all([
        api.get('/withdrawals/my'),
        api.get('/referrals/stats')
      ]);
      setWithdrawals(withdrawalsRes.data);
      setReferralCount(statsRes.data.direct_referrals);
      
      // Pre-fill wallet from user profile
      if (user?.usdt_wallet) setWalletAddress(user.usdt_wallet);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    if (!walletAddress) {
      toast.error('Please enter wallet/account details');
      return;
    }
    
    if (referralCount < 2) {
      toast.error('You need at least 2 direct referrals to withdraw');
      return;
    }

    setSubmitting(true);
    try {
      const gatewayName = gateway === 'usdt_trc20' ? 'USDT (TRC20)' : gateway === 'usdt_bep20' ? 'USDT (BEP20)' : 'JazzCash';
      await api.post('/withdrawals', {
        amount: parseFloat(amount),
        gateway: gatewayName,
        wallet_address: walletAddress
      });
      toast.success('Withdrawal request submitted! Awaiting admin approval.');
      setAmount('');
      await refreshUser();
      fetchData();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to submit withdrawal');
    } finally {
      setSubmitting(false);
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

  const canWithdraw = referralCount >= 2;

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="withdraw-page">
      {/* Withdraw Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Withdraw Funds</h2>
            <p className="text-sm text-slate-500 mt-1">Transfer earnings to your wallet.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-slate-500">Available Balance</p>
            <p className="text-2xl font-bold text-blue-600" data-testid="available-balance">
              ${user?.balance?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Referral Requirement Warning */}
        {!canWithdraw && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <Users className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-700 font-medium">Referral Requirement Not Met</p>
              <p className="text-xs text-amber-600">
                You need at least 2 direct referrals to withdraw. Current: {referralCount}/2
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Gateway Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Withdrawal Method</label>
            <select
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              data-testid="withdraw-gateway-select"
            >
              <option value="usdt_trc20">USDT (TRC20)</option>
              <option value="usdt_bep20">USDT (BEP20)</option>
              <option value="jazzcash">JazzCash</option>
            </select>
          </div>

          {/* Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {gateway === 'jazzcash' ? 'JazzCash Number' : 'Wallet Address'}
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder={gateway === 'jazzcash' ? '03XXXXXXXXX' : 'Enter your wallet address'}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              data-testid="wallet-address-input"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
              max={user?.balance || 0}
              step="0.01"
              placeholder="0.00"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              data-testid="withdraw-amount-input"
            />
            <p className="text-xs text-slate-500 mt-1">Minimum withdrawal: $10. A 2% fee will be applied.</p>
          </div>

          <button
            type="submit"
            disabled={submitting || !canWithdraw || (user?.balance || 0) < 10}
            className="w-full bg-slate-900 text-white font-medium rounded-xl text-sm px-5 py-3 hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="submit-withdraw-btn"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit Request
          </button>
        </form>
      </div>

      {/* Withdrawal History */}
      {withdrawals.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">Recent Withdrawals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Gateway</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.slice(0, 5).map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">{new Date(withdrawal.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">${withdrawal.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">{withdrawal.gateway}</td>
                    <td className="px-6 py-4">{getStatusBadge(withdrawal.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserWithdraw;
