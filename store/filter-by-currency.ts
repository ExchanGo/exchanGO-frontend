import { create } from "zustand";

export interface FilterByCurrencyState {
  selectedCurrencies: string[];
  selectedTrend: string | null;
  onlyOpenOffices: boolean;
  setSelectedCurrencies: (currencies: string[]) => void;
  setSelectedTrend: (trend: string | null) => void;
  setOnlyOpenOffices: (open: boolean) => void;
  clearAll: () => void;
}

export const useFilterByCurrencyStore = create<FilterByCurrencyState>((set) => ({
  selectedCurrencies: [],
  selectedTrend: null,
  onlyOpenOffices: false,
  setSelectedCurrencies: (currencies) => set({ selectedCurrencies: currencies }),
  setSelectedTrend: (trend) => set({ selectedTrend: trend }),
  setOnlyOpenOffices: (open) => set({ onlyOpenOffices: open }),
  clearAll: () =>
    set({
      selectedCurrencies: [],
      selectedTrend: null,
      onlyOpenOffices: false,
    }),
})); 