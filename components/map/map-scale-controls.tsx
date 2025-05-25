"use client";

import { useState } from "react";
import { useMap } from "@/context/map-context";

export default function MapScaleControls() {
  const { map } = useMap();
  const [selectedScale, setSelectedScale] = useState("10Km");

  const handleScaleChange = (scale: string) => {
    setSelectedScale(scale);
    // Change zoom level based on scale
    if (map) {
      switch (scale) {
        case "1Km":
          map.zoomTo(15);
          break;
        case "5Km":
          map.zoomTo(13);
          break;
        case "10Km":
          map.zoomTo(11);
          break;
        default:
          break;
      }
    }
  };

  const handleCenterMap = () => {
    if (map) {
      // Center on Morocco (default location for your app)
      map.flyTo({
        center: [-7.092, 31.792],
        zoom: 5.5,
        duration: 1500,
        essential: true,
      });
    }
  };

  return (
    <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg flex overflow-hidden border border-gray-200 z-10">
      {["10Km", "5Km", "1Km"].map((scale) => (
        <button
          key={scale}
          onClick={() => handleScaleChange(scale)}
          className={`px-2 py-2 text-sm font-medium font-dm transition-colors ${
            selectedScale === scale
              ? "bg-gray-100 text-gray-900"
              : "bg-white text-gray-600 hover:bg-gray-50"
          }`}
        >
          {scale}
        </button>
      ))}
      <button
        className="px-2 py-2 hover:text-gray-600 border-l border-gray-200"
        onClick={handleCenterMap}
        title="Center map on Morocco"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="w-4 h-4"
        >
          <polygon points="3 11 22 2 13 21 11 13 3 11" />
        </svg>
      </button>
    </div>
  );
}
