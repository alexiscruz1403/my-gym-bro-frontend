import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'MyGymBro — Acceso',
};

function AuthLogo() {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <Image
        src="/MyGymBro.svg"
        alt=""
        width={52}
        height={23}
        priority
        aria-hidden="true"
      />
      <span
        className="font-display text-[26px] font-bold tracking-[0.04em] leading-none"
        style={{ color: 'oklch(94% 0.006 248)' }}
      >
        <span style={{ color: 'oklch(62% 0.20 35)' }}>My</span>Gym
        <span style={{ color: 'oklch(62% 0.20 35)' }}>Bro</span>
      </span>
    </div>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-10"
      style={{
        background: `
          radial-gradient(ellipse 480px 280px at 50% 0px, oklch(35% 0.14 35 / 0.22) 0%, transparent 65%),
          oklch(13% 0.018 248)
        `,
      }}
    >
      <div className="w-full max-w-sm flex flex-col items-center gap-6 auth-page-animate">
        <AuthLogo />
        {children}
      </div>
    </div>
  );
}
