"use client";

import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const userTypes = [
  {
    icon: "/svg/tools-expatriate.svg",
    title: "Expatriates",
    description:
      "Exchange often? Don't lose out on every transaction. Compare nearby exchange offices and make the most of every transaction.",
    action: "View rates near me",
  },
  {
    icon: "/svg/tools-traveler.svg",
    title: "Traveler",
    description:
      "Convert as soon as you land, no more tourist traps. Find the best rates in every city you visit.",
    action: "Star Seaching",
  },
  {
    icon: "/svg/tools-investor.svg",
    title: "Investor",
    description:
      "One point in the rates can mean hundreds. Compare side-by-side and get the best rate for large amounts.",
    action: "Simulate Exchange",
  },
  {
    icon: "/svg/tools-world.svg",
    title: "International student",
    description:
      "Small budget, big difference. Convert at the right time, in the right place, with no surprises.",
    action: "Find nearby rates",
  },
];

const ToolsExchange = () => {
  return (
    <div className="relative">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/img/bg-tools-exchange.webp"
          alt="Tools Exchange background"
          fill
          className="object-cover"
          priority
          quality={100}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="text-left mb-16 max-w-3xl">
          <p className="text-[var(--color-neon)] text-sm font-medium mb-4">
            Exchange, Simplified.
          </p>
          <h1 className="text-4xl font-bold font-dm text-white mb-4">
            Smart tools for smarter currency exchange.
          </h1>
          <p className="text-[#fff]/60 text-lg">
            We help you make better currency decisions, no matter where life
            takes you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userTypes.map((type) => (
            <Card
              key={type.title}
              className="relative border-[#434343] rounded-2xl shadow-lg overflow-hidden group"
            >
              {/* Card Background */}
              <div className="absolute inset-0 w-full h-full">
                <Image
                  src="/img/bg-tools-card.webp"
                  alt="Card background"
                  fill
                  className="object-cover"
                  quality={100}
                />
                <div className="absolute inset-0 group-hover:bg-[#13442F] transition-colors duration-300" />
              </div>

              <CardContent className="relative z-10 px-6 py-16 flex flex-col items-center text-center h-full">
                <Image
                  src={type.icon}
                  alt={type.title}
                  width={120}
                  height={120}
                  className="object-contain w-[120px] h-[120px] mb-6"
                />
                <h3 className="text-white text-xl font-bold mb-4">
                  {type.title}
                </h3>
                <p className="text-[#fff]/60 text-base text-dm mb-6 max-w-[220px] flex-grow">
                  {type.description}
                </p>
                <Button variant="gradient" size="lg">
                  {type.action}
                  <ArrowRight strokeWidth={2.5} />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsExchange;
