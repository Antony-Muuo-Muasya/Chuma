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

import { dbService } from '../services/firebaseSim';
import { AnalyticsData, Notification } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, Legend
} from 'recharts';
import { Bell, TrendingUp, Users, DollarSign, Music, Activity } from 'lucide-react';

// --- MOCK DATA FOR VISUALIZATION ---
const REVENUE_DATA = [
  { month: 'Jan', revenue: 12000, profit: 6000 },
  { month: 'Feb', revenue: 19000, profit: 10000 },
  { month: 'Mar', revenue: 15000, profit: 8000 },
  { month: 'Apr', revenue: 24000, profit: 14000 },
  { month: 'May', revenue: 32000, profit: 18000 },
  { month: 'Jun', revenue: 28000, profit: 16000 },
  { month: 'Jul', revenue: 45230, profit: 28000 },
];

const INITIAL_USER_GROWTH = [
  { month: 'Jan', users: 120 },
  { month: 'Feb', users: 250 },
  { month: 'Mar', users: 400 },
  { month: 'Apr', users: 580 },
  { month: 'May', users: 890 },
  { month: 'Jun', users: 1100 },
  { month: 'Jul', users: 1204 }, // This will be updated dynamically
];

const SOURCE_DATA = [
  { name: 'Merch Store', value: 35 },
  { name: 'Streaming', value: 45 },
  { name: 'Concert Tickets', value: 20 },
];

const TOP_TRACKS_DATA = [
  { name: 'City Boys', plays: 4500 },
  { name: 'Unavailable', plays: 3800 },
  { name: 'Amapiano', plays: 3200 },
  { name: 'Calm Down', plays: 2900 },
  { name: 'Last Last', plays: 2100 },
];

const LISTENER_ACTIVITY_DATA = [
  { time: '00:00', mobile: 200, desktop: 50 },
  { time: '04:00', mobile: 100, desktop: 30 },
  { time: '08:00', mobile: 800, desktop: 400 },
  { time: '12:00', mobile: 2500, desktop: 1200 },
  { time: '16:00', mobile: 3200, desktop: 1800 },
  { time: '20:00', mobile: 4500, desktop: 2200 },
  { time: '23:59', mobile: 1800, desktop: 900 },
];

const COLORS = ['#D4AF37', '#E85D04', '#FFFFFF', '#333333'];

