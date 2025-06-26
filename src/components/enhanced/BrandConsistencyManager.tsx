
import React from "react";
import { Badge } from "@/components/ui/badge";
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
    primary: "#2D5E40",
    secondary: "#4A7856",
    accent: "#E8F2E8"
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
  variant?: "default" | "light" | "dark";
}> = ({
  size = "md",
  className = "",
  showText = true,
  variant = "default"
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
  
  const textColorClasses = {
    default: "text-nature-forest dark:text-white",
    light: "text-white",
    dark: "text-nature-forest"
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src={BRAND_CONFIG.logoUrl} 
        alt={BRAND_CONFIG.name} 
        className={`${sizeClasses[size]} object-contain`} 
      />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textColorClasses[variant]} ${textSizeClasses[size]}`}>
            {BRAND_CONFIG.name}
          </span>
          {size !== "sm" && (
            <span className={`text-sm ${variant === 'light' ? 'text-gray-200' : 'text-gray-600 dark:text-gray-400'}`}>
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
    default: "bg-nature-forest text-white hover:bg-nature-leaf",
    secondary: "bg-nature-sage text-nature-forest hover:bg-nature-mist",
    outline: "border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white"
  };

  return (
    <Badge className={`${variantClasses[variant]} ${className}`}>
      {children}
    </Badge>
  );
};

export const BrandHeading: React.FC<{
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
  variant?: "default" | "light" | "contrast";
}> = ({
  children,
  level = 1,
  className = "",
  variant = "default"
}) => {
  const baseClass = "font-bold";
  const sizeClass = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl",
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl"
  }[level];
  
  const colorClasses = {
    default: "text-nature-forest dark:text-white",
    light: "text-white",
    contrast: "text-white dark:text-nature-forest"
  };
  
  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <Component className={`${baseClass} ${sizeClass} ${colorClasses[variant]} ${className}`}>
      {children}
    </Component>
  );
};

export const BrandText: React.FC<{
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "muted" | "light" | "contrast";
  className?: string;
}> = ({
  children,
  variant = "primary",
  className = ""
}) => {
  const variantClass = {
    primary: "text-nature-forest dark:text-white",
    secondary: "text-nature-leaf dark:text-nature-sage",
    muted: "text-gray-600 dark:text-gray-400",
    light: "text-white",
    contrast: "text-white dark:text-nature-forest"
  }[variant];
  
  return (
    <span className={`${variantClass} ${className}`}>
      {children}
    </span>
  );
};

// New utility component for consistent background handling
export const BrandContainer: React.FC<{
  children: React.ReactNode;
  variant?: "default" | "dark" | "accent" | "glass";
  className?: string;
}> = ({
  children,
  variant = "default",
  className = ""
}) => {
  const variantClasses = {
    default: "bg-white dark:bg-gray-900",
    dark: "bg-nature-forest text-white",
    accent: "bg-nature-mist dark:bg-gray-800",
    glass: "bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm"
  };

  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

const BrandConsistencyManager: React.FC = () => {
  return null; // This is just a utility component for brand consistency
};

export default BrandConsistencyManager;
