
import React, { useState, useRef } from 'react';
import { ScheduleEvent, EventType } from '../types';
import { Search, Calendar, MapPin, CheckCircle2, PlusCircle, Mic2, Tv, Gift, Music, Plus, X, Save, Camera, Edit3, Image as ImageIcon } from 'lucide-react';

interface ScheduleViewProps {
  events: ScheduleEvent[];
  onToggleMySchedule: (id: string) => void;
  onAddEvent: (event: ScheduleEvent) => void;
  onUpdateEvent: (event: ScheduleEvent) => void;
}

// Helper to get color/icon based on event type - Muted/Slate style
const getEventTypeStyle = (type: EventType) => {
  switch (type) {
    case 'CONCERT':
      return { bg: 'bg-slate-800', text: 'text-white', icon: Music, label: '演唱會' };
    case 'BROADCAST':
      return { bg: 'bg-slate-200', text: 'text-slate-700', icon: Tv, label: '放送' };
    case 'FANMEETING':
      return { bg: 'bg-slate-200', text: 'text-slate-700', icon: Mic2, label: '見面會' };
    case 'BIRTHDAY':
      return { bg: 'bg-slate-200', text: 'text-slate-700', icon: Gift, label: '生日' };
    case 'RELEASE':
      return { bg: 'bg-slate-800', text: 'text-white', icon: Calendar, label: '回歸' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-600', icon: Calendar, label: '活動' };
  }
};

const POPULAR_GROUPS = ['BOYNEXTDOOR', 'SEVENTEEN', 'IVE', 'NewJeans', 'AESPA'];

export const ScheduleView: React.FC<ScheduleViewProps> = ({ events, onToggleMySchedule, onAddEvent, onUpdateEvent }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'MY'>('ALL');
  
  // Add Event Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<ScheduleEvent>>({
    groupName: '',
    title: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    type: 'CONCERT',
    location: ''
  });

  // Detail/Diary Modal State
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [diaryNote, setDiaryNote] = useState('');
  const [diaryPhoto, setDiaryPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Current Month Logic
  const [currentDate, setCurrentDate] = useState(new Date());
  const displayMonth = currentDate.getMonth(); // 0-11
  const displayYear = currentDate.getFullYear();

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') newDate.setMonth(newDate.getMonth() - 1);
    else newDate.setMonth(newDate.getMonth() + 1);
    setCurrentDate(newDate);
  };

  // Filter Logic
  const filteredEvents = events.filter(event => {
    const eventDate = new Date(event.date);
    const isSameMonth = eventDate.getMonth() === displayMonth && eventDate.getFullYear() === displayYear;

    const matchesSearch = 
      (event.groupName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterType === 'MY') {
      return matchesSearch && event.isAddedToMySchedule;
    }
    
    // If searching, ignore month constraint
    if (searchTerm) {
        return matchesSearch;
    }
    
    return isSameMonth && matchesSearch;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEvent.title && newEvent.groupName && newEvent.date) {
        onAddEvent({
            id: Date.now().toString(),
            groupName: newEvent.groupName,
            title: newEvent.title,
            date: newEvent.date,
            time: newEvent.time || '00:00',
            type: newEvent.type as EventType,
            location: newEvent.location,
            isAddedToMySchedule: true
        } as ScheduleEvent);
        setIsAddModalOpen(false);
        setNewEvent({ ...newEvent, title: '', location: '' });
    }
  };

  const handleOpenDetail = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setDiaryNote(event.userNotes || '');
    setDiaryPhoto(event.userPhoto || null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDiaryPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveDetail = () => {
    if (selectedEvent) {
      onUpdateEvent({
        ...selectedEvent,
        userNotes: diaryNote,
        userPhoto: diaryPhoto || undefined
      });
      setSelectedEvent(null);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 relative">
      {/* Top Bar */}
      <div className="px-4 pt-6 pb-2 bg-white shadow-sm z-10 border-b border-slate-100">
        <h2 className="text-2xl font-black text-slate-700 mb-4 flex items-center gap-2">
           <Calendar className="text-slate-700" /> 
           追星行事曆
        </h2>
        
        {/* Month Selector */}
        <div className="flex items-center justify-between bg-slate-100 rounded-xl p-1 mb-4">
           <button onClick={() => handleMonthChange('prev')} className="p-2 text-slate-400 hover:text-slate-700 font-bold">
              &lt;
           </button>
           <span className="font-black text-slate-700">
              {displayYear}年 {displayMonth + 1}月
           </span>
           <button onClick={() => handleMonthChange('next')} className="p-2 text-slate-400 hover:text-slate-700 font-bold">
              &gt;
           </button>
        </div>
        
        {/* Search */}
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="搜尋團體 (例如: BOYNEXTDOOR)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 text-slate-800 py-3 pl-10 pr-4 rounded-2xl focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 font-bold placeholder-slate-400 transition-all"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
        </div>

        {/* Quick Tags */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar no-scrollbar">
           {POPULAR_GROUPS.map(group => (
             <button
               key={group}
               onClick={() => setSearchTerm(group)}
               className="whitespace-nowrap px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-colors"
             >
               #{group}
             </button>
           ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex mt-2">
           <button 
             onClick={() => setFilterType('ALL')}
             className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${filterType === 'ALL' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400'}`}
           >
             所有行程
           </button>
           <button 
             onClick={() => setFilterType('MY')}
             className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${filterType === 'MY' ? 'border-slate-800 text-slate-800' : 'border-transparent text-slate-400'}`}
           >
             我的行程 ({events.filter(e => e.isAddedToMySchedule).length})
           </button>
        </div>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-28 custom-scrollbar bg-slate-50">
        {sortedEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
             <Calendar size={48} className="text-slate-200 mb-4" />
             <p className="font-bold">本月沒有相關行程</p>
             <p className="text-xs mt-2 text-slate-300">可以試試看搜尋其他月份或團體</p>
          </div>
        ) : (
          sortedEvents.map((event) => {
            const style = getEventTypeStyle(event.type);
            const Icon = style.icon;

            return (
              <div 
                key={event.id} 
                onClick={() => handleOpenDetail(event)}
                className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex gap-4 transition-all hover:border-slate-300 cursor-pointer active:scale-[0.99]"
              >
                {/* Date Box */}
                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-xl w-14 h-14 shrink-0 border border-slate-200">
                   <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{new Date(event.date).toLocaleString('en-US', { month: 'short' })}</span>
                   <span className="text-xl font-black text-slate-700 leading-none">{new Date(event.date).getDate()}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                   <div className="flex items-center gap-2 mb-1">
                      <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${style.bg} ${style.text}`}>
                         {style.label}
                      </div>
                      <span className="text-xs font-bold text-slate-400">{event.time}</span>
                   </div>
                   
                   <h3 className="text-base font-black text-slate-800 truncate leading-tight">{event.title}</h3>
                   <div className="flex justify-between items-center mt-1">
                     <p className="text-xs font-bold text-slate-500">{event.groupName}</p>
                     {(event.userPhoto || event.userNotes) && (
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
                           <Edit3 size={8} /> 已記錄
                        </span>
                     )}
                   </div>
                </div>

                {/* Quick Toggle Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleMySchedule(event.id);
                  }}
                  className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all self-center ${
                    event.isAddedToMySchedule 
                      ? 'bg-slate-800 text-white shadow-lg shadow-slate-300' 
                      : 'bg-slate-50 text-slate-300 hover:bg-slate-200 hover:text-slate-500'
                  }`}
                >
                  {event.isAddedToMySchedule ? <CheckCircle2 size={18} /> : <PlusCircle size={18} />}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={() => setIsAddModalOpen(true)}
        className="absolute bottom-24 right-6 w-14 h-14 bg-slate-800 rounded-full shadow-xl shadow-slate-300 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-20"
      >
        <Plus size={28} />
      </button>

      {/* Detail / Diary Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl animate-scale-up overflow-hidden max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="relative bg-slate-50 p-6 shrink-0 border-b border-slate-100">
                 <button 
                    onClick={() => setSelectedEvent(null)}
                    className="absolute top-4 right-4 bg-slate-200 hover:bg-slate-300 p-2 rounded-full transition-colors text-slate-600"
                 >
                    <X size={20} />
                 </button>
                 <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">{selectedEvent.groupName}</p>
                 <h2 className="text-2xl font-black leading-tight mb-2 text-slate-800">{selectedEvent.title}</h2>
                 <div className="flex items-center gap-4 text-sm font-bold text-slate-500">
                    <div className="flex items-center gap-1">
                        <Calendar size={14} /> {selectedEvent.date}
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin size={14} /> {selectedEvent.location || '線上'}
                    </div>
                 </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6">
                 {/* Photo Upload Section */}
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                        <Camera size={14} /> 認證照 / 票根
                    </label>
                    <div 
                        onClick={() => photoInputRef.current?.click()}
                        className={`w-full aspect-video rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer overflow-hidden relative group transition-all hover:border-slate-400 ${!diaryPhoto ? 'bg-slate-50 hover:bg-slate-100' : 'bg-black'}`}
                    >
                        {diaryPhoto ? (
                            <>
                                <img src={diaryPhoto} alt="Diary" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-white font-bold flex items-center gap-2"><Edit3 size={16}/> 更換照片</p>
                                </div>
                            </>
                        ) : (
                            <div className="text-slate-400 text-center">
                                <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm font-bold">點擊上傳照片</p>
                                <p className="text-xs">記錄美好瞬間</p>
                            </div>
                        )}
                        <input type="file" ref={photoInputRef} className="hidden" accept="image/*" onChange={handlePhotoUpload} />
                    </div>
                 </div>

                 {/* Diary Text Area */}
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase flex items-center gap-1">
                        <Edit3 size={14} /> 追星日記
                    </label>
                    <textarea 
                        className="w-full h-32 bg-slate-50 border border-slate-200 rounded-2xl p-4 font-medium text-slate-700 focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 resize-none placeholder-slate-400"
                        placeholder="寫下今天的心情、應援紀錄或是觀後感吧..."
                        value={diaryNote}
                        onChange={(e) => setDiaryNote(e.target.value)}
                    />
                 </div>

                 <button 
                    onClick={handleSaveDetail}
                    className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl shadow-lg hover:bg-slate-700 flex items-center justify-center gap-2 active:scale-95 transition-all"
                 >
                    <Save size={18} />
                    儲存日記
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
           <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl animate-scale-up overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                 <h3 className="text-xl font-black text-slate-800">新增追星行程</h3>
                 <button onClick={() => setIsAddModalOpen(false)} className="bg-white p-2 rounded-full text-slate-400 hover:text-slate-600 shadow-sm">
                    <X size={20} />
                 </button>
              </div>
              
              <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">團體名稱</label>
                    <input 
                      type="text" 
                      required
                      placeholder="例如: BOYNEXTDOOR"
                      value={newEvent.groupName}
                      onChange={e => setNewEvent({...newEvent, groupName: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                 </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">行程標題</label>
                    <input 
                      type="text" 
                      required
                      placeholder="例如: 回歸直播"
                      value={newEvent.title}
                      onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">日期</label>
                        <input 
                        type="date" 
                        required
                        value={newEvent.date}
                        onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">時間</label>
                        <input 
                        type="time" 
                        required
                        value={newEvent.time}
                        onChange={e => setNewEvent({...newEvent, time: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">類型</label>
                        <select 
                            value={newEvent.type}
                            onChange={e => setNewEvent({...newEvent, type: e.target.value as EventType})}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100 appearance-none"
                        >
                            <option value="CONCERT">演唱會</option>
                            <option value="BROADCAST">放送/直播</option>
                            <option value="FANMEETING">見面會</option>
                            <option value="RELEASE">回歸發布</option>
                            <option value="BIRTHDAY">成員生日</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">地點 (選填)</label>
                        <input 
                        type="text" 
                        placeholder="選填"
                        value={newEvent.location}
                        onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-bold focus:outline-none focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                        />
                    </div>
                 </div>

                 <button 
                   type="submit"
                   className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl shadow-lg mt-4 flex items-center justify-center gap-2 hover:bg-slate-700 transition-all active:scale-95"
                 >
                    <Save size={18} />
                    確認新增
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};
