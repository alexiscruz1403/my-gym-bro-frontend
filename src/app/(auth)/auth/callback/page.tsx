import { Suspense } from 'react';
import { OAuthCallback } from '@/components/auth/OAuthCallback';
import { Loader2 } from 'lucide-react';

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      <OAuthCallback />
    </Suspense>
  );
}
