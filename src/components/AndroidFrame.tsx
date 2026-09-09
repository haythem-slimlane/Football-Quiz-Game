import React from 'react';

interface AndroidFrameProps {
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-[#090d16] flex justify-center select-none">
      <div className="w-full max-w-lg min-h-screen bg-[#090d16] flex flex-col relative text-white">
        {/* Dynamic App Content Area */}
        <div className="flex-1 w-full flex flex-col relative bg-[#090d16]">
          {children}
        </div>
      </div>
    </div>
  );
};
