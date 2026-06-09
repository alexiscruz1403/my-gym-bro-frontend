'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { AdminExercise, MuscleGroup, TrackingType, LoadType } from '@/types/domain.types';

const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'front_delts', 'side_delts', 'triceps',
  'lats', 'upper_back', 'rear_delts', 'biceps',
  'forearms', 'traps', 'abs', 'obliques',
  'lower_back', 'quads', 'hamstrings', 'glutes', 'calves',
];

interface AdminExerciseFormProps {
  open: boolean;
  exercise: AdminExercise | null;
  onSubmit: (formData: FormData) => Promise<void>;
  onClose: () => void;
}

export function AdminExerciseForm({ open, exercise, onSubmit, onClose }: AdminExerciseFormProps) {
  const { t } = useTranslation();
  const [nameEs, setNameEs] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [trackingType, setTrackingType] = useState<TrackingType>('reps');
  const [loadType, setLoadType] = useState<LoadType>('barbell');
  const [musclesPrimary, setMusclesPrimary] = useState<MuscleGroup[]>([]);
  const [musclesSecondary, setMusclesSecondary] = useState<MuscleGroup[]>([]);
  const [bilateral, setBilateral] = useState(true);
  const [gifFile, setGifFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const gifInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (exercise) {
      setNameEs(exercise.name.es);
      setNameEn(exercise.name.en);
      setTrackingType(exercise.trackingType);
      setLoadType(exercise.loadType);
      setMusclesPrimary(exercise.musclesPrimary);
      setMusclesSecondary(exercise.musclesSecondary);
      setBilateral(exercise.bilateral);
    } else {
      setNameEs('');
      setNameEn('');
      setTrackingType('reps');
      setLoadType('barbell');
      setMusclesPrimary([]);
      setMusclesSecondary([]);
      setBilateral(true);
    }
    setGifFile(null);
    setVideoFile(null);
    if (gifInputRef.current) gifInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  }, [exercise, open]);

  const toggleMuscle = (muscle: MuscleGroup, list: 'primary' | 'secondary') => {
    if (list === 'primary') {
      setMusclesPrimary((prev) =>
        prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
      );
    } else {
      setMusclesSecondary((prev) =>
        prev.includes(muscle) ? prev.filter((m) => m !== muscle) : [...prev, muscle]
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameEs.trim() || !nameEn.trim() || musclesPrimary.length === 0) return;
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append('name', JSON.stringify({ es: nameEs.trim(), en: nameEn.trim() }));
      formData.append('trackingType', trackingType);
      formData.append('loadType', loadType);
      formData.append('bilateral', String(bilateral));
      musclesPrimary.forEach((m) => formData.append('musclesPrimary', m));
      musclesSecondary.forEach((m) => formData.append('musclesSecondary', m));
      if (gifFile) formData.append('gif', gifFile);
      if (videoFile) formData.append('video', videoFile);
      await onSubmit(formData);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <SheetContent side="bottom" className="max-h-[80dvh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{exercise ? t('admin.exercises.editTitle') : t('admin.exercises.newTitle')}</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="px-4 pb-6 space-y-4">
          {/* Name ES */}
          <div className="space-y-1.5">
            <Label htmlFor="ex-name-es">{t('admin.exercises.nameEs')}</Label>
            <Input
              id="ex-name-es"
              value={nameEs}
              onChange={(e) => setNameEs(e.target.value)}
              placeholder="Ej: Sentadilla con barra"
              required
            />
          </div>

          {/* Name EN */}
          <div className="space-y-1.5">
            <Label htmlFor="ex-name-en">{t('admin.exercises.nameEn')}</Label>
            <Input
              id="ex-name-en"
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              placeholder="e.g. Barbell Squat"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ex-tracking">{t('admin.exercises.trackingType')}</Label>
            <select
              id="ex-tracking"
              value={trackingType}
              onChange={(e) => setTrackingType(e.target.value as TrackingType)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="reps">Reps</option>
              <option value="duration">Duration</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ex-load">{t('admin.exercises.loadType')}</Label>
            <select
              id="ex-load"
              value={loadType}
              onChange={(e) => setLoadType(e.target.value as LoadType)}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="barbell">Barbell</option>
              <option value="dumbbell">Dumbbell</option>
              <option value="machine">Machine</option>
              <option value="bodyweight">Bodyweight</option>
              <option value="cable">Cable</option>
              <option value="kettlebell">Kettlebell</option>
              <option value="resistance_band">Resistance Band</option>
            </select>
          </div>

          {/* Bilateral toggle */}
          <div className="space-y-1.5">
            <Label>{t('admin.exercises.movement')}</Label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setBilateral(true)}
                className={`cursor-pointer flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  bilateral
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-foreground'
                }`}
              >
                {t('admin.exercises.bilateral')}
              </button>
              <button
                type="button"
                onClick={() => setBilateral(false)}
                className={`cursor-pointer flex-1 rounded-lg border px-3 py-2 text-sm transition-colors ${
                  !bilateral
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-input bg-background text-foreground'
                }`}
              >
                {t('admin.exercises.unilateral')}
              </button>
            </div>
          </div>

          {/* GIF upload */}
          <div className="space-y-1.5">
            <Label htmlFor="ex-gif">
              {t('admin.exercises.gif')}{' '}
              <span className="text-muted-foreground text-xs">{t('admin.exercises.gifOptional')}</span>
            </Label>
            {exercise?.gifUrl && !gifFile && (
              <p className="text-xs text-muted-foreground">
                {t('admin.exercises.gifCurrent')}{' '}
                <a href={exercise.gifUrl} target="_blank" rel="noreferrer" className="underline">
                  {t('admin.exercises.view')}
                </a>
              </p>
            )}
            <input
              id="ex-gif"
              ref={gifInputRef}
              type="file"
              accept="image/gif"
              onChange={(e) => setGifFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border file:border-input file:bg-background file:px-3 file:py-1 file:text-xs file:cursor-pointer"
            />
            {gifFile && (
              <p className="text-xs text-muted-foreground">{t('admin.exercises.selected', { name: gifFile.name })}</p>
            )}
          </div>

          {/* Video upload */}
          <div className="space-y-1.5">
            <Label htmlFor="ex-video">
              {t('admin.exercises.video')}{' '}
              <span className="text-muted-foreground text-xs">{t('admin.exercises.videoOptional')}</span>
            </Label>
            {exercise?.videoUrl && !videoFile && (
              <p className="text-xs text-muted-foreground">
                {t('admin.exercises.videoCurrent')}{' '}
                <a href={exercise.videoUrl} target="_blank" rel="noreferrer" className="underline">
                  {t('admin.exercises.view')}
                </a>
              </p>
            )}
            <input
              id="ex-video"
              ref={videoInputRef}
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              className="w-full text-sm text-muted-foreground file:mr-3 file:rounded-lg file:border file:border-input file:bg-background file:px-3 file:py-1 file:text-xs file:cursor-pointer"
            />
            {videoFile && (
              <p className="text-xs text-muted-foreground">{t('admin.exercises.selected', { name: videoFile.name })}</p>
            )}
          </div>

          {/* Primary muscles */}
          <div className="space-y-1.5">
            <Label>
              {t('admin.exercises.primaryMuscles')} <span className="text-destructive">*</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((muscle) => {
                const isPrimary = musclesPrimary.includes(muscle);
                const isSecondary = musclesSecondary.includes(muscle);
                return (
                  <button
                    key={muscle}
                    type="button"
                    onClick={() => toggleMuscle(muscle, 'primary')}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors ${
                      isPrimary
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isSecondary
                        ? 'border-input bg-muted text-muted-foreground opacity-50'
                        : 'border-input bg-background text-foreground'
                    }`}
                  >
                    {muscle.replace(/_/g, ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Secondary muscles */}
          <div className="space-y-1.5">
            <Label>
              {t('admin.exercises.secondaryMuscles')}{' '}
              <span className="text-muted-foreground text-xs">{t('admin.exercises.secondaryOptional')}</span>
            </Label>
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.map((muscle) => {
                const isPrimary = musclesPrimary.includes(muscle);
                const isSecondary = musclesSecondary.includes(muscle);
                return (
                  <button
                    key={muscle}
                    type="button"
                    onClick={() => toggleMuscle(muscle, 'secondary')}
                    className={`cursor-pointer rounded-full border px-3 py-1 text-xs transition-colors ${
                      isSecondary
                        ? 'border-blue-500 bg-blue-500/20 text-blue-700 dark:text-blue-300'
                        : isPrimary
                        ? 'border-input bg-muted text-muted-foreground opacity-50'
                        : 'border-input bg-background text-foreground'
                    }`}
                  >
                    {muscle.replace(/_/g, ' ')}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <Button
              type="submit"
              disabled={busy || !nameEs.trim() || !nameEn.trim() || musclesPrimary.length === 0}
              className="cursor-pointer w-full"
            >
              {exercise ? t('admin.exercises.saveChanges') : t('admin.exercises.createExercise')}
            </Button>
            <Button type="button" variant="ghost" onClick={onClose} disabled={busy} className="cursor-pointer w-full">
              {t('common.cancel')}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
