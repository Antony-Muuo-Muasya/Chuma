import React from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, Music, Image, ShoppingBag, Users, Settings, BarChart2, LogOut, Video } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLayoutProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ activeTab, setActiveTab, children }) => {
    const { logout } = useAuth();

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'music', label: 'Music Manager', icon: Music },
        { id: 'video', label: 'Video Manager', icon: Video },
        { id: 'gallery', label: 'Photo Manager', icon: Image },
        { id: 'store', label: 'Store Manager', icon: ShoppingBag },
        { id: 'users', label: 'User System', icon: Users },
        { id: 'settings', label: 'Global Settings', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-black flex pt-20">
            {/* Sidebar */}
            <aside className="w-64 bg-zinc-900 border-r border-white/10 fixed h-full overflow-y-auto hidden md:block">
                <div className="p-6">
                    <h2 className="text-2xl font-display font-bold text-white mb-1">ADMIN</h2>
                    <p className="text-xs text-chuma-gold tracking-widest">CONTROL PANEL</p>
                </div>
                <nav className="mt-6 space-y-1 px-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                                activeTab === item.id 
                                    ? 'bg-chuma-orange text-white' 
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                            }`}
                        >
                            <item.icon size={18} />
                            {item.label}
                        </button>
                    ))}
                </nav>
                <div className="absolute bottom-24 w-full px-4">
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-900/20 rounded-md transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Mobile Nav (Simplified) */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/10 z-50 flex justify-around p-2">
                 {menuItems.slice(0, 5).map((item) => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`p-2 rounded ${activeTab === item.id ? 'text-chuma-orange' : 'text-gray-400'}`}>
                        <item.icon size={20} />
                    </button>
                 ))}
            </div>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-6 md:p-10 bg-black min-h-screen overflow-x-hidden">
                {children}
            </main>
        </div>
    );
};

export default AdminLayout;
