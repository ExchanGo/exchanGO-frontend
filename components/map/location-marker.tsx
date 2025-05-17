// import { MapPin } from "lucide-react";

import { LocationFeature } from "@/lib/mapbox/utils";
import Marker from "./map-marker";
import Image from "next/image";
import { motion } from "framer-motion";
// import { useMap } from "@/context/map-context";

interface LocationMarkerProps {
  location: LocationFeature;
  onHover: (data: LocationFeature) => void;
  isSelected?: boolean;
}

export function LocationMarker({
  location,
  onHover,
  isSelected = false,
}: LocationMarkerProps) {
  // const { map } = useMap();

  return (
    <Marker
      longitude={location.geometry.coordinates[0]}
      latitude={location.geometry.coordinates[1]}
      data={location}
      onHover={({ data }) => {
        onHover(data);
      }}
    >
      {/* {location.rate && ( */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center mb-2"
      >
        <div
          className={`rounded-md px-1 shadow-lg font-medium relative z-10 border border-gray-100 ${
            isSelected ? "bg-[#111111] text-white" : "bg-white text-black"
          }`}
        >
          <span
            className={`text-[10px] ${
              isSelected ? "text-white" : "text-primary-600"
            }`}
          >
            RP16520
          </span>
          <div
            className={`absolute left-1/2 -bottom-1 -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent ${
              isSelected ? "border-t-[#111111]" : "border-t-white"
            }`}
          />
        </div>
      </motion.div>
      {/* )} */}
      <div
        className={`rounded-full flex items-center justify-center transform transition-all duration-200 ${
          isSelected ? "bg-[#3BEE5C]" : "bg-white"
        } p-0.5 text-white shadow-lg size-8 cursor-pointer hover:scale-110 ${
          isSelected ? "scale-110" : ""
        }`}
      >
        <Image
          src={
            isSelected ? "/svg/marker-selected.svg" : "/svg/logo-marker-map.svg"
          }
          alt="Map pin"
          width={58}
          height={58}
        />
      </div>
    </Marker>
  );
}
