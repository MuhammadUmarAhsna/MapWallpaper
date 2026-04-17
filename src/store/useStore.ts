import { create } from 'zustand';

export interface MapPosterState {
  // Map State
  center: [number, number]; // [lng, lat]
  zoom: number;
  styleUrl: string;
  
  // Design State
  title: string;
  subtitle: string;
  locationLabel: string;
  fontFamily: string;
  theme: 'minimal' | 'dark' | 'street' | 'artistic';
  textPosition: { x: number; y: number };
  
  // Actions
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setStyleUrl: (url: string) => void;
  setDesign: (design: Partial<Pick<MapPosterState, 'title' | 'subtitle' | 'locationLabel' | 'fontFamily' | 'theme' | 'textPosition'>>) => void;
}

export const useStore = create<MapPosterState>((set) => ({
  center: [2.3522, 48.8566], // Paris
  zoom: 12,
  styleUrl: 'https://tiles.openfreemap.org/styles/bright',
  
  title: 'PARIS',
  subtitle: 'FRANCE',
  locationLabel: '48.8566° N / 2.3522° E',
  fontFamily: 'Inter',
  theme: 'minimal',
  textPosition: { x: 0, y: 0 },
  
  setCenter: (center) => set({ center }),
  setZoom: (zoom) => set({ zoom }),
  setStyleUrl: (styleUrl) => set({ styleUrl }),
  setDesign: (design) => set((state) => ({ ...state, ...design })),
}));
