import React, { useEffect, useState } from 'react';

const CustomCursor: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [trailing, setTrailing] = useState({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseDown = () => setClicked(true);
    const handleMouseUp = () => setClicked(false);

    window.addEventListener('mousemove', updatePosition);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', updatePosition);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // Lerp effect for trailing cursor
  useEffect(() => {
    const moveTrailing = () => {
      setTrailing((prev) => ({
        x: prev.x + (position.x - prev.x) * 0.1,
        y: prev.y + (position.y - prev.y) * 0.1,
      }));
      requestAnimationFrame(moveTrailing);
    };
    const animId = requestAnimationFrame(moveTrailing);
    return () => cancelAnimationFrame(animId);
  }, [position]);

  return (
    <>
      {/* Main Dot */}
      <div 
        className="fixed top-0 left-0 w-3 h-3 bg-chuma-gold rounded-full pointer-events-none z-[100] mix-blend-difference"
        style={{ transform: `translate(${position.x - 6}px, ${position.y - 6}px)` }}
      />
      {/* Trailing Ring */}
      <div 
        className={`fixed top-0 left-0 border border-chuma-orange rounded-full pointer-events-none z-[99] transition-transform duration-100 ${clicked ? 'scale-75 bg-chuma-orange/20' : 'scale-100'}`}
        style={{ 
          width: '40px', 
          height: '40px', 
          transform: `translate(${trailing.x - 20}px, ${trailing.y - 20}px) ${clicked ? 'scale(0.5)' : 'scale(1)'}`
        }}
      />
    </>
  );
};

export default CustomCursor;