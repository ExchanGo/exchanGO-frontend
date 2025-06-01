import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getAllCities, searchCitiesByName, SearchCitiesResponse } from '../api';

// Query keys for React Query
export const CITIES_QUERY_KEYS = {
  all: ['cities'] as const,
  search: (query: string) => ['cities', 'search', query] as const,
  infinite: (query: string) => ['cities', 'infinite', query] as const,
} as const;

// Hook to get all cities (for initial load and fallback)
export const useAllCities = () => {
  return useQuery({
    queryKey: CITIES_QUERY_KEYS.all,
    queryFn: getAllCities,
    staleTime: 10 * 60 * 1000, // 10 minutes (cities don't change often)
    gcTime: 30 * 60 * 1000, // 30 minutes cache time
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Hook to search cities by name using the search endpoint with debouncing optimization
export const useSearchCities = (searchQuery: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: CITIES_QUERY_KEYS.search(searchQuery),
    queryFn: () => searchCitiesByName(searchQuery),
    enabled: enabled && searchQuery.length >= 2, // Only search with 2+ characters
    staleTime: 5 * 60 * 1000, // 5 minutes for search results
    gcTime: 10 * 60 * 1000, // 10 minutes cache time
    retry: 2,
    retryDelay: 1000,
    // Debouncing is handled by the useCitiesData hook
  });
};

// Hook for infinite scrolling cities (if needed for pagination)
export const useInfiniteCities = (searchQuery: string = '') => {
  return useInfiniteQuery({
    queryKey: CITIES_QUERY_KEYS.infinite(searchQuery),
    queryFn: ({ pageParam = 0 }) => 
      searchQuery ? searchCitiesByName(searchQuery) : getAllCities(),
    initialPageParam: 0,
    getNextPageParam: (lastPage: SearchCitiesResponse, allPages) => {
      return lastPage.hasNextPage ? allPages.length : undefined;
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}; 