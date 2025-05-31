import { LocationFeature } from "@/lib/mapbox/utils";
import { ExternalLink, Phone, Timer } from "lucide-react";
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

export function LocationPopup({ location, onClose }: LocationPopupProps) {
  const [selectValue, setSelectValue] = useState("");

  if (!location) return null;

  const { properties, geometry } = location;

  const name = properties?.name || "Unknown Location";

  const lat = geometry?.coordinates?.[1] || properties?.coordinates?.latitude;
  const lng = geometry?.coordinates?.[0] || properties?.coordinates?.longitude;

  const handleSelectAction = (value: string) => {
    if (value === "rate-alert") {
      openModal("MODAL_WHATSAPP_ALERT", { step: 0 });
    } else if (value === "share") {
      openModal("MODAL_SHARE_EXCHANGE", {
        exchangeId: "123",
        exchangeData: {
          name: "DirhamX",
          location: "Rabat, Morocco",
          rate: "Rp 16450",
          lastUpdate: "16 April 2025",
          image: "/img/dirham-alert.png",
          link: "https://www.exchangego24.com/tdjs...",
        },
      });
    } else if (value === "call") {
      window.open("tel:+1234567890");
    }
    setSelectValue("");
  };

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
        className="overflow-hidden bg-white rounded-lg border shadow-lg w-[190px]"
      >
        {/* Compact image header */}
        <div className="relative w-full h-16 overflow-hidden">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/e0b0e015be8841d68e922a989572049c/e9f1840681e65187d02abf6f65958b364feba223?placeholderIfAbsent=true"
            alt={`${name} office`}
            className="object-cover w-full h-full"
          />
        </div>

        {/* Content section */}
        <div className="p-3">
          {/* Status badges */}
          <div className="flex justify-between gap-1 mb-2">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-1 px-1.5 py-0.5 bg-orange-50 rounded text-orange-700 border border-orange-200"
            >
              <Timer className="w-3 h-3" />
              <span className="text-xs font-medium">🔥 Popular</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="flex items-center gap-1 px-1.5 py-0.5 bg-green-50 rounded text-green-700 border border-green-200"
            >
              <Timer className="w-3 h-3" />
              <span className="text-xs font-medium">Open</span>
            </motion.div>
          </div>

          {/* Main content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-sm font-semibold text-neutral-900 mb-1">
              Atlas Exchange
            </h3>
            <p className="text-lg font-bold text-neutral-900 mb-2">RP16520</p>

            <div className="text-xs text-zinc-600 mb-3 space-y-0.5">
              <p className="leading-tight">
                4140 Parker Rd. Allentown, New Mexico 31134
              </p>
              <p className="leading-tight">07:00 - 20:00</p>
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
              </SelectContent>
            </Select>
          </motion.div>
        </div>
      </motion.article>
    </Popup>
  );
}
