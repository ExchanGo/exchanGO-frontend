import { MoroccoCityData, moroccoCities, searchMoroccoCities } from '@/lib/data/moroccoCities';

export interface MapboxLocationResult {
  id: string;
  name: string;
  place_formatted: string;
  latitude: number;
  longitude: number;
  region?: string;
  feature_type: string;
  maki?: string;
}

export interface MapboxSearchResponse {
  suggestions?: Array<{
    name: string;
    mapbox_id: string;
    feature_type: string;
    address?: string;
    full_address?: string;
    place_formatted?: string;
    context?: {
      country?: { name: string; country_code: string };
      region?: { name: string };
      place?: { name: string };
    };
    language?: string;
    maki?: string;
  }>;
  features?: Array<{
    id: string;
    type: string;
    place_type: string[];
    relevance: number;
    properties: Record<string, any>;
    text: string;
    place_name: string;
    center: [number, number];
    geometry: {
      type: string;
      coordinates: [number, number];
    };
    context?: Array<{
      id: string;
      text: string;
      short_code?: string;
    }>;
  }>;
}

class MapboxLocationService {
  private readonly accessToken: string;
  private readonly baseUrl = 'https://api.mapbox.com';

  constructor() {
    this.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
    if (!this.accessToken) {
      console.warn('Mapbox access token not found. Location search will use local data only.');
    }
  }

  /**
   * Search for locations in Morocco using both local data and Mapbox API
   */
  async searchLocations(query: string): Promise<MapboxLocationResult[]> {
    if (!query.trim()) {
      return this.convertCitiesToResults(moroccoCities.slice(0, 10));
    }

    // First, search in local data for instant results
    const localResults = searchMoroccoCities(query);
    
    // If we have good local results or no API token, return local results
    if (localResults.length >= 5 || !this.accessToken) {
      return this.convertCitiesToResults(localResults.slice(0, 10));
    }

    try {
      // Search using Mapbox API for more comprehensive results
      const apiResults = await this.searchWithMapboxAPI(query);
      
      // Combine and deduplicate results
      const combinedResults = this.combineResults(localResults, apiResults);
      
      return combinedResults.slice(0, 10);
    } catch (error) {
      console.error('Mapbox API search failed, falling back to local data:', error);
      return this.convertCitiesToResults(localResults.slice(0, 10));
    }
  }

  /**
   * Search using Mapbox Geocoding API
   */
  private async searchWithMapboxAPI(query: string): Promise<MapboxLocationResult[]> {
    if (!this.accessToken) {
      throw new Error('Mapbox access token not available');
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${encodedQuery}.json?` +
      `access_token=${this.accessToken}&` +
      `country=ma&` + // Restrict to Morocco
      `types=place,locality,neighborhood,address,poi&` +
      `proximity=-7.092,31.792&` + // Center of Morocco
      `limit=10&` +
      `language=en,fr,ar`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${response.status}`);
    }

    const data: MapboxSearchResponse = await response.json();
    
    if (!data.features || data.features.length === 0) {
      return [];
    }

