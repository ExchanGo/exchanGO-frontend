"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  CheckCircle2,
  XCircle,
  Search,
  LocateFixed,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useDebounce from "@/lib/hooks/useDebounce";
import { cn } from "@/lib/utils";
import {
  mapboxLocationService,
  MapboxLocationResult,
} from "@/lib/services/mapboxService";
import { moroccoCities } from "@/lib/data/moroccoCities";

export interface LocationOption {
  value: string;
  label: string;
  latitude?: number;
  longitude?: number;
  region?: string;
}

interface FloatingLocationAutoCompleteProps {
  defaultValue?: string;
  onLocationChange?: (value: string, location?: MapboxLocationResult) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

export function FloatingLocationAutoComplete({
  defaultValue = "",
  onLocationChange,
  placeholder = "Search for a location in Morocco...",
  label = "Location",
  className,
  error,
  required = false,
}: FloatingLocationAutoCompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);
  const [selectedLocation, setSelectedLocation] =
    useState<MapboxLocationResult | null>(null);
  const [searchResults, setSearchResults] = useState<MapboxLocationResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Initialize with default location
  useEffect(() => {
    if (defaultValue) {
      const defaultCity = moroccoCities.find(
        (city) => city.value === defaultValue
      );
      if (defaultCity) {
        setSelectedValue(defaultValue);
        setSelectedLocation({
          id: defaultCity.value,
          name: defaultCity.label,
          place_formatted: `${defaultCity.label}, Morocco`,
          latitude: defaultCity.latitude,
          longitude: defaultCity.longitude,
          region: defaultCity.region,
          feature_type: "place",
          maki: "marker",
        });
      }
    }
  }, [defaultValue]);

