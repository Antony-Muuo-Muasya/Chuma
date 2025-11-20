import React, { useState } from 'react';
import { Play, Pause, SkipForward, Volume2 } from 'lucide-react';

const GlobalPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-lg border-t border-white/10 z-40 px-6 py-3 hidden md:flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 bg-gray-800 rounded overflow-hidden ${isPlaying ? 'animate-pulse' : ''}`}>
          <img 
            src="https://picsum.photos/200/200?grayscale" 
            alt="Album Art" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h4 className="text-sm font-bold text-white">AFRO PULSE (PREVIEW)</h4>
          <p className="text-xs text-chuma-gold">CHUMA</p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="text-gray-400 hover:text-white transition-colors">
            <SkipForward size={20} className="rotate-180" />
        </button>
        <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-chuma-orange text-white flex items-center justify-center hover:scale-110 transition-transform"
        >
            {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
        </button>
        <button className="text-gray-400 hover:text-white transition-colors">
            <SkipForward size={20} />
        </button>
      </div>

      <div className="flex items-center gap-2 w-32">
        <Volume2 size={16} className="text-gray-400" />
        <div className="h-1 bg-gray-700 rounded-full flex-1">
            <div className="h-full w-2/3 bg-chuma-gold rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default GlobalPlayer;