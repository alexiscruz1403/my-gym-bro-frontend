import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import useAuthStore from '@/store/auth.store';
import { usersService } from '@/services/users.service';

export function useDeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { logout: storeLogout } = useAuthStore();

  const deleteAccount = useCallback(async (): Promise<void> => {
    setIsDeleting(true);
    try {
      await usersService.deleteAccount();
      storeLogout();
      router.push('/login');
      toast.success('Tu cuenta ha sido eliminada.');
    } catch {
      toast.error('No se pudo eliminar la cuenta. Intenta de nuevo.');
    } finally {
      setIsDeleting(false);
    }
  }, [storeLogout, router]);

  return { deleteAccount, isDeleting };
}
