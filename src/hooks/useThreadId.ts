import { useState, useCallback } from 'react';
import { getOrCreateThreadId, resetThreadId } from '../utils/threadStorage';

interface UseThreadIdReturn {
  threadId: string;
  resetThread: () => void;
}

export function useThreadId(): UseThreadIdReturn {
  const [threadId, setThreadId] = useState<string>(() => getOrCreateThreadId());

  const resetThread = useCallback(() => {
    setThreadId(resetThreadId());
  }, []);

  return { threadId, resetThread };
}
