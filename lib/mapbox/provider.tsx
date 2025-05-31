"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl, { StyleSpecification } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapContext } from "@/context/map-context";
import dynamic from "next/dynamic";

// Declare global window interface extension
declare global {
  interface Window {
    mapboxgl?: {
      map?: mapboxgl.Map | null;
    };
  }
}

// Define interface for map container element
interface MapboxHTMLElement extends HTMLDivElement {
  __mbMap?: mapboxgl.Map;
}

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

// Water color constants
const WATER_COLOR = "#4FB9E5"; // Bright blue water color
const LAND_COLOR = "#f5f5f0"; // Light background color

// Global map instance cache - this persists across page navigations
let globalMapInstance: mapboxgl.Map | null = null;
let isMapInitialized = false;
let mapLoadPromise: Promise<mapboxgl.Map> | null = null;

// Optimized style for faster loading
const FAST_STYLE = "mapbox://styles/mapbox/light-v11";

// Function to apply custom colors to the map
const applyCustomColors = (map: mapboxgl.Map) => {
  // Apply colors immediately if map is already loaded
  if (map.loaded()) {
    applyColorsToLayers(map);
    return;
  }

  // Apply colors as soon as style data is available (faster than waiting for full load)
  map.once("styledata", () => {
    applyColorsToLayers(map);
  });

  // Fallback to load event
  map.once("load", () => {
    applyColorsToLayers(map);
  });
};

// Separate function to actually apply the colors
const applyColorsToLayers = (map: mapboxgl.Map) => {
  try {
    const style = map.getStyle();
    if (style && style.layers) {
      style.layers.forEach((layer: any) => {
        // Apply water color to all water-related layers
        if (
          layer.type === "fill" &&
          (layer.id.includes("water") ||
            layer.id.includes("ocean") ||
            layer.id.includes("sea") ||
            layer.id.includes("lake") ||
            layer.id.includes("river"))
        ) {
          map.setPaintProperty(layer.id, "fill-color", WATER_COLOR);
        }

        // Apply background color
        if (layer.type === "background" && layer.id === "background") {
          map.setPaintProperty(layer.id, "background-color", LAND_COLOR);
        }

        // Hide specific Morocco-Western Sahara border only
        if (
          layer.type === "line" &&
          (layer.id.includes("admin") || layer.id.includes("boundary")) &&
          (layer.id.includes("disputed") ||
            layer.source === "composite" ||
            layer["source-layer"] === "admin")
        ) {
          // Add a filter to hide only the Morocco-Western Sahara border
          // This targets the specific administrative level and region
          try {
            const existingFilter = map.getFilter(layer.id) || ["all"];
            const newFilter = [
              "all",
              existingFilter,
              [
                "!=",
                ["get", "iso_3166_1"],
                "EH", // Western Sahara ISO code
              ],
              ["!=", ["get", "name"], "Western Sahara"],
              ["!=", ["get", "name_en"], "Western Sahara"],
            ];
            map.setFilter(layer.id, newFilter);
          } catch (filterError) {
            // If filtering fails, try to hide the layer for disputed territories only
            if (layer.id.includes("disputed") || layer.id.includes("ehsah")) {
              map.setLayoutProperty(layer.id, "visibility", "none");
            }
          }
        }
      });
    }

    console.log(
      "🎨 Applied custom map colors and removed Morocco-Western Sahara border"
    );
  } catch (error) {
    console.warn("Failed to apply custom colors:", error);
  }
};