  // Search for locations when query changes
  useEffect(() => {
    const searchLocations = async () => {
      if (!debouncedSearchQuery.trim()) {
        // Show popular cities when no search query
        const popularCities = moroccoCities.slice(0, 8);
        setSearchResults(
          popularCities.map((city) => ({
            id: city.value,
            name: city.label,
            place_formatted: `${city.label}, Morocco`,
            latitude: city.latitude,
            longitude: city.longitude,
            region: city.region,
            feature_type: "place",
            maki: "marker",
          }))
        );
        setSearchError(null);
        return;
      }

      setIsLoading(true);
      setSearchError(null);

      try {
        const results = await mapboxLocationService.searchLocations(
          debouncedSearchQuery
        );
        setSearchResults(results);

        if (results.length === 0) {
          setSearchError("No locations found. Try a different search term.");
        }
      } catch (err) {
        console.error("Location search error:", err);
        setSearchError("Search failed. Please try again.");
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    searchLocations();
  }, [debouncedSearchQuery]);

  // Format display value
  const getDisplayValue = () => {
    if (!selectedLocation) return "";
    return selectedLocation.place_formatted;
  };

  // Handle selection change
  const handleSelect = (location: MapboxLocationResult) => {
    setSelectedValue(location.id);
    setSelectedLocation(location);
    setSearchQuery("");
    setIsOpen(false);
    setIsFocused(false);
    onLocationChange?.(location.id, location);
  };

  // Handle current location
  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setSearchError("Geolocation is not supported by this browser.");
      return;
    }

    setIsLoading(true);
    setSearchError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const location = await mapboxLocationService.reverseGeocode(
            latitude,
            longitude
          );

          if (location) {
            handleSelect(location);
          } else {
            setSearchError("Could not determine your location.");
          }
        } catch (err) {
          console.error("Reverse geocoding error:", err);
          setSearchError("Failed to get your location.");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setSearchError("Failed to access your location.");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus the input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Show initial results when opening
  useEffect(() => {
    if (isOpen && searchResults.length === 0 && !searchQuery.trim()) {
      const popularCities = moroccoCities.slice(0, 8);
      setSearchResults(
        popularCities.map((city) => ({
          id: city.value,
          name: city.label,
          place_formatted: `${city.label}, Morocco`,
          latitude: city.latitude,
          longitude: city.longitude,
          region: city.region,
          feature_type: "place",
          maki: "marker",
        }))
      );
    }
  }, [isOpen, searchQuery, searchResults.length]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <label
        className={cn(
          "absolute z-10 -top-2 left-3 px-1.5 text-xs font-medium",
          "bg-white font-dm",
          isFocused
            ? "text-[var(--color-greeny-bold)]"
            : error
            ? "text-red-500"
            : "text-black"
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <motion.div
        animate={{
          scale: isHovered ? 1.001 : 1,
          borderColor: isFocused
            ? "var(--color-greeny)"
            : error
            ? "red"
            : isHovered
            ? "var(--color-greeny-highlight)"
            : "var(--color-lite)",
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative flex items-center w-full rounded-lg border bg-white cursor-pointer overflow-hidden",
          "focus-within:ring-1",
          isFocused
            ? "focus-within:ring-[var(--color-greeny)]"
            : error
            ? "focus-within:ring-red-500"
            : "",
          "px-4 py-3.5"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex items-center w-full h-full py-0 px-0 relative z-10"
          onClick={() => {
            setIsOpen(true);
            setIsFocused(true);
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isHovered ? "hovered" : "not-hovered"}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              className="flex-shrink-0 mr-2"
            >
              <MapPin
                className={cn(
                  "h-5 w-5",
                  error
                    ? "text-red-500"
                    : isFocused
                    ? "text-[var(--color-greeny)]"
                    : "text-[#292D32]"
                )}
              />
            </motion.div>
          </AnimatePresence>

          <div
            className="truncate flex-grow text-sm text-[#585858] pointer-events-none select-none"
            tabIndex={0}
          >
            {selectedLocation ? (
              <span className="font-medium truncate block font-dm select-none">
                {getDisplayValue()}
              </span>
            ) : (
              <span className="text-gray-400 select-none">{placeholder}</span>
            )}
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="mt-1 text-xs text-red-500 font-dm">{error}</div>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-full left-0 w-full min-w-[300px] mt-1 z-50 rounded-lg bg-white shadow-lg border overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-3 border-b flex items-center gap-2">
              <Search className="h-4 w-4 text-[var(--color-greeny)]" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search cities in Morocco..."
                className="flex-1 h-8 w-full py-1 text-sm bg-transparent outline-none placeholder:text-gray-400 font-dm"
              />
              {searchQuery && (
                <AnimatePresence>
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full hover:bg-[var(--color-lite-soft)]"
                  >
                    <XCircle className="h-4 w-4 text-gray-400 hover:text-[var(--color-greeny)]" />
                  </motion.button>
                </AnimatePresence>
              )}
            </div>

            {/* Current Location Button */}
            <div className="px-3 py-2 border-b">
              <button
                onClick={handleCurrentLocation}
                disabled={isLoading}
                className="flex items-center gap-2 w-full text-left text-sm text-[var(--color-greeny)] hover:text-[var(--color-greeny-bold)] transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <LocateFixed className="h-4 w-4" />
                )}
                <span className="font-dm">Use my current location</span>
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto p-1">
              {searchError ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-6 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-red-500">
                    <XCircle className="h-6 w-6" />
                    <p className="text-sm font-dm">{searchError}</p>
                  </div>
                </motion.div>
              ) : isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-6 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <Loader2 className="h-6 w-6 animate-spin text-[var(--color-greeny)]" />
                    <p className="text-sm font-dm">Searching locations...</p>
                  </div>
                </motion.div>
              ) : searchResults.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-6 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <XCircle className="h-6 w-6" />
                    <p className="text-sm font-dm">No results found.</p>
                  </div>
                </motion.div>
              ) : (
                <div className="py-1">
                  {searchResults.map((location) => (
                    <motion.div
                      key={location.id}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleSelect(location)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 cursor-pointer rounded-md",
                        "hover:bg-[var(--color-lite-soft)] transition-colors duration-100",
                        selectedLocation?.id === location.id
                          ? "bg-[var(--color-lite-soft)]"
                          : ""
                      )}
                    >
                      <MapPin className="h-4 w-4 text-[var(--color-greeny)] flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="min-w-0 flex-1">
                            <p
                              className={cn(
                                "text-sm font-dm font-medium truncate",
                                selectedLocation?.id === location.id &&
                                  "text-[var(--color-greeny-bold)]"
                              )}
                            >
                              {location.name}
                            </p>
                            {location.region && (
                              <p className="text-xs text-gray-500 truncate">
                                {location.region}
                              </p>
                            )}
                          </div>
                          {selectedLocation?.id === location.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 30,
                              }}
                              className="text-[var(--color-greeny)] flex-shrink-0 ml-2"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
