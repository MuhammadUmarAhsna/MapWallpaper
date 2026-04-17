'use client';

import { Playfair_Display } from 'next/font/google';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

import Sidebar from '@/components/Sidebar';
import MapComponent from '@/components/MapComponent';
import { useStore } from '@/store/useStore';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export default function Home() {
  const { title, subtitle, locationLabel, fontFamily, theme, textPosition, setDesign } = useStore();

  const getFontClass = () => {
    switch (fontFamily) {
      case 'Playfair Display':
        return playfair.className;
      case 'Mono':
        return 'font-mono';
      default:
        return 'font-sans';
    }
  };

  return (
    <main className="flex h-screen w-screen bg-slate-100 overflow-hidden">
      <Sidebar />
      
      <div className="flex-1 flex items-center justify-center p-8 bg-slate-200 overflow-hidden">
        {/* The Poster Container - this is what gets exported */}
        <div 
          id="map-poster-container"
          className={clsx(
            "relative aspect-[1/1.4] h-full max-h-full shadow-2xl overflow-hidden flex flex-col p-12 transition-all duration-500",
            theme === 'dark' ? "bg-slate-950 text-white" : "bg-white text-slate-900",
            theme === 'artistic' && "grayscale contrast-125 brightness-110"
          )}
        >
          {/* Map Area */}
          <div className={clsx(
            "flex-1 relative border-[12px] shadow-[inset_0_0_40px_rgba(0,0,0,0.1)] overflow-hidden",
            theme === 'dark' ? "border-slate-900" : "border-white"
          )}>
            <MapComponent />
          </div>

          {/* Design Overlay Text */}
          <motion.div 
            drag
            dragMomentum={false}
            onDragEnd={(_, info) => {
              setDesign({ 
                textPosition: { 
                  x: textPosition.x + info.offset.x, 
                  y: textPosition.y + info.offset.y 
                } 
              });
            }}
            className={clsx(
              "mt-10 flex flex-col items-center text-center space-y-2 cursor-move select-none active:cursor-grabbing",
              getFontClass()
            )}
            style={{ x: textPosition.x, y: textPosition.y }}
          >
            <div className={clsx(
              "w-16 h-0.5 mb-4 opacity-20",
              theme === 'dark' ? "bg-white" : "bg-slate-900"
            )} />
            <h2 className="text-4xl font-black tracking-[0.2em]">
              {title}
            </h2>
            <p className="text-sm font-medium tracking-[0.3em] opacity-70 uppercase">
              {subtitle}
            </p>
            <p className="mt-4 text-[10px] font-mono tracking-widest opacity-50">
              {locationLabel}
            </p>
          </motion.div>

          {/* Artistic Frame/Grain Overlay (Optional) */}
          {theme === 'artistic' && (
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
          )}
        </div>
      </div>
    </main>
  );
}
