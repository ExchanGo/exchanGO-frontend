import * as React from "react";
import { CheckIcon, ChevronDown, Search, X } from "lucide-react";
import * as RPNInput from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import { motion, AnimatePresence } from "framer-motion";
import {
  getCountryCallingCode,
  parsePhoneNumber,
  getCountries,
} from "react-phone-number-input";

import { cn } from "@/lib/utils";

// Styles for the phone select dropdown with proper z-index and transitions
const globalStyles = `
  .phone-select-container {
    position: relative;
  }
  
  .phone-select-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    width: 300px;
    max-height: 350px;
    margin-top: 0.25rem;
    background-color: white;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    z-index: 40;
    overflow: hidden;
  }
  
  .phone-select-search {
    position: relative;
    padding: 0.75rem;
    border-bottom: 1px solid #e2e8f0;
  }
  
  .phone-select-search-input {
    width: 100%;
    padding: 0.5rem 2rem 0.5rem 2rem;
    border: 1px solid #e2e8f0;
    border-radius: 0.375rem;
    outline: none;
    font-size: 0.875rem;
    transition: border-color 0.15s ease;
  }
  
  .phone-select-search-input:focus {
    border-color: var(--color-greeny);
  }
  
  .phone-select-search-icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    width: 1rem;
    height: 1rem;
  }
  
  .phone-select-clear {
    position: absolute;
    right: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: #94a3b8;
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.15s ease;
  }
  
  .phone-select-clear:hover {
    opacity: 1;
  }
  
  .phone-select-list {
    max-height: 250px;
    overflow-y: auto;
    padding: 0.5rem 0;
  }
  
  .phone-select-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
    transition: background-color 0.15s ease;
  }
  
  .phone-select-item:hover {
    background-color: var(--color-lite-soft);
  }
  
  .phone-select-item.selected {
    background-color: var(--color-lite-soft);
  }
  
  .phone-select-item-label {
    flex: 1;
    font-size: 0.875rem;
  }
  
  .phone-select-item-code {
    font-size: 0.75rem;
    color: #64748b;
  }
  
  .phone-select-empty {
    padding: 1rem 0;
    text-align: center;
    color: #94a3b8;
    font-size: 0.875rem;
  }
  
  .phone-flag-button {
    background: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0;
    height: 24px;
  }
  
  .phone-input-field {
    background: transparent;
    border: none;
    outline: none;
    width: 100%;
    font-size: 0.875rem;
    font-family: var(--font-dm);
  }
  
  .flag-wrapper {
    display: flex;
    align-items: center;
    padding-right: 8px;
    gap: 4px;
  }
`;

// Animation variants for smoother transitions
const dropdownVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      mass: 1,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
};

const listItemVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.025,
      duration: 0.2,
      ease: "easeOut",
    },
  }),
  exit: { opacity: 0, transition: { duration: 0.1 } },
};

// Helper to find a country based on a phone number or country code
const findCountryByDialCode = (
  phoneNumber: string
): RPNInput.Country | undefined => {
  // First try to parse as full number
  try {
    if (phoneNumber.length > 3) {
      const parsed = parsePhoneNumber(phoneNumber);
      if (parsed?.country) {
        return parsed.country;
      }
    }
  } catch {
    // Continue to the next method if parsing fails
  }

  // Try to match just the country code
  if (phoneNumber.startsWith("+")) {
    const codeToMatch = phoneNumber.replace(/\D/g, "");

    if (codeToMatch.length > 0) {
      const countries = getCountries();

      // Sort countries by code length (descending) to match the longest code first
      const sortedCountries = [...countries].sort((a, b) => {
        const codeA = getCountryCallingCode(a);
        const codeB = getCountryCallingCode(b);
        return codeB.length - codeA.length;
      });

      // Find a country whose calling code is a prefix of the input
      for (const country of sortedCountries) {
        const countryCode = getCountryCallingCode(country);
        if (codeToMatch.startsWith(countryCode)) {
          return country;
        }
      }
    }
  }

  return undefined;
};

// Create a mapping of country codes to countries for faster lookup
const countryCodeMap = new Map<string, RPNInput.Country>();
getCountries().forEach((country) => {
  try {
    const code = getCountryCallingCode(country);
    countryCodeMap.set(code, country);
  } catch {
    // Skip countries that don't have codes
  }
});

type PhoneInputProps = Omit<
  React.ComponentProps<"input">,
  "onChange" | "value" | "ref"
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, "onChange"> & {
    onChange?: (value: RPNInput.Value) => void;
    label?: string;
    placeholder?: string;
    className?: string;
  };

