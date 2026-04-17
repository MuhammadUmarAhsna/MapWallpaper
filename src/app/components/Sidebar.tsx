'use client';

import React, { useState } from 'react';
import SearchBox from './SearchBox';
import StyleSelector from './StyleSelector';
import TextEditor from './TextEditor';
import { Download, Share2, Map as MapIcon, Type, Layers, Loader2, FileText } from 'lucide-react';
import { exportToPng } from '@/lib/exportClient';
import { useStore } from '@/store/useStore';

const Sidebar = () => {
  const [isExporting, setIsExporting] = useState<false | 'png' | 'pdf' | 'pro'>(false);
  const store = useStore();

  const handleExport = async () => {
    setIsExporting('png');
    try {
      await exportToPng('map-poster-container');
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleProExport = async (type: 'png' | 'pdf') => {
    setIsExporting(type === 'png' ? 'pro' : 'pdf');
    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ state: store, type }),
      });
      if (!response.ok) throw new Error('Export failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `iqdar-poster.${type}`;
      a.click();
    } catch (error) {
      console.error('Pro export failed:', error);
      alert('High-quality export failed. Please try simple export.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="w-80 h-full bg-slate-50 border-r border-slate-200 flex flex-col shadow-inner">
      <div className="p-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <MapIcon className="w-6 h-6" />
          IQDAR Maps
        </h1>
        <p className="text-xs text-slate-500 mt-1">Premium Poster Generator</p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900">
            <Layers className="w-4 h-4" />
            <span className="text-sm font-semibold">Location</span>
          </div>
          <SearchBox />
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900">
            <Layers className="w-4 h-4" />
            <span className="text-sm font-semibold">Appearance</span>
          </div>
          <StyleSelector />
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-2 text-slate-900">
            <Type className="w-4 h-4" />
            <span className="text-sm font-semibold">Customization</span>
          </div>
          <TextEditor />
        </section>
      </div>

      <div className="p-6 border-t border-slate-200 bg-white space-y-2">
        <button 
          onClick={handleExport}
          disabled={!!isExporting}
          className="w-full bg-white text-slate-900 border border-slate-200 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          {isExporting === 'png' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
          Quick Export (PNG)
        </button>
        
        <div className="grid grid-cols-2 gap-2">
          <button 
            onClick={() => handleProExport('png')}
            disabled={!!isExporting}
            className="bg-slate-900 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isExporting === 'pro' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            4K PNG
          </button>
          <button 
            onClick={() => handleProExport('pdf')}
            disabled={!!isExporting}
            className="bg-slate-900 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isExporting === 'pdf' ? <Loader2 className="w-3 h-3 animate-spin" /> : <FileText className="w-3 h-3" />}
            HQ PDF
          </button>
        </div>

        <button className="w-full py-2 text-slate-500 text-sm font-medium flex items-center justify-center gap-2 hover:text-slate-700 transition-colors">
          <Share2 className="w-4 h-4" />
          Save to Collection
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
