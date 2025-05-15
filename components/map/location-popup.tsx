import { LocationFeature } from "@/lib/mapbox/utils";
import { ExternalLink, Phone, Timer } from "lucide-react";
import Popup from "./map-popup";
import { Button } from "../ui/button";
import Image from "next/image";
import { Select, SelectTrigger, SelectContent, SelectItem } from "../ui/select";
import { useState } from "react";
import { openModal } from "@/store/modals";

type LocationPopupProps = {
  location: LocationFeature;
  onClose?: () => void;
};
export function LocationPopup({ location, onClose }: LocationPopupProps) {
  const [selectValue, setSelectValue] = useState("");

  if (!location) return null;

  const { properties, geometry } = location;

  const name = properties?.name || "Unknown Location";
  // const address = properties?.full_address || properties?.address || "";
  // const categories = properties?.poi_category || [];
  // const brand = properties?.brand?.[0] || "";
  // const status = properties?.operational_status || "";
  // const maki = properties?.maki || "";

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
      // Example: open tel: link
      window.open("tel:+1234567890");
    }
    // Reset select value after action
    setSelectValue("");
  };
  return (
    <Popup
      latitude={lat}
      longitude={lng}
      onClose={onClose}
      offset={15}
      closeButton={true}
      closeOnClick={false}
      className="location-popup"
      focusAfterOpen={false}
    >
      <article className="overflow-hidden grow shrink self-stretch my-auto bg-white rounded-lg border border-solid border-neutral-200 min-w-60 w-[221px]">
        <div className="overflow-hidden w-full text-xs font-medium leading-tight text-neutral-900">
          <div className="flex relative flex-col px-3 py-3.5 w-full aspect-[2.3]">
            <img
              src={
                "https://cdn.builder.io/api/v1/image/assets/e0b0e015be8841d68e922a989572049c/e9f1840681e65187d02abf6f65958b364feba223?placeholderIfAbsent=true"
              }
              alt={`${name} office`}
              className="object-cover absolute inset-0 size-full"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center w-full p-4">
          <div className="flex relative justify-between w-full mb-2">
            <div className="flex gap-0.5 justify-center items-center p-1 bg-white rounded border border-[#DEDEDE]">
              <span className="self-stretch inline-flex items-center gap-1 my-auto">
                <Timer className="w-4 h-4" />
                🔥 Popular Exchange
              </span>
            </div>
            <div className="flex gap-0.5 justify-center items-center p-1 whitespace-nowrap bg-white rounded border border-[#DEDEDE]">
              <span className="self-stretch inline-flex items-center gap-1 my-auto">
                {" "}
                <Timer className="w-4 h-4" />
                Open
              </span>
            </div>
          </div>
          <div className="w-full min-h-[191px]">
            <div className="w-full h-[103px]">
              <div className="w-full">
                <h3 className="text-base text-neutral-900">Atlas Exchange</h3>
                <p className="mt-1 text-xl font-bold text-neutral-900">
                  RP16520
                </p>
                <div className="mt-3 w-60 max-w-full text-sm text-zinc-600">
                  <p className="leading-5">
                    4140 Parker Rd. Allentown, New Mexico 31134
                  </p>
                  <p className="mt-1 leading-snug">07:00 - 20:00</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 items-center mt-11 w-full min-h-[46px] max-md:mt-10">
              <Button
                variant="outline"
                size="xl"
                className="flex-1 shrink gap-2.5 self-stretch px-6 py-3 my-auto text-base font-medium leading-snug text-green-900 rounded-md border border-green-900 border-solid basis-0 max-md:px-5"
              >
                Get Direction
              </Button>
              <Select value={selectValue} onValueChange={handleSelectAction}>
                <SelectTrigger
                  hideIcon
                  className="flex gap-2.5 items-center h-12 cursor-pointer self-stretch p-2 my-auto rounded-md border border-green-900 border-solid w-[46px] bg-white focus:ring-0 focus:ring-offset-0 outline-none"
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
                  <SelectItem
                    value="call"
                    noCheckIcon
                    className="px-4 py-3 text-[#585858] text-base font-medium cursor-pointer hover:bg-gray-100 rounded-b-xl"
                  >
                    <div className="flex items-center gap-2">
                      <Phone className="w-5 h-5 opacity-70" />
                      <span>Call Atlas exchange ( Mobile )</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </article>
    </Popup>
  );
}
