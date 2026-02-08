import React from 'react';
import { GameEvent } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaHammer, FaBomb } from 'react-icons/fa';

interface GameHUDProps {
  currentHeight: number;
  highScore: number;
  recentEvents: GameEvent[];
}

const GameHUD: React.FC<GameHUDProps> = ({ currentHeight, highScore, recentEvents }) => {
  return (
    <div className="absolute top-0 left-0 w-full h-full pointer-events-none flex flex-col justify-between p-4 z-50 overflow-hidden">
      
      {/* Top Bar Stats */}
      <div className="flex justify-between items-start w-full max-w-4xl mx-auto">
        
        {/* Current Height */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-xl p-4 shadow-xl transform transition-all">
          <div className="text-slate-400 text-xs font-bold uppercase mb-1">Mevcut Kat</div>
          <motion.div 
            key={currentHeight}
            initial={{ scale: 1.5, color: '#fbbf24' }}
            animate={{ scale: 1, color: '#ffffff' }}
            className="text-4xl md:text-5xl font-pixel text-white"
          >
            {currentHeight}
          </motion.div>
        </div>

        {/* High Score */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-yellow-600/50 rounded-xl p-4 shadow-xl flex flex-col items-end">
          <div className="text-yellow-500 text-xs font-bold uppercase mb-1 flex items-center gap-1">
            <FaTrophy /> Rekor
          </div>
          <div className="text-2xl md:text-3xl font-pixel text-white">
            {highScore}
          </div>
        </div>
      </div>

      {/* Event Log (Bottom Left) */}
      <div className="w-64 md:w-80 flex flex-col-reverse gap-2 mb-4">
        <AnimatePresence>
            {recentEvents.slice(0, 5).map((event) => (
                <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    className={`
                        p-3 rounded-lg border backdrop-blur-md shadow-lg flex items-center gap-3
                        ${event.type === 'collapse' 
                            ? 'bg-red-900/80 border-red-500 text-red-100' 
                            : 'bg-emerald-900/80 border-emerald-500 text-emerald-100'}
                    `}
                >
                    <div className="text-xl">
                        {event.type === 'collapse' ? <FaBomb /> : <FaHammer />}
                    </div>
                    <div className="overflow-hidden">
                        <div className="font-bold text-sm truncate">{event.username}</div>
                        <div className="text-[10px] opacity-80">
                            {event.type === 'collapse' 
                                ? `${event.detail || 'Super Chat'} ile YIKTI!` 
                                : `${event.detail || 0}. katı inşa etti`}
                        </div>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>

      {/* Instructional Overlay (Bottom Right) */}
      <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur text-white p-4 rounded-xl border border-white/10 text-right">
        <div className="text-xs text-slate-400 uppercase font-bold mb-2">Nasıl Oynanır?</div>
        <div className="flex flex-col gap-1 text-sm font-medium">
            <span className="text-emerald-400">Chat'e <strong>"yükselt"</strong> yaz</span>
            <span className="text-red-400">Yıkmak için <strong>SuperChat</strong> at</span>
        </div>
      </div>
    </div>
  );
};

export default GameHUD;