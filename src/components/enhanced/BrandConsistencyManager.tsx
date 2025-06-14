
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
  name: "Terra Echo Audio",
  tagline: "Professional Audio Engineering Services",
  logoUrl: "/lovable-uploads/b81abaac-e9d0-4854-ae43-8c139ac5522f.png",
  colors: {
    primary: "#22543D", // nature-forest
    secondary: "#68D391", // nature-leaf  
    accent: "#F0FFF4"    // nature-mist
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
}> = ({ 
  size = "md", 
  className = "",
  showText = true 
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

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <img 
        src={BRAND_CONFIG.logoUrl}
        alt={BRAND_CONFIG.name}
        className={`${sizeClasses[size]} object-contain`}
      />
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold text-nature-forest dark:text-white ${textSizeClasses[size]}`}>
            {BRAND_CONFIG.name}
          </span>
          {size !== "sm" && (
            <span className="text-xs text-nature-bark dark:text-gray-400">
              {BRAND_CONFIG.tagline}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export const BrandBadge: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <Badge className={`bg-nature-forest text-white hover:bg-nature-leaf ${className}`}>
      {children}
    </Badge>
  );
};

export const BrandHeading: React.FC<{ 
  children: React.ReactNode; 
  level?: 1 | 2 | 3 | 4;
  className?: string;
}> = ({ children, level = 1, className = "" }) => {
  const baseClass = "font-bold text-nature-forest dark:text-white";
  const sizeClass = {
    1: "text-4xl md:text-5xl",
    2: "text-3xl md:text-4xl", 
    3: "text-2xl md:text-3xl",
    4: "text-xl md:text-2xl"
  }[level];

  const Component = `h${level}` as keyof JSX.IntrinsicElements;
  
  return (
    <Component className={`${baseClass} ${sizeClass} ${className}`}>
      {children}
    </Component>
  );
};

export const BrandText: React.FC<{ 
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "muted";
  className?: string;
}> = ({ children, variant = "primary", className = "" }) => {
  const variantClass = {
    primary: "text-nature-forest dark:text-white",
    secondary: "text-nature-bark dark:text-gray-300", 
    muted: "text-nature-stone dark:text-gray-400"
  }[variant];

  return (
    <span className={`${variantClass} ${className}`}>
      {children}
    </span>
  );
};

const BrandConsistencyManager: React.FC = () => {
  return null; // This is just a utility component for brand consistency
};

export default BrandConsistencyManager;
