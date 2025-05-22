"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Check, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthNavbar from "@/components/auth/AuthNavbar";
import MapProvider from "@/lib/mapbox/provider";
import { useMap } from "@/context/map-context";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { LocationFeature } from "@/lib/mapbox/utils";
import { FloatingLabelInput } from "@/components/ui/FloatingLabelInput";

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

    // Create a custom marker element
    const el = document.createElement("div");
    el.className = "custom-marker";
    el.innerHTML = `
      <div class="w-12 h-12 flex items-center justify-center">
        <div class="absolute animate-ping w-5 h-5 bg-green-500 rounded-full opacity-75"></div>
        <div class="relative w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
        </div>
      </div>
      <div class="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2 w-2 h-2 bg-green-500 rotate-45"></div>
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

  const searchLocation = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          query
        )}.json?access_token=${accessToken}&types=address,poi,place&limit=5`
      );

      if (!response.ok) throw new Error("Failed to fetch suggestions");

      const data = await response.json();
      const features = data.features.map((feature: any) => ({
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
        },
      }));

      setSuggestions(features);

      // If no results found
      if (features.length === 0 && isFocused) {
        setError("No locations found. Try a different search term.");
      }
    } catch (error) {
      console.error("Error searching for location:", error);
      setError("Failed to search for locations. Please try again.");
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectLocation = (location: LocationFeature) => {
    if (!map) return;

    map.flyTo({
      center: [
        location.properties.coordinates.longitude,
        location.properties.coordinates.latitude,
      ],
      zoom: 16,
      essential: true,
      duration: 1000,
    });

    setSearchValue(
      location.properties.place_formatted || location.properties.name
    );
    setSuggestions([]);
    setIsFocused(false);
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    if (!searchValue.trim()) {
      setSuggestions([]);
      setError(null);
      return;
    }

    const timer = setTimeout(() => {
      searchLocation(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const handleInputChange = (value: string) => {
    console.log("Search input changed:", value);
    setSearchValue(value);
  };

  const handleInputFocus = () => {
    console.log("Search input focused");
    setIsFocused(true);
    // If we already have a search value, trigger search again
    if (searchValue.trim()) {
      searchLocation(searchValue);
    }
  };

  const handleOutsideClick = () => {
    // Hide suggestions dropdown when clicking outside
    setIsFocused(false);
  };

  // Add effect to handle outside clicks
  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className="relative z-20 w-full">
      <FloatingLabelInput
        icon={Search}
        label="Office Location"
        value={searchValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        placeholder="Search for your office location"
      />

      <AnimatePresence>
        {isFocused && (isLoading || error || suggestions.length > 0) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-30 max-h-60 overflow-y-auto"
            // Stop propagation to prevent outside click handler from firing
            onMouseDown={(e) => e.stopPropagation()}
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
                  <span>Searching...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-3 text-center text-red-500 text-sm">
                {error}
              </div>
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion) => (
                <motion.div
                  key={suggestion.properties.mapbox_id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => selectLocation(suggestion)}
                  whileHover={{ backgroundColor: "rgba(74, 175, 87, 0.1)" }}
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">
                        {suggestion.properties.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate max-w-[90%]">
                        {suggestion.properties.place_formatted}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-3 text-center text-gray-500">
                Type to search for locations
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
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

  return (
    <div className="space-y-4">
      <MapProvider
        mapContainerRef={mapContainerRef}
        initialViewState={{
          longitude: -99.29011,
          latitude: 39.39172,
          zoom: 3.5,
        }}
        onLoad={handleMapLoad}
      >
        {/* Map container */}
        <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-md border">
          <div
            ref={mapContainerRef}
            className="absolute inset-0 w-full h-full"
          />

          {isMapLoaded && <MapMarker />}

          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-md shadow-md">
            <div className="flex items-start gap-2">
              <Info className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Place the pin at your exact office location. You can drag the
                map to position the marker precisely where your office is
                located.
              </p>
            </div>
          </div>
        </div>

        {/* Location search below the map but in the same context */}
        {isMapLoaded && <LocationSearch />}
      </MapProvider>
    </div>
  );
}

// The page component
export default function SetLocationPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirmLocation = async () => {
    setIsSubmitting(true);

    try {
      // Here you would typically save the location data
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to dashboard or confirmation page
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving location:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

          <Button
            type="button"
            variant="gradient"
            className="w-full py-5 mt-4"
            onClick={handleConfirmLocation}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-[#1A3617]"
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
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>Confirm Location</span>
                <Check className="h-5 w-5" />
              </div>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
