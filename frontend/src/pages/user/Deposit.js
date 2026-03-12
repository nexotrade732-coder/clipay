import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Copy, AlertCircle } from 'lucide-react';

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
      case 'usdt_trc20':
        return settings?.usdt_address_trc20;
      case 'usdt_bep20':
        return settings?.usdt_address_bep20;
      case 'jazzcash':
        return settings?.jazzcash_number;
      default:
        return null;
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

  const paymentAddress = getPaymentAddress();

  return (
    <div className="max-w-3xl mx-auto space-y-6" data-testid="deposit-page">
      {/* Deposit Form */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="mb-8 pb-6 border-b border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900">Deposit Funds</h2>
          <p className="text-sm text-slate-500 mt-1">Add funds to your account to purchase packages.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Gateway Selection */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Payment Method</label>
            <select
              value={gateway}
              onChange={(e) => setGateway(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              data-testid="gateway-select"
            >
              <option value="usdt_trc20">USDT (TRC20)</option>
              <option value="usdt_bep20">USDT (BEP20)</option>
              <option value="jazzcash">JazzCash</option>
            </select>
          </div>

          {/* Payment Address */}
          {paymentAddress ? (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
              <p className="text-sm font-medium text-slate-700 mb-2">
                {gateway === 'jazzcash' ? 'JazzCash Number' : 'Wallet Address'}
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm text-slate-900 bg-white px-3 py-2 rounded-lg border border-slate-200 font-mono break-all">
                  {paymentAddress}
                </code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(paymentAddress)}
                  className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
                  data-testid="copy-address-btn"
                >
                  <Copy className="w-4 h-4 text-slate-600" />
                </button>
              </div>
              {gateway === 'jazzcash' && settings?.jazzcash_name && (
                <p className="text-sm text-slate-500 mt-2">Account Name: {settings.jazzcash_name}</p>
              )}
            </div>
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-700 font-medium">Payment address not configured</p>
                <p className="text-xs text-amber-600">Please contact admin to set up payment details.</p>
              </div>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Amount (USD)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              step="0.01"
              placeholder="100.00"
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              data-testid="amount-input"
            />
          </div>

          {/* Transaction ID */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Transaction ID / Reference {gateway === 'jazzcash' && '(TID)'}
            </label>
            <input
              type="text"
              value={txid}
              onChange={(e) => setTxid(e.target.value)}
              placeholder={gateway === 'jazzcash' ? 'Enter TID from JazzCash' : 'Enter transaction hash'}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
              data-testid="txid-input"
            />
            <p className="text-xs text-slate-500 mt-1">Enter after making the payment</p>
          </div>

          <button
            type="submit"
            disabled={submitting || !paymentAddress}
            className="w-full bg-slate-900 text-white font-medium rounded-xl text-sm px-5 py-3 hover:bg-slate-800 transition-colors shadow-sm mt-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="submit-deposit-btn"
          >
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Submit Deposit Request
          </button>
        </form>
      </div>

      {/* Deposit History */}
      {deposits.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-200">
            <h3 className="text-base font-semibold text-slate-900">Recent Deposits</h3>
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
                {deposits.slice(0, 5).map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">{new Date(deposit.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">${deposit.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">{deposit.gateway}</td>
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
