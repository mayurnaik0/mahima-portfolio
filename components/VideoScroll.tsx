'use client';
import { useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, motion, useTransform } from 'framer-motion';

export default function VideoScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Scroll Tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Text Animations
  const titleOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 0.15], [0, -50]);
  const skillOpacity = useTransform(scrollYProgress, [0.3, 0.45, 0.6], [0, 1, 0]);
  const skillY = useTransform(scrollYProgress, [0.3, 0.45], [50, 0]);

  // Scrub the video timeline based on scroll
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (videoRef.current && videoRef.current.duration) {
      // Tie current video time to scroll percentage
      videoRef.current.currentTime = latest * videoRef.current.duration;
    }
  });

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-[#050505]">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Loading State */}
        {!isLoaded && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-white/40 uppercase tracking-widest text-sm animate-pulse">
            Loading Core...
          </div>
        )}

        {/* The Video Element */}
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover z-0 transition-opacity duration-1000 ${isLoaded ? 'opacity-60' : 'opacity-0'}`}
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setIsLoaded(true)}
        >
          {/* PLACE YOUR ORIGINAL MP4 HERE */}
          <source src="/mahima-portfolio/animation.mp4" type="video/mp4" />
        </video>

        {/* Text Overlays (z-10 ensures they stay on top of the video) */}
        <div className="relative z-10 w-full max-w-5xl px-6 pointer-events-none flex items-center justify-center h-full">
          
          <motion.div style={{ opacity: titleOpacity, y: titleY }} className="absolute text-center">
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 pb-4">
              Mahima Naik.
            </h1>
            <p className="text-white/60 tracking-[0.3em] uppercase text-sm md:text-base font-light">
              AI & Data Security Analyst
            </p>
          </motion.div>

          <motion.div style={{ opacity: skillOpacity, y: skillY }} className="absolute text-center max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-medium text-white mb-6 tracking-tight">
              Intelligence.<br/>Decoded.
            </h2>
            <p className="text-xl text-white/50 font-light leading-relaxed">
              Specializing in Machine Learning, Pattern Detection, and building systems that turn complex data into absolute clarity.
            </p>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
