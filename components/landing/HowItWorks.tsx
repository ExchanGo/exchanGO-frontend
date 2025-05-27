import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HowItWorks = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-16 bg-white">
      <div className="text-center mb-12">
        <p className="text-[var(--color-greeny)] text-base font-dm font-medium mb-4">
          Quick and Easy
        </p>
        <h2 className="text-[32px] font-dm font-bold text-[#111111] mb-4">
          Exchange at the best rate in 3 simple steps
        </h2>
        <p className="text-[var(--color-greeny-highlight)] max-w-[634px] mx-auto mb-4">
          Finding the best exchange rate has never been easier! Search, compare,
          and exchange. all in just a few clicks
        </p>
        <Button variant="gradient" size="xl" className="px-6">
          See rates near me
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="exchango-card rounded-2xl">
          <CardContent className="p-4">
            <div className="aspect-video w-full bg-gray-100 rounded-lg mb-6">
              <img
                src="/img/area-1-img.png"
                alt="Search interface"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-lg font-bold text-center text-dark mb-3">
              1. Search by city or nearby offices
            </h3>
            <p className="text-[#585858] text-center">
              Find money changers around you. Enter a city or enable geolocation
              to instantly see the closest exchange offices and their current
              rates
            </p>
          </CardContent>
        </Card>

        <Card className="exchango-card rounded-2xl">
          <CardContent className="p-6">
            <div className="aspect-video w-full bg-gray-100 rounded-lg mb-6">
              <img
                src="/img/area-2-img.png"
                alt="Compare rates interface"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-xl font-bold text-center text-[var(--color-greeny-bold)] mb-3">
              2. Compare real-time rates
            </h3>
            <p className="text-[#585858] text-center">
              Pick the best available deal. Browse updated rates from multiple
              exchange offices, along with their distance, opening hours, and
              live status.
            </p>
          </CardContent>
        </Card>

        <Card className="exchango-card rounded-2xl">
          <CardContent className="p-6">
            <div className="aspect-video w-full bg-gray-100 rounded-lg mb-6">
              <img
                src="/img/area-3-img.png"
                alt="Navigation interface"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <h3 className="text-xl font-bold text-center text-[var(--color-greeny-bold)] mb-3">
              3. Visit with confidence
            </h3>
            <p className="text-[#585858] text-center">
              Head straight to your chosen exchange office. Use the interactive
              map and reliable details to make your exchange without stress or
              surprises.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HowItWorks;
