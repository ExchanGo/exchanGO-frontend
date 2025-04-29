"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Loader from "@/components/shared/Loader";

function Loading() {
  return (
    <div className="fixed inset-0 z-50">
      {/* Gradient Overlay Background */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      <Loader />
    </div>
  );
}

export default Loading;
