import React from 'react';

const Marquee3D: React.FC<{ text: string; direction?: 'left' | 'right' }> = ({ text, direction = 'left' }) => {
  const animClass = direction === 'left' ? 'animate-[marquee_20s_linear_infinite]' : 'animate-[marquee-reverse_20s_linear_infinite]';
  
  return (
    <div className="relative flex overflow-hidden py-4 bg-black/50 border-y border-chuma-gold/20 backdrop-blur-sm preserve-3d perspective-1000 transform -skew-y-2 hover:skew-y-0 transition-transform duration-500">
      <div className={`flex whitespace-nowrap ${animClass} hover:[animation-play-state:paused]`}>
        {Array(10).fill(0).map((_, i) => (
          <span key={i} className="text-6xl font-display font-black text-transparent stroke-text px-8 opacity-50 hover:opacity-100 hover:text-chuma-gold transition-all duration-300">
             <style>{`.stroke-text { -webkit-text-stroke: 1px rgba(255,255,255,0.3); }`}</style>
             {text} &nbsp; • &nbsp;
          </span>
        ))}
      </div>
       <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10 pointer-events-none" />
    </div>
  );
};

export default Marquee3D;