import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

interface VideoBackgroundProps {
  className?: string;
}

export function VideoBackground({ className = '' }: VideoBackgroundProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { i18n } = useTranslation();
  
  const getVideoSource = (language: string, useFallback: boolean = false) => {
    if (useFallback) {
      return '/hero_video.mp4';
    }
    
    switch (language) {
      case 'pl':
        return '/hero_video_pl.mp4';
      case 'en':
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
        console.warn('Polish video failed to load, falling back to default video');
        setFallbackUsed(true);
        setIsTransitioning(true);
        return;
      }
      
      setHasError(true);
      setIsTransitioning(false);
      console.error('Failed to load hero video:', currentVideoSource);
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
    <div className={`absolute inset-0 h-full w-full bg-[#11100d] ${className}`}>
      <div className="absolute inset-0 bg-[linear-gradient(135deg,#11100d,#29231d_42%,#090908)]" />
      
      {!hasError && (
        <video
          ref={videoRef}
          className={`h-full w-full object-cover transition duration-[1800ms] ease-out ${
            isLoaded && !isTransitioning ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            objectFit: 'cover',
            width: '100%',
            height: '100%',
            display: 'block',
            transform: 'translateZ(0) scale(1.035)',
            backfaceVisibility: 'hidden'
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
      )}

      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(10,10,9,.64),rgba(10,10,9,.12)_48%,rgba(10,10,9,.42))]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,10,9,.46)_0%,rgba(10,10,9,.04)_42%,rgba(10,10,9,.74)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_34%,rgba(255,255,255,.16),transparent_31%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.11] mix-blend-overlay [background-image:linear-gradient(0deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:100%_4px]" />

      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#11100d]">
          <div className="h-px w-24 origin-left animate-pulse bg-white/40" aria-hidden="true" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 z-10 bg-[linear-gradient(135deg,#11100d,#29231d_42%,#090908)]" />
      )}
    </div>
  );
}
