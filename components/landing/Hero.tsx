"use client";

import CurrencyConverter from "@/components/landing/CurrencyConverter";
import HeroBackground from "@/components/landing/HeroBackground";

const HeroSection = () => {
  return (
    <section className="relative w-full py-12 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between mb-12 md:mb-20">
          <div className="max-w-2xl mb-8 md:mb-0">
            <h2 className="text-[var(--color-neon)] text-xl md:text-2xl font-medium mb-4">
              The Smartest Way to Exchange
            </h2>
            <h1 className="text-white text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-xl">
              Your Money
              <br />
              Deserves More
            </h1>
          </div>

          <div className="max-w-[390px] mt-8 md:mt-20">
            <p className="text-[var(--color-lite-cream)]/60 text-lg">
              Search & compare the best exchange rates around you, displayed on
              an interactive map. <br /> Find the best rates near you in just
              seconds.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
