
import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "dark" | "colored";
  blur?: "sm" | "md" | "lg";
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", blur = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative rounded-2xl border border-white/20 shadow-xl",
          {
            "bg-white/10 backdrop-blur-sm": variant === "default" && blur === "sm",
            "bg-white/15 backdrop-blur-md": variant === "default" && blur === "md",
            "bg-white/20 backdrop-blur-lg": variant === "default" && blur === "lg",
            "bg-black/10 backdrop-blur-md": variant === "dark",
            "bg-gradient-to-br from-nature-forest/20 to-nature-leaf/20 backdrop-blur-md": variant === "colored",
          },
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export { GlassCard };
