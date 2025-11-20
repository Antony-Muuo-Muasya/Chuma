import { UserProfile, AnalyticsData, MusicTrack, VideoItem, GalleryItem, Product, GlobalSettings, Notification, Order } from '../types';
import { INITIAL_DATA } from '../constants';

// Simulating a Database state in memory
let currentUser: UserProfile | null = null;

// State Store
let db = {
  users: [] as UserProfile[],
  music: [...INITIAL_DATA.music],
  videos: [...INITIAL_DATA.videos],
  gallery: [...INITIAL_DATA.gallery],
  products: [...INITIAL_DATA.store.products],
  settings: { ...INITIAL_DATA.settings },
  notifications: [] as Notification[],
  orders: [] as Order[],
  analytics: [
    { date: '2023-10-01', pageViews: 120, musicClicks: 45, purchases: 2 },
    { date: '2023-10-02', pageViews: 150, musicClicks: 60, purchases: 5 },
    { date: '2023-10-03', pageViews: 300, musicClicks: 120, purchases: 12 },
    { date: '2023-10-04', pageViews: 220, musicClicks: 90, purchases: 8 },
    { date: '2023-10-05', pageViews: 400, musicClicks: 150, purchases: 20 },
  ] as AnalyticsData[]
};

// Initialize a fake admin
db.users.push({
  uid: 'admin_001',
  name: 'Admin User',
  email: 'admin@chuma.com',
  role: 'admin',
  status: 'active',
  joinedAt: new Date().toISOString()
});

// --- DATA PERSISTENCE SIMULATION ---
// Restore session user to memory DB if they exist in localStorage (Simulating persistence across refreshes)
try {
    const stored = localStorage.getItem('chuma_user');
    if (stored) {
        const u = JSON.parse(stored);
        // Avoid duplicating admin if they are the stored user
        if (!db.users.some(user => user.uid === u.uid)) {
             db.users.push(u);
        }
    }
} catch (e) {
    console.error("Failed to restore user session", e);
}

export const authService = {
  login: async (email: string): Promise<UserProfile> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user exists
        let user = db.users.find(u => u.email === email);
        
        if (!user) {
            // Auto register for demo purposes if not exists
            const role = email.includes('admin') ? 'admin' : 'user';
            user = {
                uid: 'uid_' + Math.random().toString(36).substr(2, 9),
                name: email.split('@')[0],
                email,
                role,
                status: 'active',
                cart: [],
                joinedAt: new Date().toISOString()
            };
            db.users.push(user);
            
            // Notify Admin
            if (role === 'user') {
                db.notifications.push({
                    id: Date.now().toString(),
                    type: 'info',
                    message: `New user registered: ${user.name}`,
                    read: false,
                    date: new Date().toISOString()
                });
            }
        }

        if (user.status === 'banned') {
            reject("This account has been suspended.");
            return;
        }

        currentUser = user;
        localStorage.setItem('chuma_user', JSON.stringify(currentUser));
        resolve(currentUser);
      }, 800);
    });
  },
  
  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      currentUser = null;
      localStorage.removeItem('chuma_user');
      resolve();
    });
  },

  getCurrentUser: (): UserProfile | null => {
    const stored = localStorage.getItem('chuma_user');
    if (stored) {
      currentUser = JSON.parse(stored);
    }
    return currentUser;
  }
};

export const dbService = {
  // --- Content: Music ---
  getMusic: async (): Promise<MusicTrack[]> => Promise.resolve(db.music),
  addMusic: async (track: Omit<MusicTrack, 'id' | 'plays'>) => {
    const newTrack = { ...track, id: 'm_' + Date.now(), plays: 0 };
    db.music.push(newTrack);
    return newTrack;
  },
  deleteMusic: async (id: string) => {
    db.music = db.music.filter(m => m.id !== id);
  },

  // --- Content: Videos ---
  getVideos: async (): Promise<VideoItem[]> => Promise.resolve(db.videos),
  addVideo: async (video: Omit<VideoItem, 'id'>) => {
    const newVideo = { ...video, id: 'v_' + Date.now() };
    db.videos.push(newVideo);
    return newVideo;
  },
  deleteVideo: async (id: string) => {
    db.videos = db.videos.filter(v => v.id !== id);
  },

  // --- Content: Gallery ---
  getGallery: async (): Promise<GalleryItem[]> => Promise.resolve(db.gallery),
  addGalleryItem: async (item: Omit<GalleryItem, 'id'>) => {
    const newItem = { ...item, id: 'g_' + Date.now() };
    db.gallery.push(newItem);
    return newItem;
  },
  deleteGalleryItem: async (id: string) => {
    db.gallery = db.gallery.filter(g => g.id !== id);
  },

  // --- Content: Store ---
  getProducts: async (): Promise<Product[]> => Promise.resolve(db.products),
  addProduct: async (product: Omit<Product, 'id'>) => {
      const newProduct = { ...product, id: 'p_' + Date.now() };
      db.products.push(newProduct);
      return newProduct;
  },
  deleteProduct: async (id: string) => {
      db.products = db.products.filter(p => p.id !== id);
  },

  // --- User Management ---
  getAllUsers: async (): Promise<UserProfile[]> => {
    if (currentUser?.role !== 'admin') throw new Error("Unauthorized");
    return Promise.resolve(db.users);
  },
  updateUserStatus: async (uid: string, status: 'active' | 'banned') => {
     const user = db.users.find(u => u.uid === uid);
     if (user) user.status = status;
  },
  updateUserRole: async (uid: string, role: 'admin' | 'user') => {
    const user = db.users.find(u => u.uid === uid);
    if (user) user.role = role;
  },

  // --- Settings ---
  getSettings: async (): Promise<GlobalSettings> => Promise.resolve(db.settings),
  updateSettings: async (settings: Partial<GlobalSettings>) => {
    db.settings = { ...db.settings, ...settings };
  },

  // --- Analytics & Notifications ---
  getAnalytics: async (): Promise<AnalyticsData[]> => {
    if (currentUser?.role !== 'admin') throw new Error("Permission Denied");
    return Promise.resolve(db.analytics);
  },
  getNotifications: async (): Promise<Notification[]> => Promise.resolve(db.notifications),
  
  // Calculate real-time stats for dashboard cards
  getDashboardStats: async () => {
    if (currentUser?.role !== 'admin') throw new Error("Unauthorized");
    
    const totalUsers = db.users.length;
    const totalStreams = db.music.reduce((acc, curr) => acc + curr.plays, 0);
    // Base mock revenue + simulated calculation
    const totalRevenue = 45230 + (totalUsers * 15); 
    
    return Promise.resolve({
        totalUsers,
        totalStreams,
        totalRevenue
    });
  },

  // --- Commerce ---
  addToCart: async (productId: string) => {
    if (!currentUser) throw new Error("Must be logged in");
    console.log(`Added ${productId} to ${currentUser.uid} cart`);
    // Simulate order creation on checkout
    return true;
  },

  // --- File Upload Simulation ---
  uploadFile: async (file: File): Promise<string> => {
      return new Promise((resolve) => {
          setTimeout(() => {
              // Determine type to mock URL
              if (file.type.includes('image')) resolve(URL.createObjectURL(file));
              else if (file.type.includes('audio')) resolve('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'); // Dummy MP3
              else resolve(URL.createObjectURL(file));
          }, 1500);
      })
  }
};