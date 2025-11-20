import React, { useEffect, useState } from 'react';
import { CHUMA_DATA, getDriveDirectLink } from '../constants';
import { dbService } from '../services/firebaseSim'; // Import DB Service
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Music, Calendar } from 'lucide-react';
import { motion, useMotionValue, useTransform, useSpring, useScroll } from 'framer-motion';
import { ShatterText } from '../components/TextAnimations';
import MagneticButton from '../components/MagneticButton';
import Marquee3D from '../components/Marquee3D';

const Home: React.FC = () => {
  const { artist } = CHUMA_DATA; // Static artist info remains for now, but Tagline will be dynamic
  const heroImage = getDriveDirectLink(artist.images[1]);
  
  const [offset, setOffset] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [settings, setSettings] = useState({ marqueeText: '', heroText: artist.tagline });
  
  useEffect(() => {
    // Fetch dynamic settings
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
    const width = rect.width;
    const height = rect.height;
    const mouseXVal = e.clientX - rect.left;
    const mouseYVal = e.clientY - rect.top;
    const xPct = mouseXVal / width - 0.5;
    const yPct = mouseYVal / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  useEffect(() => {
    const handleScroll = () => setOffset(window.pageYOffset);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  }, [settings.heroText]);

  return (
    <div className="min-h-screen pt-20 perspective-1000 overflow-x-hidden relative">
      {/* Animation: Parallax Background Text Layers */}
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
        
        {/* 3D Tilt Hero Image Container */}
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
          {/* Animation: Shatter Text Title */}
          <div className="font-display font-black text-6xl md:text-8xl text-white tracking-widest mb-6 origin-bottom preserve-3d">
             <ShatterText text={artist.name} />
          </div>
          
          <p className="text-chuma-gold text-xl md:text-2xl tracking-[0.3em] uppercase mb-12 font-light min-h-[2rem] typing-cursor">
            {typedText}
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center md:justify-start items-center mt-12">
            {/* Animation: Magnetic Button */}
            <MagneticButton>
                <Link 
                to="/music" 
                className="group relative px-10 py-5 bg-transparent border border-white overflow-hidden rounded-none active:scale-95 transition-transform block"
                >
                <div className="absolute inset-0 w-full h-full bg-chuma-orange scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                <span className="relative flex items-center gap-3 font-bold tracking-widest text-lg z-10">
                    LISTEN NOW <Play size={18} fill="currentColor" />
                </span>
                </Link>
            </MagneticButton>
            
            <Link 
              to="/gallery" 
              className="text-gray-400 hover:text-white flex items-center gap-2 tracking-widest text-sm transition-colors hover:translate-x-2 duration-300"
            >
              VIEW GALLERY <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    
      {/* Animation: 3D Marquee Divider */}
      <div className="py-12 relative z-20">
        {/* Pass dynamic text if available, else fallback */}
        <Marquee3D text={settings.marqueeText || "CHUMA AFRICA. AFROBEAT & AFROHOUSE"} />
      </div>

      {/* Bio Section */}
      <section className="relative py-24 px-4 bg-black/80 backdrop-blur-sm border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <Music className="mx-auto text-chuma-orange mb-6 animate-bounce" size={48} />
          <h2 className="font-display text-4xl font-bold mb-8 text-glitch">THE PULSE</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
            {artist.bio}
          </p>
        </div>
      </section>

      {/* Feature: Tour Dates */}
      <section className="py-24 px-4 border-t border-white/5 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-12 justify-center">
                <Calendar className="text-chuma-gold" size={32} />
                <h2 className="font-display text-5xl font-bold">LIVE DATES</h2>
            </div>
            
            <div className="space-y-4">
                {[
                    { date: "OCT 24", city: "LAGOS", venue: "EKO HOTELS", status: "TICKETS" },
                    { date: "NOV 12", city: "LONDON", venue: "O2 ACADEMY", status: "SOLD OUT" },
                    { date: "NOV 18", city: "BERLIN", venue: "WATERGATE", status: "TICKETS" },
                    { date: "DEC 05", city: "NAIROBI", venue: "CARNIVORE", status: "TICKETS" },
                ].map((gig, idx) => (
                    <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        viewport={{ once: true }}
                        className="group flex flex-col md:flex-row items-center justify-between p-6 border border-white/10 hover:border-chuma-gold hover:bg-white/5 transition-all rounded-lg"
                    >
                        <div className="flex items-center gap-8 w-full md:w-auto">
                            <span className="font-mono text-chuma-gold text-xl font-bold">{gig.date}</span>
                            <div>
                                <h3 className="font-bold text-2xl">{gig.city}</h3>
                                <p className="text-sm text-gray-500">{gig.venue}</p>
                            </div>
                        </div>
                        <button 
                            disabled={gig.status === 'SOLD OUT'}
                            className={`mt-4 md:mt-0 px-8 py-3 font-bold tracking-widest text-sm border ${gig.status === 'SOLD OUT' ? 'border-gray-700 text-gray-700 cursor-not-allowed' : 'border-white hover:bg-white hover:text-black transition-colors'}`}
                        >
                            {gig.status}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
