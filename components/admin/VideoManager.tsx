import React, { useEffect, useState } from 'react';
import { dbService } from '../../services/firebaseSim';
import { VideoItem } from '../../types';
import { Trash2, Plus, Link as LinkIcon, Loader2, AlertCircle, Play } from 'lucide-react';

const VideoManager: React.FC = () => {
    const [videos, setVideos] = useState<VideoItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [newVideo, setNewVideo] = useState<Partial<VideoItem>>({ views: 0, thumbnail: '' });
    const [apiKey, setApiKey] = useState('');
    const [isFetchingMetadata, setIsFetchingMetadata] = useState(false);
    const [fetchError, setFetchError] = useState('');

    useEffect(() => {
        loadVideos();
        const storedKey = localStorage.getItem('chuma_yt_api_key');
        if (storedKey) setApiKey(storedKey);
    }, []);

    const loadVideos = async () => {
        const data = await dbService.getVideos();
        setVideos(data);
        setLoading(false);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this video?")) {
            await dbService.deleteVideo(id);
            loadVideos();
        }
    };

    const handleApiKeyChange = (val: string) => {
        setApiKey(val);
        localStorage.setItem('chuma_yt_api_key', val);
    };

    const extractYouTubeID = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const fetchMetadata = async (url: string) => {
        if (!url) return;
        setIsFetchingMetadata(true);
        setFetchError('');

        let updatedVideo = { ...newVideo, url };

        try {
            const videoId = extractYouTubeID(url);
            if (videoId) {
                // Normalize URL
                updatedVideo.url = `https://www.youtube.com/watch?v=${videoId}`;
                updatedVideo.thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

                if (apiKey) {
                    const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${apiKey}`);
                    if (!response.ok) {
                        const err = await response.json();
                        throw new Error(err.error?.message || 'YouTube API Error');
                    }
                    
                    const data = await response.json();
                    if (data.items && data.items.length > 0) {
                        const item = data.items[0];
                        updatedVideo.title = item.snippet.title;
                        updatedVideo.views = parseInt(item.statistics.viewCount, 10);
                    } else {
                        setFetchError('Video not found on YouTube.');
                    }
                } else {
                     // Fallback: Use oEmbed for basic title if no API key
                     try {
                        const response = await fetch(`https://noembed.com/embed?url=${url}`);
                        const data = await response.json();
                        if (data.title) updatedVideo.title = data.title;
                    } catch (e) { 
                        console.warn("NoEmbed failed", e);
                    }
                    setFetchError('Enter API Key above for accurate view counts.');
                }
            } else {
                setFetchError('Invalid YouTube URL.');
            }
        } catch (error: any) {
            setFetchError(error.message);
        }

        setNewVideo(updatedVideo);
        setIsFetchingMetadata(false);
    };

    const handleAdd = async () => {
        if (!newVideo.title || !newVideo.url) return alert("Title and URL required");
        await dbService.addVideo({
            title: newVideo.title,
            url: newVideo.url,
            thumbnail: newVideo.thumbnail || '',
            views: newVideo.views || 0
        } as VideoItem);
        setNewVideo({ views: 0, title: '', url: '', thumbnail: '' });
        setFetchError('');
        loadVideos();
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <h2 className="text-3xl font-bold text-white">Video Manager</h2>
                <div className="flex flex-col items-end w-full md:w-auto">
                    <label className="text-[10px] text-gray-500 uppercase font-bold mb-1">YouTube Data API Key</label>
                    <input 
                        type="password" 
                        value={apiKey}
                        onChange={(e) => handleApiKeyChange(e.target.value)}
                        placeholder="Paste Google API Key here..."
                        className="bg-black border border-gray-800 text-white text-xs p-2 rounded w-full md:w-64 focus:border-chuma-gold"
                    />
                </div>
            </div>

            {/* Add New Video Form */}
            <div className="bg-zinc-900 p-6 rounded-lg border border-white/10 space-y-4">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <h3 className="font-bold text-chuma-gold">ADD NEW VIDEO</h3>
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
                    {/* URL Input */}
                    <div className="md:col-span-5">
                        <div className="relative">
                            <LinkIcon size={16} className="absolute top-3.5 left-3 text-gray-500" />
                            <input 
                                className={`w-full bg-black border p-3 pl-10 rounded text-white focus:border-chuma-orange transition-colors ${fetchError ? 'border-red-900' : 'border-gray-700'}`} 
                                placeholder="Paste YouTube URL here..."
                                value={newVideo.url || ''}
                                onChange={e => setNewVideo({...newVideo, url: e.target.value})}
                                onBlur={(e) => fetchMetadata(e.target.value)}
                            />
                        </div>
                        {fetchError && (
                            <p className="text-[10px] text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle size={10} /> {fetchError}
                            </p>
                        )}
                    </div>

                    {/* Title Input */}
                    <div className="md:col-span-4">
                        <input 
                            className="w-full bg-black border border-gray-700 p-3 rounded text-white" 
                            placeholder="Video Title (Auto-filled)" 
                            value={newVideo.title || ''}
                            onChange={e => setNewVideo({...newVideo, title: e.target.value})}
                            disabled={isFetchingMetadata}
                        />
                    </div>

                    {/* Stats & Thumbnail */}
                    <div className="md:col-span-3 flex gap-4">
                        <div className="flex-1">
                             <input 
                                className="w-full bg-black border border-gray-700 p-3 rounded text-white" 
                                type="number"
                                placeholder="Views" 
                                value={newVideo.views || ''}
                                onChange={e => setNewVideo({...newVideo, views: Number(e.target.value)})}
                                disabled={isFetchingMetadata}
                            />
                        </div>
                        <div className="w-[100px] h-[100px] bg-black border border-gray-700 rounded flex items-center justify-center overflow-hidden relative group shrink-0">
                            {newVideo.thumbnail ? (
                                <img src={newVideo.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <Play className="text-gray-700" />
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
                    className="w-full bg-chuma-orange py-3 rounded text-white font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                    <Plus size={18} /> ADD TO VIDEOS
                </button>
            </div>

            {/* Video List */}
            <div className="space-y-2">
                {videos.map(video => (
                    <div key={video.id} className="flex items-center justify-between bg-zinc-900/50 p-4 rounded border border-white/5 hover:border-white/20 transition-colors group">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-10 bg-black rounded overflow-hidden relative">
                                <img src={video.thumbnail || "https://via.placeholder.com/150"} alt={video.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{video.title}</h4>
                                {video.views !== undefined && (
                                    <p className="text-xs text-gray-400">{video.views.toLocaleString()} views</p>
                                )}
                            </div>
                        </div>
                        <button 
                            onClick={() => handleDelete(video.id)} 
                            className="p-2 text-red-500 hover:bg-red-900/20 rounded transition-colors"
                            title="Delete Video"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
                {videos.length === 0 && (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-gray-800 rounded">
                        No videos found. Add one above.
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoManager;