"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function SocialLoginButtons() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(provider);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Redirect to dashboard upon successful login
      router.push("/dashboard");
    } catch (error) {
      console.error(`${provider} login error:`, error);
    } finally {
      setIsLoading(null);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const buttonVariants = {
    hidden: {
      y: 20,
      opacity: 0,
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.98,
      transition: { duration: 0.1 },
    },
  };

  return (
    <motion.div
      className="flex flex-col  w-full gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          variant="outline"
          className="w-full h-12 border-gray-200 hover:bg-gray-50"
          onClick={() => handleSocialLogin("google")}
          disabled={!!isLoading}
        >
          {isLoading === "google" ? (
            <svg
              className="animate-spin h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <img src="/svg/gmail.svg" alt="gmail" className="w-5 h-5" />
          )}
          {isLoading === "google" ? "Connecting..." : "Sign in with Gmail"}
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          variant="outline"
          className="w-full h-12 border-gray-200 hover:bg-gray-50"
          onClick={() => handleSocialLogin("facebook")}
          disabled={!!isLoading}
        >
          {isLoading === "facebook" ? (
            <svg
              className="animate-spin h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M10 0.25C4.61509 0.25 0.25 4.61509 0.25 10C0.25 15.3849 4.61509 19.75 10 19.75C10.1383 19.75 10.2754 19.7465 10.4124 19.7408V12.6238H8.94161V10.1711H10.4124V8.69878C10.4124 6.6977 11.2411 5.50681 13.5982 5.50681H15.5607V7.96111H14.3344C13.4166 7.96111 13.3554 8.30331 13.3554 8.94314L13.3523 10.1711H15.5745L15.3148 12.6238H13.3523V19.159C17.0857 17.792 19.75 14.207 19.75 10C19.75 4.61509 15.3849 0.25 10 0.25Z"
                fill="#3B5998"
              />
            </svg>
          )}
          {isLoading === "facebook" ? "Connecting..." : "Sign in with Facebook"}
        </Button>
      </motion.div>
    </motion.div>
  );
}
