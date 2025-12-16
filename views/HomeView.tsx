
import React from 'react';
import { AppView } from '../types';
import { CalendarRange, MapPin, Music2, Gamepad2, ChevronRight, User, Sparkles } from 'lucide-react';

interface HomeViewProps {
  onChangeView: (view: AppView) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onChangeView }) => {
  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-6 pb-32 space-y-8 custom-scrollbar">
      {/* Header */}
      <div className="pt-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-700">
            StanSpace
          </h1>
          <p className="text-slate-400 text-xs font-bold tracking-wide mt-1">追星，是生活的一部分。</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 border border-white overflow-hidden flex items-center justify-center text-slate-400">
           <User size={20} />
        </div>
      </div>

      {/* Main Feature: Schedule View */}
      <div 
        onClick={() => onChangeView(AppView.SCHEDULE)}
        className="relative h-60 rounded-[2rem] overflow-hidden cursor-pointer group shadow-lg shadow-slate-200 transition-all hover:scale-[1.01]"
      >
        {/* Changed image to a more abstract/calm concert vibe without text overlay */}
        <img 
          src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=1000&auto=format&fit=crop" 
          alt="Stage" 
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 saturate-0" 
        />
        <div className="absolute inset-0 bg-slate-900/30 group-hover:bg-slate-900/20 transition-colors" />
        
        {/* Content - Removed "LIVE NOW" badge to be cleaner */}
        <div className="absolute bottom-0 left-0 p-6 w-full">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <CalendarRange size={16} />
             </div>
             <span className="text-white/80 text-xs font-bold tracking-wider uppercase">Schedule</span>
          </div>
          <h2 className="text-3xl font-black text-white leading-tight">
            追星行程表
          </h2>
        </div>
        
        <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md p-2 rounded-full text-white border border-white/20">
            <ChevronRight size={20} />
        </div>
      </div>

      {/* Section: Games */}
      <div>
         <div className="flex items-center gap-2 mb-4 px-1">
            <h2 className="text-lg font-black text-slate-700">粉絲挑戰</h2>
            <div className="h-1 flex-1 bg-slate-100 rounded-full"></div>
         </div>
         
         <div className="grid grid-cols-2 gap-4">
            {/* Lyric Game */}
            <div 
                onClick={() => onChangeView(AppView.LYRIC_GAME)}
                className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-44"
            >
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-2 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                        <Music2 size={20} />
                    </div>
                </div>
                <div>
                    <h3 className="font-black text-slate-700 text-lg">猜歌詞</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">測測你的真愛粉指數</p>
                </div>
            </div>

            {/* Block Game */}
            <div 
                onClick={() => onChangeView(AppView.BLOCK_GAME)}
                className="bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between h-44"
            >
                <div className="flex justify-between items-start">
                    <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-2 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                        <Gamepad2 size={20} />
                    </div>
                </div>
                <div>
                    <h3 className="font-black text-slate-700 text-lg">拼團名</h3>
                    <p className="text-xs text-slate-400 mt-1 font-medium">收集字母拼出本命</p>
                </div>
            </div>
         </div>
      </div>

      {/* Section: Collection */}
      <div>
         <div 
            onClick={() => onChangeView(AppView.STAMPS)}
            className="bg-slate-800 rounded-[1.5rem] p-6 text-white shadow-lg shadow-slate-200 cursor-pointer group relative overflow-hidden flex items-center justify-between"
         >
            {/* Abstract geometric bg */}
            <div className="absolute -right-6 -top-6 w-32 h-32 bg-slate-700/50 rounded-full"></div>
            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-slate-700/30 rounded-full"></div>

            <div className="relative z-10 flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-700 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-white transition-colors">
                    <MapPin size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-black text-white">巡演護照</h3>
                    <p className="text-slate-400 text-xs font-medium">記錄每一場感動瞬間</p>
                </div>
            </div>
            <ChevronRight size={20} className="text-slate-500 group-hover:text-white transition-colors relative z-10" />
         </div>
      </div>
    </div>
  );
};
