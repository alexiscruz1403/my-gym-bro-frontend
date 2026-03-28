'use client';

import { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useProfile } from '@/hooks/useProfile';
import { cn } from '@/lib/utils';

export function AvatarUpload() {
  const { user, uploadAvatar, isLoading } = useProfile();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : 'GP';

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Show local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    const success = await uploadAvatar(file);

    if (!success) {
      // Revert preview on failure
      setPreview(null);
    }

    URL.revokeObjectURL(objectUrl);

    // Reset input so the same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const avatarSrc = preview ?? user?.avatar;

  return (
    <>
    <div className="relative w-fit">
      {avatarSrc ? (
        <button
          type="button"
          onClick={() => setIsPreviewOpen(true)}
          aria-label="Ver foto de perfil"
          className="rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer"
        >
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarSrc} alt={user?.username} />
            <AvatarFallback className="text-lg font-display font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
        </button>
      ) : (
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-lg font-display font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={isLoading}
        aria-label="Cambiar foto de perfil"
        className={cn(
          'absolute bottom-0 right-0 flex items-center justify-center',
          'h-7 w-7 rounded-full bg-primary text-primary-foreground cursor.pointer',
          'transition-opacity',
          isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90',
        )}
      >
        {isLoading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Camera size={14} className='cursor-pointer'/>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>

    <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <DialogContent className="flex items-center justify-center bg-transparent border-none shadow-none p-0">
        {avatarSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={avatarSrc}
            alt={user?.username}
            className="max-h-[80vh] max-w-[80vw] object-contain rounded-lg"
          />
        )}
      </DialogContent>
    </Dialog>
    </>
  );
}
