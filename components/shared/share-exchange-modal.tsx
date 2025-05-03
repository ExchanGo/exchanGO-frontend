"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useModal } from "@/store/modals";
import { useEffect, useState } from "react";
import { ExternalLink, Link2 } from "lucide-react";

const SHARE_OPTIONS = [
  {
    label: "Whatsapp",
    description: "Share this exchange to whatsapp",
    icon: "/svg/Whatsapp.svg",
    color: "bg-green-500",
    url: (link: string) => `https://wa.me/?text=${encodeURIComponent(link)}`,
  },
  {
    label: "Telegram",
    description: "Share this exchange to Telegram",
    icon: "/svg/Telegram.svg",
    color: "bg-blue-400",
    url: (link: string) =>
      `https://t.me/share/url?url=${encodeURIComponent(link)}`,
  },
  {
    label: "Facebook",
    description: "Share this exchange to facebook",
    icon: "/svg/facebook.svg",
    color: "bg-[#3b5998]",
    url: (link: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        link
      )}`,
  },
  {
    label: "X formerly known as Twitter",
    description: "Share this exchange to X",
    icon: "/svg/x.svg",
    color: "bg-black",
    url: (link: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(link)}`,
  },
];

// Type guard for share modal payload
function isSharePayload(payload: unknown): payload is { exchangeData?: any } {
  return (
    typeof payload === "object" && payload !== null && "exchangeData" in payload
  );
}

export default function ShareExchangeModal() {
  const { isOpen, type, payloads, onClose } = useModal();
  const [copied, setCopied] = useState(false);

  let exchange;
  if (
    type === "MODAL_SHARE_EXCHANGE" &&
    isSharePayload(payloads) &&
    payloads.exchangeData
  ) {
    exchange = payloads.exchangeData;
  } else {
    exchange = {
      image: "/img/dirham-alert.png",
      name: "DirhamX",
      location: "Rabat, Morocco",
      lastUpdate: "16 April 2025",
      rate: "Rp 16450",
      link: "https://www.exchangego24.com/tdjs...",
    };
  }

  useEffect(() => {
    if (!isOpen) setCopied(false);
  }, [isOpen]);

  if (type !== "MODAL_SHARE_EXCHANGE") return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] max-w-md w-full">
        <DialogHeader className="pt-6">
          <DialogTitle className="text-black text-lg font-bold px-6">
            Share This Exchange
          </DialogTitle>
          <DialogDescription className="text-[#585858] text-sm px-6">
            Quickly share the exchange details — via message, email, or link.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 px-6 pb-6">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <Image
              src={exchange.image}
              alt={exchange.name}
              width={120}
              height={120}
              className="rounded-l-md object-cover w-[120px] h-full"
            />
            <div className="flex flex-col gap-1 px-4 py-2">
              <span className="font-bold text-base text-black">
                {exchange.name}
              </span>
              <span className="text-gray-600 text-sm">{exchange.location}</span>
              <span className="text-gray-400 text-sm">
                last update, {exchange.lastUpdate}
              </span>
              <span className="font-bold text-lg text-black mt-1">
                {exchange.rate}
              </span>
            </div>
          </div>
          <div className="flex gap-2 mt-2">
            <div className="flex items-center flex-1 rounded-md border border-gray-200 bg-gray-50 px-3 py-2">
              <Link2 className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                value={exchange.link}
                readOnly
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700 p-0"
              />
            </div>
            <Button
              variant="gradient"
              size="lg"
              onClick={() => {
                navigator.clipboard.writeText(exchange.link);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            >
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>
          <div className="mt-2">
            <span className="text-gray-700 text-sm font-medium">Share to:</span>
            <div className="flex flex-col gap-5 mt-3">
              {SHARE_OPTIONS.map((opt) => (
                <div
                  key={opt.label}
                  className="flex items-center justify-between gap-3 font-semibold text-base"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-11 h-11 border border-[#DEDEDE] rounded-md p-1.5 bg-white">
                      <Image
                        src={opt.icon}
                        alt={opt.label}
                        width={32}
                        height={32}
                        className="size-full"
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-black">{opt.label}</span>
                      <span className="text-sm font-normal text-[#585858]">
                        {opt.description}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="icon"
                    aria-label={`Share to ${opt.label}`}
                    className={`w-fit px-5 py-3 text-white ${opt.color} transition-all duration-150 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2`}
                    onClick={() =>
                      window.open(
                        opt.url(exchange.link),
                        "_blank",
                        "noopener,noreferrer"
                      )
                    }
                  >
                    <ExternalLink className="w-5 h-5" color="#fff" />
                    <span className="ml-auto">Share</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
