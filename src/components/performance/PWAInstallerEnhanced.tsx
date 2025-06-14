
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, Smartphone, X, CheckCircle } from "lucide-react";
import { useServiceWorker } from "@/hooks/useServiceWorker";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const PWAInstallerEnhanced: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const { isSupported, isRegistered, hasUpdate, updateServiceWorker } = useServiceWorker();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      
      // Show prompt after a delay if user seems engaged
      setTimeout(() => {
        if (!isInstalled && localStorage.getItem('pwa-install-dismissed') !== 'true') {
          setShowPrompt(true);
        }
      }, 30000); // Show after 30 seconds
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowPrompt(false);
      localStorage.setItem('pwa-installed', 'true');
    };

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone || 
        localStorage.getItem('pwa-installed') === 'true') {
      setIsInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('PWA installed');
      setIsInstalled(true);
    } else {
      console.log('PWA installation dismissed');
      localStorage.setItem('pwa-install-dismissed', 'true');
    }
    
    setDeferredPrompt(null);
    setIsInstallable(false);
    setShowPrompt(false);
  };

  const dismissPrompt = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Update Available Banner */}
      {hasUpdate && (
        <Alert className="fixed top-0 left-0 right-0 z-50 rounded-none border-x-0 border-t-0 bg-blue-50 dark:bg-blue-950/20">
          <CheckCircle className="h-4 w-4 text-blue-600" />
          <AlertDescription className="flex items-center justify-between w-full">
            <span className="text-blue-800 dark:text-blue-200">
              A new version is available!
            </span>
            <Button
              size="sm"
              onClick={updateServiceWorker}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Update Now
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Installation Prompt */}
      {showPrompt && isInstallable && !isInstalled && (
        <Card className="fixed bottom-4 right-4 z-40 w-80 shadow-lg border-nature-forest">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-nature-forest" />
                <CardTitle className="text-lg">Install App</CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={dismissPrompt}
                className="h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <CardDescription>
              Get the full Terra Echo Studios experience on your device
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Works offline</li>
                <li>• Faster loading</li>
                <li>• Native app experience</li>
              </ul>
              <div className="flex space-x-2">
                <Button
                  onClick={handleInstall}
                  className="flex-1 bg-nature-forest hover:bg-nature-leaf"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Install
                </Button>
                <Button
                  variant="outline"
                  onClick={dismissPrompt}
                  className="flex-1"
                >
                  Later
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {isInstalled && (
        <Alert className="fixed bottom-4 right-4 z-40 w-80 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Terra Echo Studios has been installed successfully!
          </AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default PWAInstallerEnhanced;
