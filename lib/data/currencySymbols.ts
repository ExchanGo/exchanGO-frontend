// Currency symbols for the supported currencies
export const currencySymbols: Record<string, string> = {
  USD: "$",
  IDR: "Rp",
  AUD: "A$",
  MYR: "RM",
  EUR: "€",
  GBP: "£",
  MAD: "DH",
};

// Get currency symbol by currency code
export function getCurrencySymbol(currencyCode: string): string {
  return currencySymbols[currencyCode] || currencyCode;
} 