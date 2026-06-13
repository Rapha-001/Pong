import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2, Play } from 'lucide-react';

interface PostMediaGalleryProps {
  images: string[];
  onShowToast?: (msg: string, type?: 'success' | 'warn') => void;
}

// Helper to identify if a media source is a video file or payload
const isVideoSource = (src: string) => {
  if (!src) return false;
  return src.startsWith('data:video/') || 
         src.endsWith('.mp4') || 
         src.endsWith('.webm') || 
         src.endsWith('.ogg') || 
         src.endsWith('.mov') ||
         src.includes('video/mp4') ||
         src.toLowerCase().includes('video');
};

const InlineVideoPlayer = ({ src, className, onOpenFullscreen }: { src: string; className: string; onOpenFullscreen: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Read video autoplay setting dynamically from local storage
  // Defaults to false (preventing unsolicited sound or load)
  const isAutoplayEnabled = () => {
    try {
      const saved = localStorage.getItem('uniuyo_settings_autoplay');
      return saved === 'true'; // Defaults to false
    } catch {
      return false;
    }
  };

  const autoplay = isAutoplayEnabled();

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-full bg-zinc-950 flex items-center justify-center group/video">
      <video
        ref={videoRef}
        src={src}
        autoPlay={autoplay}
        muted
        loop
        playsInline
        controls={!autoplay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className={`w-full h-full object-cover select-none ${className}`}
        onClick={(e) => {
          if (!autoplay) {
            e.stopPropagation();
          }
        }}
      />
      
      {/* Beautiful central Play button overlay when paused in manual mode */}
      {!autoplay && !isPlaying && (
        <div 
          onClick={handleTogglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/35 transition-all duration-200 cursor-pointer z-10"
        >
          <div className="w-12 h-12 rounded-full bg-indigo-600/90 group-hover/video:bg-indigo-650 group-hover/video:scale-110 text-white flex items-center justify-center shadow-lg transition duration-200">
            <Play className="w-5 h-5 fill-white text-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Autoplay HUD Indicator Badge */}
      {autoplay && (
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] text-zinc-300 font-mono font-bold flex items-center gap-1 z-1 pointer-events-none">
          <Play className="w-2 h-2 fill-white text-white animate-pulse" />
          <span>AUTOPLAY</span>
        </div>
      )}

      {/* Maximize to fullscreen button Overlay */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onOpenFullscreen();
        }}
        className="absolute top-2 right-2 p-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 text-white opacity-0 group-hover/video:opacity-100 transition shadow-sm z-10 cursor-pointer"
        title="Full Screen Overlay Option"
      >
        <Maximize2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default function PostMediaGallery({ images, onShowToast }: PostMediaGalleryProps) {
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  
  // Touch coordinates for swipe gestures
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Normalize image/video sources (remove potential duplicates or empty states)
  const mediaList = (images || []).filter(src => !!src.trim());

  if (mediaList.length === 0) return null;

  // Track image load
  const handleImageLoad = (idx: number) => {
    setLoadedImages(prev => ({ ...prev, [idx]: true }));
  };

  // Gallery Navigation Functions
  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (viewerIndex === null) return;
    setViewerIndex((viewerIndex + 1) % mediaList.length);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (viewerIndex === null) return;
    setViewerIndex((viewerIndex - 1 + mediaList.length) % mediaList.length);
  };

  const handleClose = () => {
    setViewerIndex(null);
  };

  // Swipe navigation logic
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diffX = touchStartX.current - touchEndX.current;
    const threshold = 50; // minimum distance to register a swipe

    if (diffX > threshold) {
      // Swipe Left -> Next Image
      handleNext();
    } else if (diffX < -threshold) {
      // Swipe Right -> Prev Image
      handlePrev();
    }

    // Reset coordinates
    touchStartX.current = null;
    touchEndX.current = null;
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (viewerIndex === null) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewerIndex]);

  // Unified Media item rendering engine (Images with Skeletons or AutoPlay Inline Videos)
  const renderMediaItem = (src: string, idx: number, additionalClasses = '') => {
    const isVideo = isVideoSource(src);
    
    if (isVideo) {
      return (
        <InlineVideoPlayer
          src={src}
          className={additionalClasses}
          onOpenFullscreen={() => setViewerIndex(idx)}
        />
      );
    }

    return (
      <div className="relative w-full h-full">
        {!loadedImages[idx] && (
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 animate-pulse w-full h-full" />
        )}
        <img
          src={src}
          alt={`Attached media file ${idx + 1}`}
          loading="lazy"
          onLoad={() => handleImageLoad(idx)}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.015] ${additionalClasses} ${
            loadedImages[idx] ? 'opacity-100' : 'opacity-0'
          }`}
          referrerPolicy="no-referrer"
        />
      </div>
    );
  };

  const count = mediaList.length;

  const renderGrid = () => {
    // Single image/video layout
    if (count === 1) {
      return (
        <div 
          onClick={() => setViewerIndex(0)}
          className="relative max-h-[360px] md:max-h-[400px] w-full overflow-hidden rounded-xl border border-zinc-200/65 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-950 cursor-pointer group"
          id="media-layout-single-image"
        >
          {renderMediaItem(mediaList[0], 0, 'max-h-[360px] md:max-h-[400px]')}
          <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md hover:bg-black/60 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition duration-150">
            <Maximize2 className="w-3.5 h-3.5" />
          </div>
        </div>
      );
    }

    // Two media items layout
    if (count === 2) {
      return (
        <div className="grid grid-cols-2 gap-1.5 w-full h-[240px] sm:h-[280px] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-950" id="media-layout-two-images">
          {mediaList.slice(0, 2).map((src, idx) => (
            <div 
              key={idx} 
              onClick={() => setViewerIndex(idx)}
              className="relative w-full h-full overflow-hidden cursor-pointer group border-r last:border-0 border-zinc-200/20"
            >
              {renderMediaItem(src, idx)}
            </div>
          ))}
        </div>
      );
    }

    // Three media items layout
    if (count === 3) {
      return (
        <div className="flex flex-col gap-1.5 w-full h-[320px] sm:h-[360px] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-950" id="media-layout-three-images">
          {/* Top Featured Item */}
          <div 
            onClick={() => setViewerIndex(0)}
            className="relative w-full h-[58%] overflow-hidden cursor-pointer group"
          >
            {renderMediaItem(mediaList[0], 0)}
          </div>
          {/* Bottom Row containing 2 equal widths */}
          <div className="grid grid-cols-2 gap-1.5 h-[42%] w-full">
            {[1, 2].map((idx) => (
              <div 
                key={idx} 
                onClick={() => setViewerIndex(idx)}
                className="relative w-full h-full overflow-hidden cursor-pointer group"
              >
                {renderMediaItem(mediaList[idx], idx)}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Four media items layout
    if (count === 4) {
      return (
        <div className="grid grid-cols-2 grid-rows-2 gap-1.5 w-full h-[280px] sm:h-[340px] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-950" id="media-layout-four-images">
          {mediaList.slice(0, 4).map((src, idx) => (
            <div 
              key={idx} 
              onClick={() => setViewerIndex(idx)}
              className="relative w-full h-full overflow-hidden cursor-pointer group"
            >
              {renderMediaItem(src, idx)}
            </div>
          ))}
        </div>
      );
    }

    // Five or more media elements
    return (
      <div className="grid grid-cols-2 grid-rows-2 gap-1.5 w-full h-[280px] sm:h-[340px] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-950" id="media-layout-many-images">
        {mediaList.slice(0, 3).map((src, idx) => (
          <div 
            key={idx} 
            onClick={() => setViewerIndex(idx)}
            className="relative w-full h-full overflow-hidden cursor-pointer group"
          >
            {renderMediaItem(src, idx)}
          </div>
        ))}
        {/* Fourth slot with "+N" Overlay */}
        <div 
          onClick={() => setViewerIndex(3)}
          className="relative w-full h-full overflow-hidden cursor-pointer group"
        >
          {renderMediaItem(mediaList[3], 3)}
          {/* Backdrop +N HUD Overlay */}
          <div className="absolute inset-0 bg-black/60 dark:bg-black/70 flex flex-col justify-center items-center text-white text-center font-black select-none group-hover:bg-black/50 transition-colors duration-200">
            <span className="text-2xl sm:text-3xl tracking-tight">+{count - 3}</span>
            <span className="text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-zinc-350 mt-0.5">more files</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full my-2 relative" id="post-media-gallery-container-root">
      {renderGrid()}

      {/* FULL SCREEN GALLERY PORTAL LIGHTBOX VIEWER */}
      <AnimatePresence>
        {viewerIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between items-center select-none"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            id="fullscreen-lightbox-viewer"
          >
            {/* Top Toolbar Navigation Header */}
            <div className="w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent text-white z-10 shrink-0">
              <div className="flex flex-col text-left">
                <span className="text-sm font-black tracking-tight">Media Hub Archive</span>
                <span className="text-xs text-zinc-400 font-mono">
                  {viewerIndex + 1} of {mediaList.length} files
                </span>
              </div>
              <button 
                onClick={handleClose}
                className="p-2 rounded-full bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 transition-transform active:scale-90 cursor-pointer"
                title="Close Screen"
                aria-label="Close photo gallery"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Stage viewport */}
            <div className="w-full flex-1 flex justify-between items-center relative px-2 md:px-12 max-h-[80vh]">
              {/* Previous Button Left */}
              <button
                onClick={handlePrev}
                className="hidden sm:flex p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 hover:text-white transition text-zinc-400 absolute left-4 z-10 cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Photo/Video viewport container */}
              <div className="w-full h-full flex justify-center items-center p-2 relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={viewerIndex}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="max-w-full max-h-full flex items-center justify-center p-2"
                  >
                    {isVideoSource(mediaList[viewerIndex]) ? (
                      <video
                        src={mediaList[viewerIndex]}
                        controls
                        autoPlay
                        className="max-w-full max-h-[75vh] object-contain rounded-sm select-text shadow-2xl"
                      />
                    ) : (
                      <img
                        src={mediaList[viewerIndex]}
                        alt={`Fullscreen zoom media file ${viewerIndex + 1}`}
                        className="max-w-full max-h-[75vh] object-contain pointer-events-none rounded-sm select-none shadow-2xl"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Next Button Right */}
              <button
                onClick={handleNext}
                className="hidden sm:flex p-3 rounded-full bg-zinc-900/80 hover:bg-zinc-800 hover:text-white transition text-zinc-400 absolute right-4 z-10 cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Swiper Helper Nav HUD */}
            <div className="w-full p-6 text-center text-zinc-500 text-xs flex flex-col items-center gap-2 bg-gradient-to-t from-black/60 to-transparent z-10 shrink-0">
              <div className="flex gap-1.5">
                {mediaList.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setViewerIndex(dotIdx)}
                    className={`w-2.5 h-2.5 rounded-full transition-transform cursor-pointer ${
                      dotIdx === viewerIndex ? 'bg-indigo-500 scale-125' : 'bg-zinc-700 hover:bg-zinc-500'
                    }`}
                    aria-label={`Go to photo ${dotIdx + 1}`}
                  />
                ))}
              </div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 sm:hidden">
                Swipe left/right or tap dots to browse
              </span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400 hidden sm:inline">
                Use Left/Right keys or tap dots to browse
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
