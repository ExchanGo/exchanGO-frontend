"use client";

import React from "react";
import { FloatingLabelInput } from "../ui/FloatingLabelInput";
import { LocateFixed, MapPin } from "lucide-react";
import { FloatingSelectCurrency } from "../ui/floating-select-currency";
import Image from "next/image";
import { Button } from "../ui/button";

export const SearchFilters: React.FC = () => {
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
              <FloatingLabelInput
                label="Amount"
                placeholder="$ 1"
                onChange={(value: string) => console.log("New Amount:", value)}
              />
            </div>
          </div>
          <div className="flex grow shrink items-center gap-4 pt-2 min-w-60 w-[333px]">
            <FloatingSelectCurrency
              label="Source Currency"
              defaultValue="USD"
              onValueChange={(value) => console.log("Source currency:", value)}
            />

            <Image
              src="/svg/exchange-rotate.svg"
              alt="Exchange currencies"
              width={24}
              height={24}
              className="h-6 w-6"
              priority
            />

            <FloatingSelectCurrency
              label="Target Currency"
              defaultValue="USD"
              onValueChange={(value) => console.log("Source currency:", value)}
            />
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
