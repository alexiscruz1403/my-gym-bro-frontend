'use client';

import { useState } from 'react';
import { Loader2, Pencil, Trash2, TriangleAlert, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
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
import type { AdminTermsSection, UpdateAdminTermsSectionDto } from '@/types/domain.types';

interface AdminTermsRowProps {
  section: AdminTermsSection;
  isSaving: boolean;
  onUpdate: (id: string, dto: UpdateAdminTermsSectionDto) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

type DialogMode = 'save-notify' | 'delete' | null;

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

  function cancelEdit() {
    setIsEditing(false);
  }

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
      <div className="rounded-lg border bg-card px-4 py-3 space-y-3">
        {/* Row header */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-muted-foreground font-mono">#{section.order}</span>
              <p className="text-sm font-medium truncate">{section.header.es}</p>
              <Badge variant={section.isActive ? 'default' : 'secondary'} className="text-xs">
                {section.isActive ? t('common.active') : t('common.inactive')}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground line-clamp-2">{section.content.es}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {!isEditing && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  onClick={openEdit}
                >
                  <Pencil className="h-3.5 w-3.5 mr-1" />
                  {t('common.edit')}
                </Button>
                <Button
                  size="icon-sm"
                  variant="ghost"
                  className="cursor-pointer text-muted-foreground hover:text-destructive"
                  onClick={() => setDialogMode('delete')}
                  disabled={isSaving}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            {isEditing && (
              <Button
                size="icon-sm"
                variant="ghost"
                className="cursor-pointer text-muted-foreground"
                onClick={cancelEdit}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Inline edit form */}
        {isEditing && (
          <div className="border-t pt-3 space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor={`header-es-${section._id}`} className="text-xs">
                {t('admin.terms.headerEs')}
              </Label>
              <Input
                id={`header-es-${section._id}`}
                value={headerEs}
                onChange={(e) => setHeaderEs(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`header-en-${section._id}`} className="text-xs">
                {t('admin.terms.headerEn')}
              </Label>
              <Input
                id={`header-en-${section._id}`}
                value={headerEn}
                onChange={(e) => setHeaderEn(e.target.value)}
                disabled={isSaving}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`content-es-${section._id}`} className="text-xs">
                {t('admin.terms.contentEs')}
              </Label>
              <textarea
                id={`content-es-${section._id}`}
                value={contentEs}
                onChange={(e) => setContentEs(e.target.value)}
                disabled={isSaving}
                rows={4}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y disabled:opacity-50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`content-en-${section._id}`} className="text-xs">
                {t('admin.terms.contentEn')}
              </Label>
              <textarea
                id={`content-en-${section._id}`}
                value={contentEn}
                onChange={(e) => setContentEn(e.target.value)}
                disabled={isSaving}
                rows={4}
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y disabled:opacity-50"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="space-y-1.5">
                <Label htmlFor={`order-${section._id}`} className="text-xs">{t('admin.terms.order')}</Label>
                <Input
                  id={`order-${section._id}`}
                  type="number"
                  min={1}
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  disabled={isSaving}
                  className="w-20"
                />
              </div>
              <div className="flex items-center gap-2 pt-5">
                <Checkbox
                  id={`active-${section._id}`}
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(!!checked)}
                  disabled={isSaving}
                />
                <Label htmlFor={`active-${section._id}`} className="text-xs cursor-pointer">
                  {t('admin.terms.active')}
                </Label>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={cancelEdit}
                disabled={isSaving}
                className="cursor-pointer"
              >
                {t('admin.terms.cancel')}
              </Button>
              <Button
                size="sm"
                onClick={handleSaveClick}
                disabled={isSaving || !isFormValid}
                className="cursor-pointer"
              >
                {isSaving && <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />}
                {isSaving ? t('admin.terms.saving') : t('admin.terms.save')}
              </Button>
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
            <DialogClose
              render={<Button variant="outline" disabled={isSaving} className="cursor-pointer" />}
            >
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
            <DialogClose
              render={<Button variant="outline" disabled={isSaving} className="cursor-pointer" />}
            >
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
