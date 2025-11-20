import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/firebaseSim';
import { Product } from '../../types';
import { Trash2, Plus, Upload } from 'lucide-react';

const StoreManager: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState<Partial<Product>>({});

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        setProducts(await dbService.getProducts());
    };

    const handleAdd = async () => {
        if (!newProduct.name || !newProduct.price) return;
        await dbService.addProduct({
            name: newProduct.name,
            price: Number(newProduct.price),
            stock: Number(newProduct.stock || 0),
            description: newProduct.description || '',
            imageUrl: newProduct.imageUrl || 'https://via.placeholder.com/400',
            sizes: newProduct.sizes || [],
            colors: newProduct.colors || []
        });
        setNewProduct({});
        loadProducts();
    };

    return (
        <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white">Store Inventory</h2>
            
            {/* Add Product */}
             <div className="bg-zinc-900 p-6 rounded-lg border border-white/10 space-y-4">
                <h3 className="font-bold text-chuma-gold">ADD PRODUCT</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input className="bg-black border border-gray-700 p-2 rounded text-white" placeholder="Product Name" onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                    <input className="bg-black border border-gray-700 p-2 rounded text-white" type="number" placeholder="Price" onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
                    <input className="bg-black border border-gray-700 p-2 rounded text-white" type="number" placeholder="Stock Qty" onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
                    <textarea className="bg-black border border-gray-700 p-2 rounded text-white md:col-span-2" placeholder="Description" onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                </div>
                <button onClick={handleAdd} className="bg-chuma-orange px-6 py-2 rounded font-bold flex items-center gap-2">
                    <Plus size={18} /> ADD ITEM
                </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(p => (
                    <div key={p.id} className="bg-zinc-900 p-4 rounded border border-white/10 relative group">
                        <img src={p.imageUrl} alt={p.name} className="w-full h-32 object-cover rounded mb-4 bg-black" />
                        <h4 className="font-bold text-lg">{p.name}</h4>
                        <div className="flex justify-between text-sm text-gray-400 mt-2">
                            <span>${p.price}</span>
                            <span>Stock: {p.stock}</span>
                        </div>
                        <button 
                            onClick={async () => { await dbService.deleteProduct(p.id); loadProducts(); }}
                            className="absolute top-2 right-2 bg-red-600 p-2 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StoreManager;
