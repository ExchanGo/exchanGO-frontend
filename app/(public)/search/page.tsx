"use client";

import { useEffect, useRef, useState } from "react";
import { ResultsHeader } from "@/components/searchResults/ResultsHeader";
import { ResultsList } from "@/components/searchResults/ResultsList";
import { SearchFilters } from "@/components/searchResults/SearchFilters";
import MapProvider from "@/lib/mapbox/provider";
import MapSearch from "@/components/map/map-search";
import MapCotrols from "@/components/map/map-controls";
import MapStyles from "@/components/map/map-styles";
import MapScaleControls from "@/components/map/map-scale-controls";
import { useMapStore } from "@/store/map";
import { cn } from "@/lib/utils";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

// Declare global window interface extension
declare global {
  interface Window {
    mapboxgl?: {
      map?: mapboxgl.Map | null;
    };
  }
}

// Add this interface if not importing from the provider file
interface MapboxHTMLElement extends HTMLDivElement {
  __mbMap?: mapboxgl.Map;
}

// Dynamically import modal container with SSR disabled
const ModalContainerSearch = dynamic(
  () => import("@/components/shared/modal-container-search"),
  { ssr: false }
);

export default function Search() {
  const isMapMaximized = useMapStore((state) => state.isMapMaximized);
  const setMapMaximized = useMapStore((state) => state.setMapMaximized);

  // Remove the key state that was forcing map re-renders
  const [navbarHeight, setNavbarHeight] = useState(0);
  const mapContainerRef = useRef<MapboxHTMLElement | null>(null);
  const mapInitialized = useRef<boolean>(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // Effect to measure navbar height on mount and resize
  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateNavbarHeight = () => {
      const navbar = document.querySelector("nav");
      if (navbar) {
        const height = navbar.getBoundingClientRect().height;
        setNavbarHeight(height);
      }
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  // Effect to ensure map is not maximized on mount
  useEffect(() => {
    setMapMaximized(false);
  }, [setMapMaximized]);

  // Effect to handle map resize when the container dimensions change
  useEffect(() => {
    if (!mapContainerRef.current || typeof window === "undefined") return;

    // When map container size changes, trigger a resize event for Mapbox
    const resizeMap = () => {
      // Safely access the map instance
      const mapInstance =
        mapContainerRef.current?.__mbMap || window.mapboxgl?.map;
      if (mapInstance && typeof mapInstance.resize === "function") {
        mapInstance.resize();
      }
    };

    // Wait a tiny bit for the DOM to update before resizing
    const timeoutId = setTimeout(() => {
      resizeMap();
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [isMapMaximized, navbarHeight]);

  // Handle map load and initialization
  const handleMapLoad = () => {
    if (mapInitialized.current) return; // Prevent multiple initializations

    mapInitialized.current = true;
    setMapLoaded(true);

    console.log("🗺️ Map loaded successfully");

    // Apply any additional map initialization
    const mapInstance =
      mapContainerRef.current?.__mbMap || window.mapboxgl?.map;
    if (mapInstance) {
      // Optimize for performance
      mapInstance.setTerrain(null); // Disable terrain for better performance
      mapInstance.setPitch(0); // Start with flat view for faster rendering
    }
  };

  return (
    <>
      <div className="grid grid-cols-12 max-md:grid-cols-1">
        {/* Left Section - Results */}
        <AnimatePresence>
          {!isMapMaximized && (
            <motion.section
              className="col-span-8 max-md:col-span-1 min-h-screen border-r border-neutral-200 max-md:border-r-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SearchFilters />
              <div className="mx-8 mt-6">
                <ResultsHeader
                  count={8}
                  location="Morocco"
                  lastUpdate="Just now"
                />
                <div className="pb-10">
                  <ResultsList />
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Right Section - Map */}
        <motion.section
          className={cn(
            "col-span-4 max-md:col-span-1 block",
            isMapMaximized && "col-span-12"
          )}
          layout
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            className={cn(
              "sticky w-full max-md:relative max-md:h-[300px] transition-all duration-300",
              isMapMaximized && "fixed inset-x-0 z-50 !top-[125px]"
            )}
            style={{
              top: !isMapMaximized
                ? navbarHeight > 0
                  ? `${navbarHeight}px`
                  : "0px"
                : "0",
              height: !isMapMaximized
                ? navbarHeight > 0
                  ? `calc(100vh - ${navbarHeight}px)`
                  : "calc(100vh - 125px)"
                : "calc(100vh - 125px)",
            }}
            layout
          >
            <motion.div
              className={cn(
                "w-full h-full transition-all duration-300 overflow-hidden shadow-l-lg",
                isMapMaximized && "rounded-lg overflow-hidden"
              )}
              style={{
                height: !isMapMaximized
                  ? navbarHeight > 0
                    ? `calc(100vh - ${navbarHeight}px)`
                    : "calc(100vh - 125px)"
                  : "100vh",
              }}
              layout
            >
              {/* Map placeholder for faster initial rendering */}
              {!mapLoaded && (
                <div className="absolute inset-0 z-40 bg-gray-100 flex items-center justify-center">
                  <div className="text-center p-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-t-green-500 border-gray-200 animate-spin"></div>
                    <p className="text-sm font-medium text-gray-600">
                      Loading map...
                    </p>
                  </div>
                </div>
              )}

              {/* Map loading overlay - only show if map is not loaded */}
              <AnimatePresence>
                {!mapLoaded && (
                  <motion.div
                    className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex items-center justify-center"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-4 border-t-[#79DD1C] border-gray-200 animate-spin"></div>
                      <p className="text-sm font-medium text-gray-600">
                        Initializing map...
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div
                id="map-container"
                ref={mapContainerRef}
                className="absolute inset-0 h-full w-full"
              />

              {/* Only render the MapProvider once and keep it alive */}
              <MapProvider
                mapContainerRef={mapContainerRef}
                initialViewState={{
                  longitude: -7.092, // Default to Morocco
                  latitude: 31.792,
                  zoom: 5.5,
                }}
                onLoad={handleMapLoad}
              >
                <MapSearch />
                <MapCotrols />
                <MapStyles />
                <MapScaleControls />
              </MapProvider>
            </motion.div>
          </motion.div>
        </motion.section>
      </div>

      {/* Modal Container - Rendered at root level */}
      <ModalContainerSearch />
    </>
  );
}
