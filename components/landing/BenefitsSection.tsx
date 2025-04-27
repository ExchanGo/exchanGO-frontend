import { Clock } from "lucide-react";
import Nearby from "@/public/svg/nearby.svg";
import SaveTime from "@/public/svg/save-time.svg";
import TimeCompare from "@/public/svg/time-compare.svg";
import UserReview from "@/public/svg/use-review.svg";
import Image from "next/image";

const benefits = [
  {
    icon: TimeCompare,
    title: "Real-Time Rate Comparison",
    description:
      "Compare exchange rates from multiple money changers in your area instantly.",
  },
  {
    icon: Nearby,
    title: "Find Nearby Locations",
    description: "Discover the closest money changers with the best rates.",
  },
  {
    icon: SaveTime,
    title: "Save Time & Money",
    description: "Avoid bad rates and hidden fees.",
  },
  {
    icon: UserReview,
    title: "User Reviews & Ratings",
    description: "Choose trusted money changers based on user experiences.",
  },
];

const BenefitsSection = () => {
  return (
    <div className="w-auto py-16 bg-white">
      <div className="container mx-auto px-4 mt-14">
        <div className="flex flex-col md:flex-row items-start gap-10">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <span className="text-exchange-medium font-medium text-base">
              The Best Reasons to
            </span>
            <h2 className="text-[32px] max-w-[454px] text-black md:text-4xl font-bold font-dm mt-2 mb-4">
              Rely on Us for Transparent Exchange
            </h2>
            <p className="font-dm text-lg text-[#585858] mb-6 max-w-[350px]">
              Searching for a great rate shouldn't be stressful. ExchanGo24
              gives you a clear, instant view of all your options nearby.
            </p>

            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-4 mb-6">
                <Image
                  src={benefit.icon}
                  alt={benefit.title}
                  width={64}
                  height={64}
                  className="w-16 h-16"
                  priority={index < 2} // Prioritize loading first 2 icons
                  loading={index < 2 ? "eager" : "lazy"}
                  quality={75}
                />
                <div className="flex flex-col">
                  <h3 className="font-bold font-dm text-xl text-black">
                    {benefit.title}
                  </h3>
                  <p className="text-[#585858] font-dm text-lg">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <img
              src="/img/benefits-down.png"
              alt="Exchange service demonstration"
              className="w-full rounded-lg"
              style={{ maxWidth: "500px", objectFit: "contain" }}
            />
            <img
              src="/img/benefits-up.png"
              alt="Exchange service demonstration"
              className="absolute top-35 -right-1/7 shadow-image"
              style={{ maxWidth: "230px", objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
