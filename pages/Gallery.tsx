import React, { useState, useEffect } from 'react';
import { dbService } from '../services/firebaseSim';
import { GalleryItem } from '../types';
import { getDriveDirectLink } from '../constants';
import { Heart, X, ZoomIn } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const TiltCard: React.FC<{ children: React.ReactNode; onClick: () => void; className?: string }> = ({ children, onClick, className }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 200, damping: 20 });
  const mouseY = useSpring(y, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      className={className}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
    >
      {children}
    </motion.div>
  );
};

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<string, boolean>>({});

  useEffect(() => {
      dbService.getGallery().then(setImages);
  }, []);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 perspective-1000">
      <h1 className="font-display text-5xl font-bold text-center mb-4">VISUALS</h1>
      <p className="text-center text-gray-500 mb-12 tracking-widest">IMMERSIVE MOMENTS</p>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {images.map((img, index) => {
          const src = getDriveDirectLink(img.url);
          // First item or featured items span larger areas
          const spanClass = index === 0 || img.featured ? "md:col-span-2 md:row-span-2" : "";
          
          return (
            <TiltCard
                key={img.id} 
                className={`relative group overflow-hidden rounded-lg bg-gray-800 ${spanClass} min-h-[300px] cursor-pointer shadow-xl`}
                onClick={() => setSelectedImage(src)}
            >
              <img
                src={src}
                alt={img.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                loading="lazy"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6 translate-z-10" style={{ transform: "translateZ(20px)" }}>
                <div className="self-end">
                    <ZoomIn className="text-white" size={24} />
                </div>
                <div className="flex justify-between items-end">
                    <p className="text-chuma-gold tracking-widest font-bold drop-shadow-md uppercase">{img.title}</p>
                    <button 
                        onClick={(e) => toggleLike(img.id, e)}
                        className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur transition-colors"
                    >
                        <Heart 
                            size={20} 
                            className={likes[img.id] ? "fill-chuma-orange text-chuma-orange" : "text-white"} 
                        />
                    </button>
                </div>
              </div>
            </TiltCard>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-8 right-8 text-white hover:text-chuma-gold">
                <X size={40} />
            </button>
            <img 
                src={selectedImage} 
                alt="Full screen" 
                className="max-h-[90vh] max-w-full object-contain shadow-2xl shadow-chuma-orange/20"
                onClick={(e) => e.stopPropagation()}
            />
        </div>
      )}
    </div>
  );
};

export default Gallery;
