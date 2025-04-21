"use client";

import CurrencyConverter from "@/components/landing/CurrencyConverter";

const HeroSection = () => {
  return (
    <div className="w-full py-12 md:py-24 exchango-gradient">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start justify-between mb-12 md:mb-20">
          <div className="max-w-2xl mb-8 md:mb-0">
            <h2 className="text-[var(--color-neon)] text-xl md:text-2xl font-medium mb-4">
              The Smartest Way to Exchange
            </h2>
            <h1 className="text-white text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
              Your Money<br />Deserves More
            </h1>
          </div>
          
          <div className="max-w-md mt-8 md:mt-20">
            <p className="text-[var(--color-lite-cream)] text-lg">
              Search and compare the best exchange rates from various money changers near you all in one interactive map.
            </p>
          </div>
        </div>
        
        <CurrencyConverter />
      </div>
    </div>
  );
};

export default HeroSection;
