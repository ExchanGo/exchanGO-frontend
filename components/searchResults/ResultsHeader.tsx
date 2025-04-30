import Image from "next/image";
import React from "react";
import { Button } from "../ui/button";

interface ResultsHeaderProps {
  count: number;
  location: string;
  lastUpdate: string;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  count,
  location,
  lastUpdate,
}) => {
  return (
    <header className="flex flex-wrap gap-5 justify-between w-full leading-snug max-md:max-w-full">
      <div className="flex gap-1 items-center my-auto text-sm text-zinc-600">
        <span className="self-stretch my-auto">Showing </span>
        <span className="self-stretch my-auto font-bold text-green-900">
          {count}
        </span>
        <span className="self-stretch my-auto">Exchange office listing in</span>
        <span className="self-stretch my-auto font-bold text-green-900">
          {location}
        </span>
      </div>
      <div className="flex gap-4">
        <div className="flex gap-2 items-center my-auto text-sm text-right">
          <div className="flex gap-1 items-center self-stretch my-auto">
            <span className="self-stretch my-auto text-zinc-600">
              Last update
            </span>
            <span className="self-stretch my-auto font-bold text-green-900">
              {lastUpdate}
            </span>
          </div>
        </div>
        <div className="flex gap-2 items-center text-base font-medium text-green-900 whitespace-nowrap">
          <Button
            variant="outline"
            size="xl"
            className="flex gap-2 items-center self-stretch px-5 py-3 my-auto rounded-lg border border-green-900 border-solid"
            aria-label="Filter results"
          >
            <span className="self-stretch my-auto">Filter</span>
            <Image
              src="/svg/filter.svg"
              alt="Filter icon"
              width={24}
              height={24}
              priority
            />
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="flex gap-2 items-center self-stretch px-5 py-3 my-auto rounded-lg border border-green-900 border-solid"
            aria-label="Sort results"
          >
            <span className="self-stretch my-auto">Sort</span>
            <Image
              src="/svg/sort.svg"
              alt="Sort icon"
              width={24}
              height={24}
              priority
            />
          </Button>

          <Button
            variant="outline"
            size="xl"
            className="flex gap-2.5 items-center self-stretch p-2 my-auto rounded-md border border-green-900 border-solid w-[46px]"
          >
            <Image
              src="/svg/alert.svg"
              alt="more icon"
              width={24}
              height={24}
              priority
            />
          </Button>
        </div>
      </div>
    </header>
  );
};
