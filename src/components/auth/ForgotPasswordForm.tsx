'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { authService } from '@/services/auth.service';
import { forgotPasswordSchema, type ForgotPasswordFormValues } from '@/lib/validations/auth.schemas';

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormValues): Promise<void> => {
    try {
      await authService.forgotPassword(data.email);
      setSent(true);
    } catch {
      toast.error('Ocurrió un error. Intenta de nuevo.');
    }
  };

  if (sent) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-2xl">Revisá tu correo</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Si existe una cuenta asociada a ese email, recibirás un enlace para restablecer tu
            contraseña en los próximos minutos. El enlace es válido por 30 minutos.
          </p>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            <Link href="/login" className="text-primary hover:underline">
              Volver al inicio de sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-display text-2xl">Olvidé mi contraseña</CardTitle>
      </CardHeader>

      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4 pb-6">
          <p className="text-sm text-muted-foreground">
            Ingresá tu email y te enviaremos un enlace para restablecer tu contraseña.
          </p>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              autoComplete="email"
              disabled={isSubmitting}
              {...register('email')}
            />
            {errors.email && (
              <p className="text-xs text-destructive">{errors.email.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? 'Enviando...' : 'Enviar enlace'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline">
              Volver al inicio de sesión
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
