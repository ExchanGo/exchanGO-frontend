"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";
import { Button } from "../ui/button";
import { LocationAutoComplete } from "../ui/LocationAutoComplete";
import { CurrencySelect } from "../ui/CurrencySelect";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loader from "../shared/Loader";
import DualCurrencySelector from "../ui/DualCurrencySelector";
import { getCurrencySymbol } from "@/lib/data/currencySymbols";
import { Separator } from "../ui/separator";
import { Typography } from "@/components/ui/typography";
import { motion, AnimatePresence } from "framer-motion";
import { exchangeService } from "@/lib/services/exchangeService";

const CurrencyConverter = () => {
  const router = useRouter();
  const [amount, setAmount] = useState("1000");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("rabat");
  const [selectedLocationData, setSelectedLocationData] = useState<any>(null);
  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("MAD");
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [error, setError] = useState<string | null>(null);

  const handleCheckRates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Validate that we have location data
      if (
        !selectedLocationData ||
        !selectedLocationData.latitude ||
        !selectedLocationData.longitude
      ) {
        throw new Error("Please select a valid location first");
      }

      console.log("Selected location data:", selectedLocationData);
      console.log("Selected currencies:", {
        from: sourceCurrency,
        to: targetCurrency,
      });

      let response;

      try {
        // First, try the simple API call (like your original curl - without currency parameters)
        console.log("Trying simple API call without currency parameters...");
        response = await exchangeService.getNearbyOfficesSimple(
          selectedLocationData.latitude,
          selectedLocationData.longitude,
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
          latitude: selectedLocationData.latitude,
          longitude: selectedLocationData.longitude,
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

      // Store the search results in sessionStorage or a global state
      // This will be used by the search results page
      if (typeof window !== "undefined") {
        sessionStorage.setItem("searchResults", JSON.stringify(response));
        sessionStorage.setItem(
          "searchParams",
          JSON.stringify({
            location: selectedLocationData,
            amount: amount,
            sourceCurrency: sourceCurrency,
            targetCurrency: targetCurrency,
          })
        );
      }

      // Redirect to search results page
      router.push("/search");
    } catch (error) {
      console.error("Error checking rates:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while checking rates"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrencyChange = (currencies: { from: string; to: string }) => {
    setSourceCurrency(currencies.from);
    setTargetCurrency(currencies.to);
    console.log("Selected currencies:", currencies);
  };

  // Update currency symbol when source currency changes
  useEffect(() => {
    setCurrencySymbol(getCurrencySymbol(sourceCurrency));
  }, [sourceCurrency]);

  const handleLocationChange = (value: string, locationData?: any) => {
    setLocation(value);
    setSelectedLocationData(locationData);
    setError(null); // Clear any previous errors when location changes
    console.log("Selected location:", value, locationData);
  };

  return (
    <div className="w-auto max-w-full -mt-16 absolute z-30 inset-x-0 bg-white rounded-xl shadow-xl p-4 flex flex-col md:flex-row items-center mx-24 my-10">
      {/* Location */}
      <div className="flex-1 max-w-[260px] py-3 px-5">
        <Typography fontFamily="dm" className="text-sm text-black font-medium">
          Location
        </Typography>

        <LocationAutoComplete
          defaultValue={location}
          onLocationChange={handleLocationChange}
          // label="Location"
          iconClassName="text-[#292D32]"
        />
      </div>

      {/* Separator */}
      <div className="h-[70px] flex items-center justify-center px-0.5">
        <Separator
          orientation="vertical"
          className="h-[80%] w-[1px] bg-[var(--color-lite)]"
        />
      </div>

      {/* Amount */}
      <div className="flex-1 max-w-[260px] py-3 px-5">
        <Typography
          fontFamily="dm"
          className="text-sm text-black font-medium mb-2"
        >
          Amount
        </Typography>
        <div className="flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={currencySymbol}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.8,
                },
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.8,
                transition: {
                  duration: 0.2,
                },
              }}
              className="text-lg mr-1 font-medium text-[var(--color-greeny-bold)]"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {currencySymbol}
            </motion.span>
          </AnimatePresence>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-lg focus:outline-none"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          />
        </div>
      </div>

      {/* Separator */}
      <div className="h-[70px] flex items-center justify-center px-0.5">
        <Separator
          orientation="vertical"
          className="h-[80%] w-[1px] bg-[var(--color-lite)]"
        />
      </div>

      <div className="flex-1 grow-2">
        <DualCurrencySelector
          fromLabel="Change from"
          toLabel="Change to"
          onCurrencyChange={handleCurrencyChange}
        >
          {({ fromProps, toProps, fromLabel, toLabel }) => (
            <>
              <div className="flex-1 py-3 px-5">
                <Typography
                  fontFamily="dm"
                  className="text-sm text-black font-medium mb-2"
                >
                  Source Currency
                </Typography>
                <CurrencySelect {...fromProps} label={fromLabel} />
              </div>

              {/* Swap Button */}
              <div className="flex items-center h-full overflow-hidden">
                <div className="h-[70px] flex flex-col items-center justify-center">
                  <Separator
                    orientation="vertical"
                    className="h-full w-[1px] bg-[var(--color-lite)]"
                  />
                  <button className="rounded-full">
                    <Image
                      src="/svg/exchange-rotate.svg"
                      alt="Exchange currencies"
                      width={16}
                      height={16}
                      className="h-8 w-8"
                      priority
                    />
                  </button>
                  <Separator
                    orientation="vertical"
                    className="h-full w-[1px] bg-[var(--color-lite)]"
                  />
                </div>
              </div>

              <div className="flex-1 p-3">
                <Typography
                  fontFamily="dm"
                  className="text-sm text-black font-medium mb-2"
                >
                  Target Currency
                </Typography>
                <CurrencySelect {...toProps} label={toLabel} />
              </div>
            </>
          )}
        </DualCurrencySelector>
      </div>

      {/* Check Rates Button */}
      <div className="flex items-center justify-center pl-3 pr-3">
        <Button
          variant="gradient"
          onClick={handleCheckRates}
          size="lg"
          className="leading-snug"
          style={{ fontFamily: "var(--font-dm-sans)" }}
          disabled={isLoading}
        >
          <Clock className="h-5 w-5 text-[var(--color-greeny)]" />
          {isLoading ? "Checking..." : "Check Rates"}
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 mx-24">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        </div>
      )}

      {isLoading && <Loader />}
    </div>
  );
};

export default CurrencyConverter;
