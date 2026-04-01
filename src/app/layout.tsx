import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/sonner';
import { DarkModeInitializer } from '@/components/layout/DarkModeInitializer';
import { inter, oswald } from '@/lib/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gym Planner',
  description: 'Tu app de entrenamiento personal',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#09090b" />
      </head>
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        <DarkModeInitializer />
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
