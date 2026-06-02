'use client';

import { useEffect, useState } from 'react';
import { Loader2, Plus, TriangleAlert, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AdminTermsRow } from './AdminTermsRow';
import { useAdminTerms } from '@/hooks/useAdminTerms';
import type { CreateAdminTermsSectionDto } from '@/types/domain.types';

const EMPTY_FORM: CreateAdminTermsSectionDto = {
  header: { es: '', en: '' },
  content: { es: '', en: '' },
  order: 1,
  isActive: true,
};

const inputCls = 'w-full h-10.5 px-3 border-[1.5px] border-border rounded-2xl bg-card text-foreground text-[13px] outline-none focus:border-primary transition-colors disabled:opacity-50 placeholder:text-muted-foreground/60';
const textareaCls = 'w-full border-[1.5px] border-border rounded-2xl bg-card text-foreground text-sm px-3 py-2.5 outline-none resize-y focus:border-primary transition-colors disabled:opacity-50';
const btnPri = 'h-8.5 px-3 rounded-xl text-[12px] font-semibold cursor-pointer border-none bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1';
const btnGhost = 'h-8.5 px-3 rounded-xl text-[12px] font-semibold cursor-pointer border-[1.5px] border-border bg-transparent text-muted-foreground hover:bg-muted/60 transition-colors disabled:opacity-50';

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

  function cancelCreate() { setShowCreate(false); }

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
    <div className="flex flex-col gap-3">
      {/* Section head */}
      <div className="flex items-center justify-between gap-2.5">
        <span className="font-display text-[15px] font-semibold text-foreground tracking-[0.01em]">
          {t('admin.terms.sectionTitle', { defaultValue: 'Secciones de términos' })}
        </span>
        {!showCreate && (
          <button
            type="button"
            onClick={openCreate}
            className="h-9 px-3.5 bg-primary text-primary-foreground border-none rounded-xl text-[13px] font-semibold cursor-pointer flex items-center gap-1.5 transition-opacity hover:opacity-90"
          >
            <Plus className="h-3.5 w-3.5" />
            {t('admin.terms.newSection')}
          </button>
        )}
      </div>

      {/* Inline create form */}
      {showCreate && (
        <div className="rounded-2xl border border-border bg-card px-4 py-4 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold text-foreground">{t('admin.terms.newSection')}</p>
            <button
              type="button"
              onClick={cancelCreate}
              className="w-8 h-8 rounded-lg border-[1.5px] border-border bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground cursor-pointer flex items-center justify-center transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-header-es" className="text-[12px]">{t('admin.terms.headerEs')}</Label>
            <input
              id="new-header-es"
              value={form.header.es}
              onChange={(e) => setForm((f) => ({ ...f, header: { ...f.header, es: e.target.value } }))}
              disabled={isSaving}
              placeholder="Ej: Aceptación de los términos"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-header-en" className="text-[12px]">{t('admin.terms.headerEn')}</Label>
            <input
              id="new-header-en"
              value={form.header.en}
              onChange={(e) => setForm((f) => ({ ...f, header: { ...f.header, en: e.target.value } }))}
              disabled={isSaving}
              placeholder="e.g. Acceptance of terms"
              className={inputCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-content-es" className="text-[12px]">{t('admin.terms.contentEs')}</Label>
            <textarea
              id="new-content-es"
              value={form.content.es}
              onChange={(e) => setForm((f) => ({ ...f, content: { ...f.content, es: e.target.value } }))}
              disabled={isSaving}
              rows={4}
              placeholder="Contenido de la sección..."
              className={textareaCls}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="new-content-en" className="text-[12px]">{t('admin.terms.contentEn')}</Label>
            <textarea
              id="new-content-en"
              value={form.content.en}
              onChange={(e) => setForm((f) => ({ ...f, content: { ...f.content, en: e.target.value } }))}
              disabled={isSaving}
              rows={4}
              placeholder="Section content..."
              className={textareaCls}
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="new-order" className="text-[12px]">{t('admin.terms.order')}</Label>
              <input
                id="new-order"
                type="number"
                min={1}
                value={form.order}
                onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
                disabled={isSaving}
                className={cn(inputCls, 'w-20')}
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <Checkbox
                id="new-active"
                checked={form.isActive}
                onCheckedChange={(checked) => setForm((f) => ({ ...f, isActive: !!checked }))}
                disabled={isSaving}
              />
              <Label htmlFor="new-active" className="text-[12px] cursor-pointer">
                {t('admin.terms.active')}
              </Label>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={cancelCreate} disabled={isSaving} className={btnGhost}>
              {t('admin.terms.cancel')}
            </button>
            <button type="button" onClick={handleCreateClick} disabled={isSaving || !isFormValid} className={btnPri}>
              {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
              {isSaving ? t('admin.terms.creating') : t('admin.terms.create')}
            </button>
          </div>
        </div>
      )}

      {/* List */}
      {isLoading && (
        <div className="flex flex-col gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      )}

      {!isLoading && sections.length === 0 && (
        <p className="text-[13px] text-muted-foreground">{t('admin.terms.empty')}</p>
      )}

      {!isLoading && sections.length > 0 && (
        <div className="flex flex-col gap-2">
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
            <DialogClose render={<Button variant="outline" disabled={isSaving} className="cursor-pointer" />}>
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
