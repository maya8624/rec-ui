import { useState, useCallback } from 'react';
import { getThreadId, saveThreadId, clearThreadId } from '../utils/threadStorage';

interface UseThreadIdReturn {
  threadId: string | null;
  setThreadId: (id: string) => void;
  resetThread: () => void;
}

export function useThreadId(): UseThreadIdReturn {
  const [threadId, setThreadIdState] = useState<string | null>(() => getThreadId());

  const setThreadId = useCallback((id: string) => {
    saveThreadId(id);
    setThreadIdState(id);
  }, []);

  const resetThread = useCallback(() => {
    clearThreadId();
    setThreadIdState(null);
  }, []);

  return { threadId, setThreadId, resetThread };
}
