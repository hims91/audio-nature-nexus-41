
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface BrandCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'glass';
  hover?: boolean;
}

const BrandCard: React.FC<BrandCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hover = true
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-nature-bark border-nature-mist/50 dark:border-nature-forest/50 shadow-md',
    elevated: 'bg-white dark:bg-nature-bark border-nature-mist/50 dark:border-nature-forest/50 shadow-xl',
    outlined: 'bg-white dark:bg-nature-bark border-2 border-nature-forest dark:border-nature-leaf shadow-sm',
    glass: 'bg-white/80 dark:bg-nature-bark/80 backdrop-blur-xl border-nature-mist/30 dark:border-nature-forest/30 shadow-lg'
  };

  const hoverClasses = hover 
    ? 'transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl dark:hover:shadow-nature-forest/20' 
    : '';

  return (
    <Card className={cn(
      variantClasses[variant],
      hoverClasses,
      'transition-colors duration-300',
      className
    )}>
      {children}
    </Card>
  );
};

interface BrandCardHeaderProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const BrandCardHeader: React.FC<BrandCardHeaderProps> = ({
  title,
  description,
  children,
  className
}) => {
  return (
    <CardHeader className={cn('pb-4', className)}>
      {title && (
        <CardTitle className="text-nature-forest dark:text-nature-cream text-xl font-bold">
          {title}
        </CardTitle>
      )}
      {description && (
        <CardDescription className="text-nature-stone dark:text-nature-stone">
          {description}
        </CardDescription>
      )}
      {children}
    </CardHeader>
  );
};

export const BrandCardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <CardContent className={cn('text-nature-bark dark:text-nature-cream', className)}>
      {children}
    </CardContent>
  );
};

export const BrandCardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className
}) => {
  return (
    <CardFooter className={cn('pt-4', className)}>
      {children}
    </CardFooter>
  );
};

export default BrandCard;
