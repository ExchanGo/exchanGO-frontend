import Nearby from "@/public/svg/nearby.svg";
import SaveTime from "@/public/svg/save-time.svg";
import TimeCompare from "@/public/svg/time-compare.svg";
import UserReview from "@/public/svg/use-review.svg";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";

const benefits = [
  {
    icon: TimeCompare,
    title: "Real-Time Rate Comparison",
    description:
      "Compare exchange rates from multiple money changers in one view.",
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
      <div className="w-full max-w-7xl mx-auto px-4 mt-16">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <span className="text-[var(--color-greeny)] text-base font-medium text-dm">
              The Best Reasons to
            </span>
            <Typography
              variant="h2"
              fontFamily="dm"
              className="text-2xl max-w-[454px] text-black md:text-[32px]  font-bold mt-2 mb-4"
            >
              Rely on Us for Transparent Exchange
            </Typography>
            <Typography
              fontFamily="dm"
              className="text-lg text-[#585858] mb-6 max-w-[350px]"
            >
              Searching for a great rate shouldn’t be stressful. ExchanGo24
              gives you a clear, instant view of all your options nearby.
            </Typography>

            <div className="max-w-[450px]">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-6 mb-6">
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
                    <Typography
                      variant="h3"
                      fontFamily="dm"
                      className="font-bold text-xl text-black"
                    >
                      {benefit.title}
                    </Typography>
                    <Typography
                      fontFamily="dm"
                      className="text-[#585858] text-lg"
                    >
                      {benefit.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="md:w-1/2 relative">
            <Image
              src="/img/benefits-down.png"
              alt="Exchange service demonstration"
              width={559}
              height={644}
              className="w-[559px] h-[644px] rounded-lg"
              quality={90}
              priority
            />
            <Image
              src="/img/benefits-up.png"
              alt="Exchange service demonstration"
              width={244}
              height={331}
              className="absolute w-[244px] h-[331px] top-35 -right-3.5 shadow-image"
              quality={90}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
