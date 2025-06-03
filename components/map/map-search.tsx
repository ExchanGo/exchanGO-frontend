"use client";

import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import {
  Loader2,
  MapPin,
  X,
  Building,
  MapIcon,
  Home,
  Navigation,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import mapboxgl from "mapbox-gl";

import { useMap } from "@/context/map-context";
import { cn } from "@/lib/utils";
import {
  iconMap,
  LocationFeature,
  LocationSuggestion,
} from "@/lib/mapbox/utils";
import useDebounce from "@/lib/hooks/useDebounce";
import { LocationMarker } from "./location-marker";
import { LocationPopup } from "./location-popup";
import { AnimatePresence, motion } from "framer-motion";
import { useMapStore } from "@/store/map";
import { useSearchResults } from "@/lib/hooks/useSearchResults";

export default function MapSearch() {
  const { map } = useMap();
  const isMapMaximized = useMapStore((state) => state.isMapMaximized);
  const { searchResults, searchParams, isLoading } = useSearchResults();
  const [query, setQuery] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [results, setResults] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationFeature | null>(null);
  const [exchangeOfficeMarkers, setExchangeOfficeMarkers] = useState<
    LocationFeature[]
  >([]);
  const [recentSearches, setRecentSearches] = useState<LocationSuggestion[]>(
    []
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("recentMapSearches");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setRecentSearches(parsed.slice(0, 5));
        }
      }
    } catch (e) {
      console.error("Failed to load recent searches", e);
    }
  }, []);

  // Convert API exchange office data to LocationFeature format and display markers
  useEffect(() => {
    console.log("🗺️ MapSearch: Processing exchange office data...");
    console.log("Search Results:", searchResults);
    console.log("Map instance:", map);

    if (!map) {
      console.log("❌ Map not ready yet");
      return;
    }

    if (!searchResults?.offices || searchResults.offices.length === 0) {
      console.log("❌ No exchange offices found in search results");
      setExchangeOfficeMarkers([]);
      return;
    }

    console.log(
      `✅ Processing ${searchResults.offices.length} exchange offices`
    );

    // Convert API data to LocationFeature format
    const markers: LocationFeature[] = searchResults.offices.map((office) => {
      const [longitude, latitude] = office.location.coordinates;

      console.log(`📍 Creating marker for: ${office.officeName}`);
      console.log(`   Coordinates: [${longitude}, ${latitude}]`);
      console.log(`   Address: ${office.address}, ${office.city.name}`);

      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        properties: {
          name: office.officeName,
          mapbox_id: `exchange-${office.id}`,
          feature_type: "poi",
          place_formatted: `${office.address}, ${office.city.name}`,
          coordinates: {
            longitude: longitude,
            latitude: latitude,
          },
          context: {
            place: { name: office.city.name },
            country: {
              name: office.country.name,
              country_code: office.country.alpha2,
              country_code_alpha_3: office.country.alpha3,
            },
          },
          maki: "bank",
          // Store additional exchange office data
          metadata: {
            officeId: office.id,
            phone: office.primaryPhoneNumber,
            whatsapp: office.whatsappNumber,
            distance: office.distanceInKm,
            isVerified: office.isVerified,
            isFeatured: office.isFeatured,
            rates: office.rates,
            slug: office.slug,
            logo: office.logo,
          },
        },
      };
    });

    setExchangeOfficeMarkers(markers);
    console.log(`🎯 Created ${markers.length} exchange office markers`);

    // Center map to show all exchange offices
    if (markers.length > 0) {
      const coordinates = markers.map((marker) => marker.geometry.coordinates);

      if (coordinates.length === 1) {
        // Single office - center on it
        const [lng, lat] = coordinates[0];
        console.log(`🎯 Centering on single office: [${lng}, ${lat}]`);
        map.flyTo({
          center: [lng, lat],
          zoom: 14,
          duration: 2000,
        });
      } else {
        // Multiple offices - fit bounds to show all
        console.log(`🎯 Fitting bounds for ${coordinates.length} offices`);

        // Calculate bounds
        let minLng = coordinates[0][0];
        let maxLng = coordinates[0][0];
        let minLat = coordinates[0][1];
        let maxLat = coordinates[0][1];

        coordinates.forEach(([lng, lat]) => {
          minLng = Math.min(minLng, lng);
          maxLng = Math.max(maxLng, lng);
          minLat = Math.min(minLat, lat);
          maxLat = Math.max(maxLat, lat);
        });

        const bounds = new mapboxgl.LngLatBounds(
          [minLng, minLat],
          [maxLng, maxLat]
        );

        map.fitBounds(bounds, {
          padding: 100,
          duration: 2000,
          maxZoom: 12,
        });
      }
    }
  }, [map, searchResults]);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback(
    (suggestion: LocationSuggestion) => {
      try {
        const updated = [
          suggestion,
          ...recentSearches.filter((s) => s.mapbox_id !== suggestion.mapbox_id),
        ].slice(0, 5);

        setRecentSearches(updated);
        localStorage.setItem("recentMapSearches", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recent search", e);
      }
    },
    [recentSearches]
  );

  // Handle search functionality (only for location search, not exchange offices)
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const searchLocations = async () => {
      setIsSearching(true);
      setIsOpen(true);
      setErrorMessage(null);

      try {
        // Only search for locations, not exchange offices
        const mockMoroccoLocations = [
          {
            mapbox_id: "place.rabat",
            name: "Rabat",
            feature_type: "place",
            place_formatted: "Rabat, Morocco",
          },
          {
            mapbox_id: "place.casablanca",
            name: "Casablanca",
            feature_type: "place",
            place_formatted: "Casablanca, Morocco",
          },
          {
            mapbox_id: "place.marrakech",
            name: "Marrakech",
            feature_type: "place",
            place_formatted: "Marrakech, Morocco",
          },
          {
            mapbox_id: "place.fez",
            name: "Fez",
            feature_type: "place",
            place_formatted: "Fez, Morocco",
          },
          {
            mapbox_id: "place.tangier",
            name: "Tangier",
            feature_type: "place",
            place_formatted: "Tangier, Morocco",
          },
          {
            mapbox_id: "place.agadir",
            name: "Agadir",
            feature_type: "place",
            place_formatted: "Agadir, Morocco",
          },
        ];

        await new Promise((resolve) => setTimeout(resolve, 100));

        const query = debouncedQuery.toLowerCase();
        const matchingLocations = mockMoroccoLocations.filter(
          (location) =>
            location.name.toLowerCase().includes(query) ||
            location.place_formatted.toLowerCase().includes(query)
        );

        if (matchingLocations.length === 0) {
          setErrorMessage("No locations found. Try a different search term.");
          setResults([]);
        } else {
          setResults(matchingLocations);
        }
      } catch (err) {
        console.error("Search error:", err);
        setErrorMessage("Search failed. Please try again.");
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    searchLocations();
  }, [debouncedQuery]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value);
    setDisplayValue(value);
    setIsOpen(true);
    setErrorMessage(null);
  };

  // Handle input focus
  const handleInputFocus = () => {
    setIsOpen(true);
  };

  // Helper function to highlight matched text
  const highlightMatch = (text: string, query: string) => {
    if (!query.trim() || !text) return text;

    try {
      const regex = new RegExp(
        `(${query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`,
        "gi"
      );
      return text.replace(
        regex,
        '<mark class="bg-primary/20 text-primary-foreground px-0.5 rounded">$1</mark>'
      );
    } catch (e) {
      return text;
    }
  };

  // Get appropriate icon for location type
  const getLocationIcon = (location: LocationSuggestion) => {
    if (location.maki && iconMap[location.maki]) {
      return iconMap[location.maki];
    }

    if (location.feature_type === "address") {
      return <Home className="h-4 w-4 text-primary" />;
    } else if (location.feature_type === "poi") {
      return <MapPin className="h-4 w-4 text-primary" />;
    } else if (
      ["place", "locality", "neighborhood"].includes(
        location.feature_type || ""
      )
    ) {
      return <Building className="h-4 w-4 text-primary" />;
    }

    return <MapPin className="h-4 w-4 text-primary" />;
  };

  // Handle location selection (for search functionality)
  const handleSelect = async (suggestion: LocationSuggestion) => {
    try {
      setIsSearching(true);

      const mockCoordinates: Record<string, [number, number]> = {
        "place.rabat": [-6.8498, 33.9716],
        "place.casablanca": [-7.5898, 33.5731],
        "place.marrakech": [-8.0083, 31.6295],
        "place.fez": [-5.0078, 34.0331],
        "place.tangier": [-5.8128, 35.7595],
        "place.agadir": [-9.5981, 30.4278],
      };

      const coordinates = mockCoordinates[suggestion.mapbox_id] || [
        -7.092, 31.792,
      ];

      const featureData: LocationFeature = {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: coordinates,
        },
        properties: {
          name: suggestion.name,
          mapbox_id: suggestion.mapbox_id,
          feature_type: suggestion.feature_type || "poi",
          place_formatted: suggestion.place_formatted,
          coordinates: {
            longitude: coordinates[0],
            latitude: coordinates[1],
          },
          context: {},
          maki: suggestion.maki || "marker",
        },
      };

      if (map) {
        map.flyTo({
          center: coordinates,
          zoom: 12,
          duration: 1500,
        });

        setDisplayValue(suggestion.name);
        saveRecentSearch(suggestion);
        setSelectedLocation(featureData);
        setResults([]);
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Location selection error:", err);
      setErrorMessage("Failed to get location details");
    } finally {
      setIsSearching(false);
    }
  };

  // Clear search
  const clearSearch = () => {
    setQuery("");
    setDisplayValue("");
    setResults([]);
    setErrorMessage(null);
    setIsOpen(true);
    setSelectedLocation(null);
  };

  // Check if location is selected
  const isLocationSelected = (location: LocationFeature) => {
    if (!selectedLocation) return false;
    return (
      location.properties.mapbox_id === selectedLocation.properties.mapbox_id
    );
  };

  // Early return if map is not maximized - still show markers
  if (!isMapMaximized) {
    return (
      <>
        {/* Render exchange office markers */}
        {exchangeOfficeMarkers.map((marker) => (
          <LocationMarker
            key={marker.properties.mapbox_id}
            location={marker}
            onHover={(data) => setSelectedLocation(data)}
            isSelected={isLocationSelected(marker)}
          />
        ))}

        {/* Render search location marker if exists */}
        {selectedLocation && (
          <LocationMarker
            key={selectedLocation.properties.mapbox_id}
            location={selectedLocation}
            onHover={(data) => setSelectedLocation(data)}
            isSelected={true}
          />
        )}

        <AnimatePresence>
          {selectedLocation && (
            <LocationPopup
              location={selectedLocation}
              onClose={() => setSelectedLocation(null)}
            />
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <section className="absolute top-4 left-1/2 sm:left-4 z-10 w-[90vw] sm:w-[350px] -translate-x-1/2 sm:translate-x-0">
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-lg shadow-lg overflow-hidden"
        >
          <Command className="rounded-lg border border-gray-200">
            <div
              className={cn(
                "w-full flex items-center justify-between px-3 gap-1 bg-white"
              )}
            >
              <CommandInput
                placeholder="Search locations..."
                value={displayValue}
                onValueChange={handleInputChange}
                onFocus={handleInputFocus}
                className="flex-1 w-full font-dm"
              />
              {displayValue && !isSearching && (
                <X
                  className="size-4 shrink-0 text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
                  onClick={clearSearch}
                />
              )}
              {isSearching && (
                <Loader2 className="size-4 shrink-0 text-primary animate-spin" />
              )}
            </div>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CommandList className="max-h-60 overflow-y-auto bg-white">
                    {isSearching ? (
                      <div className="py-6 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Loader2 className="h-8 w-8 text-primary animate-spin" />
                          <p className="text-sm text-muted-foreground font-dm">
                            Searching...
                          </p>
                        </div>
                      </div>
                    ) : errorMessage ? (
                      <CommandEmpty className="py-6 text-center">
                        <div className="flex flex-col items-center justify-center space-y-1">
                          <p className="text-sm font-medium text-foreground font-dm">
                            {errorMessage}
                          </p>
                          <p className="text-xs text-muted-foreground font-dm">
                            Try a different search term or be more specific
                          </p>
                        </div>
                      </CommandEmpty>
                    ) : results.length > 0 ? (
                      <CommandGroup heading="Search Results">
                        {results.map((location) => (
                          <CommandItem
                            key={location.mapbox_id}
                            onSelect={() => handleSelect(location)}
                            value={`${location.name} ${location.place_formatted} ${location.mapbox_id}`}
                            className="flex items-center py-3 px-2 cursor-pointer hover:bg-accent rounded-md transition-colors"
                          >
                            <div className="flex items-center space-x-2 w-full">
                              <div className="bg-primary/10 p-1.5 rounded-full">
                                {getLocationIcon(location)}
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span
                                  className="text-sm font-medium truncate max-w-full font-dm"
                                  dangerouslySetInnerHTML={{
                                    __html: highlightMatch(
                                      location.name,
                                      query
                                    ),
                                  }}
                                />
                                {location.place_formatted && (
                                  <span
                                    className="text-xs text-muted-foreground truncate max-w-full font-dm"
                                    dangerouslySetInnerHTML={{
                                      __html: highlightMatch(
                                        location.place_formatted,
                                        query
                                      ),
                                    }}
                                  />
                                )}
                                <span className="text-xs text-muted-foreground/70 mt-0.5 font-dm">
                                  {location.feature_type === "address"
                                    ? "Address"
                                    : location.feature_type === "poi"
                                    ? "Point of Interest"
                                    : location.feature_type}
                                </span>
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : !query.trim() && recentSearches.length > 0 ? (
                      <CommandGroup heading="Recent Searches">
                        {recentSearches.map((location) => (
                          <CommandItem
                            key={location.mapbox_id}
                            onSelect={() => handleSelect(location)}
                            value={`${location.name} ${
                              location.place_formatted || ""
                            }`}
                            className="flex items-center py-3 px-2 cursor-pointer hover:bg-accent rounded-md transition-colors"
                          >
                            <div className="flex items-center space-x-2 w-full">
                              <div className="bg-gray-100 p-1.5 rounded-full">
                                <Navigation className="h-4 w-4 text-gray-500" />
                              </div>
                              <div className="flex flex-col flex-1 min-w-0">
                                <span className="text-sm font-medium truncate max-w-full font-dm">
                                  {location.name}
                                </span>
                                {location.place_formatted && (
                                  <span className="text-xs text-muted-foreground truncate max-w-full font-dm">
                                    {location.place_formatted}
                                  </span>
                                )}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <div className="py-6 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <MapIcon className="h-8 w-8 text-muted-foreground/50" />
                          <div>
                            <p className="text-sm font-medium text-foreground font-dm">
                              Search for a location
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 font-dm">
                              Enter an address, landmark, or area
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CommandList>
                </motion.div>
              )}
            </AnimatePresence>
          </Command>
        </motion.div>
      </section>

      {/* Render exchange office markers */}
      {exchangeOfficeMarkers.map((marker) => (
        <LocationMarker
          key={marker.properties.mapbox_id}
          location={marker}
          onHover={(data) => setSelectedLocation(data)}
          isSelected={isLocationSelected(marker)}
        />
      ))}

      {/* Render search location marker if exists */}
      {selectedLocation &&
        !selectedLocation.properties.mapbox_id.startsWith("exchange-") && (
          <LocationMarker
            key={selectedLocation.properties.mapbox_id}
            location={selectedLocation}
            onHover={(data) => setSelectedLocation(data)}
            isSelected={true}
          />
        )}

      {/* Location popup */}
      <AnimatePresence>
        {selectedLocation && (
          <LocationPopup
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
