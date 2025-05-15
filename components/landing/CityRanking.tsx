"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { CurrencyRakingSelect } from "@/components/ui/CurrencyRakingSelect";
import DualCurrencySelector from "../ui/DualCurrencySelector";
import { getCurrencySymbol } from "@/lib/data/currencySymbols";
import { motion } from "framer-motion";

const exchangeData = [
  {
    rank: 1,
    city: "Casablanca",
    averageRate: 10.25,
    bestRate: 10.45,
    office: "Al Baraka",
  },
  {
    rank: 2,
    city: "Rabat",
    averageRate: 10.2,
    bestRate: 10.41,
    office: "Atlas Forex",
  },
  {
    rank: 3,
    city: "Marrakech",
    averageRate: 10.18,
    bestRate: 10.39,
    office: "Sahara Bureu",
  },
  {
    rank: 4,
    city: "Agadir",
    averageRate: 10.1,
    bestRate: 10.35,
    office: "Al ABestchange",
  },
  {
    rank: 5,
    city: "tanger",
    averageRate: 10.05,
    bestRate: 10.28,
    office: "DirhamX",
  },
];

const CityRanking = () => {
  const [currencySymbol, setCurrencySymbol] = useState("$");
  const [sourceCurrency, setSourceCurrency] = useState("USD");

  const handleCurrencyChange = (currencies: { from: string; to: string }) => {
    setSourceCurrency(currencies.from);
    console.log("Selected currencies:", currencies);
  };

  // Update currency symbol when source currency changes
  useEffect(() => {
    setCurrencySymbol(getCurrencySymbol(sourceCurrency));
  }, [sourceCurrency]);

  // Animation variants for rows
  const rowVariants = {
    initial: {
      scale: 1,
      backgroundColor: "rgba(255, 255, 255, 1)",
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
    hover: {
      scale: 1.015,
      backgroundColor: "rgba(248, 250, 249, 1)",
      y: -3,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
        velocity: 2,
      },
    },
  };

  // Animation variants for medal and ranking icons
  const medalVariants = {
    initial: {
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.15,
      rotate: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
        mass: 0.8,
        velocity: 2,
      },
    },
  };

  // Animation variants for text
  const textVariants = {
    initial: {
      color: "#585858",
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
    hover: {
      color: "var(--color-greeny-bold)",
      transition: {
        duration: 0.15,
        ease: "easeOut",
      },
    },
  };

  // Animation variants for best rate
  const bestRateVariants = {
    initial: {
      color: "#585858",
      scale: 1,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    hover: {
      color: "var(--color-greeny-bold)",
      scale: 1.04,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.8,
        velocity: 2,
      },
    },
  };

  return (
    <div className="relative w-full min-h-screen bg-[url('/svg/bg-ranking.svg')] bg-cover bg-center bg-no-repeat">
      <div className="relative w-full max-w-5xl mx-auto px-4 py-12 z-10">
        <div className="text-center mb-8">
          <h3 className="text-sm font-medium text-dm text-[#20523C]">
            City Ranking
          </h3>
          <h2 className="text-3xl font-bold text-[var(--color-greeny-bold)] mt-2">
            Today&apos;s Best Rates
          </h2>

          <p className="text-[#585858] mt-3">
            Track real-time exchange rates and never miss the best deal.
            <br />
            Stay informed and exchange smarter!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="col-span-2">
            <DualCurrencySelector
              fromLabel="Change from"
              toLabel="Change to"
              onCurrencyChange={handleCurrencyChange}
            >
              {({ fromProps, toProps, fromLabel, toLabel }) => (
                <>
                  <CurrencyRakingSelect {...fromProps} label={fromLabel} />
                  <CurrencyRakingSelect {...toProps} label={toLabel} />
                </>
              )}
            </DualCurrencySelector>
          </div>

          <div className="px-6 py-4 h-fit bg-white rounded-2xl border border-[#DEDEDE]">
            <p className="text-sm font-medium font-dm text-black mb-2">
              Amount
            </p>
            <div className="flex items-center">
              <span
                className="text-lg mr-1 font-medium text-[var(--color-greeny-bold)] transition-opacity duration-150"
                key={currencySymbol}
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {currencySymbol}
              </span>
              <Input
                type="text"
                placeholder="Enter amount"
                defaultValue="1"
                className="bg-white border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none px-0 py-0 h-6 font-dm md:text-lg text-[#585858]"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {/* Table Header */}
          <div className="grid grid-cols-5 gap-y-2 mb-2">
            <div className="contents">
              <div className="font-medium text-[#111111] p-4 text-sm font-dm text-left w-24">
                Rank
              </div>
              <div className="font-medium text-[#111111] p-4 text-sm font-dm text-left">
                City
              </div>
              <div className="font-medium text-[#111111] p-4 text-sm font-dm text-left">
                Average Rate
              </div>
              <div className="font-medium text-[#111111] p-4 text-sm font-dm text-left">
                Best Rate
              </div>
              <div className="font-medium text-[#111111] p-4 text-sm font-dm text-left">
                Exchange office
              </div>
            </div>
          </div>

          {/* Rows */}
          {exchangeData.map((row) => (
            <motion.div
              key={row.rank}
              className="relative mb-3 rounded-[1rem] overflow-hidden transform-gpu"
              initial="initial"
              whileHover="hover"
              layout
              layoutId={`row-${row.rank}`}
            >
              <motion.div
                className="absolute inset-0 bg-white rounded-[1rem] transform-gpu"
                variants={rowVariants}
                style={{
                  borderRadius: "1rem",
                  willChange: "transform",
                }}
              />

              <motion.div
                className="relative grid grid-cols-5 rounded-[1rem] overflow-hidden transform-gpu"
                variants={rowVariants}
                style={{
                  willChange: "transform",
                }}
              >
                <div className="p-4 flex items-center justify-center">
                  {row.rank <= 3 ? (
                    <motion.div
                      variants={medalVariants}
                      className="inline-flex items-center justify-center transform-gpu"
                      style={{
                        willChange: "transform",
                      }}
                      whileHover={{
                        rotate: [0, -8, 8, -4, 0],
                        transition: {
                          duration: 0.4,
                          ease: [0.4, 0, 0.2, 1],
                          times: [0, 0.25, 0.5, 0.75, 1],
                        },
                      }}
                    >
                      <Image
                        src={
                          row.rank === 1
                            ? "/svg/medal-gold.svg"
                            : row.rank === 2
                            ? "/svg/medal-selver.svg"
                            : "/svg/medal-bronze.svg"
                        }
                        alt={`${
                          row.rank === 1
                            ? "Gold"
                            : row.rank === 2
                            ? "Silver"
                            : "Bronze"
                        } medal icon`}
                        width={36}
                        height={36}
                        className="w-9 h-9"
                      />
                    </motion.div>
                  ) : (
                    <motion.span
                      variants={medalVariants}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-black font-dm font-medium"
                    >
                      {row.rank}
                    </motion.span>
                  )}
                </div>

                <motion.div
                  variants={textVariants}
                  className="flex flex-col justify-center p-4 font-dm font-medium cursor-pointer"
                >
                  {row.city}
                </motion.div>

                <motion.div
                  variants={textVariants}
                  className="flex flex-col justify-center p-4 font-dm font-medium"
                >
                  {row.averageRate}
                </motion.div>

                <motion.div
                  variants={bestRateVariants}
                  className="flex flex-col justify-center p-4 font-dm font-medium"
                >
                  {row.bestRate}
                </motion.div>

                <motion.div
                  variants={textVariants}
                  className="flex flex-col justify-center p-4 font-dm font-medium cursor-pointer hover:underline"
                >
                  {row.office}
                </motion.div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CityRanking;
