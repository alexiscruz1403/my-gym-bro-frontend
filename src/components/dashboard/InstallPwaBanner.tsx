'use client';

import { useEffect, useRef, useState } from 'react';
import { Smartphone, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'pwa-banner-dismissed';

export function InstallPwaBanner() {
  const [visible, setVisible] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    if (localStorage.getItem(DISMISSED_KEY) === 'true') return;

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as BeforeInstallPromptEvent;
      setVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  async function handleInstall() {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    await deferredPrompt.current.userChoice;
    deferredPrompt.current = null;
    setVisible(false);
  }

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="flex items-start gap-3 p-4">
        <Smartphone className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">Instala MyGymBro en tu móvil</p>
          <p className="text-muted-foreground mt-0.5 text-xs">
            Accede más rápido desde tu pantalla de inicio.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button size="sm" onClick={handleInstall}>
            Instalar
          </Button>
          <Button size="sm" variant="ghost" onClick={handleDismiss}>
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