    return data.features.map(feature => ({
      id: feature.id,
      name: feature.text,
      place_formatted: feature.place_name,
      latitude: feature.center[1],
      longitude: feature.center[0],
      feature_type: feature.place_type[0] || 'place',
      maki: feature.properties?.category || 'marker',
      region: this.extractRegionFromContext(feature.context)
    }));
  }

  /**
   * Search using Mapbox Search API (newer API)
   */
  private async searchWithSearchAPI(query: string): Promise<MapboxLocationResult[]> {
    if (!this.accessToken) {
      throw new Error('Mapbox access token not available');
    }

    const encodedQuery = encodeURIComponent(query);
    const url = `${this.baseUrl}/search/searchbox/v1/suggest?` +
      `q=${encodedQuery}&` +
      `access_token=${this.accessToken}&` +
      `country=ma&` +
      `types=place,locality,neighborhood,address,poi&` +
      `proximity=-7.092,31.792&` +
      `limit=10&` +
      `language=en`;

    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Mapbox Search API error: ${response.status}`);
    }

    const data: MapboxSearchResponse = await response.json();
    
    if (!data.suggestions || data.suggestions.length === 0) {
      return [];
    }

    // Note: Search API suggestions need to be retrieved for full details
    // For now, we'll use the basic info available
    return data.suggestions.map(suggestion => ({
      id: suggestion.mapbox_id,
      name: suggestion.name,
      place_formatted: suggestion.place_formatted || suggestion.name,
      latitude: 0, // Would need to retrieve full details
      longitude: 0, // Would need to retrieve full details
      feature_type: suggestion.feature_type || 'place',
      maki: suggestion.maki || 'marker',
      region: suggestion.context?.region?.name
    }));
  }

  /**
   * Convert local city data to MapboxLocationResult format
   */
  private convertCitiesToResults(cities: MoroccoCityData[]): MapboxLocationResult[] {
    return cities.map(city => ({
      id: city.value,
      name: city.label,
      place_formatted: `${city.label}, Morocco`,
      latitude: city.latitude,
      longitude: city.longitude,
      region: city.region,
      feature_type: 'place',
      maki: 'marker'
    }));
  }

  /**
   * Combine local and API results, removing duplicates
   */
  private combineResults(
    localResults: MoroccoCityData[], 
    apiResults: MapboxLocationResult[]
  ): MapboxLocationResult[] {
    const localConverted = this.convertCitiesToResults(localResults);
    const combined = [...localConverted];

    // Add API results that don't duplicate local results
    for (const apiResult of apiResults) {
      const isDuplicate = localConverted.some(local => 
        this.isSimilarLocation(local, apiResult)
      );
      
      if (!isDuplicate) {
        combined.push(apiResult);
      }
    }

    // Sort by relevance (local results first, then by name)
    return combined.sort((a, b) => {
      const aIsLocal = localResults.some(local => local.value === a.id);
      const bIsLocal = localResults.some(local => local.value === b.id);
      
      if (aIsLocal && !bIsLocal) return -1;
      if (!aIsLocal && bIsLocal) return 1;
      
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Check if two locations are similar (likely the same place)
   */
  private isSimilarLocation(
    loc1: MapboxLocationResult, 
    loc2: MapboxLocationResult
  ): boolean {
    // Check name similarity
    const name1 = loc1.name.toLowerCase().replace(/[^a-z]/g, '');
    const name2 = loc2.name.toLowerCase().replace(/[^a-z]/g, '');
    
    if (name1 === name2) return true;
    
    // Check coordinate proximity (within ~1km)
    if (loc1.latitude && loc1.longitude && loc2.latitude && loc2.longitude) {
      const distance = this.calculateDistance(
        loc1.latitude, loc1.longitude,
        loc2.latitude, loc2.longitude
      );
      return distance < 1; // Less than 1km apart
    }
    
    return false;
  }

  /**
   * Calculate distance between two coordinates in kilometers
   */
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI/180);
  }

  /**
   * Extract region name from Mapbox context
   */
  private extractRegionFromContext(context?: Array<{ id: string; text: string; short_code?: string }>): string | undefined {
    if (!context) return undefined;
    
    const region = context.find(item => item.id.includes('region'));
    return region?.text;
  }

  /**
   * Get location details by coordinates
   */
  async reverseGeocode(latitude: number, longitude: number): Promise<MapboxLocationResult | null> {
    if (!this.accessToken) {
      // Try to find closest local city
      return this.findClosestLocalCity(latitude, longitude);
    }

    try {
      const url = `${this.baseUrl}/geocoding/v5/mapbox.places/${longitude},${latitude}.json?` +
        `access_token=${this.accessToken}&` +
        `country=ma&` +
        `types=place,locality,neighborhood,address&` +
        `language=fr,en&` +
        `limit=1`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Reverse geocoding failed: ${response.status}`);
      }

      const data: MapboxSearchResponse = await response.json();
      
      if (!data.features || data.features.length === 0) {
        return this.findClosestLocalCity(latitude, longitude);
      }

      const feature = data.features[0];
      return {
        id: feature.id,
        name: feature.text,
        place_formatted: feature.place_name,
        latitude: feature.center[1],
        longitude: feature.center[0],
        feature_type: feature.place_type[0] || 'place',
        maki: feature.properties?.category || 'marker',
        region: this.extractRegionFromContext(feature.context)
      };
    } catch (error) {
      console.error('Reverse geocoding failed:', error);
      return this.findClosestLocalCity(latitude, longitude);
    }
  }

  /**
   * Find the closest city in local data
   */
  private findClosestLocalCity(latitude: number, longitude: number): MapboxLocationResult | null {
    let closestCity: MoroccoCityData | null = null;
    let minDistance = Infinity;

    for (const city of moroccoCities) {
      const distance = this.calculateDistance(latitude, longitude, city.latitude, city.longitude);
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    }

    if (!closestCity) return null;

    return {
      id: closestCity.value,
      name: closestCity.label,
      place_formatted: `${closestCity.label}, Morocco`,
      latitude: closestCity.latitude,
      longitude: closestCity.longitude,
      region: closestCity.region,
      feature_type: 'place',
      maki: 'marker'
    };
  }
}

// Export singleton instance
export const mapboxLocationService = new MapboxLocationService(); 