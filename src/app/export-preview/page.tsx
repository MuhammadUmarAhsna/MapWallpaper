'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Playfair_Display } from 'next/font/google';
import MapComponent from '@/components/MapComponent';
import { useStore } from '@/store/useStore';
import { clsx } from 'clsx';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
});

function ExportPreviewContent() {
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
  const { setCenter, setZoom, setStyleUrl, setDesign, title, subtitle, locationLabel, fontFamily, theme, textPosition } = useStore();

  useEffect(() => {
    const stateStr = searchParams.get('state');
    if (stateStr) {
      try {
        const state = JSON.parse(stateStr);
        setCenter(state.center);
        setZoom(state.zoom);
        setStyleUrl(state.styleUrl);
        setDesign(state);
        setIsReady(true);
      } catch (e) {
        console.error('Failed to parse state', e);
      }
    }
  }, [searchParams, setCenter, setZoom, setStyleUrl, setDesign]);

  if (!isReady) return null;

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
    <div 
      id="map-poster-container"
      className={clsx(
        "relative w-[2480px] h-[3508px] shadow-2xl overflow-hidden flex flex-col p-24 transition-all duration-500",
        theme === 'dark' ? "bg-slate-950 text-white" : "bg-white text-slate-900",
        theme === 'artistic' && "grayscale contrast-125 brightness-110"
      )}
    >
      <div className={clsx(
        "flex-1 relative border-[24px] shadow-[inset_0_0_80px_rgba(0,0,0,0.1)] overflow-hidden",
        theme === 'dark' ? "border-slate-900" : "border-white"
      )}>
        <MapComponent />
      </div>

      <div className={clsx(
        "mt-20 flex flex-col items-center text-center space-y-4",
        getFontClass()
      )}
      style={{ transform: `translate(${textPosition.x * 3}px, ${textPosition.y * 3}px)` }} // Scale position for high res
      >
        <div className={clsx(
          "w-32 h-1 mb-8 opacity-20",
          theme === 'dark' ? "bg-white" : "bg-slate-900"
        )} />
        <h2 className="text-[120px] font-black tracking-[0.2em]">
          {title}
        </h2>
        <p className="text-[40px] font-medium tracking-[0.3em] opacity-70 uppercase">
          {subtitle}
        </p>
        <p className="mt-12 text-[30px] font-mono tracking-widest opacity-50">
          {locationLabel}
        </p>
      </div>

      {theme === 'artistic' && (
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/p6.png')]" />
      )}
    </div>
  );
}

export default function ExportPreview() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExportPreviewContent />
    </Suspense>
  );
}
