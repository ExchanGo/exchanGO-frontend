"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Check,
  Search,
  Info,
  X,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthNavbar from "@/components/auth/AuthNavbar";
import MapProvider from "@/lib/mapbox/provider";
import { useMap } from "@/context/map-context";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { LocationFeature } from "@/lib/mapbox/utils";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";
import { Loader } from "@/components/ui/Loader";
import { RegistrationSuccessModal } from "@/components/modals/RegistrationSuccessModal";
import { useModalStore } from "@/store/useModalStore";

// Define MapboxHTMLElement interface
interface MapboxHTMLElement extends HTMLDivElement {
  __mbMap?: mapboxgl.Map;
}

// Define the map marker component - this must be used inside MapProvider
function MapMarker() {
  const { map } = useMap();
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    console.log("marker", marker);

    // Create a custom marker element
    const el = document.createElement("div");
    el.className = "custom-marker";
    el.innerHTML = `
    <div class="flex flex-col items-center justify-center">
       <div class="rounded-sm px-1.5 shadow-lg font-normal relative z-10 border border-gray-100 bg-white">
          <span class="text-xs text-balck">
          My Office Point Here
          </span>
        </div>

        <div class="w-12 h-12 flex items-center justify-center">
     
         <svg width="24" height="42" className="w-5 h-5 bg-green-500 rounded-full opacity-75" viewBox="0 0 24 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 40C10.5 40.8284 11.1716 41.5 12 41.5C12.8284 41.5 13.5 40.8284 13.5 40H10.5ZM12 19H10.5V40H12H13.5V19H12Z" fill="#20523C"/>
          <circle cx="12" cy="12" r="12" fill="#D9D9D9"/>
          <circle cx="12" cy="12" r="12" fill="url(#paint0_radial_1203_39356)"/>
          <path d="M8.75909 4.43518C7.21808 4.9795 5.88894 5.9977 4.96218 7.34385C4.03542 8.68999 3.55861 10.295 3.60009 11.9288C3.64157 13.5626 4.19921 15.1413 5.19309 16.4387" stroke="white" stroke-width="2" stroke-linecap="round"/>
          <defs>
          <radialGradient id="paint0_radial_1203_39356" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(12.0828 27.913) rotate(-90.2085) scale(22.744 15.8023)">
          <stop stop-color="#C3F63C"/>
          <stop offset="1" stop-color="#54D10E"/>
          </radialGradient>
          </defs>
          </svg>
        </div>
      </div>
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-2 h-2 bg-[#54D10E] rotate-45"></div>
    </div>
      
    `;

    // Create the marker and add it to the map
    const newMarker = new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(map.getCenter())
      .addTo(map);

    setMarker(newMarker);

    // Update marker position when map is dragged
    const updateMarkerPosition = () => {
      if (newMarker) {
        newMarker.setLngLat(map.getCenter());
      }
    };

    map.on("move", updateMarkerPosition);

    return () => {
      map.off("move", updateMarkerPosition);
      if (newMarker) {
        newMarker.remove();
      }
    };
  }, [map]);

  return null;
}

