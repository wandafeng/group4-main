
import React, { useRef, useEffect, useState } from 'react';
import { SeatInfo } from '../types';
import { X, Map as MapIcon, Upload, ArrowLeft, Camera, ZoomIn, ZoomOut, Eye } from 'lucide-react';

// Extend SeatInfo to include a static preview image
interface ExtendedSeatInfo extends SeatInfo {
  previewImage: string;
}

// 根據十字舞台結構重新定義的座標
const MOCK_SEATS: ExtendedSeatInfo[] = [
  // --- FLOOR (地面層 - 圍繞十字舞台) ---
  { 
    id: 'FW1', 
    section: '地面層 FW1區', 
    price: '$6,800', 
    viewDescription: '主舞台左側前方。能夠近距離看到成員在主舞台的側面編舞，以及走向延伸舞台的動線。', 
    x: 35, y: 45, // Left of cross
    previewImage: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'FN4', 
    section: '地面層 FN4區', 
    price: '$6,800', 
    viewDescription: '主舞台正前方搖滾區核心。雖然需仰頭看主舞台，但成員走過來時幾乎是面對面！', 
    x: 50, y: 32, // Top of cross
    previewImage: 'https://images.unsplash.com/photo-1459749411177-287ce35e8b95?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'FE2', 
    section: '地面層 FE2區', 
    price: '$6,800', 
    viewDescription: '主舞台右側。成員在右邊延伸舞台停留時，距離非常近，適合舉手幅。', 
    x: 65, y: 55, // Right of cross
    previewImage: 'https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'FS1', 
    section: '地面層 FS1區 (神席)', 
    price: '$6,800', 
    viewDescription: '十字延伸舞台正下方夾角！這是全場最核心的位置，被舞台包圍的沈浸感最強。', 
    x: 46, y: 64, // Bottom left nook
    previewImage: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=800&auto=format&fit=crop'
  },
  
  // --- 1st FLOOR (一樓看台 - 綠色區域) ---
  { 
    id: 'C21', 
    section: '1樓 C21區', 
    price: '$5,800', 
    viewDescription: '左側看台中央。視野無遮蔽，可以清楚看到舞台燈光效果與編舞隊形，性價比很高。', 
    x: 18, y: 50, // Left green ring
    previewImage: 'https://images.unsplash.com/photo-1514525253440-b393452e8d26?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'G19', 
    section: '1樓 G19區', 
    price: '$5,800', 
    viewDescription: '右側看台。距離舞台適中，適合想要舒服坐著看表演，又不想離太遠的粉絲。', 
    x: 82, y: 50, // Right green ring
    previewImage: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=800&auto=format&fit=crop'
  },
  
  // --- 2nd FLOOR (二樓看台/蛋頂 - 紅色區域) ---
  { 
    id: 'E22', 
    section: '2樓 E22區 (正面)', 
    price: '$4,800', 
    viewDescription: '正對舞台的高樓層。雖然人很小，但能完整欣賞全場手燈海與舞台雷射特效，氣氛滿分。', 
    x: 50, y: 10, // Top red ring
    previewImage: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'B05', 
    section: '2樓 B05區', 
    price: '$3,800', 
    viewDescription: '舞台側後方高樓層。主要看大螢幕，但離後台出入口較近，可能看到成員上下台的小動作。', 
    x: 25, y: 85, // Bottom blue ring left
    previewImage: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop'
  },
  { 
    id: 'H04', 
    section: '2樓 H04區', 
    price: '$3,800', 
    viewDescription: '右側後方視角。視野較偏，建議攜帶高倍率望遠鏡。', 
    x: 75, y: 85, // Bottom blue ring right
    previewImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop'
  }
];

