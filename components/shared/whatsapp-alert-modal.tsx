"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModal, closeModal } from "@/store/modals";
import { useState, useEffect } from "react";
import { ChevronLeft, LocateFixed } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import MultipleSelector, {
  Option as MultiSelectOption,
} from "@/components/ui/multiple-selector";
import { cities, offices } from "@/constants";
import { PhoneInput } from "@/components/ui/phone-input";
import type { Value } from "react-phone-number-input";
import DualCurrencySelector from "../ui/DualCurrencySelector";
import { FloatingSelectCurrency } from "../ui/floating-select-currency";
import { FloatingLabelInput } from "../ui/FloatingLabelInput";
import { FloatingSelect } from "@/components/ui/FloatingSelect";
import React from "react";
import { FloatingAmountInput } from "../ui/FloatingAmountInput";

export default function WhatsAppAlertModal() {
  const { isOpen, type, payloads, onClose } = useModal();
  const [step, setStep] = useState<number>(
    (payloads as { step?: number })?.step ?? 0
  );
  const [mode, setMode] = useState<"area" | "office" | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<string>("");
  const [phone, setPhone] = useState<Value | undefined>(undefined);
  const [newsletter, setNewsletter] = useState(false);
  const [success, setSuccess] = useState(false);
  const sourceCurrency = "USD";

  // Reset state when modal is closed
  useEffect(() => {
    if (!isOpen) {
      setStep(0);
      setMode(null);
      setSelectedCities([]);
      setSelectedOffice("");
      setPhone(undefined);
      setNewsletter(false);
      setSuccess(false);
    }
  }, [isOpen]);

  if (type !== "MODAL_WHATSAPP_ALERT") return null;

  const handleBack = () => {
    if (success) {
      setSuccess(false);
      setStep(0);
      setMode(null);
    } else if (step > 0) {
      setStep(step - 1);
    } else {
      onClose();
    }
  };

  const handleSetReminder = () => {
    setSuccess(true);
  };

  const handleCurrencyChange = (currencies: { from: string; to: string }) => {
    console.log("Selected currencies:", currencies);
  };

  // Step 0: Choose mode
  if (step === 0 && !success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg w-full p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key="step-0"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="px-6 py-6"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-black">
                  Receive Whatsapp Alert
                </DialogTitle>
                <DialogDescription className="text-[#585858] text-base mb-2">
                  Get an immediate WhatsApp notification when your target rate
                  becomes available near you.
                </DialogDescription>
              </DialogHeader>
              <div className="flex gap-4 mt-6">
                <button
                  className="flex-1 flex flex-col items-center justify-center border border-gray-200 rounded-xl p-6 hover:border-green-500 transition cursor-pointer min-h-[140px]"
                  onClick={() => {
                    setMode("area");
                    setStep(1);
                  }}
                >
                  <Image
                    src="/svg/area.svg"
                    alt="Entire Area"
                    width={40}
                    height={40}
                  />
                  <span className="mt-3 text-base font-semibold text-black">
                    Entire Area
                  </span>
                </button>
                <button
                  className="flex-1 flex flex-col items-center justify-center border border-gray-200 rounded-xl p-6 hover:border-green-500 transition cursor-pointer min-h-[140px]"
                  onClick={() => {
                    setMode("office");
                    setStep(1);
                  }}
                >
                  <Image
                    src="/svg/office.svg"
                    alt="Exchange Office"
                    width={40}
                    height={40}
                  />
                  <span className="mt-3 text-base font-semibold text-black">
                    Exchange Office
                  </span>
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    );
  }

  // Step 1: Form (Area or Office)
  if ((step === 1 && !success) || (step === 2 && !success)) {
    const cityOptions: MultiSelectOption[] = Array.from(new Set(cities)).map(
      (city) => ({
        label: city,
        value: city,
      })
    );
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-lg w-full p-0">
          <AnimatePresence mode="wait">
            <motion.div
              key="step-1"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -24 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="p-8"
            >
              <div className="flex flex-col gap-2 mb-2">
                <button
                  onClick={handleBack}
                  className="inline-flex w-fit items-center gap-2 mr-2 p-2 rounded-full hover:bg-gray-100"
                >
                  <ChevronLeft className="w-6 h-6 text-black" />
                  <span className="text-base text-[#585858]">Back</span>
                </button>
                <DialogTitle className="text-xl font-bold text-black">
                  Whatsapp Alert By{" "}
                  {mode === "area" ? "Entire Area" : "Exchange office"}
                </DialogTitle>
              </div>
              <DialogDescription className="text-[#585858] text-base mb-4">
                Get an immediate WhatsApp notification when your target rate
                becomes available near you.
              </DialogDescription>
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setStep(step + 1);
                }}
              >
                {/* City input (multi-select) */}
                <div>
                  <MultipleSelector
                    defaultOptions={cityOptions}
                    value={selectedCities}
                    onChange={setSelectedCities}
                    icon={LocateFixed}
                    placeholder="Type your city"
                    emptyIndicator={
                      <span className="text-gray-400 text-xs">
                        No results found.
                      </span>
                    }
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    *You can select multiple cities
                  </div>
                </div>
                {/* Exchange Office (optional, only for office mode) */}
                {mode === "office" && (
                  <div className="mt-4">
                    <FloatingSelect
                      label="Exchange Office (Optional)"
                      placeholder="All Office"
                      options={[
                        { label: "All Office", value: "all" },
                        ...offices.map((office) => ({
                          label: office,
                          value: office,
                        })),
                      ]}
                      value={selectedOffice || "all"}
                      onChange={(value) =>
                        setSelectedOffice(value === "all" ? "" : value)
                      }
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      *{offices.length} Office found
                    </div>
                  </div>
                )}
                {/* Phone input */}
                <PhoneInput
                  value={phone}
                  onChange={(value) => {
                    // For the specific case of typing +212 (Morocco code), force a reset first
                    if (
                      value &&
                      typeof value === "string" &&
                      value.startsWith("+212") &&
                      phone !== value
                    ) {
                      setPhone(undefined);
                      setTimeout(() => setPhone(value), 0);
                    } else {
                      setPhone(value || undefined);
                    }
                  }}
                  placeholder="Type your phone number"
                  defaultCountry="MA"
                />
                {/* Currencies */}
                <div className="flex-1 pt-2">
                  <DualCurrencySelector
                    fromLabel="Source Currency"
                    toLabel="Target Currency"
                    onCurrencyChange={handleCurrencyChange}
                  >
                    {({ fromProps, toProps, fromLabel, toLabel }) => (
                      <>
                        <FloatingSelectCurrency
                          {...fromProps}
                          label={fromLabel}
                        />

                        <Image
                          src="/svg/exchange-rotate.svg"
                          alt="Exchange currencies"
                          width={24}
                          height={24}
                          className="h-6 w-6"
                          priority
                        />

                        <FloatingSelectCurrency {...toProps} label={toLabel} />
                      </>
                    )}
                  </DualCurrencySelector>
                </div>
                {/* Alert me when */}
                <div className="flex flex-col gap-2 mt-4">
                  <span className="text-sm font-bold mb-2 text-black">
                    Alert me when{" "}
                  </span>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <FloatingLabelInput
                        label="Source Currency"
                        placeholder="1 MAD0"
                        onChange={(value: string) =>
                          console.log("New Source Currency:", value)
                        }
                      />
                    </div>

                    <div className="flex-1">
                      <FloatingAmountInput
                        label="Amount"
                        placeholder="Enter amount"
                        currencyCode={sourceCurrency}
                        onChange={(value: string) =>
                          console.log("New Amount:", value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="text-xs text-[#585858] mt-1">
                  Add Notify me when 1 MAD exceeds 0.10 USD
                </div>
                <div className="flex items-start mt-2">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="mr-2 w-5 h-5 accent-greeny"
                  />
                  <label
                    htmlFor="newsletter"
                    className="text-xs text-[#585858]"
                  >
                    Add me to your newsletter and keep me updated whenever your
                    publish new exchange rate
                  </label>
                </div>
                <div className="flex items-center justify-end mt-4">
                  <Button variant="gradient" onClick={handleSetReminder}>
                    Set Reminder
                  </Button>
                </div>
              </form>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    );
  }

  // Step 2: Success
  if (success) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md w-full flex flex-col items-center justify-center text-center p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key="step-success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <div className="flex items-center justify-center mb-4">
                <Image
                  src="/svg/alarm-sucess.svg"
                  alt="Whatsapp Alert"
                  width={100}
                  height={100}
                />
              </div>
              <DialogTitle className="text-xl font-bold text-black mb-2">
                Alarm rate has been successfully set
              </DialogTitle>
              <DialogDescription className="text-[#585858] text-sm mb-6 max-w-[380px] mx-auto">
                You&apos;ll receive a WhatsApp alert when 1 MAD reaches 0.10 USD
                in{" "}
                {mode === "area"
                  ? selectedCities.join(", ") || "All Area"
                  : selectedOffice || "All Office"}
                .
              </DialogDescription>
              <Button
                variant="gradient"
                size="xl"
                onClick={() => {
                  setSuccess(false);
                  setStep(0);
                  setMode(null);
                  closeModal();
                }}
              >
                Back to Explore
              </Button>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    );
  }

  return null;
}
