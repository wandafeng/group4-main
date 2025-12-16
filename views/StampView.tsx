
import React, { useState, useRef } from 'react';
import { StampLocation } from '../types';
import { MapPin, Check, Calendar, X, Share2, Camera, Edit3, Stamp, Trash2 } from 'lucide-react';

interface StampViewProps {
  stamps: StampLocation[];
  onCollectStamp: (id: string) => void;
  onRemoveStamp: (id: string) => void;
  onUpdateStampPhoto: (id: string, photoUrl: string) => void;
}

export const StampView: React.FC<StampViewProps> = ({ stamps, onCollectStamp, onRemoveStamp, onUpdateStampPhoto }) => {
  const [selectedStamp, setSelectedStamp] = useState<StampLocation | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCollect = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    onCollectStamp(id);
    const stamp = stamps.find(s => s.id === id);
    if(stamp) setSelectedStamp({...stamp, isCollected: true});
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedStamp) {
        onRemoveStamp(selectedStamp.id);
        setSelectedStamp({...selectedStamp, isCollected: false});
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && selectedStamp) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        onUpdateStampPhoto(selectedStamp.id, result);
        // Update local selected state to show change immediately
        setSelectedStamp({ ...selectedStamp, userImageUrl: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 pb-28 custom-scrollbar">
      <div className="mb-8 pt-4">
        <h2 className="text-3xl font-black text-slate-700 mb-2">演唱會護照</h2>
        <p className="text-slate-400 font-medium">蒐集每一場巡演的專屬印章，記錄里程！</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
        {stamps.map((stamp) => (
          <div 
            key={stamp.id}
            onClick={() => setSelectedStamp(stamp)}
            className={`relative rounded-[2rem] overflow-hidden transition-all duration-300 cursor-pointer group flex flex-col ${
              stamp.isCollected 
                ? 'bg-white border-2 border-slate-300 shadow-xl shadow-slate-200 transform scale-[1.02]' 
                : 'bg-white border border-slate-200 shadow-sm'
            }`}
          >
            {/* Background Image / Plain Pattern */}
            <div className="h-32 w-full relative overflow-hidden bg-slate-100">
               {stamp.userImageUrl ? (
                 <>
                    <img 
                        src={stamp.userImageUrl} 
                        alt={stamp.location} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-slate-900/10" />
                 </>
               ) : (
                 // Plain Pattern for "素色" request
                 <div className="w-full h-full bg-slate-100 flex items-center justify-center overflow-hidden relative">
                    {/* Subtle geometric decoration */}
                    <div className="absolute -right-4 -top-8 w-32 h-32 bg-slate-200/50 rounded-full blur-2xl"></div>
                    <div className="absolute -left-4 -bottom-8 w-32 h-32 bg-slate-200/50 rounded-full blur-2xl"></div>
                    <MapPin className="text-slate-200" size={64} />
                 </div>
               )}

              {/* Smaller Light Blue Stamp Icon */}
              {stamp.isCollected && (
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-slate-100 animate-scale-up">
                   <Stamp size={20} className="text-sky-400" />
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-black text-slate-800 mb-1">{stamp.name}</h3>
              <div className="flex items-center text-slate-500 text-xs mb-4 space-x-2 font-bold">
                 <span className="bg-slate-50 px-2 py-1 rounded text-slate-400">{stamp.location}</span>
                 <span className="text-slate-300">•</span>
                 <span className="text-slate-400">{stamp.date}</span>
              </div>

              <div className="mt-auto">
                {stamp.isCollected ? (
                    <div className="w-full py-3 bg-sky-50 text-sky-500 font-bold text-sm text-center rounded-xl border border-sky-100 flex items-center justify-center gap-2">
                        <Check size={16} />
                        已蓋章
                    </div>
                ) : (
                    <button
                    onClick={(e) => handleCollect(e, stamp.id)}
                    className="w-full py-3 bg-slate-800 text-white font-bold text-sm rounded-xl hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 shadow-lg active:scale-95"
                    >
                    <Stamp size={16} />
                    現場打卡
                    </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedStamp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-fade-in">
           <div 
             className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl animate-scale-up flex flex-col max-h-[85vh] overflow-hidden"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="relative h-64 shrink-0 group bg-slate-100">
                 {selectedStamp.userImageUrl ? (
                    <img 
                        src={selectedStamp.userImageUrl} 
                        alt={selectedStamp.name} 
                        className="w-full h-full object-cover"
                    />
                 ) : (
                    <div className="w-full h-full bg-slate-100 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-200"></div>
                        <div className="absolute right-0 top-0 w-48 h-48 bg-white/20 rounded-full blur-3xl transform translate-x-10 -translate-y-10"></div>
                        <MapPin className="text-slate-300 relative z-10" size={80} strokeWidth={1.5} />
                    </div>
                 )}

                 <button 
                   onClick={() => setSelectedStamp(null)}
                   className="absolute top-4 right-4 bg-white/40 hover:bg-white/60 text-slate-800 p-2 rounded-full backdrop-blur-md transition-all z-20 shadow-sm"
                 >
                    <X size={20} />
                 </button>

                 {/* Photo Edit Button */}
                 <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute top-4 left-4 bg-white/40 hover:bg-white/60 text-slate-800 px-3 py-2 rounded-full backdrop-blur-md transition-all z-20 flex items-center gap-2 font-bold text-xs shadow-sm"
                 >
                    <Camera size={16} />
                    {selectedStamp.userImageUrl ? '更換照片' : '上傳認證照'}
                 </button>
                 <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                 />

                 {selectedStamp.isCollected && (
                   <div className="absolute bottom-4 right-4 bg-sky-400 text-white px-3 py-1.5 rounded-xl shadow-lg border-2 border-white flex items-center gap-1.5 animate-bounce-slight">
                       <Stamp size={16} fill="currentColor" className="text-white" />
                       <span className="text-xs font-black">COMPLETED</span>
                   </div>
                 )}
              </div>
              
              <div className="p-6 overflow-y-auto">
                 <h2 className="text-2xl font-black text-slate-800 mb-2">{selectedStamp.name}</h2>
                 
                 <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-slate-600 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
                          <Calendar size={20} />
                       </div>
                       <div>
                          <p className="text-xs text-slate-400 uppercase">Date</p>
                          <p>{selectedStamp.date}</p>
                       </div>
                    </div>
                    
                    <div className="flex items-center gap-3 text-slate-600 font-bold bg-slate-50 p-3 rounded-xl border border-slate-100">
                       <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
                          <MapPin size={20} />
                       </div>
                       <div>
                          <p className="text-xs text-slate-400 uppercase">Location</p>
                          <p>{selectedStamp.location}</p>
                       </div>
                    </div>
                 </div>

                 {!selectedStamp.isCollected ? (
                     <button 
                       onClick={(e) => handleCollect(e, selectedStamp.id)}
                       className="w-full py-4 bg-slate-800 text-white font-bold rounded-2xl hover:bg-slate-700 shadow-xl shadow-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2 mb-2"
                     >
                        <Stamp size={20} />
                        立即打卡
                     </button>
                 ) : (
                    <div className="space-y-3">
                        <button className="w-full py-4 bg-slate-100 text-slate-700 font-bold rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-colors">
                            <Share2 size={20} />
                            分享我的成就
                        </button>

                        <div className="flex items-center justify-center pt-2">
                             <button 
                                onClick={handleRemove}
                                className="text-slate-400 text-xs font-bold flex items-center gap-1 hover:text-red-400 transition-colors px-4 py-2"
                             >
                                <Trash2 size={12} />
                                取消打卡 (誤按復原)
                             </button>
                        </div>
                    </div>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