// SVG Component to draw the stadium map programmatically matching user's specific image
const DefaultMapSVG = () => (
  <svg viewBox="0 0 800 1000" className="w-full h-full shadow-2xl bg-white rounded-[2rem]">
     {/* Background */}
     <rect width="800" height="1000" fill="#f8fafc" />
     
     {/* --- OUTER RING SECTIONS --- */}
     
     {/* Top Red/Orange Sections (E Zones) */}
     {/* E21-E29 Center Top */}
     <path d="M 250,150 Q 400,50 550,150 L 530,180 Q 400,100 270,180 Z" fill="#f87171" stroke="white" />
     <text x="400" y="130" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">E21-E29</text>
     
     {/* Side Top Red/Orange (E18-20, E30-32) */}
     <path d="M 150,250 Q 200,180 250,150 L 270,180 Q 220,210 180,270 Z" fill="#fb923c" stroke="white" /> {/* Left */}
     <path d="M 650,250 Q 600,180 550,150 L 530,180 Q 580,210 620,270 Z" fill="#fb923c" stroke="white" /> {/* Right */}

     {/* Side Green Sections (C & G Zones) */}
     {/* Left Green (C) */}
     <path d="M 100,300 Q 80,500 100,700 L 140,680 Q 120,500 140,320 Z" fill="#86efac" stroke="white" />
     <text x="110" y="500" textAnchor="middle" fill="#166534" fontSize="20" fontWeight="bold" transform="rotate(-90 110,500)">C ZONES</text>
     
     {/* Right Green (G) */}
     <path d="M 700,300 Q 720,500 700,700 L 660,680 Q 680,500 660,320 Z" fill="#86efac" stroke="white" />
     <text x="690" y="500" textAnchor="middle" fill="#166534" fontSize="20" fontWeight="bold" transform="rotate(90 690,500)">G ZONES</text>

     {/* Bottom Blue Sections (B & H Zones) */}
     {/* Left Blue (B) */}
     <path d="M 120,750 Q 200,900 350,920 L 350,880 Q 220,860 160,730 Z" fill="#0ea5e9" stroke="white" />
     <text x="200" y="850" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">B ZONES</text>

     {/* Right Blue (H) */}
     <path d="M 680,750 Q 600,900 450,920 L 450,880 Q 580,860 640,730 Z" fill="#0284c7" stroke="white" />
     <text x="600" y="850" textAnchor="middle" fill="white" fontSize="16" fontWeight="bold">H ZONES</text>


     {/* --- FLOOR AREA --- */}
     
     {/* Main Stage (Black Cross) */}
     <path d="M 350,450 L 450,450 L 450,510 L 600,510 L 600,550 L 450,550 L 450,680 L 350,680 L 350,550 L 200,550 L 200,510 L 350,510 Z" fill="#0f172a" stroke="white" strokeWidth="2" />
     <text x="400" y="535" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">STAGE</text>

     {/* FN Blocks (North - Purple) */}
     <path d="M 350,280 L 450,280 L 450,430 L 350,430 Z" fill="#818cf8" opacity="0.9" stroke="white" /> {/* FN4 Center */}
     <path d="M 240,300 L 340,280 L 340,480 L 280,440 Z" fill="#818cf8" opacity="0.9" stroke="white" /> {/* FN Left */}
     <path d="M 560,300 L 460,280 L 460,480 L 520,440 Z" fill="#818cf8" opacity="0.9" stroke="white" /> {/* FN Right */}
     <text x="400" y="350" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">FN</text>

     {/* Artist Zone (Orange - Flanking FN) */}
     <rect x="360" y="220" width="80" height="50" fill="#d97706" rx="5" />
     <text x="400" y="250" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">ARTIST</text>

     {/* FW Blocks (West - Purple) */}
     <path d="M 300,450 L 340,510 L 250,510 L 250,450 Z" fill="#a5b4fc" opacity="0.9" stroke="white" />
     <path d="M 250,520 L 340,520 L 300,600 L 250,600 Z" fill="#a5b4fc" opacity="0.9" stroke="white" />
     <text x="280" y="540" textAnchor="middle" fill="#4f46e5" fontSize="18" fontWeight="bold">FW</text>
     
     {/* FE Blocks (East - Purple) */}
     <path d="M 500,450 L 460,510 L 550,510 L 550,450 Z" fill="#a5b4fc" opacity="0.9" stroke="white" />
     <path d="M 550,520 L 460,520 L 500,600 L 550,600 Z" fill="#a5b4fc" opacity="0.9" stroke="white" />
     <text x="520" y="540" textAnchor="middle" fill="#4f46e5" fontSize="18" fontWeight="bold">FE</text>

     {/* FS Blocks (South - Purple) */}
     <path d="M 410,700 L 360,760 L 430,760 L 440,700 Z" fill="#818cf8" opacity="0.9" stroke="white" /> {/* FS Left Small */}
     <path d="M 450,700 L 460,760 L 360,760 Z" fill="none" /> 
     <path d="M 390,700 L 410,700 L 430,760 L 480,760 L 500,700 Z" fill="#818cf8" opacity="0.9" stroke="white" transform="translate(45, 0)" /> {/* FS Right Small */}
     <rect x="350" y="770" width="100" height="60" fill="#6366f1" opacity="0.9" stroke="white" /> {/* FS Main Center */}
     <text x="400" y="805" textAnchor="middle" fill="white" fontSize="20" fontWeight="bold">FS</text>

     {/* Artist Zones (Side) */}
     <rect x="180" y="450" width="40" height="120" fill="#d97706" rx="5" />
     <text x="200" y="515" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" transform="rotate(-90 200,515)">ARTIST</text>

     <rect x="580" y="450" width="40" height="120" fill="#d97706" rx="5" />
     <text x="600" y="515" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold" transform="rotate(90 600,515)">ARTIST</text>

     {/* Red Carpet Area */}
     <rect x="350" y="850" width="100" height="40" fill="#fda4af" rx="5" />
     <text x="400" y="875" textAnchor="middle" fill="#be123c" fontSize="10" fontWeight="bold">RED CARPET AREA</text>
     
     {/* Delay Towers */}
     <circle cx="280" cy="350" r="15" fill="#e2e8f0" stroke="#94a3b8" />
     <text x="280" y="355" textAnchor="middle" fontSize="6" fill="#64748b">TOWER</text>
     <circle cx="520" cy="350" r="15" fill="#e2e8f0" stroke="#94a3b8" />
     <text x="520" y="355" textAnchor="middle" fontSize="6" fill="#64748b">TOWER</text>

  </svg>
);

