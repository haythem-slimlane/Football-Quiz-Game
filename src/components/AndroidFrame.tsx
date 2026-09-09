import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('12:00');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-[#0a0f1d] flex items-center justify-center p-0 md:p-4 lg:p-6 select-none">
      {/* Outer Mobile Frame Container for Desktop, fluid on mobile */}
      <div className="w-full h-full md:h-[94vh] md:max-h-[920px] md:max-w-[440px] bg-[#0c1322] md:rounded-[44px] shadow-2xl md:border-[7px] md:border-[#1e293b] flex flex-col overflow-hidden relative text-white">
        
        {/* Android Status Bar */}
        <div className="w-full bg-[#0c1322]/90 backdrop-blur-md px-6 pt-3 pb-1 flex items-center justify-between z-40 shrink-0 text-xs text-slate-300">
          <span className="font-semibold tracking-wide font-sans">{currentTime}</span>
          
          {/* Front Camera cutout on desktop */}
          <div className="hidden md:block w-3.5 h-3.5 bg-black rounded-full border border-slate-700/60 shadow-inner"></div>

          <div className="flex items-center gap-1.5">
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-sans">98%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* Dynamic App Content Area */}
        <div className="flex-1 w-full overflow-y-auto overflow-x-hidden flex flex-col relative bg-[#090d16]">
          {children}
        </div>

        {/* Android Gesture Navigation Pill at Bottom */}
        <div className="w-full py-2 bg-[#0c1322] flex items-center justify-center shrink-0 z-40">
          <div className="w-32 h-1 bg-slate-600/60 rounded-full hover:bg-slate-400 transition-colors"></div>
        </div>
      </div>
    </div>
  );
};
