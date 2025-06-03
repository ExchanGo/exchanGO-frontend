"use client";

import React, { useState, useRef } from "react";
import { FloatingLocationAutoComplete } from "../ui/FloatingLocationAutoComplet";
import { FloatingAmountInput } from "../ui/FloatingAmountInput";
import { FloatingSelectCurrency } from "../ui/floating-select-currency";
import DualCurrencySelector from "../ui/DualCurrencySelector";
import { Button } from "../ui/button";
import { LocateFixed, Loader2 } from "lucide-react";
import Image from "next/image";
import {
  MapboxLocationResult,
  mapboxLocationService,
} from "@/lib/services/mapboxService";

export const SearchFilters: React.FC = () => {
  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [isLocating, setIsLocating] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<MapboxLocationResult | null>(null);
  const [locationKey, setLocationKey] = useState(0); // Force re-render
  const lastLocationCallRef = useRef<number>(0); // Track last call time

  const handleCurrencyChange = (currencies: { from: string; to: string }) => {
    setSourceCurrency(currencies.from);
    console.log("Selected currencies:", currencies);
  };

  const handleLocationChange = (
    value: string,
    location?: MapboxLocationResult
  ) => {
    if (location) {
      setSelectedLocation(location);
      console.log("Selected location:", location);
    }
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
    // Debounce: prevent calls within 1 second of each other
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
      // Check if geolocation is supported
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser.");
      }

      console.log("📍 Getting current location...");

      // Get current position
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000, // 5 minutes
          });
        }
      );

      const { latitude, longitude } = position.coords;
      console.log(`📍 Current coordinates: ${latitude}, ${longitude}`);

      // Reverse geocode to get location details
      const location = await mapboxLocationService.reverseGeocode(
        latitude,
        longitude
      );

      if (location) {
        console.log("✅ Location found:", location);

        // Update the FloatingLocationAutoComplete component
        setSelectedLocation(location);

        // Force re-render of the FloatingLocationAutoComplete component
        setLocationKey((prev) => prev + 1);

        // Trigger the callback
        handleLocationChange(location.id, location);

        // Also trigger the map locate button to center the map
        triggerMapLocateButton();

        console.log("📍 Location updated successfully");
      } else {
        throw new Error("Could not determine your location from coordinates.");
      }
    } catch (error) {
      console.error("❌ Error getting current location:", error);

      let errorMessage = "Error accessing your location. Please try again.";

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "Location access denied. Please enable location permissions.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information is unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again.";
            break;
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      alert(errorMessage);
    } finally {
      setIsLocating(false);
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
                placeholder="Search cities in Morocco"
                selectedLocationProp={selectedLocation}
                onLocationChange={handleLocationChange}
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
