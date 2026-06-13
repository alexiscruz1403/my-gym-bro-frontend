import type { Language, TitleInfo } from '@/types/domain.types';

interface ActiveTitleDisplayProps {
  title: TitleInfo;
  language: Language;
}

export function ActiveTitleDisplay({ title, language }: ActiveTitleDisplayProps) {
  return (
    <p className="mt-0.5 truncate text-[11px] font-medium text-orange-500">
      ✦ {language === 'es' ? title.nameEs : title.nameEn}
    </p>
  );
}
