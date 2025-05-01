"use client";

import { useEffect, useRef, useState } from "react";
import { ResultsHeader } from "@/components/searchResults/ResultsHeader";
import { ResultsList } from "@/components/searchResults/ResultsList";
import { SearchFilters } from "@/components/searchResults/SearchFilters";
import MapProvider from "@/lib/mapbox/provider";
import MapSearch from "@/components/map/map-search";
import MapCotrols from "@/components/map/map-controls";
import MapStyles from "@/components/map/map-styles";
import { useMapStore } from "@/store/map";
import { cn } from "@/lib/utils";

export default function Search() {
  const isMapMaximized = useMapStore((state) => state.isMapMaximized);
  const setMapMaximized = useMapStore((state) => state.setMapMaximized);
  const [key, setKey] = useState(0); // Add key for forcing map re-render

  // Reference to the navbar to measure its height
  const [navbarHeight, setNavbarHeight] = useState(0);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  // Effect to measure navbar height on mount and resize
  useEffect(() => {
    const updateNavbarHeight = () => {
      // Get the navbar element
      const navbar = document.querySelector("nav");
      if (navbar) {
        const height = navbar.getBoundingClientRect().height;
        setNavbarHeight(height);
      }
    };

    // Initial measurement
    updateNavbarHeight();

    // Add resize listener to handle window size changes
    window.addEventListener("resize", updateNavbarHeight);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  // Effect to ensure map is not maximized on mount
  useEffect(() => {
    setMapMaximized(false);
  }, [setMapMaximized]);

  // Effect to force map re-render when maximized state changes or when controls are used
  useEffect(() => {
    const handleControlInteraction = () => {
      setKey((prev) => prev + 1);
    };

    // Listen for control interactions
    window.addEventListener("mapControlInteraction", handleControlInteraction);

    return () => {
      window.removeEventListener(
        "mapControlInteraction",
        handleControlInteraction
      );
    };
  }, []);

  // Effect to force map re-render when maximized state changes
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [isMapMaximized]);

  return (
    <div className="grid grid-cols-12 max-md:grid-cols-1">
      {/* Left Section - Results */}
      <section
        className={cn(
          "col-span-8 max-md:col-span-1 min-h-screen border-r border-neutral-200 max-md:border-r-0",
          isMapMaximized && "hidden"
        )}
      >
        <SearchFilters />
        <div className="mx-8 mt-6">
          <ResultsHeader
            count={8}
            location="Central Park"
            lastUpdate="3 days Ago"
          />
          <div className="pb-10">
            <ResultsList />
          </div>
        </div>
      </section>

      {/* Right Section - Map */}
      <section
        className={cn(
          "col-span-4 max-md:col-span-1 block",
          isMapMaximized && "col-span-12"
        )}
      >
        <div
          className={cn(
            "sticky w-full max-md:relative max-md:h-[300px]",
            isMapMaximized && "fixed inset-0 z-50"
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
              : "100vh",
          }}
        >
          <div
            key={key} // Add key to force re-render
            className="w-full h-full"
            style={{
              height: !isMapMaximized
                ? navbarHeight > 0
                  ? `calc(100vh - ${navbarHeight}px)`
                  : "calc(100vh - 125px)"
                : "100vh",
            }}
          >
            <div
              id="map-container"
              ref={mapContainerRef}
              className="absolute inset-0 h-full w-full"
            />

            <MapProvider
              key={key} // Add key to force re-render
              mapContainerRef={mapContainerRef}
              initialViewState={{
                longitude: -122.4194,
                latitude: 37.7749,
                zoom: 10,
              }}
            >
              <MapSearch />
              <MapCotrols />
              <MapStyles />
            </MapProvider>
          </div>
        </div>
      </section>
    </div>
  );
}
