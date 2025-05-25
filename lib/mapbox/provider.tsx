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
const LAND_COLOR = "#f8f8f8"; // Light background color

// Flag to track initialization
let isInitialized = false;

// Store the map instance globally for easier access from outside
let globalMapInstance: mapboxgl.Map | null = null;

// Define types for Mapbox style layer
interface MapboxStyleLayer {
  id: string;
  type: string;
  paint?: Record<string, unknown>;
}

// Create a custom Mapbox style with pre-set water color
const createCustomMapStyle = async () => {
  try {
    // Fetch the base light style
    const response = await fetch(
      "https://api.mapbox.com/styles/v1/mapbox/light-v11?access_token=" +
        mapboxgl.accessToken
    );
    if (!response.ok) {
      throw new Error("Failed to fetch base style");
    }

    const baseStyle = await response.json();

    // Modify the style to include blue water before initialization
    if (baseStyle && baseStyle.layers) {
      // Find and modify all water layers
      baseStyle.layers.forEach((layer: MapboxStyleLayer) => {
        if (layer.id.includes("water") && layer.type === "fill") {
          if (!layer.paint) layer.paint = {};
          layer.paint["fill-color"] = WATER_COLOR;
          if (layer.paint["fill-outline-color"]) {
            layer.paint["fill-outline-color"] = WATER_COLOR;
          }
        }

        // Also modify any other water-related layers
        if (
          (layer.id.includes("marine") ||
            layer.id.includes("ocean") ||
            layer.id.includes("sea") ||
            layer.id.includes("blue")) &&
          layer.type === "fill"
        ) {
          if (!layer.paint) layer.paint = {};
          layer.paint["fill-color"] = WATER_COLOR;
        }
      });

      // Set the background to a light color
      const backgroundLayer = baseStyle.layers.find(
        (layer: MapboxStyleLayer) => layer.id === "background"
      );
      if (backgroundLayer && backgroundLayer.paint) {
        backgroundLayer.paint["background-color"] = LAND_COLOR;
      }
    }

    return baseStyle;
  } catch (error) {
    console.error("Error creating custom map style:", error);
    return null;
  }
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
  const [mapStyle, setMapStyle] = useState<StyleSpecification | null>(null);

  // Step 1: Fetch and prepare the style first
  useEffect(() => {
    if (isInitialized || mapStyle) return;

    const fetchStyle = async () => {
      const customStyle = await createCustomMapStyle();
      if (customStyle) {
        setMapStyle(customStyle);
        isInitialized = true;
      }
    };

    fetchStyle();
  }, [mapStyle]);

  // Step 2: Initialize map only after we have the custom style
  useEffect(() => {
    // If we already have a map instance or no container/style, bail out
    if (!mapContainerRef.current || mapInstance.current || !mapStyle) return;

    // Store container reference for cleanup function
    const containerRef = mapContainerRef.current;

    // Check if we already have a global map instance we can reuse
    if (globalMapInstance && document.contains(containerRef)) {
      console.log("Reusing existing map instance");
      mapInstance.current = globalMapInstance;

      // Make sure the map is attached to the current container
      if (containerRef && containerRef !== globalMapInstance.getContainer()) {
        try {
          // Move the map to the new container
          globalMapInstance.getContainer().remove();
          containerRef.appendChild(globalMapInstance.getContainer());
          globalMapInstance.resize();
        } catch (e) {
          console.warn("Error reattaching map:", e);
          // If reattachment fails, create a new map
          globalMapInstance = null;
        }
      }

      // If we successfully reused the map, we're done
      if (globalMapInstance) {
        setIsLoaded(true);
        onLoad?.();
        return;
      }
    }

    // Initialize a new map if needed
    console.log("Creating new map instance");
    const map = new mapboxgl.Map({
      container: containerRef,
      style: mapStyle, // Use our custom style with blue water
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      attributionControl: false,
      logoPosition: "bottom-right",
      pitchWithRotate: false,
      dragRotate: false,
      minZoom: 2,
      maxZoom: 18,
      fadeDuration: 0, // Reduce fade duration for faster appearance
      preserveDrawingBuffer: true, // This helps with some flickering issues
    });

    mapInstance.current = map;
    globalMapInstance = map;

    // Store the map instance on the container element for easy retrieval
    if (containerRef) {
      containerRef.__mbMap = map;
    }

    // Also store on window for global access
    if (typeof window !== "undefined") {
      window.mapboxgl = window.mapboxgl || {};
      window.mapboxgl.map = map;
    }

    // Once the map is loaded, we're done
    map.on("load", () => {
      setIsLoaded(true);
      onLoad?.();
    });

    // Clean up only if we're removing the map entirely
    return () => {
      // We only remove the map if the container is removed from the DOM
      if (containerRef && !document.contains(containerRef)) {
        console.log("Removing map instance");
        if (mapInstance.current) {
          mapInstance.current.remove();
          mapInstance.current = null;
          globalMapInstance = null;

          if (typeof window !== "undefined" && window.mapboxgl) {
            window.mapboxgl.map = null;
          }
        }
      }
    };
  }, [initialViewState, onLoad, mapStyle]);

  // Handle window resize to update the map
  useEffect(() => {
    const handleResize = () => {
      if (mapInstance.current) {
        mapInstance.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
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
