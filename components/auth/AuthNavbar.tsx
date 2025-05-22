"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface AuthNavbarProps {
  activeStep?: number;
}

export default function AuthNavbar({ activeStep = 1 }: AuthNavbarProps) {
  return (
    <nav className="w-full max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
      <div className="flex items-center">
        {/* <svg
          className="h-8 w-8 mr-2 text-green-500"
          viewBox="0 0 24 24"pp
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2L2 7L12 12L22 7L12 2Z" />
          <path d="M2 17L12 22L22 17M2 12L12 17L22 12" fillOpacity="0.5" />
        </svg>
        <h1 className="text-2xl font-bold">ExchanGo24</h1> */}
        <Image
          src="/svg/Logo-exchange-black.svg"
          alt="ExchanGo24"
          width={209}
          height={42}
          priority
        />
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <div className="hidden sm:flex items-center">
            <span
              className={`text-sm ${
                activeStep === 1
                  ? "text-green-600 font-medium"
                  : "text-muted-foreground"
              } mr-2`}
            >
              1
            </span>
            <span
              className={`${activeStep === 1 ? "font-medium" : ""} text-sm`}
            >
              Register Account
            </span>
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-2"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="hidden sm:flex items-center">
            <span
              className={`text-sm ${
                activeStep === 2
                  ? "text-green-600 font-medium"
                  : "text-muted-foreground"
              } mr-2`}
            >
              2
            </span>
            <span
              className={`${activeStep === 2 ? "font-medium" : ""} text-sm`}
            >
              Office Information
            </span>
          </div>
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="mx-2"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="flex items-center">
            <span
              className={`text-sm ${
                activeStep === 3
                  ? "text-green-600 font-medium"
                  : "text-muted-foreground"
              } mr-2`}
            >
              3
            </span>
            <span
              className={`${activeStep === 3 ? "font-medium" : ""} text-sm`}
            >
              Set Location
            </span>
          </div>
        </div>
      </div>

      <div>
        <Button
          variant="outline"
          className="border-green-500 text-green-500 hover:bg-green-50"
          asChild
        >
          <Link href="/login">Sign In</Link>
        </Button>
      </div>
    </nav>
  );
}
