import { v4 as uuidv4 } from 'uuid';

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

function writeEntry(threadId: string): ThreadEntry {
  const entry: ThreadEntry = {
    threadId,
    expiresAt: new Date(Date.now() + TTL_MS).toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
  return entry;
}

export function getOrCreateThreadId(): string {
  const entry = readEntry();
  if (entry && new Date(entry.expiresAt) > new Date()) {
    return entry.threadId;
  }
  return writeEntry(uuidv4()).threadId;
}

export function resetThreadId(): string {
  localStorage.removeItem(STORAGE_KEY);
  return writeEntry(uuidv4()).threadId;
}
