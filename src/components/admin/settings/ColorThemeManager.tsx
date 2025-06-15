
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Palette, RefreshCw } from 'lucide-react';

interface BrandColors {
  primary: string;
  secondary: string;
  accent: string;
}

interface ColorThemeManagerProps {
  brandColors: BrandColors;
  onColorsUpdate: (colors: BrandColors) => void;
}

const ColorThemeManager: React.FC<ColorThemeManagerProps> = ({ brandColors, onColorsUpdate }) => {
  const handleColorChange = (colorType: keyof BrandColors, value: string) => {
    onColorsUpdate({
      ...brandColors,
      [colorType]: value,
    });
  };

  const resetToDefaults = () => {
    onColorsUpdate({
      primary: "#10b981",
      secondary: "#059669",
      accent: "#34d399",
    });
  };

  const applyTheme = () => {
    // Apply CSS custom properties to the document root
    const root = document.documentElement;
    root.style.setProperty('--color-primary', brandColors.primary);
    root.style.setProperty('--color-secondary', brandColors.secondary);
    root.style.setProperty('--color-accent', brandColors.accent);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Palette className="h-5 w-5 mr-2 text-nature-forest" />
          Brand Colors
        </CardTitle>
        <CardDescription>
          Customize your site's color scheme
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Primary Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="primaryColor"
                type="color"
                value={brandColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={brandColors.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                placeholder="#10b981"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="secondaryColor">Secondary Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="secondaryColor"
                type="color"
                value={brandColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={brandColors.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                placeholder="#059669"
                className="flex-1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="accentColor">Accent Color</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="accentColor"
                type="color"
                value={brandColors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                className="w-12 h-10 p-1 border rounded"
              />
              <Input
                type="text"
                value={brandColors.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
                placeholder="#34d399"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-4 border-t">
          <div className="flex space-x-2">
            <div 
              className="w-8 h-8 rounded border-2 border-gray-300"
              style={{ backgroundColor: brandColors.primary }}
              title="Primary Color"
            />
            <div 
              className="w-8 h-8 rounded border-2 border-gray-300"
              style={{ backgroundColor: brandColors.secondary }}
              title="Secondary Color"
            />
            <div 
              className="w-8 h-8 rounded border-2 border-gray-300"
              style={{ backgroundColor: brandColors.accent }}
              title="Accent Color"
            />
          </div>
          <div className="flex space-x-2 ml-auto">
            <Button variant="outline" onClick={resetToDefaults} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset to Defaults
            </Button>
            <Button onClick={applyTheme} size="sm">
              Apply Theme
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ColorThemeManager;
