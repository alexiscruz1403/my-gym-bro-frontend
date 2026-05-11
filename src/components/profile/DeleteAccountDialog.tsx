'use client';

import { Loader2, TriangleAlert } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
import { useDeleteAccount } from '@/hooks/useDeleteAccount';

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountDialog({ open, onOpenChange }: DeleteAccountDialogProps) {
  const { t } = useTranslation();
  const { deleteAccount, isDeleting } = useDeleteAccount();

  async function handleConfirm() {
    await deleteAccount();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={!isDeleting}>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <TriangleAlert className="h-5 w-5 text-destructive shrink-0" />
            <DialogTitle>{t('profile.delete.title')}</DialogTitle>
          </div>
          <DialogDescription className="space-y-2 pt-1">
            <span className="block">
              {t('profile.delete.warningPart1')}{' '}
              <strong className="text-foreground">{t('profile.delete.warningBold')}</strong>
              {t('profile.delete.warningPart2')}
            </span>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li>{t('profile.delete.consequence1')}</li>
              <li>{t('profile.delete.consequence2')}</li>
              <li>{t('profile.delete.consequence3')}</li>
            </ul>
            <span className="block pt-1">
              {t('profile.delete.confirmation')}
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" disabled={isDeleting} className="cursor-pointer" />
            }
          >
            {t('common.cancel')}
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? t('profile.delete.deleting') : t('profile.delete.confirm')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
