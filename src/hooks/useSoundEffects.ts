
import { useCallback, useRef } from 'react';

interface SoundEffects {
  hover: string;
  click: string;
  success: string;
  error: string;
  notification: string;
}

const defaultSounds: SoundEffects = {
  hover: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmUgBT2U2fDDdh4GHnbK8NaSOwkVXrPp66hWFAhDnODyu2sgBjmR2fLEeh4GI3jJ8NSSOAkSYrPp69tVFAhEneHyvG0hBjqQ2+/HeBwGIXnG8NOUOwkSYrLn6tlWFAlEneHyu3AhBT2U2fDPeyEGHXbL8NaSOwsRYbPq6d1VFAlEmdz/y3QgBjuY2O3Gdx0GInnF8NKRPAkTYrLl6dxVFApEnt90n2UgBDyc2+7Edx8GH3nJ8NCSPgkOYLTK8N2SO0YY'
};

export const useSoundEffects = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isEnabledRef = useRef(true);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (error) {
        console.warn('Audio context not supported:', error);
      }
    }
  }, []);

  const playSound = useCallback((frequency: number, duration: number = 100, type: OscillatorType = 'sine') => {
    if (!isEnabledRef.current) return;
    
    initAudioContext();
    if (!audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
      oscillator.type = type;

      gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration / 1000);

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration / 1000);
    } catch (error) {
      console.warn('Sound playback failed:', error);
    }
  }, [initAudioContext]);

  const playHover = useCallback(() => {
    playSound(800, 50, 'sine');
  }, [playSound]);

  const playClick = useCallback(() => {
    playSound(1000, 100, 'square');
  }, [playSound]);

  const playSuccess = useCallback(() => {
    playSound(523, 150, 'sine'); // C5 note
    setTimeout(() => playSound(659, 150, 'sine'), 150); // E5 note
  }, [playSound]);

  const playError = useCallback(() => {
    playSound(300, 200, 'sawtooth');
  }, [playSound]);

  const playNotification = useCallback(() => {
    playSound(440, 100, 'sine'); // A4 note
  }, [playSound]);

  const toggleSounds = useCallback(() => {
    isEnabledRef.current = !isEnabledRef.current;
    return isEnabledRef.current;
  }, []);

  return {
    playHover,
    playClick,
    playSuccess,
    playError,
    playNotification,
    toggleSounds,
    isEnabled: isEnabledRef.current
  };
};
