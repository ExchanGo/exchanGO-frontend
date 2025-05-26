import React from "react";

// Base interface that all icons should extend
export interface BaseIconProps {
  width?: number | string;
  height?: number | string;
  className?: string;
  strokeColor?: string;
  strokeWidth?: number;
  fillColor?: string;
}

// For icons that might need different colors for different parts
export interface MultiColorIconProps extends BaseIconProps {
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

// For icons that are purely outline/stroke based
export interface OutlineIconProps extends Omit<BaseIconProps, 'fillColor'> {
  // No fill color needed for outline icons
}

// For icons that are purely filled
export interface FilledIconProps extends Omit<BaseIconProps, 'strokeColor' | 'strokeWidth'> {
  // No stroke properties needed for filled icons
}

// Icon component type
export type IconComponent = React.FC<BaseIconProps>; 