import { apiRequest } from './client';
import { API_CONFIG, CitiesResponse, City } from './config';

export interface SearchCitiesParams {
  name?: string;
  limit?: number;
  offset?: number;
}

export interface SearchCitiesResponse {
  data: City[];
  hasNextPage: boolean;
}

// Get all cities from the API (for initial load)
export const getAllCities = async (): Promise<SearchCitiesResponse> => {
  const response = await apiRequest<CitiesResponse>({
    method: 'GET',
    url: API_CONFIG.ENDPOINTS.CITIES,
  });

  return {
    data: response.data,
    hasNextPage: response.hasNextPage || false,
  };
};

// Search cities by name using the search endpoint
export const searchCitiesByName = async (name: string): Promise<SearchCitiesResponse> => {
  if (!name.trim()) {
    // If no search query, return all cities
    return getAllCities();
  }

  const searchParams = new URLSearchParams();
  searchParams.append('name', name.trim());

  const url = `${API_CONFIG.ENDPOINTS.CITIES_SEARCH}?${searchParams.toString()}`;
  
  const response = await apiRequest<SearchCitiesResponse>({
    method: 'GET',
    url,
  });

  return {
    data: response.data,
    hasNextPage: response.hasNextPage || false,
  };
};

// Generic search function with parameters
export const searchCities = async (
  params: SearchCitiesParams = {}
): Promise<SearchCitiesResponse> => {
  if (params.name && params.name.trim()) {
    return searchCitiesByName(params.name);
  }
  return getAllCities();
}; 