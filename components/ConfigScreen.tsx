import React, { useState } from 'react';
import { YouTubeConfig } from '../types';
import { FaYoutube, FaPlay, FaKey } from 'react-icons/fa';

interface ConfigScreenProps {
  onStart: (config: YouTubeConfig) => void;
  onSimulate: () => void;
  isLoading: boolean;
  error: string | null;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onStart, onSimulate, isLoading, error }) => {
  const [apiKey, setApiKey] = useState('');
  const [videoId, setVideoId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey && videoId) {
      onStart({ apiKey, videoId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 to-black p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 max-w-md w-full">
        <div className="flex flex-col items-center mb-6">
          <div className="bg-red-600 p-4 rounded-full mb-4 shadow-lg shadow-red-500/30">
            <FaYoutube className="text-4xl text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center font-pixel leading-relaxed">
            Kule Yükseltme Oyunu
          </h1>
          <p className="text-slate-400 text-sm mt-2 text-center">
            YouTube Data API V3 Kullanır
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-xs uppercase font-bold mb-2 flex items-center gap-2">
              <FaKey /> API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all placeholder-slate-600"
              placeholder="AIzaSy..."
              required
            />
            <p className="text-[10px] text-slate-500 mt-1">Google Cloud Console'dan alınan API Key.</p>
          </div>

          <div>
            <label className="block text-slate-300 text-xs uppercase font-bold mb-2 flex items-center gap-2">
              <FaPlay /> Video ID
            </label>
            <input
              type="text"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              className="w-full bg-slate-900 text-white border border-slate-700 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all placeholder-slate-600"
              placeholder="Canlı yayın video ID'si"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Bağlanıyor...' : 'Oyunu Başlat'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700">
           <button
            onClick={onSimulate}
            className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-2 px-4 rounded-lg text-sm transition-colors"
          >
            Simülasyon Modu (API Yok)
          </button>
          <p className="text-[10px] text-center text-slate-500 mt-2">
            Simülasyon modu API kotası harcamadan test etmek içindir.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;