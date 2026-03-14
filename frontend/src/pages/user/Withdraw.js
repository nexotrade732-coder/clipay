import React, { useState, useEffect } from 'react';
import { useAuth, api, useToast } from '@/lib/context';
import { Loader2, AlertCircle, Users, ArrowUpRight, Wallet, Calculator, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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
  const [exchangeRate, setExchangeRate] = useState(300);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [withdrawalsRes, statsRes, settingsRes] = await Promise.all([
        api.get('/withdrawals/my'),
        api.get('/referrals/stats'),
        api.get('/deposits/settings')
      ]);
      setWithdrawals(withdrawalsRes.data);
      setReferralCount(statsRes.data.direct_referrals);
      setExchangeRate(settingsRes.data.usd_to_pkr_rate || 300);
      
      if (user?.usdt_wallet) setWalletAddress(user.usdt_wallet);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const pkrAmount = amount ? (parseFloat(amount) * exchangeRate).toFixed(0) : 0;
  const feeAmount = amount ? (parseFloat(amount) * 0.02).toFixed(2) : 0;
  const netAmount = amount ? (parseFloat(amount) - parseFloat(feeAmount)).toFixed(2) : 0;
  const netPkrAmount = amount ? (parseFloat(netAmount) * exchangeRate).toFixed(0) : 0;

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
      case 'approved': return <span className="badge-success">Approved</span>;
      case 'rejected': return <span className="badge-error">Rejected</span>;
      default: return <span className="badge-warning">Pending</span>;
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
      <div className="glass rounded-3xl p-6 sm:p-8 animate-slideUp">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/20 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Withdraw Funds</h2>
              <p className="text-sm text-slate-400">Transfer earnings to your wallet</p>
            </div>
          </div>
          <div className="glass-light rounded-xl px-4 py-2 text-center">
            <p className="text-xs text-slate-400">Available Balance</p>
            <p className="text-xl font-bold text-white" data-testid="available-balance">
              ${user?.balance?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>

        {/* Referral Requirement Warning */}
        {!canWithdraw && (
          <div className="mb-6 glass-light rounded-2xl p-4 flex items-start gap-3 border border-amber-500/30">
            <Users className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-400 font-medium">Referral Requirement Not Met</p>
              <p className="text-xs text-slate-400">
                You need at least 2 direct referrals to withdraw. Current: {referralCount}/2
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Gateway Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Withdrawal Method</label>
            <select
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
              className="input-dark"
              data-testid="withdraw-gateway-select"
            >
              <option value="usdt_trc20">USDT (TRC20)</option>
              <option value="usdt_bep20">USDT (BEP20)</option>
              <option value="jazzcash">JazzCash</option>
            </select>
          </div>

          {/* Wallet Address */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {gateway === 'jazzcash' ? 'JazzCash Number' : 'Wallet Address'}
            </label>
            <input
              type="text"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              placeholder={gateway === 'jazzcash' ? '03XXXXXXXXX' : 'Enter your wallet address'}
              className="input-dark"
              data-testid="wallet-address-input"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10"
              max={user?.balance || 0}
              step="0.01"
              placeholder="0.00"
              className="input-dark"
              data-testid="withdraw-amount-input"
            />
            <p className="text-xs text-slate-500 mt-1.5">Minimum withdrawal: $10. A 2% fee will be applied.</p>
          </div>

          {/* Currency Conversion Summary */}
          {amount && parseFloat(amount) > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30"
            >
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">Currency Conversion</span>
              </div>
              <div className="space-y-3">
                {/* Gross Amount */}
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-xl font-bold text-white">${parseFloat(amount).toFixed(2)}</p>
                    <p className="text-xs text-slate-400">Requested (USD)</p>
                  </div>
                  <div className="flex items-center gap-2 px-4">
                    <ArrowRight className="w-5 h-5 text-purple-400" />
                    <span className="text-xs text-slate-500">@ {exchangeRate} PKR</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xl font-bold text-purple-400">PKR {parseInt(pkrAmount).toLocaleString()}</p>
                    <p className="text-xs text-slate-400">Gross (PKR)</p>
                  </div>
                </div>
                
                {/* Fee & Net */}
                <div className="pt-3 border-t border-white/10">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Fee (2%)</span>
                    <span className="text-red-400">-${feeAmount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">You'll receive</span>
                    <span className="text-emerald-400 font-semibold">${netAmount} ≈ PKR {parseInt(netPkrAmount).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={submitting || !canWithdraw || (user?.balance || 0) < 10}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="submit-withdraw-btn"
          >
            {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
            Submit Request
          </button>
        </form>
      </div>

      {/* Withdrawal History */}
      {withdrawals.length > 0 && (
        <div className="glass rounded-3xl overflow-hidden animate-slideUp">
          <div className="px-6 py-5 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Recent Withdrawals</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 font-medium border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount (USD)</th>
                  <th className="px-6 py-4">Amount (PKR)</th>
                  <th className="px-6 py-4">Gateway</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {withdrawals.slice(0, 5).map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-slate-300">{new Date(withdrawal.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-white">${withdrawal.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-purple-400">PKR {(withdrawal.amount * exchangeRate).toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-300">{withdrawal.gateway}</td>
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
