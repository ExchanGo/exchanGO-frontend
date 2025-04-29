import React from "react";
import { ExchangeOfficeCard } from "./ExchangeOfficeCard";

export const ResultsList: React.FC = () => {
  const exchangeOffices = [
    {
      name: "Atlas Exchange",
      rate: "Rp 16430",
      location: "4140 Parker Rd. Allentown, New Mexico 31134",
      hours: "08:00 - 16:00",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/e0b0e015be8841d68e922a989572049c/e9f1840681e65187d02abf6f65958b364feba223?placeholderIfAbsent=true",
    },
    {
      name: "DirhamX",
      rate: "Rp 16450",
      location: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
      hours: "07:00 - 20:00",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/e0b0e015be8841d68e922a989572049c/3626fb916a2434bfedf89fde4c450ac20fdec957?placeholderIfAbsent=true",
    },
    {
      name: "Sahara Exchange",
      rate: "Rp 16512",
      location: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
      hours: "09:00 - 22:00",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/e0b0e015be8841d68e922a989572049c/191f0d4f796adb432dc3cbda8ca9f22df24913ed?placeholderIfAbsent=true",
    },
    {
      name: "Golden Dirham",
      rate: "Rp 16512",
      location: "2118 Thornridge Cir. Syracuse, Connecticut 35624",
      hours: "09:00 - 14:30",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/e0b0e015be8841d68e922a989572049c/6e51a6fa76ecfdad3a79c66704d5bbf80f25260c?placeholderIfAbsent=true",
    },
    {
      name: "Oasis Currency",
      rate: "Rp 1610",
      location: "4140 Parker Rd. Allentown, New Mexico 31134",
      hours: "10:00 - 17:00",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/e0b0e015be8841d68e922a989572049c/c687f51b3f2fcbbf1cc76a071357c60f002c1004?placeholderIfAbsent=true",
    },
    {
      name: "Casablanca Forex",
      rate: "Rp 16550",
      location: "3517 W. Gray St. Utica, Pennsylvania 57867",
      hours: "06:00 - 22:00",
      imageUrl:
        "https://cdn.builder.io/api/v1/image/assets/e0b0e015be8841d68e922a989572049c/4cf0360476ed667e83497ef9509c3ecff801c6a4?placeholderIfAbsent=true",
    },
  ];

  return (
    <div className="mt-4 w-full max-md:max-w-full">
      <div className="flex flex-wrap gap-6 items-center w-full max-md:max-w-full">
        {exchangeOffices.map((office, index) => (
          <ExchangeOfficeCard
            key={index}
            name={office.name}
            rate={office.rate}
            location={office.location}
            hours={office.hours}
            imageUrl={office.imageUrl}
          />
        ))}
      </div>
    </div>
  );
};
