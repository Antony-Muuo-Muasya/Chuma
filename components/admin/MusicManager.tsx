import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/firebaseSim';
import { MusicTrack } from '../../types';
import { Trash2, Plus, Upload, RefreshCw, Image as ImageIcon, Link as LinkIcon, Loader2, AlertCircle } from 'lucide-react';

const MusicManager: React.FC = () => {
    const [tracks, setTracks] = useState<MusicTrack[]>([]);
    const [loading, setLoading] = useState(true);
    const [newTrack, setNewTrack] = useState<Partial<MusicTrack>>({ type: 'spotify', plays: 0, coverArt: '' });
    const [uploading, setUploading] = useState(false);
    const [apiKey, setApiKey] = useState(''); // For YouTube Data API
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        loadTracks();
        // Try to load API key from local storage for convenience
        const storedKey = localStorage.getItem('chuma_yt_api_key');
        if (storedKey) setApiKey(storedKey);
    }, []);

    const loadTracks = async () => {
        const data = await dbService.getMusic();
        setTracks(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this track?")) {
            await dbService.deleteMusic(id);
            loadTracks();
        }
    };

    const handleAdd = async () => {
        if (!newTrack.title || !newTrack.url) return alert("Title and URL required");
        
        await dbService.addMusic({
            ...newTrack,
            artist: newTrack.artist || 'CHUMA',
            plays: newTrack.plays || 0,
            coverArt: newTrack.coverArt || 'https://via.placeholder.com/150'
        } as MusicTrack);
        
        setNewTrack({ type: 'spotify', plays: 0, title: '', artist: '', url: '', coverArt: '' });
        setFetchError('');
        loadTracks();
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setUploading(true);
            const url = await dbService.uploadFile(e.target.files[0]);
            setNewTrack({ ...newTrack, url, type: 'mp3' });
            setUploading(false);
        }
    };

    // --- Metadata & Realtime Stats Logic ---

    const extractYouTubeID = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const fetchMetadata = async (url: string, type: string) => {
        if (!url) return;
        setIsFetchingMetadata(true);
        setFetchError('');

        let updatedTrack = { ...newTrack, url };

        try {
            if (type === 'youtube') {
                const videoId = extractYouTubeID(url);
                if (videoId) {
                    // Normalize URL
                    updatedTrack.url = `https://www.youtube.com/watch?v=${videoId}`;
                    
                    // 1. Get Thumbnail (Max Res)
                    const thumbUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
                    updatedTrack.coverArt = thumbUrl;

                    // 2. Get Real Stats (if API Key provided)
                    if (apiKey) {
                        localStorage.setItem('chuma_yt_api_key', apiKey);
                        const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`);
                        
                        if (!response.ok) {
                             const err = await response.json();
                             throw new Error(err.error?.message || 'YouTube API Error');
                        }
                        
                        const data = await response.json();
                        if (data.items && data.items.length > 0) {
                            const item = data.items[0];
                            updatedTrack.title = item.snippet.title;
                            updatedTrack.artist = item.snippet.channelTitle; // Auto-fill artist with channel name
                            updatedTrack.plays = parseInt(item.statistics.viewCount, 10);
                        } else {
                            setFetchError('Video not found on YouTube.');
                        }
                    } else {
                        setFetchError('API Key missing. Cannot fetch view counts.');
                        // Fallback: Use oEmbed for basic title if no API key
                        try {
                            const response = await fetch(`https://noembed.com/embed?url=${url}`);
                            const data = await response.json();
                            if (data.title) updatedTrack.title = data.title;
                            if (data.author_name) updatedTrack.artist = data.author_name;
                        } catch (e) {
                            console.warn("NoEmbed failed", e);
                        }
                    }
                } else {
                    setFetchError('Invalid YouTube URL.');
                }
            } else if (type === 'spotify') {
                // Spotify OEmbed for Metadata
                const response = await fetch(`https://open.spotify.com/oembed?url=${url}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.thumbnail_url) updatedTrack.coverArt = data.thumbnail_url;
                    if (data.title) updatedTrack.title = data.title;
                } else {
                    setFetchError('Could not fetch Spotify metadata.');
                }
            }
        } catch (error: any) {
            console.error("Error fetching metadata:", error);
            setFetchError(error.message || 'Error fetching metadata.');
        }

        setNewTrack(updatedTrack);
        setIsFetchingMetadata(false);
    };

    const refreshStats = async (track: MusicTrack) => {
        if (track.type === 'youtube' && apiKey) {
            const videoId = extractYouTubeID(track.url);
            if (videoId) {
                try {
                    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`);
                    const data = await response.json();
                    if (data.items && data.items.length > 0) {
                        const newPlays = parseInt(data.items[0].statistics.viewCount, 10);
                        alert(`Updated View Count: ${newPlays.toLocaleString()}`);
                        // In a full implementation, you would update the specific track in dbService here
                        // track.plays = newPlays; 
                        // dbService.updateMusic(track); 
                    }
                } catch (e) {
                    alert("Failed to fetch YouTube stats. Check API Key.");
                }
            }
        } else {
            alert("Please enter a YouTube API Key to fetch real-time stats.");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <h2 className="text-3xl font-bold text-white">Music Library</h2>
                <div className="flex flex-col items-end w-full md:w-auto">
                    <label className="text-[10px] text-gray-500 uppercase font-bold mb-1">YouTube Data API Key</label>
                    <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Paste Google API Key here..."
                        className="bg-black border border-gray-800 text-white text-xs p-2 rounded w-full md:w-64 focus:border-chuma-gold"
                    />
                </div>
            </div>
            
            {/* Add New Track Form */}
            <div className="bg-zinc-900 p-6 rounded-lg border border-white/10 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-chuma-gold">ADD NEW TRACK</h3>
                        <span className="text-xs text-gray-500 bg-black px-2 py-0.5 rounded border border-gray-800">
                            Auto-fetches Metadata on Blur
                        </span>
                    </div>
                    {isFetchingMetadata && (
                         <div className="flex items-center gap-2 text-xs text-chuma-orange animate-pulse">
                             <Loader2 size={14} className="animate-spin" /> Fetching Details...
                         </div>
                    )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Link & Type (Full Width) */}
                    <div className="md:col-span-5">
                        <select 
                            className="w-full bg-black border border-gray-700 p-3 rounded text-white mb-4"
                            value={newTrack.type}
                            onChange={e => setNewTrack({...newTrack, type: e.target.value as any})}
                        >
                            <option value="spotify">Spotify Link</option>
                            <option value="youtube">YouTube Link</option>
                            <option value="mp3">MP3 Upload</option>
                        </select>
                        
                        {newTrack.type === 'mp3' ? (
                            <label className="cursor-pointer bg-gray-800 h-[50px] px-4 rounded hover:bg-gray-700 flex items-center justify-center gap-2 text-sm border border-dashed border-gray-600 w-full">
                                <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload MP3 File'}
                                <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                            </label>
                        ) : (
                            <div className="relative">
                                <LinkIcon size={16} className="absolute top-3.5 left-3 text-gray-500" />
                                <input 
                                    className={`w-full bg-black border p-3 pl-10 rounded text-white focus:border-chuma-orange transition-colors ${!apiKey && newTrack.type === 'youtube' ? 'border-yellow-900/50' : 'border-gray-700'}`} 
                                    placeholder={`Paste ${newTrack.type} URL here...`}
                                    value={newTrack.url || ''}
                                    onChange={e => setNewTrack({...newTrack, url: e.target.value})}
                                    onBlur={(e) => fetchMetadata(e.target.value, newTrack.type || 'spotify')}
                                />
                            </div>
                        )}
                        {fetchError && (
                            <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle size={10} /> {fetchError}
                            </p>
                        )}
                        {!apiKey && newTrack.type === 'youtube' && !fetchError && (
                            <p className="text-[10px] text-yellow-600 mt-1">* Add API Key for real view counts.</p>
                        )}
                    </div>

                    {/* Metadata Inputs */}
                    <div className="md:col-span-4 space-y-4">
                        <input 
                            className="w-full bg-black border border-gray-700 p-3 rounded text-white" 
                            placeholder="Track Title (Auto-filled)" 
                            value={newTrack.title || ''}
                            onChange={e => setNewTrack({...newTrack, title: e.target.value})}
                            disabled={isFetchingMetadata}
                        />
                        <input 
                            className="w-full bg-black border border-gray-700 p-3 rounded text-white" 
                            placeholder="Artist Name" 
                            value={newTrack.artist || ''}
                            onChange={e => setNewTrack({...newTrack, artist: e.target.value})}
                            disabled={isFetchingMetadata}
                        />
                    </div>

                     {/* Stats & Preview */}
                    <div className="md:col-span-3 flex gap-4">
                        <div className="flex-1">
                             <input 
                                className="w-full bg-black border border-gray-700 p-3 rounded text-white" 
                                type="number"
                                placeholder="Plays / Views" 
                                value={newTrack.plays || ''}
                                onChange={e => setNewTrack({...newTrack, plays: Number(e.target.value)})}
                                disabled={isFetchingMetadata}
                            />
                        </div>
                        <div className="w-[100px] h-[100px] bg-black border border-gray-700 rounded flex items-center justify-center overflow-hidden relative group shrink-0">
                            {newTrack.coverArt ? (
                                <img src={newTrack.coverArt} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="text-gray-700" />
                            )}
                            {isFetchingMetadata && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <Loader2 className="animate-spin text-white" size={24} />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <button 
                    onClick={handleAdd}
                    disabled={isFetchingMetadata}
                    className="w-full bg-chuma-orange py-3 rounded text-white font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus size={18} /> ADD TO LIBRARY
                </button>
            </div>

            {/* List */}
            <div className="space-y-2">
                {tracks.map(track => (
                    <div key={track.id} className="flex items-center justify-between bg-zinc-900/50 p-4 rounded border border-white/5 hover:border-white/20 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-black rounded overflow-hidden relative">
                                <img src={track.coverArt || "https://via.placeholder.com/150"} alt={track.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <img 
                                        src={track.type === 'spotify' ? "https://open.spotifycdn.com/cdn/images/favicon.0f31d2ea.ico" : "https://www.youtube.com/s/desktop/014dbbed/img/favicon.ico"} 
                                        className="w-4 h-4" 
                                        alt="icon"
                                    />
                                </div>
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{track.title}</h4>
                                <p className="text-xs text-gray-400">{track.artist} • {track.plays.toLocaleString()} {track.type === 'youtube' ? 'views' : 'plays'}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => refreshStats(track)} 
                                className="p-2 text-gray-400 hover:text-chuma-gold hover:bg-gray-800 rounded transition-colors"
                                title="Refresh Real-Time Stats"
                            >
                                <RefreshCw size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(track.id)} 
                                className="p-2 text-red-500 hover:bg-red-900/20 rounded transition-colors"
                                title="Delete Track"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
                {tracks.length === 0 && (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded">
                        No tracks found. Add one above.
                    </div>
                )}
            </div>
        </div>
    );
};

export default MusicManager;