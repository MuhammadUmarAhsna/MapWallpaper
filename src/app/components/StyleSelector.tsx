'use client';

import React from 'react';
import { useStore } from '@/store/useStore';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const styles = [
  {
    id: 'minimal',
    name: 'Minimal',
    url: 'https://tiles.openfreemap.org/styles/bright',
    preview: 'bg-slate-100',
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    url: 'https://tiles.openfreemap.org/styles/dark',
    preview: 'bg-slate-900',
  },
  {
    id: 'street',
    name: 'Street Detail',
    url: 'https://tiles.openfreemap.org/styles/bright', // OpenFreeMap bright is quite detailed
    preview: 'bg-blue-100',
  },
  {
    id: 'artistic',
    name: 'Monochrome',
    url: 'https://tiles.openfreemap.org/styles/bright', // We can apply filters in CSS for artistic
    preview: 'bg-zinc-200',
  },
];

const StyleSelector = () => {
  const { setStyleUrl, theme, setDesign } = useStore();

  const handleStyleChange = (style: typeof styles[0]) => {
    setStyleUrl(style.url);
    setDesign({ theme: style.id as 'minimal' | 'dark' | 'street' | 'artistic' });
  };

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Map Style</h3>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((style) => (
          <button
            key={style.id}
            onClick={() => handleStyleChange(style)}
            className={cn(
              "flex items-center gap-2 p-2 rounded-lg border text-sm transition-all",
              theme === style.id 
                ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
            )}
          >
            <div className={cn("w-4 h-4 rounded-full border border-slate-300", style.preview)} />
            <span className="truncate">{style.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleSelector;
