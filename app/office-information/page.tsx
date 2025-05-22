"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import AuthNavbar from "@/components/auth/AuthNavbar";
import OfficeInformationForm from "@/components/auth/OfficeInformationForm";

export default function OfficeInformationPage() {
  const router = useRouter();

  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AuthNavbar activeStep={2} />
      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full px-4 py-8">
        <motion.div
          className="w-full space-y-6"
          initial={{ y: 20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="text-center space-y-2">
            <h1 className="text-3xl text-[#212223] font-bold">
              Office Information
            </h1>
            <p className="text-[#585858]">
              Let us know more about your office by completing
              <br />
              the details below
            </p>
          </div>

          <OfficeInformationForm />
        </motion.div>
      </div>
    </motion.div>
  );
}
