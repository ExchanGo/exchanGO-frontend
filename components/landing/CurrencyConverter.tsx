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
import { motion, AnimatePresence } from "framer-motion";
import { Separator } from "../ui/separator";

const CurrencyConverter = () => {
  const router = useRouter();
  const [amount, setAmount] = useState("1000");
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState("rabat");
  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("MAD");
  const [currencySymbol, setCurrencySymbol] = useState("$");

  const handleCheckRates = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/search");
    }, 3000);
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

  const handleLocationChange = (value: string) => {
    setLocation(value);
    console.log("Selected location:", value);
  };

  return (
    <div className="w-auto max-w-full -mt-16 absolute z-30 inset-x-0 bg-white rounded-xl shadow-xl p-4 flex flex-col md:flex-row items-center mx-24 my-10">
      {/* Location */}
      <div className="flex-1 py-3 px-5">
        <p className="text-sm text-black text-medium mb-2">Location</p>

        <LocationAutoComplete
          defaultValue={location}
          onLocationChange={handleLocationChange}
          label="Location"
          iconClassName="text-[#292D32]"
          className="mt-2"
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
      <div className="flex-1 py-3 px-5">
        <p className="text-sm text-black text-medium mb-2">Amount</p>
        <div className="flex items-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={currencySymbol}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
              className="text-lg mr-1 font-medium text-[var(--color-greeny-bold)]"
            >
              {currencySymbol}
            </motion.span>
          </AnimatePresence>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-lg focus:outline-none"
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
                <p className="text-sm text-black text-medium mb-2">
                  Source Currency
                </p>
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
                <p className="text-sm text-black text-medium mb-2">
                  Target Currency
                </p>
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
          className="leading-snug font-dm"
        >
          <Clock className="h-5 w-5 text-[var(--color-greeny)]" />
          Check Rates
        </Button>
      </div>

      {isLoading && <Loader />}
    </div>
  );
};

export default CurrencyConverter;
