
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { cn } from '@/lib/utils';

interface InteractiveButtonProps extends ButtonProps {
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection' | 'impact';
  soundEnabled?: boolean;
  hapticEnabled?: boolean;
  children: React.ReactNode;
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({
  hapticType = 'light',
  soundEnabled = true,
  hapticEnabled = true,
  className,
  onMouseEnter,
  onMouseLeave,
  onClick,
  children,
  ...props
}) => {
  const { playHover, playClick } = useSoundEffects();
  const { triggerHaptic } = useHapticFeedback();

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (soundEnabled) playHover();
    if (hapticEnabled) triggerHaptic('selection');
    onMouseEnter?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (soundEnabled) playClick();
    if (hapticEnabled) triggerHaptic(hapticType);
    onClick?.(e);
  };

  return (
    <Button
      className={cn(
        'transition-all duration-200 transform active:scale-95',
        'hover:shadow-lg hover:-translate-y-0.5',
        'focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Button>
  );
};

export default InteractiveButton;
