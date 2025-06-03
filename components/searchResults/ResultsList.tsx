import React from "react";
import { ExchangeOfficeCard } from "./ExchangeOfficeCard";
import { useSearchResults } from "@/lib/hooks/useSearchResults";

export const ResultsList: React.FC = () => {
  const {
    searchResults,
    searchParams,
    isLoading,
    error,
    formatRate,
    getOfficeLogoUrl,
    formatWorkingHours,
  } = useSearchResults();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-32 w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!searchResults?.offices || searchResults.offices.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600 mb-4">
          No exchange offices found in your area.
        </p>
        <p className="text-sm text-gray-500">
          Try expanding your search radius or searching in a different location.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {searchResults.offices.map((office) => {
        const rate = searchParams
          ? formatRate(
              office,
              searchParams.sourceCurrency,
              searchParams.targetCurrency,
              searchParams.amount
            )
          : "Rate not available";

        const logoUrl = getOfficeLogoUrl(office);
        const workingHours = formatWorkingHours(office);
        const location = `${office.address}, ${office.city.name}`;

        return (
          <ExchangeOfficeCard
            key={office.id}
            id={office.id}
            name={office.officeName}
            rate={rate}
            location={location}
            hours={workingHours}
            imageUrl={logoUrl}
            phone={office.primaryPhoneNumber}
            whatsapp={office.whatsappNumber}
            distance={office.distanceInKm}
            isVerified={office.isVerified}
            isFeatured={office.isFeatured}
            coordinates={office.location.coordinates}
            slug={office.slug}
          />
        );
      })}
    </div>
  );
};
