import { SiteData } from './types';

// Helper to convert Drive View links to Direct Image links for the UI
export const getDriveDirectLink = (url: string): string => {
  const id = url.match(/\/d\/(.+?)\//)?.[1];
  if (id) return `https://lh3.googleusercontent.com/d/${id}`;
  return url;
};

// Initial Data used to seed the simulation
export const INITIAL_DATA: SiteData = {
  artist: {
    name: "CHUMA",
    tagline: "The Sound & Pulse of Afrobeat & Afrohouse",
    bio: "CHUMA is a commanding force in modern African music, blending traditional rhythms with futuristic synth-heavy productions. His sound is an immersive experience that transcends borders.",
    images: [
      "https://drive.google.com/file/d/1WBNES7Jnc4FVaPjfdXNwR8Y1y0QfvYDJ/view?usp=sharing",
      "https://drive.google.com/file/d/1RLWXAGPHUQ6uJTM9nY0CKraSWAeETZez/view?usp=sharing",
      "https://drive.google.com/file/d/1F8OlLBlM3jHVYsmiCm4C3H6D_c6ynMgg/view?usp=sharing"
    ]
  },
  music: [
    { 
        id: 'm1', 
        title: 'City Boys', 
        artist: 'Burna Boy', 
        album: 'I Told Them', 
        type: 'youtube', 
        url: 'https://www.youtube.com/watch?v=PhvDRYT81Gk', 
        category: 'Afrobeat', 
        plays: 75430210,
        coverArt: 'https://img.youtube.com/vi/PhvDRYT81Gk/maxresdefault.jpg'
    },
    { 
        id: 'm2', 
        title: 'This Is Nigeria', 
        artist: 'Falz', 
        album: 'Moral Instruction', 
        type: 'youtube', 
        url: 'https://www.youtube.com/watch?v=6gzp9_FE_Qs', 
        category: 'Afrobeat', 
        plays: 26100500,
        coverArt: 'https://img.youtube.com/vi/6gzp9_FE_Qs/maxresdefault.jpg'
    },
    { 
        id: 'm3', 
        title: 'Unavailable', 
        artist: 'Davido', 
        album: 'Timeless', 
        type: 'youtube', 
        url: 'https://www.youtube.com/watch?v=syu-DjNbEQA', 
        category: 'Afrobeat', 
        plays: 125800900,
        coverArt: 'https://img.youtube.com/vi/syu-DjNbEQA/maxresdefault.jpg'
    },
    { 
        id: 'm4', 
        title: 'Calm Down', 
        artist: 'Rema', 
        album: 'Rave & Roses', 
        type: 'youtube', 
        url: 'https://www.youtube.com/watch?v=xw0fPz9-g80', 
        category: 'Afrofusion', 
        plays: 670500000,
        coverArt: 'https://img.youtube.com/vi/xw0fPz9-g80/maxresdefault.jpg'
    },
    { 
        id: 'm5', 
        title: 'Amapiano', 
        artist: 'Asake', 
        album: 'Work of Art', 
        type: 'youtube', 
        url: 'https://www.youtube.com/watch?v=ucv-QoQYcCo', 
        category: 'Afrohouse', 
        plays: 62300100,
        coverArt: 'https://img.youtube.com/vi/ucv-QoQYcCo/maxresdefault.jpg'
    },
  ],
  videos: [
     { id: 'v1', title: 'City Boys (Official Video)', url: 'https://www.youtube.com/watch?v=PhvDRYT81Gk', thumbnail: 'https://img.youtube.com/vi/PhvDRYT81Gk/maxresdefault.jpg', views: 75430210 },
     { id: 'v2', title: 'This Is Nigeria (Official Video)', url: 'https://www.youtube.com/watch?v=6gzp9_FE_Qs', thumbnail: 'https://img.youtube.com/vi/6gzp9_FE_Qs/maxresdefault.jpg', views: 26100500 }
  ],
  gallery: [
    { id: 'g1', title: 'Concert 1', url: "https://drive.google.com/file/d/1WBNES7Jnc4FVaPjfdXNwR8Y1y0QfvYDJ/view?usp=sharing", featured: true },
    { id: 'g2', title: 'Studio', url: "https://drive.google.com/file/d/1RLWXAGPHUQ6uJTM9nY0CKraSWAeETZez/view?usp=sharing", featured: false },
    { id: 'g3', title: 'Press', url: "https://drive.google.com/file/d/1F8OlLBlM3jHVYsmiCm4C3H6D_c6ynMgg/view?usp=sharing", featured: false }
  ],
  store: {
    products: [
      {
        id: "p1",
        name: "CHUMA Signature Hoodie",
        price: 45.00,
        stock: 50,
        description: "Limited edition black hoodie with gold embroidery.",
        imageUrl: "https://picsum.photos/400/400?random=1",
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['Black', 'Gold']
      },
      {
        id: "p2",
        name: "Afro Pulse Vinyl",
        price: 30.00,
        stock: 100,
        description: "180g vinyl featuring the latest hits.",
        imageUrl: "https://picsum.photos/400/400?random=2"
      }
    ]
  },
  settings: {
    heroText: "The Sound & Pulse of Afrobeat & Afrohouse",
    marqueeText: "CHUMA AFRICA. AFROBEAT & AFROHOUSE",
    maintenanceMode: false,
    contactEmail: "management@chuma.com",
    bookingEmail: "book@chuma.com",
    socials: {
      instagram: "https://instagram.com",
      twitter: "https://twitter.com",
      youtube: "https://youtube.com"
    },
    themeColor: "#D4AF37"
  }
};

// Backward compatibility export
export const CHUMA_DATA = INITIAL_DATA;

export const FIRESTORE_RULES = `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    function isAdmin() {
      return request.auth != null && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin";
    }
    
    function isOwner(userId) {
      return request.auth != null && request.auth.uid == userId;
    }

    match /users/{userId} {
      allow read: if isOwner(userId) || isAdmin();
      allow create: if true;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }

    match /music/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /videos/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /gallery/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /products/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /settings/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /media/{docId} {
      allow read: if true;
      allow write: if isAdmin();
    }

    match /orders/{orderId} {
      allow create: if request.auth != null;
      allow read: if isOwner(resource.data.userId) || isAdmin();
      allow update, delete: if isAdmin();
    }
    
    match /analytics/{docId} {
      allow read, write: if isAdmin();
    }
  }
}`;