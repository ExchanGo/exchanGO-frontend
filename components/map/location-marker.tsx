// import { MapPin } from "lucide-react";

import { LocationFeature } from "@/lib/mapbox/utils";
import Marker from "./map-marker";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";
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
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Marker
      longitude={location.geometry.coordinates[0]}
      latitude={location.geometry.coordinates[1]}
      data={location}
      onHover={({ data }) => {
        onHover(data);
      }}
    >
      <motion.div
        className="flex flex-col items-center"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        {/* Price tag with smooth animations */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: isHovered ? -2 : 0,
            scale: isHovered ? 1.02 : 1,
          }}
          exit={{ opacity: 0, y: 10 }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
          }}
          className="flex flex-col items-center mb-3"
        >
          <motion.div
            animate={{
              backgroundColor: isSelected
                ? "#111111"
                : isHovered
                ? "#20523C"
                : "#ffffff",
              color: isSelected || isHovered ? "#ffffff" : "#000000",
              boxShadow: isHovered
                ? "0 6px 20px rgba(32, 82, 60, 0.25)"
                : "0 2px 8px rgba(0, 0, 0, 0.1)",
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="rounded-md px-2 py-1 font-medium relative z-10"
          >
            <motion.span
              animate={{
                color: isSelected || isHovered ? "#ffffff" : "#20523C",
              }}
              transition={{ duration: 0.3 }}
              className="text-xs font-bold"
            >
              RP16520
            </motion.span>
            <motion.div
              animate={{
                borderTopColor: isSelected
                  ? "#111111"
                  : isHovered
                  ? "#20523C"
                  : "#ffffff",
              }}
              transition={{ duration: 0.3 }}
              className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[8px] border-l-transparent border-r-transparent"
            />
          </motion.div>
        </motion.div>

        {/* Marker circle with enhanced animations */}
        <motion.div
          animate={{
            scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
            backgroundColor: isSelected
              ? "#3BEE5C"
              : isHovered
              ? "#20523C"
              : "#ffffff",
            boxShadow: isSelected
              ? "0 8px 25px rgba(59, 238, 92, 0.3)"
              : isHovered
              ? "0 6px 20px rgba(32, 82, 60, 0.25)"
              : "0 4px 12px rgba(0, 0, 0, 0.15)",
          }}
          transition={{
            duration: 0.3,
            ease: "easeOut",
            scale: {
              type: "spring",
              stiffness: 300,
              damping: 25,
            },
          }}
          className="rounded-full flex items-center justify-center p-1 size-[40px] cursor-pointer relative overflow-hidden"
        >
          {/* Subtle glow effect */}
          <motion.div
            animate={{
              opacity: isHovered || isSelected ? 0.4 : 0,
              scale: isHovered || isSelected ? 1.2 : 1,
            }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 rounded-full"
            style={{
              background: isSelected
                ? "radial-gradient(circle, rgba(59, 238, 92, 0.3) 0%, transparent 70%)"
                : "radial-gradient(circle, rgba(32, 82, 60, 0.3) 0%, transparent 70%)",
            }}
          />

          {/* Image with smooth scaling */}
          <motion.div
            animate={{
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? [0, 2, -2, 0] : 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
              rotate: {
                duration: 0.6,
                ease: "easeInOut",
              },
            }}
            className="relative z-10 w-full h-full flex items-center justify-center"
          >
            <motion.div
              animate={{
                filter:
                  isSelected || isHovered
                    ? "brightness(1.1) saturate(1.05)"
                    : "brightness(1) saturate(1)",
              }}
              transition={{ duration: 0.3 }}
            >
              <Image
                src={
                  isSelected
                    ? "/svg/marker-selected.svg"
                    : "/svg/logo-marker-map.svg"
                }
                alt="Map pin"
                width={80}
                height={80}
                className="w-full h-full object-contain"
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </Marker>
  );
}
