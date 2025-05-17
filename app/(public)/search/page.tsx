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
import dynamic from "next/dynamic";
// import mapboxgl from "mapbox-gl";

// Declare global window interface extension
declare global {
  interface Window {
    mapboxgl?: {
      map?: mapboxgl.Map;
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

  return (
    <>
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
              "sticky w-full max-md:relative max-md:h-[300px] transition-all duration-300",
              isMapMaximized && "relative left-0 z-50"
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
                : `calc(100vh - ${navbarHeight}px)`,
            }}
          >
            <div
              className="w-full h-full transition-all duration-300"
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

              {/* Only render the MapProvider once and keep it alive */}
              <MapProvider
                mapContainerRef={mapContainerRef}
                initialViewState={{
                  longitude: -122.4194,
                  latitude: 37.7749,
                  zoom: 10,
                }}
                onLoad={() => {
                  mapInitialized.current = true;
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

      {/* Modal Container - Rendered at root level */}
      <ModalContainerSearch />
    </>
  );
}