const DashboardHome: React.FC = () => {
    const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [liveStats, setLiveStats] = useState({ totalUsers: 0, totalStreams: 0, totalRevenue: 0 });
    const [userGrowthData, setUserGrowthData] = useState(INITIAL_USER_GROWTH);

    useEffect(() => {
        dbService.getAnalytics().then(setAnalytics);
        dbService.getNotifications().then(setNotifications);
        
        // Fetch real-time calculated stats
        dbService.getDashboardStats().then(stats => {
            setLiveStats(stats);
            // Update the graph to reflect the current real user count
            setUserGrowthData(prev => {
                const newData = [...prev];
                const lastIndex = newData.length - 1;
                newData[lastIndex] = { ...newData[lastIndex], users: stats.totalUsers };
                return newData;
            });
        });
    }, []);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-black border border-white/20 p-3 rounded shadow-xl">
                    <p className="text-white font-bold mb-1">{label}</p>
                    {payload.map((p: any, index: number) => (
                        <p key={index} style={{ color: p.color }} className="text-xs">
                            {p.name}: {p.value.toLocaleString()}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-900/80 backdrop-blur p-6 rounded border border-white/10 relative overflow-hidden group hover:border-chuma-gold/50 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-400 text-xs font-bold tracking-widest mb-1">TOTAL REVENUE</h3>
                            <p className="text-4xl text-white font-mono font-bold">${liveStats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-chuma-gold/10 rounded-full text-chuma-gold">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center text-green-500 text-sm font-medium">
                        <TrendingUp size={16} className="mr-1" /> +12.5% from last month
                    </div>
                </div>

                <div className="bg-zinc-900/80 backdrop-blur p-6 rounded border border-white/10 relative overflow-hidden group hover:border-chuma-gold/50 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-400 text-xs font-bold tracking-widest mb-1">ACTIVE USERS</h3>
                            <p className="text-4xl text-white font-mono font-bold">{liveStats.totalUsers.toLocaleString()}</p>
                        </div>
                        <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                            <Users size={24} />
                        </div>
                    </div>
                     <div className="mt-4 flex items-center text-green-500 text-sm font-medium">
                        <TrendingUp size={16} className="mr-1" /> Real-time count
                    </div>
                </div>

                <div className="bg-zinc-900/80 backdrop-blur p-6 rounded border border-white/10 relative overflow-hidden group hover:border-chuma-gold/50 transition-colors">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-gray-400 text-xs font-bold tracking-widest mb-1">MUSIC STREAMS</h3>
                            <p className="text-4xl text-white font-mono font-bold">{(liveStats.totalStreams / 1000).toFixed(1)}K</p>
                        </div>
                        <div className="p-3 bg-chuma-orange/10 rounded-full text-chuma-orange">
                            <Music size={24} />
                        </div>
                    </div>
                     <div className="mt-4 flex items-center text-chuma-orange text-sm font-medium">
                        <Activity size={16} className="mr-1" /> Across all platforms
                    </div>
                </div>
            </div>

            {/* GRAPH 1: Revenue & Profit Trends (Area Chart) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-zinc-900/50 p-6 rounded border border-white/10">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <TrendingUp size={18} className="text-chuma-gold" /> FINANCIAL PERFORMANCE
                    </h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#D4AF37" stopOpacity={0}/>
                                    </linearGradient>
                                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E85D04" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#E85D04" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#666" />
                                <YAxis stroke="#666" tickFormatter={(val) => `$${val/1000}k`} />
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend iconType="circle" />
                                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#D4AF37" fillOpacity={1} fill="url(#colorRev)" />
                                <Area type="monotone" dataKey="profit" name="Net Profit" stroke="#E85D04" fillOpacity={1} fill="url(#colorProf)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* GRAPH 2: Revenue Sources (Pie Chart) */}
                <div className="bg-zinc-900/50 p-6 rounded border border-white/10">
                     <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <DollarSign size={18} className="text-green-500" /> INCOME SOURCES
                    </h3>
                    <div className="h-80 relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={SOURCE_DATA}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {SOURCE_DATA.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center text overlay */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                            <span className="text-3xl font-bold text-white">100%</span>
                            <span className="text-xs text-gray-500">DISTRIBUTION</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ROW 2: User Growth & Top Tracks */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {/* GRAPH 3: User Growth (Line Chart) */}
                 <div className="bg-zinc-900/50 p-6 rounded border border-white/10">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Users size={18} className="text-blue-500" /> USER GROWTH CURVE
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={userGrowthData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="month" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="users" name="Registered Users" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* GRAPH 4: Top Tracks (Bar Chart) */}
                <div className="bg-zinc-900/50 p-6 rounded border border-white/10">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Music size={18} className="text-purple-500" /> TOP STREAMING TRACKS
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={TOP_TRACKS_DATA} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" horizontal={false} />
                                <XAxis type="number" stroke="#666" hide />
                                <YAxis dataKey="name" type="category" stroke="#fff" width={100} tick={{fontSize: 12}} />
                                <Tooltip content={<CustomTooltip />} cursor={{fill: 'transparent'}} />
                                <Bar dataKey="plays" name="Streams" fill="#D4AF37" radius={[0, 4, 4, 0]} barSize={20} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* ROW 3: Listener Activity & Sales */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* GRAPH 5: Listener Activity (Multi-Line) */}
                 <div className="lg:col-span-2 bg-zinc-900/50 p-6 rounded border border-white/10">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Activity size={18} className="text-red-500" /> LISTENER ACTIVITY (24H)
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={LISTENER_ACTIVITY_DATA}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="time" stroke="#666" />
                                <YAxis stroke="#666" />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line type="step" dataKey="mobile" name="Mobile Listeners" stroke="#E85D04" strokeWidth={2} dot={false} />
                                <Line type="step" dataKey="desktop" name="Desktop Listeners" stroke="#ffffff" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* GRAPH 6: Sales Overview (Simple Bar - Legacy) */}
                <div className="bg-zinc-900/50 p-6 rounded border border-white/10">
                     <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <DollarSign size={18} className="text-white" /> STORE ORDERS
                    </h3>
                     <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="date" stroke="#666" tick={{fontSize: 10}} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                                <YAxis stroke="#666" />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="purchases" name="Orders" fill="#ffffff" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                     </div>
                </div>
            </div>

            {/* Notifications Panel */}
            <div className="bg-zinc-900 p-6 rounded border border-white/10">
                <div className="flex items-center gap-2 mb-4">
                    <Bell className="text-chuma-orange" size={20} />
                    <h3 className="text-white font-bold">SYSTEM ALERTS</h3>
                </div>
                <div className="space-y-3">
                    {notifications.length === 0 && <p className="text-gray-500">No new notifications.</p>}
                    {notifications.map(n => (
                        <div key={n.id} className="flex justify-between items-center border-b border-gray-800 pb-2 hover:bg-white/5 p-2 rounded transition-colors">
                            <span className="text-gray-300">{n.message}</span>
                            <span className="text-xs text-gray-600 font-mono">{new Date(n.date).toLocaleDateString()}</span>
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