"use client";

import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Medal } from "lucide-react";
import { CurrencyRakingSelect } from "@/components/ui/CurrencyRakingSelect";

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
  return (
    <div className="relative w-full min-h-screen bg-[url('/svg/bg-ranking.svg')] bg-cover bg-center bg-no-repeat bg-fixed bg-auto">
      <div className="relative w-full max-w-5xl mx-auto px-4 py-12 z-10">
        <div className="text-center mb-8">
          <h3 className="text-sm font-medium text-dm text-[#20523C]">
            City Ranking
          </h3>
          <h2 className="text-3xl font-bold text-[var(--color-greeny-bold)] mt-2">
            Today's Best Rates
          </h2>

          <p className="text-[#585858] mt-3">
            Track real-time exchange rates and never miss the best deal.
            <br />
            Stay informed and exchange smarter!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <CurrencyRakingSelect
            label="Change from"
            defaultValue="USD"
            onValueChange={(value) =>
              console.log("From currency changed:", value)
            }
          />

          <CurrencyRakingSelect
            label="Change to"
            defaultValue="MAD"
            onValueChange={(value) =>
              console.log("To currency changed:", value)
            }
          />

          <div className="px-6 py-4 h-fit bg-white rounded-2xl border border-[#DEDEDE]">
            <p className="text-sm font-medium font-dm text-black mb-2">
              Amount
            </p>
            <Input
              type="text"
              placeholder="Enter amount"
              defaultValue="$1"
              className="bg-white border-0 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none focus-visible:outline-none px-0 py-0 h-6 font-dm md:text-lg text-[#585858]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <div className="grid grid-cols-5 gap-y-2">
            {/* Header */}
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

            {/* Rows */}
            {exchangeData.map((row) => (
              <div key={row.rank} className="contents group">
                <div className="bg-white p-4 group-first:rounded-l-lg group-first:border-l rounded-l-xl">
                  {row.rank <= 3 ? (
                    <div className={`inline-flex items-center justify-center`}>
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
                    </div>
                  ) : (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                      {row.rank}
                    </span>
                  )}
                </div>
                <div className="bg-white p-4 font-dm font-medium text-[#585858]">
                  {row.city}
                </div>
                <div className="bg-white p-4 font-dm font-medium text-[#585858]">
                  {row.averageRate}
                </div>
                <div className="bg-white p-4 font-dm text-[#585858] font-medium">
                  {row.bestRate}
                </div>
                <div className="bg-white p-4 font-dm font-medium text-[#585858] group-last:rounded-r-lg rounded-r-xl">
                  {row.office}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityRanking;
