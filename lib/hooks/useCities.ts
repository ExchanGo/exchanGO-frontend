import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { getAllCities, searchCitiesByName, SearchCitiesResponse } from '../api';

// Query keys for React Query
export const CITIES_QUERY_KEYS = {
  all: ['cities'] as const,
  search: (query: string) => ['cities', 'search', query] as const,
  infinite: (query: string) => ['cities', 'infinite', query] as const,
} as const;

// Hook to get all cities (primary hook since API returns all cities)
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

// Hook to search cities by name (uses client-side filtering for better UX)
export const useSearchCities = (searchQuery: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: CITIES_QUERY_KEYS.search(searchQuery),
    queryFn: () => searchCitiesByName(searchQuery),
    enabled: enabled && searchQuery.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
    retry: 2,
    retryDelay: 1000,
  });
};

// Hook for infinite scrolling cities (if needed for pagination)
export const useInfiniteCities = (searchQuery: string = '') => {
  return useInfiniteQuery({
    queryKey: CITIES_QUERY_KEYS.infinite(searchQuery),
    queryFn: ({ pageParam = 0 }) => 
      searchCitiesByName(searchQuery),
    initialPageParam: 0,
    getNextPageParam: (lastPage: SearchCitiesResponse, allPages) => {
      return lastPage.hasNextPage ? allPages.length : undefined;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}; 