
import React, { useState } from 'react';
import { Music, Trophy, RotateCcw, HelpCircle, Shuffle } from 'lucide-react';

// Game Data (Kept same data, just changing UI)
const MASTER_QUESTIONS = [
  {
    id: 1,
    group: 'BOYNEXTDOOR',
    original: "Listen, I'm the one and only\n唯一無二的 (Yuiitsu muni no)",
    chinese: "聽著，我是獨一無二的\n沒有人能像我這樣",
    options: ['One and Only', 'But Sometimes', 'Earth, Wind & Fire', 'Serenade'],
    answer: 'One and Only'
  },
  {
    id: 2,
    group: 'SEVENTEEN',
    original: "I love my team, I love my crew\n這裡一直奔跑到了頂峰",
    chinese: "我愛我的團隊，我愛我的兄弟\n我們一路奔跑直至頂峰",
    options: ['HOT', 'Super (孫悟空)', 'God of Music', 'Maestro'],
    answer: 'Super (孫悟空)'
  },
  {
    id: 3,
    group: 'IVE',
    original: "That's my life is a beautiful galaxy\nBe a writer, the only one genre",
    chinese: "我的人生是美麗的銀河\n做一名作家，書寫唯一的流派",
    options: ['After LIKE', 'LOVE DIVE', 'I AM', 'Baddie'],
    answer: 'I AM'
  },
  {
    id: 4,
    group: 'NewJeans',
    original: "'Cause I know what you like boy\nYou're my chemical hype boy",
    chinese: "因為我知道你喜歡什麼，男孩\n你是讓我心動的化學反應",
    options: ['Attention', 'Hype Boy', 'OMG', 'Ditto'],
    answer: 'Hype Boy'
  },
  {
    id: 5,
    group: 'BOYNEXTDOOR',
    original: "Baby, I'm just trying to let you know\n即使我看起來有點傻",
    chinese: "寶貝，我只是想讓你知道\n就算我這副模樣有點愚蠢",
    options: ['Serenade', 'OUR SEASON', 'But Sometimes', 'So let\'s go see the stars'],
    answer: 'Serenade'
  },
  {
    id: 6,
    group: 'BTS',
    original: "Shining through the city with a little funk and soul\nSo I'ma light it up like dynamite",
    chinese: "带著一點放克與靈魂樂閃耀整座城市\n所以我將像炸藥一樣點燃它",
    options: ['Butter', 'Dynamite', 'Permission to Dance', 'Boy With Luv'],
    answer: 'Dynamite'
  },
  {
    id: 7,
    group: 'BLACKPINK',
    original: "Look at you, now look at me\nHow you like that?",
    chinese: "看看你，再看看我\n你覺得如何？",
    options: ['Kill This Love', 'DDU-DU DDU-DU', 'How You Like That', 'Pink Venom'],
    answer: 'How You Like That'
  },
  {
    id: 8,
    group: '(G)I-DLE',
    original: "I'm a Queencard, I'm a Queencard\nI'm a Queencard, I'm a Queencard",
    chinese: "我是王牌女神，我是王牌女神",
    options: ['TOMBOY', 'Nxde', 'Queencard', 'Super Lady'],
    answer: 'Queencard'
  },
  {
    id: 9,
    group: 'Stray Kids',
    original: "Cooking like a chef I'm a 5 star Michelin\n美裡的巔峰 都能看見",
    chinese: "像大廚一樣烹飪，我是五星級米其林\n",
    options: ['God\'s Menu', 'Back Door', 'Thunderous', 'LALALALA'],
    answer: 'God\'s Menu'
  },
  {
    id: 10,
    group: 'aespa',
    original: "I'm on the Next Level\nYeah, 絕不回頭看你的",
    chinese: "我處於下一個層次\n耶，絕不回頭看你",
    options: ['Black Mamba', 'Next Level', 'Savage', 'Drama'],
    answer: 'Next Level'
  },
  {
    id: 11,
    group: 'LE SSERAFIM',
    original: "I'm antifragile, antifragile\nTi ti ti ti fragile, fragile",
    chinese: "我是反脆弱的，打不倒的",
    options: ['FEARLESS', 'ANTIFRAGILE', 'UNFORGIVEN', 'EASY'],
    answer: 'ANTIFRAGILE'
  },
  {
    id: 12,
    group: 'TWICE',
    original: "Cheer up baby, cheer up baby\n稍微再多出一點力吧",
    chinese: "振作起來寶貝，振作起來寶貝\n再多努力一點點吧",
    options: ['TT', 'Cheer Up', 'Like OOH-AHH', 'Fancy'],
    answer: 'Cheer Up'
  },
  {
    id: 13,
    group: 'TXT',
    original: "Gimme, gimme more, gimme, gimme more\nCome a little closer, you're my sugar rush ride",
    chinese: "再給我多一點，再多給一點\n再靠近一點，你是我的糖分衝擊",
    options: ['Good Boy Gone Bad', 'Sugar Rush Ride', 'Chasing That Feeling', 'Deja Vu'],
    answer: 'Sugar Rush Ride'
  },
  {
    id: 14,
    group: 'ENHYPEN',
    original: "It's you and me in this world\nBite me, bite me",
    chinese: "這世界只有你和我\n咬我吧，咬我吧",
    options: ['Drunk-Dazed', 'Fever', 'Bite Me', 'Sweet Venom'],
    answer: 'Bite Me'
  },
  {
    id: 15,
    group: 'ILLIT',
    original: "You, you, you, you like it's magnetic\nN, N, N, N, N, N super attractive",
    chinese: "你，你，你，就像有磁性一樣\n超級有吸引力",
    options: ['Magnetic', 'Lucky Girl Syndrome', 'Attention', 'Midas Touch'],
    answer: 'Magnetic'
  },
  {
    id: 16,
    group: 'TWS',
    original: "첫 만남은 너무 어려워 (Cheot mannameun neomu eoryeowo)\nPlan A, Plan B",
    chinese: "第一次見面真的好難\n無論是計畫 A 還是計畫 B",
    options: ['plot twist', 'BFF', 'Unplugged Boy', 'hey! hey!'],
    answer: 'plot twist'
  },
  {
    id: 17,
    group: 'RIIZE',
    original: "Baby, get a guitar\nAnd we can play a song",
    chinese: "寶貝，拿起吉他\n我們可以彈奏一曲",
    options: ['Memories', 'Get A Guitar', 'Love 119', 'Talk Saxy'],
    answer: 'Get A Guitar'
  },
  {
    id: 18,
    group: 'ZEROBASEONE',
    original: "Ooh-ooh-ooh, yeah\nEven if my tomorrow is gone, I'm running to you",
    chinese: "喔喔喔，耶\n即使我的明天消失，我也要奔向你",
    options: ['In Bloom', 'CRUSH', 'Melting Point', 'YURA YURA'],
    answer: 'In Bloom'
  },
  {
    id: 19,
    group: 'NMIXX',
    original: "I wanna dash, I wanna dash\nI wanna run it, run it",
    chinese: "我想要衝刺，我想要衝刺\n我想要奔跑，奔跑",
    options: ['O.O', 'DASH', 'Love Me Like This', 'DICE'],
    answer: 'DASH'
  },
  {
    id: 20,
    group: 'ITZY',
    original: "I don't wanna be somebody\nJust wanna be me, be me",
    chinese: "我不想成為別人\n我只想做我自己",
    options: ['DALLA DALLA', 'WANNABE', 'LOCO', 'CAKE'],
    answer: 'WANNABE'
  },
  {
    id: 21,
    group: 'Red Velvet',
    original: "You got me feeling like a psycho, psycho\nPeople say we're fools",
    chinese: "你讓我感覺像個瘋子，瘋子\n人們說我們是傻瓜",
    options: ['Bad Boy', 'Psycho', 'Feel My Rhythm', 'Chill Kill'],
    answer: 'Psycho'
  },
  {
    id: 22,
    group: 'EXO',
    original: "It's the love shot\nNa, na-na-na, na-na-na-na",
    chinese: "這就是愛的子彈\n吶，吶吶吶，吶吶吶吶",
    options: ['Growl', 'Love Shot', 'Monster', 'Ko Ko Bop'],
    answer: 'Love Shot'
  },
  {
    id: 23,
    group: 'Jung Kook',
    original: "Monday, Tuesday, Wednesday, Thursday, Friday\nSeven days a week",
    chinese: "週一，週二，週三，週四，週五\n一週七天",
    options: ['Seven', 'Standing Next to You', '3D', 'Left and Right'],
    answer: 'Seven'
  },
  {
    id: 24,
    group: 'NewJeans',
    original: "I'm super shy, super shy\nBut wait a minute while I make you mine",
    chinese: "我超級害羞，超級害羞\n但等等，讓我把你變成我的",
    options: ['ETA', 'Super Shy', 'Cool With You', 'ASAP'],
    answer: 'Super Shy'
  },
  {
    id: 25,
    group: 'SEVENTEEN',
    original: "Kung chi pak chi, Kung chi pak chi\nGod of Music",
    chinese: "動次打次，動次打次\n音樂之神",
    options: ['Fighting', 'God of Music', 'Super', 'VERY NICE'],
    answer: 'God of Music'
  },
  {
    id: 26,
    group: 'NCT DREAM',
    original: "Sip it, sip it down like smoothie\nSmoothie, smoothie, smoothie",
    chinese: "啜飲它，像冰沙一樣喝下去\n冰沙，冰沙，冰沙",
    options: ['ISTJ', 'Candy', 'Smoothie', 'Glitch Mode'],
    answer: 'Smoothie'
  },
  {
    id: 27,
    group: 'ATEEZ',
    original: "Slow it down, make it bouncy\n지금부터 (Jigeumbuteo) fly",
    chinese: "慢下來，讓它有彈性\n從現在開始飛翔",
    options: ['Guerrilla', 'BOUNCY', 'Crazy Form', 'Halazia'],
    answer: 'BOUNCY'
  },
  {
    id: 28,
    group: 'BABYMONSTER',
    original: "B-A-B-Y-M-O-N\nSheesh, sheesh, sheesh",
    chinese: "B-A-B-Y-M-O-N\n噓，噓，噓",
    options: ['BATTER UP', 'SHEESH', 'Stuck In The Middle', 'Dream'],
    answer: 'SHEESH'
  },
  {
    id: 29,
    group: 'Jisoo',
    original: "꽃향기만 남기고 갔단다 (Kkochhyanggiman namgigo gatdanda)",
    chinese: "只留下了花香離去",
    options: ['SOLO', 'On The Ground', 'FLOWER', 'You & Me'],
    answer: 'FLOWER'
  },
  {
    id: 30,
    group: 'LE SSERAFIM',
    original: "Come and take a ride with me\nI got a credit card and some good company",
    chinese: "來跟我一起兜風吧\n我有一張信用卡和一群好夥伴",
    options: ['Perfect Night', 'Smart', 'Eve, Psyche & The Bluebeard\'s Wife', 'Easy'],
    answer: 'Perfect Night'
  },
  {
    id: 31,
    group: 'Zico',
    original: "Amudeo norae ina teureo (Any song)\nAmugeona sinnaneun geollo",
    chinese: "隨便放首歌吧\n隨便什麼開心的都好",
    options: ['Any Song', 'New Thing', 'SPOT!', 'Okey Dokey'],
    answer: 'Any Song'
  },
  {
    id: 32,
    group: 'NCT 127',
    original: "Check that, check that\nGo check that, check that",
    chinese: "檢查一下，檢查一下\n去檢查一下",
    options: ['Kick It', '2 Baddies', 'Fact Check', 'Sticker'],
    answer: 'Fact Check'
  },
  {
    id: 33,
    group: 'Taeyeon',
    original: "It's not a fancy car, it's not a fancy suit\nNae gyeoteun neoya (You're by my side)",
    chinese: "不是豪華的車，不是華麗的西裝\n在我身邊的是你",
    options: ['INVU', 'Weekend', 'To. X', 'Fine'],
    answer: 'To. X'
  },
  {
    id: 34,
    group: 'RIIZE',
    original: "1-1-9, 1-1-9\nSave my life, save my life",
    chinese: "1-1-9, 1-1-9\n救救我，救救我",
    options: ['Get A Guitar', 'Love 119', 'Siren', 'Impossible'],
    answer: 'Love 119'
  },
  {
    id: 35,
    group: 'BIBI',
    original: "Nappeun nyeon (Bam Yang Gang)\nDal디dan Bam Yang Gang",
    chinese: "壞女人 (栗子羊羹)\n甜甜的栗子羊羹",
    options: ['Vengeance', 'Bam Yang Gang', 'The Weekend', 'Animal Farm'],
    answer: 'Bam Yang Gang'
  }
];

