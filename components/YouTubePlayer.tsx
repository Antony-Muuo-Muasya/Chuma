import React, { useEffect, useRef } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, title }) => {
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<any>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    const loadPlayer = () => {
      if (window.YT && window.YT.Player && playerRef.current) {
        // Destroy existing to prevent duplicates/leaks
        if (playerInstance.current) {
            // Check if destroy exists (it might not if initialization failed)
            if(typeof playerInstance.current.destroy === 'function') {
                playerInstance.current.destroy();
            }
        }

        playerInstance.current = new window.YT.Player(playerRef.current, {
          videoId: videoId,
          height: '100%',
          width: '100%',
          playerVars: {
            playsinline: 1,
            modestbranding: 1,
            rel: 0,
            origin: window.location.origin // Crucial for preventing Error 153 in some environments
          },
          events: {
            // 'onReady': (event: any) => event.target.playVideo(), // Auto-play optional
          }
        });
      }
    };

    if (!window.YT) {
      // Check if script tag already exists to avoid duplicates
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
          const tag = document.createElement('script');
          tag.src = "https://www.youtube.com/iframe_api";
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      }

      // Fallback polling because window.onYouTubeIframeAPIReady might have already fired or be overwritten
      interval = setInterval(() => {
          if (window.YT && window.YT.Player) {
              loadPlayer();
              clearInterval(interval);
          }
      }, 500);
      
    } else {
      loadPlayer();
    }

    return () => {
        if (interval) clearInterval(interval);
        if (playerInstance.current && typeof playerInstance.current.destroy === 'function') {
            playerInstance.current.destroy();
        }
    };
  }, [videoId]);

  return <div ref={playerRef} className="w-full h-full rounded-xl overflow-hidden" />;
};

export default YouTubePlayer;