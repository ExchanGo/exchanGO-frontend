import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronRight, Clock, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMap } from "@/context/map-context";

interface ExchangeOffice {
  id: string;
  name: string;
  rate: number;
  currency: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  hours: string;
  isPopular?: boolean;
  images?: string[];
  coordinates: [number, number]; // [longitude, latitude]
}

interface ExchangeMarkerProps {
  exchange: ExchangeOffice;
  onClick?: (exchange: ExchangeOffice) => void;
}

const ExchangeMarker: React.FC<ExchangeMarkerProps> = ({
  exchange,
  onClick,
}) => {
  const { map } = useMap();
  const [showPopup, setShowPopup] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [labelPosition, setLabelPosition] = useState<
    "top" | "right" | "bottom" | "left"
  >("top");

  const markerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleMarkerClick = () => {
    setShowPopup(true);
    if (onClick) onClick(exchange);
  };

  // Determine optimal label position based on screen position
  useEffect(() => {
    if (!map || !showPopup) return;

    const updateLabelPosition = () => {
      if (!markerRef.current) return;

      // Get marker position on screen
      const markerRect = markerRef.current.getBoundingClientRect();
      const markerX = markerRect.left + markerRect.width / 2;
      const markerY = markerRect.top + markerRect.height / 2;

      // Get viewport dimensions
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Calculate position in screen quadrants
      const isRight = markerX > width / 2;
      const isBottom = markerY > height / 2;

      // Place label opposite to where popup would appear
      if (isRight && isBottom) {
        setLabelPosition("top");
      } else if (isRight && !isBottom) {
        setLabelPosition("bottom");
      } else if (!isRight && isBottom) {
        setLabelPosition("top");
      } else {
        setLabelPosition("bottom");
      }
    };

    updateLabelPosition();

    // Add event listener for viewport changes
    window.addEventListener("resize", updateLabelPosition);
    map.on("move", updateLabelPosition);

    return () => {
      window.removeEventListener("resize", updateLabelPosition);
      map.off("move", updateLabelPosition);
    };
  }, [map, showPopup]);

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const images = exchange.images || [];
    if (images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    const images = exchange.images || [];
    if (images.length > 0) {
      setCurrentImageIndex(
        (prev) => (prev - 1 + images.length) % images.length
      );
    }
  };

  const formatRate = (rate: number, currency: string) => {
    return `${currency} ${rate.toLocaleString()}`;
  };

  const labelStyles = {
    top: "-top-7 left-1/2 -translate-x-1/2",
    right: "top-1/2 -translate-y-1/2 left-full ml-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-1",
    left: "top-1/2 -translate-y-1/2 right-full mr-2",
  };

  // Create marker element
  useEffect(() => {
    if (!map || !markerRef.current) return;

    // Position the marker on the map using mapbox methods
    const [lng, lat] = exchange.coordinates;

    // Create marker at the location
    const markerElement = markerRef.current;

    // Add the marker to the map (implementation depends on your mapbox setup)
    // This is a placeholder - you need to adapt it to your existing code
    const point = map.project([lng, lat]);
    if (markerElement) {
      markerElement.style.transform = `translate(${point.x}px, ${point.y}px)`;
      markerElement.style.position = "absolute";
      markerElement.style.zIndex = "10";
      markerElement.style.pointerEvents = "auto";
    }

    // Update marker position when map moves
    const updatePosition = () => {
      if (!markerElement) return;
      const newPoint = map.project([lng, lat]);
      markerElement.style.transform = `translate(${newPoint.x}px, ${newPoint.y}px)`;
    };

    map.on("move", updatePosition);

    return () => {
      map.off("move", updatePosition);
    };
  }, [map, exchange.coordinates]);

  return (
    <>
      {/* Marker */}
      <div
        ref={markerRef}
        onClick={handleMarkerClick}
        className="transform -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative cursor-pointer group">
          <div
            className={cn(
              "absolute z-10 bg-black text-white text-xs font-semibold rounded-lg px-1.5 py-0.5 whitespace-nowrap",
              labelStyles[labelPosition],
              "transition-all duration-300"
            )}
          >
            {formatRate(exchange.rate, exchange.currency)}
          </div>
          <div className="relative flex items-center justify-center marker-hover-animation">
            <div className="absolute inset-0 bg-green-500 rounded-lg opacity-20 group-hover:opacity-30 transition-opacity"></div>
            <div
              className={cn(
                "w-10 h-10 flex items-center justify-center rounded-lg border-2",
                "bg-white shadow-md transform transition-transform",
                "group-hover:scale-110 group-hover:shadow-lg",
                exchange.isPopular ? "border-orange-500" : "border-green-600"
              )}
            >
              <Image
                src="/svg/exchange-icon.svg"
                alt="Exchange Office"
                width={20}
                height={20}
              />
              {exchange.isPopular && (
                <div className="absolute -top-2 -right-2 bg-orange-500 rounded-full p-0.5">
                  <Flame size={12} className="text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          ref={popupRef}
          className="exchange-popup absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2"
          style={{
            top: `${map?.project(exchange.coordinates).y - 10}px`,
            left: `${map?.project(exchange.coordinates).x}px`,
          }}
        >
          <div
            className="bg-white rounded-lg shadow-lg overflow-hidden"
            style={{ width: "330px" }}
          >
            <button
              className="absolute top-2 right-2 z-30 bg-white rounded-full p-1 shadow-md"
              onClick={() => setShowPopup(false)}
            >
              ×
            </button>

            <div className="p-0">
              {exchange.images && exchange.images.length > 0 && (
                <div className="relative h-[140px] w-full overflow-hidden">
                  <Image
                    src={exchange.images[currentImageIndex]}
                    alt={exchange.name}
                    fill
                    className="object-cover"
                  />

                  {exchange.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1 shadow-md z-10 hover:bg-white transition-colors"
                      >
                        <ChevronRight
                          size={16}
                          className="transform rotate-180"
                        />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 rounded-full p-1 shadow-md z-10 hover:bg-white transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </>
                  )}

                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                    {exchange.images.map((_, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          idx === currentImageIndex ? "bg-white" : "bg-white/60"
                        )}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex items-center gap-2">
                    {exchange.isPopular && (
                      <span className="flex items-center gap-1 text-xs font-medium bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">
                        <Flame size={12} />
                        Popular Exchange
                      </span>
                    )}
                    <button className="bg-gray-100 text-gray-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      Open
                    </button>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900">
                  {exchange.name}
                </h3>
                <div className="font-bold text-xl text-gray-900 mb-2">
                  {formatRate(exchange.rate, exchange.currency)}
                </div>

                <p className="text-sm text-gray-600 mb-1">
                  {exchange.address}, {exchange.city}
                  {exchange.state && `, ${exchange.state}`}{" "}
                  {exchange.postalCode}
                </p>

                <div className="flex items-center text-gray-600 text-sm mb-3">
                  <Clock size={14} className="mr-1" />
                  <span>{exchange.hours}</span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 bg-white border-gray-200 hover:bg-gray-50"
                  >
                    Get Direction
                  </Button>
                  <Button
                    className="w-10 h-10 p-0 bg-white border border-gray-200 rounded-lg hover:bg-gray-50"
                    variant="ghost"
                  >
                    <Image
                      src="/svg/more-button.svg"
                      alt="More"
                      width={24}
                      height={24}
                    />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExchangeMarker;
