import React, { useState, useEffect } from 'react';
import { api, useToast } from '@/lib/context';
import { Award, Loader2, Check, Lock } from 'lucide-react';

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

  const getRankColor = (name) => {
    switch (name?.toLowerCase()) {
      case 'bronze': return { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-200' };
      case 'silver': return { bg: 'bg-slate-200', text: 'text-slate-600', border: 'border-slate-300' };
      case 'gold': return { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-200' };
      default: return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' };
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6" data-testid="ranks-page">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-3">Leadership Ranks</h2>
        <p className="text-slate-500">Achieve milestones in your network to unlock cash bonuses.</p>
      </div>

      {/* Current Rank Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-sm">Your Current Rank</p>
            <h3 className="text-2xl font-bold" data-testid="current-rank">
              {progress?.current_rank || 'None'}
            </h3>
          </div>
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* Ranks Grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        {progress?.progress?.map((item, index) => {
          const colors = getRankColor(item.rank.name);
          const isAchieved = item.achieved;
          
          return (
            <div
              key={item.rank.id}
              className={`bg-white rounded-2xl border shadow-sm p-6 flex flex-col items-center text-center relative ${
                isAchieved ? 'border-emerald-200' : 'border-slate-200'
              }`}
              data-testid={`rank-${item.rank.name.toLowerCase()}`}
            >
              {isAchieved && (
                <div className="absolute top-4 right-4">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                </div>
              )}
              
              <div className={`w-16 h-16 ${colors.bg} rounded-full flex items-center justify-center ${colors.text} mb-4 ${colors.border} border-2`}>
                {isAchieved ? (
                  <Award className="w-8 h-8" />
                ) : (
                  <Lock className="w-6 h-6 opacity-50" />
                )}
              </div>
              
              <h3 className="text-lg font-semibold text-slate-900 mb-1">{item.rank.name}</h3>
              <p className="text-sm font-medium text-blue-500 mb-4">${item.rank.reward} Bonus</p>
              
              <div className="w-full text-sm text-slate-500 space-y-3 mb-6">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Team Size</span>
                    <span className="font-medium text-slate-900">
                      {item.current_team}/{item.rank.required_team_size}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all" 
                      style={{ width: `${Math.min(100, item.team_progress)}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Directs</span>
                    <span className="font-medium text-slate-900">
                      {item.current_directs}/{item.rank.required_directs}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div 
                      className="bg-blue-500 h-1.5 rounded-full transition-all" 
                      style={{ width: `${Math.min(100, item.direct_progress)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all ${isAchieved ? 'bg-emerald-500' : 'bg-blue-500'}`}
                  style={{ width: `${Math.min(100, item.overall_progress)}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400">
                {isAchieved ? 'Achieved!' : `${Math.round(item.overall_progress)}% Completed`}
              </p>
            </div>
          );
        })}
      </div>

      {(!progress?.progress || progress.progress.length === 0) && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">No ranks configured. Check back later!</p>
        </div>
      )}
    </div>
  );
};

export default UserRanks;
