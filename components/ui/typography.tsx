import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  size?:
    | "xs"
    | "sm"
    | "base"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl"
    | "8xl"
    | "9xl"
    | "hero";
  children: React.ReactNode;
  fontFamily?: "dm" | "jakarta";
  weight?: "light" | "normal" | "medium" | "semibold" | "bold" | "extrabold";
  className?: string;
}

export function Typography({
  variant = "p",
  size,
  children,
  fontFamily = "dm",
  weight,
  className,
  ...props
}: TypographyProps) {
  const fontClass = fontFamily === "dm" ? "font-dm" : "font-jakarta";

  // Weight classes
  const weightClasses = {
    light: "font-light",
    normal: "font-normal",
    medium: "font-medium",
    semibold: "font-semibold",
    bold: "font-bold",
    extrabold: "font-extrabold",
  };

  // Responsive size classes with better mobile-first approach
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    base: "text-base",
    lg: "text-lg",
    xl: "text-xl",
    "2xl": "text-2xl",
    "3xl": "text-3xl",
    "4xl": "text-4xl",
    "5xl": "text-5xl",
    "6xl": "text-6xl",
    "7xl": "text-7xl",
    "8xl": "text-8xl",
    "9xl": "text-9xl",
    hero: "text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[112px]", // Responsive hero size
  };

  // Default sizes for each variant if no size is specified
  const defaultSizes = {
    h1: "hero",
    h2: "4xl",
    h3: "3xl",
    h4: "2xl",
    h5: "xl",
    h6: "lg",
    p: "base",
    span: "base",
  } as const;

  // Default weights for each variant
  const defaultWeights = {
    h1: "extrabold",
    h2: "bold",
    h3: "bold",
    h4: "semibold",
    h5: "semibold",
    h6: "medium",
    p: "normal",
    span: "normal",
  } as const;

  const finalSize = size || defaultSizes[variant];
  const finalWeight = weight || defaultWeights[variant];

  // Force the font via inline style and class
  const commonProps = {
    className: cn(
      fontClass,
      sizeClasses[finalSize],
      weightClasses[finalWeight],
      "leading-[1.2]", // Better line height for large text
      className
    ),
    style: {
      fontFamily:
        fontFamily === "dm"
          ? "var(--font-dm-sans)"
          : "var(--font-plus-jakarta)",
    },
    ...props,
  };

  switch (variant) {
    case "h1":
      return <h1 {...commonProps}>{children}</h1>;
    case "h2":
      return <h2 {...commonProps}>{children}</h2>;
    case "h3":
      return <h3 {...commonProps}>{children}</h3>;
    case "h4":
      return <h4 {...commonProps}>{children}</h4>;
    case "h5":
      return <h5 {...commonProps}>{children}</h5>;
    case "h6":
      return <h6 {...commonProps}>{children}</h6>;
    case "span":
      return <span {...commonProps}>{children}</span>;
    default:
      return <p {...commonProps}>{children}</p>;
  }
}
