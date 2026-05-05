'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { adminService } from '@/services/admin.service';
import type { TermsSection, CreateTermsSectionDto, UpdateTermsSectionDto } from '@/types/domain.types';

export function useAdminTerms() {
  const [sections, setSections] = useState<TermsSection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchSections = useCallback(() => {
    setIsLoading(true);
    adminService
      .listAllTerms()
      .then((data) => setSections(data))
      .catch(() => toast.error('Failed to load terms sections.'))
      .finally(() => setIsLoading(false));
  }, []);

  const createSection = useCallback(
    async (dto: CreateTermsSectionDto): Promise<boolean> => {
      setIsSaving(true);
      try {
        const created = await adminService.createTermsSection(dto);
        setSections((prev) => [...prev, created].sort((a, b) => a.order - b.order));
        toast.success('Sección creada.');
        return true;
      } catch {
        toast.error('Error al crear la sección.');
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const updateSection = useCallback(
    async (id: string, dto: UpdateTermsSectionDto): Promise<boolean> => {
      setIsSaving(true);
      try {
        const updated = await adminService.updateTermsSection(id, dto);
        setSections((prev) =>
          prev.map((s) => (s._id === id ? updated : s)).sort((a, b) => a.order - b.order),
        );
        toast.success('Sección actualizada.');
        return true;
      } catch {
        toast.error('Error al actualizar la sección.');
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [],
  );

  const deleteSection = useCallback(async (id: string): Promise<boolean> => {
    setIsSaving(true);
    try {
      await adminService.deleteTermsSection(id);
      setSections((prev) => prev.filter((s) => s._id !== id));
      toast.success('Sección eliminada.');
      return true;
    } catch {
      toast.error('Error al eliminar la sección.');
      return false;
    } finally {
      setIsSaving(false);
    }
  }, []);

  return {
    sections,
    isLoading,
    isSaving,
    fetchSections,
    createSection,
    updateSection,
    deleteSection,
  };
}
