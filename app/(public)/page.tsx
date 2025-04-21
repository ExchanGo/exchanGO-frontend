import Image from "next/image";
import HeroSection from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import BenefitsSection from "@/components/landing/BenefitsSection";
export default function Home() {
  return (
    <div className="min-h-screen exchango-gradient">
       <Navbar />
       <HeroSection />
       <BenefitsSection />
    </div>
  );
}
