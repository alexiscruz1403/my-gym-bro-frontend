import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'MyGymBro — Acceso',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4">
      <div className="w-full max-w-sm md:max-w-md">
        {/* Logo / branding */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <Image src="/MyGymBro.svg" alt="MyGymBro" width={56} height={24} priority />
          <h1 className="font-display text-4xl font-bold tracking-wide">
            <span className="text-primary">My</span>
            <span className="text-foreground">Gym</span>
            <span className="text-primary">Bro</span>
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
