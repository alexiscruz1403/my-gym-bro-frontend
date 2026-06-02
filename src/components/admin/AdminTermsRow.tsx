'use client';

import { useState } from 'react';
import { Loader2, Pencil, Trash2, TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
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
import type { AdminTermsSection, UpdateAdminTermsSectionDto } from '@/types/domain.types';

interface AdminTermsRowProps {
  section: AdminTermsSection;
  isSaving: boolean;
  onUpdate: (id: string, dto: UpdateAdminTermsSectionDto) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

type DialogMode = 'save-notify' | 'delete' | null;

const inputCls = 'w-full h-10.5 px-3 border-[1.5px] border-border rounded-2xl bg-card text-foreground text-[13px] outline-none focus:border-primary transition-colors disabled:opacity-50 placeholder:text-muted-foreground/60';
const textareaCls = 'w-full border-[1.5px] border-border rounded-2xl bg-card text-foreground text-sm px-3 py-2.5 outline-none resize-y focus:border-primary transition-colors disabled:opacity-50';
const btnPri = 'h-8.5 px-3 rounded-xl text-[12px] font-semibold cursor-pointer border-none bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center gap-1';
const btnGhost = 'h-8.5 px-3 rounded-xl text-[12px] font-semibold cursor-pointer border-[1.5px] border-border bg-transparent text-muted-foreground hover:bg-muted/60 transition-colors disabled:opacity-50';

export function AdminTermsRow({ section, isSaving, onUpdate, onDelete }: AdminTermsRowProps) {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [headerEs, setHeaderEs] = useState(section.header.es);
  const [headerEn, setHeaderEn] = useState(section.header.en);
  const [contentEs, setContentEs] = useState(section.content.es);
  const [contentEn, setContentEn] = useState(section.content.en);
  const [order, setOrder] = useState(String(section.order));
  const [isActive, setIsActive] = useState(section.isActive);
  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [pendingDto, setPendingDto] = useState<UpdateAdminTermsSectionDto | null>(null);

  function openEdit() {
    setHeaderEs(section.header.es);
    setHeaderEn(section.header.en);
    setContentEs(section.content.es);
    setContentEn(section.content.en);
    setOrder(String(section.order));
    setIsActive(section.isActive);
    setIsEditing(true);
  }

  function cancelEdit() { setIsEditing(false); }

  function handleSaveClick() {
    const dto: UpdateAdminTermsSectionDto = {
      header: { es: headerEs.trim(), en: headerEn.trim() },
      content: { es: contentEs.trim(), en: contentEn.trim() },
      order: Number(order),
      isActive,
    };
    if (isActive) {
      setPendingDto(dto);
      setDialogMode('save-notify');
    } else {
      submitUpdate(dto);
    }
  }

  async function submitUpdate(dto: UpdateAdminTermsSectionDto) {
    const ok = await onUpdate(section._id, dto);
    if (ok) setIsEditing(false);
  }

  async function handleConfirmSave() {
    if (!pendingDto) return;
    setDialogMode(null);
    await submitUpdate(pendingDto);
    setPendingDto(null);
  }

  async function handleConfirmDelete() {
    setDialogMode(null);
    await onDelete(section._id);
  }

  const isFormValid =
    headerEs.trim().length > 0 &&
    headerEn.trim().length > 0 &&
    contentEs.trim().length > 0 &&
    contentEn.trim().length > 0 &&
    Number(order) > 0;

  return (
    <>
      <div className="rounded-2xl border border-border bg-card px-4 py-3.25 shadow-sm">
        {/* Row header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-mono text-muted-foreground">#{section.order}</span>
              <p className="text-[14px] font-semibold text-foreground truncate">{section.header.es}</p>
              <span className={cn(
                'text-[10px] font-semibold px-2 py-0.5 rounded-full',
                section.isActive
                  ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/25'
                  : 'bg-muted/60 text-muted-foreground border border-border'
              )}>
                {section.isActive ? t('common.active') : t('common.inactive')}
              </span>
            </div>
            <p className="text-[12px] text-muted-foreground line-clamp-2 mt-1.25 leading-[1.45]">
              {section.content.es}
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!isEditing && (
              <>
                <button
                  type="button"
                  onClick={openEdit}
                  className="w-8 h-8 rounded-lg border-[1.5px] border-border bg-transparent text-muted-foreground hover:bg-muted/60 hover:text-foreground cursor-pointer flex items-center justify-center transition-colors"
                  title={t('common.edit')}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => setDialogMode('delete')}
                  disabled={isSaving}
                  className="w-8 h-8 rounded-lg border-[1.5px] border-border bg-transparent text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 cursor-pointer flex items-center justify-center transition-colors disabled:opacity-50"
                  title={t('common.delete')}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Inline edit form */}
        {isEditing && (
          <div className="border-t border-border mt-3 pt-3 flex flex-col gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`header-es-${section._id}`} className="text-[12px]">
                {t('admin.terms.headerEs')}
              </Label>
              <input
                id={`header-es-${section._id}`}
                value={headerEs}
                onChange={(e) => setHeaderEs(e.target.value)}
                disabled={isSaving}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`header-en-${section._id}`} className="text-[12px]">
                {t('admin.terms.headerEn')}
              </Label>
              <input
                id={`header-en-${section._id}`}
                value={headerEn}
                onChange={(e) => setHeaderEn(e.target.value)}
                disabled={isSaving}
                className={inputCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`content-es-${section._id}`} className="text-[12px]">
                {t('admin.terms.contentEs')}
              </Label>
              <textarea
                id={`content-es-${section._id}`}
                value={contentEs}
                onChange={(e) => setContentEs(e.target.value)}
                disabled={isSaving}
                rows={4}
                className={textareaCls}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor={`content-en-${section._id}`} className="text-[12px]">
                {t('admin.terms.contentEn')}
              </Label>
              <textarea
                id={`content-en-${section._id}`}
                value={contentEn}
                onChange={(e) => setContentEn(e.target.value)}
                disabled={isSaving}
                rows={4}
                className={textareaCls}
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor={`order-${section._id}`} className="text-[12px]">{t('admin.terms.order')}</Label>
                <input
                  id={`order-${section._id}`}
                  type="number"
                  min={1}
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  disabled={isSaving}
                  className={cn(inputCls, 'w-20')}
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <Checkbox
                  id={`active-${section._id}`}
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(!!checked)}
                  disabled={isSaving}
                />
                <Label htmlFor={`active-${section._id}`} className="text-[12px] cursor-pointer">
                  {t('admin.terms.active')}
                </Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={cancelEdit} disabled={isSaving} className={btnGhost}>
                {t('admin.terms.cancel')}
              </button>
              <button type="button" onClick={handleSaveClick} disabled={isSaving || !isFormValid} className={btnPri}>
                {isSaving && <Loader2 className="h-3 w-3 animate-spin" />}
                {isSaving ? t('admin.terms.saving') : t('admin.terms.save')}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Save + notify confirmation */}
      <Dialog open={dialogMode === 'save-notify'} onOpenChange={(o) => !o && setDialogMode(null)}>
        <DialogContent showCloseButton={!isSaving}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-amber-500 shrink-0" />
              <DialogTitle>{t('admin.terms.confirmSave.title')}</DialogTitle>
            </div>
            <DialogDescription className="pt-1">
              {t('admin.terms.confirmSave.description')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" disabled={isSaving} className="cursor-pointer" />}>
              {t('admin.terms.cancel')}
            </DialogClose>
            <Button onClick={handleConfirmSave} disabled={isSaving} className="cursor-pointer">
              {isSaving && <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />}
              {t('admin.terms.confirmSave.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={dialogMode === 'delete'} onOpenChange={(o) => !o && setDialogMode(null)}>
        <DialogContent showCloseButton={!isSaving}>
          <DialogHeader>
            <div className="flex items-center gap-2">
              <TriangleAlert className="h-5 w-5 text-destructive shrink-0" />
              <DialogTitle>{t('admin.terms.confirmDelete.title')}</DialogTitle>
            </div>
            <DialogDescription className="pt-1">
              {t('admin.terms.confirmDelete.description', { header: section.header.es })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline" disabled={isSaving} className="cursor-pointer" />}>
              {t('admin.terms.cancel')}
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isSaving}
              className="cursor-pointer"
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />}
              {isSaving ? t('admin.terms.deleting') : t('admin.terms.confirmDelete.confirm')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
