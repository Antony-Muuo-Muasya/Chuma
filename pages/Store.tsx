import React, { useEffect, useState } from 'react';
import { dbService } from '../services/firebaseSim';
import { Product } from '../types';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Flame, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Store: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
      dbService.getProducts().then(setProducts);
  }, []);

  const handleAddToCart = async (productId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await dbService.addToCart(productId);
      alert("Added to cart!");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 pb-12 perspective-1000">
      <h1 className="font-display text-5xl font-bold text-center mb-4">STORE</h1>
      <p className="text-center text-gray-400 mb-16 tracking-widest">OFFICIAL MERCHANDISE</p>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, idx) => (
          <div key={product.id} className="group relative h-[500px] w-full perspective-1000 cursor-pointer">
            {/* Animation: 3D Card Flip Wrapper */}
            <motion.div 
                className="relative h-full w-full preserve-3d transition-transform duration-700 group-hover:rotate-y-180"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: idx * 0.1 }}
            >
                {/* Front of Card */}
                <div className="absolute inset-0 backface-hidden bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col shadow-lg">
                    <div className="aspect-square bg-black relative overflow-hidden">
                        <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-chuma-orange text-white px-3 py-1 font-bold rounded shadow-lg">
                            ${product.price}
                        </div>
                        {idx === 0 && (
                            <div className="absolute bottom-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1 animate-pulse">
                                <Flame size={12} fill="currentColor" /> HOT
                            </div>
                        )}
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-between bg-gray-900">
                        <div>
                            <h3 className="font-bold text-xl mb-2">{product.name}</h3>
                            <p className="text-gray-400 text-sm">Hover to see details...</p>
                        </div>
                        <div className="flex justify-end text-chuma-gold">
                            <RotateCw size={20} />
                        </div>
                    </div>
                </div>

                {/* Back of Card (Details) */}
                <div className="absolute inset-0 backface-hidden rotate-y-180 bg-chuma-gold rounded-lg overflow-hidden flex flex-col p-8 text-black justify-center items-center shadow-[0_0_30px_rgba(212,175,55,0.3)]">
                    <h3 className="font-black text-3xl mb-4 text-center leading-none">{product.name.toUpperCase()}</h3>
                    <p className="text-center font-medium mb-8">{product.description}</p>
                    <div className="text-sm font-mono mb-8 border-y border-black/20 py-2 w-full text-center">
                        STOCK: {product.stock} UNITS
                    </div>
                    <button 
                        onClick={(e) => handleAddToCart(product.id, e)}
                        disabled={product.stock === 0}
                        className="w-full bg-black text-white py-4 rounded font-bold hover:scale-105 transition-transform flex justify-center items-center gap-2 disabled:opacity-50"
                    >
                        <ShoppingCart size={18} /> {product.stock === 0 ? 'SOLD OUT' : 'ADD TO CART'}
                    </button>
                </div>
            </motion.div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Store;
