import Link from 'next/link';
import { ImageOff } from 'lucide-react';

interface ExerciseGifThumbnailProps {
  gifUrl?: string;
  exerciseName: string;
  exerciseId?: string;
  size?: 'sm' | 'md';
}

const SIZE_MAP = {
  sm: 'h-10 w-10',
  md: 'h-14 w-14',
} as const;

export function ExerciseGifThumbnail({
  gifUrl,
  exerciseName,
  exerciseId,
  size = 'sm',
}: ExerciseGifThumbnailProps) {
  const sizeClass = SIZE_MAP[size];

  const content = gifUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={gifUrl}
      alt={exerciseName}
      className={`${sizeClass} rounded-md object-cover shrink-0`}
    />
  ) : (
    <div
      className={`${sizeClass} rounded-md bg-muted flex items-center justify-center shrink-0`}
      aria-label={exerciseName}
    >
      <ImageOff className="h-4 w-4 text-muted-foreground" />
    </div>
  );

  if (exerciseId) {
    return (
      <Link href={`/workout/exercises/${exerciseId}`} className="shrink-0">
        {content}
      </Link>
    );
  }

  return content;
}
