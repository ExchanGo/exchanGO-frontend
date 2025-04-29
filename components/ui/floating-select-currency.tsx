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

interface CurrencySelectProps {
  label: string;
  defaultValue?: string;
  currencies?: Currency[];
  onValueChange?: (value: string) => void;
  className?: string;
}

const defaultCurrencies: Currency[] = [
  {
    value: "USD",
    label: "USD",
    fullName: "US Dollar",
    flag: "/svg/flags/us.svg",
  },
  {
    value: "IDR",
    label: "Rupiah",
    fullName: "Indonesian Rupiah",
    flag: "/svg/flags/id.svg",
  },
  {
    value: "AUD",
    label: "AUD",
    fullName: "Australian Dollar",
    flag: "/svg/flags/au.svg",
  },
  {
    value: "MYR",
    label: "Ringgit",
    fullName: "Malaysian Ringgit",
    flag: "/svg/flags/my.svg",
  },
  {
    value: "EUR",
    label: "EUR",
    fullName: "Euro",
    flag: "/svg/flags/eu.svg",
  },
  {
    value: "GBP",
    label: "GBP",
    fullName: "British Pound",
    flag: "/svg/flags/gb.svg",
  },
  {
    value: "MAD",
    label: "MAD",
    fullName: "Moroccan Dirham",
    flag: "/svg/flags/ma.svg",
  },
];

export function FloatingSelectCurrency({
  label = "Currency",
  defaultValue = "USD",
  currencies = defaultCurrencies,
  onValueChange,
  className,
}: CurrencySelectProps) {
  const [value, setValue] = useState<string>(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

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
          "focus-within:ri<ng-1 focus-within:ring-[var(--color-greeny)]",
          "relative pt-4 bg-white transition-colors",
          className
        )}
      >
        <Select
          defaultValue={defaultValue}
          value={value}
          onValueChange={handleValueChange}
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
