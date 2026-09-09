import React from 'react';
import { Home, LayoutGrid, BookOpen, BarChart3 } from 'lucide-react';
import { playTapSound } from '../utils/audio';

export type TabType = 'home' | 'categories' | 'encyclopedia' | 'stats';

interface BottomNavBarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'الرئيسية', icon: Home },
    { id: 'categories' as TabType, label: 'التصنيفات', icon: LayoutGrid },
    { id: 'encyclopedia' as TabType, label: 'الموسوعة', icon: BookOpen },
    { id: 'stats' as TabType, label: 'إحصائياتي', icon: BarChart3 },
  ];

  return (
    <nav aria-label="شريط التنقل الرئيسي" className="w-full bg-[#0c1322]/95 border-t border-slate-800/80 px-2 py-2 flex items-center justify-around shrink-0 backdrop-blur-lg z-30">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            id={`tab-${tab.id}`}
            onClick={() => {
              playTapSound();
              onSelectTab(tab.id);
            }}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 relative ${
              isActive
                ? 'text-emerald-400 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {isActive && (
              <span className="absolute -top-1 w-6 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_#10b981]"></span>
            )}
            <div className={`p-1 rounded-lg ${isActive ? 'bg-emerald-500/10' : ''}`}>
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
            </div>
            <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