const PhoneInput = React.forwardRef<
  React.ComponentRef<typeof RPNInput.default>,
  PhoneInputProps
>(
  (
    {
      className,
      onChange,
      label = "Phone Number",
      placeholder = "Enter phone number",
      value,
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [selectedCountry, setSelectedCountry] = React.useState<
      RPNInput.Country | undefined
    >(props.defaultCountry || "MA");
    const [forceUpdate, setForceUpdate] = React.useState(0);

    // Reference to track if this is the initial render
    const initialRender = React.useRef(true);

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);

    // Track events from the input component
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      const input = inputRef.current;
      if (input) {
        input.addEventListener("focus", handleFocus);
        input.addEventListener("blur", handleBlur);
        return () => {
          input.removeEventListener("focus", handleFocus);
          input.removeEventListener("blur", handleBlur);
        };
      }
    }, []);

    // Handle special case for default country code
    React.useEffect(() => {
      // Skip on initial render since component is already initialized
      if (initialRender.current) {
        initialRender.current = false;
        return;
      }

      // If the value starts with the default country code, force an update
      if (value && typeof value === "string" && props.defaultCountry) {
        try {
          const defaultCode = getCountryCallingCode(props.defaultCountry);
          const valueCode = value.replace(/\D/g, "");

          if (value.startsWith("+") && valueCode.startsWith(defaultCode)) {
            // Force update the country to the default one
            setSelectedCountry(props.defaultCountry);
            // Trigger a re-render by updating the force update counter
            setForceUpdate((prev) => prev + 1);
          }
        } catch {
          // Ignore errors in case the country code can't be retrieved
        }
      }
    }, [value, props.defaultCountry]);

    // Custom onChange handler to detect country from input
    const handleChange = (newValue: RPNInput.Value) => {
      // Call the parent's onChange
      onChange?.(newValue);

      // Try to detect country from number
      if (newValue && typeof newValue === "string") {
        // Detect country code using direct mapping for faster lookups
        if (newValue.startsWith("+")) {
          const numericPart = newValue.replace(/\D/g, "");

          // Special case for default country to ensure it always updates
          if (props.defaultCountry) {
            try {
              const defaultCode = getCountryCallingCode(props.defaultCountry);
              if (numericPart.startsWith(defaultCode)) {
                setSelectedCountry(props.defaultCountry);
                return;
              }
            } catch {
              // Continue if there's an error
            }
          }

          // Try parsing the full number first
          try {
            const parsed = parsePhoneNumber(newValue);
            if (parsed?.country) {
              setSelectedCountry(parsed.country);
              return;
            }
          } catch {
            // Continue to the next method if parsing fails
          }

          // Try matching the beginning digits with known country codes
          // Start with longer codes and work down to shorter ones
          for (let i = Math.min(4, numericPart.length); i >= 1; i--) {
            const potentialCode = numericPart.substring(0, i);
            const country = countryCodeMap.get(potentialCode);
            if (country) {
              // Always update the country even if it's the same as the current one
              setSelectedCountry(country);
              return;
            }
          }
        } else {
          // Fall back to the helper function for other cases
          const detectedCountry = findCountryByDialCode(newValue);
          if (detectedCountry) {
            setSelectedCountry(detectedCountry);
          }
        }
      }
    };

    return (
      <>
        <style jsx global>
          {globalStyles}
        </style>
        <div className="relative w-full z-20">
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
            <RPNInput.default
              key={`phone-input-${forceUpdate}`}
              ref={ref}
              className={cn("flex w-full", className)}
              flagComponent={FlagComponent}
              countrySelectComponent={CountrySelect}
              inputComponent={InputComponent}
              country={selectedCountry}
              defaultCountry={props.defaultCountry || "MA"}
              international
              withCountryCallingCode
              smartCaret={false}
              value={value}
              placeholder={isFocused ? "" : placeholder}
              onChange={handleChange}
              inputRef={inputRef}
              {...props}
              onCountryChange={setSelectedCountry}
            />
          </motion.div>
        </div>
      </>
    );
  }
);
PhoneInput.displayName = "PhoneInput";

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className, ...props }, ref) => (
  <input
    className={cn(
      "phone-input-field flex-1 text-sm placeholder:font-dm font-dm",
      "placeholder:text-[#585858]",
      "focus:outline-none focus:ring-0",
      "transition-colors duration-200",
      className
    )}
    {...props}
    ref={ref}
  />
));
InputComponent.displayName = "InputComponent";

