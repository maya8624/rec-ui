import axios from 'axios';
import type { AxiosError } from 'axios';

interface BackendError {
  message?: string;
}

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<BackendError>;
    if (axiosErr.response?.data?.message) return axiosErr.response.data.message;
    if (axiosErr.code === "ECONNABORTED") return "Request timed out. Please try again.";
    if (axiosErr.code === "ERR_NETWORK") return "Unable to reach the server. Check your connection.";
  }
  return (err instanceof Error ? err.message : null) ?? fallback;
}
