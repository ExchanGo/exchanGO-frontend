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
import { useRouter } from "next/navigation";
import { exchangeService } from "@/lib/services/exchangeService";

export const SearchFilters: React.FC = () => {
  const router = useRouter();
  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("MAD");
  const [amount, setAmount] = useState("1000");
  const [isLocating, setIsLocating] = useState(false);
  const [isCheckingRates, setIsCheckingRates] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<MapboxLocationResult | null>(null);
  const [locationKey, setLocationKey] = useState(0); // Force re-render
  const [error, setError] = useState<string | null>(null);
  const lastLocationCallRef = useRef<number>(0); // Track last call time

  const handleCurrencyChange = (currencies: { from: string; to: string }) => {
    setSourceCurrency(currencies.from);
    setTargetCurrency(currencies.to);
    console.log("Selected currencies:", currencies);
  };

  const handleLocationChange = (
    value: string,
    location?: MapboxLocationResult
  ) => {
    if (location) {
      setSelectedLocation(location);
      setError(null); // Clear any previous errors when location changes
      console.log("Selected location:", location);
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    console.log("New Amount:", value);
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

  // Function to handle check rates button click
  const handleCheckRates = async () => {
    setIsCheckingRates(true);
    setError(null);

    try {
      // Validate that we have location data
      if (
        !selectedLocation ||
        !selectedLocation.latitude ||
        !selectedLocation.longitude
      ) {
        throw new Error("Please select a valid location first");
      }

      console.log("Selected location data:", selectedLocation);
      console.log("Selected currencies:", {
        from: sourceCurrency,
        to: targetCurrency,
      });

      let response;

      try {
        // First, try the simple API call (without currency parameters)
        console.log("Trying simple API call without currency parameters...");
        response = await exchangeService.getNearbyOfficesSimple(
          selectedLocation.latitude,
          selectedLocation.longitude,
          10 // 10km radius
        );
        console.log("Simple API call succeeded!");
      } catch (simpleError) {
        console.log(
          "Simple API call failed, trying with currency parameters...",
          simpleError
        );

        // If simple call fails, try with currency parameters
        const requestParams = {
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
          radiusInKm: 10,
          targetCurrency: targetCurrency,
          baseCurrency: sourceCurrency,
        };

        // Validate parameters
        const validationErrors =
          exchangeService.validateNearbyOfficesRequest(requestParams);
        if (validationErrors.length > 0) {
          throw new Error(validationErrors.join(", "));
        }

        response = await exchangeService.getNearbyOffices(requestParams);
      }

      console.log("Final API Response:", response);

      // Store the search results in sessionStorage
      if (typeof window !== "undefined") {
        // Structure the data properly for the useSearchResults hook
        const structuredResults = {
          offices: Array.isArray(response) ? response : response.offices || [],
          totalCount: Array.isArray(response)
            ? response.length
            : response.totalCount || 0,
          searchRadius: 10, // 10km radius as used in the API call
          centerLocation: {
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
          },
        };

        const searchParams = {
          location: selectedLocation,
          amount: amount,
          sourceCurrency: sourceCurrency,
          targetCurrency: targetCurrency,
        };

        // Update sessionStorage
        sessionStorage.setItem(
          "searchResults",
          JSON.stringify(structuredResults)
        );
        sessionStorage.setItem("searchParams", JSON.stringify(searchParams));

        // Trigger a custom storage event to force components to update
        // This ensures all components listening to search results get updated
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: "searchResults",
            newValue: JSON.stringify(structuredResults),
            storageArea: sessionStorage,
          })
        );

        // Also dispatch a custom event for same-window updates
        window.dispatchEvent(
          new CustomEvent("searchResultsUpdated", {
            detail: { results: structuredResults, params: searchParams },
          })
        );

        console.log(
          `✅ Successfully loaded ${structuredResults.offices.length} exchange offices`
        );

        // Show success message
        if (structuredResults.offices.length > 0) {
          console.log(
            `🎯 Found ${structuredResults.offices.length} exchange offices in your area`
          );
        } else {
          setError(
            "No exchange offices found in your area. Try expanding your search radius."
          );
        }
      }
    } catch (error) {
      console.error("Error checking rates:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while checking rates"
      );
    } finally {
      setIsCheckingRates(false);
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
                defaultValue={amount}
                onChange={handleAmountChange}
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
          <Button
            variant="gradient"
            className="h-12"
            onClick={handleCheckRates}
            disabled={isCheckingRates}
          >
            {isCheckingRates ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Checking...
              </>
            ) : (
              "Check Rates"
            )}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 font-dm">{error}</p>
          </div>
        )}

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
