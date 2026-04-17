'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { searchLocation, GeocodingResult } from '@/lib/geocoding';
import { useStore } from '@/store/useStore';

const SearchBox = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodingResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { setCenter, setDesign } = useStore();

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 2) {
        setIsLoading(true);
        try {
          const res = await searchLocation(query);
          setResults(res);
          setShowResults(true);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (result: GeocodingResult) => {
    const lng = parseFloat(result.lon);
    const lat = parseFloat(result.lat);
    setCenter([lng, lat]);
    
    // Update poster text based on location
    const cityName = result.address?.city || result.address?.town || result.address?.village || result.display_name.split(',')[0];
    const countryName = result.address?.country || '';
    
    setDesign({
      title: cityName.toUpperCase(),
      subtitle: countryName.toUpperCase(),
      locationLabel: `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? 'N' : 'S'} / ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? 'E' : 'W'}`,
    });
    
    setQuery(result.display_name);
    setShowResults(false);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 text-sm transition-all"
          onFocus={() => query.length > 2 && setShowResults(true)}
        />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
        </div>
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 overflow-y-auto">
          {results.map((result) => (
            <button
              key={result.place_id}
              onClick={() => handleSelect(result)}
              className="w-full px-4 py-2 text-left hover:bg-slate-50 border-b border-slate-100 last:border-0 text-sm transition-colors"
            >
              <p className="font-medium text-slate-900 truncate">{result.display_name}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
