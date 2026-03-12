import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, api, useToast } from '@/lib/context';
import { Play, Check, Loader2, ExternalLink, Youtube, Instagram, Facebook, Globe, Package, Sparkles, Zap } from 'lucide-react';

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
    case 'youtube': return { bg: 'from-red-500/20 to-red-600/20', border: 'border-red-500/30', text: 'text-red-400', gradient: 'from-red-500 to-rose-500' };
    case 'instagram': return { bg: 'from-pink-500/20 to-purple-500/20', border: 'border-pink-500/30', text: 'text-pink-400', gradient: 'from-pink-500 to-purple-500' };
    case 'facebook': return { bg: 'from-blue-500/20 to-blue-600/20', border: 'border-blue-500/30', text: 'text-blue-400', gradient: 'from-blue-500 to-blue-600' };
    case 'tiktok': return { bg: 'from-slate-500/20 to-slate-600/20', border: 'border-slate-500/30', text: 'text-slate-400', gradient: 'from-slate-500 to-slate-600' };
    default: return { bg: 'from-slate-500/20 to-slate-600/20', border: 'border-slate-500/30', text: 'text-slate-400', gradient: 'from-slate-500 to-slate-600' };
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

    window.open(link.url, '_blank');
    setWatching(link.id);
    
    setTimeout(async () => {
      try {
        const res = await api.post(`/watch/${link.id}`);
        toast.success(`Earned $${res.data.earned.toFixed(2)}!`);
        
        const today = new Date().toISOString().split('T')[0];
        const newWatchedIds = [...watchedIds, link.id];
        setWatchedIds(newWatchedIds);
        localStorage.setItem(`clipay_watched_${today}`, JSON.stringify(newWatchedIds));
        
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
      <div className="max-w-md mx-auto text-center py-12 animate-slideUp" data-testid="watch-page-no-package">
        <div className="glass rounded-3xl p-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">No Active Package</h2>
          <p className="text-slate-400 mb-6">You need an active package to watch and earn from videos.</p>
          <Link to="/packages" className="btn-primary inline-flex items-center gap-2">
            Get a Package
          </Link>
        </div>
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
      <div className="glass rounded-3xl p-6 animate-slideUp">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Daily Quota Progress</h3>
            </div>
            <p className="text-sm text-slate-400">Complete tasks to earn your daily reward</p>
          </div>
          <div className="w-full sm:w-72">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-blue-400">{progress.watched_today} Watched</span>
              <span className="text-slate-400">{progress.daily_quota} Total</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-blue-500 to-purple-500"
                style={{ width: `${progressPercent}%`, boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)' }}
              ></div>
            </div>
            <div className="mt-3 text-right">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-sm font-medium border border-emerald-500/30">
                +${progress.earnings_today?.toFixed(2) || '0.00'} earned
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quota Complete Message */}
      {progress.watched_today >= progress.daily_quota && (
        <div className="glass-light rounded-2xl p-5 text-center animate-scaleIn border border-emerald-500/30">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
            <Check className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-emerald-400 font-semibold">Daily quota completed! 🎉</p>
          <p className="text-slate-400 text-sm mt-1">Come back tomorrow for more earnings.</p>
        </div>
      )}

      {/* Links Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {links.map((link, index) => {
          const isWatched = watchedIds.includes(link.id);
          const PlatformIcon = getPlatformIcon(link.platform);
          const colors = getPlatformColor(link.platform);
          
          return (
            <div
              key={link.id}
              className={`glass rounded-2xl overflow-hidden card-hover animate-slideUp ${isWatched ? 'opacity-60' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
              data-testid={`watch-link-${link.id}`}
            >
              {/* Thumbnail */}
              <div className={`h-36 flex items-center justify-center relative overflow-hidden ${isWatched ? 'grayscale' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`}></div>
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                  <PlatformIcon className="w-8 h-8 text-white" />
                </div>
                {!isWatched && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/90 text-white text-xs font-bold shadow-lg">
                      +${link.earning?.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h4 className="font-medium text-white line-clamp-1">{link.title}</h4>
                </div>
                <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                  <PlatformIcon className={`w-3.5 h-3.5 ${colors.text}`} />
                  {link.platform}
                </p>

                {isWatched ? (
                  <button disabled className="w-full py-2.5 rounded-xl text-sm font-medium bg-slate-700/50 text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed">
                    <Check className="w-4 h-4" /> Completed
                  </button>
                ) : (
                  <button
                    onClick={() => handleWatch(link)}
                    disabled={watching === link.id || progress.watched_today >= progress.daily_quota}
                    className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
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
        <div className="glass rounded-3xl p-12 text-center">
          <Play className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No watch links available at the moment. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default UserWatch;