// Create a singleton map instance that can be reused
const createOrReuseMapInstance = async (
  container: HTMLElement,
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  }
): Promise<mapboxgl.Map> => {
  // If we already have a map instance, try to reuse it
  if (globalMapInstance && !globalMapInstance._removed) {
    try {
      // Get the current container
      const currentContainer = globalMapInstance.getContainer();

      // If the map is in a different container, move it
      if (currentContainer !== container) {
        // Remove from old container
        if (currentContainer.parentNode) {
          currentContainer.parentNode.removeChild(currentContainer);
        }

        // Add to new container
        container.appendChild(currentContainer);

        // Resize to fit new container
        globalMapInstance.resize();
      }

      // Update view state if needed
      const currentCenter = globalMapInstance.getCenter();
      const currentZoom = globalMapInstance.getZoom();

      if (
        Math.abs(currentCenter.lng - initialViewState.longitude) > 0.01 ||
        Math.abs(currentCenter.lat - initialViewState.latitude) > 0.01 ||
        Math.abs(currentZoom - initialViewState.zoom) > 0.1
      ) {
        globalMapInstance.jumpTo({
          center: [initialViewState.longitude, initialViewState.latitude],
          zoom: initialViewState.zoom,
        });
      }

      // Apply custom colors when reusing existing map
      applyCustomColors(globalMapInstance);

      console.log("✅ Reused existing map instance");
      return globalMapInstance;
    } catch (error) {
      console.warn("Failed to reuse map instance:", error);
      // If reuse fails, clean up and create new
      if (globalMapInstance) {
        globalMapInstance.remove();
        globalMapInstance = null;
      }
    }
  }

  // Create new map instance
  console.log("🆕 Creating new map instance");
  const map = new mapboxgl.Map({
    container,
    style: FAST_STYLE,
    center: [initialViewState.longitude, initialViewState.latitude],
    zoom: initialViewState.zoom,
    attributionControl: false,
    logoPosition: "bottom-right",
    pitchWithRotate: false,
    dragRotate: false,
    minZoom: 2,
    maxZoom: 18,
    fadeDuration: 0, // Instant transitions
    preserveDrawingBuffer: false, // Better performance
    antialias: false, // Better performance on mobile
    collectResourceTiming: false, // Better performance
  });

  // Store globally
  globalMapInstance = map;
  isMapInitialized = true;

  // Store on container for easy access
  (container as MapboxHTMLElement).__mbMap = map;

  // Store on window for global access
  if (typeof window !== "undefined") {
    window.mapboxgl = window.mapboxgl || {};
    window.mapboxgl.map = map;
  }

  // Apply custom colors once the map is loaded
  applyCustomColors(map);

  return map;
};

interface MapProviderProps {
  mapContainerRef: React.RefObject<MapboxHTMLElement | null>;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  children?: React.ReactNode;
  onLoad?: () => void;
}

function MapProviderContent({
  mapContainerRef,
  initialViewState,
  children,
  onLoad,
}: MapProviderProps) {
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstance.current || isInitializing) {
      return;
    }

    const container = mapContainerRef.current;
    setIsInitializing(true);

    // If we already have a cached map that's loaded, use it immediately
    if (globalMapInstance && !globalMapInstance._removed && isMapInitialized) {
      try {
        // Quick reuse of existing map
        const currentContainer = globalMapInstance.getContainer();
        if (currentContainer !== container) {
          if (currentContainer.parentNode) {
            currentContainer.parentNode.removeChild(currentContainer);
          }
          container.appendChild(currentContainer);
          globalMapInstance.resize();
        }

        mapInstance.current = globalMapInstance;
        container.__mbMap = globalMapInstance;

        // Apply custom colors immediately when reusing
        applyCustomColors(globalMapInstance);

        setIsLoaded(true);
        setIsInitializing(false);
        onLoad?.();

        console.log("⚡ Instantly reused cached map");
        return;
      } catch (error) {
        console.warn("Quick reuse failed:", error);
      }
    }

    // Create or get map instance
    const initializeMap = async () => {
      try {
        // Use existing promise if one is in progress
        if (!mapLoadPromise) {
          mapLoadPromise = createOrReuseMapInstance(
            container,
            initialViewState
          );
        }

        const map = await mapLoadPromise;
        mapInstance.current = map;

        // Wait for map to be fully loaded
        if (map.loaded()) {
          setIsLoaded(true);
          setIsInitializing(false);
          onLoad?.();
        } else {
          map.once("load", () => {
            setIsLoaded(true);
            setIsInitializing(false);
            onLoad?.();
          });
        }

        // Clear the promise since we're done
        mapLoadPromise = null;
      } catch (error) {
        console.error("Failed to initialize map:", error);
        setIsInitializing(false);
        mapLoadPromise = null;
      }
    };

    initializeMap();

    // Cleanup function
    return () => {
      // Only clean up if the container is being removed from DOM
      if (!document.contains(container)) {
        console.log("🧹 Container removed, cleaning up map");
        if (mapInstance.current && mapInstance.current === globalMapInstance) {
          globalMapInstance.remove();
          globalMapInstance = null;
          isMapInitialized = false;
          mapLoadPromise = null;

          if (typeof window !== "undefined" && window.mapboxgl) {
            window.mapboxgl.map = null;
          }
        }
        mapInstance.current = null;
      }
    };
  }, [initialViewState, onLoad, isInitializing]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (mapInstance.current && !mapInstance.current._removed) {
        mapInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <MapContext.Provider value={{ map: mapInstance.current! }}>
      {children}
    </MapContext.Provider>
  );
}

// Export a dynamically imported version that only renders on client-side
export default dynamic(() => Promise.resolve(MapProviderContent), {
  ssr: false, // Completely disable server-side rendering for this component
});
