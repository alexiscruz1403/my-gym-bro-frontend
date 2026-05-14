'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, X, Plus, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useExercises } from '@/hooks/useExercises';
import { cn } from '@/lib/utils';
import type { Step6ExercisesValues } from '@/lib/validations/ai.schemas';
import type { Exercise } from '@/types/domain.types';

const MAX_EACH = 3;

interface AiStep6ExercisesProps {
  defaultValues?: Partial<Step6ExercisesValues>;
  onNext: (values: Step6ExercisesValues) => void;
  onBack: () => void;
}

interface ExerciseSelectorProps {
  title: string;
  description: string;
  selected: Exercise[];
  onAdd: (ex: Exercise) => void;
  onRemove: (id: string) => void;
}

function ExerciseSelector({ title, description, selected, onAdd, onRemove }: ExerciseSelectorProps) {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, loading } = useExercises(
    debouncedSearch.length >= 2 ? { search: debouncedSearch, limit: 8 } : {},
  );

  const results = (debouncedSearch.length >= 2 ? data?.data ?? [] : []).filter(
    (ex) => !selected.some((s) => s.id === ex.id),
  );

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((ex) => (
            <motion.span
              key={ex.id}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex items-center gap-1 rounded-full border bg-primary/10 border-primary/30 px-2.5 py-1 text-xs font-medium text-primary"
            >
              {ex.name}
              <button
                type="button"
                onClick={() => onRemove(ex.id)}
                className="ml-0.5 rounded-full hover:bg-primary/20 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </div>
      )}

      {selected.length < MAX_EACH && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('ai.wizard.step6.searchPlaceholder')}
            className="pl-8 text-sm h-9"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
          )}
        </div>
      )}

      {results.length > 0 && (
        <div className="rounded-xl border bg-card divide-y overflow-hidden">
          {results.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => {
                onAdd(ex);
                setSearch('');
                setDebouncedSearch('');
              }}
              className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-muted/50 transition-colors"
            >
              <span className="text-sm font-medium truncate">{ex.name}</span>
              <Plus className="h-3.5 w-3.5 text-muted-foreground shrink-0 ml-2" />
            </button>
          ))}
        </div>
      )}

      {debouncedSearch.length >= 2 && !loading && results.length === 0 && (
        <p className="text-xs text-muted-foreground text-center py-2">{t('ai.wizard.step6.noResults')}</p>
      )}

      {selected.length >= MAX_EACH && (
        <p className="text-xs text-muted-foreground">{t('ai.wizard.step6.maxExercises', { max: MAX_EACH })}</p>
      )}
    </div>
  );
}

export function AiStep6Exercises({ defaultValues: _defaultValues, onNext, onBack }: AiStep6ExercisesProps) {
  const { t } = useTranslation();
  const [excluded, setExcluded] = useState<Exercise[]>([]);
  const [included, setIncluded] = useState<Exercise[]>([]);

  const handleSubmit = () => {
    onNext({
      excludedExerciseIds: excluded.map((e) => e.id),
      includedExerciseIds: included.map((e) => e.id),
    });
  };

  return (
    <div className="space-y-7">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">{t('ai.wizard.step6.title')}</h2>
        <p className="text-sm text-muted-foreground">
          {t('ai.wizard.step6.description')}
        </p>
      </div>

      <ExerciseSelector
        title={t('ai.wizard.step6.excludeTitle')}
        description={t('ai.wizard.step6.excludeDescription', { max: MAX_EACH })}
        selected={excluded}
        onAdd={(ex) => setExcluded((prev) => [...prev, ex])}
        onRemove={(id) => setExcluded((prev) => prev.filter((e) => e.id !== id))}
      />

      <div className="border-t" />

      <ExerciseSelector
        title={t('ai.wizard.step6.includeTitle')}
        description={t('ai.wizard.step6.includeDescription', { max: MAX_EACH })}
        selected={included}
        onAdd={(ex) => setIncluded((prev) => [...prev, ex])}
        onRemove={(id) => setIncluded((prev) => prev.filter((e) => e.id !== id))}
      />

      <div className={cn('flex gap-3', 'flex-col-reverse')}>
        <div className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1 cursor-pointer" onClick={onBack}>
            {t('common.back')}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="flex-1 cursor-pointer text-muted-foreground"
            onClick={() => onNext({ excludedExerciseIds: [], includedExerciseIds: [] })}
          >
            {t('ai.wizard.step6.skip')}
          </Button>
        </div>
        <Button
          type="button"
          className="w-full cursor-pointer"
          size="lg"
          onClick={handleSubmit}
        >
          {t('common.continue')}
        </Button>
      </div>
    </div>
  );
}
