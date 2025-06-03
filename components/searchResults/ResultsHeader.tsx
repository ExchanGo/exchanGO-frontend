"use client";

import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";
import { openModal } from "@/store/modals";
import { useFilterByCurrencyStore } from "@/store/filter-by-currency";
import { useSearchResults } from "@/lib/hooks/useSearchResults";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export const ResultsHeader: React.FC = () => {
  const { searchResults, searchParams, isLoading } = useSearchResults();

  const handleFilterClick = () => {
    openModal("MODAL_FILTER_CURRENCY", {
      minPrice: 0,
      maxPrice: 1000,
      currency: "USD",
    });
  };
  const handleAlertClick = () => {
    openModal("MODAL_WHATSAPP_ALERT");
  };

  // Use global filter state
  const selectedCurrencies = useFilterByCurrencyStore(
    (s) => s.selectedCurrencies
  );
  const selectedTrend = useFilterByCurrencyStore((s) => s.selectedTrend);
  const onlyOpenOffices = useFilterByCurrencyStore((s) => s.onlyOpenOffices);

  console.log(selectedCurrencies, selectedTrend, onlyOpenOffices);

  // Compute active filter count
  let activeCount = 0;
  if (selectedCurrencies.length > 0) activeCount += 1;
  if (selectedTrend) activeCount += 1;
  if (onlyOpenOffices) activeCount += 1;

  const sortOptions = [
    { label: "Best to worst exchange rate", value: "rate" },
    { label: "Geographic proximity", value: "geo" },
    { label: "Currently open/closed", value: "open" },
  ];
  const [sortValue, setSortValue] = React.useState("");

  // Get data from search results
  const count = searchResults?.offices?.length || 0;
  const location =
    searchParams?.location?.name ||
    searchParams?.location?.place_formatted ||
    "Unknown Location";
  const lastUpdate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (isLoading) {
    return (
      <header className="flex flex-wrap gap-5 justify-between w-full leading-snug max-md:max-w-full">
        <div className="flex gap-1 items-center my-auto text-sm text-zinc-600">
          <div className="animate-pulse bg-gray-200 h-4 w-48 rounded"></div>
        </div>
        <div className="flex gap-4">
          <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
          <div className="flex gap-2">
            <div className="animate-pulse bg-gray-200 h-12 w-24 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 h-12 w-24 rounded-lg"></div>
            <div className="animate-pulse bg-gray-200 h-12 w-12 rounded-lg"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="flex flex-wrap gap-5 justify-between w-full leading-snug max-md:max-w-full">
      <div className="flex gap-1 items-center my-auto text-sm text-zinc-600">
        <span className="self-stretch my-auto">Showing </span>
        <span className="self-stretch my-auto font-bold text-green-900">
          {count}
        </span>
        <span className="self-stretch my-auto">
          Exchange office{count !== 1 ? "s" : ""} listing in
        </span>
        <span className="self-stretch my-auto font-bold text-green-900">
          {location}
        </span>
      </div>
      <div className="flex gap-4">
        <div className="flex gap-2 items-center my-auto text-sm text-right">
          <div className="flex gap-1 items-center self-stretch my-auto">
            <span className="self-stretch my-auto text-zinc-600">
              Last update
            </span>
            <span className="self-stretch my-auto font-bold text-green-900">
              {lastUpdate}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center text-base font-medium text-green-900 whitespace-nowrap">
          <Button
            variant="outline"
            size="xl"
            className="flex gap-2 items-center self-stretch px-5 py-3 my-auto rounded-lg border border-green-900 border-solid relative"
            aria-label="Filter results"
            onClick={handleFilterClick}
          >
            <span className="self-stretch my-auto flex items-center gap-2">
              Filter
              {activeCount > 0 && (
                <span className="ml-2 flex items-center justify-center rounded-full bg-[#E2EB3A] text-green-900 text-xs font-bold w-7 h-7">
                  {activeCount.toString().padStart(2, "0")}
                </span>
              )}
            </span>
            <Image
              src="/svg/filter.svg"
              alt="Filter icon"
              width={24}
              height={24}
              priority
            />
          </Button>

          <Select value={sortValue} onValueChange={setSortValue}>
            <SelectTrigger
              icon={
                <Image
                  src="/svg/sort.svg"
                  alt="Sort icon"
                  width={24}
                  height={24}
                  priority
                  className="ml-2 flex-shrink-0"
                />
              }
              className={`
                flex items-center px-5 py-3 my-auto h-full rounded-lg border border-green-900 border-solid
                ring-0 focus:ring-0 focus-visible:ring-0 outline-none
                ${
                  sortValue
                    ? "border-[var(--color-greeny-highlight)] bg-[var(--color-lite-pale)]/50 text-[var(--color-greeny-highlight)]"
                    : "bg-white text-[var(--color-greeny-highlight)]"
                }
                transition-colors
              `}
              aria-label="Sort results"
            >
              <span className="flex-1 text-base font-medium whitespace-nowrap overflow-hidden truncate">
                Sort
              </span>
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={handleAlertClick}
            size="xl"
            className="flex gap-2.5 items-center self-stretch p-2 my-auto rounded-md border border-green-900 border-solid w-[46px]"
          >
            <Image
              src="/svg/alert.svg"
              alt="more icon"
              width={24}
              height={24}
              priority
            />
          </Button>
        </div>
      </div>
    </header>
  );
};
