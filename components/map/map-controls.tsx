import React, { useRef, useState, useEffect } from "react";
import { PlusIcon, MinusIcon, LocateFixed, Expand } from "lucide-react";
import mapboxgl from "mapbox-gl";
import { cn } from "@/lib/utils";

import { useMap } from "@/context/map-context";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useMapStore } from "@/store/map";

// Extend the GeolocateControl type to include _clearWatch
interface ExtendedGeolocateControl extends mapboxgl.GeolocateControl {
  _clearWatch: () => void;
}

export default function MapCotrols() {
  const { map } = useMap();
  const geolocateControl = useRef<ExtendedGeolocateControl | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const locateButtonRef = useRef<HTMLButtonElement>(null);

  const toggleMapMaximized = useMapStore((state) => state.toggleMapMaximized);

  const trackUserLocation = () => {
    if (!map || !geolocateControl.current) return;

    // Always trigger location tracking when clicked
    // This will center the map on user's location and show the marker
    geolocateControl.current.trigger();

    // Note: We don't toggle off anymore - clicking always shows location
    // The user can manually pan away if they want to explore other areas
  };

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
    }) as ExtendedGeolocateControl;

    // Add control but hide the default button
    map.addControl(geolocateControl.current);

    // Listen for geolocate events
    geolocateControl.current.on("geolocate", () => {
      setIsTracking(true);

      // Reset tracking state after a short delay to indicate the action is complete
      // This makes it clear the button can be clicked again to re-center
      setTimeout(() => {
        setIsTracking(false);
      }, 2000);
    });

    geolocateControl.current.on("error", () => {
      setIsTracking(false);
    });
  }, [map]);

  // Expose the trackUserLocation function globally so it can be called from other components
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).triggerMapLocationTracking = trackUserLocation;

      // Also expose the button ref for direct clicking
      if (locateButtonRef.current) {
        (window as any).mapLocateButton = locateButtonRef.current;
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).triggerMapLocationTracking;
        delete (window as any).mapLocateButton;
      }
    };
  }, [trackUserLocation, isTracking]);

  const zoomIn = () => {
    map?.zoomIn();
  };

  const zoomOut = () => {
    map?.zoomOut();
  };

  return (
    <aside className="absolute bottom-16 right-4 z-10 flex flex-col gap-2.5">
      <Button
        ref={locateButtonRef}
        onClick={trackUserLocation}
        variant="ghost"
        size="sm"
        className={cn(
          "bg-background rounded-sm shadow-lg transition-all duration-200 hover:bg-gray-50",
          isTracking &&
            "bg-primary text-black hover:bg-[var(--color-lite-soft)]"
        )}
        aria-label="Center map on my location"
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
