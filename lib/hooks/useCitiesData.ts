import { useEffect } from 'react';
import { useAllCities } from './useCities';
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
 * Optimized for the API that returns all cities at once - uses client-side filtering for better UX
 */
export const useCitiesData = (options: UseCitiesDataOptions = {}) => {
  const {
    searchQuery = '',
    enableSearch = true,
    debounceMs = 300,
  } = options;

  // Debounce search query for performance
  const debouncedSearchQuery = useDebounce(searchQuery, debounceMs);

  // Zustand store actions and state (using individual selectors)
  const setCities = useSetCities();
  const setLoading = useSetLoading();
  const setError = useSetError();
  const filterCitiesByQuery = useFilterCitiesByQuery();
  
  const filteredCities = useFilteredCities();
  const isStoreLoading = useCitiesLoading();
  const storeError = useCitiesError();

  // Primary React Query hook - get all cities (since API returns all cities at once)
  const {
    data: allCitiesData,
    isLoading: isLoadingAllCities,
    error: allCitiesError,
    isSuccess: isAllCitiesSuccess,
  } = useAllCities();

  // Sync React Query data with Zustand store
  useEffect(() => {
    if (isAllCitiesSuccess && allCitiesData?.data) {
      setCities(allCitiesData.data);
    }
  }, [isAllCitiesSuccess, allCitiesData, setCities]);

  // Handle search filtering (client-side for better UX)
  useEffect(() => {
    if (allCitiesData?.data) {
      filterCitiesByQuery(debouncedSearchQuery);
    }
  }, [debouncedSearchQuery, allCitiesData, filterCitiesByQuery]);

  // Sync loading state
  useEffect(() => {
    const isLoading = isLoadingAllCities;
    if (isLoading !== isStoreLoading) {
      setLoading(isLoading);
    }
  }, [isLoadingAllCities, isStoreLoading, setLoading]);

  // Sync error state
  useEffect(() => {
    const error = allCitiesError;
    const errorMessage = error ? (error as any)?.message || 'An error occurred' : null;
    if (errorMessage !== storeError) {
      setError(errorMessage);
    }
  }, [allCitiesError, storeError, setError]);

  return {
    // Data
    cities: filteredCities,
    allCitiesData: allCitiesData?.data || [],
    
    // Loading states
    isLoading: isStoreLoading,
    isLoadingInitial: isLoadingAllCities,
    isLoadingSearch: false, // No separate search loading since we do client-side filtering
    
    // Error states
    error: storeError,
    
    // Success states
    isSuccess: isAllCitiesSuccess,
    hasData: filteredCities.length > 0,
    
    // Pagination info (not applicable since API returns all cities)
    hasNextPage: false,
    
    // Query info
    searchQuery: debouncedSearchQuery,
    isSearching: debouncedSearchQuery.length > 0 && enableSearch,
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