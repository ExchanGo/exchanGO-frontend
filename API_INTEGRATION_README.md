# API Integration with TanStack React Query & Zustand

This document outlines the new API integration for cities data using TanStack React Query for data fetching and Zustand for state management, providing optimal performance and caching.

## 🚀 Features

- **TanStack React Query** for efficient data fetching with caching, background updates, and error handling
- **Zustand** for performant state management with selective subscriptions
- **Debounced search** for optimal API usage
- **Error handling** with retry logic and user-friendly error states
- **Loading states** with skeleton loaders
- **Environment-based configuration** for different deployment environments
- **TypeScript** support with full type safety

## 📁 Project Structure

```
lib/
├── api/
│   ├── config.ts          # API configuration and types
│   ├── client.ts          # Axios client with interceptors
│   ├── cities.ts          # Cities API functions
│   └── index.ts           # API exports
├── hooks/
│   ├── useCities.ts       # React Query hooks
│   ├── useCitiesData.ts   # Combined hook (React Query + Zustand)
│   └── useDebounce.ts     # Debounce utility hook
└── providers/
    └── QueryProvider.tsx  # React Query provider

store/
└── useCitiesStore.ts      # Zustand store for cities

components/ui/
├── LocationAutoComplete.tsx        # Updated with API integration
└── FloatingLocationAutoComplete.tsx # Updated with API integration
```

## 🔧 Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://exchango.opineomanager.com/api/v1

# Mapbox Token (existing)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token_here
```

### 2. Dependencies

The following packages are already installed:

- `@tanstack/react-query` - Data fetching and caching
- `zustand` - State management
- `axios` - HTTP client

### 3. Provider Setup

The `QueryProvider` is already added to your root layout (`app/layout.tsx`).

## 📖 API Documentation

### Cities API Endpoint

```
GET https://exchango.opineomanager.com/api/v1/cities
```

**Note**: This endpoint returns all cities at once. There is no search parameter - filtering is done client-side for better performance.

**Response Format:**

```json
{
  "data": [
    {
      "id": "d4039d73-b926-4b8f-9e09-aed0645aca78",
      "name": "afourar",
      "createdAt": "2025-05-28T06:53:06.246Z",
      "updatedAt": "2025-05-28T06:53:06.246Z"
    },
    {
      "id": "f98e04a0-3662-4b64-86ad-7dec5cef8f0a",
      "name": "agadir",
      "createdAt": "2025-05-28T06:53:06.246Z",
      "updatedAt": "2025-05-28T06:53:06.246Z"
    }
  ],
  "hasNextPage": true
}
```

## 🎯 Usage Examples

### 1. Using the Enhanced Location Components

The existing `LocationAutoComplete` and `FloatingLocationAutoComplete` components now automatically fetch data from the API:

```tsx
import { LocationAutoComplete } from "@/components/ui/LocationAutoComplete";

function MyComponent() {
  const handleLocationChange = (value: string) => {
    console.log("Selected location:", value);
  };

  return (
    <LocationAutoComplete
      defaultValue="rabat"
      onLocationChange={handleLocationChange}
      placeholder="Search for a location..."
    />
  );
}
```

### 2. Using React Query Hooks Directly

```tsx
import { useAllCities, useSearchCities } from "@/lib/hooks/useCities";

