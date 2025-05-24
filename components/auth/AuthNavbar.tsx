"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";
import { motion } from "framer-motion";

interface AuthNavbarProps {
  activeStep?: number;
}

export default function AuthNavbar({ activeStep = 1 }: AuthNavbarProps) {
  // Animation variants
  const stepVariants = {
    inactive: {
      opacity: 0.7,
      transition: { duration: 0.3 },
    },
    active: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        type: "spring",
        stiffness: 300,
      },
    },
  };

  const indicatorVariants = {
    inactive: {
      scale: 1,
      transition: { duration: 0.3 },
    },
    active: {
      scale: 1.2,
      transition: { duration: 0.5 },
    },
  };

  // Step routes
  const stepRoutes = {
    1: "/login",
    2: "/office-information",
    3: "/set-location",
  };

  return (
    <nav className="w-full flex flex-col justify-center border-b border-[#DEDEDE] h-[94px]">
      <div className="w-full max-w-7xl mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/svg/Logo-exchange-black.svg"
              alt="ExchanGo24"
              width={209}
              height={42}
              priority
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center">
            {/* Step 1: Register Account */}
            <Link href={stepRoutes[1]} className="no-underline">
              <motion.div
                className="hidden sm:flex items-center cursor-pointer hover:opacity-90 transition-opacity"
                initial="inactive"
                animate={activeStep === 1 ? "active" : "inactive"}
                variants={stepVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="flex items-center justify-center w-5 h-5 rounded-full text-black border border-[#DEDEDE] mr-2 text-sm"
                  variants={indicatorVariants}
                >
                  <Typography
                    variant="span"
                    fontFamily="dm"
                    className="text-sm"
                  >
                    1
                  </Typography>
                </motion.span>
                <Typography
                  variant="span"
                  fontFamily="dm"
                  className={`${
                    activeStep === 1
                      ? "text-black font-medium"
                      : "text-muted-foreground"
                  } text-sm`}
                >
                  Register Account
                </Typography>
              </motion.div>
            </Link>

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

            {/* Step 2: Office Information */}
            <Link href={stepRoutes[2]} className="no-underline">
              <motion.div
                className="hidden sm:flex items-center cursor-pointer hover:opacity-90 transition-opacity"
                initial="inactive"
                animate={activeStep === 2 ? "active" : "inactive"}
                variants={stepVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="flex items-center justify-center w-5 h-5 rounded-full text-black border border-[#DEDEDE] mr-2 text-sm"
                  variants={indicatorVariants}
                >
                  <Typography variant="span" fontFamily="dm">
                    2
                  </Typography>
                </motion.span>
                <Typography
                  variant="span"
                  fontFamily="dm"
                  className={`${
                    activeStep === 2
                      ? "text-black font-medium"
                      : "text-muted-foreground"
                  } text-sm`}
                >
                  Office Information
                </Typography>
              </motion.div>
            </Link>

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

            {/* Step 3: Set Location */}
            <Link href={stepRoutes[3]} className="no-underline">
              <motion.div
                className="flex items-center cursor-pointer hover:opacity-90 transition-opacity"
                initial="inactive"
                animate={activeStep === 3 ? "active" : "inactive"}
                variants={stepVariants}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.span
                  className="flex items-center justify-center w-5 h-5 rounded-full text-black border border-[#DEDEDE] mr-2 text-sm"
                  variants={indicatorVariants}
                >
                  <Typography variant="span" fontFamily="dm">
                    3
                  </Typography>
                </motion.span>
                <Typography
                  variant="span"
                  fontFamily="dm"
                  className={`${
                    activeStep === 3
                      ? "text-black font-medium"
                      : "text-muted-foreground"
                  } text-sm`}
                >
                  Set Location
                </Typography>
              </motion.div>
            </Link>
          </div>
        </div>

        <div>
          <Button
            variant="outline"
            className="border-[var(--color-greeny)] text-[var(--color-greeny)] hover:bg-green-50"
            asChild
          >
            <Link href="/login">
              <Typography variant="span" fontFamily="dm">
                Sign In
              </Typography>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
