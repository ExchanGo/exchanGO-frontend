"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { ExternalLink, Phone, MapPin, Star } from "lucide-react";
import { openModal } from "@/store/modals";

interface ExchangeOfficeCardProps {
  id: string;
  name: string;
  rate: string;
  location: string;
  hours: string;
  imageUrl: string;
  phone?: string;
  whatsapp?: string;
  distance?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  coordinates?: [number, number];
  slug?: string;
  isPopular?: boolean;
  isOpen?: boolean;
}

export const ExchangeOfficeCard: React.FC<ExchangeOfficeCardProps> = ({
  id,
  name,
  rate,
  location,
  hours,
  imageUrl,
  phone,
  whatsapp,
  distance,
  isVerified = false,
  isFeatured = false,
  coordinates,
  slug,
  isPopular = false,
  isOpen = true,
}) => {
  const [selectValue, setSelectValue] = useState<string>("");

  const handleSelectAction = (value: string) => {
    if (value === "rate-alert") {
      openModal("MODAL_WHATSAPP_ALERT", { step: 0 });
    } else if (value === "share") {
      openModal("MODAL_SHARE_EXCHANGE", {
        exchangeId: id,
        exchangeData: {
          name: name,
          location: location,
          rate: rate,
          lastUpdate: new Date().toLocaleDateString(),
          image: imageUrl,
          link: `https://www.exchangego24.com/office/${slug || id}`,
        },
      });
    } else if (value === "call" && phone) {
      window.open(`tel:${phone}`);
    } else if (value === "whatsapp" && whatsapp) {
      window.open(`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`);
    }
    // Reset select value after action
    setSelectValue("");
  };

  const handleGetDirection = () => {
    if (coordinates) {
      const [lng, lat] = coordinates;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, "_blank");
    }
  };

  // Determine if this office should show as popular
  const showAsPopular = isPopular || isFeatured;

  return (
    <article className="overflow-hidden bg-white rounded-lg border border-solid border-neutral-200 w-full h-full flex flex-col">
      <div className="overflow-hidden w-full text-xs font-medium leading-tight text-neutral-900">
        <div className="flex relative flex-col px-3 py-3.5 w-full aspect-[2.3]">
          <img
            src={imageUrl}
            alt={`${name} office`}
            className="object-cover absolute inset-0 size-full"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/img/default-office-logo.svg";
            }}
          />
          <div className="flex relative gap-5 justify-between w-full">
            <div className="flex gap-2">
              {showAsPopular && (
                <div className="flex gap-0.5 justify-center items-center p-1 bg-white rounded shadow-[0px_6px_24px_rgba(0,0,0,0.16)]">
                  <span className="self-stretch my-auto">
                    🔥 {isFeatured ? "Featured" : "Popular"} Exchange
                  </span>
                </div>
              )}
              {isVerified && (
                <div className="flex gap-0.5 justify-center items-center p-1 bg-green-100 text-green-800 rounded shadow-[0px_6px_24px_rgba(0,0,0,0.16)]">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="self-stretch my-auto text-xs">Verified</span>
                </div>
              )}
            </div>
            {isOpen && (
              <div className="flex gap-0.5 justify-center items-center p-1 whitespace-nowrap bg-white rounded shadow-[0px_6px_24px_rgba(0,0,0,0.16)]">
                <span className="self-stretch my-auto">Open</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between p-5 w-full flex-1">
        <div className="w-full flex-1">
          <div className="w-full">
            <h3 className="text-base font-semibold text-neutral-900 line-clamp-2">
              {name}
            </h3>
            <p className="mt-2 text-xl font-bold text-neutral-900">{rate}</p>
            <div className="mt-3 w-full text-sm text-zinc-600">
              <div className="flex items-start gap-1">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p className="leading-5 line-clamp-2">{location}</p>
              </div>
              <p className="mt-2 leading-snug text-xs">{hours}</p>
              {distance && (
                <p className="mt-1 text-xs text-gray-500">
                  {distance.toFixed(1)} km away
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-3 items-center mt-6 w-full">
          <Button
            variant="outline"
            size="xl"
            onClick={handleGetDirection}
            className="flex-1 gap-2.5 px-4 py-3 text-sm font-medium leading-snug text-green-900 rounded-md border border-green-900 border-solid"
          >
            Get Direction
          </Button>
          <Select value={selectValue} onValueChange={handleSelectAction}>
            <SelectTrigger
              hideIcon
              className="flex gap-2.5 items-center h-12 cursor-pointer p-2 rounded-md border border-green-900 border-solid w-[46px] bg-white focus:ring-0 focus:ring-offset-0 outline-none"
            >
              <Image
                src="/svg/more.svg"
                alt="more icon"
                width={24}
                height={24}
                priority
                className="w-full h-6"
              />
            </SelectTrigger>
            <SelectContent className="rounded-xl shadow-lg bg-white border border-gray-100 min-w-[220px] py-2">
              <SelectItem
                value="rate-alert"
                noCheckIcon
                className="inline-flex items-center gap-2 px-4 py-3 text-[#585858] text-base font-medium cursor-pointer hover:bg-gray-100 rounded-t-xl"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src="/svg/rate-alert.svg"
                    alt="rate alert icon"
                    width={20}
                    height={20}
                    priority
                    className="w-5 h-5 opacity-80"
                  />
                  <span>Rate Alert</span>
                </div>
              </SelectItem>
              <SelectItem
                value="share"
                noCheckIcon
                className="flex items-center gap-2 px-4 py-3 text-[#585858] text-base font-medium cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 opacity-70" />
                  <span>Share this Exchange</span>
                </div>
              </SelectItem>
              {phone && (
                <SelectItem
                  value="call"
                  noCheckIcon
                  className="px-4 py-3 text-[#585858] text-base font-medium cursor-pointer hover:bg-gray-100"
                >
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 opacity-70" />
                    <span>Call {name}</span>
                  </div>
                </SelectItem>
              )}
              {/* {whatsapp && (
                <SelectItem
                  value="whatsapp"
                  noCheckIcon
                  className="px-4 py-3 text-[#585858] text-base font-medium cursor-pointer hover:bg-gray-100 rounded-b-xl"
                >
                  <div className="flex items-center gap-2">
                    <Image
                      src="/svg/whatsapp.svg"
                      alt="whatsapp icon"
                      width={20}
                      height={20}
                      className="w-5 h-5 opacity-70"
                    />
                    <span>WhatsApp {name}</span>
                  </div>
                </SelectItem>
              )} */}
            </SelectContent>
          </Select>
        </div>
      </div>
    </article>
  );
};
