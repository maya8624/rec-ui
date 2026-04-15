import type { AxiosError } from 'axios';

interface BackendError {
  message?: string;
}

/**
 * Extracts a human-readable message from an unknown thrown value.
 * Priority: backend response message → JS Error message → fallback string.
 */
export function extractErrorMessage(err: unknown, fallback: string): string {
  const axiosErr = err as AxiosError<BackendError>;
  return (
    axiosErr?.response?.data?.message ??
    (err instanceof Error ? err.message : null) ??
    fallback
  );
}
