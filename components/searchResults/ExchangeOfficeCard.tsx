"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";

interface ExchangeOfficeCardProps {
  name: string;
  rate: string;
  location: string;
  hours: string;
  imageUrl: string;
  isPopular?: boolean;
  isOpen?: boolean;
}

export const ExchangeOfficeCard: React.FC<ExchangeOfficeCardProps> = ({
  name,
  rate,
  location,
  hours,
  imageUrl,
  isPopular = true,
  isOpen = true,
}) => {
  return (
    <article className="overflow-hidden grow shrink self-stretch my-auto bg-white rounded-lg border border-solid border-neutral-200 min-w-60 w-[221px]">
      <div className="overflow-hidden w-full text-xs font-medium leading-tight text-neutral-900">
        <div className="flex relative flex-col px-3 py-3.5 w-full aspect-[2.3]">
          <img
            src={imageUrl}
            alt={`${name} office`}
            className="object-cover absolute inset-0 size-full"
          />
          <div className="flex relative gap-5 justify-between w-full">
            {isPopular && (
              <div className="flex gap-0.5 justify-center items-center p-1 bg-white rounded shadow-[0px_6px_24px_rgba(0,0,0,0.16)]">
                <span className="self-stretch my-auto">
                  🔥 Popular Exchange
                </span>
              </div>
            )}
            {isOpen && (
              <div className="flex gap-0.5 justify-center items-center p-1 whitespace-nowrap bg-white rounded shadow-[0px_6px_24px_rgba(0,0,0,0.16)]">
                <span className="self-stretch my-auto">Open</span>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center p-5 w-full">
        <div className="w-full min-h-[191px]">
          <div className="w-full h-[103px]">
            <div className="w-full">
              <h3 className="text-base text-neutral-900">{name}</h3>
              <p className="mt-1 text-xl font-bold text-neutral-900">{rate}</p>
              <div className="mt-3 w-60 max-w-full text-sm text-zinc-600">
                <p className="leading-5">{location}</p>
                <p className="mt-1 leading-snug">{hours}</p>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center mt-11 w-full min-h-[46px] max-md:mt-10">
            <Button
              variant="outline"
              size="xl"
              className="flex-1 shrink gap-2.5 self-stretch px-6 py-3 my-auto text-base font-medium leading-snug text-green-900 rounded-md border border-green-900 border-solid basis-0 max-md:px-5"
            >
              Get Direction
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="flex gap-2.5 items-center self-stretch p-2 my-auto rounded-md border border-green-900 border-solid w-[46px]"
            >
              <Image
                src="/svg/more.svg"
                alt="more icon"
                width={24}
                height={24}
                priority
                className="w-6 h-6"
              />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
};
