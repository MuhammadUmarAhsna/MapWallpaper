'use client';

import React from 'react';
import { useStore } from '@/store/useStore';

const fonts = [
  { name: 'Inter', class: 'font-sans' },
  { name: 'Playfair Display', class: 'font-serif' },
  { name: 'Mono', class: 'font-mono' },
];

const TextEditor = () => {
  const { title, subtitle, locationLabel, setDesign } = useStore();

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Typography</h3>
      
      <div className="space-y-2">
        <label className="text-xs text-slate-400">Main Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setDesign({ title: e.target.value })}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-slate-400">Subtitle</label>
        <input
          type="text"
          value={subtitle}
          onChange={(e) => setDesign({ subtitle: e.target.value })}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-slate-400">Location Label</label>
        <input
          type="text"
          value={locationLabel}
          onChange={(e) => setDesign({ locationLabel: e.target.value })}
          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-slate-400">Font Style</label>
        <div className="flex gap-2">
          {fonts.map((f) => (
            <button
              key={f.name}
              onClick={() => setDesign({ fontFamily: f.name })}
              className="px-3 py-1 text-xs border border-slate-200 rounded hover:bg-slate-50 transition-colors"
            >
              {f.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