function CitiesExample() {
  // Get all cities
  const { data: allCities, isLoading, error } = useAllCities();

  // Search cities with debouncing
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults } = useSearchCities(searchQuery);

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search cities..."
      />

      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}

      <ul>
        {(searchResults?.data || allCities?.data || []).map((city) => (
          <li key={city.id}>{city.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 3. Using the Combined Hook (Recommended)

```tsx
import { useCitiesData } from "@/lib/hooks/useCitiesData";

function OptimizedCitiesComponent() {
  const [searchQuery, setSearchQuery] = useState("");

  const { cities, isLoading, error, hasData, isSearching } = useCitiesData({
    searchQuery,
    enableSearch: true,
    debounceMs: 300,
  });

  return (
    <div>
      <input
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search cities..."
      />

      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {isSearching && <div>Searching...</div>}

      <ul>
        {cities.map((city) => (
          <li key={city.id || city.value}>{city.label}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 4. Using Zustand Store Directly

```tsx
import {
  useCitiesActions,
  useFilteredCities,
  useCitiesLoading,
} from "@/store/useCitiesStore";

function ZustandExample() {
  const cities = useFilteredCities();
  const isLoading = useCitiesLoading();
  const { filterCitiesByQuery, setSelectedLocation } = useCitiesActions();

  const handleSearch = (query: string) => {
    filterCitiesByQuery(query);
  };

  const handleSelect = (cityValue: string) => {
    const cityData = cities.find((c) => c.value === cityValue);
    setSelectedLocation(cityValue, cityData);
  };

  return <div>{/* Your component JSX */}</div>;
}
```

## ⚡ Performance Optimizations

### 1. Caching Strategy

- **Stale Time**: 10 minutes for all cities (cities don't change frequently)
- **Cache Time**: 30 minutes for all cities data
- **Background Refetch**: Enabled on window focus and reconnect
- **Single API Call**: All cities are fetched once and cached

### 2. Client-Side Filtering

- **Instant Search**: Search filtering is done client-side for immediate results
- **Debounced Input**: User input is debounced by 300ms to prevent excessive filtering
- **Memory Efficient**: Filtering is done on already cached data

### 3. Selective Re-renders

Zustand store uses selective subscriptions to prevent unnecessary re-renders:

```tsx
// Only re-renders when cities change
const cities = useFilteredCities();

// Only re-renders when loading state changes
const isLoading = useCitiesLoading();

// Only re-renders when error state changes
const error = useCitiesError();
```

### 4. Optimized Data Flow

1. **Initial Load**: `useAllCities()` fetches all cities from `/cities` endpoint and stores them in Zustand
2. **Caching**: Cities are cached for 30 minutes since they rarely change
3. **Search Input**: User types in search box (debounced by 300ms)
4. **Client-Side Filtering**: Zustand store filters cached cities instantly based on search query
5. **UI Updates**: Components subscribe to filtered cities for optimal re-renders
6. **No Additional API Calls**: All search operations use cached data for instant results

## 🔄 Data Flow

1. **Initial Load**: `useAllCities()` fetches all cities from `/cities` endpoint and stores them in Zustand
2. **Caching**: Cities are cached for 30 minutes since they rarely change
3. **Search Input**: User types in search box (debounced by 300ms)
4. **Client-Side Filtering**: Zustand store filters cached cities instantly based on search query
5. **UI Updates**: Components subscribe to filtered cities for optimal re-renders
6. **No Additional API Calls**: All search operations use cached data for instant results

## 🛠️ Error Handling

### API Errors

- Automatic retry with exponential backoff
- User-friendly error messages
- Fallback to cached data when possible

### Network Errors

- Retry on network reconnection
- Offline support with cached data
- Loading states during retries

## 🧪 Testing

The API integration includes proper error boundaries and loading states. Test scenarios:

1. **Network offline**: Should show cached data
2. **API error**: Should show error message with retry option
3. **Empty search**: Should show "No results found"
4. **Slow network**: Should show loading states

## 🔧 Configuration

### API Configuration

Modify `lib/api/config.ts` to adjust:

- Base URL
- Endpoints
- Default parameters

### Query Configuration

Modify `lib/providers/QueryProvider.tsx` to adjust:

- Cache times
- Retry logic
- Refetch behavior

### Store Configuration

Modify `store/useCitiesStore.ts` to adjust:

- State structure
- Actions
- Selectors

## 📝 Migration Notes

### From Hardcoded Cities

The components now automatically use API data instead of hardcoded cities. The `locations` prop is kept for backward compatibility but will be ignored.

### Existing Components

- `LocationAutoComplete`: ✅ Updated
- `FloatingLocationAutoComplete`: ✅ Updated
- Other location components: Update using the same pattern

## 🚀 Next Steps

1. **Add Environment Variables**: Create `.env.local` with the API base URL
2. **Test Components**: Verify that location components load cities from API
3. **Monitor Performance**: Use React Query DevTools in development
4. **Add More Endpoints**: Extend the API structure for other endpoints
5. **Implement Caching Strategy**: Fine-tune cache times based on usage patterns

## 📞 Support

For questions or issues with the API integration, refer to:

- TanStack Query docs: https://tanstack.com/query/latest
- Zustand docs: https://zustand-demo.pmnd.rs/
- This implementation in `lib/hooks/useCitiesData.ts`
