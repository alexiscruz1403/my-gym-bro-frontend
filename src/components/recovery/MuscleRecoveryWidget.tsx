'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { BodyFigure } from '@/components/ranks/BodyFigure';
import { RecoveryDetailPanel } from '@/components/recovery/RecoveryDetailPanel';
import { Skeleton } from '@/components/ui/skeleton';
import { getRecoveryFill, RECOVERY_COLORS } from '@/lib/recovery-colors';
import { useRecovery } from '@/hooks/useRecovery';
import type { MuscleGroup, MuscleRankItem } from '@/types/domain.types';

const EMPTY_RANK_MAP = new Map<MuscleGroup, MuscleRankItem>();

const LEGEND_ITEMS = [
  { key: 'FRESH', color: RECOVERY_COLORS.FRESH },
  { key: 'RECOVERED', color: RECOVERY_COLORS.RECOVERED },
  { key: 'FATIGUED', color: RECOVERY_COLORS.FATIGUED },
] as const;

export function MuscleRecoveryWidget() {
  const { t } = useTranslation();
  const { recoveryMap, isLoading, isError } = useRecovery();
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);

  const getMuscleFill = useCallback(
    (muscle: MuscleGroup) => getRecoveryFill(muscle, recoveryMap),
    [recoveryMap],
  );

  const handleMuscleClick = useCallback((muscle: MuscleGroup) => {
    setSelectedMuscle((prev) => (prev === muscle ? null : muscle));
  }, []);

  const handlePanelClose = useCallback(() => setSelectedMuscle(null), []);

  const selectedItem = useMemo(
    () => (selectedMuscle ? recoveryMap.get(selectedMuscle) : undefined),
    [selectedMuscle, recoveryMap],
  );

  if (isLoading) {
    return (
      <div className="mt-2.5 flex justify-center gap-6">
        <Skeleton className="h-72 w-28 rounded-xl" />
        <Skeleton className="h-72 w-28 rounded-xl" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-2.5 rounded-2xl border border-border bg-card px-4 py-5 text-center">
        <p className="text-[13px] font-semibold text-foreground">{t('muscleRecovery.errorTitle')}</p>
        <p className="mt-1 text-[12px] text-muted-foreground">{t('muscleRecovery.errorDescription')}</p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-2.5 flex select-none flex-col gap-3">
        <BodyFigure
          rankMap={EMPTY_RANK_MAP}
          selectedMuscle={selectedMuscle}
          onMuscleClick={handleMuscleClick}
          getMuscleFill={getMuscleFill}
          hideLegend
        />

        {/* Recovery color legend */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {LEGEND_ITEMS.map(({ key, color }) => (
            <div key={key} className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
              <span>{t(`muscleRecovery.status.${key}`)}</span>
            </div>
          ))}
        </div>
      </div>

      <RecoveryDetailPanel
        item={selectedItem}
        open={selectedMuscle !== null}
        onClose={handlePanelClose}
      />
    </>
  );
}
