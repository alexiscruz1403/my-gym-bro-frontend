'use client';

import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ExerciseConfigForm } from './ExerciseConfigForm';
import { ExercisePickerDrawer } from './ExercisePickerDrawer';
import { Trash2, Plus, Pencil, GripVertical } from 'lucide-react';
import { SupersetGroupIndicator } from '@/components/workout/SupersetGroupIndicator';
import type { Exercise } from '@/types/domain.types';
import type { ExerciseConfigDraft } from '@/types/ui.types';

interface DayExerciseListProps {
  exercises: ExerciseConfigDraft[];
  onAdd: (exercise: ExerciseConfigDraft) => void;
  onUpdate: (index: number, config: Partial<ExerciseConfigDraft>) => void;
  onRemove: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
}

// ─── Sortable item ────────────────────────────────────────────────────────────

interface SortableExerciseItemProps {
  id: string;
  index: number;
  ex: ExerciseConfigDraft;
  isEditing: boolean;
  nextEx?: ExerciseConfigDraft;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSave: (index: number, config: Omit<ExerciseConfigDraft, 'exerciseId' | 'exerciseName'>) => void;
  onRemove: (index: number) => void;
  showSeparator: boolean;
}

function SortableExerciseItem({
  id,
  index,
  ex,
  isEditing,
  nextEx,
  onEdit,
  onCancelEdit,
  onSave,
  onRemove,
  showSeparator,
}: SortableExerciseItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const sharesSuperset =
    ex.supersetGroupId &&
    nextEx?.supersetGroupId &&
    ex.supersetGroupId === nextEx.supersetGroupId;

  return (
    <div ref={setNodeRef} style={style}>
      {isEditing ? (
        <ExerciseConfigForm
          exerciseName={ex.exerciseName}
          defaultValues={ex}
          onSave={(config) => onSave(index, config)}
          onCancel={onCancelEdit}
        />
      ) : (
        <div className="flex items-center gap-2">
          {/* Drag handle */}
          <button
            type="button"
            className="text-muted-foreground cursor-grab touch-none p-1 active:cursor-grabbing"
            aria-label="Drag to reorder"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-4 w-4" />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{ex.exerciseName}</p>
            <p className="text-muted-foreground text-xs">
              {ex.sets} × {ex.reps !== undefined ? `${ex.reps} reps` : `${ex.duration}s`}
              {ex.weight ? ` · ${ex.weight}kg` : ''}
              {` · ${ex.rest}s rest`}
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onEdit}
            aria-label="Edit exercise"
            className="cursor-pointer"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            aria-label="Remove exercise"
            className="cursor-pointer text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}

      {sharesSuperset ? (
        <SupersetGroupIndicator label={`Superset ${ex.supersetGroupId}`} />
      ) : (
        showSeparator && <Separator className="mt-3" />
      )}
    </div>
  );
}

// ─── Main list ────────────────────────────────────────────────────────────────

export function DayExerciseList({
  exercises,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
}: DayExerciseListProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleSelectExercise = (exercise: Exercise) => {
    onAdd({
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      sets: 3,
      reps: 10,
      rest: 60,
    });
  };

  const handleSaveConfig = (
    index: number,
    config: Omit<ExerciseConfigDraft, 'exerciseId' | 'exerciseName'>,
  ) => {
    onUpdate(index, config);
    setEditingIndex(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const fromIndex = exercises.findIndex((_, i) => `ex-${i}` === active.id);
    const toIndex = exercises.findIndex((_, i) => `ex-${i}` === over.id);
    if (fromIndex !== -1 && toIndex !== -1) {
      onReorder(fromIndex, toIndex);
    }
  };

  const ids = exercises.map((_, i) => `ex-${i}`);

  return (
    <div className="space-y-3">
      {exercises.length === 0 && (
        <p className="text-muted-foreground py-4 text-center text-sm">
          No exercises added for this day.
        </p>
      )}

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          {exercises.map((ex, index) => (
            <SortableExerciseItem
              key={`${ex.exerciseId}-${index}`}
              id={`ex-${index}`}
              index={index}
              ex={ex}
              nextEx={exercises[index + 1]}
              isEditing={editingIndex === index}
              onEdit={() => setEditingIndex(index)}
              onCancelEdit={() => setEditingIndex(null)}
              onSave={handleSaveConfig}
              onRemove={onRemove}
              showSeparator={index < exercises.length - 1}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setPickerOpen(true)}
        className="w-full cursor-pointer gap-1.5"
      >
        <Plus className="h-4 w-4" />
        Add exercise
      </Button>

      <ExercisePickerDrawer
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        onSelect={handleSelectExercise}
      />
    </div>
  );
}
