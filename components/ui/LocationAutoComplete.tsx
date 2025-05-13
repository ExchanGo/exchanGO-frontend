"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  LocateFixed,
  CheckCircle2,
  XCircle,
  Search,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useDebounce from "@/lib/hooks/useDebounce";
import { cn } from "@/lib/utils";

// Default cities for Morocco
const defaultCities = [
  { value: "casablanca", label: "Casablanca" },
  { value: "rabat", label: "Rabat" },
  { value: "marrakech", label: "Marrakech" },
  { value: "fes", label: "Fès" },
  { value: "tangier", label: "Tanger" },
  { value: "agadir", label: "Agadir" },
  { value: "meknes", label: "Meknès" },
  { value: "oujda", label: "Oujda" },
  { value: "kenitra", label: "Kénitra" },
  { value: "tetouan", label: "Tétouan" },
  { value: "safi", label: "Safi" },
  { value: "mohammedia", label: "Mohammedia" },
  { value: "el-jadida", label: "El Jadida" },
  { value: "beni-mellal", label: "Béni Mellal" },
  { value: "nador", label: "Nador" },
  { value: "taza", label: "Taza" },
  { value: "settat", label: "Settat" },
  { value: "larache", label: "Larache" },
];

export interface LocationOption {
  value: string;
  label: string;
}

interface LocationAutoCompleteProps {
  defaultValue?: string;
  locations?: LocationOption[];
  onLocationChange?: (value: string) => void;
  label?: string;
  placeholder?: string;
  prefixIcon?: React.ReactNode;
  iconClassName?: string;
  prefixIconClassName?: string;
  className?: string;
}

export function LocationAutoComplete({
  defaultValue = "rabat",
  locations = defaultCities,
  onLocationChange,
  label = "Location",
  placeholder = "Search for a location...",
  prefixIcon,
  iconClassName,
  prefixIconClassName,
  className,
}: LocationAutoCompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter locations based on search query
  const filteredLocations = React.useMemo(() => {
    if (!debouncedSearchQuery) return locations;

    return locations.filter((location) =>
      location.label.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, locations]);

  // Format display value
  const getDisplayValue = () => {
    if (!selectedValue) return "";
    const location = locations.find((city) => city.value === selectedValue);
    return location ? `${location.label} - Morocco` : "";
  };

  // Ensure selectedValue is updated when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue]);

  // Handle selection change
  const handleSelect = (value: string) => {
    setSelectedValue(value);
    setSearchQuery("");
    setIsOpen(false);
    onLocationChange?.(value);
  };

  // Click outside handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus the input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <motion.div
        animate={{
          scale: isHovered ? 1.001 : 1,
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative flex items-center w-full h-full rounded-lg bg-white",
          "focus-within:outline-none hover:bg-gray-50 active:bg-gray-100",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex items-center w-full cursor-pointer h-full py-2 px-0"
          onClick={() => setIsOpen(true)}
        >
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              animate={{
                opacity: 1,
                x: 0,
                y: isHovered ? [-1, 1, -1] : 0,
              }}
              className="flex-shrink-0 mr-2"
              transition={{
                y: {
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatType: "reverse",
                },
                default: { duration: 0.2 },
              }}
            >
              {prefixIcon || (
                <MapPin
                  className={cn("h-5 w-5", prefixIconClassName)}
                  color="#292D32"
                />
              )}
            </motion.div>
          </AnimatePresence>

          <div
            className="truncate flex-grow text-base text-[#585858] px-2"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            tabIndex={0}
          >
            {selectedValue ? (
              <span className="font-medium truncate block">
                {getDisplayValue()}
              </span>
            ) : (
              <span className="text-gray-400">{placeholder}</span>
            )}
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0"
          >
            <LocateFixed
              className={cn("h-5 w-5", iconClassName)}
              color="#292D32"
            />
          </motion.div>
        </div>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="absolute top-full left-0 w-full mt-1 z-50 rounded-lg bg-white shadow-md overflow-hidden"
          >
            <div className="p-2 border-b flex items-center gap-2">
              <Search className="h-4 w-4 text-[var(--color-greeny)]" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search location..."
                className="flex-1 h-10 w-full py-3 text-sm bg-transparent outline-none placeholder:text-gray-400"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full hover:bg-gray-100"
                >
                  <XCircle className="h-4 w-4 text-gray-400 hover:text-[var(--color-greeny)]" />
                </button>
              )}
            </div>

            <div className="max-h-[300px] overflow-y-auto p-1">
              {filteredLocations.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <XCircle className="h-8 w-8" />
                    <p className="text-sm">No results found.</p>
                  </div>
                </div>
              ) : (
                <div className="py-1">
                  {filteredLocations.map((location) => (
                    <div
                      key={location.value}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer hover:bg-gray-50 transition-colors",
                        location.value === selectedValue && "bg-gray-50"
                      )}
                      onClick={() => handleSelect(location.value)}
                    >
                      <div className="flex items-center w-full justify-between">
                        <span
                          className={cn(
                            "font-medium",
                            location.value === selectedValue &&
                              "text-[var(--color-greeny-bold)]"
                          )}
                        >
                          {location.label}
                        </span>
                        {location.value === selectedValue && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 30,
                            }}
                          >
                            <CheckCircle2 className="h-4 w-4 text-[var(--color-greeny)]" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
