
import React from 'react';
import { AppView } from '../types';
import { Home, CalendarRange, MapPin, Music2, Gamepad2 } from 'lucide-react';

interface NavBarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
}

export const NavBar: React.FC<NavBarProps> = ({ currentView, onChangeView }) => {
  const navItems = [
    { view: AppView.HOME, icon: Home, label: '首頁' },
    { view: AppView.SCHEDULE, icon: CalendarRange, label: '行程' },
    { view: AppView.LYRIC_GAME, icon: Music2, label: '猜歌詞' },
    { view: AppView.BLOCK_GAME, icon: Gamepad2, label: '拼團名' },
    { view: AppView.STAMPS, icon: MapPin, label: '集章' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-200 pb-safe pt-2 px-4 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {navItems.map((item) => {
          const isActive = currentView === item.view;
          return (
            <button
              key={item.view}
              onClick={() => onChangeView(item.view)}
              className={`flex flex-col items-center justify-center w-14 transition-all duration-300 ${
                isActive ? 'transform -translate-y-2' : ''
              }`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${
                isActive 
                  ? 'bg-slate-800 text-white shadow-lg shadow-slate-300' 
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
              }`}>
                <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] mt-1 font-bold ${isActive ? 'text-slate-800' : 'text-slate-300'}`}>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
