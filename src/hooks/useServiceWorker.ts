
import { useEffect, useState } from "react";

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdating: boolean;
  hasUpdate: boolean;
}

export const useServiceWorker = () => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isUpdating: false,
    hasUpdate: false
  });

  useEffect(() => {
    if (!state.isSupported) return;

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        setState(prev => ({ ...prev, isRegistered: true }));

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          setState(prev => ({ ...prev, isUpdating: true }));

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                setState(prev => ({ 
                  ...prev, 
                  hasUpdate: true, 
                  isUpdating: false 
                }));
              } else {
                setState(prev => ({ ...prev, isUpdating: false }));
              }
            }
          });
        });

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    };

    registerSW();
  }, [state.isSupported]);

  const updateServiceWorker = () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({ type: 'SKIP_WAITING' });
    }
    window.location.reload();
  };

  return {
    ...state,
    updateServiceWorker
  };
};
