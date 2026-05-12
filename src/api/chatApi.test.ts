import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { streamChatMessage, type StreamEvent } from './chatApi';
import { api } from '../services/apiClient';

vi.mock('../services/apiClient', () => ({
  api: { post: vi.fn() },
}));

type FakeProgressEvent = { event: { target: { responseText: string } } };
type PostConfig = { onDownloadProgress: (e: FakeProgressEvent) => void; signal?: AbortSignal };

function simulateStream(chunks: string[]) {
  (api.post as Mock).mockImplementation(
    (_url: string, _payload: unknown, config: PostConfig) => {
      let accumulated = '';
      for (const chunk of chunks) {
        accumulated += chunk;
        config.onDownloadProgress({ event: { target: { responseText: accumulated } } });
      }
      return Promise.resolve({ data: '' });
    },
  );
}

describe('streamChatMessage', () => {
  const payload = { message: 'hi', propertyId: null, threadId: null };

  beforeEach(() => vi.clearAllMocks());

  it('fires token and done events from a single chunk', async () => {
    simulateStream(['data: {"type":"token","content":"hello"}\n\ndata: [DONE]\n\n']);

    const events: StreamEvent[] = [];
    await streamChatMessage(payload, (e) => events.push(e));

    expect(events).toEqual([
      { type: 'token', content: 'hello' },
      { type: 'done' },
    ]);
  });

  it('assembles an event split across two progress chunks', async () => {
    simulateStream([
      'data: {"type":"token","con',
      'tent":"world"}\n\ndata: [DONE]\n\n',
    ]);

    const events: StreamEvent[] = [];
    await streamChatMessage(payload, (e) => events.push(e));

    expect(events).toEqual([
      { type: 'token', content: 'world' },
      { type: 'done' },
    ]);
  });

  it('fires multiple events delivered in a single progress call', async () => {
    simulateStream([
      'data: {"type":"token","content":"a"}\n\ndata: {"type":"token","content":"b"}\n\ndata: [DONE]\n\n',
    ]);

    const events: StreamEvent[] = [];
    await streamChatMessage(payload, (e) => events.push(e));

    expect(events).toEqual([
      { type: 'token', content: 'a' },
      { type: 'token', content: 'b' },
      { type: 'done' },
    ]);
  });

  it('skips non-data lines such as SSE comments', async () => {
    simulateStream([': keep-alive\n\ndata: {"type":"token","content":"x"}\n\ndata: [DONE]\n\n']);

    const events: StreamEvent[] = [];
    await streamChatMessage(payload, (e) => events.push(e));

    expect(events).toEqual([
      { type: 'token', content: 'x' },
      { type: 'done' },
    ]);
  });

  it('does not double-process data already seen in a previous progress call', async () => {
    simulateStream([
      'data: {"type":"token","content":"first"}\n\n',
      'data: {"type":"token","content":"second"}\n\ndata: [DONE]\n\n',
    ]);

    const events: StreamEvent[] = [];
    await streamChatMessage(payload, (e) => events.push(e));

    expect(events).toEqual([
      { type: 'token', content: 'first' },
      { type: 'token', content: 'second' },
      { type: 'done' },
    ]);
  });

  it('forwards the AbortSignal to api.post', async () => {
    simulateStream(['data: [DONE]\n\n']);
    const ctrl = new AbortController();

    await streamChatMessage(payload, () => {}, ctrl.signal);

    expect(api.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      expect.objectContaining({ signal: ctrl.signal }),
    );
  });
});
