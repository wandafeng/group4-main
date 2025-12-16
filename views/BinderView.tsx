import React, { useState } from 'react';
import { Photocard } from '../types';
import { Search, Wallet, Sparkles, Trash2, AlertTriangle, X } from 'lucide-react';

interface BinderViewProps {
  cards: Photocard[];
  onDeleteCard: (id: string) => void;
}

export const BinderView: React.FC<BinderViewProps> = ({ cards, onDeleteCard }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cardToDelete, setCardToDelete] = useState<string | null>(null);

  // Rough estimate logic for demo
  const totalValue = cards.reduce((acc, card) => {
    const match = card.estimatedPrice.match(/\d+/g);
    if (match && match.length > 0) {
       const vals = match.map(Number);
       const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
       return acc + avg;
    }
    return acc;
  }, 0);

  const filteredCards = cards.filter(card => 
    card.idolName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    card.groupName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.albumOrEra.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const confirmDelete = () => {
    if (cardToDelete) {
        onDeleteCard(cardToDelete);
        setCardToDelete(null);
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-slate-50 p-4 pb-28 custom-scrollbar relative">
      <div className="flex justify-between items-end mb-6 pt-4">
        <div>
           <h2 className="text-3xl font-black text-slate-800 mb-1">我的卡冊</h2>
           <p className="text-slate-500 text-sm font-bold bg-slate-200 px-2 py-1 rounded-lg inline-block">
              目前收藏: {cards.length} 張
           </p>
        </div>
        <div className="text-right bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">預估總價值</p>
           <p className="text-2xl font-black text-green-500 flex items-center justify-end gap-1">
              <Wallet size={20} />
              ${totalValue.toFixed(0)}
           </p>
        </div>
      </div>

      <div className="relative mb-8">
        <input 
          type="text" 
          placeholder="搜尋本命、專輯..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-white border border-slate-200 text-slate-800 py-4 pl-12 pr-4 rounded-2xl focus:outline-none focus:border-pink-400 focus:ring-4 focus:ring-pink-100 transition-all shadow-sm font-medium"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
      </div>

      {cards.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
           <div className="w-20 h-20 bg-slate-100 rounded-full mb-4 flex items-center justify-center">
              <Sparkles size={32} className="text-slate-300" />
           </div>
           <p className="font-bold text-lg">卡冊還是空的 QAQ</p>
           <p className="text-sm mt-2">快用鑑定功能把你的收藏加進來！</p>
        </div>
      ) : filteredCards.length === 0 ? (
         <div className="text-center py-10 text-slate-400">
            <p>找不到符合的小卡...</p>
         </div>
      ) : (
        <div className="grid grid-cols-2 gap-5 pb-8">
          {filteredCards.map((card) => (
            <div key={card.id} className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-lg shadow-slate-200/50 hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 group relative">
              
              {/* Delete Button */}
              <button 
                onClick={(e) => {
                    e.stopPropagation();
                    setCardToDelete(card.id);
                }}
                className="absolute top-2 right-2 z-20 bg-white/90 p-2 rounded-full text-red-400 shadow-md backdrop-blur-sm opacity-100 hover:bg-red-50 hover:text-red-600 transition-all active:scale-90"
                aria-label="Delete card"
              >
                <Trash2 size={16} />
              </button>

              <div className="aspect-[3/4] relative overflow-hidden bg-slate-100">
                <img 
                  src={card.imageUrl} 
                  alt={card.idolName} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                   <p className="text-xs text-white font-bold bg-white/20 backdrop-blur-md px-2 py-1 rounded-lg w-fit">
                      {card.albumOrEra}
                   </p>
                </div>
              </div>
              
              <div className="p-4">
                <div className="mb-3">
                     <h3 className="font-black text-slate-800 text-base">{card.idolName}</h3>
                     <p className="text-xs text-purple-500 font-bold">{card.groupName}</p>
                </div>
                
                <div className="flex flex-col gap-2">
                   <div className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 truncate">
                      {card.rarity}
                   </div>
                   <div className="text-sm font-black text-pink-500 text-right">
                      {card.estimatedPrice}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {cardToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-6 animate-fade-in">
            <div className="bg-white rounded-[2rem] p-6 w-full max-w-sm shadow-2xl animate-scale-up">
                <div className="flex items-center gap-3 text-red-500 mb-4">
                    <div className="bg-red-100 p-3 rounded-full">
                        <AlertTriangle size={24} />
                    </div>
                    <h3 className="text-xl font-black text-slate-800">確定要刪除嗎？</h3>
                </div>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                    這張小卡將會從你的卡冊中永久移除，這個動作無法復原喔！
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={() => setCardToDelete(null)}
                        className="flex-1 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-colors"
                    >
                        保留
                    </button>
                    <button 
                        onClick={confirmDelete}
                        className="flex-1 py-4 bg-red-500 text-white font-bold rounded-2xl shadow-lg shadow-red-200 hover:bg-red-600 transition-colors"
                    >
                        刪除
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};