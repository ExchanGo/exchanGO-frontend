"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapContext } from "@/context/map-context";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface MapProviderProps {
  mapContainerRef: React.RefObject<HTMLDivElement | null>;
  initialViewState: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
  children?: React.ReactNode;
  onLoad?: () => void;
}

export default function MapProvider({
  mapContainerRef,
  initialViewState,
  children,
  onLoad,
}: MapProviderProps) {
  const mapInstance = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstance.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [initialViewState.longitude, initialViewState.latitude],
      zoom: initialViewState.zoom,
      attributionControl: false,
      logoPosition: "bottom-right",
    });

    mapInstance.current = map;

    map.on("load", () => {
      setIsLoaded(true);
      onLoad?.();
    });

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [initialViewState, mapContainerRef, onLoad]);

  if (!isLoaded) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-background/80">
        <div className="text-lg font-medium">Loading map...</div>
      </div>
    );
  }

  return (
    <MapContext.Provider value={{ map: mapInstance.current! }}>
      {children}
    </MapContext.Provider>
  );
}
