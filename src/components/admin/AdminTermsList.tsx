'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, TriangleAlert, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { AdminTermsRow } from './AdminTermsRow';
import { useAdminTerms } from '@/hooks/useAdminTerms';
import type { CreateAdminTermsSectionDto } from '@/types/domain.types';

const EMPTY_FORM: CreateAdminTermsSectionDto = {
  header: { es: '', en: '' },
  content: { es: '', en: '' },
  order: 1,
  isActive: true,
};

export function AdminTermsList() {
  const { t } = useTranslation();
  const { sections, isLoading, isSaving, fetchSections, createSection, updateSection, deleteSection } =
    useAdminTerms();

  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState<CreateAdminTermsSectionDto>(EMPTY_FORM);
  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  function openCreate() {
    setForm(EMPTY_FORM);
    setShowCreate(true);
  }

  function cancelCreate() {
    setShowCreate(false);
  }

  function handleCreateClick() {
    if (form.isActive) {
      setConfirmOpen(true);
    } else {
      submitCreate();
    }
  }

  async function submitCreate() {
    const ok = await createSection({
      ...form,
      header: { es: form.header.es.trim(), en: form.header.en.trim() },
      content: { es: form.content.es.trim(), en: form.content.en.trim() },
    });
    if (ok) setShowCreate(false);
  }

  async function handleConfirmCreate() {
    setConfirmOpen(false);
    await submitCreate();
  }

  const isFormValid =
    form.header.es.trim().length > 0 &&
    form.header.en.trim().length > 0 &&
    form.content.es.trim().length > 0 &&
    form.content.en.trim().length > 0 &&
    form.order > 0;

  return (
    <div className="space-y-4">
      {/* Create button / inline form */}
      {!showCreate ? (
        <Button
          size="sm"
          variant="outline"
          onClick={openCreate}
          className="cursor-pointer"
        >
          <Plus className="h-4 w-4 mr-1" />
          {t('admin.terms.newSection')}
        </Button>
      ) : (
        <div className="rounded-lg border bg-card px-4 py-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">{t('admin.terms.newSection')}</p>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={cancelCreate}
              className="cursor-pointer text-muted-foreground"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="new-header-es" className="text-xs">{t('admin.terms.headerEs')}</Label>
            <Input
              id="new-header-es"
              value={form.header.es}
              onChange={(e) => setForm((f) => ({ ...f, header: { ...f.header, es: e.target.value } }))}
              disabled={isSaving}
              placeholder="Ej: Aceptación de los términos"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-header-en" className="text-xs">{t('admin.terms.headerEn')}</Label>
            <Input
              id="new-header-en"
              value={form.header.en}
              onChange={(e) => setForm((f) => ({ ...f, header: { ...f.header, en: e.target.value } }))}
              disabled={isSaving}
              placeholder="e.g. Acceptance of terms"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-content-es" className="text-xs">{t('admin.terms.contentEs')}</Label>
            <textarea
              id="new-content-es"
              value={form.content.es}
              onChange={(e) => setForm((f) => ({ ...f, content: { ...f.content, es: e.target.value } }))}
              disabled={isSaving}
              rows={4}
              placeholder="Contenido de la sección..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y disabled:opacity-50"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="new-content-en" className="text-xs">{t('admin.terms.contentEn')}</Label>
            <textarea
              id="new-content-en"
              value={form.content.en}
              onChange={(e) => setForm((f) => ({ ...f, content: { ...f.content, en: e.target.value } }))}
              disabled={isSaving}
              rows={4}
              placeholder="Section content..."
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y disabled:opacity-50"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="new-order" className="text-xs">{t('admin.terms.order')}</Label>
              <Input
                id="new-order"
                type="number"
                min={1}
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                disabled={isSaving}
                className="w-20"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <Checkbox
                id="new-active"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, isActive: !!checked }))}
                disabled={isSaving}
              />
              <Label htmlFor="new-active" className="text-xs cursor-pointer">
                {t('admin.terms.active')}
              </Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={cancelCreate}
              disabled={isSaving}
              className="cursor-pointer"
            >
              {t('admin.terms.cancel')}
            </Button>
            <Button
              size="sm"
              onClick={handleCreateClick}
              disabled={isSaving || !isFormValid}
              className="cursor-pointer"
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />}
              {isSaving ? t('admin.terms.creating') : t('admin.terms.create')}
            </Button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )}

      {!isLoading && sections.length === 0 && (
        <p className="text-sm text-muted-foreground">{t('admin.terms.empty')}</p>
      )}

      {!isLoading && sections.length > 0 && (
        <div className="space-y-2">
          {sections.map((section) => (
            <AdminTermsRow
              key={section._id}
              section={section}
              isSaving={isSaving}
              onUpdate={updateSection}
              onDelete={deleteSection}
            />
          ))}
        </div>
      )}

      {/* Confirmation dialog for create with isActive: true */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent showCloseButton={!isSaving}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-amber-500 shrink-0" />
              <DialogTitle>{t('admin.terms.confirmCreate.title')}</DialogTitle>
            </div>
            <DialogDescription className="pt-1">
              {t('admin.terms.confirmCreate.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={
                <Button variant="outline" disabled={isSaving} className="cursor-pointer" />
              }
            >
              {t('admin.terms.cancel')}
            </DialogClose>
            <Button onClick={handleConfirmCreate} disabled={isSaving} className="cursor-pointer">
              {isSaving && <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />}
              {t('admin.terms.confirmCreate.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
