import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Award, Loader2, Check, Lock, Crown, Star, Trophy } from 'lucide-react';

const UserRanks = () => {
  const toast = useToast();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/ranks/progress');
      setProgress(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const getRankStyle = (name) => {
    switch (name?.toLowerCase()) {
      case 'bronze': return { 
        bg: 'from-amber-600/20 to-orange-600/20', 
        border: 'border-amber-500/30', 
        text: 'text-amber-400',
        icon: Star,
        gradient: 'from-amber-500 to-orange-500'
      };
      case 'silver': return { 
        bg: 'from-slate-400/20 to-slate-500/20', 
        border: 'border-slate-400/30', 
        text: 'text-slate-300',
        icon: Award,
        gradient: 'from-slate-400 to-slate-500'
      };
      case 'gold': return { 
        bg: 'from-yellow-500/20 to-amber-500/20', 
        border: 'border-yellow-500/30', 
        text: 'text-yellow-400',
        icon: Crown,
        gradient: 'from-yellow-400 to-amber-500'
      };
      default: return { 
        bg: 'from-blue-500/20 to-purple-500/20', 
        border: 'border-blue-500/30', 
        text: 'text-blue-400',
        icon: Trophy,
        gradient: 'from-blue-500 to-purple-500'
      };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6" data-testid="ranks-page">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8 animate-slideUp">
        <span className="inline-block px-4 py-1.5 rounded-full glass-light text-sm font-medium text-orange-400 mb-4">
          ACHIEVEMENTS
        </span>
        <h2 className="text-3xl font-bold text-white mb-4">
          Leadership <span className="gradient-text-orange">Ranks</span>
        </h2>
        <p className="text-slate-400">
          Achieve milestones in your network to unlock exclusive cash bonuses
        </p>
      </div>

      {/* Current Rank Banner */}
      <div className="relative rounded-3xl overflow-hidden animate-slideUp">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800"></div>
        <div className="absolute inset-0 grid-bg opacity-20"></div>
        <div className="relative p-6 sm:p-8 flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm mb-1">Your Current Rank</p>
            <h3 className="text-3xl font-bold text-white" data-testid="current-rank">
              {progress?.current_rank || 'None'}
            </h3>
          </div>
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500/20 to-amber-500/20 border border-orange-500/30 flex items-center justify-center">
            <Crown className="w-10 h-10 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Ranks Grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        {progress?.progress?.map((item, index) => {
          const style = getRankStyle(item.rank.name);
          const isAchieved = item.achieved;
          const Icon = style.icon;
          
          return (
            <div
              key={item.rank.id}
              className={`glass rounded-3xl p-6 flex flex-col items-center text-center relative card-hover animate-slideUp ${
                isAchieved ? 'border border-emerald-500/30' : ''
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
              data-testid={`rank-${item.rank.name.toLowerCase()}`}
            >
              {isAchieved && (
                <div className="absolute -top-3 right-4">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
              
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${style.bg} ${style.border} border-2 flex items-center justify-center mb-5 ${isAchieved ? '' : 'opacity-60'}`}>
                {isAchieved ? (
                  <Icon className={`w-10 h-10 ${style.text}`} />
                ) : (
                  <Lock className="w-8 h-8 text-slate-500" />
                )}
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">{item.rank.name}</h3>
              <p className={`text-lg font-bold ${style.text} mb-5`}>${item.rank.reward} Bonus</p>
              
              <div className="w-full space-y-4 mb-6">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Team Size</span>
                    <span className="text-white font-medium">
                      {item.current_team}/{item.rank.required_team_size}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all bg-gradient-to-r ${style.gradient}`}
                      style={{ width: `${Math.min(100, item.team_progress)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-400">Directs</span>
                    <span className="text-white font-medium">
                      {item.current_directs}/{item.rank.required_directs}
                    </span>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all bg-gradient-to-r ${style.gradient}`}
                      style={{ width: `${Math.min(100, item.direct_progress)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-slate-700/50 rounded-full h-3 mb-2 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all ${isAchieved ? 'bg-emerald-500' : `bg-gradient-to-r ${style.gradient}`}`}
                  style={{ width: `${Math.min(100, item.overall_progress)}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400">
                {isAchieved ? '✓ Achieved!' : `${Math.round(item.overall_progress)}% Completed`}
              </p>
            </div>
          );
        })}
      </div>

      {(!progress?.progress || progress.progress.length === 0) && (
        <div className="glass rounded-3xl p-12 text-center animate-slideUp">
          <Award className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">No ranks configured. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default UserRanks;
