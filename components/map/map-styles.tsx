"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { useMap } from "@/context/map-context";

// Water color constants
// const WATER_COLOR = "#4FB9E5"; // Bright blue water color

// The default map is already customized in the provider

export default function MapStyles() {
  // const { map } = useMap();
  const { setTheme } = useTheme();

  // Just set the light theme - the map styling is handled by the provider
  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

  // No tabs to render
  return null;
}
