
import React, { useState } from 'react';
import { NavBar } from './components/NavBar';
import { ScheduleView } from './views/ScheduleView';
import { StampView } from './views/StampView';
import { HomeView } from './views/HomeView';
import { LyricGameView } from './views/LyricGameView'; // New
import { BlockGameView } from './views/BlockGameView'; // New
import { AppView, StampLocation, ScheduleEvent } from './types';

// Helper to generate dynamic dates relative to today
const getRelativeDate = (diffDays: number) => {
  const date = new Date();
  date.setDate(date.getDate() + diffDays);
  return date.toISOString().split('T')[0];
};

const today = new Date();
const currentYear = today.getFullYear();

// Initial Mock Data - Updated with Taiwan & Korea venues
// Note: imageUrls are kept for fallback but View will prefer plain styling by default now
const INITIAL_STAMPS: StampLocation[] = [
  { id: 'kr-1', name: '首爾 KSPO DOME', date: '2024.07.22', location: '首爾, 韓國', isCollected: true, imageUrl: '' },
  { id: 'tw-1', name: '台北小巨蛋 - World Tour', date: '2024.09.02', location: '台北, 台灣', isCollected: false, imageUrl: '' },
  { id: 'kr-2', name: '高尺天空巨蛋巡演', date: '2024.08.15', location: '首爾, 韓國', isCollected: false, imageUrl: '' },
  { id: 'tw-2', name: '高雄世運主場館', date: '2024.11.11', location: '高雄, 台灣', isCollected: false, imageUrl: '' },
  { id: 'kr-3', name: 'Inspire Arena 開幕秀', date: '2025.01.05', location: '仁川, 韓國', isCollected: false, imageUrl: '' },
];

const INITIAL_EVENTS: ScheduleEvent[] = [
  { 
    id: 'e1', groupName: 'BOYNEXTDOOR', title: '《HOW?》回歸 Showcase', date: getRelativeDate(2), time: '18:00', type: 'RELEASE', location: 'YES24 Live Hall', isAddedToMySchedule: false 
  },
  { 
    id: 'e2', groupName: 'BOYNEXTDOOR', title: 'M Countdown 打歌舞台', date: getRelativeDate(5), time: '17:00', type: 'BROADCAST', location: 'CJ E&M Center', isAddedToMySchedule: true 
  },
  { 
    id: 'e3', groupName: 'BOYNEXTDOOR', title: 'WOONHAK 生日直播', date: `${currentYear}-11-29`, time: '20:00', type: 'BIRTHDAY', isAddedToMySchedule: false 
  },
  { 
    id: 'e4', groupName: 'SEVENTEEN', title: 'FOLLOW Again to Incheon', date: getRelativeDate(-2), time: '18:00', type: 'CONCERT', location: 'Incheon Asiad Main Stadium', isAddedToMySchedule: false 
  },
  { 
    id: 'e5', groupName: 'IVE', title: 'SHOW WHAT I HAVE in Taipei', date: getRelativeDate(10), time: '19:00', type: 'CONCERT', location: 'NTSU Arena', isAddedToMySchedule: false 
  }
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [stamps, setStamps] = useState<StampLocation[]>(INITIAL_STAMPS);
  const [events, setEvents] = useState<ScheduleEvent[]>(INITIAL_EVENTS);

  const handleCollectStamp = (id: string) => {
    setStamps(prev => prev.map(s => 
      s.id === id ? { ...s, isCollected: true } : s
    ));
  };

  const handleRemoveStamp = (id: string) => {
    setStamps(prev => prev.map(s => 
      s.id === id ? { ...s, isCollected: false } : s
    ));
  };

  const handleUpdateStampPhoto = (id: string, photoUrl: string) => {
    setStamps(prev => prev.map(s => 
      s.id === id ? { ...s, userImageUrl: photoUrl } : s
    ));
  };

  const handleToggleMySchedule = (id: string) => {
    setEvents(prev => prev.map(e => 
      e.id === id ? { ...e, isAddedToMySchedule: !e.isAddedToMySchedule } : e
    ));
  };

  const handleAddEvent = (newEvent: ScheduleEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const handleUpdateEvent = (updatedEvent: ScheduleEvent) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  const renderView = () => {
    switch (currentView) {
      case AppView.HOME:
        return <HomeView onChangeView={setCurrentView} />;
      case AppView.SCHEDULE:
        return <ScheduleView events={events} onToggleMySchedule={handleToggleMySchedule} onAddEvent={handleAddEvent} onUpdateEvent={handleUpdateEvent} />;
      case AppView.STAMPS:
        return <StampView stamps={stamps} onCollectStamp={handleCollectStamp} onRemoveStamp={handleRemoveStamp} onUpdateStampPhoto={handleUpdateStampPhoto} />;
      case AppView.LYRIC_GAME:
        return <LyricGameView />;
      case AppView.BLOCK_GAME:
        return <BlockGameView />;
      default:
        return <HomeView onChangeView={setCurrentView} />;
    }
  };

  return (
    <div className="h-full w-full flex flex-col font-sans text-slate-900 bg-slate-50">
      <main className="flex-1 overflow-hidden relative">
        {renderView()}
      </main>
      <NavBar currentView={currentView} onChangeView={setCurrentView} />
    </div>
  );
};

export default App;
