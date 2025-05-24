"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="w-full max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <Image
          src="/svg/Logo.svg"
          alt="ExchanGo24"
          width={209}
          height={42}
          priority
        />
      </div>

      <div className="hidden md:flex items-center space-x-6 text-white">
        <Link href="/" className="hover:text-[#A5D6BC] transition-colors">
          Location
        </Link>
        <Link href="/" className="hover:text-[#A5D6BC] transition-colors">
          Benefit
        </Link>
        <Link href="/" className="hover:text-[#A5D6BC] transition-colors">
          Global exchange
        </Link>
        <Link href="/" className="hover:text-[#A5D6BC] transition-colors">
          How its works
        </Link>
        <Link href="/" className="hover:text-[#A5D6BC] transition-colors">
          Testimony
        </Link>
        <Link href="/" className="hover:text-[#A5D6BC] transition-colors">
          FAQ
        </Link>
      </div>

      <Button
        variant="outline"
        size="xl"
        asChild
        className="border-[var(--color-neon)] text-[var(--color-neon)] mt-2 hover:bg-[var(--color-neon)]/10 hover:border-[var(--color-neon)] hover:scale-[1.02] transition-all duration-300 hover:shadow-[0_0_20px_rgba(60,238,92,0.3)] active:scale-[0.98]"
      >
        <Link href="/login">Exchange office Space</Link>
      </Button>
    </nav>
  );
}
