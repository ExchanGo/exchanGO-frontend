"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface Currency {
  value: string;
  label: string;
  flag: string;
  fullName: string;
}

interface FloatingSelectCurrencyProps {
  value: string;
  onValueChange: (value: string) => void;
  currencies: Currency[];
  label: string;
  className?: string;
}

export function FloatingSelectCurrency({
  value,
  onValueChange,
  currencies,
  label,
  className,
}: FloatingSelectCurrencyProps) {
  const [isFocused, setIsFocused] = useState(false);

  const selectedCurrency = currencies.find((c) => c.value === value);

  return (
    <div className="relative w-full">
      <label
        className={cn(
          "absolute z-10 -top-2 left-3 px-1.5 text-xs font-medium",
          "bg-white font-dm text-black",
          isFocused && "text-[var(--color-greeny-bold)]"
        )}
      >
        {label}
      </label>
      <div
        className={cn(
          "flex items-center gap-2 px-4 py-2 w-full",
          "rounded-lg border border-[var(--color-lite)]",
          "hover:border-[var(--color-greeny-highlight)]",
          "focus-within:border-[var(--color-greeny)]",
          "focus-within:ring-1 focus-within:ring-[var(--color-greeny)]",
          "relative pt-4 bg-white transition-colors",
          className
        )}
      >
        <Select
          value={value}
          onValueChange={onValueChange}
          onOpenChange={(open) => setIsFocused(open)}
        >
          <SelectTrigger className="bg-white border-0 focus:ring-0 focus:ring-offset-0 outline-none px-0 py-0 h-6 font-dm text-lg text-[#585858]">
            {selectedCurrency && (
              <div className="flex items-center gap-2">
                <Image
                  src={selectedCurrency.flag}
                  alt={`${selectedCurrency.label} flag`}
                  width={20}
                  height={20}
                  className="rounded-full object-cover"
                />
                <span className="font-medium text-xs">
                  {selectedCurrency.value}
                </span>
              </div>
            )}
          </SelectTrigger>
          <SelectContent className="max-h-[300px] overflow-y-auto">
            {currencies.map((currency) => (
              <SelectItem
                noCheckIcon
                key={currency.value}
                value={currency.value}
                className="flex items-center gap-2 py-1.5 px-3 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={currency.flag}
                    alt={`${currency.label} flag`}
                    width={20}
                    height={20}
                    className="rounded-full object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">{currency.value}</span>
                    <span className="text-xs text-gray-500">
                      {currency.fullName}
                    </span>
                  </div>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
