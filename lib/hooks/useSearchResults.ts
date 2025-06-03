import { useState, useEffect } from 'react';

export interface ExchangeOfficeAPI {
  id: string;
  officeName: string;
  registrationNumber: string;
  currencyExchangeLicenseNumber: string;
  address: string;
  city: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
  country: {
    id: string;
    name: string;
    unicode: string;
    emoji: string;
    alpha2: string;
    dialCode: string;
    region: string;
    capital: string;
    alpha3: string;
    createdAt: string;
    updatedAt: string;
  };
  state: string;
  primaryPhoneNumber: string;
  secondaryPhoneNumber?: string;
  thirdPhoneNumber?: string;
  whatsappNumber?: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  logo?: {
    id: string;
    path: string;
    __entity: string;
  };
  slug: string;
  owner: {
    id: number;
    firstName?: string;
    lastName?: string;
    createdAt: string;
    updatedAt: string;
    deletedAt?: string;
  };
  isActive: boolean;
  isVerified: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  email?: string;
  rates: Array<{
    id: string;
    baseCurrency: {
      id: string;
      code: string;
      name: string;
      namePlural: string;
      symbol: string;
      symbolNative: string;
      decimalDigits: number;
      rounding: string;
      createdAt: string;
      updatedAt: string;
    };
    targetCurrency: {
      id: string;
      code: string;
      name: string;
      namePlural: string;
      symbol: string;
      symbolNative: string;
      decimalDigits: number;
      rounding: string;
      createdAt: string;
      updatedAt: string;
    };
    buyRate: string;
    sellRate: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
  }>;
  workingHours: any[];
  distanceInKm: number;
}

export interface SearchParams {
  location: {
    id: string;
    name: string;
    place_formatted: string;
    latitude: number;
    longitude: number;
    region?: string;
    feature_type: string;
    maki?: string;
  };
  amount: string;
  sourceCurrency: string;
  targetCurrency: string;
}

export interface SearchResults {
  offices?: ExchangeOfficeAPI[];
  totalCount?: number;
  searchRadius?: number;
  centerLocation?: {
    latitude: number;
    longitude: number;
  };
}

export const useSearchResults = () => {
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null);
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSearchData = () => {
      try {
        setIsLoading(true);
        setError(null);

        // Load search results from sessionStorage
        const resultsData = sessionStorage.getItem('searchResults');
        const paramsData = sessionStorage.getItem('searchParams');

        if (resultsData) {
          const parsedResults = JSON.parse(resultsData);
          setSearchResults(parsedResults);
        }

        if (paramsData) {
          const parsedParams = JSON.parse(paramsData);
          setSearchParams(parsedParams);
        }

        // If no data found, set empty state
        if (!resultsData && !paramsData) {
          setSearchResults({ offices: [] });
          setSearchParams(null);
        }

      } catch (err) {
        console.error('Error loading search data:', err);
        setError('Failed to load search results');
        setSearchResults({ offices: [] });
      } finally {
        setIsLoading(false);
      }
    };

    loadSearchData();

    // Listen for storage changes (in case data is updated)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'searchResults' || e.key === 'searchParams') {
        loadSearchData();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Helper function to get the best rate for a specific currency pair
  const getBestRate = (office: ExchangeOfficeAPI, fromCurrency: string, toCurrency: string) => {
    const rate = office.rates.find(r => 
      (r.baseCurrency.code === fromCurrency && r.targetCurrency.code === toCurrency) ||
      (r.baseCurrency.code === toCurrency && r.targetCurrency.code === fromCurrency)
    );
    return rate;
  };

  // Helper function to format rate display
  const formatRate = (office: ExchangeOfficeAPI, fromCurrency: string, toCurrency: string, amount: string = '1') => {
    const rate = getBestRate(office, fromCurrency, toCurrency);
    if (!rate) {
      // If no exact match found, show the first available rate as a fallback
      if (office.rates && office.rates.length > 0) {
        const firstRate = office.rates[0];
        const buyRate = parseFloat(firstRate.buyRate);
        const sellRate = parseFloat(firstRate.sellRate);
        const bestRate = Math.max(buyRate, sellRate);
        const targetSymbol = firstRate.targetCurrency.symbolNative || firstRate.targetCurrency.symbol;
        
        return `${targetSymbol} ${bestRate.toFixed(2)} (${firstRate.baseCurrency.code}→${firstRate.targetCurrency.code})`;
      }
      return 'Rate not available';
    }

    const numAmount = parseFloat(amount) || 1;
    const buyRate = parseFloat(rate.buyRate);
    const sellRate = parseFloat(rate.sellRate);

    // Use the better rate (higher for selling, lower for buying)
    const bestRate = Math.max(buyRate, sellRate);
    const convertedAmount = numAmount * bestRate;

    const targetSymbol = rate.targetCurrency.symbolNative || rate.targetCurrency.symbol;
    return `${targetSymbol} ${convertedAmount.toFixed(2)}`;
  };

  // Helper function to get office logo URL
  const getOfficeLogoUrl = (office: ExchangeOfficeAPI) => {
    if (office.logo?.path) {
      return `https://exchango.opineomanager.com${office.logo.path}`;
    }
    return '/img/default-office-logo.svg'; // Fallback image
  };

  // Helper function to format working hours
  const formatWorkingHours = (office: ExchangeOfficeAPI) => {
    if (office.workingHours && office.workingHours.length > 0) {
      // Format working hours if available
      return office.workingHours[0] || '09:00 - 17:00';
    }
    return '09:00 - 17:00'; // Default hours
  };

  return {
    searchResults,
    searchParams,
    isLoading,
    error,
    getBestRate,
    formatRate,
    getOfficeLogoUrl,
    formatWorkingHours,
  };
}; 