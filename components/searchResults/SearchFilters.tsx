"use client";

import React, { useState, useRef, useEffect } from "react";
import { LocateFixed, Loader2 } from "lucide-react";
import { FloatingSelectCurrency } from "../ui/floating-select-currency";
import Image from "next/image";
import { Button } from "../ui/button";
import DualCurrencySelector from "../ui/DualCurrencySelector";
import { FloatingAmountInput } from "../ui/FloatingAmountInput";
import {
  FloatingLocationAutoComplete,
  LocationOption,
} from "../ui/FloatingLocationAutoComplet";

// Default cities for Morocco
const defaultCities: LocationOption[] = [
  { value: "casablanca", label: "Casablanca" },
  { value: "rabat", label: "Rabat" },
  { value: "marrakech", label: "Marrakech" },
  { value: "fes", label: "Fès" },
  { value: "tangier", label: "Tanger" },
  { value: "agadir", label: "Agadir" },
  { value: "meknes", label: "Meknès" },
  { value: "oujda", label: "Oujda" },
  { value: "kenitra", label: "Kénitra" },
  { value: "tetouan", label: "Tétouan" },
  { value: "safi", label: "Safi" },
  { value: "mohammedia", label: "Mohammedia" },
  { value: "el-jadida", label: "El Jadida" },
  { value: "beni-mellal", label: "Béni Mellal" },
  { value: "nador", label: "Nador" },
  { value: "taza", label: "Taza" },
  { value: "settat", label: "Settat" },
  { value: "larache", label: "Larache" },
];

export const SearchFilters: React.FC = () => {
  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [isLocating, setIsLocating] = useState(false);
  const [currentLocationValue, setCurrentLocationValue] = useState("");
  const [locationOptions, setLocationOptions] =
    useState<LocationOption[]>(defaultCities);
  const [locationKey, setLocationKey] = useState(0); // Force re-render
  const lastLocationCallRef = useRef<number>(0); // Track last call time

  const handleCurrencyChange = (currencies: { from: string; to: string }) => {
    setSourceCurrency(currencies.from);
    console.log("Selected currencies:", currencies);
  };

  // Function to trigger the locate-fixed button on map controls
  const triggerMapLocateButton = () => {
    try {
      // First try to call the globally exposed trackUserLocation function
      if (
        typeof window !== "undefined" &&
        (window as any).triggerMapLocationTracking
      ) {
        (window as any).triggerMapLocationTracking();
        console.log("🎯 Triggered map location tracking function directly");
        return true;
      }

      // Fallback: try to click the button directly
      if (typeof window !== "undefined" && (window as any).mapLocateButton) {
        const button = (window as any).mapLocateButton as HTMLButtonElement;
        if (button && !button.disabled) {
          button.click();
          console.log("🎯 Triggered map locate button directly");
          return true;
        }
      }

      // Try to find and click the locate-fixed button from map controls
      const locateButton = document.querySelector(
        'button:has(.lucide-locate-fixed), button[aria-label="Locate me"]'
      ) as HTMLButtonElement;

      if (locateButton && !locateButton.disabled) {
        locateButton.click();
        console.log("🎯 Triggered map locate button");
        return true;
      }

      // Alternative: try to find by icon class and get parent button
      const locateIcon = document.querySelector("svg.lucide-locate-fixed");
      if (locateIcon) {
        const button = locateIcon.closest("button") as HTMLButtonElement;
        if (button && !button.disabled) {
          button.click();
          console.log("🎯 Triggered map locate button (by icon)");
          return true;
        }
      }

      console.log("⚠️ Map locate button not found or disabled");
      return false;
    } catch (error) {
      console.error("❌ Error triggering map locate button:", error);
      return false;
    }
  };

  // Function to handle current location
  const handleUseCurrentLocation = async () => {
    // Debounce: prevent calls within 1 second of each other (reduced from 2 seconds)
    const now = Date.now();
    if (now - lastLocationCallRef.current < 1000) {
      console.log("⚠️ Location request debounced - too soon since last call");
      return;
    }
    lastLocationCallRef.current = now;

    // Prevent multiple simultaneous calls
    if (isLocating) {
      console.log("⚠️ Location request already in progress");
      return;
    }

    setIsLocating(true);

    try {
      // Trigger the map's locate button - this will always center on user location
      const mapLocateTriggered = triggerMapLocateButton();

      if (mapLocateTriggered) {
        console.log("✅ Map locate button triggered successfully");

        // Shorter wait time since we're just centering, not toggling tracking
        setTimeout(() => {
          console.log("📍 Map centered on your location");
        }, 500);
      } else {
        console.log("⚠️ Could not trigger map locate button");
        alert(
          "Could not center map on your location. Please try clicking the locate button on the map directly."
        );
      }
    } catch (error) {
      console.error("❌ Error centering map on location:", error);
      alert("Error accessing your location. Please try again.");
    } finally {
      // Reset loading state after a shorter delay
      setTimeout(() => {
        setIsLocating(false);
      }, 1000);
    }
  };

  return (
    <section className="flex flex-col justify-center px-8 py-6 leading-snug border-b border-neutral-200 max-md:px-5 max-md:max-w-full">
      <div className="w-full max-md:max-w-full">
        <div className="flex flex-wrap gap-5 items-end w-full max-md:max-w-full">
          <div className="flex gap-5 items-center min-w-60">
            <div className="self-stretch pt-2 my-auto w-[157px]">
              <FloatingLocationAutoComplete
                key={locationKey}
                label="Location"
                placeholder="Central park"
                defaultValue={currentLocationValue}
                locations={locationOptions}
                onLocationChange={(value: string) =>
                  console.log("New location:", value)
                }
              />
            </div>
            <div className="self-stretch pt-2 my-auto w-[157px]">
              <FloatingAmountInput
                label="Amount"
                placeholder="Enter amount"
                currencyCode={sourceCurrency}
                defaultValue="1"
                onChange={(value: string) => console.log("New Amount:", value)}
              />
            </div>
          </div>
          <div className="flex-1 pt-2">
            <DualCurrencySelector
              fromLabel="Source Currency"
              toLabel="Target Currency"
              onCurrencyChange={handleCurrencyChange}
            >
              {({ fromProps, toProps, fromLabel, toLabel }) => (
                <>
                  <FloatingSelectCurrency {...fromProps} label={fromLabel} />

                  <Image
                    src="/svg/exchange-rotate.svg"
                    alt="Exchange currencies"
                    width={24}
                    height={24}
                    className="h-6 w-6"
                    priority
                  />

                  <FloatingSelectCurrency {...toProps} label={toLabel} />
                </>
              )}
            </DualCurrencySelector>
          </div>
          <Button variant="gradient" className="h-12">
            Check Rates
          </Button>
        </div>
        <div className="flex flex-col items-start mt-4 w-full text-sm font-medium text-right text-[var(--color-greeny)] cursor-pointer max-md:pr-5 max-md:max-w-full">
          <button
            className="flex gap-1 items-center cursor-pointer hover:text-[var(--color-greeny-bold)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
          >
            {isLocating ? (
              <Loader2 className="w-4 h-4 animate-spin" color="#20523C" />
            ) : (
              <LocateFixed className="w-4 h-4" color="#20523C" />
            )}
            <span className="self-stretch my-auto">
              {isLocating ? "Getting location..." : "Use current location"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};
