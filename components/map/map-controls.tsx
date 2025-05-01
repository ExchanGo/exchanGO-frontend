import React, { useRef, useState, useEffect } from "react";
import { PlusIcon, MinusIcon, LocateFixed, Expand } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { cn } from "@/lib/utils";

import { useMap } from "@/context/map-context";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useMapStore } from "@/store/map";

export default function MapCotrols() {
  const { map } = useMap();
  const geolocateControl = useRef<mapboxgl.GeolocateControl | null>(null);
  const [isTracking, setIsTracking] = useState(false);

  const toggleMapMaximized = useMapStore((state) => state.toggleMapMaximized);

  // Initialize geolocate control on mount
  useEffect(() => {
    if (!map || geolocateControl.current) return;

    geolocateControl.current = new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
      showAccuracyCircle: false,
      showUserLocation: true,
    });

    // Add control but hide the default button
    map.addControl(geolocateControl.current);

    // Listen for geolocate events
    geolocateControl.current.on("geolocate", () => {
      setIsTracking(true);
    });

    geolocateControl.current.on("error", () => {
      setIsTracking(false);
    });
  }, [map]);

  const zoomIn = () => {
    map?.zoomIn();
  };

  const zoomOut = () => {
    map?.zoomOut();
  };

  const trackUserLocation = () => {
    if (!map || !geolocateControl.current) return;

    if (!isTracking) {
      geolocateControl.current.trigger();
    } else {
      (geolocateControl.current as any)._clearWatch();
      setIsTracking(false);
    }
  };

  return (
    <aside className="absolute bottom-16 right-4 z-10 flex flex-col gap-2.5">
      <Button
        onClick={trackUserLocation}
        variant="ghost"
        size="sm"
        className={cn(
          "bg-background rounded-sm shadow-lg transition-colors",
          isTracking &&
            "bg-primary text-black hover:bg-[var(--color-lite-soft)]"
        )}
      >
        <LocateFixed className="w-5 h-5" />
      </Button>

      <div className="bg-background p-1.5 rounded-sm shadow-lg flex flex-col">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-sm w-6 h-6"
          onClick={zoomIn}
        >
          <PlusIcon className="w-5 h-5" />
          <span className="sr-only">Zoom in</span>
        </Button>
        <Separator color="#DDDDDD" className="w-5 mx-auto my-1.5" />
        <Button
          variant="ghost"
          size="sm"
          className="rounded-sm w-6 h-6"
          onClick={zoomOut}
        >
          <MinusIcon className="w-5 h-5" />
          <span className="sr-only">Zoom out</span>
        </Button>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="bg-background rounded-sm shadow-lg"
        onClick={toggleMapMaximized}
      >
        <Expand className="w-5 h-5" />
      </Button>
    </aside>
  );
}
