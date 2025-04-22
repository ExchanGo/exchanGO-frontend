import Image from 'next/image';

export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      <Image
        src="/svg/bg-hero.svg"
        alt="Hero background"
        fill
        priority
        className="object-cover object-right"
        quality={100}
      />
    </div>
  );
} 