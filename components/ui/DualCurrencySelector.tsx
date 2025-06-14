import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface Currency {
  value: string;
  label: string;
  flag: string;
  fullName: string;
}

interface DualCurrencySelectorProps {
  onCurrencyChange?: (currencies: { from: string; to: string }) => void;
  fromLabel?: string;
  toLabel?: string;
  children: (props: {
    fromProps: {
      value: string;
      onValueChange: (value: string) => void;
      currencies: Currency[];
    };
    toProps: {
      value: string;
      onValueChange: (value: string) => void;
      currencies: Currency[];
    };
    fromLabel: string;
    toLabel: string;
    onSwap: () => void;
    isSwapping: boolean;
  }) => React.ReactNode;
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

export default function DualCurrencySelector({
  onCurrencyChange,
  fromLabel = "From",
  toLabel = "To",
  children,
}: DualCurrencySelectorProps) {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("MAD");
  const [isSwapping, setIsSwapping] = useState(false);

  const handleFromCurrencyChange = (newValue: string) => {
    setFromCurrency(newValue);
    if (newValue === "MAD") {
      setToCurrency(fromCurrency);
      onCurrencyChange?.({ from: newValue, to: fromCurrency });
    } else {
      setToCurrency("MAD");
      onCurrencyChange?.({ from: newValue, to: "MAD" });
    }
  };

  const handleToCurrencyChange = (newValue: string) => {
    setToCurrency(newValue);
    if (newValue === "MAD") {
      setFromCurrency(toCurrency);
      onCurrencyChange?.({ from: toCurrency, to: newValue });
    } else {
      setFromCurrency("MAD");
      onCurrencyChange?.({ from: "MAD", to: newValue });
    }
  };

  const handleSwap = async () => {
    setIsSwapping(true);

    // Wait for animation to complete
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Swap the currencies
    const tempFrom = fromCurrency;
    const tempTo = toCurrency;

    setFromCurrency(tempTo);
    setToCurrency(tempFrom);

    // Notify parent component
    onCurrencyChange?.({ from: tempTo, to: tempFrom });

    // Reset swapping state
    setIsSwapping(false);
  };

  useEffect(() => {
    onCurrencyChange?.({ from: fromCurrency, to: toCurrency });
  }, []);

  return (
    <div className="flex items-center gap-4">
      {children({
        fromProps: {
          value: fromCurrency,
          onValueChange: handleFromCurrencyChange,
          currencies: defaultCurrencies,
        },
        toProps: {
          value: toCurrency,
          onValueChange: handleToCurrencyChange,
          currencies: defaultCurrencies,
        },
        fromLabel,
        toLabel,
        onSwap: handleSwap,
        isSwapping,
      })}
    </div>
  );
}
