"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FloatingLabelInputProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  className?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  icon?: LucideIcon;
  type?: string;
  defaultValue?: string;
  value?: string;
  onFocus?: () => void;
}

const FloatingLabelInput = React.forwardRef<
  HTMLDivElement,
  FloatingLabelInputProps
>(
  (
    {
      className,
      onChange,
      label = "Label",
      placeholder = "Enter text",
      icon: Icon,
      type = "text",
      defaultValue = "",
      value,
      onFocus,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState(
      value || defaultValue || ""
    );
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

    // Update input value when value or defaultValue props change
    React.useEffect(() => {
      if (value !== undefined) {
        setInputValue(value);
      } else if (defaultValue !== undefined) {
        setInputValue(defaultValue);
      }
    }, [value, defaultValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange?.(newValue);
    };

    const handleFocus = () => {
      setIsFocused(true);
      onFocus?.();
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (!inputValue) setInputValue("");
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
          <AnimatePresence>
            {Icon && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  y: isHovered ? [-1, 1, -1] : 0,
                }}
                exit={{ opacity: 0, x: -10 }}
                transition={{
                  y: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    repeatType: "reverse",
                  },
                  default: { duration: 0.2 },
                }}
                className="text-[#585858]"
              >
                <Icon className="h-4 w-4" />
              </motion.div>
            )}
          </AnimatePresence>
          <motion.input
            type={type}
            value={inputValue}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            placeholder={isFocused ? "" : placeholder}
            className={cn(
              "flex-1 text-sm placeholder:font-dm font-dm bg-transparent border-none",
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

FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingLabelInput };
