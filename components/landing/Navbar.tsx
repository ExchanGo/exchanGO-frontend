"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full py-4 px-8 flex justify-between items-center">
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
      <Link href="/" className="hover:text-[#A5D6BC] transition-colors">Location</Link>
      <Link href="/" className="hover:text-[#A5D6BC] transition-colors">Benefit</Link>
      <Link href="/" className="hover:text-[#A5D6BC] transition-colors">Global exchange</Link>
      <Link href="/" className="hover:text-[#A5D6BC] transition-colors">How its works</Link>
      <Link href="/" className="hover:text-[#A5D6BC] transition-colors">Testimony</Link>
      <Link href="/" className="hover:text-[#A5D6BC] transition-colors">FAQ</Link>
    </div>
    
    <div className="flex items-center space-x-4">
      <Link href="/" className="text-white border border-white rounded-md px-5 py-2 hover:bg-white hover:text-exchange-dark transition-colors">
        Register
      </Link>
      <Link href="/" className="bg-exchange-button text-exchange-dark font-medium rounded-md px-5 py-2 hover:bg-green-300 transition-colors">
        Sign in
      </Link>
    </div>
  </nav>
  );
}
