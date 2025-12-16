
import React, { useState, useEffect, useRef } from 'react';
import { Gamepad2, Play, RefreshCw, Trophy } from 'lucide-react';

interface Block {
  id: number;
  char: string;
  x: number;
  y: number;
  status: 'SCATTERED' | 'COLLECTED';
}

const LEVELS = [
  { group: 'BOYNEXTDOOR', color: 'bg-slate-600' },
  { group: 'SEVENTEEN', color: 'bg-slate-500' },
  { group: 'NEWJEANS', color: 'bg-indigo-400' },
  { group: 'LESSERAFIM', color: 'bg-slate-700' },
  { group: 'TWICE', color: 'bg-slate-400' },
  { group: 'BTS', color: 'bg-slate-800' },
  { group: 'BLACKPINK', color: 'bg-slate-900' },
  { group: 'STRAYKIDS', color: 'bg-slate-600' },
  { group: 'GIDLE', color: 'bg-slate-500' },
  { group: 'IVE', color: 'bg-indigo-500' },
  { group: 'AESPA', color: 'bg-slate-700' },
  { group: 'TXT', color: 'bg-blue-400' },
  { group: 'ENHYPEN', color: 'bg-slate-600' },
  { group: 'NMIXX', color: 'bg-slate-400' },
  { group: 'ITZY', color: 'bg-slate-500' },
  { group: 'RIIZE', color: 'bg-orange-300' },
  { group: 'TWS', color: 'bg-blue-300' },
  { group: 'BABYMONSTER', color: 'bg-red-800' }
];

// Simple pixel avatar component
const PixelAvatar = ({ x, y, isMoving }: { x: number, y: number, isMoving: boolean }) => (
  <div 
    className="absolute w-12 h-12 z-20 transition-all duration-500 ease-in-out flex flex-col items-center justify-end pointer-events-none"
    style={{ left: x, top: y }}
  >
    {/* Head */}
    <div className={`w-8 h-8 bg-slate-200 rounded-md border-2 border-slate-800 relative ${isMoving ? 'animate-bounce' : ''}`}>
       {/* Eyes */}
       <div className="absolute top-3 left-1 w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
       <div className="absolute top-3 right-1 w-1.5 h-1.5 bg-slate-800 rounded-full"></div>
       {/* Mouth */}
       <div className="absolute bottom-2 left-3 w-2 h-1 bg-slate-400 rounded-sm"></div>
    </div>
    {/* Body */}
    <div className="w-6 h-4 bg-slate-600 border-2 border-slate-800 -mt-1 rounded-sm"></div>
    {/* Name Tag */}
    <div className="absolute -top-6 bg-slate-800 text-white text-[8px] px-1 rounded">STAN</div>
  </div>
);

