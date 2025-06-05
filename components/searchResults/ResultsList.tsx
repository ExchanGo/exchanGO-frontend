import React from "react";
import { ExchangeOfficeCard } from "./ExchangeOfficeCard";
import { useSearchResults } from "@/lib/hooks/useSearchResults";
import { MapPin, Building2, TrendingUp } from "lucide-react";

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
      <div className="w-full">
        {/* Loading Header */}
        <div className="mb-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-48 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </div>

        {/* Loading Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg h-96 w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                <Building2 className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Something went wrong
            </h3>
            <p className="text-red-600 mb-4 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!searchResults?.offices || searchResults.offices.length === 0) {
    return (
      <div className="w-full">
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Exchange Offices Found
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn't find any exchange offices in your selected area.
            </p>
            <div className="space-y-2 text-sm text-gray-500">
              <p>• Try expanding your search radius</p>
              <p>• Search in a different location</p>
              <p>• Check if your location is correct</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const officeCount = searchResults.offices.length;
  const locationName =
    searchParams?.location?.name ||
    searchParams?.location?.place_formatted ||
    "your area";

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 w-full">
        {searchResults.offices.map((office, index) => {
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
            <div
              key={office.id}
              className="w-full transform transition-all duration-200 hover:scale-[1.02] animate-fade-in-up"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <ExchangeOfficeCard
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
            </div>
          );
        })}
      </div>

      {/* Results Footer */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-center text-sm text-gray-500">
          <span>
            Showing {officeCount} exchange office{officeCount !== 1 ? "s" : ""}
            {searchResults.searchRadius &&
              ` within ${searchResults.searchRadius}km`}
          </span>
        </div>
      </div>
    </div>
  );
};
