import Image from "next/image";
import exclude from "./exclude.svg";
import facebook1 from "./facebook-1.svg";
import image from "./image.svg";
// import line5 from "./line-5.svg";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";

export const Footer = () => {
  return (
    <div className="flex flex-col w-full items-start gap-2.5 px-4 sm:px-8 md:px-16 lg:px-20 xl:px-[149px] py-[60px] relative">
      <div className="relative w-full z-20">
        <div className="flex flex-col lg:flex-row w-full gap-16 lg:gap-28 xl:gap-43">
          {/* Logo and Contact Section */}
          <div className="flex flex-col w-full lg:w-[298px] items-start gap-4 shrink-0">
            <div className="relative w-[209px] h-[41px]">
              <Image
                className="w-[190px] h-[41px]"
                alt="Logo"
                width={209}
                height={41}
                src={"/svg/logo-exchange-black.svg"}
              />
            </div>

            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-col gap-2.5">
                <div className="[font-family:'DM_Sans-Regular',Helvetica] font-normal text-[#585858] text-sm">
                  hello.exchangego24@gmail.com
                </div>
                <div className="[font-family:'DM_Sans-Regular',Helvetica] font-normal text-[#585858] text-sm">
                  (629) 555-0129
                </div>
                <p className="[font-family:'DM_Sans-Regular',Helvetica] font-normal text-[#585858] text-sm">
                  2972 Westheimer Rd. Santa Ana, Illinois 85486
                </p>
              </div>

              {/* Social Media Icons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { Icon: Facebook, label: "Facebook" },
                  { Icon: Twitter, label: "Twitter" },
                  { Icon: Instagram, label: "Instagram" },
                  { Icon: Youtube, label: "Youtube" },
                ].map((social, index) => (
                  <div
                    key={index}
                    className="inline-flex items-center justify-center p-2 hover:bg-[#3bee5c] transform transition-all duration-300 rounded-full border-[0.67px] border-solid border-[#BFBFBF]/50"
                  >
                    <social.Icon className="w-4 h-4" color="#585858" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            {/* Company Section */}
            <div className="flex flex-col gap-6">
              <div className="[font-family:'DM_Sans-Medium',Helvetica] font-medium text-[#111111] text-sm">
                Company
              </div>
              <div className="flex flex-col gap-4">
                {[
                  "About us",
                  "Career",
                  "Partnership",
                  "Help center",
                  "Blog & news",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="[font-family:'DM_Sans-Regular',Helvetica] font-normal text-[#585858] text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Section */}
            <div className="flex flex-col gap-6">
              <div className="[font-family:'DM_Sans-Medium',Helvetica] font-medium text-[#111111] text-sm">
                Feature
              </div>
              <div className="flex flex-col gap-4">
                {[
                  "Location",
                  "Alert reminder",
                  "Global exchange",
                  "How it works",
                  "Testimony",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="[font-family:'DM_Sans-Regular',Helvetica] font-normal text-[#585858] text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Other Section */}
            <div className="flex flex-col gap-6">
              <div className="[font-family:'DM_Sans-Medium',Helvetica] font-medium text-[#111111] text-sm">
                Other
              </div>
              <div className="flex flex-col gap-4">
                {[
                  "Privacy policy",
                  "Cookie Policy",
                  "Legal",
                  "Complain",
                  "FAQ",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="[font-family:'DM_Sans-Regular',Helvetica] font-normal text-[#585858] text-sm"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="flex flex-col w-full items-start gap-[42px] mt-[127px] mb-[120px] bg-transparent">
          <div className="w-full h-px bg-[#BEBEBE]/50" />

          <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <p className="[font-family:'DM_Sans-Regular',Helvetica] font-normal text-[#585858] text-sm tracking-[0] leading-[19.6px]">
              ©2025 Iteration 1 Exchangego24 x Pixelzstudio™ all right reserved
            </p>

            <div className="[font-family:'DM_Sans-Regular',Helvetica] font-normal text-[#585858] text-sm tracking-[0] leading-[19.6px]">
              Terms and condition
            </div>
          </div>
        </footer>
      </div>

      <Image
        className="absolute w-full max-w-[540px] h-auto bottom-0 left-0 opacity-30 lg:opacity-100"
        alt="Vector"
        width={540}
        height={551}
        src="/svg/vector-footer.svg"
      />
    </div>
  );
};
