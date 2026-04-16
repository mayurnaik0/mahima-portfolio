'use client';
import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, motion } from 'framer-motion';

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  // Set this to the total number of frames you have (e.g., 240)
  const totalFrames = 240; 

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      
      // We start at 1 because your files start at 001
      for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        
        // This line adds the extra zeros (e.g., turns 1 into 001, 10 into 010)
        const frameNumber = String(i).padStart(3, '0');
        
        // Match your folder name on GitHub (mahima-portfolio)
        img.src = `/mahima-portfolio/sequence/ezgif-frame-${frameNumber}.webp`;
        
        await new Promise((r) => (img.onload = r));
        loadedImages.push(img);
      }
      setImages(loadedImages);
      setIsLoaded(true);
    };
    loadImages();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setProgress(latest);
    if (!isLoaded || !canvasRef.current || images.length === 0) return;
    
    const ctx = canvasRef.current.getContext('2d');
    // Map scroll 0-1 to frame index 0-239
    const frameIndex = Math.min(Math.floor(latest * totalFrames), totalFrames - 1);
    const img = images[frameIndex];
    
    if (ctx && img) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  });

  return (
    <div ref={containerRef} className="h-[400vh] bg-[#050505]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        {!isLoaded && (
          <div className="absolute text-white/40 uppercase tracking-widest text-sm animate-pulse">
            Loading Experience...
          </div>
        )}
        <canvas 
          ref={canvasRef} 
          width={1920} 
          height={1080} 
          className="w-full h-full object-cover opacity-60" 
        />
        
        {/* Her name fades out as you scroll down */}
        <div className="absolute text-center z-10 px-6">
          <motion.h1 
            style={{ opacity: 1 - progress * 5 }}
            className="text-5xl md:text-7xl font-bold tracking-tighter text-white">
            Mahima Krishnanand Naik
          </motion.h1>
          <motion.p 
            style={{ opacity: 1 - progress * 6 }}
            className="text-white/50 mt-4 tracking-[0.2em] uppercase text-xs md:text-sm">
            AI & Data Science Enthusiast
          </motion.p>
        </div>
      </div>
    </div>
  );
}
