import { apiClient } from '@/lib/axios';
import { API_ROUTES } from '@/lib/api-routes';

export type ExportPeriod = '3m' | '6m' | '1y';

function triggerDownload(blob: Blob, filename: string): void {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = objectUrl;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(objectUrl);
}

export async function exportSessionPdf(id: string): Promise<void> {
  const { data } = await apiClient.get<Blob>(API_ROUTES.export.sessionPdf(id), {
    responseType: 'blob',
  });
  triggerDownload(data, `session-${id}.pdf`);
}

export async function exportSessionCsv(id: string): Promise<void> {
  const { data } = await apiClient.get<Blob>(API_ROUTES.export.sessionCsv(id), {
    responseType: 'blob',
  });
  triggerDownload(data, `session-${id}.csv`);
}

export async function exportHistoryPdf(period: ExportPeriod): Promise<void> {
  const date = new Date().toISOString().slice(0, 10);
  const { data } = await apiClient.get<Blob>(API_ROUTES.export.historyPdf, {
    responseType: 'blob',
    params: { period },
    timeout: 30_000,
  });
  triggerDownload(data, `history-${period}-${date}.pdf`);
}

export async function exportHistoryCsv(period: ExportPeriod): Promise<void> {
  const date = new Date().toISOString().slice(0, 10);
  const { data } = await apiClient.get<Blob>(API_ROUTES.export.historyCsv, {
    responseType: 'blob',
    params: { period },
    timeout: 30_000,
  });
  triggerDownload(data, `history-${period}-${date}.csv`);
}
