"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS } from "@/constants";
import AnimationContainer from "../shared/animation-container";
import Wrapper from "../shared/wrapper";
import SectionBadge from "../ui/section-badge";
import Image from "next/image";
import { Typography } from "@/components/ui/typography";
import { motion } from "framer-motion";
import { useState } from "react";

const FaqSection = () => {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const handleValueChange = (value: string) => {
    setOpenItem(value === openItem ? null : value);
  };

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
          <div className="w-full space-y-4">
            {FAQS.map((item, index) => {
              const itemValue = `item-${index}`;
              const isOpen = openItem === itemValue;

              return (
                <AnimationContainer
                  key={index}
                  animation="fadeUp"
                  delay={0.5 + index * 0.1}
                >
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{
                      scale: 1.005,
                      transition: { duration: 0.2, ease: "easeOut" },
                    }}
                    animate={{
                      borderColor: isOpen ? "transparent" : "#DEDEDE",
                      boxShadow: isOpen
                        ? "0px 8px 30px rgba(32,82,60,0.08)"
                        : "0px 0px 0px rgba(32,82,60,0)",
                    }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="bg-white/95 backdrop-blur-[2px] rounded-2xl px-6 border border-[#DEDEDE] overflow-hidden cursor-pointer"
                    onClick={() => handleValueChange(itemValue)}
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between py-6">
                      <motion.div
                        animate={{
                          color: isOpen
                            ? "var(--color-greeny-bold)"
                            : "#111111",
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex-1 pr-4"
                      >
                        <Typography
                          variant="h4"
                          className="font-dm font-medium text-[20px] leading-[1.4] text-left"
                        >
                          {item.question}
                        </Typography>
                      </motion.div>

                      {/* Custom Arrow */}
                      <motion.div
                        animate={{
                          rotate: isOpen ? 180 : 0,
                          color: isOpen
                            ? "var(--color-greeny-bold)"
                            : "#666666",
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex-shrink-0 w-5 h-5 flex items-center justify-center"
                      >
                        <svg
                          width="12"
                          height="8"
                          viewBox="0 0 12 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M1 1.5L6 6.5L11 1.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </motion.div>
                    </div>

                    {/* Answer Content */}
                    <motion.div
                      initial={false}
                      animate={{
                        height: isOpen ? "auto" : 0,
                        opacity: isOpen ? 1 : 0,
                      }}
                      transition={{
                        height: {
                          duration: 0.4,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        },
                        opacity: {
                          duration: 0.25,
                          ease: "easeInOut",
                          delay: isOpen ? 0.1 : 0,
                        },
                      }}
                      className="overflow-hidden"
                    >
                      <motion.div
                        initial={false}
                        animate={{
                          y: isOpen ? 0 : -8,
                          opacity: isOpen ? 1 : 0,
                        }}
                        transition={{
                          duration: 0.3,
                          ease: "easeOut",
                          delay: isOpen ? 0.15 : 0,
                        }}
                        className="text-[#585858] text-left pb-6"
                      >
                        {item.answer}
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </AnimationContainer>
              );
            })}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default FaqSection;
