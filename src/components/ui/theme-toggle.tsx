
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  variant?: 'default' | 'ghost' | 'floating';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className, variant = 'default' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant={variant === 'floating' ? 'ghost' : 'ghost'}
      size="sm"
      className={cn(
        'relative w-10 h-10 rounded-full transition-all duration-500 overflow-hidden',
        variant === 'floating' && 'bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20',
        'group hover:scale-110 transform-gpu',
        className
      )}
    >
      <div className="relative w-full h-full flex items-center justify-center">
        <Sun className={cn(
          'w-5 h-5 transition-all duration-500 absolute',
          isDark ? 'rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100'
        )} />
        <Moon className={cn(
          'w-5 h-5 transition-all duration-500 absolute',
          isDark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
        )} />
      </div>
      
      {/* Ripple effect */}
      <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-300 opacity-0 group-hover:opacity-100" />
    </Button>
  );
};

export default ThemeToggle;
