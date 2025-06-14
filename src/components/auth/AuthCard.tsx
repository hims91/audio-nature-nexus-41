
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AuthCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({ title, description, children, className }) => {
  return (
    <Card className={cn(
      'w-full max-w-md mx-auto',
      'bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl',
      'border border-white/20 dark:border-gray-800/50',
      'shadow-2xl shadow-black/10 dark:shadow-black/30',
      'transform hover:scale-[1.02] transition-all duration-300',
      'relative overflow-hidden',
      className
    )}>
      {/* Glass morphism background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-gray-800/10" />
      
      <CardHeader className="relative z-10 text-center pb-6">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-nature-forest to-nature-leaf bg-clip-text text-transparent">
          {title}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="relative z-10 space-y-6">
        {children}
      </CardContent>
    </Card>
  );
};

export default AuthCard;
