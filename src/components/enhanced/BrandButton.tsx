
import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface BrandButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  asChild?: boolean;
}

const BrandButton: React.FC<BrandButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  onClick,
  disabled = false,
  type = 'button',
  asChild = false,
  ...props
}) => {
  const variantClasses = {
    primary: 'bg-nature-forest text-white hover:bg-nature-leaf dark:bg-nature-leaf dark:hover:bg-nature-forest border-0',
    secondary: 'bg-nature-sage text-nature-bark hover:bg-nature-moss dark:bg-nature-moss dark:text-nature-cream border-0',
    outline: 'border-2 border-nature-forest text-nature-forest hover:bg-nature-forest hover:text-white dark:border-nature-leaf dark:text-nature-leaf dark:hover:bg-nature-leaf dark:hover:text-nature-bark',
    ghost: 'text-nature-forest hover:bg-nature-mist dark:text-nature-leaf dark:hover:bg-nature-forest/20 border-0'
  };

  return (
    <Button
      type={type}
      onClick={onClick}
      disabled={disabled}
      asChild={asChild}
      className={cn(
        'font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-nature-forest/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default BrandButton;
