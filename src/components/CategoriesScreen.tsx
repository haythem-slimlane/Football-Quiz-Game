import React, { useState } from 'react';
import { 
  Globe, Sparkles, Crown, Shield, Target, Flame, 
  Star, Compass, Award, Medal, CheckCircle2, Landmark, 
  Zap, ChevronLeft, Search, Play
} from 'lucide-react';
import { quizCategories } from '../data/questions';
import { CATEGORY_GAME_MODE } from '../data/gameModes';
import { GameModeInfo } from '../types';
import { playTapSound } from '../utils/audio';

interface CategoriesScreenProps {
  onSelectCategory: (mode: GameModeInfo, categoryName: string) => void;
}

export const CategoriesScreen: React.FC<CategoriesScreenProps> = ({ onSelectCategory }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-5 h-5 text-sky-400" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5 text-amber-400" />;
      case 'Crown': return <Crown className="w-5 h-5 text-yellow-400" />;
      case 'Shield': return <Shield className="w-5 h-5 text-indigo-400" />;
      case 'Target': return <Target className="w-5 h-5 text-emerald-400" />;
      case 'Flame': return <Flame className="w-5 h-5 text-rose-500" />;
      case 'Star': return <Star className="w-5 h-5 text-red-400" />;
      case 'Compass': return <Compass className="w-5 h-5 text-teal-400" />;
      case 'Award': return <Award className="w-5 h-5 text-blue-400" />;
      case 'Medal': return <Medal className="w-5 h-5 text-amber-300" />;
      case 'CheckCircle2': return <CheckCircle2 className="w-5 h-5 text-violet-400" />;
      case 'Landmark': return <Landmark className="w-5 h-5 text-orange-400" />;
      case 'Zap': return <Zap className="w-5 h-5 text-cyan-400" />;
      default: return <Award className="w-5 h-5 text-emerald-400" />;
    }
  };

  const filteredCategories = quizCategories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartCategory = (categoryName: string) => {
    playTapSound();
    onSelectCategory(CATEGORY_GAME_MODE, categoryName);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-6 overflow-y-auto">
      {/* Screen Title */}
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white mb-1">التصنيفات الكروية</h2>
        <p className="text-xs text-slate-400">
          اختر مجالك المفضل من بين 13 تصنيفاً متخصصاً يغطي 500 سؤال
        </p>
      </div>

      {/* Search Input */}
      <div className="relative mb-4">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث عن تصنيف (مثال: كأس العالم، تونس، أساطير...)"
          className="w-full py-2.5 pr-10 pl-4 rounded-xl bg-slate-800/80 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 gap-2.5">
        {filteredCategories.map((category) => (
          <div
            key={category.id}
            id={`category-card-${category.id}`}
            onClick={() => handleStartCategory(category.name)}
            className="p-3.5 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 transition-all cursor-pointer flex items-center justify-between active:scale-[0.99] group shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700/80 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                {getCategoryIcon(category.icon)}
              </div>
              <div className="text-right">
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                  {category.name}
                </h3>
                <span className="text-[11px] text-slate-400">
                  {category.count} سؤالاً موثقاً
                </span>
              </div>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleStartCategory(category.name);
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1 transition-all shrink-0"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>ابدأ</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
