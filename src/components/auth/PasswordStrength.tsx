'use client';

interface PasswordStrengthProps {
  value: string;
}

export function PasswordStrength({ value }: PasswordStrengthProps) {
  if (!value) return null;

  const score = [
    value.length >= 8,
    /[A-Z]/.test(value),
    /[a-z]/.test(value),
    /[0-9]/.test(value),
    /[^a-zA-Z0-9]/.test(value),
  ].filter(Boolean).length;

  const lvl = score <= 2 ? 0 : score <= 4 ? 1 : 2;

  const barColor = [
    'oklch(57% 0.22 20)',   // weak — red
    'oklch(62% 0.20 35)',   // medium — orange
    'oklch(60% 0.175 145)', // strong — green
  ][lvl];

  const label = ['Débil', 'Media', 'Fuerte'][lvl];

  return (
    <div className="flex flex-col gap-1 mt-1">
      <div className="flex gap-[3px]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="flex-1 h-[3px] rounded-full transition-colors duration-200"
            style={{ background: i <= lvl ? barColor : 'oklch(88% 0.010 248)' }}
          />
        ))}
      </div>
      <span className="text-[11px] font-medium" style={{ color: barColor }}>
        {label}
      </span>
    </div>
  );
}