type ViewMode = 'MAP' | 'AR';

export const ARSeatView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('MAP');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<ExtendedSeatInfo | null>(null);
  const [permissionError, setPermissionError] = useState<boolean>(false);
  const [scale, setScale] = useState(1.2); // Default zoom slightly in
  
  // Use null initially to show SVG, or string for uploaded image
  const [mapImage, setMapImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Stop camera when component unmounts or switches mode
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Handle Camera Start
  useEffect(() => {
    const startCamera = async () => {
      if (viewMode !== 'AR') return;

      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setPermissionError(false);
      } catch (err) {
        console.warn("Back camera not found, trying fallback...", err);
        try {
            const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
                video: true 
            });
            setStream(fallbackStream);
            if (videoRef.current) {
                videoRef.current.srcObject = fallbackStream;
            }
            setPermissionError(false);
        } catch (err2) {
            console.error("No camera found:", err2);
            setPermissionError(true);
        }
      }
    };

    if (viewMode === 'AR') {
      startCamera();
    } else {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewMode]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setMapImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 4));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));

  return (
    <div className="relative h-full w-full bg-slate-900 overflow-hidden flex flex-col">
      
      {/* --- MAP MODE --- */}
      {viewMode === 'MAP' && (
        <div className="flex-1 relative bg-slate-100 flex flex-col overflow-hidden">
          {/* Top Controls */}
          <div className="absolute top-0 left-0 right-0 z-20 p-4 flex justify-between items-start pointer-events-none">
             <div className="bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl border border-pink-200 shadow-xl pointer-events-auto">
                <h2 className="text-slate-800 font-black flex items-center gap-2">
                   <MapIcon size={20} className="text-pink-500"/>
                   場館座位圖
                </h2>
                <p className="text-[10px] text-pink-500 font-bold mt-1">
                   {mapImage ? "已使用自訂地圖" : "Incheon Asiad Main Stadium"}
                </p>
             </div>
             
             <div className="flex flex-col gap-2 pointer-events-auto animate-bounce-slight">
               <button 
                 onClick={() => fileInputRef.current?.click()}
                 className="bg-slate-900 text-white p-3 rounded-full border-2 border-white shadow-xl hover:bg-slate-800 transition-colors flex items-center justify-center"
                 title="更換座位圖"
               >
                  <Upload size={20} />
               </button>
               <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
               />
             </div>
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-24 right-4 z-20 flex flex-col gap-2 pointer-events-auto">
            <button onClick={handleZoomIn} className="bg-white/95 p-3 rounded-full shadow-lg border border-slate-200 text-slate-700 hover:text-pink-500 active:scale-90 transition-all">
              <ZoomIn size={24} />
            </button>
            <button onClick={handleZoomOut} className="bg-white/95 p-3 rounded-full shadow-lg border border-slate-200 text-slate-700 hover:text-pink-500 active:scale-90 transition-all">
              <ZoomOut size={24} />
            </button>
          </div>

          {/* Scrollable Map Container */}
          <div className="flex-1 overflow-auto bg-slate-200 custom-scrollbar touch-pan-x touch-pan-y relative flex items-center justify-center">
             <div 
                className="relative transition-transform duration-200 ease-out p-10 min-w-full min-h-full flex items-center justify-center"
                style={{ 
                  transform: `scale(${scale})`,
                  transformOrigin: 'center center',
                }}
             >
                <div className="relative inline-block shadow-2xl rounded-[2rem] bg-white border-4 border-white">
                  {/* Toggle between SVG and Uploaded Image */}
                  <div style={{ width: '360px', height: '450px', position: 'relative' }}>
                    {mapImage ? (
                        <img 
                          src={mapImage} 
                          alt="Seat Map" 
                          className="w-full h-full object-contain select-none rounded-[1.5rem]"
                          draggable={false}
                        />
                    ) : (
                        <DefaultMapSVG />
                    )}
                  </div>
                  
                  {/* Pins overlayed on map - Position is relative to the image container */}
                  {MOCK_SEATS.map((seat) => (
                    <button
                      key={seat.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSeat(seat);
                      }}
                      style={{ top: `${seat.y}%`, left: `${seat.x}%` }}
                      className="absolute z-10 transform -translate-x-1/2 -translate-y-1/2 group"
                    >
                      <div className="relative flex flex-col items-center">
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full border-2 border-white bg-pink-600 text-white shadow-lg flex items-center justify-center hover:scale-125 transition-transform cursor-pointer hover:bg-pink-700 hover:z-50 animate-fade-in">
                          <span className="font-bold text-[8px] md:text-[9px]">{seat.id.substring(0,2)}</span>
                        </div>
                        <div className="w-0.5 h-2 bg-white/80 mx-auto mt-0 backdrop-blur-sm shadow-sm"></div>
                      </div>
                    </button>
                  ))}
                </div>
             </div>
          </div>
        </div>
      )}

      {/* --- AR MODE --- */}
      {viewMode === 'AR' && (
        <div className="flex-1 relative flex items-center justify-center bg-slate-900">
            <div className="absolute top-4 left-4 z-20">
                <button 
                  onClick={() => setViewMode('MAP')}
                  className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 shadow-lg flex items-center gap-2 text-white font-bold text-sm hover:bg-white/30 transition-all"
                >
                    <ArrowLeft size={16} />
                    返回地圖
                </button>
            </div>

            <div className="absolute top-4 right-4 z-20 bg-pink-500/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-400 shadow-lg flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <p className="text-white text-xs font-black uppercase tracking-wider">
                    AR 現場模擬
                </p>
            </div>

            {permissionError ? (
            <div className="text-center p-8 bg-white/10 rounded-3xl backdrop-blur-lg mx-6 border border-white/10">
                <p className="text-white font-bold text-lg mb-2">無法存取相機 📸</p>
                <p className="text-sm text-slate-300">請確認瀏覽器相機權限已開啟</p>
            </div>
            ) : (
            <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-80"
            />
            )}
            
            {/* AR Context Overlay */}
            {selectedSeat && (
                 <div className="absolute bottom-32 left-4 right-4 bg-black/50 backdrop-blur-md p-4 rounded-2xl border border-white/10 text-white">
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-pink-400">{selectedSeat.section}</span>
                        <span className="text-xs bg-white/20 px-2 py-0.5 rounded">模擬視角</span>
                    </div>
                    <p className="text-sm opacity-90">{selectedSeat.viewDescription}</p>
                 </div>
            )}
        </div>
      )}

      {/* Seat Details Modal (Visible in both modes if selected) */}
      {selectedSeat && (
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-200 rounded-t-[2.5rem] z-30 shadow-[0_-10px_50px_rgba(0,0,0,0.2)] transition-transform duration-300 animate-slide-up pb-safe max-h-[70vh] flex flex-col">
          {/* Handle bar for visual cue */}
          <div className="w-full flex justify-center pt-3 pb-1">
             <div className="w-12 h-1.5 bg-slate-200 rounded-full"></div>
          </div>

          <div className="p-6 pt-2 overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
                <div>
                <h3 className="text-2xl font-black text-slate-800 mb-1">{selectedSeat.section}</h3>
                <p className="text-pink-500 font-bold text-lg">{selectedSeat.price}</p>
                </div>
                <button 
                onClick={() => setSelectedSeat(null)}
                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200 transition-colors"
                >
                <X size={20} />
                </button>
            </div>

            {/* Simulated View Image */}
            <div className="relative w-full h-48 rounded-2xl overflow-hidden mb-4 shadow-md bg-slate-100 group">
                <img 
                    src={selectedSeat.previewImage} 
                    alt="View Preview" 
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
                    <p className="text-white text-xs font-bold flex items-center gap-1">
                        <Eye size={14} className="text-pink-400"/>
                        預計視野示意圖
                    </p>
                </div>
            </div>

            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-medium bg-slate-50 p-4 rounded-xl border border-slate-100">
                {selectedSeat.viewDescription}
            </p>
            
            {viewMode === 'MAP' ? (
                <button 
                    onClick={() => {
                        setViewMode('AR');
                        // Keep modal open so context is maintained
                        setSelectedSeat(selectedSeat); 
                    }}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                    <Camera size={20} />
                    開啟 AR 模擬實景
                </button>
            ) : (
                <button 
                    onClick={() => setViewMode('MAP')}
                    className="w-full py-4 bg-slate-100 text-slate-800 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95"
                >
                    返回座位圖
                </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
