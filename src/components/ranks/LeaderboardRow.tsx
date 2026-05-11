'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { RankBadge } from '@/components/ranks/RankBadge';
import type { LeaderboardUserEntry, MuscleGroup } from '@/types/domain.types';

interface LeaderboardRowProps {
  entry: LeaderboardUserEntry;
  position: number;
  selectedMuscle: MuscleGroup | undefined;
}

function PositionLabel({ position, isSelf }: { position: number; isSelf: boolean }) {
  const { t } = useTranslation();
  if (isSelf) return <span className="text-xs font-bold text-primary w-6 text-center">{t('ranks.leaderboard.you')}</span>;
  if (position === 1) return <span className="text-base w-6 text-center">🥇</span>;
  if (position === 2) return <span className="text-base w-6 text-center">🥈</span>;
  if (position === 3) return <span className="text-base w-6 text-center">🥉</span>;
  return <span className="text-xs text-muted-foreground w-6 text-center tabular-nums">{position}</span>;
}

export function LeaderboardRow({ entry, position, selectedMuscle }: LeaderboardRowProps) {
  const { t } = useTranslation();

  const relevantRank = selectedMuscle
    ? entry.muscleRanks.find((mr) => mr.muscle === selectedMuscle)
    : entry.muscleRanks.reduce(
        (best, mr) => (!best || mr.rank > best.rank ? mr : best),
        null as typeof entry.muscleRanks[0] | null,
      );

  return (
    <div
      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${
        entry.isSelf ? 'bg-primary/10 ring-1 ring-primary/30' : 'bg-muted/40'
      }`}
    >
      <PositionLabel position={position} isSelf={entry.isSelf} />

      {entry.avatar ? (
        <Image
          src={entry.avatar}
          alt={entry.username}
          width={32}
          height={32}
          className="h-8 w-8 rounded-full object-cover shrink-0"
        />
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-muted shrink-0">
          <User className="h-4 w-4 text-muted-foreground" />
        </span>
      )}

      <span className="flex-1 text-sm font-medium truncate">{entry.username}</span>

      {relevantRank ? (
        <RankBadge rank={relevantRank.rank} size="sm" />
      ) : (
        <span className="text-xs text-muted-foreground">{t('ranks.leaderboard.unranked')}</span>
      )}
    </div>
  );
}
