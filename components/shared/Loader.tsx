"use client";
import { cn } from "@/lib/utils";
import "../../styles/spinner.css";

function Loader({
  text,
  className,
  noOverlay,
  titleClassName,
}: {
  text?: string;
  className?: string;
  noOverlay?: boolean;
  titleClassName?: string;
}) {
  return (
    <div
      className={cn("fixed flex place-content-center inset-0 z-50", className)}
    >
      {/* Gradient Overlay Background */}
      {!noOverlay && <div className="absolute inset-0 bg-black/20" />}

      {/* Content */}
      <div className="flex flex-col items-center gap-2.5 place-content-center">
        <div className="loader"></div>
        <p className={cn("text-white text-sm", titleClassName)}>
          {text || "Loading..."}
        </p>
      </div>
    </div>
  );
}

export default Loader;
