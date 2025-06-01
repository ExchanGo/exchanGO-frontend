"use client";

import * as React from "react";
import { useState, useRef, useEffect } from "react";
import { MapPin, CheckCircle2, XCircle, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useDebounce from "@/lib/hooks/useDebounce";
import { useCitiesData } from "@/lib/hooks/useCitiesData";
import { useSetSelectedLocation } from "@/store/useCitiesStore";
import { cn } from "@/lib/utils";

// Keep the interface for backward compatibility
export interface LocationOption {
  value: string;
  label: string;
  id?: string;
}

interface FloatingLocationAutoCompleteProps {
  defaultValue?: string;
  locations?: LocationOption[]; // Keep for backward compatibility, but will be overridden by API data
  onLocationChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  className?: string;
  error?: string;
  required?: boolean;
}

export function FloatingLocationAutoComplete({
  defaultValue = "",
  locations, // This will be ignored in favor of API data
  onLocationChange,
  placeholder = "Search for a location...",
  label = "Location",
  className,
  error,
  required = false,
}: FloatingLocationAutoCompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Use the new cities data hook
  const {
    cities,
    isLoading,
    error: apiError,
  } = useCitiesData({
    searchQuery: debouncedSearchQuery,
    enableSearch: true,
  });

  // Zustand actions (using individual selector)
  const setSelectedLocation = useSetSelectedLocation();

  // Filter locations based on search query (local filtering for better UX)
  const filteredLocations = React.useMemo(() => {
    if (!debouncedSearchQuery) return cities;

    return cities.filter((location) =>
      location.label.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
    );
  }, [debouncedSearchQuery, cities]);

  // Format display value
  const getDisplayValue = () => {
    if (!selectedValue) return "";
    const location = cities.find((city) => city.value === selectedValue);
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
    const selectedLocationData = cities.find((city) => city.value === value);
    setSelectedValue(value);
    setSearchQuery("");
    setIsOpen(false);
    setIsFocused(false);

    // Update Zustand store
    setSelectedLocation(value, selectedLocationData);

    // Call the callback
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
        setIsFocused(false);
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
      <label
        className={cn(
          "absolute z-10 -top-2 left-3 px-1.5 text-xs font-medium",
          "bg-white font-dm",
          isFocused
            ? "text-[var(--color-greeny-bold)]"
            : error
            ? "text-red-500"
            : "text-black"
        )}
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      <motion.div
        animate={{
          scale: isHovered ? 1.001 : 1,
          borderColor: isFocused
            ? "var(--color-greeny)"
            : error
            ? "red"
            : isHovered
            ? "var(--color-greeny-highlight)"
            : "var(--color-lite)",
        }}
        transition={{ duration: 0.2 }}
        className={cn(
          "relative flex items-center w-full rounded-lg border bg-white cursor-pointer overflow-hidden",
          "focus-within:ring-1",
          isFocused
            ? "focus-within:ring-[var(--color-greeny)]"
            : error
            ? "focus-within:ring-red-500"
            : "",
          "px-4 py-3.5"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div
          className="flex items-center w-full h-full py-0 px-0 relative z-10"
          onClick={() => {
            setIsOpen(true);
            setIsFocused(true);
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={isHovered ? "hovered" : "not-hovered"}
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0.8 }}
              className="flex-shrink-0 mr-2"
            >
              <MapPin
                className={cn(
                  "h-5 w-5",
                  error
                    ? "text-red-500"
                    : isFocused
                    ? "text-[var(--color-greeny)]"
                    : "text-[#292D32]"
                )}
              />
            </motion.div>
          </AnimatePresence>

          <div
            className="truncate flex-grow text-sm text-[#585858] pointer-events-none select-none"
            tabIndex={0}
          >
            {selectedValue ? (
              <span className="font-medium truncate block font-dm select-none">
                {getDisplayValue()}
              </span>
            ) : (
              <span className="text-gray-400 select-none">{placeholder}</span>
            )}
          </div>
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
                className="flex-1 h-10 w-full py-3 text-sm bg-transparent outline-none placeholder:text-gray-400 font-dm"
              />
              {searchQuery && (
                <AnimatePresence>
                  <motion.button
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="p-1 rounded-full hover:bg-[var(--color-lite-soft)]"
                  >
                    <XCircle className="h-4 w-4 text-gray-400 hover:text-[var(--color-greeny)]" />
                  </motion.button>
                </AnimatePresence>
              )}
            </div>

            <div className="max-h-[300px] overflow-y-auto p-1">
              {isLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-greeny)]"></div>
                    <p className="text-sm font-dm">Loading cities...</p>
                  </div>
                </motion.div>
              ) : apiError ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-red-400">
                    <XCircle className="h-8 w-8" />
                    <p className="text-sm font-dm">Failed to load cities</p>
                  </div>
                </motion.div>
              ) : filteredLocations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="py-8 text-center"
                >
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-400">
                    <XCircle className="h-8 w-8" />
                    <p className="text-sm font-dm">No results found.</p>
                  </div>
                </motion.div>
              ) : (
                <div className="py-1">
                  {filteredLocations.map((location) => (
                    <motion.div
                      key={location.value}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2.5 text-sm cursor-pointer hover:bg-[var(--color-lite-soft)] transition-colors",
                        location.value === selectedValue &&
                          "bg-[var(--color-lite-soft)]"
                      )}
                      onClick={() => handleSelect(location.value)}
                    >
                      <div className="flex items-center w-full justify-between select-none">
                        <span
                          className={cn(
                            "font-medium font-dm",
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
                            className="text-[var(--color-greeny)]"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1 font-dm"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