export const BlockGameView: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [levelIndex, setLevelIndex] = useState(0);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [avatarPos, setAvatarPos] = useState({ x: 150, y: 150 });
  const [isMoving, setIsMoving] = useState(false);
  const [collectedChars, setCollectedChars] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'WIN'>('START');

  const currentLevel = LEVELS[levelIndex];
  const targetWord = currentLevel.group;

  // Function to check if a new position overlaps with existing blocks
  const checkOverlap = (x: number, y: number, existingBlocks: Block[], minDistance: number) => {
    for (const block of existingBlocks) {
      const distance = Math.hypot(x - block.x, y - block.y);
      if (distance < minDistance) {
        return true;
      }
    }
    return false;
  };

  // Initialize blocks randomly with collision detection
  const initLevel = () => {
    if (!containerRef.current) return;
    
    const chars = targetWord.split('');
    const containerW = containerRef.current.clientWidth;
    const containerH = containerRef.current.clientHeight;
    
    // Margins to keep blocks inside container
    const marginX = 20; 
    const marginY = 60; // More margin at top for visibility
    const safeW = containerW - marginX * 2 - 48; // 48 is roughly block size
    const safeH = containerH - marginY - 20 - 48;

    const newBlocks: Block[] = [];
    const minDistance = 60; // Minimum distance between block centers (48px block + gap)

    chars.forEach((char, index) => {
      let x, y;
      let attempts = 0;
      let overlap = true;

      // Try up to 50 times to find a non-overlapping position
      while (overlap && attempts < 50) {
        x = Math.random() * safeW + marginX;
        y = Math.random() * safeH + marginY;
        overlap = checkOverlap(x, y, newBlocks, minDistance);
        attempts++;
      }
      
      // If we failed to find a spot (very crowded), just place it anyway to prevent crash
      if (overlap) {
         x = Math.random() * safeW + marginX;
         y = Math.random() * safeH + marginY;
      }

      newBlocks.push({
        id: index,
        char,
        x: x!,
        y: y!,
        status: 'SCATTERED'
      });
    });

    setBlocks(newBlocks);
    setCollectedChars([]);
    // Start avatar in center
    setAvatarPos({ x: (containerW / 2) - 24, y: (containerH / 2) - 24 });
    setGameState('PLAYING');
  };

  const handleBlockClick = (blockId: number) => {
    if (isMoving || gameState !== 'PLAYING') return;

    const block = blocks.find(b => b.id === blockId);
    if (!block || block.status === 'COLLECTED') return;

    // Check if this is the correct next letter
    const nextNeededIndex = collectedChars.length;
    if (block.char !== targetWord[nextNeededIndex]) {
        // Shake animation logic could go here
        return; 
    }

    setIsMoving(true);

    // 1. Move Avatar to Block
    setAvatarPos({ x: block.x - 10, y: block.y - 40 }); // Offset to stand above block

    // 2. Wait for move, then "pick up"
    setTimeout(() => {
        setIsMoving(false);
        
        // Mark block as collected
        setBlocks(prev => prev.map(b => b.id === blockId ? { ...b, status: 'COLLECTED' } : b));
        setCollectedChars(prev => [...prev, block.char]);

        // Check Win
        if (collectedChars.length + 1 === targetWord.length) {
            setTimeout(() => setGameState('WIN'), 500);
        }

    }, 500); // Matches CSS transition duration
  };

  const nextRandomLevel = () => {
    // Pick a random level different from current one
    let nextIndex;
    do {
        nextIndex = Math.floor(Math.random() * LEVELS.length);
    } while (nextIndex === levelIndex && LEVELS.length > 1);

    setLevelIndex(nextIndex);
    setGameState('START');
  };

  // Auto init on start
  useEffect(() => {
    if (gameState === 'START' && containerRef.current) {
        // slight delay to ensure render
        setTimeout(initLevel, 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, levelIndex]);

  return (
    <div className="h-full flex flex-col bg-slate-50 p-4 pb-28 custom-scrollbar">
      <div className="pt-4 mb-2 text-center">
        <h2 className="text-3xl font-black text-slate-700 flex items-center justify-center gap-2">
          <Gamepad2 className="text-slate-500" /> 拼團名大作戰
        </h2>
        <p className="text-slate-400 text-sm font-bold">點擊方塊，幫小人收集字母！</p>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col">
        {/* Answer Zone - Single Row, No Scroll, Fit All */}
        <div className="bg-white rounded-2xl border-b-4 border-slate-200 mb-4 p-3 flex items-center justify-center shadow-sm min-h-[5rem]">
            <div className="flex gap-1 w-full justify-center">
                {targetWord.split('').map((char, idx) => (
                    <div 
                        key={idx}
                        className={`
                            flex-1 max-w-10 h-12 rounded-lg flex items-center justify-center font-black border-2 transition-all shrink
                            ${targetWord.length > 8 ? 'text-base' : 'text-xl'}
                            ${
                            idx < collectedChars.length 
                            ? 'bg-slate-700 text-white border-slate-800 shadow-sm' 
                            : 'bg-slate-50 text-slate-300 border-slate-200 dashed'
                        }`}
                    >
                        {idx < collectedChars.length ? char : ''}
                    </div>
                ))}
            </div>
        </div>

        {/* Play Area */}
        <div 
            ref={containerRef}
            className="flex-1 bg-slate-200 rounded-[2rem] relative overflow-hidden shadow-inner border-4 border-slate-300"
        >
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

            {gameState === 'WIN' ? (
                <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-50 animate-fade-in">
                    <Trophy size={64} className="text-yellow-400 mb-4 animate-bounce" />
                    <h2 className="text-3xl font-black text-white mb-2">拼字成功!</h2>
                    <p className="text-white/80 font-bold mb-6">團體: {targetWord}</p>
                    <button 
                        onClick={nextRandomLevel}
                        className="px-8 py-3 bg-white text-slate-900 rounded-full font-black shadow-lg hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Play fill="currentColor" size={16} /> 下一關
                    </button>
                </div>
            ) : (
                <>
                    {/* The Blocks */}
                    {blocks.map(block => (
                        <button
                            key={block.id}
                            onClick={() => handleBlockClick(block.id)}
                            disabled={block.status === 'COLLECTED'}
                            className={`absolute w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl shadow-[0_4px_0_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all duration-300 ${
                                block.status === 'COLLECTED' 
                                ? 'scale-0 opacity-0' 
                                : `${currentLevel.color} text-white border-2 border-white/20 hover:scale-110`
                            }`}
                            style={{ 
                                left: block.x, 
                                top: block.y,
                                cursor: 'pointer' 
                            }}
                        >
                            {block.char}
                        </button>
                    ))}

                    {/* The Avatar */}
                    <PixelAvatar x={avatarPos.x} y={avatarPos.y} isMoving={isMoving} />
                </>
            )}
        </div>

        <div className="mt-4 flex justify-end items-center px-2">
            <button 
                onClick={initLevel}
                className="p-2 bg-slate-200 text-slate-500 rounded-full hover:bg-slate-300 hover:text-slate-700 transition-colors"
                title="Reset Level"
            >
                <RefreshCw size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};
