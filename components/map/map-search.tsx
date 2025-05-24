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
  Search,
  Building,
  MapIcon,
  Home,
  Navigation,
} from "lucide-react";
import { useState, useEffect, useCallback } from "react";

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

export default function MapSearch() {
  const { map } = useMap();
  const [query, setQuery] = useState("");
  const [displayValue, setDisplayValue] = useState("");
  const [results, setResults] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<LocationFeature | null>(null);
  const [selectedLocations, setSelectedLocations] = useState<LocationFeature[]>(
    []
  );
  const [recentSearches, setRecentSearches] = useState<LocationSuggestion[]>(
    []
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const debouncedQuery = useDebounce(query, 300);

  // Pre-cached mock data for exchange offices in Morocco
  const mockExchangeOffices = [
    {
      mapbox_id: "exchange.atlas",
      name: "Atlas Exchange",
      feature_type: "poi",
      place_formatted: "4140 Parker Rd. Allentown, Morocco",
      maki: "bank",
      coordinates: [-7.5898, 33.5731], // Casablanca
    },
    {
      mapbox_id: "exchange.dirhamx",
      name: "DirhamX",
      feature_type: "poi",
      place_formatted: "2118 Thornridge Cir. Rabat, Morocco",
      maki: "bank",
      coordinates: [-6.8498, 33.9716], // Rabat
    },
    {
      mapbox_id: "exchange.sahara",
      name: "Sahara Exchange",
      feature_type: "poi",
      place_formatted: "2118 Thornridge Cir. Marrakech, Morocco",
      maki: "bank",
      coordinates: [-8.0083, 31.6295], // Marrakech
    },
    {
      mapbox_id: "exchange.golden",
      name: "Golden Dirham",
      feature_type: "poi",
      place_formatted: "2118 Thornridge Cir. Tangier, Morocco",
      maki: "bank",
      coordinates: [-5.8128, 35.7595], // Tangier
    },
    {
      mapbox_id: "exchange.oasis",
      name: "Oasis Currency",
      feature_type: "poi",
      place_formatted: "4140 Parker Rd. Fez, Morocco",
      maki: "bank",
      coordinates: [-5.0078, 34.0331], // Fez
    },
    {
      mapbox_id: "exchange.casablanca",
      name: "Casablanca Forex",
      feature_type: "poi",
      place_formatted: "3517 W. Gray St. Casablanca, Morocco",
      maki: "bank",
      coordinates: [-7.6192, 33.5992], // Casablanca
    },
  ];

  // Pre-cached locations in Morocco
  const mockMoroccoLocations = [
    {
      mapbox_id: "place.rabat",
      name: "Rabat",
      feature_type: "place",
      place_formatted: "Rabat, Morocco",
      coordinates: [-6.8498, 33.9716],
    },
    {
      mapbox_id: "place.casablanca",
      name: "Casablanca",
      feature_type: "place",
      place_formatted: "Casablanca, Morocco",
      coordinates: [-7.5898, 33.5731],
    },
    {
      mapbox_id: "place.marrakech",
      name: "Marrakech",
      feature_type: "place",
      place_formatted: "Marrakech, Morocco",
      coordinates: [-8.0083, 31.6295],
    },
    {
      mapbox_id: "place.fez",
      name: "Fez",
      feature_type: "place",
      place_formatted: "Fez, Morocco",
      coordinates: [-5.0078, 34.0331],
    },
    {
      mapbox_id: "place.tangier",
      name: "Tangier",
      feature_type: "place",
      place_formatted: "Tangier, Morocco",
      coordinates: [-5.8128, 35.7595],
    },
    {
      mapbox_id: "place.agadir",
      name: "Agadir",
      feature_type: "place",
      place_formatted: "Agadir, Morocco",
      coordinates: [-9.5981, 30.4278],
    },
  ];

  // Load recent searches from localStorage and preload exchange offices on mount
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

  // Preload exchange office markers when map is ready
  useEffect(() => {
    if (!map) return;

    // Small delay to let map initialize first
    const timer = setTimeout(() => {
      // Create features for each exchange office
      const exchangeFeatures: LocationFeature[] = [
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [-7.5898, 33.5731], // Atlas Exchange in Casablanca
          },
          properties: {
            name: "Atlas Exchange",
            mapbox_id: "exchange.atlas",
            feature_type: "poi",
            place_formatted: "4140 Parker Rd. Allentown, Morocco",
            coordinates: {
              longitude: -7.5898,
              latitude: 33.5731,
            },
            context: {} as any,
            maki: "bank",
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [-6.8498, 33.9716], // DirhamX in Rabat
          },
          properties: {
            name: "DirhamX",
            mapbox_id: "exchange.dirhamx",
            feature_type: "poi",
            place_formatted: "2118 Thornridge Cir. Rabat, Morocco",
            coordinates: {
              longitude: -6.8498,
              latitude: 33.9716,
            },
            context: {} as any,
            maki: "bank",
          },
        },
        {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [-8.0083, 31.6295], // Sahara Exchange in Marrakech
          },
          properties: {
            name: "Sahara Exchange",
            mapbox_id: "exchange.sahara",
            feature_type: "poi",
            place_formatted: "2118 Thornridge Cir. Marrakech, Morocco",
            coordinates: {
              longitude: -8.0083,
              latitude: 31.6295,
            },
            context: {} as any,
            maki: "bank",
          },
        },
      ];

      // Add exchange offices to the map
      setSelectedLocations(exchangeFeatures);
    }, 1500);

    return () => clearTimeout(timer);
  }, [map]);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback(
    (suggestion: LocationSuggestion) => {
      try {
        // Add to front of array, remove duplicates, limit to 5
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

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      // Don't close immediately to allow showing recent searches
      return;
    }

    const searchLocations = async () => {
      setIsSearching(true);
      setIsOpen(true);
      setErrorMessage(null);

      try {
        // Mock data for exchange offices in Morocco
        const mockExchangeOffices = [
          {
            mapbox_id: "exchange.atlas",
            name: "Atlas Exchange",
            feature_type: "poi",
            place_formatted: "4140 Parker Rd. Allentown, Morocco",
            maki: "bank",
          },
          {
            mapbox_id: "exchange.dirhamx",
            name: "DirhamX",
            feature_type: "poi",
            place_formatted: "2118 Thornridge Cir. Rabat, Morocco",
            maki: "bank",
          },
          {
            mapbox_id: "exchange.sahara",
            name: "Sahara Exchange",
            feature_type: "poi",
            place_formatted: "2118 Thornridge Cir. Marrakech, Morocco",
            maki: "bank",
          },
          {
            mapbox_id: "exchange.golden",
            name: "Golden Dirham",
            feature_type: "poi",
            place_formatted: "2118 Thornridge Cir. Tangier, Morocco",
            maki: "bank",
          },
          {
            mapbox_id: "exchange.oasis",
            name: "Oasis Currency",
            feature_type: "poi",
            place_formatted: "4140 Parker Rd. Fez, Morocco",
            maki: "bank",
          },
          {
            mapbox_id: "exchange.casablanca",
            name: "Casablanca Forex",
            feature_type: "poi",
            place_formatted: "3517 W. Gray St. Casablanca, Morocco",
            maki: "bank",
          },
        ];

        // Mock locations in Morocco
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

        // Simulate network delay but much faster than real API
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Search using the mock data
        const query = debouncedQuery.toLowerCase();
        const matchingExchanges = mockExchangeOffices.filter(
          (office) =>
            office.name.toLowerCase().includes(query) ||
            office.place_formatted.toLowerCase().includes(query)
        );

        const matchingLocations = mockMoroccoLocations.filter(
          (location) =>
            location.name.toLowerCase().includes(query) ||
            location.place_formatted.toLowerCase().includes(query)
        );

        // Combine results, prioritizing exchanges
        const combinedResults = [...matchingExchanges, ...matchingLocations];

        if (combinedResults.length === 0) {
          setErrorMessage("No locations found. Try a different search term.");
          setResults([]);
        } else {
          setResults(combinedResults);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
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

    // Use different icons based on feature type
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

    // Default
    return <MapPin className="h-4 w-4 text-primary" />;
  };

  // Handle location selection
  const handleSelect = async (suggestion: LocationSuggestion) => {
    try {
      setIsSearching(true);

      // Map of mock coordinates for each location
      const mockCoordinates: Record<string, [number, number]> = {
        "exchange.atlas": [-7.5898, 33.5731], // Casablanca
        "exchange.dirhamx": [-6.8498, 33.9716], // Rabat
        "exchange.sahara": [-8.0083, 31.6295], // Marrakech
        "exchange.golden": [-5.8128, 35.7595], // Tangier
        "exchange.oasis": [-5.0078, 34.0331], // Fez
        "exchange.casablanca": [-7.6192, 33.5992], // Casablanca
        "place.rabat": [-6.8498, 33.9716],
        "place.casablanca": [-7.5898, 33.5731],
        "place.marrakech": [-8.0083, 31.6295],
        "place.fez": [-5.0078, 34.0331],
        "place.tangier": [-5.8128, 35.7595],
        "place.agadir": [-9.5981, 30.4278],
      };

      // Create a feature from mock data
      const coordinates = mockCoordinates[suggestion.mapbox_id] || [
        -7.092, 31.792,
      ]; // Default to center of Morocco

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
          context: {} as any,
          maki: suggestion.maki || "marker",
        },
      };

      if (map) {
        // Fly to location with enhanced animation
        map.flyTo({
          center: coordinates,
          zoom: 14,
          speed: 2,
          curve: 1.2,
          duration: 1500,
          essential: true,
          pitch: 40,
          bearing: 0,
        });

        // Animate in with a slight pitch change
        setTimeout(() => {
          map.easeTo({
            pitch: 30,
            duration: 800,
            essential: true,
          });
        }, 1500);

        setDisplayValue(suggestion.name);
        saveRecentSearch(suggestion); // Add to recent searches

        setSelectedLocations([featureData]);
        setSelectedLocation(featureData);

        setResults([]);
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Retrieve error:", err);
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
    setIsOpen(true); // Keep open to show recent searches
    setSelectedLocation(null);
    setSelectedLocations([]);
  };

  // Check if location is selected
  const isLocationSelected = (location: LocationFeature) => {
    if (!selectedLocation) return false;
    return (
      location.properties.mapbox_id === selectedLocation.properties.mapbox_id
    );
  };

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
              {/* <Search className="h-4 w-4 text-muted-foreground shrink-0 mr-1" /> */}
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

      {/* Active location markers */}
      {selectedLocations.map((location) => (
        <LocationMarker
          key={location.properties.mapbox_id}
          location={location}
          onHover={(data) => setSelectedLocation(data)}
          isSelected={isLocationSelected(location)}
        />
      ))}

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
