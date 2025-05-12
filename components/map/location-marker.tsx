// import { MapPin } from "lucide-react";

import { LocationFeature } from "@/lib/mapbox/utils";
import Marker from "./map-marker";
import Image from "next/image";
import { motion } from "framer-motion";

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
      {/* {location.rate && ( */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center mb-2"
      >
        <div className="bg-white rounded-md px-1 shadow-lg text-black font-medium relative z-10 border border-gray-100">
          <span className="text-primary-600 text-[10px]">RP16520</span>
          <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-0 h-0 border-l-6 border-r-6 border-t-6 border-l-transparent border-r-transparent border-t-white" />
        </div>
      </motion.div>
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
