import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  shape: "diamond" | "circle" | "rectangle" | "triangle" | "parallelogram";
  delay: number;
  width?: number;
  height?: number;
}

interface AnimatedConfettiProps {
  isActive: boolean;
}

// Colors matching the SVG design
const colors = [
  "#C0ED81",
  "#3CEE5C",
  "#20523C",
  "#7ED321",
  "#4CAF50",
  "#A2D729",
];
const shapes: (
  | "diamond"
  | "circle"
  | "rectangle"
  | "triangle"
  | "parallelogram"
)[] = ["diamond", "circle", "rectangle", "triangle", "parallelogram"];

export function AnimatedConfetti({ isActive }: AnimatedConfettiProps) {
  const [confettiPieces, setConfettiPieces] = useState<ConfettiPiece[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isActive && isMounted) {
      // Generate confetti pieces only on client side
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < 35; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const baseSize = Math.random() * 8 + 4; // 4-12px

        pieces.push({
          id: i,
          x: Math.random() * 100, // percentage
          y: -20, // start above the container
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: baseSize,
          shape: shape,
          width:
            shape === "rectangle" || shape === "parallelogram"
              ? baseSize * (1.5 + Math.random())
              : baseSize,
          height:
            shape === "rectangle" || shape === "parallelogram"
              ? baseSize * (0.6 + Math.random() * 0.4)
              : baseSize,
          delay: Math.random() * 2.5, // 0-2.5 seconds delay
        });
      }
      setConfettiPieces(pieces);
    }
  }, [isActive, isMounted]);

  // Don't render anything until mounted on client
  if (!isMounted || !isActive) return null;

  const renderShape = (piece: ConfettiPiece) => {
    const style = {
      backgroundColor: piece.color,
      width: "100%",
      height: "100%",
    };

    switch (piece.shape) {
      case "circle":
        return <div className="rounded-full" style={style} />;

      case "diamond":
        return (
          <div
            className="rotate-45"
            style={{
              ...style,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }}
          />
        );

      case "triangle":
        return (
          <div
            style={{
              ...style,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          />
        );

      case "parallelogram":
        return (
          <div
            style={{
              ...style,
              clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
            }}
          />
        );

      case "rectangle":
      default:
        return <div className="rounded-sm" style={style} />;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {confettiPieces.map((piece) => (
        <motion.div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            width: `${piece.width || piece.size}px`,
            height: `${piece.height || piece.size}px`,
          }}
          initial={{
            y: piece.y,
            rotate: piece.rotation,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            y: [piece.y, 650], // Fall to bottom of modal
            rotate: [
              piece.rotation,
              piece.rotation + (Math.random() > 0.5 ? 360 : -360),
            ],
            opacity: [0, 1, 1, 0.7, 0],
            scale: [0, 1.2, 1, 0.9, 0.6],
            x: [0, (Math.random() - 0.5) * 40], // Slight horizontal drift
          }}
          transition={{
            duration: 3.5 + Math.random() * 2.5, // 3.5-6 seconds
            delay: piece.delay,
            ease: "easeOut",
            times: [0, 0.15, 0.6, 0.85, 1],
          }}
        >
          {renderShape(piece)}
        </motion.div>
      ))}
    </div>
  );
}

// Enhanced burst confetti component
export function ConfettiBurst({ isActive }: { isActive: boolean }) {
  const [burstPieces, setBurstPieces] = useState<ConfettiPiece[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isActive && isMounted) {
      const pieces: ConfettiPiece[] = [];
      for (let i = 0; i < 25; i++) {
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const baseSize = Math.random() * 6 + 3; // 3-9px

        pieces.push({
          id: i,
          x: 50, // start from center
          y: 50,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: baseSize,
          shape: shape,
          width:
            shape === "rectangle" || shape === "parallelogram"
              ? baseSize * (1.2 + Math.random() * 0.8)
              : baseSize,
          height:
            shape === "rectangle" || shape === "parallelogram"
              ? baseSize * (0.5 + Math.random() * 0.5)
              : baseSize,
          delay: Math.random() * 0.4,
        });
      }
      setBurstPieces(pieces);
    }
  }, [isActive, isMounted]);

  // Don't render anything until mounted on client
  if (!isMounted || !isActive) return null;

  const renderShape = (piece: ConfettiPiece) => {
    const style = {
      backgroundColor: piece.color,
      width: "100%",
      height: "100%",
    };

    switch (piece.shape) {
      case "circle":
        return <div className="rounded-full" style={style} />;

      case "diamond":
        return (
          <div
            className="rotate-45"
            style={{
              ...style,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
            }}
          />
        );

      case "triangle":
        return (
          <div
            style={{
              ...style,
              clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
            }}
          />
        );

      case "parallelogram":
        return (
          <div
            style={{
              ...style,
              clipPath: "polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)",
            }}
          />
        );

      case "rectangle":
      default:
        return <div className="rounded-sm" style={style} />;
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {burstPieces.map((piece, index) => {
        const angle = (index / burstPieces.length) * 2 * Math.PI;
        const velocity = 50 + Math.random() * 80; // Increased velocity
        const endX = 50 + Math.cos(angle) * velocity;
        const endY = 50 + Math.sin(angle) * velocity;

        return (
          <motion.div
            key={piece.id}
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              width: `${piece.width || piece.size}px`,
              height: `${piece.height || piece.size}px`,
              marginLeft: `-${(piece.width || piece.size) / 2}px`,
              marginTop: `-${(piece.height || piece.size) / 2}px`,
            }}
            initial={{
              x: 0,
              y: 0,
              rotate: piece.rotation,
              opacity: 1,
              scale: 1,
            }}
            animate={{
              x: `${(endX - 50) * 4}px`, // Increased range
              y: `${(endY - 50) * 4}px`,
              rotate: piece.rotation + (Math.random() > 0.5 ? 720 : -720),
              opacity: 0,
              scale: 0.2,
            }}
            transition={{
              duration: 2 + Math.random() * 1, // 2-3 seconds
              delay: piece.delay,
              ease: "easeOut",
            }}
          >
            {renderShape(piece)}
          </motion.div>
        );
      })}
    </div>
  );
}
