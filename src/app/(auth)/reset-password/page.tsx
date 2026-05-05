import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'MyGymBro — Restablecer contraseña',
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">Enlace inválido</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Este enlace no es válido o ya fue utilizado. Solicitá un nuevo enlace para restablecer
            tu contraseña.
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            <Link href="/forgot-password" className="text-primary hover:underline">
              Solicitar nuevo enlace
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return <ResetPasswordForm token={token} />;
}
