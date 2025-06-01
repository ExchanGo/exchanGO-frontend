import { useEffect } from 'react';
import { useAllCities, useSearchCities } from './useCities';
import { 
  useFilteredCities, 
  useCitiesLoading, 
  useCitiesError,
  useSetCities,
  useSetLoading,
  useSetError,
  useFilterCitiesByQuery
} from '@/store/useCitiesStore';
import useDebounce from './useDebounce';

interface UseCitiesDataOptions {
  searchQuery?: string;
  enableSearch?: boolean;
  debounceMs?: number;
}

/**
 * Custom hook that combines React Query for data fetching with Zustand for state management
 * Uses search endpoint for queries and all cities endpoint for initial load
 * Includes debouncing optimization for search performance
 */
export const useCitiesData = (options: UseCitiesDataOptions = {}) => {
  const {
    searchQuery = '',
    enableSearch = true,
    debounceMs = 300,
  } = options;

  // Debounce search query for performance (prevents excessive API calls)
  const debouncedSearchQuery = useDebounce(searchQuery, debounceMs);

  // Zustand store actions and state (using individual selectors)
  const setCities = useSetCities();
  const setLoading = useSetLoading();
  const setError = useSetError();
  const filterCitiesByQuery = useFilterCitiesByQuery();
  
  const filteredCities = useFilteredCities();
  const isStoreLoading = useCitiesLoading();
  const storeError = useCitiesError();

  // Get all cities for initial load
  const {
    data: allCitiesData,
    isLoading: isLoadingAllCities,
    error: allCitiesError,
    isSuccess: isAllCitiesSuccess,
  } = useAllCities();

  // Search cities when there's a debounced query
  const shouldSearch = enableSearch && debouncedSearchQuery.length >= 2;
  const {
    data: searchData,
    isLoading: isLoadingSearch,
    error: searchError,
    isSuccess: isSearchSuccess,
  } = useSearchCities(debouncedSearchQuery, shouldSearch);

  // Determine which data to use
  const activeData = shouldSearch ? searchData : allCitiesData;
  const isActiveLoading = shouldSearch ? isLoadingSearch : isLoadingAllCities;
  const activeError = shouldSearch ? searchError : allCitiesError;
  const isActiveSuccess = shouldSearch ? isSearchSuccess : isAllCitiesSuccess;

  // Sync React Query data with Zustand store
  useEffect(() => {
    if (isActiveSuccess && activeData?.data) {
      setCities(activeData.data);
      // For search results, don't filter again since API already filtered
      // For all cities, apply local filtering if there's a non-debounced query
      if (shouldSearch) {
        // API already filtered, just set the cities
        filterCitiesByQuery('');
      } else if (searchQuery && searchQuery !== debouncedSearchQuery) {
        // Apply local filtering for immediate feedback while debouncing
        filterCitiesByQuery(searchQuery);
      } else {
        // No search query, show all cities
        filterCitiesByQuery('');
      }
    }
  }, [isActiveSuccess, activeData, setCities, filterCitiesByQuery, shouldSearch, searchQuery, debouncedSearchQuery]);

  // Sync loading state
  useEffect(() => {
    const isLoading = isActiveLoading;
    if (isLoading !== isStoreLoading) {
      setLoading(isLoading);
    }
  }, [isActiveLoading, isStoreLoading, setLoading]);

  // Sync error state
  useEffect(() => {
    const error = activeError;
    const errorMessage = error ? (error as any)?.message || 'An error occurred' : null;
    if (errorMessage !== storeError) {
      setError(errorMessage);
    }
  }, [activeError, storeError, setError]);

  return {
    // Data
    cities: filteredCities,
    allCitiesData: allCitiesData?.data || [],
    searchData: searchData?.data || [],
    
    // Loading states
    isLoading: isStoreLoading,
    isLoadingInitial: isLoadingAllCities,
    isLoadingSearch: isLoadingSearch,
    
    // Error states
    error: storeError,
    
    // Success states
    isSuccess: isActiveSuccess,
    hasData: filteredCities.length > 0,
    
    // Pagination info
    hasNextPage: activeData?.hasNextPage || false,
    
    // Query info
    searchQuery: debouncedSearchQuery,
    isSearching: shouldSearch && isLoadingSearch,
    isUsingSearchEndpoint: shouldSearch,
  };
};

/**
 * Simplified hook for just getting all cities without search functionality
 */
export const useAllCitiesData = () => {
  return useCitiesData({ enableSearch: false });
};

/**
 * Hook specifically for search functionality with debouncing
 */
export const useSearchCitiesData = (searchQuery: string, debounceMs: number = 300) => {
  return useCitiesData({
    searchQuery,
    enableSearch: true,
    debounceMs,
  });
}; 