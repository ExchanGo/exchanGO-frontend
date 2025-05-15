"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { getCurrencySymbol } from "@/lib/data/currencySymbols";

interface FloatingAmountInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  className?: string;
  onChange?: (value: string) => void;
  onAmountChange?: (value: number) => void;
  label?: string;
  placeholder?: string;
  currencyCode?: string;
  defaultValue?: string;
}

const FloatingAmountInput = React.forwardRef<
  HTMLDivElement,
  FloatingAmountInputProps
>(
  (
    {
      className,
      onChange,
      onAmountChange,
      label = "Amount",
      placeholder = "Enter amount",
      currencyCode = "USD",
      defaultValue = "",
      ...props
    },
    ref
  ) => {
    const [value, setValue] = React.useState(defaultValue);
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const currencySymbol = getCurrencySymbol(currencyCode);

    React.useEffect(() => {
      // Update value when default value changes
      if (defaultValue !== undefined) {
        setValue(defaultValue);
      }
    }, [defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      // Only allow numbers and decimals
      if (/^[0-9]*\.?[0-9]*$/.test(newValue) || newValue === "") {
        setValue(newValue);
        onChange?.(newValue);
        onAmountChange?.(parseFloat(newValue) || 0);
      }
    };

    return (
      <div className="relative w-full" ref={ref} {...props}>
        <label
          className={cn(
            "absolute z-10 -top-2 left-3 px-1.5 text-xs font-medium",
            "bg-white font-dm text-black",
            isFocused && "text-[var(--color-greeny-bold)]"
          )}
        >
          {label}
        </label>
        <motion.div
          animate={{
            scale: isHovered ? 1.001 : 1,
            borderColor: isFocused
              ? "var(--color-greeny)"
              : isHovered
              ? "var(--color-greeny-highlight)"
              : "var(--color-lite)",
          }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex items-center gap-2 px-4 py-3 w-full",
            "rounded-lg border",
            "focus-within:ring-1 focus-within:ring-[var(--color-greeny)]",
            "relative pt-4 bg-white",
            className
          )}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={currencySymbol}
              initial={{ opacity: 0, y: 10, scale: 0.8 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 0.8,
                },
              }}
              exit={{
                opacity: 0,
                y: -10,
                scale: 0.8,
                transition: {
                  duration: 0.2,
                },
              }}
              className={cn(
                "text-lg font-medium min-w-[24px] flex items-center justify-center",
                isFocused ? "text-[var(--color-greeny-bold)]" : "text-[#585858]"
              )}
            >
              {currencySymbol}
            </motion.span>
          </AnimatePresence>

          <motion.input
            type="text"
            inputMode="decimal"
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => {
              setIsFocused(false);
              if (value === "") setValue("");
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            placeholder={isFocused ? "" : placeholder}
            className={cn(
              "flex-1 text-lg placeholder:font-dm placeholder:text-sm font-dm bg-transparent border-none",
              "placeholder:text-[#585858]",
              "focus:outline-none focus:ring-0",
              "transition-colors duration-200"
            )}
          />
        </motion.div>
      </div>
    );
  }
);

FloatingAmountInput.displayName = "FloatingAmountInput";

export { FloatingAmountInput };
