"use client";

import Image from "next/image";
import { motion } from "framer-motion";

function Loading() {
  return (
    <div className="fixed inset-0 z-50">
      {/* Gradient Overlay Background */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            duration: 1.5,
            ease: "linear",
            repeat: Infinity,
          }}
          style={{ width: 82, height: 82 }}
        >
          <Image
            src="/svg/loader-search.svg"
            alt="Loading..."
            width={82}
            height={82}
            priority
            className="object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default Loading;
