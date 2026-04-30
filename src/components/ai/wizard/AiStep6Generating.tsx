'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, AlertCircle, Calendar, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { GeneratePlanResponse } from '@/types/domain.types';

const LOADING_MESSAGES = [
  'Analizando tu perfil...',
  'Seleccionando ejercicios...',
  'Estructurando la semana...',
  'Calibrando progresiones...',
  'Finalizando tu plan...',
];

interface AiStep6GeneratingProps {
  isLoading: boolean;
  result: GeneratePlanResponse | null;
  error: string | null;
  onRetry: () => void;
}

export function AiStep6Generating({
  isLoading,
  result,
  error,
  onRetry,
}: AiStep6GeneratingProps) {
  const router = useRouter();
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    if (!isLoading) return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isLoading]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-8 py-8">
        {/* Animated orb */}
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="h-28 w-28 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 blur-xl absolute inset-0"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="relative h-28 w-28 rounded-full border-2 border-dashed border-primary/40 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="h-10 w-10 text-primary" />
            </motion.div>
          </motion.div>
        </div>

        {/* Message carousel */}
        <div className="h-6 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={msgIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center text-sm text-muted-foreground font-medium"
            >
              {LOADING_MESSAGES[msgIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Pulsing dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
              transition={{
                duration: 1.2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              className="h-2 w-2 rounded-full bg-primary"
            />
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center max-w-xs">
          La IA está diseñando tu plan personalizado. Esto puede tomar unos segundos.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center gap-6 py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
        >
          <AlertCircle className="h-16 w-16 text-destructive" />
        </motion.div>
        <div className="text-center space-y-2">
          <p className="font-semibold">No se pudo generar el plan</p>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  if (result) {
    const totalExercises = result.plan.days.reduce(
      (acc, d) => acc + d.exercises.length,
      0,
    );

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center gap-6 py-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
        >
          <CheckCircle2 className="h-16 w-16 text-primary" />
        </motion.div>

        <div className="text-center space-y-1">
          <h3 className="text-xl font-bold">¡Plan generado!</h3>
          <p className="text-sm text-muted-foreground">
            {result.message}
          </p>
        </div>

        {/* Plan preview card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full rounded-2xl border bg-card p-5 space-y-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold truncate">{result.plan.name}</p>
              <p className="text-xs text-muted-foreground">
                Template: {result.templateUsed}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-3">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Días</p>
                <p className="text-sm font-bold">{result.plan.days.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-muted/50 p-3">
              <Dumbbell className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Ejercicios</p>
                <p className="text-sm font-bold">{totalExercises}</p>
              </div>
            </div>
          </div>

          {/* Days preview */}
          <div className="space-y-2">
            {result.plan.days.map((day) => (
              <div
                key={day.dayOfWeek}
                className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2"
              >
                <span className="text-xs font-medium capitalize">
                  {day.dayName ?? day.dayOfWeek}
                </span>
                <span className="text-xs text-muted-foreground">
                  {day.exercises.length} ejercicios
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <Button
          className="w-full gap-2 cursor-pointer"
          size="lg"
          onClick={() => router.push(`/workout/${result.plan.id}`)}
        >
          <CheckCircle2 className="h-4 w-4" />
          Ver mi plan
        </Button>
      </motion.div>
    );
  }

  return null;
}
