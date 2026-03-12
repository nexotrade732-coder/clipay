import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, api, useToast } from '@/lib/context';
import { Play, Check, Loader2, ExternalLink, Youtube, Instagram, Facebook, Globe, Package } from 'lucide-react';

const getPlatformIcon = (platform) => {
  switch (platform?.toLowerCase()) {
    case 'youtube': return Youtube;
    case 'instagram': return Instagram;
    case 'facebook': return Facebook;
    case 'tiktok': return Globe;
    default: return Globe;
  }
};

const getPlatformColor = (platform) => {
  switch (platform?.toLowerCase()) {
    case 'youtube': return 'text-red-500 bg-red-50';
    case 'instagram': return 'text-pink-500 bg-pink-50';
    case 'facebook': return 'text-blue-600 bg-blue-50';
    case 'tiktok': return 'text-slate-900 bg-slate-100';
    default: return 'text-slate-500 bg-slate-50';
  }
};

const UserWatch = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const [links, setLinks] = useState([]);
  const [progress, setProgress] = useState({ watched_today: 0, daily_quota: 0, earnings_today: 0 });
  const [watchedIds, setWatchedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watching, setWatching] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [linksRes, progressRes] = await Promise.all([
        api.get('/watch/links'),
        api.get('/watch/progress')
      ]);
      setLinks(linksRes.data);
      setProgress(progressRes.data);
      
      // Get today's watched links from localStorage
      const today = new Date().toISOString().split('T')[0];
      const stored = localStorage.getItem(`clipay_watched_${today}`);
      if (stored) {
        setWatchedIds(JSON.parse(stored));
      }
    } catch (e) {
      if (e.response?.status !== 400) {
        toast.error('Failed to load watch links');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleWatch = async (link) => {
    if (watchedIds.includes(link.id)) {
      toast.info('You already watched this link today');
      return;
    }

    // Open link in new tab
    window.open(link.url, '_blank');
    
    setWatching(link.id);
    
    // Wait a bit before marking as watched (simulating watch time)
    setTimeout(async () => {
      try {
        const res = await api.post(`/watch/${link.id}`);
        toast.success(`Earned $${res.data.earned.toFixed(2)}!`);
        
        // Update local state
        const today = new Date().toISOString().split('T')[0];
        const newWatchedIds = [...watchedIds, link.id];
        setWatchedIds(newWatchedIds);
        localStorage.setItem(`clipay_watched_${today}`, JSON.stringify(newWatchedIds));
        
        // Refresh progress and user
        const progressRes = await api.get('/watch/progress');
        setProgress(progressRes.data);
        await refreshUser();
      } catch (e) {
        toast.error(e.response?.data?.detail || 'Failed to record watch');
      } finally {
        setWatching(null);
      }
    }, 2000);
  };

  if (!user?.active_package) {
    return (
      <div className="max-w-md mx-auto text-center py-12" data-testid="watch-page-no-package">
        <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">No Active Package</h2>
        <p className="text-slate-500 mb-6">You need an active package to watch and earn from videos.</p>
        <Link
          to="/packages"
          className="inline-flex items-center gap-2 bg-blue-500 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors"
        >
          Get a Package
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const progressPercent = progress.daily_quota > 0 
    ? (progress.watched_today / progress.daily_quota) * 100 
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-6" data-testid="watch-page">
      {/* Progress Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Daily Quota</h3>
          <p className="text-sm text-slate-500">Complete tasks to earn your daily reward.</p>
        </div>
        <div className="w-full sm:w-64">
          <div className="flex justify-between text-sm font-medium mb-1.5">
            <span className="text-blue-500">{progress.watched_today} Watched</span>
            <span className="text-slate-500">{progress.daily_quota} Total</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5">
            <div 
              className="bg-blue-500 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <div className="mt-2 text-right">
            <span className="text-sm font-medium text-emerald-600">
              +${progress.earnings_today?.toFixed(2) || '0.00'} earned today
            </span>
          </div>
        </div>
      </div>

      {/* Quota Complete Message */}
      {progress.watched_today >= progress.daily_quota && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-center">
          <Check className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-emerald-700 font-medium">Daily quota completed! Come back tomorrow for more earnings.</p>
        </div>
      )}

      {/* Links Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {links.map((link) => {
          const isWatched = watchedIds.includes(link.id);
          const PlatformIcon = getPlatformIcon(link.platform);
          const platformColor = getPlatformColor(link.platform);
          
          return (
            <div
              key={link.id}
              className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${
                isWatched ? 'opacity-70' : 'card-hover'
              }`}
              data-testid={`watch-link-${link.id}`}
            >
              {/* Thumbnail */}
              <div className={`h-40 flex items-center justify-center ${isWatched ? 'bg-slate-200 grayscale' : 'bg-slate-100'}`}>
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${platformColor}`}>
                  <PlatformIcon className="w-8 h-8" />
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-slate-900 line-clamp-1">{link.title}</h4>
                  {!isWatched && (
                    <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2 py-0.5 rounded border border-emerald-200">
                      +${link.earning?.toFixed(2)}
                    </span>
                  )}
                  {isWatched && (
                    <span className="text-slate-400 text-xs font-medium">Earned</span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mb-3">{link.platform}</p>

                {isWatched ? (
                  <button
                    disabled
                    className="w-full py-2 bg-slate-200 text-slate-500 rounded-xl text-sm font-medium flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Check className="w-4 h-4" /> Done
                  </button>
                ) : (
                  <button
                    onClick={() => handleWatch(link)}
                    disabled={watching === link.id || progress.watched_today >= progress.daily_quota}
                    className="w-full py-2 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    data-testid={`watch-btn-${link.id}`}
                  >
                    {watching === link.id ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> Processing...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4" /> Watch & Earn
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {links.length === 0 && (
        <div className="text-center py-12">
          <Play className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No watch links available at the moment. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default UserWatch;
