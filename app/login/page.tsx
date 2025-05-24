"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import AuthNavbar from "@/components/auth/AuthNavbar";
import SocialLoginButtons from "@/components/auth/SocialLoginButtons";
import { Separator } from "@/components/ui/separator";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

const logoVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20,
      delay: 0.1,
    },
  },
};

export default function LoginPage() {
  return (
    <motion.div
      className="min-h-screen flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AuthNavbar />
      <div className="flex-1 flex flex-col items-center justify-center max-w-md mx-auto w-full px-4 py-8">
        <motion.div
          className="w-full space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center space-y-2" variants={logoVariants}>
            <h1 className="text-3xl text-[#212223] font-bold">
              Create an Account
            </h1>
            <p className="text-[#585858]">
              Gain visibility, increase foot traffic, and manage
              <br />
              your profile easily
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            <LoginForm />
          </motion.div>

          <motion.div
            className="flex items-center gap-4 my-6"
            variants={itemVariants}
          >
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">or</span>
            <Separator className="flex-1" />
          </motion.div>

          <motion.div variants={itemVariants}>
            <SocialLoginButtons />
          </motion.div>

          <motion.div className="text-center mt-6" variants={itemVariants}>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-green-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
