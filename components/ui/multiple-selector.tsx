import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { LucideIcon } from "lucide-react";

export type Option = {
  label: string;
  value: string;
  disable?: boolean;
};

interface MultipleSelectorProps {
  defaultOptions: Option[];
  value?: string[];
  onChange?: (selected: string[]) => void;
  label?: string;
  placeholder?: string;
  icon?: LucideIcon;
  emptyIndicator?: React.ReactNode;
  className?: string;
}

const MultipleSelector: React.FC<MultipleSelectorProps> = ({
  defaultOptions,
  value,
  onChange,
  label = "Label",
  placeholder = "Select...",
  icon: Icon,
  emptyIndicator,
  className,
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Use value prop as the source of truth for selected items
  const selected = value || [];

  const handleSelect = (val: string) => {
    if (!onChange) return;
    if (selected.includes(val)) {
      onChange(selected.filter((v) => v !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  // Show all options in dropdown, not just unselected
  const filteredOptions = defaultOptions.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Floating label logic
  const showFloating =
    isFocused || selected.length > 0 || open || search.length > 0;

  return (
    <div className={cn("relative w-full", className)} ref={containerRef}>
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
          borderColor:
            isFocused || open
              ? "var(--color-greeny)"
              : isHovered
              ? "var(--color-greeny-highlight)"
              : "var(--color-lite)",
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "flex items-center flex-wrap gap-2 px-4 py-3 w-full rounded-lg border relative pt-4 bg-white cursor-pointer min-h-[44px]",
          "focus-within:ring-1 focus-within:ring-[var(--color-greeny)]",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        tabIndex={0}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onClick={() => setOpen((o) => !o)}
      >
        <AnimatePresence>
          {Icon && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0, y: isHovered ? [-1, 1, -1] : 0 }}
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
        {selected.length === 0 && (
          <span className="text-gray-400">{placeholder}</span>
        )}
        {selected.map((val) => {
          const opt = defaultOptions.find((o) => o.value === val);
          return (
            <span
              key={val}
              className="bg-gray-100 rounded-full px-3 py-1 text-sm flex items-center gap-1"
            >
              {opt?.label || val}
              <button
                type="button"
                className="ml-1 text-gray-400 hover:text-red-500"
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(val);
                }}
              >
                &times;
              </button>
            </span>
          );
        })}
      </motion.div>
      {open && (
        <div className="absolute left-0 right-0 mt-2 z-20 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <input
            type="text"
            className="w-full px-3 py-2 border-b outline-none text-sm"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onClick={(e) => e.stopPropagation()}
            autoFocus
          />
          <div className="max-h-40 overflow-y-auto">
            {filteredOptions.length === 0 && (
              <div className="py-4 px-2">
                {emptyIndicator || (
                  <span className="text-gray-400 text-xs">
                    No results found.
                  </span>
                )}
              </div>
            )}
            {filteredOptions.map((opt) => (
              <label
                key={opt.value}
                className={`flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50 ${
                  opt.disable ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <input
                  type="checkbox"
                  className="accent-greeny"
                  checked={selected.includes(opt.value)}
                  disabled={opt.disable}
                  onChange={() => handleSelect(opt.value)}
                  onClick={(e) => e.stopPropagation()}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleSelector;
