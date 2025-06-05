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
  private accessToken: string;
  private refreshToken: string;
  private tokenExpires: number;

  constructor() {
    // Initialize with the current tokens
    this.accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6OCwicm9sZSI6eyJpZCI6Mn0sInNlc3Npb25JZCI6MTMsImlhdCI6MTc0ODk4NTEzOCwiZXhwIjoxNzQ4OTkxMDc4fQ.IjWaYl3ygJzeXZTuli_VUxdece0nfgXoK57EqcCTmEs';
    this.refreshToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZXNzaW9uSWQiOjEzLCJoYXNoIjoiOWExNDNjZTA0Y2RiNzZkOWU1ZWY5MmZiNTc5OWM2MDI3YmYzMDc2YTQxMmZmNzAyZTFiNWE0NWEzZmY2MTZmNiIsImlhdCI6MTc0ODk4NTEzOCwiZXhwIjoyMDY0MzQ1MTM4fQ.FnNGQ30sAbrU1CfXNwioKwg1JVnadZE8JuSlcKB0eqo';
    this.tokenExpires = 1748991078761;
  }

  /**
   * Update tokens manually
   */
  updateTokens(accessToken: string, refreshToken: string, tokenExpires: number): void {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.tokenExpires = tokenExpires;
    console.log('🔑 Tokens updated successfully');
  }

  /**
   * Check if access token is expired or will expire soon (within 5 minutes)
   */
  isAccessTokenExpired(): boolean {
    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
    return this.tokenExpires < fiveMinutesFromNow;
  }

  /**
   * Refresh the access token using the refresh token
   */
  async refreshAccessToken(): Promise<void> {
    try {
      console.log('🔄 Refreshing access token...');
      
      const response = await fetch(`${this.baseUrl}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.refreshToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Token refresh failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.token && data.refreshToken && data.tokenExpires) {
        this.accessToken = data.token;
        this.refreshToken = data.refreshToken;
        this.tokenExpires = data.tokenExpires;
        console.log('✅ Access token refreshed successfully');
      } else {
        throw new Error('Invalid token refresh response');
      }
    } catch (error) {
      console.error('❌ Failed to refresh access token:', error);
      throw new Error('Authentication failed. Please refresh the page or contact support.');
    }
  }

  /**
   * Get a valid access token (refresh if needed)
   */
  async getValidAccessToken(): Promise<string> {
    if (this.isAccessTokenExpired()) {
      await this.refreshAccessToken();
    }
    return this.accessToken;
  }

  /**
   * Get current tokens info (for debugging)
   */
  getTokensInfo(): { accessToken: string; refreshToken: string; expiresAt: Date; isExpired: boolean } {
    return {
      accessToken: this.accessToken,
      refreshToken: this.refreshToken,
      expiresAt: new Date(this.tokenExpires),
      isExpired: this.isAccessTokenExpired()
    };
  }

  /**
   * Get nearby exchange offices
   */
  async getNearbyOffices(params: NearbyOfficesRequest): Promise<NearbyOfficesResponse> {
    // Get a valid access token (will refresh if needed)
    const token = await this.getValidAccessToken();

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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Error response:', errorData);
        
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication failed. The access token may have expired. Please refresh the page or contact support.');
        }
        
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
    // Get a valid access token (will refresh if needed)
    const token = await this.getValidAccessToken();

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
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Simple response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log('Simple error response:', errorData);
        
        // Handle specific error cases
        if (response.status === 401) {
          throw new Error('Authentication failed. The access token may have expired. Please refresh the page or contact support.');
        }
        
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