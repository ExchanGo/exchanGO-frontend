import { LocationFeature } from "@/lib/mapbox/utils";
import { ExternalLink, Phone, Timer, MapPin, Clock } from "lucide-react";
import Popup from "./map-popup";
import { Button } from "../ui/button";
import Image from "next/image";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { useState } from "react";
import { openModal } from "@/store/modals";
import { motion } from "framer-motion";

type LocationPopupProps = {
  location: LocationFeature;
  onClose?: () => void;
};

// Define types for the metadata
interface ExchangeRate {
  rate: string | number;
  toCurrency?: {
    symbol?: string;
    code?: string;
  };
}

interface ExchangeMetadata {
  officeId?: string | number;
  phone?: string;
  whatsapp?: string;
  distance?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  rates?: ExchangeRate[];
  slug?: string;
  logo?: string;
}

export function LocationPopup({ location, onClose }: LocationPopupProps) {
  const [selectValue, setSelectValue] = useState("");

  if (!location) return null;

  const { properties, geometry } = location;
  const name = properties?.name || "Unknown Location";
  const lat = geometry?.coordinates?.[1] || properties?.coordinates?.latitude;
  const lng = geometry?.coordinates?.[0] || properties?.coordinates?.longitude;

  // Check if this is an exchange office
  const isExchangeOffice = properties?.mapbox_id?.startsWith("exchange-");
  const metadata = properties?.metadata as ExchangeMetadata | undefined;

  const handleSelectAction = (value: string) => {
    if (value === "rate-alert") {
      openModal("MODAL_WHATSAPP_ALERT", { step: 0 });
    } else if (value === "share") {
      openModal("MODAL_SHARE_EXCHANGE", {
        exchangeId: String(metadata?.officeId || "123"),
        exchangeData: {
          name: name,
          location: properties?.place_formatted || "Unknown Location",
          rate: getBestRate(),
          lastUpdate: new Date().toLocaleDateString(),
          image: getOfficeImage(),
          link: `https://www.exchangego24.com/office/${metadata?.slug || ""}`,
        },
      });
    } else if (value === "call") {
      const phoneNumber = metadata?.phone || metadata?.whatsapp;
      if (phoneNumber) {
        window.open(`tel:${phoneNumber}`);
      }
    }
    setSelectValue("");
  };

  // Get the best rate from the office rates
  const getBestRate = (): string => {
    if (
      !metadata?.rates ||
      !Array.isArray(metadata.rates) ||
      metadata.rates.length === 0
    ) {
      return "Rate not available";
    }

    try {
      // Find the best rate (assuming higher is better for selling)
      const bestRate = metadata.rates.reduce((best, current) => {
        const currentRate = parseFloat(String(current.rate));
        const bestRateValue = parseFloat(String(best.rate));
        return currentRate > bestRateValue ? current : best;
      });

      // Safely access the currency symbol
      const currencySymbol =
        bestRate?.toCurrency?.symbol || bestRate?.toCurrency?.code || "";
      const rateValue = bestRate?.rate || "N/A";

      return `${currencySymbol}${rateValue}`;
    } catch (error) {
      console.error("Error getting best rate:", error);
      return "Rate not available";
    }
  };

  // Get office image
  const getOfficeImage = (): string => {
    if (metadata?.logo) {
      return metadata.logo;
    }
    return "/img/default-office-logo.svg";
  };

  // Format distance
  const formatDistance = (): string | null => {
    if (metadata?.distance && typeof metadata.distance === "number") {
      return `${metadata.distance.toFixed(1)} km away`;
    }
    return null;
  };

  // If it's a regular location (not an exchange office)
  if (!isExchangeOffice) {
    return (
      <Popup
        latitude={lat}
        longitude={lng}
        onClose={onClose}
        offset={40}
        closeButton={true}
        closeOnClick={true}
        className="location-popup"
        focusAfterOpen={false}
      >
        <motion.article
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 10 }}
          transition={{
            duration: 0.2,
            ease: "easeOut",
          }}
          className="overflow-hidden bg-white rounded-lg border shadow-lg w-[200px]"
        >
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-semibold text-neutral-900">{name}</h3>
            </div>

            {properties?.place_formatted && (
              <p className="text-xs text-zinc-600 mb-3">
                {properties.place_formatted}
              </p>
            )}

            <Button
              variant="outline"
              size="sm"
              className="w-full text-xs font-medium text-green-900 border-green-900 hover:bg-green-50 h-8"
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                window.open(url, "_blank");
              }}
            >
              Get Direction
            </Button>
          </div>
        </motion.article>
      </Popup>
    );
  }

  // Exchange office popup
  return (
    <Popup
      latitude={lat}
      longitude={lng}
      onClose={onClose}
      offset={40}
      closeButton={true}
      closeOnClick={true}
      className="location-popup"
      focusAfterOpen={false}
    >
      <motion.article
        initial={{ opacity: 0, scale: 0.9, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 10 }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
        className="overflow-hidden bg-white rounded-lg border shadow-lg w-[220px]"
      >
        {/* Office image header */}
        <div className="relative w-full h-16 overflow-hidden bg-gray-100">
          <Image
            src={getOfficeImage()}
            alt={`${name} office`}
            fill
            className="object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/img/default-office-logo.svg";
            }}
          />
        </div>

        {/* Content section */}
        <div className="p-3">
          {/* Status badges */}
          <div className="flex justify-between gap-1 mb-2">
            {metadata?.isFeatured && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-50 rounded text-orange-700 border border-orange-200"
              >
                <Timer className="w-3 h-3" />
                <span className="text-xs font-medium">🔥 Featured</span>
              </motion.div>
            )}

            {metadata?.isVerified && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
                className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 rounded text-green-700 border border-green-200"
              >
                <Timer className="w-3 h-3" />
                <span className="text-xs font-medium">✓ Verified</span>
              </motion.div>
            )}
          </div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-neutral-900 mb-1 line-clamp-1">
              {name}
            </h3>

            <p className="text-lg font-bold text-neutral-900 mb-2">
              {getBestRate()}
            </p>

            <div className="text-xs text-zinc-600 mb-3 space-y-0.5">
              <p className="leading-tight line-clamp-2">
                {properties?.place_formatted}
              </p>

              {formatDistance() && (
                <p className="leading-tight text-blue-600 font-medium">
                  📍 {formatDistance()}
                </p>
              )}

              {(metadata?.phone || metadata?.whatsapp) && (
                <p className="leading-tight flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  {metadata?.phone || metadata?.whatsapp}
                </p>
              )}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="flex gap-2 items-center"
          >
            <Button
              variant="outline"
              size="sm"
              className="flex-1 text-xs font-medium text-green-900 border-green-900 hover:bg-green-50 h-8 px-3"
              onClick={() => {
                const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                window.open(url, "_blank");
              }}
            >
              Get Direction
            </Button>

            <Select value={selectValue} onValueChange={handleSelectAction}>
              <SelectTrigger
                hideIcon
                className="flex items-center justify-center h-8 w-8 p-1 rounded border border-green-900 bg-white hover:bg-green-50 focus:ring-0 focus:ring-offset-0 outline-none transition-colors"
              >
                <Image
                  src="/svg/more.svg"
                  alt="more icon"
                  width={16}
                  height={16}
                  priority
                  className="w-4 h-4"
                />
              </SelectTrigger>
              <SelectContent className="rounded-lg shadow-lg bg-white border border-gray-100 min-w-[160px] py-1">
                <SelectItem
                  value="rate-alert"
                  noCheckIcon
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium cursor-pointer hover:bg-gray-50 rounded-t-lg"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src="/svg/rate-alert.svg"
                      alt="rate alert icon"
                      width={14}
                      height={14}
                      priority
                      className="w-3.5 h-3.5 opacity-80"
                    />
                    <span>Rate Alert</span>
                  </div>
                </SelectItem>
                <SelectItem
                  value="share"
                  noCheckIcon
                  className="flex items-center gap-2 px-3 py-2 text-xs font-medium cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-2">
                    <ExternalLink className="w-3.5 h-3.5 opacity-70" />
                    <span>Share Exchange</span>
                  </div>
                </SelectItem>
                {(metadata?.phone || metadata?.whatsapp) && (
                  <SelectItem
                    value="call"
                    noCheckIcon
                    className="px-3 py-2 text-xs font-medium cursor-pointer hover:bg-gray-50 rounded-b-lg"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 opacity-70" />
                      <span>Call Exchange</span>
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </motion.div>
        </div>
      </motion.article>
    </Popup>
  );
}
