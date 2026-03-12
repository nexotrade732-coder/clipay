import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Copy, AlertCircle, ArrowDownLeft, Wallet } from 'lucide-react';

const UserDeposit = () => {
  const toast = useToast();
  const [gateway, setGateway] = useState('usdt_trc20');
  const [amount, setAmount] = useState('');
  const [txid, setTxid] = useState('');
  const [settings, setSettings] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, depositsRes] = await Promise.all([
        api.get('/deposits/settings'),
        api.get('/deposits/my')
      ]);
      setSettings(settingsRes.data);
      setDeposits(depositsRes.data);
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

    setSubmitting(true);
    try {
      const gatewayName = gateway === 'usdt_trc20' ? 'USDT (TRC20)' : gateway === 'usdt_bep20' ? 'USDT (BEP20)' : 'JazzCash';
      await api.post('/deposits', {
        amount: parseFloat(amount),
        gateway: gatewayName,
        txid: txid || null
      });
      toast.success('Deposit request submitted! Awaiting admin approval.');
      setAmount('');
      setTxid('');
      fetchData();
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to submit deposit');
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getPaymentAddress = () => {
    switch (gateway) {
      case 'usdt_trc20': return settings?.usdt_address_trc20;
      case 'usdt_bep20': return settings?.usdt_address_bep20;
      case 'jazzcash': return settings?.jazzcash_number;
      default: return null;
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

  const paymentAddress = getPaymentAddress();

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="deposit-page">
      {/* Deposit Form */}
      <div className="glass rounded-3xl p-6 sm:p-8 animate-slideUp">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border border-emerald-500/20 flex items-center justify-center">
            <ArrowDownLeft className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Deposit Funds</h2>
            <p className="text-sm text-slate-400">Add funds to purchase packages</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Gateway Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Payment Method</label>
            <select
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
              className="input-dark"
              data-testid="gateway-select"
            >
              <option value="usdt_trc20">USDT (TRC20)</option>
              <option value="usdt_bep20">USDT (BEP20)</option>
              <option value="jazzcash">JazzCash</option>
            </select>
          </div>

          {/* Payment Address */}
          {paymentAddress ? (
            <div className="glass-light rounded-2xl p-4">
              <p className="text-sm font-medium text-slate-300 mb-2">
                {gateway === 'jazzcash' ? 'JazzCash Number' : 'Wallet Address'}
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm text-white bg-slate-800/50 px-4 py-3 rounded-xl border border-white/10 font-mono break-all">
                  {paymentAddress}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(paymentAddress)}
                  className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                  data-testid="copy-address-btn"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
              {gateway === 'jazzcash' && settings?.jazzcash_name && (
                <p className="text-sm text-slate-400 mt-2">Account Name: {settings.jazzcash_name}</p>
              )}
            </div>
          ) : (
            <div className="glass-light rounded-2xl p-4 flex items-start gap-3 border border-amber-500/30">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-400 font-medium">Payment address not configured</p>
                <p className="text-xs text-slate-400">Please contact admin to set up payment details.</p>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              placeholder="100.00"
              className="input-dark"
              data-testid="amount-input"
            />
          </div>

          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Transaction ID / Reference {gateway === 'jazzcash' && '(TID)'}
            </label>
            <input
              type="text"
              value={txid}
              onChange={(e) => setTxid(e.target.value)}
              placeholder={gateway === 'jazzcash' ? 'Enter TID from JazzCash' : 'Enter transaction hash'}
              className="input-dark"
              data-testid="txid-input"
            />
            <p className="text-xs text-slate-500 mt-1.5">Enter after making the payment</p>
          </div>

          <button
            type="submit"
            disabled={submitting || !paymentAddress}
            className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="submit-deposit-btn"
          >
            {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
            Submit Deposit Request
          </button>
        </form>
      </div>

      {/* Deposit History */}
      {deposits.length > 0 && (
        <div className="glass rounded-3xl overflow-hidden animate-slideUp">
          <div className="px-6 py-5 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Recent Deposits</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-800/50 text-xs uppercase text-slate-400 font-medium border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Gateway</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {deposits.slice(0, 5).map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-slate-300">{new Date(deposit.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-white">${deposit.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-slate-300">{deposit.gateway}</td>
                    <td className="px-6 py-4">{getStatusBadge(deposit.status)}</td>
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

export default UserDeposit;
