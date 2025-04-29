import React from "react";

interface Props {
  title: string;
}

const SectionBadge = ({ title }: Props) => {
  return (
    <div className="px-4 py-2 rounded-full border border-[var(--color-greeny)]/20 backdrop-blur-sm bg-white/5">
      <div className="flex items-center justify-center gap-3">
        <div className="relative flex items-center justify-center w-2.5 h-2.5">
          <div className="absolute w-full h-full rounded-full bg-[var(--color-neon)]/30 animate-[ping_2.5s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute w-3 h-3 rounded-full bg-[var(--color-neon)]/40 blur-[2px]" />
          <div className="absolute w-2 h-2 rounded-full bg-[var(--color-neon)] animate-pulse" />
        </div>
        <span className="text-sm font-medium tracking-wide text-[var(--color-greeny)] select-none">
          {title}
        </span>
      </div>
    </div>
  );
};

export default SectionBadge;
