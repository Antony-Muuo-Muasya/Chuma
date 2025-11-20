export interface Artist {
  name: string;
  tagline: string;
  bio: string;
  images: string[];
}

export type MusicType = 'spotify' | 'youtube' | 'mp3';

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  album: string;
  type: MusicType;
  url: string;
  coverArt?: string;
  category?: 'Afrobeat' | 'Afrohouse' | 'Afrofusion';
  plays: number;
}

export interface VideoItem {
  id: string;
  title: string;
  url: string; // YouTube link or file url
  thumbnail?: string;
  views?: number;
}

export interface GalleryItem {
  id: string;
  title: string;
  url: string;
  featured: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  stock: number;
  sizes?: string[];
  colors?: string[];
}

export interface Store {
  products: Product[];
}

export interface GlobalSettings {
  heroText: string;
  marqueeText: string;
  maintenanceMode: boolean;
  contactEmail: string;
  bookingEmail: string;
  socials: {
    instagram: string;
    twitter: string;
    youtube: string;
  };
  themeColor: string;
}

export interface SiteData {
  artist: Artist;
  music: MusicTrack[];
  videos: VideoItem[];
  gallery: GalleryItem[];
  store: Store;
  settings: GlobalSettings;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  status: 'active' | 'banned';
  cart?: string[];
  joinedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: string[]; // Product IDs
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  date: string;
}

export interface AnalyticsData {
  date: string;
  pageViews: number;
  musicClicks: number;
  purchases: number;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  message: string;
  read: boolean;
  date: string;
}