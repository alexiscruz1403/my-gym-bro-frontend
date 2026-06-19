'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FileDown, Loader2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { exportSessionPdf, exportSessionCsv } from '@/services/export.service';
import type { SessionStatus } from '@/types/domain.types';

interface ExportSessionButtonProps {
  sessionId: string;
  sessionStatus: SessionStatus;
}

export function ExportSessionButton({ sessionId, sessionStatus }: ExportSessionButtonProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { user } = useAuth();
  const isPremium = user?.membershipTier === 'premium' && user?.membershipStatus === 'active';

  const [pdfLoading, setPdfLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);

  if (sessionStatus !== 'completed' && sessionStatus !== 'partial') return null;

  const handlePdf = async () => {
    if (!isPremium) { router.push('/subscription'); return; }
    setPdfLoading(true);
    try {
      await exportSessionPdf(sessionId);
    } catch {
      toast.error(t('history.export.error'));
    } finally {
      setPdfLoading(false);
    }
  };

  const handleCsv = async () => {
    if (!isPremium) { router.push('/subscription'); return; }
    setCsvLoading(true);
    try {
      await exportSessionCsv(sessionId);
    } catch {
      toast.error(t('history.export.error'));
    } finally {
      setCsvLoading(false);
    }
  };

  const buttonClass =
    'flex h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div className="flex gap-2">
      <button type="button" onClick={handlePdf} disabled={pdfLoading} className={buttonClass}>
        {pdfLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isPremium ? (
          <FileDown className="h-3.5 w-3.5" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
        {t('history.export.pdf')}
      </button>

      <button type="button" onClick={handleCsv} disabled={csvLoading} className={buttonClass}>
        {csvLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : isPremium ? (
          <FileDown className="h-3.5 w-3.5" />
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
        {t('history.export.csv')}
      </button>
    </div>
  );
}
