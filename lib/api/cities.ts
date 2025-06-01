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

// Get all cities from the API
export const getAllCities = async (): Promise<SearchCitiesResponse> => {
  const response = await apiRequest<CitiesResponse>({
    method: 'GET',
    url: API_CONFIG.ENDPOINTS.CITIES,
  });

  return {
    data: response.data,
    hasNextPage: false, // The API returns all cities at once
  };
};

// Search cities by name (client-side filtering since API returns all cities)
export const searchCitiesByName = async (name: string): Promise<SearchCitiesResponse> => {
  const allCitiesResponse = await getAllCities();
  
  if (!name.trim()) {
    return allCitiesResponse;
  }

  // Filter cities by name on the client side
  const filteredCities = allCitiesResponse.data.filter(city =>
    city.name.toLowerCase().includes(name.toLowerCase())
  );

  return {
    data: filteredCities,
    hasNextPage: false,
  };
};

// Legacy function for backward compatibility
export const searchCities = async (
  params: SearchCitiesParams = {}
): Promise<SearchCitiesResponse> => {
  if (params.name) {
    return searchCitiesByName(params.name);
  }
  return getAllCities();
}; 