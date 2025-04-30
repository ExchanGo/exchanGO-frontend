import React from "react";
import { PlusIcon, MinusIcon, LocateFixed, Expand } from "lucide-react";

import { useMap } from "@/context/map-context";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useMapStore } from "@/store/map";

export default function MapCotrols() {
  const { map } = useMap();

  const toggleMapMaximized = useMapStore((state) => state.toggleMapMaximized);

  const zoomIn = () => {
    map?.zoomIn();
  };

  const zoomOut = () => {
    map?.zoomOut();
  };

  return (
    <aside className="absolute bottom-16 right-4 z-10 flex flex-col gap-2.5">
      <Button
        variant="ghost"
        size="sm"
        className="bg-background rounded-sm shadow-lg"
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
