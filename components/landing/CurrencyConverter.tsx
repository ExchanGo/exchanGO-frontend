"use client";

import { useState } from "react";
import { MapPin, ChevronDown, RotateCw, Clock } from "lucide-react";
import { Button } from "../ui/button";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState("1000");
  const [location, setLocation] = useState("Birmingham - Eng");
  const [sourceCurrency, setSourceCurrency] = useState("USD");
  const [targetCurrency, setTargetCurrency] = useState("Rupiah");

  return (
    <div className="w-auto max-w-full -mt-16 absolute z-30 inset-x-0 bg-white rounded-xl shadow-xl p-4 flex flex-col md:flex-row mx-16 my-10">   
     {/* Location */}
      <div className="flex-1 border-r p-3">
        <p className="text-sm text-gray-500 mb-2">Location</p>
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 text-gray-400 mr-2" />
            <span>{location}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Amount */}
      <div className="flex-1 border-r p-3">
        <p className="text-sm text-gray-500 mb-2">Amount</p>
        <div className="flex items-center">
          <span className="text-lg mr-1">$</span>
          <input
            type="text"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full text-lg focus:outline-none"
          />
        </div>
      </div>

      {/* Source Currency */}
      <div className="flex-1 border-r p-3">
        <p className="text-sm text-gray-500 mb-2">Source Currency</p>
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center">
            <span className="inline-block w-6 h-4 bg-blue-500 mr-2 rounded-sm">
              <span className="sr-only">USA flag</span>
            </span>
            <span>{sourceCurrency}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>      

      {/* Swap Button */}
      <div className="flex items-center justify-center p-3">
        <button className="p-2 bg-gray-100 rounded-full">
          <RotateCw className="h-5 w-5 text-gray-500" />
        </button>
      </div>

      {/* Target Currency */}
      <div className="flex-1 border-l p-3">
        <p className="text-sm text-gray-500 mb-2">Target Currency</p>
        <div className="flex items-center justify-between cursor-pointer">
          <div className="flex items-center">
            <span className="inline-block w-6 h-4 bg-red-500 mr-2 rounded-sm">
              <span className="sr-only">Indonesia flag</span>
            </span>
            <span>{targetCurrency}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Check Rates Button */}
      <div className="flex items-center justify-center pl-3">
        <Button variant="gradient">
          <Clock className="h-5 w-5 text-[var(--color-greeny)]" />
          Check Rates
        </Button>
      </div>
    </div>
  );
};

export default CurrencyConverter;
