import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { City } from '@/lib/api';
import React from 'react';

export interface LocationOption {
  value: string;
  label: string;
  id?: string;
}

interface CitiesState {
  // Cities data
  cities: City[];
  filteredCities: LocationOption[];
  
  // UI state
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  
  // Selected locations
  selectedLocation: string | null;
  selectedLocationData: LocationOption | null;
  
  // Actions
  setCities: (cities: City[]) => void;
  setFilteredCities: (cities: LocationOption[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedLocation: (location: string | null, locationData?: LocationOption | null) => void;
  
  // Computed actions
  filterCitiesByQuery: (query: string) => void;
  clearSearch: () => void;
  reset: () => void;
}

// Transform API cities to LocationOption format
const transformCitiesToOptions = (cities: City[]): LocationOption[] => {
  return cities.map(city => ({
    value: city.name.toLowerCase().replace(/\s+/g, '-'),
    label: city.name.charAt(0).toUpperCase() + city.name.slice(1),
    id: city.id,
  }));
};

export const useCitiesStore = create<CitiesState>()(
  devtools(
    subscribeWithSelector((set, get) => ({
      // Initial state
      cities: [],
      filteredCities: [],
      isLoading: false,
      error: null,
      searchQuery: '',
      selectedLocation: null,
      selectedLocationData: null,

      // Actions
      setCities: (cities) => {
        const locationOptions = transformCitiesToOptions(cities);
        set(
          {
            cities,
            filteredCities: locationOptions,
          },
          false,
          'setCities'
        );
      },

      setFilteredCities: (cities) =>
        set({ filteredCities: cities }, false, 'setFilteredCities'),

      setLoading: (loading) =>
        set({ isLoading: loading }, false, 'setLoading'),

      setError: (error) =>
        set({ error }, false, 'setError'),

      setSearchQuery: (query) =>
        set({ searchQuery: query }, false, 'setSearchQuery'),

      setSelectedLocation: (location, locationData) =>
        set(
          {
            selectedLocation: location,
            selectedLocationData: locationData || null,
          },
          false,
          'setSelectedLocation'
        ),

      // Computed actions
      filterCitiesByQuery: (query) => {
        const { cities } = get();
        if (!query.trim()) {
          const allOptions = transformCitiesToOptions(cities);
          set({ filteredCities: allOptions, searchQuery: query }, false, 'filterCitiesByQuery');
          return;
        }

        const filtered = cities.filter(city =>
          city.name.toLowerCase().includes(query.toLowerCase())
        );
        
        const filteredOptions = transformCitiesToOptions(filtered);
        set(
          {
            filteredCities: filteredOptions,
            searchQuery: query,
          },
          false,
          'filterCitiesByQuery'
        );
      },

      clearSearch: () =>
        set(
          {
            searchQuery: '',
            filteredCities: transformCitiesToOptions(get().cities),
          },
          false,
          'clearSearch'
        ),

      reset: () =>
        set(
          {
            cities: [],
            filteredCities: [],
            isLoading: false,
            error: null,
            searchQuery: '',
            selectedLocation: null,
            selectedLocationData: null,
          },
          false,
          'reset'
        ),
    })),
    {
      name: 'cities-store',
    }
  )
);

// Selectors for performance optimization
export const useCitiesData = () => useCitiesStore((state) => state.cities);
export const useFilteredCities = () => useCitiesStore((state) => state.filteredCities);
export const useCitiesLoading = () => useCitiesStore((state) => state.isLoading);
export const useCitiesError = () => useCitiesStore((state) => state.error);
export const useSearchQuery = () => useCitiesStore((state) => state.searchQuery);
export const useSelectedLocation = () => useCitiesStore((state) => ({
  selectedLocation: state.selectedLocation,
  selectedLocationData: state.selectedLocationData,
}));

// Individual action selectors (recommended approach)
export const useSetCities = () => useCitiesStore((state) => state.setCities);
export const useSetFilteredCities = () => useCitiesStore((state) => state.setFilteredCities);
export const useSetLoading = () => useCitiesStore((state) => state.setLoading);
export const useSetError = () => useCitiesStore((state) => state.setError);
export const useSetSearchQuery = () => useCitiesStore((state) => state.setSearchQuery);
export const useSetSelectedLocation = () => useCitiesStore((state) => state.setSelectedLocation);
export const useFilterCitiesByQuery = () => useCitiesStore((state) => state.filterCitiesByQuery);
export const useClearSearch = () => useCitiesStore((state) => state.clearSearch);
export const useResetCities = () => useCitiesStore((state) => state.reset);

// Combined action selectors (use with caution - can cause re-renders)
// Using useCallback to prevent infinite loops
export const useCitiesActions = () => {
  const setCities = useCitiesStore((state) => state.setCities);
  const setFilteredCities = useCitiesStore((state) => state.setFilteredCities);
  const setLoading = useCitiesStore((state) => state.setLoading);
  const setError = useCitiesStore((state) => state.setError);
  const setSearchQuery = useCitiesStore((state) => state.setSearchQuery);
  const setSelectedLocation = useCitiesStore((state) => state.setSelectedLocation);
  const filterCitiesByQuery = useCitiesStore((state) => state.filterCitiesByQuery);
  const clearSearch = useCitiesStore((state) => state.clearSearch);
  const reset = useCitiesStore((state) => state.reset);

  return React.useMemo(() => ({
    setCities,
    setFilteredCities,
    setLoading,
    setError,
    setSearchQuery,
    setSelectedLocation,
    filterCitiesByQuery,
    clearSearch,
    reset,
  }), [
    setCities,
    setFilteredCities,
    setLoading,
    setError,
    setSearchQuery,
    setSelectedLocation,
    filterCitiesByQuery,
    clearSearch,
    reset,
  ]);
}; 