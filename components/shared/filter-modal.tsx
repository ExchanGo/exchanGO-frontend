"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal, confirmModal } from "@/store/modals";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useFilterByCurrencyStore } from "@/store/filter-by-currency";

interface FilterPayload {
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
}

const ALL_CURRENCIES = [
  "USD",
  "EUR",
  "AUD",
  "CAD",
  "GBP",
  "CHF",
  "SAR",
  "QAR",
  "KWD",
  "CNY",
  "TRY",
  "JPY",
  "NOK",
  "KRW",
  "RUB",
  "INR",
];
const DEFAULT_VISIBLE = 5;

const TREND_OPTIONS = [
  { label: "🔥 Popular Exchange", value: "popular" },
  { label: "⚡ Most Searched", value: "most_searched" },
  { label: "Nearest office", value: "nearest" },
];

export interface FilterState {
  selectedCurrencies: string[];
  selectedTrend: string | null;
  onlyOpenOffices: boolean;
  setSelectedCurrencies: (currencies: string[]) => void;
  setSelectedTrend: (trend: string | null) => void;
  setOnlyOpenOffices: (open: boolean) => void;
  clearAll: () => void;
}

export function CurrencyTagsFilter({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (currencies: string[]) => void;
}) {
  const [showAll, setShowAll] = useState(false);

  const visibleCurrencies = showAll
    ? ALL_CURRENCIES
    : ALL_CURRENCIES.slice(0, DEFAULT_VISIBLE);

  return (
    <div>
      <h3 className="text-base font-bold text-black mb-4">
        By Available Currencies
      </h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {visibleCurrencies.map((cur) => (
          <Button
            key={cur}
            variant={selected.includes(cur) ? "default" : "outline"}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium",
              selected.includes(cur)
                ? "bg-[var(--color-greeny)] text-white border-[var(--color-greeny)]"
                : "bg-white text-black border-gray-300"
            )}
            onClick={() =>
              onChange(
                selected.includes(cur)
                  ? selected.filter((c) => c !== cur)
                  : [...selected, cur]
              )
            }
          >
            {cur}
          </Button>
        ))}
        {!showAll && (
          <Button
            variant="outline"
            className="rounded-full px-4 py-2 text-sm font-medium bg-gray-100 text-gray-600 border-gray-300"
            onClick={() => setShowAll(true)}
          >
            + More
          </Button>
        )}
        {showAll && (
          <Button
            variant="outline"
            className="rounded-full px-4 py-2 text-sm font-medium bg-gray-100 text-gray-600 border-gray-300"
            onClick={() => setShowAll(false)}
          >
            Show Less
          </Button>
        )}
      </div>
    </div>
  );
}

function TrendTagsFilter({
  selected,
  onChange,
}: {
  selected: string | null;
  onChange: (trend: string) => void;
}) {
  return (
    <div>
      <h3 className="text-base font-bold text-black mb-4">By Trend</h3>
      <div className="flex flex-wrap gap-2 mb-2">
        {TREND_OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            variant={selected === opt.value ? "default" : "outline"}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium",
              selected === opt.value
                ? "bg-[var(--color-greeny)] text-white border-[var(--color-greeny)]"
                : "bg-white text-black border-gray-300"
            )}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function FilterModal() {
  const { isOpen, type, payloads, onClose } = useModal();
  const [filterValues, setFilterValues] = useState<FilterPayload>({
    minPrice: (payloads as FilterPayload)?.minPrice || 0,
    maxPrice: (payloads as FilterPayload)?.maxPrice || 1000,
    currency: (payloads as FilterPayload)?.currency || "USD",
  });
  const selectedCurrencies = useFilterByCurrencyStore(
    (s) => s.selectedCurrencies
  );
  const setSelectedCurrencies = useFilterByCurrencyStore(
    (s) => s.setSelectedCurrencies
  );
  const selectedTrend = useFilterByCurrencyStore((s) => s.selectedTrend);
  const setSelectedTrend = useFilterByCurrencyStore((s) => s.setSelectedTrend);
  const onlyOpenOffices = useFilterByCurrencyStore((s) => s.onlyOpenOffices);
  const setOnlyOpenOffices = useFilterByCurrencyStore(
    (s) => s.setOnlyOpenOffices
  );
  const clearAll = useFilterByCurrencyStore((s) => s.clearAll);

  useEffect(() => {
    setFilterValues({
      minPrice: (payloads as FilterPayload)?.minPrice || 0,
      maxPrice: (payloads as FilterPayload)?.maxPrice || 1000,
      currency: (payloads as FilterPayload)?.currency || "USD",
    });
  }, [payloads]);

  if (type !== "MODAL_FILTER_CURRENCY") return null;

  const handleConfirm = () => {
    confirmModal(() => {
      // Handle filter confirmation here
      console.log("Filter confirmed with:", {
        ...filterValues,
        currencies: selectedCurrencies,
        trend: selectedTrend,
        onlyOpenOffices,
      });
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[101]">
        <DialogHeader className="py-6 border-b border-gray-200">
          <DialogTitle className="text-black text-lg font-bold px-6">
            Filter
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 px-6">
          <CurrencyTagsFilter
            selected={selectedCurrencies}
            onChange={setSelectedCurrencies}
          />
          <TrendTagsFilter
            selected={selectedTrend}
            onChange={setSelectedTrend}
          />
          <div className="mt-4">
            <h3 className="text-base font-bold text-black mb-2">Office Hour</h3>
            <label className="flex items-center gap-2 text-sm font-medium text-black">
              <input
                type="checkbox"
                checked={onlyOpenOffices}
                onChange={(e) => setOnlyOpenOffices(e.target.checked)}
                className="accent-[var(--color-greeny)] w-4 h-4 rounded border-gray-300"
              />
              Show only currently open offices
            </label>
          </div>
        </div>
        <div className="flex justify-between items-center mt-6 border-t border-gray-200 py-6 px-6">
          <Button
            variant="outline"
            size="lg"
            className="border-[var(--color-greeny)] text-[var(--color-greeny)] hover:bg-[var(--color-greeny)]/10 hover:border-[var(--color-greeny)] px-8 py-2 rounded-lg font-medium"
            onClick={() => {
              setSelectedCurrencies([]);
              setSelectedTrend(null);
              setOnlyOpenOffices(false);
              // Reset any other filters here if needed
            }}
          >
            Clear All
          </Button>
          <Button size="lg" variant="gradient" onClick={handleConfirm}>
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
