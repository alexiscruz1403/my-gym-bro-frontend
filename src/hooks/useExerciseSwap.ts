'use client';

import { useState } from 'react';
import { suggestReplacement, confirmReplacement } from '@/services/ai.service';
import { invalidatePlanCache } from '@/hooks/usePlan';
import type { ExerciseSwapProposal } from '@/types/domain.types';

type SwapState = 'idle' | 'requesting' | 'proposed' | 'confirming';

interface UseExerciseSwapParams {
  planId: string;
  exerciseId: string;
}

export function useExerciseSwap({ planId, exerciseId }: UseExerciseSwapParams) {
  const [state, setState] = useState<SwapState>('idle');
  const [proposal, setProposal] = useState<ExerciseSwapProposal | null>(null);
  const [error, setError] = useState<string | null>(null);

  const requestSwap = async (reason: string) => {
    setState('requesting');
    setError(null);
    try {
      const result = await suggestReplacement(planId, exerciseId, reason);
      setProposal(result);
      setState('proposed');
    } catch {
      setError('error');
      setState('idle');
    }
  };

  const confirmSwap = async (approved: boolean) => {
    if (!proposal) return;
    if (!approved) {
      setState('idle');
      setProposal(null);
      return;
    }
    setState('confirming');
    try {
      await confirmReplacement(planId, exerciseId, proposal.suggestedExercise.id);
      invalidatePlanCache(planId);
    } finally {
      setState('idle');
      setProposal(null);
    }
  };

  const reset = () => {
    setState('idle');
    setProposal(null);
    setError(null);
  };

  return {
    state,
    proposal,
    error,
    requestSwap,
    confirmSwap,
    reset,
    isRequesting: state === 'requesting',
    isConfirming: state === 'confirming',
  };
}
