export interface ExchangeOffice {
  id: string;
  name: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  rates: {
    baseCurrency: string;
    targetCurrency: string;
    buyRate: number;
    sellRate: number;
  }[];
  isOpen: boolean;
  hours: string;
  phone?: string;
  whatsapp?: string;
  distance?: number;
}

export interface NearbyOfficesRequest {
  latitude: number;
  longitude: number;
  radiusInKm: number;
  targetCurrency?: string;
  baseCurrency?: string;
  targetCurrencyRate?: number;
}

export interface NearbyOfficesResponse {
  offices: ExchangeOffice[];
  totalCount: number;
  searchRadius: number;
  centerLocation: {
    latitude: number;
    longitude: number;
  };
}

class ExchangeService {
  private readonly baseUrl = 'https://exchango.opineomanager.com/api/v1';
  private readonly authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwicm9sZSI6eyJpZCI6MiwibmFtZSI6IlVzZXIiLCJfX2VudGl0eSI6IlJvbGVFbnRpdHkifSwic2Vzc2lvbklkIjoxMiwiaWF0IjoxNzQ4OTc3NzA4LCJleHAiOjE3NDg5ODM2NDh9.W6US-wysKa-esZWEbY-heSrCwGKPYxvF5JRNkF6tEL4';

  /**
   * Get nearby exchange offices
   */
  async getNearbyOffices(params: NearbyOfficesRequest): Promise<NearbyOfficesResponse> {
    const url = new URL(`${this.baseUrl}/offices/nearby`);
    
    // Add required parameters
    url.searchParams.append('latitude', params.latitude.toString());
    url.searchParams.append('longitude', params.longitude.toString());
    url.searchParams.append('radiusInKm', params.radiusInKm.toString());
    
    // Only add currency parameters if both are provided and at least one is MAD
    if (params.baseCurrency && params.targetCurrency) {
      // Ensure at least one currency is MAD
      if (params.baseCurrency === 'MAD' || params.targetCurrency === 'MAD') {
        url.searchParams.append('baseCurrency', params.baseCurrency);
        url.searchParams.append('targetCurrency', params.targetCurrency);
        
        if (params.targetCurrencyRate) {
          url.searchParams.append('targetCurrencyRate', params.targetCurrencyRate.toString());
        }
      } else {
        // If neither is MAD, adjust the currencies
        url.searchParams.append('baseCurrency', 'MAD');
        url.searchParams.append('targetCurrency', params.baseCurrency);
      }
    }
    // If currency parameters are not provided, don't include them (like in your original curl)

    console.log('API URL:', url.toString());

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData);
        const errorMessage = errorData.message || `API request failed: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Success response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching nearby offices:', error);
      throw error;
    }
  }

  /**
   * Try API call without currency parameters first (like your original curl)
   */
  async getNearbyOfficesSimple(latitude: number, longitude: number, radiusInKm: number = 10): Promise<NearbyOfficesResponse> {
    const url = new URL(`${this.baseUrl}/offices/nearby`);
    
    // Add only the basic parameters (like your original curl)
    url.searchParams.append('latitude', latitude.toString());
    url.searchParams.append('longitude', longitude.toString());
    url.searchParams.append('radiusInKm', radiusInKm.toString());

    console.log('Simple API URL:', url.toString());

    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.authToken}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Simple response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Simple error response:', errorData);
        const errorMessage = errorData.message || `API request failed: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Simple success response:', data);
      return data;
    } catch (error) {
      console.error('Error fetching nearby offices (simple):', error);
      throw error;
    }
  }

  /**
   * Validate request parameters
   */
  validateNearbyOfficesRequest(params: Partial<NearbyOfficesRequest>): string[] {
    const errors: string[] = [];

    if (typeof params.latitude !== 'number' || isNaN(params.latitude)) {
      errors.push('Valid latitude is required');
    }

    if (typeof params.longitude !== 'number' || isNaN(params.longitude)) {
      errors.push('Valid longitude is required');
    }

    if (typeof params.radiusInKm !== 'number' || params.radiusInKm <= 0) {
      errors.push('Valid radius in kilometers is required');
    }

    // Currency parameters are now optional
    if (params.baseCurrency && params.targetCurrency) {
      if (params.baseCurrency !== 'MAD' && params.targetCurrency !== 'MAD') {
        console.log('Neither currency is MAD, will be adjusted automatically');
      }
    }

    return errors;
  }
}

// Export singleton instance
export const exchangeService = new ExchangeService(); 