"use client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export function CurrencyRakingSelect({
  label,
  defaultValue = "USD",
  currencies = defaultCurrencies,
  onValueChange,
  className,
}: CurrencySelectProps) {
  const [value, setValue] = useState<string>(defaultValue);

  const handleValueChange = (newValue: string) => {
    setValue(newValue);
    onValueChange?.(newValue);
  };

  const selectedCurrency = currencies.find((c) => c.value === value);

  return (
    <div
      className={`px-6 py-4 h-fit bg-white rounded-2xl border border-[#DEDEDE] ${className}`}
    >
      <p className="text-sm font-medium font-dm text-black mb-2">{label}</p>
      <Select
        defaultValue={defaultValue}
        value={value}
        onValueChange={handleValueChange}
      >
        <SelectTrigger className="bg-white border-0 focus:ring-0 focus:ring-offset-0 outline-none px-0 py-0 h-6 font-dm text-lg text-[#585858]">
          {selectedCurrency && (
            <div className="flex items-center gap-2">
              <Image
                src={selectedCurrency.flag}
                alt={`${selectedCurrency.label} flag`}
                width={24}
                height={24}
                className="rounded-full object-cover"
              />
              <span className="font-medium">{selectedCurrency.value}</span>
            </div>
          )}
        </SelectTrigger>
        <SelectContent className="max-h-[300px] overflow-y-auto">
          {currencies.map((currency) => (
            <SelectItem
              key={currency.value}
              value={currency.value}
              className="flex items-center gap-2 py-2 cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center gap-3">
                <Image
                  src={currency.flag}
                  alt={`${currency.label} flag`}
                  width={24}
                  height={24}
                  className="rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-medium">{currency.value}</span>
                  <span className="text-sm text-gray-500">
                    {currency.fullName}
                  </span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
