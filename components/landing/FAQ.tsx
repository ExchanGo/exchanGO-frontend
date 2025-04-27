import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";

const faqData = [
  {
    question: "Are the displayed rates up-to-date and reliable?",
    answer:
      "Yes, all rates displayed on ExchangeGo24 are updated in real-time directly from exchange offices. We verify each rate with the provider to ensure accuracy.",
  },
  {
    question: "Are there any additional fees?",
    answer:
      "No hidden fees are charged by ExchanGo24. The rate displayed is exactly what the exchange office provides. If any fees apply on-site, they will be clearly indicated in the bureau's profile.",
  },
  {
    question: "Can I negotiate the rate on-site?",
    answer:
      "Some exchange offices may be open to negotiation, especially for larger amounts. However, the displayed rates are typically the best available rates.",
  },
  {
    question: "How often are the rates updated?",
    answer:
      "Exchange rates are updated multiple times throughout the day. Most providers update their rates every 15-30 minutes during operating hours.",
  },
  {
    question: "Can I see exchange offices near me?",
    answer:
      "Yes, you can use our location-based search to find the nearest exchange offices. Simply enable location services in your browser or enter your address.",
  },
];

const FAQ = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background wrapper */}
      <div className="absolute right-0 w-[35%] top-[8%] h-full">
        <div className="sticky top-0 h-screen">
          <Image
            src="/img/bg-faq.webp"
            alt="Tools Exchange background"
            fill
            className="object-contain"
            priority
            quality={100}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container py-24 mx-auto">
        <div className="text-center mb-12">
          <p className="text-[var(--color-greeny)] text-sm font-medium mb-2">
            Ask us Anything
          </p>
          <h2 className="text-4xl text-black font-bold mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-[#585858]">
            These are the most commonly asked questions about ExchangeGo 24
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqData.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white rounded-2xl px-6 border border-[#DEDEDE]"
              >
                <AccordionTrigger className="text-lg font-medium text-black text-left py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-[#585858] pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
