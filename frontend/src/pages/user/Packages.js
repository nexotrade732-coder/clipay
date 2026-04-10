import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, api, useToast } from '@/lib/context';
import { Check, Loader2, Star, Sparkles, TrendingUp, Zap, AlertTriangle, ArrowDownLeft, Users, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

const UserPackages = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);
  const [totalDeposits, setTotalDeposits] = useState(0);

  useEffect(() => {
    fetchPackages();
    fetchDeposits();
  }, []);

  const fetchPackages = async () => {
    try {
      const res = await api.get('/packages');
      setPackages(res.data);
    } catch (e) {
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  const fetchDeposits = async () => {
    try {
      const res = await api.get('/deposits/my');
      const approvedDeposits = res.data.filter(d => d.status === 'approved');
      const total = approvedDeposits.reduce((sum, d) => sum + d.amount, 0);
      setTotalDeposits(total);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePurchase = async (pkg) => {
    // Check if free package user trying to use free earnings
    if (user?.is_free_package && totalDeposits < pkg.price) {
      toast.error(`Free package earnings cannot be used. Please deposit at least $${pkg.price.toFixed(2)} first.`);
      return;
    }

    if (user.balance < pkg.price) {
      toast.error('Insufficient balance. Please deposit funds first.');
      return;
    }
    
    setPurchasing(pkg.id);
    try {
      await api.post(`/packages/purchase/${pkg.id}`);
      await refreshUser();
      toast.success(`${pkg.name} package purchased successfully!`);
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to purchase package');
    } finally {
      setPurchasing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const getPackageIcon = (index) => {
    switch(index) {
      case 0: return <Star className="w-6 h-6" />;
      case 1: return <TrendingUp className="w-6 h-6" />;
      case 2: return <Sparkles className="w-6 h-6" />;
      default: return <Star className="w-6 h-6" />;
    }
  };

  const getPackageColor = (index) => {
    switch(index) {
      case 0: return { bg: 'from-slate-500/20 to-slate-600/20', border: 'border-slate-500/20', text: 'text-slate-400' };
      case 1: return { bg: 'from-blue-500/20 to-purple-500/20', border: 'border-blue-500/30', text: 'text-blue-400' };
      case 2: return { bg: 'from-orange-500/20 to-amber-500/20', border: 'border-orange-500/20', text: 'text-orange-400' };
      default: return { bg: 'from-slate-500/20 to-slate-600/20', border: 'border-slate-500/20', text: 'text-slate-400' };
    }
  };

  // Check if user can purchase (for free package users)
  const canPurchase = (pkg) => {
    if (!user?.is_free_package) return user?.balance >= pkg.price;
    // Free package users need actual deposits
    return totalDeposits >= pkg.price && user?.balance >= pkg.price;
  };

  const minPackagePrice = packages.length > 0 ? Math.min(...packages.map(p => p.price)) : 10;

  return (
    <div className="max-w-5xl mx-auto space-y-8" data-testid="packages-page">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto animate-slideUp">
        <span className="inline-block px-4 py-1.5 rounded-full glass-light text-sm font-medium text-blue-400 mb-4">
          REWARDS PACKAGES
        </span>
        <h2 className="text-3xl font-bold text-white mb-4">
          Choose Your <span className="gradient-text">Earning Power</span>
        </h2>
        <p className="text-slate-400">
          Select a package that matches your goals. Higher packages unlock more daily tasks and bigger rewards.
        </p>
        <div className="mt-6 inline-flex items-center gap-3 px-5 py-3 rounded-2xl glass-light">
          <span className="text-sm text-slate-400">Your Balance:</span>
          <span className="text-xl font-bold text-white">${user?.balance?.toFixed(2) || '0.00'}</span>
          {user?.is_free_package && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-xs font-medium">
              Free Earnings
            </span>
          )}
        </div>
      </div>

      {/* FREE PACKAGE USER WARNING - Important Conditions */}
      {user?.is_free_package && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-400 mb-2">
                Activate Your Account to Withdraw
              </h3>
              <p className="text-slate-300 text-sm mb-4">
                Your free package earnings (${user?.balance?.toFixed(2)}) are saved! To withdraw, you need to:
              </p>
              
              {/* Conditions */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/30">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${totalDeposits >= minPackagePrice ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                    {totalDeposits >= minPackagePrice ? <Check className="w-4 h-4 text-white" /> : <DollarSign className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="flex-1">
                    <p className={`font-medium ${totalDeposits >= minPackagePrice ? 'text-emerald-400' : 'text-white'}`}>
                      1. Deposit minimum ${minPackagePrice.toFixed(0)} or more
                    </p>
                    <p className="text-xs text-slate-400">
                      {totalDeposits >= minPackagePrice 
                        ? `Completed - You've deposited $${totalDeposits.toFixed(2)}` 
                        : `You've deposited: $${totalDeposits.toFixed(2)} (Need $${(minPackagePrice - totalDeposits).toFixed(2)} more)`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-black/30">
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center">
                    <Users className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-white">
                      2. Refer 2 members who also activate with $10+
                    </p>
                    <p className="text-xs text-slate-400">
                      Share your referral code and help them get started
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-4">
                <p className="text-sm text-red-400 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Important:</strong> Free package earnings cannot be used to activate packages. 
                    You must deposit real money to purchase any package.
                  </span>
                </p>
              </div>

              <Link 
                to="/deposit" 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold hover:opacity-90 transition-all"
              >
                <ArrowDownLeft className="w-5 h-5" />
                Deposit Now
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Packages Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg, index) => {
          const isActive = user?.active_package === pkg.name;
          const isPopular = index === 1;
          const colors = getPackageColor(index);
          const canBuy = canPurchase(pkg);
          const needsDeposit = user?.is_free_package && totalDeposits < pkg.price;
          
          return (
            <div
              key={pkg.id}
              className={`relative rounded-3xl p-6 flex flex-col card-hover animate-slideUp ${
                isPopular 
                  ? 'glass border border-blue-500/30' 
                  : 'glass'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`package-${pkg.name.toLowerCase()}`}
            >
              {isActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
                    Current Plan
                  </span>
                </div>
              )}
              {isPopular && !isActive && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
                    MOST POPULAR
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.bg} border ${colors.border} flex items-center justify-center mb-5 mt-2 ${colors.text}`}>
                {getPackageIcon(index)}
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">{pkg.name}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">${pkg.price}</span>
                <span className="text-slate-500 text-sm">/one-time</span>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  {pkg.daily_ads} Ads per day
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  ${pkg.earning_per_ad.toFixed(2)} per ad
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  {pkg.duration_days} Days duration
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-emerald-400" />
                  </div>
                  Level {pkg.matrix_level} Matrix
                </li>
              </ul>

              {isActive ? (
                <button
                  disabled
                  className="w-full py-3 rounded-xl text-sm font-semibold cursor-default bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                >
                  <Zap className="w-4 h-4 inline mr-2" />
                  Active
                </button>
              ) : needsDeposit ? (
                <Link
                  to="/deposit"
                  className="w-full py-3 rounded-xl text-sm font-semibold bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center gap-2 hover:bg-amber-500/30 transition-colors"
                >
                  <ArrowDownLeft className="w-4 h-4" />
                  Deposit ${pkg.price} to Activate
                </Link>
              ) : (
                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={purchasing === pkg.id || !canBuy}
                  className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isPopular 
                      ? 'btn-primary' 
                      : index === 2
                        ? 'btn-accent'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                  }`}
                  data-testid={`purchase-${pkg.name.toLowerCase()}-btn`}
                >
                  {purchasing === pkg.id && <Loader2 className="w-4 h-4 animate-spin" />}
                  {!canBuy ? 'Insufficient Balance' : 'Get Started'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="glass-light rounded-2xl p-4 text-center animate-slideUp">
        <p className="text-sm text-slate-400">
          <Sparkles className="w-4 h-4 inline mr-2 text-blue-400" />
          Complete all daily ads to maximize your earnings! Package earnings are calculated based on ad completion.
        </p>
      </div>
    </div>
  );
};

export default UserPackages;
