"use client";

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
import { Typography } from "@/components/ui/typography";
import { motion, AnimatePresence } from "framer-motion";

const contentVariants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

const FaqSection = () => {
  return (
    <div className="relative overflow-hidden min-h-[800px]">
      <div className="absolute right-0 w-full h-full">
        <div className="relative top-[50px] inset-0 h-screen w-full">
          <div className="absolute inset-0 pointer-events-none select-none">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-10" />
            <Image
              src="/img/bg-faq.webp"
              alt="FAQ Background"
              fill
              sizes="38vw"
              priority
              quality={90}
              className="object-contain object-right-top"
              style={{
                transform: "translate3d(0, 0, 0)",
              }}
            />
          </div>
        </div>
      </div>

      <Wrapper className="py-20 lg:py-24 relative">
        <div className="flex flex-col items-center text-center gap-4 relative z-10">
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

        <div className="max-w-3xl mx-auto pt-10 relative z-10">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {FAQS.map((item, index) => (
              <AnimationContainer
                key={index}
                animation="fadeUp"
                delay={0.5 + index * 0.1}
              >
                <motion.div
                  initial="closed"
                  animate="closed"
                  whileHover={{
                    scale: 1.005,
                    transition: {
                      duration: 0.2,
                      ease: "easeOut",
                    },
                  }}
                  style={{
                    transformOrigin: "center",
                    backfaceVisibility: "hidden", // Prevent flickering
                  }}
                >
                  <AccordionItem
                    value={`item-${index}`}
                    className="group bg-white/95 backdrop-blur-[2px] rounded-2xl px-6 border border-[#DEDEDE] transition-all duration-300 data-[state=open]:border-transparent data-[state=open]:shadow-[0px_8px_30px_rgba(32,82,60,0.08)]"
                  >
                    <AccordionTrigger className="hover:no-underline pt-6 text-left text-black font-normal data-[state=closed]:pb-6 data-[state=open]:pb-2 group-data-[state=open]:text-[var(--color-greeny-bold)] transition-all duration-300">
                      <motion.div
                        initial={false}
                        whileHover={{
                          scale: 1.01,
                          transition: { duration: 0.2, ease: "easeOut" },
                        }}
                        style={{
                          transformOrigin: "center",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <Typography
                          variant="h4"
                          className="font-dm font-medium text-[#111111] text-[20px] leading-[1.4] group-data-[state=open]:text-[var(--color-greeny-bold)] transition-colors duration-300"
                        >
                          {item.question}
                        </Typography>
                      </motion.div>
                    </AccordionTrigger>
                    <AccordionContent className="overflow-hidden text-[#585858] text-left">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`accordion-content-${index}`}
                          variants={contentVariants}
                          initial="closed"
                          animate="open"
                          exit="closed"
                          className="pb-6"
                          style={{
                            transformOrigin: "top",
                            backfaceVisibility: "hidden",
                          }}
                        >
                          <motion.div
                            initial={{ opacity: 0, y: -8 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              transition: {
                                duration: 0.3,
                                ease: "easeOut",
                                delay: 0.1,
                              },
                            }}
                            exit={{
                              opacity: 0,
                              transition: {
                                duration: 0.2,
                                ease: "easeIn",
                              },
                            }}
                            style={{
                              transformOrigin: "top",
                              backfaceVisibility: "hidden",
                            }}
                          >
                            {item.answer}
                          </motion.div>
                        </motion.div>
                      </AnimatePresence>
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              </AnimationContainer>
            ))}
          </Accordion>
        </div>
      </Wrapper>
    </div>
  );
};

export default FaqSection;
