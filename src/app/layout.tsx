import type { Metadata } from 'next';
import { connection } from 'next/server';
import { Toaster } from '@/components/ui/sonner';
import { DarkModeInitializer } from '@/components/layout/DarkModeInitializer';
import { Providers } from '@/components/layout/Providers';
import { inter, oswald } from '@/lib/fonts';
import { RUNTIME_CONFIG_ELEMENT_ID, serializeConfig } from '@/lib/runtime-config';
import './globals.css';

export const metadata: Metadata = {
  title: 'MyGymBro',
  description: 'Tu app de entrenamiento personal',
  manifest: '/manifest.json',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await connection();

  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#09090b" />
        <script
          id={RUNTIME_CONFIG_ELEMENT_ID}
          type="application/json"
          dangerouslySetInnerHTML={{ __html: serializeConfig() }}
        />
      </head>
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        <DarkModeInitializer />
        <Providers>
          {children}
        </Providers>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
