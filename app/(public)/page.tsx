import Image from "next/image";
import HeroSection from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HeroBackground from "@/components/landing/HeroBackground";
import CurrencyConverter from "@/components/landing/CurrencyConverter";
export default function Home() {
  return (
    <div className="min-h-screen">
       <HeroBackground />
       <Navbar />
       <HeroSection />
       <CurrencyConverter />
       <BenefitsSection />
    </div>
  );
}
