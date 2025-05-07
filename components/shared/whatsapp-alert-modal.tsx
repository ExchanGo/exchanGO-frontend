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
import { useState } from "react";
import { ChevronLeft, CheckCircle2, LocateFixed } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import MultipleSelector, {
  Option as MultiSelectOption,
} from "@/components/ui/multiple-selector";
import { cities, offices } from "@/constants";

export default function WhatsAppAlertModal() {
  const { isOpen, type, payloads, onClose } = useModal();
  const [step, setStep] = useState<number>(
    (payloads as { step?: number })?.step ?? 0
  );
  const [mode, setMode] = useState<"area" | "office" | null>(null);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedOffice, setSelectedOffice] = useState<string>("");
  const [phone, setPhone] = useState("");
  // const [sourceCurrency] = useState("Morocco Dirham");
  // const [targetCurrency] = useState("USD");
  const [sourceAmount, setSourceAmount] = useState("1 MAD");
  const [targetRate, setTargetRate] = useState("$0.10");
  const [newsletter, setNewsletter] = useState(false);
  const [success, setSuccess] = useState(false);

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
                <DialogDescription className="text-[#585858] text-base">
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
    const cityOptions: MultiSelectOption[] = cities.map((city) => ({
      label: city,
      value: city,
    }));
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
              className="px-6 py-6"
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
                className="space-y-3"
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
                      <span className="text-gray-400">No results found.</span>
                    }
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    *You can select multiple cities
                  </div>
                </div>
                {/* Exchange Office (optional, only for office mode) */}
                {mode === "office" && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      * Exchange Office ( Optional )
                    </label>
                    <select
                      className="w-full border rounded-lg px-3 py-2 bg-white"
                      value={selectedOffice}
                      onChange={(e) => setSelectedOffice(e.target.value)}
                    >
                      <option value="">All Office</option>
                      {offices.map((office) => (
                        <option key={office} value={office}>
                          {office}
                        </option>
                      ))}
                    </select>
                    <div className="text-xs text-gray-500 mt-1">
                      *{offices.length} Office found
                    </div>
                  </div>
                )}
                {/* Phone input */}
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Whatsapp number
                  </label>
                  <div className="flex gap-2">
                    <select
                      className="border rounded-lg px-2 py-2 bg-white"
                      defaultValue="+121"
                    >
                      <option value="+121">+121</option>
                      <option value="+212">+212</option>
                      <option value="+33">+33</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Type your phone number"
                      className="flex-1 border rounded-lg px-3 py-2 bg-white"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                {/* Currencies */}
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-black mb-1">
                      Source Currency
                    </label>
                    <div className="flex items-center border rounded-lg px-3 py-2 bg-white">
                      <Image
                        src="/svg/mad.svg"
                        alt="MAD"
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      <span className="font-medium">Morocco Dirham</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      1 MAD = 0.11 USD
                    </div>
                  </div>
                  <div className="flex items-center justify-center mt-6">
                    <Image
                      src="/svg/switch.svg"
                      alt="Switch"
                      width={28}
                      height={28}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-black mb-1">
                      Target Currency
                    </label>
                    <div className="flex items-center border rounded-lg px-3 py-2 bg-white">
                      <Image
                        src="/svg/usd.svg"
                        alt="USD"
                        width={24}
                        height={24}
                        className="mr-2"
                      />
                      <span className="font-medium">USD</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      1 USD = 9,30 MAD
                    </div>
                  </div>
                </div>
                {/* Alert me when */}
                <div className="flex gap-4 mt-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-black mb-1">
                      Source Currency
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2 bg-white"
                      value={sourceAmount}
                      onChange={(e) => setSourceAmount(e.target.value)}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-black mb-1">
                      Your Target Rate
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg px-3 py-2 bg-white"
                      value={targetRate}
                      onChange={(e) => setTargetRate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Add Notify me when 1 MAD exceeds 0.10 USD
                </div>
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="newsletter"
                    checked={newsletter}
                    onChange={(e) => setNewsletter(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-700">
                    Add me to your newsletter and keep me updated whenever your
                    publish new exchange rate
                  </label>
                </div>
                <Button
                  type="submit"
                  className="w-full mt-3 bg-lime-500 hover:bg-lime-600 text-white font-bold text-lg py-3 rounded-lg"
                  onClick={handleSetReminder}
                >
                  Set Reminder
                </Button>
              </form>
              {/* Footer message */}
              <div className="mt-3 text-center text-sm text-gray-600">
                {mode === "area"
                  ? `You'll receive a WhatsApp alert when 1 MAD reaches 0.10 USD in ${
                      selectedCities.join(", ") || "All Area"
                    }`
                  : `You'll receive a WhatsApp alert when 1 MAD reaches 0.10 USD in ${
                      selectedOffice || "All Office"
                    }`}
              </div>
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
              <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
              <DialogTitle className="text-2xl font-bold text-black mb-2">
                Alarm rate has been successfully set
              </DialogTitle>
              <DialogDescription className="text-[#585858] text-base mb-6">
                You'll receive a WhatsApp alert when 1 MAD reaches 0.10 USD in{" "}
                {mode === "area"
                  ? selectedCities.join(", ") || "All Area"
                  : selectedOffice || "All Office"}
                .
              </DialogDescription>
              <Button
                className="bg-lime-500 hover:bg-lime-600 text-white font-bold text-lg py-3 rounded-lg mt-4"
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