// Component for searching and selecting locations - this must be used inside MapProvider
function LocationSearch() {
  const { map } = useMap();
  const [searchValue, setSearchValue] = useState("");
  const [suggestions, setSuggestions] = useState<LocationFeature[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationFeature | null>(null);
  const [shouldCloseDropdown, setShouldCloseDropdown] = useState(true);
  const inputRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Use a debounced search value to prevent too many API calls
  const debouncedSearchValue = useDebounce(searchValue, 200); // Reduced debounce time for better responsiveness

  // Preloaded major cities in Morocco for instant suggestions
  const preloadedMoroccoCities = [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-7.5898, 33.5731],
      },
      properties: {
        name: "Casablanca",
        mapbox_id: "place.casablanca",
        feature_type: "place",
        place_formatted: "Casablanca, Morocco",
        coordinates: {
          longitude: -7.5898,
          latitude: 33.5731,
        },
        maki: "marker",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-6.8498, 33.9716],
      },
      properties: {
        name: "Rabat",
        mapbox_id: "place.rabat",
        feature_type: "place",
        place_formatted: "Rabat, Morocco",
        coordinates: {
          longitude: -6.8498,
          latitude: 33.9716,
        },
        maki: "marker",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-8.0083, 31.6295],
      },
      properties: {
        name: "Marrakech",
        mapbox_id: "place.marrakech",
        feature_type: "place",
        place_formatted: "Marrakech, Morocco",
        coordinates: {
          longitude: -8.0083,
          latitude: 31.6295,
        },
        maki: "marker",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-5.0078, 34.0331],
      },
      properties: {
        name: "Fes",
        mapbox_id: "place.fes",
        feature_type: "place",
        place_formatted: "Fes, Morocco",
        coordinates: {
          longitude: -5.0078,
          latitude: 34.0331,
        },
        maki: "marker",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-5.8128, 35.7595],
      },
      properties: {
        name: "Tangier",
        mapbox_id: "place.tangier",
        feature_type: "place",
        place_formatted: "Tangier, Morocco",
        coordinates: {
          longitude: -5.8128,
          latitude: 35.7595,
        },
        maki: "marker",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [-9.5981, 30.4278],
      },
      properties: {
        name: "Agadir",
        mapbox_id: "place.agadir",
        feature_type: "place",
        place_formatted: "Agadir, Morocco",
        coordinates: {
          longitude: -9.5981,
          latitude: 30.4278,
        },
        maki: "marker",
      },
    },
  ] as LocationFeature[];

  // Use geolocation to get user's current location
  const getUserLocation = () => {
    if (!map) return;

    setIsLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { longitude, latitude } = position.coords;

          map.flyTo({
            center: [longitude, latitude],
            zoom: 16,
            essential: true,
            duration: 1000,
            pitch: 40,
            bearing: 0,
          });

          try {
            // Perform reverse geocoding
            const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;

            // Use Mapbox Geocoding API for reverse geocoding
            const response = await fetch(
              `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${accessToken}&language=fr,en&types=address,place,locality,neighborhood,poi`
            );

            if (!response.ok)
              throw new Error("Failed to get address for location");

            const data = await response.json();

            if (data.features && data.features.length > 0) {
              const feature = data.features[0];

              // Create a location feature from the reverse geocoding result
              const locationFeature: LocationFeature = {
                type: "Feature",
                geometry: {
                  type: "Point",
                  coordinates: [longitude, latitude],
                },
                properties: {
                  name: feature.text || "Current Location",
                  mapbox_id: feature.id || "current_location",
                  feature_type: feature.place_type?.[0] || "address",
                  place_formatted:
                    feature.place_name ||
                    `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
                  coordinates: {
                    longitude,
                    latitude,
                  },
                  context: {} as any, // Using type assertion to satisfy TypeScript
                  maki: "marker",
                },
              };

              // Update search value and selected location
              setSearchValue(feature.place_name || "Current Location");
              setSelectedLocation(locationFeature);
              setSuggestions([]);
            }
          } catch (error) {
            console.error("Error reverse geocoding:", error);
            // If reverse geocoding fails, just use coordinates
            setSearchValue(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);

            // Create a basic location feature with the coordinates
            const locationFeature: LocationFeature = {
              type: "Feature",
              geometry: {
                type: "Point",
                coordinates: [longitude, latitude],
              },
              properties: {
                name: "Current Location",
                mapbox_id: "current_location",
                feature_type: "address",
                place_formatted: `${latitude.toFixed(6)}, ${longitude.toFixed(
                  6
                )}`,
                coordinates: {
                  longitude,
                  latitude,
                },
                context: {} as any,
                maki: "marker",
              },
            };

            setSelectedLocation(locationFeature);
          } finally {
            setIsLoading(false);
            setSuggestions([]);
          }
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsLoading(false);

          // Show specific error message based on the error code
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError(
                "Location access was denied. Please enable location services in your browser settings."
              );
              break;
            case error.POSITION_UNAVAILABLE:
              setError(
                "Location information is unavailable. Please try again later."
              );
              break;
            case error.TIMEOUT:
              setError(
                "The request to get your location timed out. Please try again."
              );
              break;
            default:
              setError(
                "An unknown error occurred while getting your location."
              );
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, // Increased timeout for better reliability
          maximumAge: 0,
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      setIsLoading(false);
    }
  };

  // Function to search for locations using Mapbox's modern searchbox API
  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      // Show preloaded cities when search is empty for quick selection
      setSuggestions(preloadedMoroccoCities);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // First check if the query matches any preloaded city for instant results
      const matchingPreloadedCities = preloadedMoroccoCities.filter(
        (city) =>
          city.properties.name.toLowerCase().includes(query.toLowerCase()) ||
          (city.properties.place_formatted &&
            city.properties.place_formatted
              .toLowerCase()
              .includes(query.toLowerCase()))
      );

      if (matchingPreloadedCities.length > 0) {
        setSuggestions(matchingPreloadedCities);
        setIsLoading(false);
        return;
      }

      // Use Mapbox Search API with better proximity to Morocco
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const sessionToken = Math.random().toString(36).substring(2, 15); // Generate a session token for grouped requests

      // Use the search API with proximity set to Morocco
      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/suggest?q=${encodeURIComponent(
          query
        )}&access_token=${accessToken}&session_token=${sessionToken}&country=MA&limit=5&proximity=-7.092,31.792&language=fr,en`
      );

      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();

      if (!data.suggestions || data.suggestions.length === 0) {
        // Fallback to traditional geocoding API if no results from searchbox
        const geocodingResponse = await fetch(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
            query
          )}.json?access_token=${accessToken}&country=ma&types=address,poi,place,locality,neighborhood&proximity=-7.092,31.792&limit=5`
        );

        if (!geocodingResponse.ok)
          throw new Error("Failed to fetch suggestions");

        const geocodingData = await geocodingResponse.json();

        // Transform geocoding results to match our LocationFeature format
        const features = geocodingData.features.map((feature: any) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: feature.center,
          },
          properties: {
            name: feature.text,
            mapbox_id: feature.id,
            feature_type: feature.place_type[0],
            place_formatted: feature.place_name,
            coordinates: {
              longitude: feature.center[0],
              latitude: feature.center[1],
            },
            maki: feature.properties?.category || "marker",
          },
        }));

        setSuggestions(features);

        // If no results found
        if (features.length === 0 && isFocused) {
          setError("No locations found. Try a different search term.");
        }
      } else {
        // Process suggestions from searchbox API
        // We need to retrieve full details for each suggestion to get coordinates
        const suggestions = data.suggestions;

        // Map the suggestions to a format compatible with our app
        const features = suggestions.map((suggestion: any) => ({
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [0, 0], // Placeholder, will be filled when selected
          },
          properties: {
            name: suggestion.name,
            mapbox_id: suggestion.mapbox_id,
            feature_type: suggestion.feature_type || "place",
            place_formatted:
              suggestion.place_formatted ||
              suggestion.full_address ||
              suggestion.address ||
              "",
            coordinates: {
              longitude: 0, // Placeholder
              latitude: 0, // Placeholder
            },
            maki: suggestion.maki || "marker",
            suggestion_data: suggestion, // Store the original suggestion for retrieval
          },
        }));

        setSuggestions(features);
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      setError("Failed to search for locations. Please try again.");
      setSuggestions(preloadedMoroccoCities.slice(0, 3)); // Show some preloaded cities as fallback
    } finally {
      setIsLoading(false);
    }
  };

  // Retrieve full details for a selected suggestion
  const retrieveSuggestionDetails = async (suggestion: LocationFeature) => {
    if (!suggestion.properties.mapbox_id) return suggestion;

    // For preloaded cities, we already have all the details
    if (
      suggestion.properties.mapbox_id.startsWith("place.") &&
      suggestion.geometry.coordinates[0] !== 0 &&
      suggestion.geometry.coordinates[1] !== 0
    ) {
      return suggestion;
    }

    try {
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const sessionToken = Math.random().toString(36).substring(2, 15);

      const response = await fetch(
        `https://api.mapbox.com/search/searchbox/v1/retrieve/${suggestion.properties.mapbox_id}?access_token=${accessToken}&session_token=${sessionToken}`
      );

      if (!response.ok) return suggestion;

      const data = await response.json();

      if (data.features && data.features.length > 0) {
        const feature = data.features[0];

        // Update the suggestion with actual coordinates
        return {
          ...suggestion,
          geometry: feature.geometry,
          properties: {
            ...suggestion.properties,
            coordinates: {
              longitude: feature.geometry.coordinates[0],
              latitude: feature.geometry.coordinates[1],
            },
          },
        };
      }

      return suggestion;
    } catch (error) {
      console.error("Error retrieving location details:", error);
      return suggestion;
    }
  };

  const selectLocation = async (location: LocationFeature) => {
    if (!map) return;

    setIsLoading(true);

    try {
      // If the location needs to be retrieved (from searchbox API)
      if (
        location.geometry.coordinates[0] === 0 &&
        location.geometry.coordinates[1] === 0
      ) {
        const fullLocation = await retrieveSuggestionDetails(location);
        location = fullLocation;
      }

      const coordinates = [
        location.properties.coordinates.longitude,
        location.properties.coordinates.latitude,
      ] as [number, number];

      map.flyTo({
        center: coordinates,
        zoom: 16,
        essential: true,
        duration: 1000,
        pitch: 40, // Add some pitch for a better view
        bearing: 0,
      });

      setSearchValue(
        location.properties.place_formatted || location.properties.name
      );
      setSelectedLocation(location);
      setSuggestions([]);
      setIsFocused(false);
    } catch (error) {
      console.error("Error selecting location:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use debounce hook to delay API calls while typing
  useEffect(() => {
    if (!debouncedSearchValue.trim()) {
      // Show preloaded cities when search is empty
      setSuggestions(preloadedMoroccoCities);
      setError(null);
      return;
    }

    searchLocation(debouncedSearchValue);
  }, [debouncedSearchValue]);

  // Show preloaded cities when focused and no search value
  useEffect(() => {
    if (isFocused && !searchValue.trim()) {
      setSuggestions(preloadedMoroccoCities);
    }
  }, [isFocused, searchValue]);

  const handleInputChange = (value: string) => {
    setSearchValue(value);

    // If the user clears the input, reset everything
    if (!value.trim()) {
      setSelectedLocation(null);
      // Show preloaded cities immediately on clear
      setSuggestions(preloadedMoroccoCities);
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShouldCloseDropdown(false);
    // If we already have a search value, trigger search again
    if (searchValue.trim()) {
      searchLocation(searchValue);
    } else {
      // Show preloaded cities immediately on focus
      setSuggestions(preloadedMoroccoCities);
    }
  };

  const handleOutsideClick = (e: MouseEvent) => {
    // Don't close if clicking on the input or dropdown
    if (
      inputRef.current &&
      (inputRef.current.contains(e.target as Node) ||
        (dropdownRef.current && dropdownRef.current.contains(e.target as Node)))
    ) {
      return;
    }

    // Only close if we're not in the middle of focusing
    if (shouldCloseDropdown) {
      setIsFocused(false);
    } else {
      // Reset the flag for next time
      setShouldCloseDropdown(true);
    }
  };

  // Reset the shouldCloseDropdown flag after the dropdown is open
  useEffect(() => {
    if (isFocused) {
      const timer = setTimeout(() => {
        setShouldCloseDropdown(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isFocused]);

  const clearSearch = () => {
    setSearchValue("");
    setSuggestions(preloadedMoroccoCities);
    setSelectedLocation(null);
    setError(null);
  };

  // Add effect to handle outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Helper function to highlight matched text in suggestions with enhanced styling
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;

    try {
      const regex = new RegExp(
        `(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi"
      );
      return text.replace(
        regex,
        '<mark class="bg-gradient-to-r from-green-100 to-lime-100 text-green-800 px-1 py-0.5 rounded-sm font-medium">$1</mark>'
      );
    } catch (e) {
      return text;
    }
  };

  return (
    <div className="relative z-50 w-full max-w-[400px] mx-auto mt-8">
      <div className="flex items-center relative" ref={inputRef}>
        <FloatingLabelInput
          icon={Search}
          label="Office Location"
          value={searchValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          placeholder="Search for your office location in Morocco"
        />

        {searchValue && (
          <button
            onClick={clearSearch}
            className="absolute right-4 top-1/2 -mt-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Add a "Use my current location" button below the search bar */}
      <div className="flex justify-center mt-2">
        <button
          onClick={getUserLocation}
          className="text-xs flex items-center gap-1 text-green-600 hover:text-green-700 transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <svg
              className="animate-spin h-3 w-3 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <MapPin className="h-3 w-3" />
          )}
          <span>
            {isLoading ? "Getting location..." : "Use my current location"}
          </span>
        </button>
      </div>

      <AnimatePresence>
        {isFocused && (isLoading || error || suggestions.length > 0) && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }} // Faster animation
            className="absolute w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-60 overflow-y-auto"
          >
            {isLoading ? (
              <div className="p-3 text-center text-gray-500">
                <div className="flex items-center justify-center space-x-2">
                  <svg
                    className="animate-spin h-4 w-4 text-[#4AAF57]"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Searching locations in Morocco...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-3 text-center text-red-500 text-sm">
                {error}
              </div>
            ) : suggestions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {suggestions.map((suggestion) => (
                  <motion.div
                    key={suggestion.properties.mapbox_id}
                    className="p-3 hover:bg-gray-50 cursor-pointer"
                    onClick={() => selectLocation(suggestion)}
                    whileHover={{
                      backgroundColor: "rgba(74, 175, 87, 0.1)",
                      scale: 1.01,
                      transition: { duration: 0.1 },
                    }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5 bg-gradient-to-r from-green-50 to-lime-50 p-1.5 rounded-full flex-shrink-0 border border-green-100">
                        <MapPin className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <div
                          className="font-medium text-green-900"
                          dangerouslySetInnerHTML={{
                            __html: highlightMatch(
                              suggestion.properties.name,
                              searchValue
                            ),
                          }}
                        />
                        {suggestion.properties.place_formatted && (
                          <div
                            className="text-sm text-gray-500 truncate max-w-[90%]"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(
                                suggestion.properties.place_formatted,
                                searchValue
                              ),
                            }}
                          />
                        )}
                        <div className="text-xs text-gray-400 mt-1 flex items-center">
                          {suggestion.properties.feature_type === "address" ? (
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                              Address
                            </span>
                          ) : suggestion.properties.feature_type === "poi" ? (
                            <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                              Point of Interest
                            </span>
                          ) : suggestion.properties.feature_type === "place" ? (
                            <span className="bg-green-50 text-green-600 px-2 py-0.5 rounded-full text-xs">
                              City
                            </span>
                          ) : (
                            <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                              {suggestion.properties.feature_type}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <MapPin className="h-8 w-8 text-gray-300" />
                  <div>
                    <p className="text-sm font-medium">
                      Search for your office location
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Type an address, neighborhood, city, or point of interest
                      in Morocco
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedLocation && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 bg-gradient-to-r from-green-50 to-lime-50 border border-green-100 rounded-md shadow-sm"
        >
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-green-800">
                {selectedLocation.properties.name}
              </div>
              <div className="text-sm text-green-700">
                {selectedLocation.properties.place_formatted}
              </div>
              <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-500"></span>
                {selectedLocation.properties.coordinates.latitude.toFixed(6)},{" "}
                {selectedLocation.properties.coordinates.longitude.toFixed(6)}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

// Add a debounce hook if not already present in the codebase
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Main map-related components wrapper that puts everything in a single MapProvider
function MapSection({
  onLocationSelected,
}: {
  onLocationSelected?: () => void;
}) {
  const mapContainerRef = useRef<MapboxHTMLElement | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  // Handle map focused on Morocco after it loads
  const handleMapInstance = (mapInstance: mapboxgl.Map | null) => {
    if (mapInstance) {
      // Enhance map with Morocco focus and modern styling
      mapInstance.once("load", () => {
        mapInstance.flyTo({
          center: [-7.092, 31.792],
          zoom: 5.5,
          essential: true,
          duration: 2000,
          pitch: 20, // Add slight tilt for modern 3D effect
          bearing: -10,
        });

        // Add terrain if available
        if (mapInstance.getStyle().layers) {
          mapInstance.setFog({
            color: "rgb(220, 230, 240)", // Light blue-ish fog
            "high-color": "rgb(245, 250, 255)", // Light color at upper atmosphere
            "horizon-blend": 0.1, // Lower atmosphere haze
            "space-color": "rgb(220, 230, 240)", // Dark blue/purple upper atmosphere
            "star-intensity": 0.2, // Dim stars
          });
        }
      });
    }
  };

  return (
    <div className="space-y-4">
      <MapProvider
        mapContainerRef={mapContainerRef}
        initialViewState={{
          longitude: -7.092,
          latitude: 31.792,
          zoom: 5.5,
        }}
        onLoad={() => {
          handleMapLoad();
          // Get the map instance from the container ref
          if (mapContainerRef.current?.__mbMap) {
            handleMapInstance(mapContainerRef.current.__mbMap);
          }
        }}
      >
        <MapContent
          isMapLoaded={isMapLoaded}
          mapContainerRef={mapContainerRef}
        />
      </MapProvider>
    </div>
  );
}

// Separate component to use map context safely inside MapProvider
function MapContent({
  isMapLoaded,
  mapContainerRef,
}: {
  isMapLoaded: boolean;
  mapContainerRef: React.RefObject<MapboxHTMLElement | null>;
}) {
  const { map } = useMap();

  const zoomIn = () => {
    map?.zoomIn();
  };

  const zoomOut = () => {
    map?.zoomOut();
  };

  return (
    <>
      {/* Map container */}
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-md border bg-gradient-to-b from-sky-50 to-white">
        <div
          ref={mapContainerRef}
          className="absolute inset-0 w-full h-full transition-all duration-500 hover:shadow-lg"
        />

        {isMapLoaded && <MapMarker />}

        {/* Zoom controls - properly inside MapProvider context */}
        {isMapLoaded && (
          <div className="absolute top-4 right-4 bg-white p-1.5 rounded-lg shadow-lg flex flex-col z-10">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-sm w-6 h-6"
              onClick={zoomIn}
            >
              <PlusIcon className="w-5 h-5" />
              <span className="sr-only">Zoom in</span>
            </Button>
            <div className="w-5 h-px bg-gray-200 mx-auto my-1.5"></div>
            <Button
              variant="ghost"
              size="sm"
              className="rounded-sm w-6 h-6"
              onClick={zoomOut}
            >
              <MinusIcon className="w-5 h-5" />
              <span className="sr-only">Zoom out</span>
            </Button>
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-lg border border-gray-100">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                Set Your Office Location
              </h3>
              <p className="text-xs text-gray-700">
                Place the pin at your exact office location. You can drag the
                map to position the marker precisely where your office is
                located in Morocco.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Location search below the map but in the same context */}
      {isMapLoaded && <LocationSearch />}
    </>
  );
}

// The page component
export default function SetLocationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get modal control functions from zustand store
  const {
    openRegistrationSuccess,
    isRegistrationSuccessOpen,
    closeRegistrationSuccess,
  } = useModalStore();

  const handleConfirmLocation = async () => {
    setIsSubmitting(true);
    setConfirmError(null);
    setIsLoading(true);

    try {
      // Here you would typically save the location data
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Open the success modal
      openRegistrationSuccess();
    } catch (error) {
      console.error("Error saving location:", error);
      setConfirmError("Failed to save location. Please try again.");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="min-h-screen flex flex-col"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <AuthNavbar activeStep={3} />

        <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-4 py-8">
          <motion.div
            className="w-full space-y-6"
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="text-center space-y-2">
              <h1 className="text-3xl text-[#212223] font-bold">
                Set Your Office Location
              </h1>
              <p className="text-[#585858]">
                Provide your office's location details to complete your profile.
              </p>
            </div>

            {/* Map with search below it */}
            <MapSection />

            <div className="flex flex-col items-center justify-center max-w-[400px] mx-auto gap-3">
              {confirmError && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md"
                >
                  {confirmError}
                </motion.div>
              )}

              <Button
                type="button"
                variant="gradient"
                className="w-full py-5 !mt-0"
                onClick={handleConfirmLocation}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <Loader size="sm" className="mr-2" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Confirm Location</span>
                    <Check className="h-5 w-5" />
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Full-screen loader */}
      {isLoading && <Loader isFullScreen size="lg" />}

      {/* Registration success modal */}
      <RegistrationSuccessModal
        isOpen={isRegistrationSuccessOpen}
        onClose={closeRegistrationSuccess}
      />
    </>
  );
}
