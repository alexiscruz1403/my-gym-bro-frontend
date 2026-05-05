'use client';

import { Loader2, TriangleAlert } from 'lucide-react';
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
            <DialogTitle>Eliminar cuenta</DialogTitle>
          </div>
          <DialogDescription className="space-y-2 pt-1">
            <span className="block">
              Esta acción es <strong className="text-foreground">permanente e irreversible</strong>.
              Al eliminar tu cuenta:
            </span>
            <ul className="list-disc pl-4 space-y-1 text-xs">
              <li>Todos tus datos personales serán desactivados</li>
              <li>No podrás iniciar sesión con esta cuenta en el futuro</li>
              <li>Solo un administrador puede restaurar el acceso</li>
            </ul>
            <span className="block pt-1">
              ¿Estás seguro de que querés continuar?
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <DialogClose
            render={
              <Button variant="outline" disabled={isDeleting} className="cursor-pointer" />
            }
          >
            Cancelar
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isDeleting}
            className="cursor-pointer"
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar mi cuenta'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
