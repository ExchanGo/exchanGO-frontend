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
      <div className="w-full max-w-7xl mx-auto px-4 mt-16">
        <div className="flex flex-col md:flex-row items-start gap-12">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <span className="text-[var(--color-greeny)] text-sm font-bold">
              The Best Reasons to
            </span>
            <Typography
              variant="h2"
              fontFamily="dm"
              className="text-[32px] max-w-[454px] text-black md:text-4xl font-bold mt-2 mb-4"
            >
              Rely on Us for Transparent Exchange
            </Typography>
            <Typography
              fontFamily="dm"
              className="text-lg text-[#585858] mb-6 max-w-[350px]"
            >
              Don't waste time visiting exchange offices. Find the best rates in
              seconds.
            </Typography>

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

          <div className="md:w-1/2 relative">
            <Image
              src="/img/benefits-down.png"
              alt="Exchange service demonstration"
              width={600}
              height={644}
              className="w-full rounded-lg"
              style={{ maxWidth: "500px", objectFit: "contain" }}
              quality={90}
              priority
            />
            <Image
              src="/img/benefits-up.png"
              alt="Exchange service demonstration"
              width={230}
              height={172}
              className="absolute top-35 right-10 shadow-image"
              style={{ maxWidth: "230px", objectFit: "contain" }}
              quality={90}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
