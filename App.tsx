import React, { Suspense, useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Background3D from './components/Background3D';
import { AuthProvider } from './context/AuthContext';
import { Mail } from 'lucide-react';

// Lazy load pages
const Home = React.lazy(() => import('./pages/Home'));
const Music = React.lazy(() => import('./pages/Music'));
const Gallery = React.lazy(() => import('./pages/Gallery'));
const Store = React.lazy(() => import('./pages/Store'));
const Admin = React.lazy(() => import('./pages/Admin'));
const Login = React.lazy(() => import('./pages/Login'));

// Scroll Progress Bar Component
const ScrollProgress = () => {
    const [width, setWidth] = useState(0);
    useEffect(() => {
        const handleScroll = () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.pageYOffset / totalHeight) * 100;
            setWidth(progress);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    return (
        <div className="fixed top-0 left-0 h-1 bg-gradient-to-r from-chuma-orange to-chuma-gold z-[60]" style={{ width: `${width}%` }} />
    );
};

// Newsletter Floating Button
const NewsletterFAB = () => (
    <button 
        className="fixed bottom-20 right-6 md:bottom-6 md:right-6 z-30 bg-chuma-gold text-black p-4 rounded-full shadow-lg shadow-chuma-gold/20 hover:scale-110 transition-transform group"
        onClick={() => alert("Joined the tribe!")}
    >
        <Mail size={24} />
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-white text-black text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            JOIN THE TRIBE
        </span>
    </button>
);

const SplashScreen = () => (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-black z-[70]">
        <div className="font-display font-black text-6xl text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 animate-pulse">
            CHUMA
        </div>
        <div className="mt-4 w-32 h-1 bg-gray-800 rounded overflow-hidden">
            <div className="h-full bg-chuma-orange animate-[glitch_1s_ease-in-out_infinite] w-full origin-left"></div>
        </div>
    </div>
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ScrollProgress />
      <Background3D />
      
      <Router>
        <div className="relative z-10 text-white perspective-1000">
          <Navbar />
          <Suspense fallback={<SplashScreen />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/music" element={<Music />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/store" element={<Store />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </Suspense>
          
          <NewsletterFAB />
          
          <footer className="py-12 border-t border-white/5 text-center text-gray-500 text-sm relative z-20 bg-black/80 backdrop-blur-lg mb-16 md:mb-0">
            <p>&copy; {new Date().getFullYear()} CHUMA MUSIC. ALL RIGHTS RESERVED.</p>
            <p className="mt-2 text-xs">DESIGNED BY GEMINI 3 PRO</p>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;