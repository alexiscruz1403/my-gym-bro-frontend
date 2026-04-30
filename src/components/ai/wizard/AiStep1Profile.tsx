'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { step1ProfileSchema, type Step1ProfileValues } from '@/lib/validations/ai.schemas';

interface AiStep1ProfileProps {
  defaultValues?: Partial<Step1ProfileValues>;
  onNext: (values: Step1ProfileValues) => void;
}

export function AiStep1Profile({ defaultValues, onNext }: AiStep1ProfileProps) {
  const [showTarget, setShowTarget] = useState(!!defaultValues?.targetWeightKg);
  const [showBodyFat, setShowBodyFat] = useState(
    !!defaultValues?.estimatedBodyFatPercent,
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<Step1ProfileValues>({
    resolver: zodResolver(step1ProfileSchema),
    defaultValues: {
      age: defaultValues?.age,
      sex: defaultValues?.sex,
      heightCm: defaultValues?.heightCm,
      currentWeightKg: defaultValues?.currentWeightKg,
      targetWeightKg: defaultValues?.targetWeightKg,
      estimatedBodyFatPercent: defaultValues?.estimatedBodyFatPercent,
    },
  });

  const selectedSex = watch('sex');
  const heightCm = watch('heightCm') ?? 170;
  const bodyFatPct = watch('estimatedBodyFatPercent') ?? 20;

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold">Tu perfil físico</h2>
        <p className="text-sm text-muted-foreground">
          Esta información ayuda a la IA a diseñar un plan adaptado a ti.
        </p>
      </div>

      {/* Sex selection */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Sexo biológico</Label>
        <div className="grid grid-cols-2 gap-3">
          {(['male', 'female'] as const).map((s) => (
            <motion.button
              key={s}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setValue('sex', s, { shouldValidate: true })}
              className={cn(
                'relative flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 cursor-pointer',
                selectedSex === s
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-border bg-card hover:border-primary/40',
              )}
            >
              <span className="text-3xl">{s === 'male' ? '♂' : '♀'}</span>
              <span className="text-sm font-medium capitalize">
                {s === 'male' ? 'Masculino' : 'Femenino'}
              </span>
              {selectedSex === s && (
                <motion.div
                  layoutId="sex-indicator"
                  className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary"
                />
              )}
            </motion.button>
          ))}
        </div>
        {errors.sex && (
          <p className="text-destructive text-xs">{errors.sex.message}</p>
        )}
      </div>

      {/* Age */}
      <div className="space-y-1.5">
        <Label htmlFor="age">Edad</Label>
        <Input
          id="age"
          type="number"
          placeholder="25"
          className="text-center text-lg font-semibold"
          {...register('age', { valueAsNumber: true })}
        />
        {errors.age && (
          <p className="text-destructive text-xs">{errors.age.message}</p>
        )}
      </div>

      {/* Height */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Altura</Label>
          <span className="text-lg font-bold tabular-nums">
            {heightCm}
            <span className="text-sm font-normal text-muted-foreground ml-1">cm</span>
          </span>
        </div>
        <input
          type="range"
          min={140}
          max={220}
          step={1}
          value={heightCm}
          onChange={(e) =>
            setValue('heightCm', Number(e.target.value), { shouldValidate: true })
          }
          className="w-full accent-primary h-2 rounded-full cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>140 cm</span>
          <span>220 cm</span>
        </div>
        {errors.heightCm && (
          <p className="text-destructive text-xs">{errors.heightCm.message}</p>
        )}
      </div>

      {/* Current weight */}
      <div className="space-y-1.5">
        <Label htmlFor="currentWeightKg">Peso actual (kg)</Label>
        <Input
          id="currentWeightKg"
          type="number"
          step="0.1"
          placeholder="70"
          className="text-center text-lg font-semibold"
          {...register('currentWeightKg', { valueAsNumber: true })}
        />
        {errors.currentWeightKg && (
          <p className="text-destructive text-xs">{errors.currentWeightKg.message}</p>
        )}
      </div>

      {/* Optional: Target weight */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => {
            setShowTarget((v) => !v);
            if (showTarget) setValue('targetWeightKg', undefined);
          }}
          className="flex items-center gap-2 text-sm text-primary font-medium"
        >
          <span
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary text-xs transition-colors',
              showTarget && 'bg-primary text-primary-foreground',
            )}
          >
            {showTarget ? '−' : '+'}
          </span>
          Peso objetivo (opcional)
        </button>
        {showTarget && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Input
              type="number"
              step="0.1"
              placeholder="65"
              className="text-center text-lg font-semibold"
              {...register('targetWeightKg', { valueAsNumber: true })}
            />
            {errors.targetWeightKg && (
              <p className="text-destructive text-xs mt-1">
                {errors.targetWeightKg.message}
              </p>
            )}
          </motion.div>
        )}
      </div>

      {/* Optional: Body fat */}
      <div className="space-y-2">
        <button
          type="button"
          onClick={() => {
            setShowBodyFat((v) => !v);
            if (showBodyFat) setValue('estimatedBodyFatPercent', undefined);
          }}
          className="flex items-center gap-2 text-sm text-primary font-medium"
        >
          <span
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-full border-2 border-primary text-xs transition-colors',
              showBodyFat && 'bg-primary text-primary-foreground',
            )}
          >
            {showBodyFat ? '−' : '+'}
          </span>
          % grasa corporal estimada (opcional)
        </button>
        {showBodyFat && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Grasa estimada</span>
              <span className="text-lg font-bold tabular-nums">
                {bodyFatPct}
                <span className="text-sm font-normal text-muted-foreground ml-0.5">%</span>
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={50}
              step={1}
              value={bodyFatPct}
              onChange={(e) =>
                setValue('estimatedBodyFatPercent', Number(e.target.value), {
                  shouldValidate: true,
                })
              }
              className="w-full accent-primary h-2 rounded-full cursor-pointer"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3%</span>
              <span>50%</span>
            </div>
          </motion.div>
        )}
      </div>

      <Button type="submit" className="w-full cursor-pointer" size="lg">
        Continuar
      </Button>
    </form>
  );
}
