import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Admin Components
import AdminLayout from '../components/admin/AdminLayout';
import MusicManager from '../components/admin/MusicManager';
import StoreManager from '../components/admin/StoreManager';
import UserManager from '../components/admin/UserManager';
import SettingsManager from '../components/admin/SettingsManager';
import VideoManager from '../components/admin/VideoManager';

// Temporary placeholder for simple dashboard view (re-using logic from old Admin if needed, or creating a new one)
import { dbService } from '../services/firebaseSim';
import { AnalyticsData, Notification } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bell } from 'lucide-react';

const DashboardHome: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        dbService.getAnalytics().then(setAnalytics);
        dbService.getNotifications().then(setNotifications);
    }, []);

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900 p-6 rounded border border-white/10">
                    <h3 className="text-gray-400 text-sm font-bold mb-2">TOTAL REVENUE</h3>
                    <p className="text-3xl text-chuma-gold font-mono">$45,230.00</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded border border-white/10">
                    <h3 className="text-gray-400 text-sm font-bold mb-2">ACTIVE USERS</h3>
                    <p className="text-3xl text-white font-mono">1,204</p>
                </div>
                <div className="bg-zinc-900 p-6 rounded border border-white/10">
                    <h3 className="text-gray-400 text-sm font-bold mb-2">MUSIC STREAMS</h3>
                    <p className="text-3xl text-chuma-orange font-mono">85.4K</p>
                </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded border border-white/10">
                 <h3 className="text-white font-bold mb-6">SALES OVERVIEW</h3>
                 <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                            <XAxis dataKey="date" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip contentStyle={{ backgroundColor: '#000', border: '1px solid #333' }} />
                            <Bar dataKey="purchases" fill="#D4AF37" />
                        </BarChart>
                    </ResponsiveContainer>
                 </div>
            </div>

            <div className="bg-zinc-900 p-6 rounded border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="text-chuma-orange" size={20} />
                    <h3 className="text-white font-bold">RECENT NOTIFICATIONS</h3>
                </div>
                <div className="space-y-3">
                    {notifications.length === 0 && <p className="text-gray-500">No new notifications.</p>}
                    {notifications.map(n => (
                        <div key={n.id} className="flex justify-between items-center border-b border-gray-800 pb-2">
                            <span className="text-gray-300">{n.message}</span>
                            <span className="text-xs text-gray-600">{new Date(n.date).toLocaleDateString()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const Admin: React.FC = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
        navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) return <div className="h-screen flex items-center justify-center text-white">Loading System...</div>;

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab}>
        {activeTab === 'dashboard' && <DashboardHome />}
        {activeTab === 'music' && <MusicManager />}
        {activeTab === 'store' && <StoreManager />}
        {activeTab === 'users' && <UserManager />}
        {activeTab === 'settings' && <SettingsManager />}
        {activeTab === 'video' && <VideoManager />}
        {activeTab === 'gallery' && <div className="text-white">Photo Manager coming soon...</div>}
    </AdminLayout>
  );
};

export default Admin;