"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return; // initialize only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12", // Modern mapbox style
      center: [-74.5, 40], // Default center [lng, lat]
      zoom: 9,
    });

    return () => {
      map.current?.remove(); // Cleanup on unmount
    };
  }, []);

  return <div ref={mapContainer} className="w-full h-full" />;
}
