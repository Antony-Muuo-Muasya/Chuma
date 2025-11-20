import React, { useState, useEffect } from 'react';
import { dbService } from '../services/firebaseSim';
import { MusicTrack } from '../types';
import { Play, Disc } from 'lucide-react';
import YouTubePlayer from '../components/YouTubePlayer';

// Helpers
const getYouTubeID = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

const getSpotifyEmbedUrl = (url: string) => {
  const parts = url.split('track/');
  if (parts.length === 2) {
    const id = parts[1].split('?')[0];
    return `https://open.spotify.com/embed/track/${id}?utm_source=generator&theme=0`;
  }
  return url;
};

const Music: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  const [music, setMusic] = useState<MusicTrack[]>([]);

  useEffect(() => {
    dbService.getMusic().then(setMusic);
  }, []);

  const youtubeTracks = music.filter(m => m.type === 'youtube');
  const spotifyTracks = music.filter(m => m.type === 'spotify');
  const mp3Tracks = music.filter(m => m.type === 'mp3');

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-display text-5xl font-bold">DISCOGRAPHY</h1>
          <div className="flex bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('video')}
              className={`px-6 py-2 rounded-md text-sm font-bold tracking-wider transition-all ${
                activeTab === 'video' ? 'bg-chuma-orange text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              VIDEO
            </button>
            <button
              onClick={() => setActiveTab('audio')}
              className={`px-6 py-2 rounded-md text-sm font-bold tracking-wider transition-all ${
                activeTab === 'audio' ? 'bg-chuma-orange text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              AUDIO
            </button>
          </div>
        </div>

        {activeTab === 'video' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {youtubeTracks.map((track, index) => {
              const id = getYouTubeID(track.url);
              return (
                <div key={index} className="group relative aspect-video bg-gray-900 rounded-xl overflow-hidden border border-white/10 hover:border-chuma-gold transition-colors shadow-2xl">
                  {id ? (
                    <YouTubePlayer videoId={id} title={track.title} />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">Invalid Video URL</div>
                  )}
                  {/* Optional Overlay for info when hovering over player controls isn't blocking */}
                  <div className="absolute top-0 left-0 p-4 pointer-events-none">
                      <p className="text-xs font-bold bg-black/60 backdrop-blur px-2 py-1 rounded text-white inline-block">{track.title}</p>
                  </div>
                  <div className="absolute bottom-0 right-0 p-4 pointer-events-none">
                      <p className="text-[10px] text-gray-300 bg-black/60 backdrop-blur px-2 py-1 rounded">{track.plays.toLocaleString()} views</p>
                  </div>
                </div>
              );
            })}
             {youtubeTracks.length === 0 && <p className="text-gray-500">No videos uploaded yet.</p>}
          </div>
        )}

        {activeTab === 'audio' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Spotify Embeds */}
            {spotifyTracks.map((track, index) => (
              <div key={track.id} className="group flex items-center bg-[#191414] rounded-xl overflow-hidden border border-white/5 hover:border-[#1DB954] transition-colors perspective-1000 hover:bg-[#222]">
                <div className="p-4 text-[#1DB954] relative">
                   <div className="relative w-12 h-12 preserve-3d group-hover:rotate-y-12 transition-transform duration-500">
                      {track.coverArt ? (
                          <img src={track.coverArt} alt="Cover" className="w-full h-full object-cover rounded-full border border-white/10 animate-[spin_10s_linear_infinite]" />
                      ) : (
                        <>
                            <Disc className="animate-spin-slow absolute inset-0 text-[#1DB954] drop-shadow-lg" size={48} />
                            <div className="absolute inset-0 rounded-full border border-white/20 scale-110" />
                        </>
                      )}
                   </div>
                </div>
                <iframe
                  style={{ borderRadius: '12px' }}
                  src={getSpotifyEmbedUrl(track.url)}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allowFullScreen={false}
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  className="z-10"
                ></iframe>
              </div>
            ))}

            {/* MP3 Player Fallback/Custom */}
            {mp3Tracks.map(track => (
                <div key={track.id} className="bg-zinc-900 p-4 rounded-xl border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-gray-800 rounded flex items-center justify-center overflow-hidden">
                             {track.coverArt ? (
                                 <img src={track.coverArt} className="w-full h-full object-cover" alt="art" />
                             ) : (
                                 <Disc size={24} className="text-gray-500" />
                             )}
                         </div>
                         <div>
                             <h4 className="font-bold text-white">{track.title}</h4>
                             <p className="text-xs text-gray-500">{track.artist}</p>
                         </div>
                    </div>
                    <audio controls src={track.url} className="h-8 w-48 md:w-64" />
                </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Music;