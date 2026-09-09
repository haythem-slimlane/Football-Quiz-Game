import React from 'react';
import { 
  Trophy, Zap, Medal, Flame, Grid, Shuffle, 
  Volume2, VolumeX, ChevronLeft, Award
} from 'lucide-react';
import { GameModeInfo } from '../types';
import { GAME_MODES } from '../data/gameModes';
import { getUserStats } from '../utils/storage';
import { isSoundEnabled, toggleSound, playTapSound } from '../utils/audio';

interface HomeScreenProps {
  onStartGame: (mode: GameModeInfo, categoryId?: string) => void;
  onNavigateToCategories: () => void;
  onNavigateToEncyclopedia?: () => void;
  onNavigateToStats: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartGame,
  onNavigateToCategories,
  onNavigateToStats,
}) => {
  const [soundOn, setSoundOn] = React.useState(isSoundEnabled());
  const stats = getUserStats();

  const handleToggleSound = () => {
    const updated = toggleSound();
    setSoundOn(updated);
    if (updated) playTapSound();
  };

  const getModeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Trophy': return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'Zap': return <Zap className="w-6 h-6 text-emerald-400" />;
      case 'Medal': return <Medal className="w-6 h-6 text-sky-400" />;
      case 'Flame': return <Flame className="w-6 h-6 text-rose-500" />;
      case 'Grid': return <Grid className="w-6 h-6 text-indigo-400" />;
      case 'Shuffle': return <Shuffle className="w-6 h-6 text-purple-400" />;
      default: return <Trophy className="w-6 h-6 text-emerald-400" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-6 overflow-y-auto">
      {/* Top Bar / Header */}
      <div className="flex items-center justify-between py-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-900/40 border border-emerald-400/30">
            <span className="text-xl">⚽</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white leading-tight font-serif flex items-center gap-1.5">
              كويز كووورة
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-sans font-medium">
                500 سؤال
              </span>
            </h1>
            <p className="text-xs text-slate-400">تحدي كرة القدم العربي الشامل</p>
          </div>
        </div>

        <button
          id="toggle-sound-btn"
          onClick={handleToggleSound}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 transition-colors shadow-sm"
          title={soundOn ? 'كتم الصوت' : 'تشغيل الصوت'}
        >
          {soundOn ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
        </button>
      </div>

      {/* User Stats Quick Pills */}
      <div 
        onClick={() => { playTapSound(); onNavigateToStats(); }}
        className="w-full bg-gradient-to-r from-slate-900 via-slate-800/90 to-slate-900 p-3 rounded-2xl border border-slate-800 mb-5 cursor-pointer hover:border-slate-700 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-4 text-center">
          <div>
            <span className="text-[10px] text-slate-400 block">المباريات</span>
            <span className="text-sm font-bold text-white">{stats.gamesPlayed}</span>
          </div>
          <div className="w-px h-6 bg-slate-700/60"></div>
          <div>
            <span className="text-[10px] text-slate-400 block">أعلى نقطة</span>
            <span className="text-sm font-bold text-amber-400">{stats.bestScore}</span>
          </div>
          <div className="w-px h-6 bg-slate-700/60"></div>
          <div>
            <span className="text-[10px] text-slate-400 block">أفضل سلسلة</span>
            <span className="text-sm font-bold text-rose-400 flex items-center justify-center gap-0.5">
              🔥 {stats.bestStreak}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-emerald-400 font-semibold pr-1">
          <span>سجلي</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Section Header: Game Modes */}
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>أوضاع اللعب الرسمية</span>
        </h3>
        <span className="text-xs text-slate-400">6 أوضاع متنوعة</span>
      </div>

      {/* Game Modes 6 Cards Grid */}
      <div className="grid grid-cols-1 gap-2.5 mb-3">
        {GAME_MODES.map((mode) => (
          <div
            key={mode.id}
            id={`mode-card-${mode.id}`}
            onClick={() => {
              playTapSound();
              if (mode.id === 'categories') {
                onNavigateToCategories();
              } else {
                onStartGame(mode);
              }
            }}
            className="group p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 transition-all duration-200 cursor-pointer flex items-center justify-between active:scale-[0.99] shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-slate-900/80 border border-slate-700/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getModeIcon(mode.iconName)}
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 mb-0.5">
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {mode.title}
                  </h4>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-slate-700/70 text-slate-300 font-medium">
                    {mode.badgeText}
                  </span>
                </div>
                <p className="text-xs text-slate-400 line-clamp-1 leading-normal">
                  {mode.subtitle}
                </p>
              </div>
            </div>

            <div className="flex items-center text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-[-2px] transition-all">
              <ChevronLeft className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
