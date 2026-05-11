import type { Metadata } from 'next';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { InvalidResetLink } from '@/components/auth/InvalidResetLink';

export const metadata: Metadata = {
  title: 'MyGymBro — Restablecer contraseña',
};

interface ResetPasswordPageProps {
  searchParams: Promise<{ token?: string }>;
}

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;

  if (!token) {
    return <InvalidResetLink />;
  }

  return <ResetPasswordForm token={token} />;
}
