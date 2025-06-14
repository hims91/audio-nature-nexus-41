
import { useCallback, useRef } from 'react';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'selection' | 'impact' | 'notification';

export const useHapticFeedback = () => {
  const isEnabledRef = useRef(true);

  const triggerHaptic = useCallback((pattern: HapticPattern = 'light') => {
    if (!isEnabledRef.current) return;

    // Check if the device supports haptic feedback
    if ('vibrate' in navigator) {
      let vibrationPattern: number | number[];

      switch (pattern) {
        case 'light':
          vibrationPattern = 10;
          break;
        case 'medium':
          vibrationPattern = 20;
          break;
        case 'heavy':
          vibrationPattern = 50;
          break;
        case 'selection':
          vibrationPattern = [5];
          break;
        case 'impact':
          vibrationPattern = [10, 5, 10];
          break;
        case 'notification':
          vibrationPattern = [50, 30, 50];
          break;
        default:
          vibrationPattern = 10;
      }

      try {
        navigator.vibrate(vibrationPattern);
      } catch (error) {
        console.warn('Haptic feedback failed:', error);
      }
    }

    // For iOS devices with haptic feedback API
    if ('ontouchstart' in window && (window as any).DeviceMotionEvent) {
      try {
        // Try to use the iOS Haptic Feedback API if available
        if ((window as any).AudioContext || (window as any).webkitAudioContext) {
          // Fallback audio-based feedback for iOS
          const audioContext = new ((window as any).AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
          oscillator.type = 'sine';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.01);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.01);
        }
      } catch (error) {
        console.warn('iOS haptic feedback failed:', error);
      }
    }
  }, []);

  const triggerSelection = useCallback(() => triggerHaptic('selection'), [triggerHaptic]);
  const triggerImpact = useCallback(() => triggerHaptic('impact'), [triggerHaptic]);
  const triggerNotification = useCallback(() => triggerHaptic('notification'), [triggerHaptic]);
  const triggerLight = useCallback(() => triggerHaptic('light'), [triggerHaptic]);
  const triggerMedium = useCallback(() => triggerHaptic('medium'), [triggerHaptic]);
  const triggerHeavy = useCallback(() => triggerHaptic('heavy'), [triggerHaptic]);

  const toggleHaptics = useCallback(() => {
    isEnabledRef.current = !isEnabledRef.current;
    return isEnabledRef.current;
  }, []);

  return {
    triggerSelection,
    triggerImpact,
    triggerNotification,
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerHaptic,
    toggleHaptics,
    isEnabled: isEnabledRef.current
  };
};
