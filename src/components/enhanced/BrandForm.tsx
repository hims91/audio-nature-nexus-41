
import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface BrandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const BrandInput: React.FC<BrandInputProps> = ({
  label,
  error,
  required,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-nature-bark dark:text-nature-cream font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Input
        className={cn(
          'border-nature-mist dark:border-nature-forest bg-white dark:bg-nature-bark/50 text-nature-bark dark:text-nature-cream placeholder:text-nature-stone dark:placeholder:text-nature-stone focus:border-nature-forest dark:focus:border-nature-leaf focus:ring-nature-forest/20 dark:focus:ring-nature-leaf/20 transition-colors duration-300',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};

interface BrandTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const BrandTextarea: React.FC<BrandTextareaProps> = ({
  label,
  error,
  required,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-nature-bark dark:text-nature-cream font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Textarea
        className={cn(
          'border-nature-mist dark:border-nature-forest bg-white dark:bg-nature-bark/50 text-nature-bark dark:text-nature-cream placeholder:text-nature-stone dark:placeholder:text-nature-stone focus:border-nature-forest dark:focus:border-nature-leaf focus:ring-nature-forest/20 dark:focus:ring-nature-leaf/20 transition-colors duration-300 min-h-[100px]',
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
