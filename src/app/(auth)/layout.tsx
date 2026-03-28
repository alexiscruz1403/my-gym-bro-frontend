import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gym Planner — Acceso',
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
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl font-bold text-primary tracking-wide">
            GYM<span className="text-foreground">PLANNER</span>
          </h1>
        </div>
        {children}
      </div>
    </div>
  );
}
