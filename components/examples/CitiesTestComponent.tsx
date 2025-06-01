"use client";

import React, { useState } from "react";
import { LocationAutoComplete } from "@/components/ui/LocationAutoComplete";
import { FloatingLocationAutoComplete } from "@/components/ui/FloatingLocationAutoComplet";
import { useCitiesData } from "@/lib/hooks/useCitiesData";
import { useSelectedLocation } from "@/store/useCitiesStore";

/**
 * Test component to verify the API integration works correctly
 * This component demonstrates:
 * 1. LocationAutoComplete with API data
 * 2. FloatingLocationAutoComplete with API data
 * 3. Direct usage of the useCitiesData hook
 * 4. Zustand store state display
 */
export function CitiesTestComponent() {
  const [searchQuery, setSearchQuery] = useState("");

  // Test the combined hook
  const { cities, isLoading, error, hasData, isSearching } = useCitiesData({
    searchQuery,
    enableSearch: true,
    debounceMs: 300,
  });

  // Test Zustand store
  const { selectedLocation, selectedLocationData } = useSelectedLocation();

  const handleLocationChange = (value: string) => {
    console.log("Location changed:", value);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Cities API Integration Test</h1>
        <p className="text-gray-600">
          Testing the new API integration with TanStack Query & Zustand
        </p>
      </div>

      {/* Status Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">API Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="font-medium">Loading:</span>
            <span
              className={`ml-2 ${
                isLoading ? "text-blue-600" : "text-gray-500"
              }`}
            >
              {isLoading ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <span className="font-medium">Error:</span>
            <span
              className={`ml-2 ${error ? "text-red-600" : "text-green-600"}`}
            >
              {error || "None"}
            </span>
          </div>
          <div>
            <span className="font-medium">Has Data:</span>
            <span
              className={`ml-2 ${hasData ? "text-green-600" : "text-gray-500"}`}
            >
              {hasData ? "Yes" : "No"}
            </span>
          </div>
          <div>
            <span className="font-medium">Cities Count:</span>
            <span className="ml-2 text-blue-600">{cities.length}</span>
          </div>
        </div>
      </div>

      {/* Selected Location Display */}
      {selectedLocation && (
        <div className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">
            Selected Location (Zustand Store)
          </h2>
          <div className="text-sm">
            <p>
              <span className="font-medium">Value:</span> {selectedLocation}
            </p>
            {selectedLocationData && (
              <>
                <p>
                  <span className="font-medium">Label:</span>{" "}
                  {selectedLocationData.label}
                </p>
                {selectedLocationData.id && (
                  <p>
                    <span className="font-medium">ID:</span>{" "}
                    {selectedLocationData.id}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Component Tests */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* LocationAutoComplete Test */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">LocationAutoComplete Test</h2>
          <div className="border rounded-lg p-4">
            <LocationAutoComplete
              defaultValue="rabat"
              onLocationChange={handleLocationChange}
              placeholder="Search for a location..."
              className="w-full"
            />
          </div>
        </div>

        {/* FloatingLocationAutoComplete Test */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">
            FloatingLocationAutoComplete Test
          </h2>
          <div className="border rounded-lg p-4">
            <FloatingLocationAutoComplete
              defaultValue=""
              onLocationChange={handleLocationChange}
              placeholder="Search for a location..."
              label="Location"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Direct Hook Usage Test */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Direct Hook Usage Test</h2>
        <div className="border rounded-lg p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Search Cities:
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Type to search cities..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {isSearching && (
              <p className="text-sm text-blue-600 mt-1">Searching...</p>
            )}
          </div>

          <div className="max-h-60 overflow-y-auto">
            {isLoading && cities.length === 0 ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Loading cities...</p>
              </div>
            ) : error ? (
              <div className="text-center py-4">
                <p className="text-red-600">Error: {error}</p>
              </div>
            ) : cities.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-600">No cities found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {cities.slice(0, 12).map((city) => (
                  <div
                    key={city.id || city.value}
                    className="p-2 bg-gray-50 rounded text-sm hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleLocationChange(city.value)}
                  >
                    {city.label}
                  </div>
                ))}
                {cities.length > 12 && (
                  <div className="p-2 text-sm text-gray-500 italic">
                    +{cities.length - 12} more...
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Testing Instructions</h2>
        <ul className="text-sm space-y-1 list-disc list-inside">
          <li>
            Make sure you have created <code>.env.local</code> with{" "}
            <code>NEXT_PUBLIC_API_BASE_URL</code>
          </li>
          <li>Try typing in the search boxes to test debounced API calls</li>
          <li>Select different cities to see Zustand store updates</li>
          <li>Check the browser network tab to see API requests</li>
          <li>Test with slow network to see loading states</li>
          <li>Test with network offline to see error handling</li>
        </ul>
      </div>
    </div>
  );
}
