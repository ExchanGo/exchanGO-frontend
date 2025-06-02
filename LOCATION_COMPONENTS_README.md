# Location Components - Mapbox Integration

This document describes the improvements made to the `LocationAutoComplete` and `FloatingLocationAutoComplete` components to integrate with Mapbox and focus on Moroccan cities.

## Overview

The location components have been enhanced to:

- Use Mapbox Geocoding API for real-time location search
- Focus specifically on cities in Morocco
- Include latitude and longitude coordinates for each location
- Maintain existing styling and user experience
- Provide fallback to local city data when API is unavailable

## Components Updated

### 1. LocationAutoComplete (`components/ui/LocationAutoComplete.tsx`)

- **Purpose**: Standard location autocomplete component
- **Features**:
  - Mapbox API integration
  - Debounced search (300ms delay)
  - Current location detection
  - Error handling and loading states
  - Fallback to local Morocco cities data

### 2. FloatingLocationAutoComplete (`components/ui/FloatingLocationAutoComplet.tsx`)

- **Purpose**: Floating label version of location autocomplete
- **Features**: Same as LocationAutoComplete with floating label styling

## New Files Created

### 1. Morocco Cities Data (`lib/data/moroccoCities.ts`)

- **Purpose**: Comprehensive database of Moroccan cities with coordinates
- **Contains**:
  - 80+ cities across Morocco
  - Latitude/longitude coordinates
  - Population data
  - Regional information
  - Helper functions for searching and filtering

### 2. Mapbox Service (`lib/services/mapboxService.ts`)

- **Purpose**: Service layer for Mapbox API integration
- **Features**:
  - Location search with Morocco focus
  - Reverse geocoding
  - Result combination (local + API)
  - Duplicate removal
  - Distance calculations
  - Error handling

## Usage Examples

### Basic Usage

```tsx
import { LocationAutoComplete } from "@/components/ui/LocationAutoComplete";
import { MapboxLocationResult } from "@/lib/services/mapboxService";

function MyComponent() {
  const handleLocationChange = (
    value: string,
    location?: MapboxLocationResult
  ) => {
    if (location) {
      console.log("Selected:", location.name);
      console.log("Coordinates:", location.latitude, location.longitude);
      console.log("Region:", location.region);
    }
  };

  return (
    <LocationAutoComplete
      onLocationChange={handleLocationChange}
      placeholder="Search cities in Morocco"
    />
  );
}
```

### With Floating Label

```tsx
import { FloatingLocationAutoComplete } from "@/components/ui/FloatingLocationAutoComplet";

function MyComponent() {
  return (
    <FloatingLocationAutoComplete
      label="Location"
      placeholder="Search cities in Morocco"
      onLocationChange={handleLocationChange}
    />
  );
}
```

## Data Structure

### MapboxLocationResult

```typescript
interface MapboxLocationResult {
  mapbox_id?: string;
  name: string;
  latitude: number;
  longitude: number;
  region?: string;
  country?: string;
  place_type?: string[];
  relevance?: number;
}
```

### MoroccoCityData

```typescript
interface MoroccoCityData {
  value: string;
  label: string;
  latitude: number;
  longitude: number;
  region: string;
  population: number;
}
```

## Environment Variables

Make sure to set your Mapbox access token:

```env
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

## Features

### Search Functionality

- **Real-time search**: Uses Mapbox Geocoding API
- **Local fallback**: Falls back to local city data if API fails
- **Debounced input**: Prevents excessive API calls
- **Morocco focus**: Prioritizes Moroccan cities in results

### Location Detection

- **Current location**: "Use current location" button
- **Reverse geocoding**: Converts coordinates to city names
- **Closest city**: Finds nearest Moroccan city if exact match not found

### Error Handling

- **API failures**: Graceful fallback to local data
- **Network issues**: Shows appropriate error messages
- **Loading states**: Visual feedback during searches

### Performance

- **Debounced search**: 300ms delay to reduce API calls
- **Result caching**: Combines and deduplicates results
- **Optimized rendering**: Efficient dropdown updates

## Components Integration

The following components have been updated to use the new location functionality:

1. **CurrencyConverter** (`components/landing/CurrencyConverter.tsx`)
2. **SearchFilters** (`components/searchResults/SearchFilters.tsx`)
3. **ExampleLocation** (`app/example-location.tsx`)

## Testing

You can test the components using the example page at `/example-location` which demonstrates:

- Default styling
- Custom placeholders
- Multiple instances
- Coordinate display
- Region information

## Notes

- All existing styling has been preserved
- Components are backward compatible
- Mapbox integration is optional (falls back to local data)
- Focus is specifically on Moroccan cities
- Coordinates are included for all locations
