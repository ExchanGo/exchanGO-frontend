import Image from "next/image";

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="w-full h-full relative overflow-hidden">
        <div
          className="w-full h-full absolute"
          style={{
            background: "linear-gradient(180deg, #20523C 50%, #2E7E5C 100%)",
          }}
        />
        <div
          className="min-w-[1763px] h-[838px] left-[-161px] top-[14px] absolute"
          style={{
            background:
              "linear-gradient(180deg, #26664A 6.09%, #0E2E20 34.68%)",
            filter: "blur(89.45970916748047px)",
          }}
        />
      </div>
      <Image
        src="/svg/pattern-hero.svg"
        alt="Hero background"
        fill
        priority
        className="object-contain object-top"
        quality={100}
      />
    </div>
  );
}