type CountryEntry = { label: string; value: RPNInput.Country | undefined };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  options: CountryEntry[];
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  options: countryList,
  onChange,
}: CountrySelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const listRef = React.useRef<HTMLDivElement>(null);

  // Add frequently used countries at the top
  const frequentCountries = ["US", "GB", "CA", "AU", "FR", "DE", "JP", "MA"];

  // Get country calling code with error handling
  const getCallingCode = (country: RPNInput.Country) => {
    try {
      return getCountryCallingCode(country);
    } catch {
      return "";
    }
  };

  // Filter countries based on search query
  const filteredCountries = React.useMemo(() => {
    if (!searchQuery.trim()) {
      // When no search, prioritize frequent countries
      const sortedList = [...countryList];
      sortedList.sort((a, b) => {
        const aIsFrequent = a.value && frequentCountries.includes(a.value);
        const bIsFrequent = b.value && frequentCountries.includes(b.value);

        if (aIsFrequent && !bIsFrequent) return -1;
        if (!aIsFrequent && bIsFrequent) return 1;
        if (aIsFrequent && bIsFrequent) {
          // Further sort frequent countries by their order in the frequentCountries array
          return (
            frequentCountries.indexOf(a.value as string) -
            frequentCountries.indexOf(b.value as string)
          );
        }
        return (a.label || "").localeCompare(b.label || "");
      });
      return sortedList;
    }

    // When searching, filter by name or code
    const query = searchQuery.toLowerCase();
    return countryList.filter(
      (country) =>
        country.label?.toLowerCase().includes(query) ||
        (country.value && getCallingCode(country.value).includes(query))
    );
  }, [countryList, searchQuery]);

  // Get the selected country details
  const selectedCountryLabel = React.useMemo(() => {
    const found = countryList.find(
      (country) => country.value === selectedCountry
    );
    return found?.label || selectedCountry;
  }, [countryList, selectedCountry]);

  // Handle click outside to close dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);

      // Focus search input
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Handle escape key to close dropdown
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Scroll selected item into view when dropdown opens
  React.useEffect(() => {
    if (isOpen && listRef.current) {
      const selectedElement = listRef.current.querySelector(".selected");
      if (selectedElement) {
        setTimeout(() => {
          selectedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }, 100);
      }
    }
  }, [isOpen]);

  const handleSelectCountry = (country: RPNInput.Country) => {
    onChange(country);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="phone-select-container" ref={containerRef}>
      <div className="flag-wrapper">
        <motion.button
          type="button"
          className="phone-flag-button"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            initial={false}
            animate={{
              scale: isOpen ? 1.05 : 1,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
              },
            }}
          >
            <FlagComponent
              country={selectedCountry}
              countryName={selectedCountryLabel}
            />
          </motion.div>
          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0,
              transition: {
                type: "spring",
                stiffness: 500,
                damping: 30,
              },
            }}
          >
            <ChevronDown size={14} />
          </motion.div>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="phone-select-dropdown"
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <div className="phone-select-search">
              <Search className="phone-select-search-icon" />
              <motion.input
                ref={inputRef}
                type="text"
                className="phone-select-search-input"
                placeholder="Search country or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.2 }}
              />
              <AnimatePresence>
                {searchQuery && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.15 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X
                      className="phone-select-clear"
                      onClick={() => setSearchQuery("")}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="phone-select-list" ref={listRef}>
              <AnimatePresence>
                {filteredCountries.length === 0 ? (
                  <motion.div
                    className="phone-select-empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    No country found
                  </motion.div>
                ) : (
                  <motion.div initial="hidden" animate="visible" exit="exit">
                    {filteredCountries.map(
                      ({ value, label }, index) =>
                        value && (
                          <motion.div
                            key={value}
                            custom={index}
                            variants={listItemVariants}
                            className={cn(
                              "phone-select-item",
                              selectedCountry === value && "selected"
                            )}
                            onClick={() => handleSelectCountry(value)}
                            whileHover={{
                              backgroundColor: "var(--color-lite-soft)",
                              x: 3,
                            }}
                          >
                            <FlagComponent
                              country={value}
                              countryName={label}
                            />
                            <span className="phone-select-item-label">
                              {label}
                            </span>
                            <span className="phone-select-item-code">{`+${getCallingCode(
                              value
                            )}`}</span>
                            <AnimatePresence>
                              {selectedCountry === value && (
                                <motion.div
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 500,
                                    damping: 30,
                                  }}
                                >
                                  <CheckIcon className="h-3.5 w-3.5" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </motion.div>
                        )
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg]:size-full">
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export { PhoneInput };
