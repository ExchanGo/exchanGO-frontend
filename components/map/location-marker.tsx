import { MapPin } from "lucide-react";

import { LocationFeature } from "@/lib/mapbox/utils";
import Marker from "./map-marker";
import Image from "next/image";

interface LocationMarkerProps {
  location: LocationFeature;
  onHover: (data: LocationFeature) => void;
}

export function LocationMarker({ location, onHover }: LocationMarkerProps) {
  return (
    <Marker
      longitude={location.geometry.coordinates[0]}
      latitude={location.geometry.coordinates[1]}
      data={location}
      onHover={({ data }) => {
        onHover(data);
      }}
    >
      {/* Tooltip with rate */}
      {/* {location.rate && ( */}
      {/* <div className="flex flex-col items-center mb-2">
        <div className="bg-white rounded-lg px-4 py-2 shadow text-black text-xl font-bold relative z-10"> */}
      {/* {location.rate} */}
      {/* RP16520 */}
      {/* <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
        </div>
      </div> */}
      {/* )} */}
      <div className="rounded-full flex items-center justify-center transform transition-all duration-200 bg-white p-0.5 text-white shadow-lg size-8 cursor-pointer hover:scale-110">
        <Image
          src="/svg/logo-marker-map.svg"
          alt="Map pin"
          width={58}
          height={58}
        />
      </div>
    </Marker>
  );
}
