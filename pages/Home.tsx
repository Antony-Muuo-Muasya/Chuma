import React, { useEffect, useState } from 'react';
import { CHUMA_DATA, getDriveDirectLink } from '../constants';
import { dbService } from '../services/firebaseSim';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Music, Calendar, Sparkles } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion';
import { ShatterText } from '../components/TextAnimations';
import MagneticButton from '../components/MagneticButton';
import Marquee3D from '../components/Marquee3D';
import { useTheme } from '../context/ThemeContext';

const Home: React.FC = () => {
  const { artist } = CHUMA_DATA;
  const heroImage = getDriveDirectLink(artist.images[1]);
  const { theme } = useTheme();
  
  const [typedText, setTypedText] = useState('');
  const [settings, setSettings] = useState({ marqueeText: '', heroText: artist.tagline });
  
  useEffect(() => {
    dbService.getSettings().then(s => {
        setSettings({ marqueeText: s.marqueeText, heroText: s.heroText });
    });
  }, []);

  const { scrollY } = useScroll();
  const yBg1 = useTransform(scrollY, [0, 1000], [0, 400]);
  const yBg2 = useTransform(scrollY, [0, 1000], [0, -200]);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });
  
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]);

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

  useEffect(() => {
    if (!settings.heroText) return;
    let i = 0;
    const interval = setInterval(() => {
      if (i <= settings.heroText.length) {
        setTypedText(settings.heroText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [settings.heroText, theme]); // Reset typing on theme switch

  // --- LAYOUT VERSION 1: DARK / CLASSIC ---
  if (theme === 'dark') {
    return (
      <div className="min-h-screen pt-20 perspective-1000 overflow-x-hidden relative">
        {/* Parallax Background Text */}
        <div className="absolute top-20 left-0 w-full h-full overflow-hidden pointer-events-none z-0 opacity-10">
          <motion.div style={{ y: yBg1 }} className="absolute top-10 -left-20 text-[20rem] font-black text-white whitespace-nowrap">
              AFRO
          </motion.div>
          <motion.div style={{ y: yBg2 }} className="absolute top-[40vh] -right-20 text-[20rem] font-black text-white whitespace-nowrap">
              BEAT
          </motion.div>
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[95vh] flex flex-col md:flex-row items-center justify-center md:justify-between px-4 md:px-12 max-w-7xl mx-auto gap-12">
          <motion.div 
              className="relative w-full md:w-1/2 h-[50vh] md:h-[70vh] z-10 order-2 md:order-1"
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          >
               <div className="absolute inset-0 border-2 border-chuma-gold/30 transform translate-z-12 rounded-lg"></div>
               <motion.img 
                  src={heroImage} 
                  alt="CHUMA Artist" 
                  className="w-full h-full object-cover object-top rounded-lg shadow-2xl shadow-chuma-orange/20 grayscale hover:grayscale-0 transition-all duration-500"
                  style={{ transform: "translateZ(20px)" }}
               />
          </motion.div>
          
          <div className="relative z-10 text-center md:text-left w-full md:w-1/2 order-1 md:order-2">
            <div className="font-display font-black text-6xl md:text-8xl text-white tracking-widest mb-6 origin-bottom preserve-3d">
               <ShatterText text={artist.name} />
            </div>
            <p className="text-chuma-gold text-xl md:text-2xl tracking-[0.3em] uppercase mb-12 font-light min-h-[2rem] typing-cursor">
              {typedText}
            </p>
            <div className="flex flex-col md:flex-row gap-6 justify-center md:justify-start items-center mt-12">
              <MagneticButton>
                  <Link to="/music" className="group relative px-10 py-5 bg-transparent border border-white overflow-hidden rounded-none active:scale-95 transition-transform block">
                  <div className="absolute inset-0 w-full h-full bg-chuma-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                  <span className="relative flex items-center gap-3 font-bold tracking-widest text-lg z-10">
                      LISTEN NOW <Play size={18} fill="currentColor" />
                  </span>
                  </Link>
              </MagneticButton>
              <Link to="/gallery" className="text-gray-400 hover:text-white flex items-center gap-2 tracking-widest text-sm transition-colors hover:translate-x-2 duration-300">
                VIEW GALLERY <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      
        <div className="py-12 relative z-20">
          <Marquee3D text={settings.marqueeText || "CHUMA AFRICA. AFROBEAT & AFROHOUSE"} />
        </div>

        {/* Sections ... */}
        <section className="relative py-24 px-4 bg-black/80 backdrop-blur-sm border-t border-white/5">
           <div className="max-w-4xl mx-auto text-center">
              <Music className="mx-auto text-chuma-orange mb-6 animate-bounce" size={48} />
              <h2 className="font-display text-4xl font-bold mb-8 text-glitch">THE PULSE</h2>
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">{artist.bio}</p>
           </div>
        </section>
      </div>
    );
  }

  // --- LAYOUT VERSION 2: LIGHT / MODERN / SPLINE ---
  return (
    <div className="min-h-screen text-theme-text pt-24">
        {/* Modern Hero */}
        <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
            {/* Large Background Text */}
            <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-black/5 select-none pointer-events-none">
                CHUMA
            </h1>
            
            <div className="z-10 bg-white/80 backdrop-blur-xl p-12 rounded-2xl shadow-2xl border border-white/50 max-w-3xl w-full text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                
                <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-bold tracking-widest mb-6">
                    NEW ERA
                </span>
                
                <h2 className="font-display text-6xl md:text-8xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-br from-gray-900 to-gray-600">
                    {artist.name}
                </h2>
                
                <p className="text-xl md:text-2xl text-gray-600 mb-8 font-light">
                    {typedText}
                </p>

                <div className="flex justify-center gap-4">
                    <Link to="/music" className="px-8 py-4 bg-black text-white rounded-full font-bold hover:scale-105 transition-transform shadow-lg flex items-center gap-2">
                        <Play size={20} fill="currentColor" /> STREAM MUSIC
                    </Link>
                    <Link to="/store" className="px-8 py-4 bg-white text-black border border-gray-200 rounded-full font-bold hover:bg-gray-50 transition-colors shadow-lg">
                        MERCH STORE
                    </Link>
                </div>
            </div>

            {/* Floating Elements mimicking Spline interactivity */}
            <motion.div 
                animate={{ y: [0, -20, 0] }} 
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-20 right-10 md:right-20 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full blur-3xl opacity-40"
            />
             <motion.div 
                animate={{ y: [0, 30, 0] }} 
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-20 left-10 md:left-20 w-48 h-48 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full blur-3xl opacity-30"
            />
        </section>

        {/* Grid Layout for Content */}
        <section className="max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <Sparkles className="text-purple-600 mb-4" size={32} />
                <h3 className="text-3xl font-bold mb-4">Visual Experience</h3>
                <p className="text-gray-500 mb-6">Explore the gallery in a new light mode with cleaner aesthetics.</p>
                <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                     <img src={heroImage} alt="Visuals" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
            </div>
            
            <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-8 rounded-3xl shadow-xl">
                    <h3 className="text-3xl font-bold mb-2">Upcoming Tour</h3>
                    <p className="opacity-80 mb-6">Catch CHUMA live in your city.</p>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
                            <span>London, UK</span>
                            <span className="font-mono bg-white text-black px-2 rounded">NOV 12</span>
                        </div>
                        <div className="flex justify-between items-center bg-white/10 p-4 rounded-xl">
                            <span>Berlin, DE</span>
                            <span className="font-mono bg-white text-black px-2 rounded">NOV 18</span>
                        </div>
                    </div>
                </div>
                
                <div className="bg-gray-50 p-8 rounded-3xl border border-gray-200">
                    <h3 className="font-bold text-xl mb-2">Latest Release</h3>
                    <p className="text-gray-500">Listen to the new Afro Pulse album now available on all platforms.</p>
                </div>
            </div>
        </section>
    </div>
  );
};

export default Home;