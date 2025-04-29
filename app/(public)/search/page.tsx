"use client";

import { ResultsHeader } from "@/components/searchResults/ResultsHeader";
import { ResultsList } from "@/components/searchResults/ResultsList";
import { SearchFilters } from "@/components/searchResults/SearchFilters";
// import dynamic from "next/dynamic";

// const Map = dynamic(() => import("@/components/dashboard/Map"), {
//   ssr: false, // Important: disable server-side rendering
// });

export default function Search() {
  return (
    <div className="grid grid-cols-12 max-md:grid-cols-1">
      {/* Left Section - Results */}
      <section className="col-span-8 max-md:col-span-1 min-h-screen border-r border-neutral-200 max-md:border-r-0">
        <SearchFilters />
        <div className="mx-8 mt-6">
          <ResultsHeader
            count={8}
            location="Central Park"
            lastUpdate="3 days Ago"
          />
          <div className="pb-10">
            <ResultsList />
          </div>
        </div>
      </section>

      {/* Right Section - Map */}
      <section className="col-span-4 max-md:col-span-1 block">
        <div className="sticky top-0 w-full h-screen max-md:relative max-md:h-[300px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/e0b0e015be8841d68e922a989572049c/c8b9dc5f636245969683bcb19324428eb5234012?placeholderIfAbsent=true"
            alt="Map View"
            className="w-full h-full object-cover"
          />
          {/* <Map /> */}
        </div>
      </section>
    </div>
  );
}
