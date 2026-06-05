'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Loader2,
  AlertTriangle,
  BrainCircuit,
  Check,
  X,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProgressionGuideSheet } from '@/components/guides/ProgressionGuideSheet';
import { useProgressionAnalysis } from '@/hooks/useProgressionAnalysis';
import { useCurrentWeekProgression } from '@/hooks/useCurrentWeekProgression';
import { useConfirmProgression } from '@/hooks/useConfirmProgression';
import { ExerciseChangeCard } from './ExerciseChangeCard';
import type { ProgressionAnalysisResponse } from '@/types/domain.types';

interface ProgressionTabProps {
  planId: string;
}

function ProgressionResult({ result }: { result: ProgressionAnalysisResponse }) {
  return (
    <>
      {result.status !== 'failed' && result.message && (
        <p className="text-xs text-muted-foreground px-1">{result.message}</p>
      )}
      {result.changesApplied.length > 0 ? (
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground px-1">
            Cambios propuestos
          </p>
          {result.changesApplied.map((change, i) => (
            <motion.div
              key={change.exerciseId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <ExerciseChangeCard change={change} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed p-6 text-center space-y-2">
          <Sparkles className="mx-auto h-6 w-6 text-muted-foreground/40" />
          <p className="text-sm font-medium">
            {result.status === 'failed'
              ? 'No se pudo analizar la progresión'
              : 'Todo en orden'}
          </p>
          <p className="text-xs text-muted-foreground">
            {result.message || 'No hay ajustes necesarios esta semana.'}
          </p>
        </div>
      )}
    </>
  );
}

export function ProgressionTab({ planId }: ProgressionTabProps) {
  const { data: weekLog, isLoading: weekLoading } = useCurrentWeekProgression(planId);
  const { mutate: analyze, isPending: isAnalyzing, isError: analyzeError } = useProgressionAnalysis(planId);
  const { mutate: confirm, isPending: isConfirming } = useConfirmProgression(planId);
  const [guideOpen, setGuideOpen] = useState(false);

  const result = weekLog ?? null;
  const isPending = result?.status === 'pending';
  const isProcessed = result?.status === 'applied' || result?.status === 'rejected';

  return (
    <div className="space-y-5">
      {/* Header card */}
      <div className="flex items-start gap-3 rounded-xl border bg-gradient-to-br from-primary/5 to-transparent p-4">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-primary/10">
          <BrainCircuit className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Progresión de cargas</p>
          <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
            La IA analiza tus últimas sesiones y ajusta pesos, series y reps
            siguiendo el método de doble progresión.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setGuideOpen(true)}
          className="flex shrink-0 items-center text-muted-foreground/60 transition-colors hover:text-muted-foreground"
        >
          <Info className="h-4 w-4" />
        </button>
      </div>

      {weekLoading ? (
        <div className="flex items-center justify-center py-10">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      ) : result ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Summary row */}
          {result.status !== 'failed' && (
            <div className="flex items-center justify-between gap-3 rounded-xl border bg-card p-4">
              <div className="space-y-0.5">
                <p className="text-xs text-muted-foreground">
                  {result.status === 'applied'
                    ? 'Progresión aplicada'
                    : result.status === 'rejected'
                      ? 'Progresión rechazada'
                      : 'Análisis de esta semana'
                  }
                </p>
                <p className="text-sm font-semibold">
                  {result.changesApplied.length === 0
                    ?  'Sin cambios necesarios'
                    : `${result.changesApplied.length} ejercicio${result.changesApplied.length !== 1 ? 's' : ''} ajustado${result.changesApplied.length !== 1 ? 's' : ''}`
                  }
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                {result.isDeloadWeek && (
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20 border text-[10px] px-1.5">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Semana de descarga
                  </Badge>
                )}
                {isProcessed && (
                  <Badge
                    className={
                      result.status === 'applied'
                        ? 'bg-green-500/10 text-green-600 border-green-500/20 border text-[10px] px-1.5'
                        : 'bg-muted text-muted-foreground border text-[10px] px-1.5'
                    }
                  >
                    {result.status === 'applied' ? 'Aplicado' : 'Rechazado'}
                  </Badge>
                )}
              </div>
            </div>
          )}

          <ProgressionResult result={result} />

          {/* Apply / Reject actions — only when pending */}
          {isPending && result.changesApplied.length > 0 && (
            <div className="flex gap-2 pt-1">
              <Button
                className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => confirm({ logId: result.logId, apply: true })}
                disabled={isConfirming}
              >
                {isConfirming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Aplicar progresión
              </Button>
              <Button
                variant="outline"
                className="flex-1 gap-2"
                onClick={() => confirm({ logId: result.logId, apply: false })}
                disabled={isConfirming}
              >
                <X className="h-4 w-4" />
                Rechazar
              </Button>
            </div>
          )}
        </motion.div>
      ) : (
        /* Empty state — no log this week */
        <div className="space-y-4">
          <div className="rounded-xl border border-dashed p-8 text-center space-y-3">
            <Sparkles className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Sin análisis todavía</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Cuando tengas al menos 2 semanas de sesiones registradas, la IA
                analizará tu progreso y ajustará las cargas automáticamente.
              </p>
            </div>
          </div>

          {analyzeError && (
            <p className="text-destructive text-xs text-center">
              No se pudo completar el análisis. Intenta de nuevo.
            </p>
          )}

          <Button
            className="w-full gap-2 cursor-pointer"
            onClick={() => analyze()}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analizando...
              </>
            ) : (
              <>
                <BrainCircuit className="h-4 w-4" />
                Analizar ahora
              </>
            )}
          </Button>
        </div>
      )}

      <ProgressionGuideSheet open={guideOpen} onOpenChange={setGuideOpen} />
    </div>
  );
}
