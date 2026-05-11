import type { Metadata } from 'next';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'MyGymBro — Olvidé mi contraseña',
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
