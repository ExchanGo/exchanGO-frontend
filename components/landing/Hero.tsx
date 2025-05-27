"use client";

import { Typography } from "@/components/ui/typography";

const HeroSection = () => {
  return (
    <section className="relative w-full py-12 md:py-24 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="max-w-full mb-8 md:mb-0">
            <Typography
              variant="h2"
              fontFamily="dm"
              size="2xl"
              weight="medium"
              className="text-[var(--color-neon)]"
            >
              Live. Smart. Transparent
            </Typography>

            <Typography
              variant="h1"
              fontFamily="jakarta"
              size="hero"
              weight="extrabold"
              className="text-white mb-6 drop-shadow-xl"
            >
              Your Money
              <br />
              Deserves More
            </Typography>
          </div>

          <div className="max-w-[390px] mt-8 md:mt-20">
            <Typography
              variant="p"
              fontFamily="jakarta"
              size="lg"
              className="text-[var(--color-lite-cream)]/60 leading-snug"
            >
              Search & compare the best exchange rates around you, displayed on
              an interactive map. <br /> Find the best rates near you in just
              seconds.
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
