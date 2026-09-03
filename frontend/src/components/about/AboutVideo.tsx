import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface AboutVideoProps {
  className?: string;
}

export function AboutVideo({ className = '' }: AboutVideoProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { i18n } = useTranslation();
  
  const getVideoSource = (language: string, useFallback: boolean = false) => {
    if (useFallback) {
      return '/about_video.mp4';
    }
    
    switch (language) {
      case 'en':
        return '/hero_video_pl.mp4';
      case 'pl':
      default:
        return '/hero_video.mp4';
    }
  };

  const currentVideoSource = getVideoSource(i18n.language, fallbackUsed);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setIsLoaded(true);
      setIsTransitioning(false);
      video.play().catch(console.error);
    };

    const handleError = () => {
      // If we're not already using fallback and the Polish video failed, try fallback
      if (!fallbackUsed && i18n.language === 'pl') {
        console.warn('Polish about video failed to load, falling back to default video');
        setFallbackUsed(true);
        setIsTransitioning(true);
        return;
      }
      
      setHasError(true);
      setIsTransitioning(false);
      console.error('Failed to load about video:', currentVideoSource);
    };

    const handleLoadStart = () => {
      setIsLoaded(false);
      setHasError(false);
      setIsTransitioning(true);
    };

    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [currentVideoSource, fallbackUsed, i18n.language]);

  // Effect to handle language changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Reset fallback state when language changes
    setFallbackUsed(false);
    setHasError(false);
    
    // Set the new video source
    video.src = currentVideoSource;
    video.load(); // Reload the video with new source
  }, [currentVideoSource, i18n.language]);

  // Effect to handle fallback changes
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !fallbackUsed) return;

    video.src = currentVideoSource;
    video.load();
  }, [fallbackUsed, currentVideoSource]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {/* Enhanced fallback background with gradient animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-tr from-[#daa520]/20 via-transparent to-[#daa520]/10" />
      
      {/* Loading indicator with enhanced styling */}
      {isTransitioning && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-black/50 via-black/30 to-black/50 backdrop-blur-sm z-30">
          <div className="flex flex-col items-center gap-4 bg-white/10 backdrop-blur-xl rounded-3xl px-8 py-6 border border-white/20">
            <div className="relative">
              <div className="w-12 h-12 border-3 border-[#daa520]/30 border-t-[#daa520] rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-2 border-[#b8860b]/20 border-t-[#b8860b] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <div className="text-center">
              <p className="text-white font-semibold text-sm tracking-wide mb-1">Loading Video</p>
              <p className="text-white/70 text-xs">Switching language content...</p>
            </div>
          </div>
        </div>
      )}
      
      {!hasError && (
        <div className="relative w-full h-full">
          {/* Video overlay effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 to-black/10 z-10 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-tr from-[#daa520]/5 via-transparent to-[#daa520]/3 z-10 pointer-events-none"></div>
          
          <video
            ref={videoRef}
            className={`w-full h-full object-cover transition-all duration-1000 ease-out transform hover:scale-[1.02] filter brightness-110 contrast-110 saturate-110 ${
              isLoaded && !isTransitioning ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              objectFit: 'cover',
              width: '100%',
              height: '100%',
              display: 'block'
            }}
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
            src={currentVideoSource}
          >
            <source src={currentVideoSource} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      
      {/* Enhanced error fallback */}
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-800 flex items-center justify-center">
          <div className="text-center bg-black/20 backdrop-blur-xl rounded-3xl px-12 py-8 border border-white/10">
            <div className="relative mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#daa520]/30 to-[#b8860b]/30 rounded-full flex items-center justify-center mb-4 mx-auto border-2 border-[#daa520]/40">
                <span className="text-3xl">🎬</span>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500/80 rounded-full border-2 border-white"></div>
            </div>
            <p className="text-white font-semibold mb-2 tracking-wide">Video Unavailable</p>
            <p className="text-white/60 text-sm leading-relaxed">Content is temporarily unavailable.<br />Please check back later.</p>
          </div>
        </div>
      )}
    </div>
  );
}
