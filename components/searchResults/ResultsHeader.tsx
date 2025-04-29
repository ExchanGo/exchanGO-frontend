import React from "react";

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
          <button className="flex gap-2 items-center self-stretch px-5 py-3 my-auto rounded-lg border border-green-900 border-solid">
            <span className="self-stretch my-auto">Filter</span>
            <span className="flex shrink-0 self-stretch my-auto w-6 h-6" />
          </button>
          <button className="flex gap-2 items-center self-stretch px-5 py-3 my-auto rounded-lg border border-green-900 border-solid">
            <span className="self-stretch my-auto">Sort</span>
            <span className="flex shrink-0 self-stretch my-auto w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
};
