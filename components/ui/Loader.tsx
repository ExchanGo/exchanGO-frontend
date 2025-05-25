import { motion } from "framer-motion";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  isFullScreen?: boolean;
  color?: string;
}

export function Loader({
  size = "md",
  className = "",
  isFullScreen = false,
  color = "#54D10E",
}: LoaderProps) {
  const sizeMap = {
    sm: { circle: 16, stroke: 2 },
    md: { circle: 24, stroke: 3 },
    lg: { circle: 40, stroke: 4 },
  };

  const { circle, stroke } = sizeMap[size];

  const containerClass = isFullScreen
    ? "fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50"
    : "flex items-center justify-center";

  return (
    <div className={`${containerClass} ${className}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 1.4,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        <svg
          width={circle * 2}
          height={circle * 2}
          viewBox={`0 0 ${circle * 2} ${circle * 2}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx={circle}
            cy={circle}
            r={circle - stroke}
            stroke={`${color}33`}
            strokeWidth={stroke}
          />
          <path
            d={`M${circle} ${stroke} A${circle - stroke} ${
              circle - stroke
            } 0 0 1 ${circle * 2 - stroke} ${circle}`}
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
