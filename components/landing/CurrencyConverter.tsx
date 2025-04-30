"use client";

import { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "../ui/button";
import { LoactionSelect } from "../ui/LocationSelect";
import { CurrencySelect } from "../ui/CurrencySelect";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loader from "../shared/Loader";
import DualCurrencySelector from "../ui/DualCurrencySelector";

const CurrencyConverter = () => {
  const router = useRouter();
  const [amount, setAmount] = useState("1000");
  const [isLoading, setIsLoading] = useState(false);
  // const [location, setLocation] = useState("Birmingham - Eng");
  // const [sourceCurrency, setSourceCurrency] = useState("USD");
  // const [targetCurrency, setTargetCurrency] = useState("Rupiah");

  const handleCheckRates = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/search");
    }, 3000);
  };

  const handleCurrencyChange = (currencies: { from: string; to: string }) => {
    console.log("Selected currencies:", currencies);
  };

  return (
    <div className="w-auto max-w-full -mt-16 absolute z-30 inset-x-0 bg-white rounded-xl shadow-xl p-4 flex flex-col md:flex-row items-center mx-16 my-10">
      {/* Location */}
      <div className="flex-1 border-r py-3 px-5">
        <p className="text-sm text-black text-medium mb-2">Location</p>

        <LoactionSelect
          label="Change from"
          iconClassName="text-[#292D32]"
          onValueChange={(value) => console.log("Selected city:", value)}
        />
      </div>

      {/* Amount */}
      <div className="flex-1 border-r py-3 px-5">
        <p className="text-sm text-black text-medium mb-2">Amount</p>
        <div className="flex items-center">
          <span className="text-lg mr-1">$</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-lg focus:outline-none"
          />
        </div>
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
              <div className="flex items-center h-full">
                <div className="h-[70px] flex flex-col items-center justify-center">
                  <div className="h-full w-[1.5px] bg-[var(--color-lite)]"></div>
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
                  <div className="h-full w-[1.5px] bg-[var(--color-lite)]"></div>
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
      <div className="flex items-center justify-center pl-3">
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
