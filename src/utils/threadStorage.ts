const STORAGE_KEY = 'rec_thread';
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

interface ThreadEntry {
  threadId: string;
  expiresAt: string; // ISO 8601
}

function readEntry(): ThreadEntry | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ThreadEntry) : null;
  } catch {
    return null;
  }
}

export function getThreadId(): string | null {
  const entry = readEntry();
  if (entry && new Date(entry.expiresAt) > new Date()) {
    return entry.threadId;
  }
  localStorage.removeItem(STORAGE_KEY);
  return null;
}

export function saveThreadId(threadId: string): void {
  const entry: ThreadEntry = {
    threadId,
    expiresAt: new Date(Date.now() + TTL_MS).toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
}

export function clearThreadId(): void {
  localStorage.removeItem(STORAGE_KEY);
}
