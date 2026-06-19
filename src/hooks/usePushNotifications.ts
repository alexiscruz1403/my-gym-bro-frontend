'use client';

import { useState, useEffect, useCallback } from 'react';
import { getVapidPublicKey, subscribePush, unsubscribePush } from '@/services/notifications.service';
import useAuthStore from '@/store/auth.store';

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i++) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function usePushNotifications() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    const supported =
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window;

    setIsSupported(supported);

    if (!supported || !isAuthenticated) {
      setIsLoading(false);
      return;
    }

    setPermission(Notification.permission);

    // getRegistration() resolves immediately (unlike .ready which waits for an active SW).
    // In dev mode the PWA plugin is disabled so no SW is registered — .ready would hang forever.
    navigator.serviceWorker.getRegistration()
      .then((reg) => (reg ? reg.pushManager.getSubscription() : null))
      .then((sub) => setSubscription(sub))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [isAuthenticated]);

  const subscribe = useCallback(async () => {
    if (!isSupported) return;
    setIsLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== 'granted') return;

      const reg = await navigator.serviceWorker.ready;
      const { publicKey } = await getVapidPublicKey();
      const applicationServerKey = urlBase64ToUint8Array(publicKey);

      const pushSub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey,
      });

      const p256dhKey = pushSub.getKey('p256dh');
      const authKey = pushSub.getKey('auth');

      if (!p256dhKey || !authKey) {
        pushSub.unsubscribe().catch(() => {});
        return;
      }

      await subscribePush({
        endpoint: pushSub.endpoint,
        p256dh: arrayBufferToBase64Url(p256dhKey),
        auth: arrayBufferToBase64Url(authKey),
        userAgent: navigator.userAgent,
      });

      setSubscription(pushSub);
    } catch {
      // Silent failure — user can retry via the toggle
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    if (!subscription) return;
    setIsLoading(true);
    try {
      await unsubscribePush(subscription.endpoint);
      await subscription.unsubscribe();
      setSubscription(null);
    } catch {
      // Silent failure
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  return {
    isSupported,
    isSubscribed: subscription !== null,
    isLoading,
    permission,
    subscribe,
    unsubscribe,
  };
}