// Helper to shuffle and pick N random questions
const getRandomQuestions = (count: number) => {
  const shuffled = [...MASTER_QUESTIONS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export const LyricGameView: React.FC = () => {
  const [questions, setQuestions] = useState(MASTER_QUESTIONS.slice(0, 5));
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'START' | 'PLAYING' | 'END'>('START');
  const [feedback, setFeedback] = useState<'NONE' | 'CORRECT' | 'WRONG'>('NONE');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const currentQ = questions[currentQIndex];

  const handleStart = () => {
    // Pick 5 random questions
    const randomQs = getRandomQuestions(5);
    setQuestions(randomQs);
    
    setScore(0);
    setCurrentQIndex(0);
    setGameState('PLAYING');
    setFeedback('NONE');
    setSelectedOption(null);
  };

  const handleAnswer = (option: string) => {
    if (feedback !== 'NONE') return; // Prevent double clicking
    
    setSelectedOption(option);
    
    if (option === currentQ.answer) {
      setFeedback('CORRECT');
      setScore(prev => prev + 100);
    } else {
      setFeedback('WRONG');
    }

    setTimeout(() => {
      if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setFeedback('NONE');
        setSelectedOption(null);
      } else {
        setGameState('END');
      }
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 p-4 pb-32 custom-scrollbar overflow-y-auto">
      {/* Header */}
      <div className="pt-4 mb-6 text-center shrink-0">
        <h2 className="text-3xl font-black text-slate-700 flex items-center justify-center gap-2">
          <Music className="text-slate-500" /> 猜歌詞挑戰
        </h2>
        <p className="text-slate-400 font-bold text-sm mt-1">聽不懂韓文？看中文翻譯猜猜看！</p>
      </div>

      {gameState === 'START' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-fade-in my-auto">
          <div className="w-40 h-40 bg-white rounded-full shadow-xl shadow-slate-200 flex items-center justify-center border-4 border-slate-100 animate-bounce-slight">
             <Trophy size={64} className="text-yellow-400" />
          </div>
          <div className="text-center space-y-2">
             <p className="text-xl font-black text-slate-700">準備好測試你的「真愛粉」指數了嗎？</p>
             <p className="text-slate-400 font-bold">每次隨機 5 題，滿分 500 分</p>
          </div>
          <button 
            onClick={handleStart}
            className="px-10 py-4 bg-slate-800 text-white rounded-full font-black text-lg shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
          >
            <Shuffle size={20} />
            隨機出題 GO!
          </button>
        </div>
      )}

      {gameState === 'PLAYING' && (
        <div className="flex-1 flex flex-col max-w-md mx-auto w-full animate-fade-in">
           {/* Progress */}
           <div className="flex justify-between items-center mb-6 px-2 shrink-0">
              <span className="text-xs font-bold bg-slate-200 text-slate-600 px-2 py-1 rounded-lg">
                Question {currentQIndex + 1} / {questions.length}
              </span>
              <span className="text-lg font-black text-slate-700">
                Score: {score}
              </span>
           </div>

           {/* Question Card */}
           <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-200 mb-8 relative overflow-hidden shrink-0">
              <div className="absolute top-0 left-0 w-full h-2 bg-slate-800"></div>
              
              <div className="mb-2">
                 <p className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-1 uppercase tracking-wider">
                    <HelpCircle size={14} /> 
                    {currentQ.group}
                 </p>
                 
                 <div className="bg-slate-50 p-4 rounded-2xl mb-4 border border-slate-100">
                    <p className="text-slate-400 text-xs font-bold uppercase mb-1">Original Lyrics</p>
                    <p className="text-lg font-bold text-slate-800 leading-relaxed whitespace-pre-line">
                       "{currentQ.original}"
                    </p>
                 </div>

                 <div className="bg-slate-100 p-4 rounded-2xl border border-slate-200">
                    <p className="text-slate-500 text-xs font-bold uppercase mb-1">Translation</p>
                    <p className="text-lg font-bold text-slate-700 leading-relaxed whitespace-pre-line">
                       "{currentQ.chinese}"
                    </p>
                 </div>
              </div>
           </div>

           {/* Options */}
           <div className="grid grid-cols-1 gap-3 pb-4">
              {currentQ.options.map((option) => {
                let btnStyle = "bg-white text-slate-600 border-2 border-slate-200 hover:border-slate-400";
                
                if (selectedOption === option) {
                    if (feedback === 'CORRECT') btnStyle = "bg-slate-700 text-white border-slate-700";
                    if (feedback === 'WRONG') btnStyle = "bg-red-500 text-white border-red-500";
                } else if (feedback !== 'NONE' && option === currentQ.answer) {
                    // Show correct answer if wrong
                    btnStyle = "bg-green-100 text-green-800 border-green-200 opacity-70";
                }

                return (
                  <button
                    key={option}
                    onClick={() => handleAnswer(option)}
                    disabled={feedback !== 'NONE'}
                    className={`py-4 rounded-2xl font-bold text-lg shadow-sm transition-all transform active:scale-95 ${btnStyle}`}
                  >
                    {option}
                  </button>
                );
              })}
           </div>
        </div>
      )}

      {gameState === 'END' && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-8 animate-scale-up my-auto">
           <div className="text-center">
              <p className="text-slate-400 font-bold text-lg mb-2">最終得分</p>
              <h1 className="text-6xl font-black text-slate-800 drop-shadow-sm">
                 {score}
              </h1>
           </div>
           
           <div className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-xs text-center border border-slate-100">
              <p className="font-bold text-slate-700 text-lg mb-2">
                 {score === questions.length * 100 ? "太神啦！你是真愛粉！👑" : score > 0 ? "不錯喔！繼續加油！✨" : "要再去補補課囉！📚"}
              </p>
           </div>

           <button 
             onClick={handleStart}
             className="flex items-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-full font-bold shadow-xl hover:bg-slate-700 transition-colors"
           >
             <RotateCcw size={20} />
             再玩一次
           </button>
        </div>
      )}
    </div>
  );
};
