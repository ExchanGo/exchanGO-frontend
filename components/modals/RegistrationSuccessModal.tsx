import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  AnimatedConfetti,
  ConfettiBurst,
} from "@/components/ui/AnimatedConfetti";
import Image from "next/image";

interface RegistrationSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RegistrationSuccessModal({
  isOpen,
  onClose,
}: RegistrationSuccessModalProps) {
  const router = useRouter();

  if (!isOpen) return null;

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  return (
    <motion.div
      className="fixed inset-0 flex items-center justify-center z-50 px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Modal content */}
      <motion.div
        className="bg-white rounded-xl shadow-xl w-full max-w-md relative z-10 overflow-hidden"
        initial={{ scale: 0.9, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 20, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        {/* Animated Confetti - Inside modal */}
        <AnimatedConfetti isActive={isOpen} />

        {/* Confetti Burst from center */}
        <ConfettiBurst isActive={isOpen} />

        {/* Success icon */}
        <motion.div
          className="flex justify-center relative z-20 mt-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            delay: 0.3,
            type: "spring",
            stiffness: 200,
            damping: 15,
          }}
        >
          <div className="relative w-[140px] h-[140px]">
            <Image
              src="/img/sucess-register.png"
              alt="sucess-register"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
        </motion.div>

        <div className="p-6 pt-8 text-center relative z-20">
          <motion.h2
            className="text-xl font-dm font-bold text-gray-900 mb-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Thank you for Registering.
          </motion.h2>
          <motion.p
            className="text-[#585858] mb-6 text-sm font-dm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            Our team will now review your office information. You'll receive a
            confirmation email within 24 to 48 hours. Once your account is
            approved, you'll be able to access your dashboard and set exchange
            rates.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex justify-center"
          >
            <Button variant="gradient" onClick={handleGoToDashboard}>
              Go to Dashboard
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
