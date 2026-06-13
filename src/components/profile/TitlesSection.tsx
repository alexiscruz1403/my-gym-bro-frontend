'use client';

import { useTranslation } from 'react-i18next';
import type { Language, MyTitle } from '@/types/domain.types';

interface TitlesSectionProps {
  titles: MyTitle[];
  language: Language;
  onSetActive: (titleKey: string | null) => void;
  isSetting: boolean;
}

export function TitlesSection({ titles, language, onSetActive, isSetting }: TitlesSectionProps) {
  const { t } = useTranslation();

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 pb-2.5 pt-3.5">
        <p className="font-display text-[16px] font-semibold tracking-[0.01em] text-foreground">
          {t('titles.sectionTitle')}
        </p>
      </div>

      <div className="px-4 py-3.5">
        {titles.length === 0 ? (
          <p className="py-4 text-center text-[13px] text-muted-foreground">
            {t('titles.noTitles')}
          </p>
        ) : (
          <div className="divide-y divide-border">
            {titles.map((title) => {
              const name = language === 'es' ? title.nameEs : title.nameEn;
              const task = language === 'es' ? title.taskEs : title.taskEn;
              const earnedDate = new Date(title.earnedAt).toLocaleDateString();

              return (
                <div key={title.titleKey} className="flex items-center gap-3 py-3.5">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[14px] font-semibold text-foreground">
                      ✦ {name}
                    </p>
                    <p className="mt-0.5 text-[12px] text-muted-foreground">{task}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {t('titles.earnedOn')} {earnedDate}
                    </p>
                  </div>

                  {title.isActive ? (
                    <button
                      type="button"
                      disabled={isSetting}
                      onClick={() => onSetActive(null)}
                      className="shrink-0 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground transition-opacity hover:opacity-80 disabled:opacity-50"
                    >
                      {t('titles.deactivate')}
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled={isSetting}
                      onClick={() => onSetActive(title.titleKey)}
                      className="shrink-0 rounded-full border border-primary px-3 py-1 text-[11px] font-semibold text-primary transition-opacity hover:opacity-70 disabled:opacity-50"
                    >
                      {t('titles.activate')}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
