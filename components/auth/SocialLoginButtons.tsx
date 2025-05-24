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
      className="grid grid-cols-1 md:grid-cols-3 gap-3"
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
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.275 10.2297C19.275 9.51219 19.2133 8.79469 19.0808 8.10156H10V11.8773H15.2117C14.9633 13.0953 14.2648 14.1422 13.2336 14.8328V17.2422H16.3563C18.1633 15.5906 19.275 13.1422 19.275 10.2297Z"
                fill="#4285F4"
              />
              <path
                d="M10 19.375C12.6523 19.375 14.9055 18.5172 16.3594 17.2422L13.2367 14.8328C12.3492 15.4344 11.2445 15.7812 10 15.7812C7.49375 15.7812 5.3875 14.0781 4.6125 11.775H1.39375V14.2594C2.8375 17.3016 6.14844 19.375 10 19.375Z"
                fill="#34A853"
              />
              <path
                d="M4.6125 11.775C4.1875 10.5188 4.1875 9.1625 4.6125 7.90625V5.42188H1.39375C0.213437 7.875 0.213437 11.8063 1.39375 14.2594L4.6125 11.775Z"
                fill="#FBBC05"
              />
              <path
                d="M10 4.21875C11.3344 4.2 12.625 4.69844 13.6336 5.625L16.3914 2.86719C14.7828 1.36563 12.45 0.543752 10 0.625002C6.14844 0.625002 2.8375 2.69844 1.39375 5.74063L4.6125 8.225C5.3875 5.92188 7.49375 4.21875 10 4.21875Z"
                fill="#EA4335"
              />
            </svg>
          )}
          {isLoading === "google" ? "Connecting..." : "Google"}
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
              className="w-5 h-5 mr-2"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19.0938 10.0469C19.0938 5.0625 15.0312 1 10.0469 1C5.0625 1 1 5.0625 1 10.0469C1 14.5312 4.22656 18.2344 8.5 18.9062V12.5H6.25V10.0469H8.5V8.08594C8.5 5.98438 9.75 4.8125 11.6562 4.8125C12.5938 4.8125 13.5 5.03125 13.5 5.03125V7.1875H12.4062C11.3125 7.1875 10.9688 7.875 10.9688 8.58594V10.0469H13.3906L13 12.5H10.9688V18.9062C15.2422 18.2344 19.0938 14.5312 19.0938 10.0469Z"
                fill="#1877F2"
              />
            </svg>
          )}
          {isLoading === "facebook" ? "Connecting..." : "Facebook"}
        </Button>
      </motion.div>

      <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
        <Button
          variant="outline"
          className="w-full h-12 border-gray-200 hover:bg-gray-50"
          onClick={() => handleSocialLogin("apple")}
          disabled={!!isLoading}
        >
          {isLoading === "apple" ? (
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
              className="w-5 h-5 mr-2"
              viewBox="0 0 18 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5351 11.6293C14.5116 9.87633 15.4004 8.54932 17.2022 7.55635C16.1964 6.0773 14.6345 5.30412 12.5772 5.22393C10.6338 5.14603 8.5251 6.38105 7.7801 6.38105C7.01186 6.38105 5.16475 5.27222 3.64748 5.27222C1.29221 5.30412 0 6.70542 0 8.64607C0 9.53075 0.176322 10.444 0.529038 11.3832C1.0427 12.7478 2.98615 16.6596 5.02482 16.5794C6.04391 16.5466 6.72217 15.8105 8.08955 15.8105C9.42164 15.8105 10.0484 16.5794 11.1678 16.5794C13.2301 16.5432 14.9797 13.0182 15.4628 11.6502C12.7642 10.3538 12.5351 7.55635 12.5351 7.55635L14.5351 11.6293ZM10.4516 3.71288C11.8963 2.0144 11.708 0.499329 11.6611 0C10.3914 0.0729628 8.90982 0.861963 8.1415 1.83953C7.27329 2.91317 6.79014 4.15958 6.89485 5.18844C7.78836 5.26634 9.16911 5.16427 10.4516 3.71288Z"
                fill="black"
              />
            </svg>
          )}
          {isLoading === "apple" ? "Connecting..." : "Apple"}
        </Button>
      </motion.div>
    </motion.div>
  );
}
