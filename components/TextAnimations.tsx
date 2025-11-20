import React from 'react';
import { motion } from 'framer-motion';

interface ShatterTextProps {
  text: string;
  className?: string;
}

export const ShatterText: React.FC<ShatterTextProps> = ({ text, className = "" }) => {
  return (
    <div className={`preserve-3d inline-block cursor-default ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={i}
          className="inline-block transform-style-3d"
          initial={{ z: 0, rotateX: 0, rotateY: 0 }}
          whileHover={{
            z: 50, // Explode outward
            x: (Math.random() - 0.5) * 20,
            y: (Math.random() - 0.5) * 20,
            rotateX: (Math.random() - 0.5) * 90,
            rotateY: (Math.random() - 0.5) * 90,
            rotateZ: (Math.random() - 0.5) * 45,
            color: '#D4AF37',
            textShadow: '0px 0px 8px rgba(212, 175, 55, 0.8)'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 10 }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </div>
  );
};

export const GlitchTitle: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="relative inline-block group">
            <span className="relative z-10">{text}</span>
            <span className="absolute top-0 left-0 -z-10 text-red-500 opacity-0 group-hover:opacity-70 group-hover:-translate-x-1 group-hover:animate-pulse">
                {text}
            </span>
            <span className="absolute top-0 left-0 -z-10 text-blue-500 opacity-0 group-hover:opacity-70 group-hover:translate-x-1 group-hover:animate-pulse delay-75">
                {text}
            </span>
        </div>
    )
}