import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Loader2, Copy, AlertCircle, ArrowDownLeft, QrCode, CheckCircle, Calculator, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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

  const getPaymentDetails = () => {
    switch (gateway) {
      case 'usdt_trc20': 
        return {
          address: settings?.usdt_address_trc20,
          qr: settings?.usdt_qr_trc20,
          network: 'TRC20 (TRON Network)',
          color: 'from-red-500/20 to-red-600/10',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-400'
        };
      case 'usdt_bep20': 
        return {
          address: settings?.usdt_address_bep20,
          qr: settings?.usdt_qr_bep20,
          network: 'BEP20 (BSC Network)',
          color: 'from-amber-500/20 to-amber-600/10',
          borderColor: 'border-amber-500/30',
          textColor: 'text-amber-400'
        };
      case 'jazzcash': 
        return {
          address: settings?.jazzcash_number,
          qr: settings?.jazzcash_qr,
          network: 'JazzCash Mobile',
          accountName: settings?.jazzcash_name,
          color: 'from-pink-500/20 to-pink-600/10',
          borderColor: 'border-pink-500/30',
          textColor: 'text-pink-400'
        };
      default: 
        return null;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved': return <span className="badge-success flex items-center gap-1"><CheckCircle className="w-3 h-3" />Approved</span>;
      case 'rejected': return <span className="badge-error">Rejected</span>;
      default: return <span className="badge-warning">Pending</span>;
    }
  };

  const exchangeRate = settings?.usd_to_pkr_rate || 300;
  const pkrAmount = amount ? (parseFloat(amount) * exchangeRate).toFixed(0) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  const paymentDetails = getPaymentDetails();

  return (
    <div className="max-w-4xl mx-auto space-y-6" data-testid="deposit-page">
      {/* Header */}
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
              <h2 className="text-2xl font-bold text-white">Deposit Funds</h2>
              <p className="text-slate-400 text-sm mt-1">Add funds to purchase packages</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Payment Method Selection */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-6"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>
          
          <div className="space-y-3">
            {/* USDT TRC20 */}
            <label className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
              gateway === 'usdt_trc20' 
                ? 'bg-red-500/10 border-red-500/30' 
                : 'bg-slate-800/30 border-white/5 hover:border-white/10'
            }`}>
              <input
                type="radio"
                name="gateway"
                value="usdt_trc20"
                checked={gateway === 'usdt_trc20'}
                onChange={(e) => setGateway(e.target.value)}
                className="sr-only"
              />
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                gateway === 'usdt_trc20' ? 'bg-red-500/20' : 'bg-slate-700/50'
              }`}>
                <span className="text-sm font-bold text-red-400">TRC</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">USDT (TRC20)</p>
                <p className="text-xs text-slate-400">TRON Network</p>
              </div>
              {gateway === 'usdt_trc20' && (
                <CheckCircle className="w-5 h-5 text-red-400" />
              )}
            </label>

            {/* USDT BEP20 */}
            <label className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
              gateway === 'usdt_bep20' 
                ? 'bg-amber-500/10 border-amber-500/30' 
                : 'bg-slate-800/30 border-white/5 hover:border-white/10'
            }`}>
              <input
                type="radio"
                name="gateway"
                value="usdt_bep20"
                checked={gateway === 'usdt_bep20'}
                onChange={(e) => setGateway(e.target.value)}
                className="sr-only"
              />
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                gateway === 'usdt_bep20' ? 'bg-amber-500/20' : 'bg-slate-700/50'
              }`}>
                <span className="text-sm font-bold text-amber-400">BEP</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">USDT (BEP20)</p>
                <p className="text-xs text-slate-400">Binance Smart Chain</p>
              </div>
              {gateway === 'usdt_bep20' && (
                <CheckCircle className="w-5 h-5 text-amber-400" />
              )}
            </label>

            {/* JazzCash */}
            <label className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${
              gateway === 'jazzcash' 
                ? 'bg-pink-500/10 border-pink-500/30' 
                : 'bg-slate-800/30 border-white/5 hover:border-white/10'
            }`}>
              <input
                type="radio"
                name="gateway"
                value="jazzcash"
                checked={gateway === 'jazzcash'}
                onChange={(e) => setGateway(e.target.value)}
                className="sr-only"
              />
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                gateway === 'jazzcash' ? 'bg-pink-500/20' : 'bg-slate-700/50'
              }`}>
                <span className="text-sm font-bold text-pink-400">JC</span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-white">JazzCash</p>
                <p className="text-xs text-slate-400">Local Mobile Payment</p>
              </div>
              {gateway === 'jazzcash' && (
                <CheckCircle className="w-5 h-5 text-pink-400" />
              )}
            </label>
          </div>
        </motion.div>

        {/* Payment Details Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`glass rounded-3xl p-6 border ${paymentDetails?.borderColor || 'border-white/10'}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <QrCode className={`w-5 h-5 ${paymentDetails?.textColor || 'text-slate-400'}`} />
            <h3 className="text-lg font-semibold text-white">Payment Details</h3>
          </div>
          
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${paymentDetails?.textColor} bg-gradient-to-r ${paymentDetails?.color}`}>
            {paymentDetails?.network}
          </div>

          {paymentDetails?.address ? (
            <div className="space-y-4">
              {/* QR Code */}
              {paymentDetails?.qr && (
                <div className="flex justify-center">
                  <div className="p-3 bg-white rounded-2xl shadow-lg">
                    <img 
                      src={paymentDetails.qr} 
                      alt="Payment QR Code" 
                      className="w-48 h-48 object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Address/Number */}
              <div>
                <p className="text-sm text-slate-400 mb-2">
                  {gateway === 'jazzcash' ? 'JazzCash Number' : 'Wallet Address'}
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-white bg-slate-800/70 px-4 py-3 rounded-xl border border-white/10 font-mono break-all">
                    {paymentDetails.address}
                  </code>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(paymentDetails.address)}
                    className={`p-3 rounded-xl ${paymentDetails?.textColor} bg-gradient-to-r ${paymentDetails?.color} border ${paymentDetails?.borderColor} hover:opacity-80 transition-opacity`}
                    data-testid="copy-address-btn"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Account Name for JazzCash */}
              {gateway === 'jazzcash' && paymentDetails.accountName && (
                <div className="p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                  <p className="text-xs text-slate-400 mb-1">Account Holder</p>
                  <p className="font-medium text-white">{paymentDetails.accountName}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30">
              <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-400 font-medium">Payment not configured</p>
                <p className="text-xs text-slate-400">Please contact admin to set up this payment method.</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Deposit Form with Currency Conversion */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-3xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Submit Deposit Request</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
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
            </div>
          </div>

          {/* Currency Conversion Summary */}
          {amount && parseFloat(amount) > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-teal-500/10 border border-cyan-500/30"
            >
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-medium text-cyan-400">Currency Conversion</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">${parseFloat(amount).toFixed(2)}</p>
                  <p className="text-xs text-slate-400">USD</p>
                </div>
                <div className="flex items-center gap-2 px-4">
                  <ArrowRight className="w-5 h-5 text-cyan-400" />
                  <span className="text-xs text-slate-500">@ {exchangeRate} PKR</span>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-emerald-400">PKR {parseInt(pkrAmount).toLocaleString()}</p>
                  <p className="text-xs text-slate-400">Pakistani Rupee</p>
                </div>
              </div>
            </motion.div>
          )}
          
          <p className="text-xs text-slate-500">Make the payment first, then enter the transaction ID/reference above</p>

          <button
            type="submit"
            disabled={submitting || !paymentDetails?.address}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="submit-deposit-btn"
          >
            {submitting && <Loader2 className="w-5 h-5 animate-spin" />}
            Submit Deposit Request
          </button>
        </form>
      </motion.div>

      {/* Deposit History */}
      {deposits.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-3xl overflow-hidden"
        >
          <div className="px-6 py-5 border-b border-white/10">
            <h3 className="text-lg font-semibold text-white">Recent Deposits</h3>
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
                {deposits.slice(0, 5).map((deposit) => (
                  <tr key={deposit.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-slate-300">{new Date(deposit.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-white">${deposit.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 text-emerald-400">PKR {(deposit.amount * exchangeRate).toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-300">{deposit.gateway}</td>
                    <td className="px-6 py-4">{getStatusBadge(deposit.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default UserDeposit;
