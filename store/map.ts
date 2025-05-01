import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface MapState {
  isMapMaximized: boolean;
  toggleMapMaximized: () => void;
  setMapMaximized: (value: boolean) => void;
}

export const useMapStore = create<MapState>()(
  devtools(
    persist(
      (set) => ({
        isMapMaximized: false,
        toggleMapMaximized: () => set((state) => ({ isMapMaximized: !state.isMapMaximized })),
        setMapMaximized: (value) => set({ isMapMaximized: value }),
      }),
      {
        name: 'map-storage',
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.isMapMaximized = false;
          }
        },
        skipHydration: true
      }
    )
  )
);
