'use client';
import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, useSpring, motion, useTransform } from 'framer-motion';

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadedPercent, setLoadedPercent] = useState(0);

  const totalFrames = 240;

  // 1. Apple-Level Smooth Easing
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 50, damping: 20 });

  // Text Animations based on scroll progress
  const titleOpacity = useTransform(smoothProgress, [0, 0.15], [1, 0]);
  const titleY = useTransform(smoothProgress, [0, 0.15], [0, -50]);
  
  const skillOpacity = useTransform(smoothProgress, [0.3, 0.45, 0.6], [0, 1, 0]);
  const skillY = useTransform(smoothProgress, [0.3, 0.45], [50, 0]);

  // 2. The Smart Loader (Loads Frame 1 instantly, then the rest)
  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      
      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        const frameNumber = String(i).padStart(3, '0');
        img.src = `/mahima-portfolio/sequence/ezgif-frame-${frameNumber}.webp`;
        
        await new Promise((r) => (img.onload = r));
        loadedImages.push(img);
        
        // Update loading progress without blocking the UI
        setLoadedPercent(Math.round((i / totalFrames) * 100));

        // Draw the very first frame immediately so the screen isn't black
        if (i === 1 && canvasRef.current) {
          const ctx = canvasRef.current.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
          }
        }
      }
      setImages(loadedImages);
    };
    loadImages();
  }, []);

  // 3. Draw frames on scroll
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    if (!canvasRef.current || images.length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    const frameIndex = Math.min(Math.floor(latest * totalFrames), totalFrames - 1);
    const img = images[frameIndex];
    
    if (ctx && img) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  });

  return (
    <div ref={containerRef} className="relative h-[400vh] bg-[#050505]">
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center">
        
        {/* Loading Indicator (Disappears gently) */}
        {loadedPercent < 100 && (
          <div className="absolute top-10 z-50 flex flex-col items-center">
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300" 
                style={{ width: `${loadedPercent}%` }} 
              />
            </div>
            <span className="text-white/40 text-xs tracking-[0.2em] mt-2 uppercase">
              Initializing Core • {loadedPercent}%
            </span>
          </div>
        )}

        {/* The Canvas (Layer 0) */}
        <canvas 
          ref={canvasRef} 
          width={1920} 
          height={1080} 
          className="absolute inset-0 w-full h-full object-cover opacity-60 z-0" 
        />
        
        {/* Apple-Style Typography Overlays (Layer 10) */}
        <div className="relative z-10 w-full max-w-5xl px-6 pointer-events-none flex items-center justify-center h-full">
          
          {/* Hero Text */}
          <motion.div 
            style={{ opacity: titleOpacity, y: titleY }}
            className="absolute text-center"
          >
            <h1 className="text-5xl md:text-8xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40 pb-4">
              Mahima Naik.
            </h1>
            <p className="text-white/60 tracking-[0.3em] uppercase text-sm md:text-base font-light">
              AI & Data Security Analyst
            </p>
          </motion.div>

          {/* Scrolling Text 1 */}
          <motion.div 
            style={{ opacity: skillOpacity, y: skillY }}
            className="absolute text-center max-w-2xl"
          >
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
