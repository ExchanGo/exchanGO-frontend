"use client";

import React, { useState, useEffect } from "react";
import { FloatingLabelInput } from "../ui/FloatingLabelInput";
import { FloatingAmountInput } from "../ui/FloatingAmountInput";
import { LocateFixed, MapPin } from "lucide-react";
import { FloatingSelectCurrency } from "../ui/floating-select-currency";
import Image from "next/image";
import { Button } from "../ui/button";
import DualCurrencySelector from "../ui/DualCurrencySelector";

export const SearchFilters: React.FC = () => {
  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("MAD");
  const [amount, setAmount] = useState("1");

  const handleCurrencyChange = (currencies: { from: string; to: string }) => {
    setSourceCurrency(currencies.from);
    setTargetCurrency(currencies.to);
    console.log("Selected currencies:", currencies);
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    console.log("New Amount:", value);
  };

  return (
    <section className="flex overflow-hidden flex-col justify-center px-8 py-6 leading-snug border-b border-neutral-200 max-md:px-5 max-md:max-w-full">
      <div className="w-full max-md:max-w-full">
        <div className="flex flex-wrap gap-5 items-end w-full max-md:max-w-full">
          <div className="flex gap-5 items-center min-w-60">
            <div className="self-stretch pt-2 my-auto w-[157px]">
              <FloatingLabelInput
                label="Location"
                placeholder="Central park"
                icon={MapPin}
                onChange={(value: string) =>
                  console.log("New location:", value)
                }
              />
            </div>
            <div className="self-stretch pt-2 my-auto w-[157px]">
              <FloatingAmountInput
                label="Amount"
                placeholder="Enter amount"
                currencyCode={sourceCurrency}
                onChange={handleAmountChange}
                defaultValue={amount}
              />
            </div>
          </div>

          <div className="flex-1">
            <DualCurrencySelector
              fromLabel="Source"
              toLabel="Target"
              onCurrencyChange={handleCurrencyChange}
            >
              {({ fromProps, toProps, fromLabel, toLabel }) => (
                <div className="flex gap-5">
                  <div className="flex-1">
                    <FloatingSelectCurrency
                      {...fromProps}
                      label="Source Currency"
                    />
                  </div>
                  <div className="flex-1">
                    <FloatingSelectCurrency
                      {...toProps}
                      label="Target Currency"
                    />
                  </div>
                </div>
              )}
            </DualCurrencySelector>
          </div>

          <Button variant="gradient" className="h-12 px-6">
            Search
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
