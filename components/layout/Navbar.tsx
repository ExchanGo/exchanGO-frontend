"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
      <div className="flex items-center">
        <svg
          className="h-8 w-8 mr-2 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
          <path d="M2 17L12 22L22 17M2 12L12 17L22 12" fillOpacity="0.5" />
        </svg>
        <h1 className="text-white text-2xl font-bold">ExchanGo24</h1>
      </div>

      <div className="hidden md:flex items-center space-x-6 text-white">
        <Link
          href="/"
          className="hover:text-exchange-lightest transition-colors"
        >
          Location
        </Link>
        <Link
          href="/"
          className="hover:text-exchange-lightest transition-colors"
        >
          Benefit
        </Link>
        <Link
          href="/"
          className="hover:text-exchange-lightest transition-colors"
        >
          Global exchange
        </Link>
        <Link
          href="/"
          className="hover:text-exchange-lightest transition-colors"
        >
          How its works
        </Link>
        <Link
          href="/"
          className="hover:text-exchange-lightest transition-colors"
        >
          Testimony
        </Link>
        <Link
          href="/"
          className="hover:text-exchange-lightest transition-colors"
        >
          FAQ
        </Link>
      </div>

      <div className="flex items-center space-x-4">
        <Link
          href="/"
          className="text-white border border-white rounded-md px-5 py-2 hover:bg-white hover:text-exchange-dark transition-colors"
        >
          Register
        </Link>
        <Link
          href="/"
          className="bg-exchange-button text-exchange-dark font-medium rounded-md px-5 py-2 hover:bg-green-300 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </nav>
  );
}
