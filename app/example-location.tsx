"use client";

import { useState } from "react";
import { LocationAutoComplete } from "@/components/ui/LocationAutoComplete";

export default function ExampleLocation() {
  const [selectedLocation, setSelectedLocation] = useState("rabat");

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value);
    console.log("Selected location:", value);
  };

  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-6">Location AutoComplete Example</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Default Style</h2>
          <LocationAutoComplete
            defaultValue={selectedLocation}
            onLocationChange={handleLocationChange}
          />
          <p className="mt-4 text-sm text-gray-500">
            Selected value: {selectedLocation}
          </p>
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Custom Label</h2>
          <LocationAutoComplete
            defaultValue={selectedLocation}
            onLocationChange={handleLocationChange}
            label="Select City"
            placeholder="Type to search cities..."
          />
        </div>

        <div className="p-6 border rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Custom Locations</h2>
          <LocationAutoComplete
            defaultValue="new-york"
            onLocationChange={console.log}
            label="International Cities"
            locations={[
              { value: "new-york", label: "New York" },
              { value: "london", label: "London" },
              { value: "paris", label: "Paris" },
              { value: "tokyo", label: "Tokyo" },
              { value: "sydney", label: "Sydney" },
            ]}
          />
        </div>

        <div className="p-6 border rounded-lg shadow-sm bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">Custom Styling</h2>
          <LocationAutoComplete
            defaultValue={selectedLocation}
            onLocationChange={handleLocationChange}
            label="Location"
            className="bg-gray-50"
            prefixIconClassName="text-blue-500"
            iconClassName="text-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
