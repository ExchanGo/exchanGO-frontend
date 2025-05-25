import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

// Inline Skeleton component
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  );
}

export function LocationSearchSkeleton() {
  return (
    <div className="relative z-50 w-full max-w-[400px] mx-auto mt-8">
      {/* Search Input Skeleton */}
      <div className="flex items-center relative">
        <div className="relative w-full">
          <Skeleton className="h-14 w-full rounded-lg" />
          {/* Search icon placeholder */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-300" />
          </div>
          {/* Label placeholder */}
          <div className="absolute left-12 top-1/2 -translate-y-1/2">
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </div>

      {/* Current location button skeleton */}
      <div className="flex justify-center mt-2">
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-gray-300" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    </div>
  );
}
