"use client";

import React, { useState } from "react";
import { FloatingLabelInput } from "../ui/FloatingLabelInput";
import { LocateFixed, MapPin } from "lucide-react";
import { FloatingSelectCurrency } from "../ui/floating-select-currency";
import Image from "next/image";
import { Button } from "../ui/button";
import DualCurrencySelector from "../ui/DualCurrencySelector";
import { FloatingAmountInput } from "../ui/FloatingAmountInput";
import { FloatingLocationAutoComplete } from "../ui/FloatingLocationAutoComplet";

export const SearchFilters: React.FC = () => {
  const [sourceCurrency, setSourceCurrency] = useState("USD");

  const handleCurrencyChange = (currencies: { from: string; to: string }) => {
    setSourceCurrency(currencies.from);
    console.log("Selected currencies:", currencies);
  };

  return (
    <section className="flex flex-col justify-center px-8 py-6 leading-snug border-b border-neutral-200 max-md:px-5 max-md:max-w-full">
      <div className="w-full max-md:max-w-full">
        <div className="flex flex-wrap gap-5 items-end w-full max-md:max-w-full">
          <div className="flex gap-5 items-center min-w-60">
            <div className="self-stretch pt-2 my-auto w-[157px]">
              <FloatingLocationAutoComplete
                label="Location"
                placeholder="Central park"
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
          <button className="flex gap-1 items-center">
            <LocateFixed className="w-4 h-4" color="#20523C" />
            <span className="self-stretch my-auto">Use current location</span>
          </button>
        </div>
      </div>
    </section>
  );
};
