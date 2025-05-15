"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface FloatingSelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  className?: string;
  onChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  icon?: LucideIcon;
  options: { label: string; value: string }[];
  value?: string;
}

const FloatingSelect = React.forwardRef<HTMLDivElement, FloatingSelectProps>(
  (
    {
      className,
      onChange,
      label = "Label",
      placeholder = "Select option",
      icon: Icon,
      options,
      value,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);

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
          <Select
            onValueChange={onChange}
            onOpenChange={(open) => setIsFocused(open)}
            value={value || undefined}
          >
            <SelectTrigger className="w-full border-none p-0 h-auto focus:ring-0 focus:outline-none">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value || "all"}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>
      </div>
    );
  }
);

FloatingSelect.displayName = "FloatingSelect";

export { FloatingSelect };
