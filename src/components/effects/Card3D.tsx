
import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'low' | 'medium' | 'high';
  glowEffect?: boolean;
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
}

const Card3D: React.FC<Card3DProps> = ({ 
  children, 
  className, 
  intensity = 'medium',
  glowEffect = true,
  soundEnabled = false,
  hapticEnabled = false
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const { playHover } = useSoundEffects();
  const { triggerHaptic } = useHapticFeedback();

  const intensityMap = {
    low: 5,
    medium: 15,
    high: 25,
  };

  const maxRotation = intensityMap[intensity];

  const handleMouseEnter = () => {
    if (soundEnabled) playHover();
    if (hapticEnabled) triggerHaptic('selection');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * maxRotation;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * -maxRotation;

    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
    
    if (glowEffect) {
      const glowX = ((e.clientX - rect.left) / rect.width) * 100;
      const glowY = ((e.clientY - rect.top) / rect.height) * 100;
      setGlowPosition({ x: glowX, y: glowY });
    }
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
    setGlowPosition({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative transition-transform duration-200 ease-out transform-gpu',
        'before:absolute before:inset-0 before:rounded-inherit before:opacity-0 before:transition-opacity before:duration-200',
        glowEffect && 'before:bg-gradient-radial before:from-white/20 before:to-transparent before:pointer-events-none',
        'hover:before:opacity-100',
        className
      )}
      style={{
        transform,
        transformStyle: 'preserve-3d',
        ...(glowEffect && {
          '--tw-gradient-from-position': `${glowPosition.x}% ${glowPosition.y}%`,
        }),
      }}
      onMouseEnter={handleMouseEnter}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {/* Glow overlay */}
      {glowEffect && (
        <div
          className="absolute inset-0 rounded-inherit opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none"
          style={{
            background: `radial-gradient(circle 100px at ${glowPosition.x}% ${glowPosition.y}%, rgba(255,255,255,0.1), transparent)`,
          }}
        />
      )}
    </div>
  );
};

export default Card3D;
