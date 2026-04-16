'use client';
import { useEffect, useRef, useState } from 'react';
import { useScroll, useMotionValueEvent, motion } from 'framer-motion';

export default function SequenceScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const frameCount = 240; 

  useEffect(() => {
    const loadImages = async () => {
      const loadedImages: HTMLImageElement[] = [];
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        // This path must match your public/sequence/ folder
        img.src = `/mahima-portfolio/sequence/frame_${i}.webp`;
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
    if (!isLoaded || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const frameIndex = Math.min(Math.floor(latest * frameCount), frameCount - 1);
    const img = images[frameIndex];
    if (ctx && img) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  });

  return (
    <div ref={containerRef} className="h-[400vh] bg-[#050505]">
      <div className="sticky top-0 h-screen w-full flex items-center justify-center">
        <canvas ref={canvasRef} width={1920} height={1080} className="w-full h-full object-cover opacity-50" />
        <div className="absolute text-center">
          <motion.h1 
            style={{ opacity: 1 - progress * 4 }}
            className="text-6xl font-bold">Mahima Krishnanand Naik</motion.h1>
        </div>
      </div>
    </div>
  );
}
