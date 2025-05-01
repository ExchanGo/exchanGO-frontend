"use client";

import mapboxgl, { MarkerOptions } from "mapbox-gl";
import React, { useEffect, useRef } from "react";

import { useMap } from "@/context/map-context";
import { LocationFeature } from "@/lib/mapbox/utils";

type Props = {
  longitude: number;
  latitude: number;
  data: any;
  onHover?: ({
    isHovered,
    position,
    marker,
    data,
  }: {
    isHovered: boolean;
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;
  onClick?: ({
    position,
    marker,
    data,
  }: {
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;
  children?: React.ReactNode;
} & MarkerOptions;

export default function Marker({
  children,
  latitude,
  longitude,
  data,
  onHover,
  onClick,
  ...props
}: Props) {
  const { map } = useMap();
  const markerRef = useRef<HTMLDivElement>(null);
  const markerInstance = useRef<mapboxgl.Marker | null>(null);

  const handleHover = (isHovered: boolean) => {
    if (onHover && markerInstance.current) {
      onHover({
        isHovered,
        position: { longitude, latitude },
        marker: markerInstance.current,
        data,
      });
    }
  };

  const handleClick = () => {
    if (onClick && markerInstance.current) {
      onClick({
        position: { longitude, latitude },
        marker: markerInstance.current,
        data,
      });
    }
  };

  useEffect(() => {
    // Wait for both map and marker element to be available
    if (!map?.getCanvas() || !markerRef.current) return;

    const markerEl = markerRef.current;
    const handleMouseEnter = () => handleHover(true);
    const handleMouseLeave = () => handleHover(false);

    markerEl.addEventListener("mouseenter", handleMouseEnter);
    markerEl.addEventListener("mouseleave", handleMouseLeave);
    markerEl.addEventListener("click", handleClick);

    markerInstance.current = new mapboxgl.Marker({
      element: markerEl,
      ...props,
    })
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => {
      markerInstance.current?.remove();
      markerEl.removeEventListener("mouseenter", handleMouseEnter);
      markerEl.removeEventListener("mouseleave", handleMouseLeave);
      markerEl.removeEventListener("click", handleClick);
    };
  }, [map, longitude, latitude, props]);

  return (
    <div>
      <div ref={markerRef}>{children}</div>
    </div>
  );
}
