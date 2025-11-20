import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, User, ShoppingBag, LogOut, Instagram, Twitter, Youtube } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'MUSIC', path: '/music' },
    { name: 'GALLERY', path: '/gallery' },
    { name: 'STORE', path: '/store' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 perspective-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          <Link to="/" className="flex-shrink-0 group">
            <span className="font-display font-black text-2xl tracking-widest text-white group-hover:text-chuma-gold transition-colors">
              CHU<span className="text-chuma-orange">MA</span>
            </span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="relative group"
                >
                  <div className="relative overflow-hidden px-3 py-2">
                    {/* 3D Rolling Text Effect */}
                    <motion.div
                      className="relative"
                      initial="initial"
                      whileHover="hover"
                      variants={{
                        initial: { y: 0 },
                        hover: { y: "-100%" }
                      }}
                      transition={{ type: "tween", ease: "easeInOut", duration: 0.3 }}
                    >
                       <span className={`block text-sm font-bold tracking-wider ${isActive(link.path) ? 'text-chuma-gold' : 'text-gray-300'}`}>
                         {link.name}
                       </span>
                       <span className="absolute top-full left-0 block text-sm font-bold tracking-wider text-chuma-orange">
                         {link.name}
                       </span>
                    </motion.div>
                  </div>
                  {isActive(link.path) && (
                    <motion.div 
                      layoutId="underline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-chuma-gold"
                    />
                  )}
                </Link>
              ))}
              
              {user?.role === 'admin' && (
                <Link to="/admin" className="text-red-500 font-bold text-sm px-3 py-2 border border-red-900 rounded hover:bg-red-900/20">
                  DASHBOARD
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6">
             {/* Socials */}
             <div className="flex items-center gap-3 border-r border-gray-700 pr-6">
                <a href="#" className="text-gray-400 hover:text-chuma-gold transition-colors"><Instagram size={18} /></a>
                <a href="#" className="text-gray-400 hover:text-chuma-gold transition-colors"><Twitter size={18} /></a>
                <a href="#" className="text-gray-400 hover:text-chuma-gold transition-colors"><Youtube size={18} /></a>
             </div>

             {user ? (
               <div className="flex items-center gap-4">
                 <span className="text-xs text-gray-400 uppercase font-mono">{user.name}</span>
                 <button onClick={logout} className="text-gray-400 hover:text-white">
                   <LogOut size={18} />
                 </button>
               </div>
             ) : (
               <Link to="/login" className="flex items-center gap-2 text-sm font-medium text-chuma-gold hover:text-white">
                 <User size={18} /> LOGIN
               </Link>
             )}
             <Link to="/store" className="text-gray-300 hover:text-chuma-orange">
               <ShoppingBag size={20} />
             </Link>
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-black border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700"
              >
                {link.name}
              </Link>
            ))}
             {user?.role === 'admin' && (
                <Link to="/admin" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-red-400 font-bold">
                  ADMIN DASHBOARD
                </Link>
              )}
             <div className="border-t border-gray-800 mt-4 pt-4">
                {user ? (
                  <button onClick={logout} className="block w-full text-left px-3 py-2 text-base font-medium text-gray-300">Logout</button>
                ) : (
                  <Link to="/login" onClick={() => setIsOpen(false)} className="block px-3 py-2 text-base font-medium text-chuma-gold">Login</Link>
                )}
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;