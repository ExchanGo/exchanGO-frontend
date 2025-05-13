import React from "react";
import { cn } from "@/lib/utils";

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
  children: React.ReactNode;
  fontFamily?: "dm" | "jakarta";
  className?: string;
}

export function Typography({
  variant = "p",
  children,
  fontFamily = "dm",
  className,
  ...props
}: TypographyProps) {
  const fontClass = fontFamily === "dm" ? "font-dm" : "font-jakarta";

  // Force the font via inline style and class
  const commonProps = {
    className: cn(fontClass, className),
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
