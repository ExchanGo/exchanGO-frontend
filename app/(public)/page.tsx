import HeroSection from "@/components/landing/Hero";
import Navbar from "@/components/landing/Navbar";
import BenefitsSection from "@/components/landing/BenefitsSection";
import HeroBackground from "@/components/landing/HeroBackground";
import CurrencyConverter from "@/components/landing/CurrencyConverter";
import CityRanking from "@/components/landing/CityRanking";
import HowItWorks from "@/components/landing/HowItWorks";
import ToolsExchange from "@/components/landing/ToolsExchange";
import TryNowSection from "@/components/landing/TryNowSection";
import Faq from "@/components/landing/FAQ";
export default function Home() {
  return (
    <div className="min-h-screen">
      <HeroBackground />
      <Navbar />
      <HeroSection />
      <CurrencyConverter />
      <BenefitsSection />
      <CityRanking />
      <HowItWorks />
      <ToolsExchange />
      <Faq />
      <TryNowSection />
    </div>
  );
}
