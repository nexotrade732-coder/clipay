import React, { useState, useEffect } from 'react';
import { useAuth, api, useToast } from '@/lib/context';
import { Check, Loader2, Star } from 'lucide-react';

const UserPackages = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(null);

  useEffect(() => {
    fetchPackages();
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

  const handlePurchase = async (pkg) => {
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

  return (
    <div className="max-w-5xl mx-auto space-y-8" data-testid="packages-page">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Choose Your Earning Power</h2>
        <p className="text-slate-500">Upgrade your package to unlock more daily ads and higher ROI.</p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
          <span className="text-sm text-slate-600">Your Balance:</span>
          <span className="text-lg font-bold text-slate-900">${user?.balance?.toFixed(2) || '0.00'}</span>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg, index) => {
          const isActive = user?.active_package === pkg.name;
          const isPopular = index === 1;
          
          return (
            <div
              key={pkg.id}
              className={`relative rounded-2xl shadow-sm p-6 flex flex-col transition-all ${
                isPopular 
                  ? 'bg-slate-900 text-white md:-translate-y-2 shadow-xl' 
                  : 'bg-white border border-slate-200 card-hover'
              }`}
              data-testid={`package-${pkg.name.toLowerCase()}`}
            >
              {isActive && (
                <div className="absolute top-0 right-6 transform -translate-y-1/2">
                  <span className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                    Current Plan
                  </span>
                </div>
              )}
              {isPopular && !isActive && (
                <div className="absolute top-0 right-6 transform -translate-y-1/2">
                  <span className="bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    <Star className="w-3 h-3" /> Popular
                  </span>
                </div>
              )}

              <h3 className={`text-lg font-medium mb-2 ${isPopular ? 'text-slate-300' : 'text-slate-900'}`}>
                {pkg.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className={`text-3xl font-bold ${isPopular ? 'text-white' : 'text-slate-900'}`}>
                  ${pkg.price}
                </span>
              </div>

              <ul className={`space-y-3 mb-8 flex-1 text-sm ${isPopular ? 'text-slate-300' : 'text-slate-600'}`}>
                <li className="flex items-center gap-2">
                  <Check className={`w-5 h-5 ${isPopular ? 'text-blue-400' : 'text-emerald-500'}`} />
                  {pkg.daily_ads} Ads per day
                </li>
                <li className="flex items-center gap-2">
                  <Check className={`w-5 h-5 ${isPopular ? 'text-blue-400' : 'text-emerald-500'}`} />
                  ${pkg.earning_per_ad.toFixed(2)} per ad
                </li>
                <li className="flex items-center gap-2">
                  <Check className={`w-5 h-5 ${isPopular ? 'text-blue-400' : 'text-emerald-500'}`} />
                  {pkg.duration_days} Days duration
                </li>
                <li className="flex items-center gap-2">
                  <Check className={`w-5 h-5 ${isPopular ? 'text-blue-400' : 'text-emerald-500'}`} />
                  Level {pkg.matrix_level} Matrix
                </li>
              </ul>

              {isActive ? (
                <button
                  disabled
                  className={`w-full py-2.5 rounded-xl text-sm font-medium cursor-default ${
                    isPopular ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  Active
                </button>
              ) : (
                <button
                  onClick={() => handlePurchase(pkg)}
                  disabled={purchasing === pkg.id || user.balance < pkg.price}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    isPopular 
                      ? 'bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50' 
                      : 'border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50'
                  }`}
                  data-testid={`purchase-${pkg.name.toLowerCase()}-btn`}
                >
                  {purchasing === pkg.id && <Loader2 className="w-4 h-4 animate-spin" />}
                  {user.balance < pkg.price ? 'Insufficient Balance' : 'Purchase'}
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
        <p className="text-sm text-blue-700">
          Package earnings are calculated based on daily ad completion. Complete all daily ads to maximize your earnings!
        </p>
      </div>
    </div>
  );
};

export default UserPackages;
