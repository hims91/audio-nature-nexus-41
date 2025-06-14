
import React from "react";
import { cn } from "@/lib/utils";

interface FloatingElementProps {
  children: React.ReactNode;
  className?: string;
  intensity?: "light" | "medium" | "strong";
  delay?: number;
}

const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  className,
  intensity = "medium",
  delay = 0
}) => {
  const getAnimationClass = () => {
    switch (intensity) {
      case "light": return "animate-float-light";
      case "medium": return "animate-float";
      case "strong": return "animate-float-strong";
      default: return "animate-float";
    }
  };

  return (
    <div
      className={cn(getAnimationClass(), className)}
      style={{ animationDelay: `${delay}s` }}
    >
      {children}
    </div>
  );
};

export default FloatingElement;
