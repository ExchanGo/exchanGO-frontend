"use client";

import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function Map() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current || typeof window === "undefined")
      return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.5, 40],
      zoom: 9,
    });

    // map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    return () => {
      map.current?.remove();
    };
  }, []);

  return <div ref={mapContainer} className="w-full h-full" />;
}
