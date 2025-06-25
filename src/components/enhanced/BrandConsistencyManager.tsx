
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface BrandConfig {
  name: string;
  tagline: string;
  logoUrl: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  contact: {
    email: string;
    phone: string;
    location: string;
  };
}

export const BRAND_CONFIG: BrandConfig = {
  name: "Terra Echo Studios",
  tagline: "Professional Audio Engineering Services",
  logoUrl: "/lovable-uploads/7b1e0e62-bb07-45e5-b955-59e6626241d5.png",
  colors: {
    primary: "hsl(var(--nature-forest))",
    secondary: "hsl(var(--nature-leaf))",
    accent: "hsl(var(--nature-mist))"
  },
  contact: {
    email: "TerraEchoStudios@gmail.com",
    phone: "+1 (555) 123-4567",
    location: "Los Angeles, CA"
  }
};

export const BrandLogo: React.FC<{
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  adaptive?: boolean;
  background?: "light" | "dark" | "transparent" | "auto";
}> = ({
  size = "md",
  className = "",
  showText = true,
  adaptive = false,
  background = "transparent"
}) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24"
  };
  
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl"
  };

  const getBackgroundClass = () => {
    if (background === "transparent") return "";
    if (background === "light") return "logo-contrast-light";
    if (background === "dark") return "logo-contrast-dark";
    if (background === "auto" || adaptive) return "logo-adaptive";
    return "";
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div className={cn(getBackgroundClass())}>
        <img 
          src={BRAND_CONFIG.logoUrl} 
          alt={BRAND_CONFIG.name} 
          className={cn(
            sizeClasses[size], 
            "object-contain transition-all duration-300",
            adaptive && "hover:scale-110"
          )} 
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            "font-bold text-nature-forest dark:text-nature-cream transition-colors duration-300",
            textSizeClasses[size]
          )}>
            {BRAND_CONFIG.name}
          </span>
          {size !== "sm" && (
            <span className="text-sm text-nature-stone dark:text-nature-stone">
              {BRAND_CONFIG.tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const BrandBadge: React.FC<{
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "outline";
}> = ({
  children,
  className = "",
  variant = "default"
}) => {
  const variantClasses = {
    default: "bg-nature-forest text-white hover:bg-nature-leaf dark:bg-nature-leaf dark:hover:bg-nature-forest",
    secondary: "bg-nature-sage text-nature-bark hover:bg-nature-moss dark:bg-nature-moss dark:text-nature-cream",
    outline: "border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white dark:border-nature-leaf dark:text-nature-leaf"
  };

  return (
    <Badge className={cn(variantClasses[variant], "transition-colors duration-300", className)}>
      {children}
    </Badge>
  );
};

export const BrandHeading: React.FC<{
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
  gradient?: boolean;
}> = ({
  children,
  level = 1,
  className = "",
  gradient = false
}) => {
  const baseClass = gradient 
    ? "font-bold bg-gradient-to-r from-nature-forest to-nature-leaf bg-clip-text text-transparent dark:from-nature-leaf dark:to-nature-forest"
    : "font-bold text-nature-forest dark:text-nature-cream";
    
  const sizeClass = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl"
  }[level];
  
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Component className={cn(baseClass, sizeClass, "transition-colors duration-300", className)}>
      {children}
    </Component>
  );
};

export const BrandText: React.FC<{
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "muted" | "accent";
  className?: string;
}> = ({
  children,
  variant = "primary",
  className = ""
}) => {
  const variantClass = {
    primary: "text-nature-forest dark:text-nature-cream",
    secondary: "text-nature-bark dark:text-nature-cream/80",
    muted: "text-nature-stone dark:text-nature-stone",
    accent: "text-nature-leaf dark:text-nature-leaf"
  }[variant];
  
  return (
    <span className={cn(variantClass, "transition-colors duration-300", className)}>
      {children}
    </span>
  );
};

// Re-export brand components
export { default as BrandButton } from './BrandButton';
export { default as BrandCard, BrandCardHeader, BrandCardContent, BrandCardFooter } from './BrandCard';
export { BrandInput, BrandTextarea } from './BrandForm';

const BrandConsistencyManager: React.FC = () => {
  return null; // This is just a utility component for brand consistency
};

export default BrandConsistencyManager;
