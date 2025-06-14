
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  magneticStrength?: number;
  onClick?: () => void;
  disabled?: boolean;
}

const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  magneticStrength = 20,
  onClick,
  disabled = false,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [transform, setTransform] = useState('translate3d(0px, 0px, 0px)');

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current || disabled) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.2;
    const deltaY = (e.clientY - centerY) * 0.2;

    const clampedX = Math.max(-magneticStrength, Math.min(magneticStrength, deltaX));
    const clampedY = Math.max(-magneticStrength, Math.min(magneticStrength, deltaY));

    setTransform(`translate3d(${clampedX}px, ${clampedY}px, 0px)`);
  };

  const handleMouseLeave = () => {
    setTransform('translate3d(0px, 0px, 0px)');
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        'relative transition-transform duration-300 ease-out transform-gpu',
        'hover:scale-105 active:scale-95',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      style={{ transform }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
      
      {/* Ripple effect container */}
      <span className="absolute inset-0 overflow-hidden rounded-inherit">
        <span className="absolute inset-0 bg-white/20 transform scale-0 group-hover:scale-100 transition-transform duration-300 rounded-inherit" />
      </span>
    </button>
  );
};

export default MagneticButton;
