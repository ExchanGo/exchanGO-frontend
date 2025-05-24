import { Button } from "@/components/ui/button";
import Link from "next/link";

const TryNowSection = () => {
  return (
    <div className="frame container mx-auto py-20 px-4">
      <div className="content bg-[url('/svg/pattern-tryNow.svg')] bg-cover bg-center bg-no-repeat min-h-[400px] flex items-center justify-center">
        <div className="ellipse absolute" />
        <div className="relative z-10 text-center w-full">
          <p className="text-[var(--color-neon)] text-sm font-medium mb-4">
            The Best Deals Are Waiting
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Try Now & Save More on <br />
            Currency Exchange
          </h2>
          <p className="text-white/60 mb-8 max-w-[600px] mx-auto">
            Don&apos;t waste time and money on bad exchange rates. Use
            ExchangeGo24 and get the best deals with ease.
          </p>
          <Button
            asChild
            className="bg-[#3bee5c] hover:bg-[#3bee5c]/90 text-exchange-dark font-semibold font-dm px-8 py-4 text-base h-12"
          >
            <Link href="/login">Find the best rate</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TryNowSection;
