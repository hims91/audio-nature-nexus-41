
import React, { useEffect, useRef, useState } from "react";

interface ParallaxSectionProps {
  children: React.ReactNode;
  speed?: number;
  className?: string;
  offset?: number;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({ 
  children, 
  speed = 0.5, 
  className = "",
  offset = 0 
}) => {
  const [offsetY, setOffsetY] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        const scrolled = window.pageYOffset;
        const parallax = (scrolled - offset) * speed;
        setOffsetY(parallax);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [speed, offset]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translateY(${offsetY}px)`,
        transition: "transform 0.1s ease-out"
      }}
    >
      {children}
    </div>
  );
};

export default ParallaxSection;
