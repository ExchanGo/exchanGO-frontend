import { Clock } from "lucide-react";

const BenefitsSection = () => {
  return (
    <div className="w-auto py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start justify-between">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <span className="text-exchange-medium font-medium text-base">The Best Reasons to</span>
            <h2 className="text-3xl text-black md:text-4xl font-bold font-dm mt-2 mb-6">
              Rely on Us for Transparent Exchange
            </h2>
            <p className="font-dm text-lg text-[#585858] mb-8 max-w-[350px]">
            Searching for a great rate shouldn’t be stressful. ExchanGo24 gives you a clear, instant view of all your options nearby.
            </p>
            
            <div className="bg-exchange-lightest/10 rounded-lg p-6 border-l-4">
              <div className="flex items-center mb-3">
                <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-exchange-dark" />
                </div>
                <h3 className="font-bold text-xl">Real-Time Rate Comparison</h3>
              </div>
              <p className="text-gray-600">
                Compare exchange rates from multiple money changers in your area instantly.
              </p>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="relative">
              <div className="bg-white shadow-lg rounded-lg p-4 mb-8">
                <img 
                  src="/lovable-uploads/c694321d-74b4-483a-addb-a611077fbdcc.png" 
                  alt="Exchange service demonstration" 
                  className="w-full rounded-lg"
                  style={{ maxHeight: "400px", objectFit: "contain" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BenefitsSection;
