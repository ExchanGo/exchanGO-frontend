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

### Cities API Endpoints

#### 1. Get All Cities

```
GET https://exchango.opineomanager.com/api/v1/cities
```

**Usage**: Initial load and fallback when no search query is provided.

#### 2. Search Cities

```
GET https://exchango.opineomanager.com/api/v1/cities/search?name={searchQuery}
```

**Usage**: Search for cities by name with server-side filtering.

**Parameters**:

- `name` (string): The search query (minimum 2 characters for optimization)

**Example**:

```
GET https://exchango.opineomanager.com/api/v1/cities/search?name=rabat
```

**Response Format** (both endpoints):

```json
{
  "data": [
    {
      "id": "996c7edb-411e-4eab-8cd4-5648df25a692",
      "name": "rabat",
      "createdAt": "2025-05-28T06:53:06.246Z",
      "updatedAt": "2025-05-28T06:53:06.246Z"
    }
  ],
  "hasNextPage": false
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

### 1. Smart Endpoint Selection

- **All Cities Endpoint**: Used for initial load and when no search query is provided
- **Search Endpoint**: Used when user searches with 2+ characters
- **Automatic Switching**: Seamlessly switches between endpoints based on user input

### 2. Debouncing Strategy

- **300ms Debounce**: Search API calls are debounced to prevent excessive requests
- **Minimum 2 Characters**: Search endpoint only triggers with 2+ characters
- **Immediate Local Filtering**: Shows instant feedback while debouncing API calls
- **Configurable Timing**: Debounce delay can be customized per component

### 3. Caching Strategy

- **All Cities**: 10 minutes stale time, 30 minutes cache time
- **Search Results**: 5 minutes stale time, 10 minutes cache time
- **Background Refetch**: Enabled on window focus and reconnect
- **Query-Specific Caching**: Each search query is cached separately

### 4. Selective Re-renders

Zustand store uses selective subscriptions to prevent unnecessary re-renders:

```tsx
// Only re-renders when cities change
const cities = useFilteredCities();

// Only re-renders when loading state changes
const isLoading = useCitiesLoading();

// Only re-renders when error state changes
const error = useCitiesError();
```

### 5. Optimized Data Flow

1. **Initial Load**: `useAllCities()` fetches all cities from `/cities` endpoint and stores them in Zustand
2. **Caching**: Cities are cached for 30 minutes since they rarely change
3. **Search Input**: User types in search box (debounced by 300ms)
4. **Client-Side Filtering**: Zustand store filters cached cities instantly based on search query
5. **UI Updates**: Components subscribe to filtered cities for optimal re-renders
6. **No Additional API Calls**: All search operations use cached data for instant results

## 🔄 Data Flow

### Initial Load

1. **App Starts**: `useAllCities()` fetches all cities from `/cities` endpoint
2. **Store Update**: Cities are stored in Zustand for immediate access
3. **UI Render**: Components display all available cities

### Search Flow

1. **User Types**: Input is captured in real-time
2. **Local Filtering**: Immediate feedback for queries < 2 characters
3. **Debouncing**: 300ms delay before triggering API search
4. **API Call**: Search endpoint called with debounced query (≥ 2 chars)
5. **Cache Check**: React Query checks if results are already cached
6. **Store Update**: Search results replace current cities in Zustand
7. **UI Update**: Components re-render with filtered results

### Optimization Features

- **Instant Feedback**: Local filtering while waiting for API response
- **Smart Caching**: Identical queries use cached results
- **Seamless Switching**: Automatic fallback to all cities when search is cleared
- **Error Handling**: Graceful fallback to cached data on API errors

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
