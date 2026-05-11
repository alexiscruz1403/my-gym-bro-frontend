'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export function InvalidResetLink() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl">
          {t('auth.resetPasswordFlow.invalidLink.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {t('auth.resetPasswordFlow.invalidLink.description')}
        </p>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground w-full">
          <Link href="/forgot-password" className="text-primary hover:underline">
            {t('auth.resetPasswordFlow.invalidLink.requestNew')}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
