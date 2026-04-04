import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, api, useToast } from '@/lib/context';
import { Play, Check, Loader2, Youtube, Instagram, Facebook, Globe, Package, Sparkles, Zap, X, Clock, AlertCircle, ExternalLink, DollarSign } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const WATCH_DURATION = 50; // seconds required to watch

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

// Convert regular video URLs to embed URLs
const getEmbedUrl = (url, platform) => {
  try {
    if (platform?.toLowerCase() === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      let videoId = '';
      if (url.includes('youtu.be/')) {
        videoId = url.split('youtu.be/')[1]?.split('?')[0];
      } else if (url.includes('youtube.com/watch')) {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v');
      } else if (url.includes('youtube.com/embed/')) {
        videoId = url.split('embed/')[1]?.split('?')[0];
      }
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      }
    }
    if (platform?.toLowerCase() === 'facebook' || url.includes('facebook.com')) {
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&autoplay=true`;
    }
    return null;
  } catch (e) {
    return null;
  }
};

const UserWatch = () => {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [links, setLinks] = useState([]);
  const [progress, setProgress] = useState({ watched_today: 0, daily_quota: 0, earnings_today: 0 });
  const [watchedIds, setWatchedIds] = useState([]);
  const [skippedIds, setSkippedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [watchingLink, setWatchingLink] = useState(null);
  const [timer, setTimer] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [timerComplete, setTimerComplete] = useState(false);

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
      const storedWatched = localStorage.getItem(`clipay_watched_${today}`);
      const storedSkipped = localStorage.getItem(`clipay_skipped_${today}`);
      if (storedWatched) setWatchedIds(JSON.parse(storedWatched));
      if (storedSkipped) setSkippedIds(JSON.parse(storedSkipped));
    } catch (e) {
      if (e.response?.status !== 400) {
        toast.error('Failed to load watch links');
      }
    } finally {
      setLoading(false);
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (showModal && watchingLink && timer < WATCH_DURATION) {
      interval = setInterval(() => {
        setTimer(prev => {
          const newTimer = prev + 1;
          if (newTimer >= WATCH_DURATION) {
            setTimerComplete(true);
          }
          return newTimer;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showModal, watchingLink, timer]);

  const handleWatch = (link) => {
    if (watchedIds.includes(link.id)) {
      toast.info('You already watched this video today');
      return;
    }
    if (skippedIds.includes(link.id)) {
      toast.error('You closed this video early. It cannot be watched again today.');
      return;
    }

    setWatchingLink(link);
    setTimer(0);
    setTimerComplete(false);
    setShowModal(true);
  };

  const handleCloseModal = async () => {
    if (timer < WATCH_DURATION && watchingLink) {
      const today = new Date().toISOString().split('T')[0];
      const newSkippedIds = [...skippedIds, watchingLink.id];
      setSkippedIds(newSkippedIds);
      localStorage.setItem(`clipay_skipped_${today}`, JSON.stringify(newSkippedIds));
      toast.error(`Video closed early! You need to watch for ${WATCH_DURATION} seconds to earn. This video is now locked for today.`);
    }
    setShowModal(false);
    setWatchingLink(null);
    setTimer(0);
    setTimerComplete(false);
  };

  const handleClaimReward = async () => {
    if (timer < WATCH_DURATION) {
      toast.error(`Please wait ${WATCH_DURATION - timer} more seconds`);
      return;
    }

    setClaiming(true);
    try {
      const res = await api.post(`/watch/${watchingLink.id}`);
      toast.success(`+$${res.data.earned.toFixed(2)} added to your balance!`);
      
      const today = new Date().toISOString().split('T')[0];
      const newWatchedIds = [...watchedIds, watchingLink.id];
      setWatchedIds(newWatchedIds);
      localStorage.setItem(`clipay_watched_${today}`, JSON.stringify(newWatchedIds));
      
      const progressRes = await api.get('/watch/progress');
      setProgress(progressRes.data);
      await refreshUser();
      
      setShowModal(false);
      setWatchingLink(null);
      setTimer(0);
      setTimerComplete(false);
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to record watch');
    } finally {
      setClaiming(false);
    }
  };

  if (!user?.active_package) {
    return (
      <div className="max-w-md mx-auto text-center py-12 animate-slideUp" data-testid="watch-page-no-package">
        <div className="glass rounded-3xl p-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-teal-500/20 border border-cyan-500/20 flex items-center justify-center mx-auto mb-6">
            <Package className="w-10 h-10 text-cyan-400" />
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
        <Loader2 className="w-8 h-8 animate-spin text-cyan-500" />
      </div>
    );
  }

  const progressPercent = progress.daily_quota > 0 
    ? (progress.watched_today / progress.daily_quota) * 100 
    : 0;

  const embedUrl = watchingLink ? getEmbedUrl(watchingLink.url, watchingLink.platform) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6" data-testid="watch-page">
      {/* Progress Header */}
      <div className="glass rounded-3xl p-4 sm:p-6 animate-slideUp">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              <h3 className="text-lg font-semibold text-white">Daily Quota Progress</h3>
            </div>
            <p className="text-sm text-slate-400">Watch each video for {WATCH_DURATION} seconds to earn</p>
          </div>
          <div className="w-full sm:w-72">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span className="text-cyan-400">{progress.watched_today} Watched</span>
              <span className="text-slate-400">{progress.daily_quota} Total</span>
            </div>
            <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-cyan-500 to-teal-500"
                style={{ width: `${progressPercent}%`, boxShadow: '0 0 10px rgba(8, 145, 178, 0.5)' }}
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
          <p className="text-emerald-400 font-semibold">Daily quota completed!</p>
          <p className="text-slate-400 text-sm mt-1">Come back tomorrow for more earnings.</p>
        </div>
      )}

      {/* Links Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {links.map((link, index) => {
          const isWatched = watchedIds.includes(link.id);
          const isSkipped = skippedIds.includes(link.id);
          const PlatformIcon = getPlatformIcon(link.platform);
          const colors = getPlatformColor(link.platform);
          
          return (
            <div
              key={link.id}
              className={`glass rounded-2xl overflow-hidden card-hover animate-slideUp ${isWatched || isSkipped ? 'opacity-60' : ''}`}
              style={{ animationDelay: `${index * 0.05}s` }}
              data-testid={`watch-link-${link.id}`}
            >
              <div className={`h-36 flex items-center justify-center relative overflow-hidden ${isWatched || isSkipped ? 'grayscale' : ''}`}>
                <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg}`}></div>
                <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
                  <PlatformIcon className="w-8 h-8 text-white" />
                </div>
                {!isWatched && !isSkipped && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-lg bg-emerald-500/90 text-white text-xs font-bold shadow-lg">
                      +${link.earning?.toFixed(2)}
                    </span>
                  </div>
                )}
                {isSkipped && (
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-lg bg-red-500/90 text-white text-xs font-bold shadow-lg">
                      Locked
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h4 className="font-medium text-white line-clamp-1 mb-2">{link.title}</h4>
                <p className="text-xs text-slate-400 mb-4 flex items-center gap-1">
                  <PlatformIcon className={`w-3.5 h-3.5 ${colors.text}`} />
                  {link.platform}
                </p>

                {isWatched ? (
                  <button disabled className="w-full py-2.5 rounded-xl text-sm font-medium bg-slate-700/50 text-slate-400 flex items-center justify-center gap-2 cursor-not-allowed">
                    <Check className="w-4 h-4" /> Completed
                  </button>
                ) : isSkipped ? (
                  <button disabled className="w-full py-2.5 rounded-xl text-sm font-medium bg-red-500/20 text-red-400 flex items-center justify-center gap-2 cursor-not-allowed border border-red-500/30">
                    <X className="w-4 h-4" /> Closed Early
                  </button>
                ) : (
                  <button
                    onClick={() => handleWatch(link)}
                    disabled={progress.watched_today >= progress.daily_quota}
                    className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2"
                    data-testid={`watch-btn-${link.id}`}
                  >
                    <Play className="w-4 h-4" /> Watch & Earn
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

      {/* Embedded Video Player Modal - Responsive */}
      <AnimatePresence>
        {showModal && watchingLink && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-5xl max-h-[95vh] overflow-y-auto"
            >
              {/* Compact Header for Mobile, Full for Desktop */}
              <div className="glass rounded-t-2xl sm:rounded-t-3xl p-3 sm:p-4 border-b border-white/10">
                <div className="flex items-center justify-between gap-2">
                  {/* Title - Compact on mobile */}
                  <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${getPlatformColor(watchingLink.platform).gradient} flex items-center justify-center flex-shrink-0`}>
                      {React.createElement(getPlatformIcon(watchingLink.platform), { className: "w-5 h-5 sm:w-6 sm:h-6 text-white" })}
                    </div>
                    <div className="min-w-0 hidden sm:block">
                      <h3 className="text-lg font-bold text-white truncate">{watchingLink.title}</h3>
                      <p className="text-sm text-slate-400">{watchingLink.platform}</p>
                    </div>
                  </div>
                  
                  {/* SINGLE Timer/Claim Button - This is the ONLY timer display */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {timerComplete ? (
                      // CLAIM BUTTON - Animated and prominent
                      <motion.button
                        initial={{ scale: 0.8 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        onClick={handleClaimReward}
                        disabled={claiming}
                        className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-all"
                      >
                        {claiming ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <DollarSign className="w-5 h-5" />
                            <span className="text-lg">CLAIM ${watchingLink.earning?.toFixed(2)}</span>
                          </>
                        )}
                      </motion.button>
                    ) : (
                      // Timer Display
                      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-5 py-2 sm:py-3 rounded-xl sm:rounded-2xl bg-cyan-500/20 border border-cyan-500/50">
                        <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle cx="50%" cy="50%" r="40%" className="stroke-slate-700" strokeWidth="3" fill="none" />
                            <circle 
                              cx="50%" cy="50%" r="40%"
                              className="stroke-cyan-500"
                              strokeWidth="3" fill="none" strokeLinecap="round"
                              strokeDasharray={126}
                              strokeDashoffset={126 - (126 * Math.min(timer / WATCH_DURATION, 1))}
                              style={{ transition: 'stroke-dashoffset 1s linear' }}
                            />
                          </svg>
                          <Clock className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                        </div>
                        <div className="text-center sm:text-left">
                          <div className="text-xl sm:text-2xl font-bold text-white">{timer}s</div>
                          <div className="text-xs text-slate-400 hidden sm:block">of {WATCH_DURATION}s</div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={handleCloseModal}
                      className="p-2 sm:p-3 hover:bg-white/10 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Player Area - Clean without overlay timer */}
              <div className="bg-black relative">
                {embedUrl ? (
                  <div className="relative" style={{ paddingTop: '56.25%' }}>
                    <iframe
                      src={embedUrl}
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={watchingLink.title}
                    />
                  </div>
                ) : (
                  // Fallback for non-embeddable videos
                  <div className="aspect-video flex flex-col items-center justify-center bg-slate-900 p-4 sm:p-8">
                    <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br ${getPlatformColor(watchingLink.platform).gradient} flex items-center justify-center mb-4 sm:mb-6`}>
                      {React.createElement(getPlatformIcon(watchingLink.platform), { className: "w-10 h-10 sm:w-12 sm:h-12 text-white" })}
                    </div>
                    <p className="text-slate-300 text-center mb-4 text-sm sm:text-base">
                      This video will open in a new tab. Keep this window open.
                    </p>
                    <a 
                      href={watchingLink.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-2 text-sm sm:text-base"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Open Video
                    </a>
                  </div>
                )}
              </div>

              {/* Compact Footer */}
              <div className="glass rounded-b-2xl sm:rounded-b-3xl p-3 sm:p-4 border-t border-white/10">
                <div className="flex items-center justify-between">
                  {timerComplete ? (
                    <div className="flex items-center gap-2 text-emerald-400">
                      <Sparkles className="w-5 h-5 animate-pulse" />
                      <span className="text-sm font-medium">Time complete! Click CLAIM to get your reward</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-amber-400">
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm">{WATCH_DURATION - timer}s more to earn ${watchingLink.earning?.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserWatch;
