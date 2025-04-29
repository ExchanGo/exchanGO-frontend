import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/constants";
import AnimationContainer from "../shared/animation-container";
import Wrapper from "../shared/wrapper";
import SectionBadge from "../ui/section-badge";
import Image from "next/image";

const Faq = () => {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute right-0 w-[35%] top-[8%] -z-10 h-full">
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

      <Wrapper className="py-20 lg:py-24">
        <div className="flex flex-col items-center text-center gap-4">
          <AnimationContainer animation="fadeUp" delay={0.2}>
            <SectionBadge title="Ask us Anything" />
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.3}>
            <h2 className="text-2xl md:text-4xl lg:text-5xl !leading-tight text-black font-bold">
              Frequently Asked Questions
            </h2>
          </AnimationContainer>

          <AnimationContainer animation="fadeUp" delay={0.4}>
            <p className="text-sm md:text-base lg:text-lg text-[#585858] max-w-2xl mx-auto">
              These are the most commonly asked questions about ExchangeGo 24
            </p>
          </AnimationContainer>
        </div>

        <div className="max-w-3xl mx-auto pt-10">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQS.map((item, index) => (
              <AnimationContainer
                key={index}
                animation="fadeUp"
                delay={0.5 + index * 0.1}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="bg-white rounded-2xl px-6 border border-[#DEDEDE]"
                >
                  <AccordionTrigger className="hover:no-underline py-6 text-base md:text-lg text-left text-black font-normal">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-[#585858] text-left">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </AnimationContainer>
            ))}
          </Accordion>
        </div>
      </Wrapper>
    </div>
  );
};

export default Faq;
