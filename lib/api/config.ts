// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://exchango.opineomanager.com/api/v1',
  ENDPOINTS: {
    CITIES: '/cities',
    CITIES_SEARCH: '/cities/search',
  },
  DEFAULT_PARAMS: {
    CITIES: {},
    CITIES_SEARCH: {
      name: '',
    },
  },
} as const;

// API Response Types
export interface ApiResponse<T> {
  data: T;
  hasNextPage?: boolean;
}

export interface City {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export type CitiesResponse = ApiResponse<City[]>; 