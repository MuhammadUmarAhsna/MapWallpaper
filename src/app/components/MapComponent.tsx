'use client';

import React, { useEffect, useRef } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useStore } from '@/store/useStore';

const MapComponent = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const { center, zoom, styleUrl, setCenter, setZoom } = useStore();

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    if (mapContainer.current) {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: styleUrl,
        center: center,
        zoom: zoom,
        attributionControl: false,
      });

      map.current.on('moveend', () => {
        if (map.current) {
          const newCenter = map.current.getCenter();
          const newZoom = map.current.getZoom();
          setCenter([newCenter.lng, newCenter.lat]);
          setZoom(newZoom);
        }
      });
      
      // Add navigation control (optional for poster style but good for UX)
      // map.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update map when store state changes externally (e.g., from search)
  useEffect(() => {
    if (map.current) {
      const currentCenter = map.current.getCenter();
      if (currentCenter.lng !== center[0] || currentCenter.lat !== center[1]) {
        map.current.flyTo({ center, zoom });
      }
    }
  }, [center, zoom]);

  // Update style when changed in store
  useEffect(() => {
    if (map.current) {
      map.current.setStyle(styleUrl);
    }
  }, [styleUrl]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default MapComponent;
