
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Volume2, VolumeX, Smartphone, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { cn } from '@/lib/utils';
import InteractiveButton from './InteractiveButton';

const FeedbackSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleSounds, isEnabled: soundsEnabled, playSuccess } = useSoundEffects();
  const { toggleHaptics, isEnabled: hapticsEnabled, triggerNotification } = useHapticFeedback();
  
  const [localSoundsEnabled, setLocalSoundsEnabled] = useState(soundsEnabled);
  const [localHapticsEnabled, setLocalHapticsEnabled] = useState(hapticsEnabled);

  const handleSoundToggle = () => {
    const newState = toggleSounds();
    setLocalSoundsEnabled(newState);
    if (newState) playSuccess();
  };

  const handleHapticToggle = () => {
    const newState = toggleHaptics();
    setLocalHapticsEnabled(newState);
    if (newState) triggerNotification();
  };

  const testSound = () => {
    playSuccess();
  };

  const testHaptic = () => {
    triggerNotification();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <InteractiveButton
          variant="ghost"
          size="sm"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 dark:bg-gray-800/50 dark:hover:bg-gray-700/50"
          hapticType="selection"
        >
          <Settings className="w-4 h-4" />
        </InteractiveButton>
      </DialogTrigger>
      
      <DialogContent className="max-w-md">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Feedback Settings</span>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Sound Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {localSoundsEnabled ? (
                    <Volume2 className="w-5 h-5 text-blue-500" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-medium">Sound Effects</span>
                </div>
                <Switch
                  checked={localSoundsEnabled}
                  onCheckedChange={handleSoundToggle}
                />
              </div>
              
              {localSoundsEnabled && (
                <InteractiveButton
                  onClick={testSound}
                  size="sm"
                  variant="outline"
                  hapticType="light"
                  className="w-full"
                >
                  Test Sound
                </InteractiveButton>
              )}
            </div>

            {/* Haptic Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Smartphone className={cn(
                    "w-5 h-5",
                    localHapticsEnabled ? "text-purple-500" : "text-gray-400"
                  )} />
                  <span className="font-medium">Haptic Feedback</span>
                </div>
                <Switch
                  checked={localHapticsEnabled}
                  onCheckedChange={handleHapticToggle}
                />
              </div>
              
              {localHapticsEnabled && (
                <InteractiveButton
                  onClick={testHaptic}
                  size="sm"
                  variant="outline"
                  hapticType="notification"
                  soundEnabled={false}
                  className="w-full"
                >
                  Test Haptic
                </InteractiveButton>
              )}
            </div>

            <div className="text-xs text-gray-500 dark:text-gray-400">
              * Haptic feedback requires a compatible device
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackSettings;
