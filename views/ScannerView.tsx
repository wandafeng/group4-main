import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2, CheckCircle, Save, Sparkles, AlertCircle } from 'lucide-react';
import { identifyPhotocard } from '../services/geminiService';
import { Photocard, ScanResult } from '../types';

interface ScannerViewProps {
  onAddCard: (card: Photocard) => void;
}

export const ScannerView: React.FC<ScannerViewProps> = ({ onAddCard }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setResult(null); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) return;

    setIsAnalyzing(true);
    try {
      const base64Data = imagePreview.split(',')[1];
      const scanResult = await identifyPhotocard(base64Data);
      setResult(scanResult);
    } catch (error) {
      console.error("Analysis failed", error);
      alert("分析失敗，請重試！");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSave = () => {
    if (result && imagePreview) {
      const newCard: Photocard = {
        id: Date.now().toString(),
        idolName: result.idolName,
        groupName: result.groupName,
        albumOrEra: result.albumOrEra,
        estimatedPrice: result.estimatedPrice,
        rarity: result.rarity,
        imageUrl: imagePreview,
        dateAcquired: Date.now(),
      };
      onAddCard(newCard);
      setImagePreview(null);
      setResult(null);
      alert("✨ 成功加入卡冊！");
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 p-4 overflow-y-auto pb-28">
      <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-6 flex items-center gap-2">
        <Sparkles className="text-pink-500" /> AI 鑑定師
      </h2>

      {!imagePreview ? (
        <div className="flex-1 flex flex-col items-center justify-center border-4 border-dashed border-slate-200 rounded-[2rem] bg-white p-8 space-y-6 shadow-sm">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center shadow-inner">
            <Camera size={48} className="text-pink-500" />
          </div>
          <div className="text-center space-y-2">
            <p className="text-slate-800 font-bold text-lg">
                拍攝或上傳小卡
            </p>
            <p className="text-slate-500 text-sm max-w-xs mx-auto">
                讓 AI 幫你辨識這張卡的來源、時期，並估算目前的市場行情！
            </p>
          </div>
          <div className="flex gap-4 w-full">
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold transition-all shadow-xl shadow-slate-300"
             >
                <Upload size={20} />
                選擇照片
             </button>
             <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                className="hidden" 
             />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col space-y-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-pink-200 border-4 border-white bg-white">
            <img 
              src={imagePreview} 
              alt="Preview" 
              className="w-full h-auto max-h-[400px] object-contain bg-slate-50" 
            />
            {isAnalyzing && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center">
                <Loader2 size={56} className="text-pink-500 animate-spin mb-4" />
                <p className="text-slate-800 font-bold text-lg animate-pulse">正在查詢大數據...</p>
                <p className="text-slate-500 text-sm">分析卡面特徵與稀有度</p>
              </div>
            )}
          </div>

          {!result && !isAnalyzing && (
            <div className="flex gap-4">
               <button 
                  onClick={() => setImagePreview(null)}
                  className="flex-1 py-4 bg-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-300 transition-colors"
               >
                  重拍
               </button>
               <button 
                  onClick={handleAnalyze}
                  className="flex-1 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-bold shadow-lg shadow-pink-200 hover:shadow-pink-300 transition-all transform active:scale-95"
               >
                  開始鑑定
               </button>
            </div>
          )}

          {result && (
            <div className="bg-white border border-slate-100 rounded-[2rem] p-6 space-y-4 shadow-xl shadow-slate-200 animate-fade-in-up">
              <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                 <div>
                    <h3 className="text-2xl font-black text-slate-800">{result.idolName}</h3>
                    <p className="text-purple-500 font-bold flex items-center gap-1">
                        {result.groupName}
                    </p>
                 </div>
                 <div className="bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                    <CheckCircle size={14} />
                    鑑定完成
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-slate-50 p-4 rounded-2xl">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">來源 / 時期</p>
                    <p className="text-sm font-bold text-slate-700 leading-tight">{result.albumOrEra}</p>
                 </div>
                 <div className="bg-gradient-to-br from-pink-50 to-purple-50 p-4 rounded-2xl border border-pink-100">
                    <p className="text-xs text-pink-500 font-bold uppercase tracking-wider mb-1">市場估價</p>
                    <p className="text-lg font-black text-pink-600">{result.estimatedPrice}</p>
                 </div>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100 flex items-start gap-3">
                 <AlertCircle size={20} className="text-yellow-500 mt-0.5" />
                 <div>
                    <p className="text-xs text-yellow-600 font-bold uppercase tracking-wider mb-1">稀有度判定</p>
                    <p className="text-sm text-slate-700 font-medium">"{result.rarity}"</p>
                 </div>
              </div>

              <div className="pt-2 flex gap-4">
                 <button 
                    onClick={() => {
                        setImagePreview(null);
                        setResult(null);
                    }}
                    className="flex-1 py-3.5 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-slate-200"
                 >
                    放棄
                 </button>
                 <button 
                    onClick={handleSave}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-2xl font-bold shadow-lg"
                 >
                    <Save size={18} />
                    收入卡冊
                 </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};