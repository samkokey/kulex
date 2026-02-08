import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { YouTubeConfig, GameState, GameEvent, ChatMessage } from './types';
import GameHUD from './components/GameHUD';
import TowerBlock from './components/TowerBlock';
import { getLiveChatId, fetchChatMessages } from './services/youtubeService';
import { FaExclamationTriangle, FaCircleNotch } from 'react-icons/fa';

// ==========================================
// AYARLAR (Lütfen Bu Kısmı Düzenleyin)
// ==========================================
const API_KEY = 'YOUR_API_KEY_HERE'; // Google Cloud Console'dan aldığınız API Key
const VIDEO_ID = 'YOUR_VIDEO_ID_HERE'; // Canlı yayının Video ID'si (URL'deki v= parametresi)
// ==========================================

const App: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Game State
  const [gameState, setGameState] = useState<GameState>({
    currentHeight: 0,
    highScore: 0,
    lastBuilder: null,
    lastDestroyer: null,
    history: [],
    blocks: []
  });

  // API State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const nextPageTokenRef = useRef<string | undefined>(undefined);
  const pollingIntervalRef = useRef<number>(3000);
  const liveChatIdRef = useRef<string | null>(null);
  
  // Sound Effects
  const playSound = (type: 'build' | 'collapse') => {
    // Ses efektleri buraya eklenebilir
  };

  const handleStart = async () => {
    // Basit doğrulama
    if (API_KEY === 'YOUR_API_KEY_HERE' || VIDEO_ID === 'YOUR_VIDEO_ID_HERE') {
        setError('Lütfen App.tsx dosyasını açın ve API_KEY ile VIDEO_ID alanlarına kendi bilgilerinizi girin.');
        return;
    }

    setLoading(true);
    setError(null);
    try {
      const chatId = await getLiveChatId(VIDEO_ID, API_KEY);
      liveChatIdRef.current = chatId;
      setIsPlaying(true);
    } catch (err: any) {
      setError(err.message || 'Canlı sohbete bağlanırken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Auto-start on mount
  useEffect(() => {
    handleStart();
  }, []);

  const processGameLogic = (messages: ChatMessage[]) => {
    setGameState(prev => {
      let newState = { ...prev };
      let newBlocks = [...prev.blocks];
      let updatedHistory = [...prev.history];

      for (const msg of messages) {
        if (msg.type === 'superchat') {
          // YIKIM MEKANİĞİ
          if (newState.currentHeight > 0) { // Sadece kule varsa yık
              newState.lastDestroyer = msg.authorName;
              newState.currentHeight = 0;
              newBlocks = []; // Blokları temizle
              
              updatedHistory.unshift({
                id: msg.id,
                type: 'collapse',
                username: msg.authorName,
                userPhoto: msg.authorPhotoUrl,
                detail: msg.amount,
                timestamp: new Date()
              });
              playSound('collapse');
          }

        } else if (msg.message.toLowerCase().includes('yükselt')) {
          // İNŞA MEKANİĞİ
          newState.currentHeight += 1;
          newState.lastBuilder = msg.authorName;
          
          if (newState.currentHeight > newState.highScore) {
            newState.highScore = newState.currentHeight;
          }

          newBlocks.push({
            id: `${msg.id}-${newState.currentHeight}`,
            builder: msg.authorName,
            photo: msg.authorPhotoUrl
          });

          updatedHistory.unshift({
            id: msg.id,
            type: 'build',
            username: msg.authorName,
            userPhoto: msg.authorPhotoUrl,
            detail: newState.currentHeight.toString(),
            timestamp: new Date()
          });
          playSound('build');
        }
      }

      return {
        ...newState,
        blocks: newBlocks,
        history: updatedHistory.slice(0, 10) // Son 10 olayı tut
      };
    });
  };

  // Polling Effect
  useEffect(() => {
    if (!isPlaying || !liveChatIdRef.current) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const { messages, nextPageToken, pollingInterval } = await fetchChatMessages(
          liveChatIdRef.current!,
          API_KEY,
          nextPageTokenRef.current
        );

        nextPageTokenRef.current = nextPageToken;
        pollingIntervalRef.current = pollingInterval;
        
        if (messages.length > 0) {
          processGameLogic(messages);
        }
        
        // Hata yoksa temizle
        setError(null);

      } catch (err) {
        console.error("Polling error", err);
        // Hata durumunda logla ama kullanıcıyı rahatsız etmemek için sürekli gösterme,
        // ancak bağlantı koparsa yeniden denemeye devam et.
      }

      timeoutId = setTimeout(poll, pollingIntervalRef.current);
    };

    poll();

    return () => clearTimeout(timeoutId);
  }, [isPlaying]);

  // Yükleme veya Hata Ekranı
  if (!isPlaying) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans p-6">
            <div className="max-w-lg w-full bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-2xl text-center">
                {error ? (
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
                            <FaExclamationTriangle className="text-3xl text-red-500" />
                        </div>
                        <h2 className="text-xl font-bold mb-2">Bağlantı Hatası</h2>
                        <p className="text-slate-400 mb-6">{error}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-slate-700 hover:bg-slate-600 px-6 py-2 rounded-lg font-bold transition-colors"
                        >
                            Sayfayı Yenile
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center">
                        <FaCircleNotch className="text-5xl text-blue-500 animate-spin mb-6" />
                        <h2 className="text-2xl font-bold mb-2 font-pixel">BAĞLANILIYOR</h2>
                        <p className="text-slate-400">YouTube Sohbeti ile iletişim kuruluyor...</p>
                        <div className="mt-4 text-xs text-slate-500 font-mono bg-black/30 p-2 rounded">
                            Video ID: {VIDEO_ID}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-900 text-white font-sans selection:bg-red-500 selection:text-white">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 transition-colors duration-1000 z-0"
        style={{
            background: `linear-gradient(to top, #0f172a 0%, #1e1b4b ${Math.min(100, gameState.currentHeight * 2)}%, #000000 100%)`
        }}
      >
        {/* Stars */}
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      </div>

      <GameHUD 
        currentHeight={gameState.currentHeight} 
        highScore={gameState.highScore}
        recentEvents={gameState.history}
      />

      {/* Game Area */}
      <div className="absolute inset-0 flex flex-col justify-end items-center pb-10 z-10">
        {/* Tower Container */}
        <div className="relative w-full max-w-md px-4 flex flex-col-reverse items-center h-full overflow-y-auto no-scrollbar scroll-smooth">
            {/* Ground */}
            <div className="w-full h-4 bg-slate-700 rounded-full mb-1 shrink-0 shadow-[0_0_20px_rgba(255,255,255,0.1)] border-t border-slate-600"></div>
            
            {/* Blocks */}
            <AnimatePresence mode='popLayout'>
                {gameState.blocks.map((block, index) => (
                <TowerBlock 
                    key={block.id} 
                    index={index} 
                    builderName={block.builder} 
                    builderPhoto={block.photo}
                    isNew={index === gameState.blocks.length - 1}
                />
                ))}
            </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default App;