"use client";

import React from "react";
import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";

export const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white px-8 pt-11 pb-8 w-full text-base leading-snug border-b border-neutral-200 max-md:px-5 max-md:max-w-full">
      <div className="flex flex-wrap gap-5 justify-between items-center w-full max-md:max-w-full">
        <Link href="/">
          <Image
            src="/svg/logo-exchange-black.svg"
            alt="Company Logo"
            width={209}
            height={42}
            className="object-contain shrink-0 self-stretch my-auto max-w-full aspect-[5.1] w-[209px]"
          />
        </Link>
        <div className="flex flex-wrap gap-4 items-center self-stretch my-auto text-[var(--color-zinc)] max-md:max-w-full">
          <a
            href="#"
            className="self-stretch my-auto hover:text-green-900 transition-all"
          >
            Location
          </a>
          <a
            href="#"
            className="self-stretch my-auto hover:text-green-900 transition-all"
          >
            Benefit
          </a>
          <a
            href="#"
            className="self-stretch my-auto hover:text-green-900 transition-all"
          >
            Global exchange
          </a>
          <a href="#" className="self-stretch my-auto hover:text-green-900">
            How its works
          </a>
          <a href="#" className="self-stretch my-auto hover:text-green-900">
            Testimony
          </a>
          <a href="#" className="self-stretch my-auto hover:text-green-900">
            FAQ
          </a>
        </div>
        <Button
          variant="outline"
          size="xl"
          className="border-[var(--color-greeny)] text-[var(--color-greeny)] hover:bg-[var(--color-greeny)]/10 hover:border-[var(--color-greeny)] hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_20px_rgba(32,82,60,0.3)] active:scale-[0.98]"
        >
          Exchange office Space
        </Button>
      </div>
    </nav>
  );
};
