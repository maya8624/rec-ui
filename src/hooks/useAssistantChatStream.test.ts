import { act, renderHook } from '@testing-library/react';
import axios from 'axios';
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { streamChatMessage } from '../api/copilotApi';
import { useAssistantChatStream } from './useAssistantChatStream';

vi.mock('../api/copilotApi', () => ({ streamChatMessage: vi.fn() }));
vi.mock('../utils/chatPanelUtils', () => ({ detectPanelData: vi.fn().mockReturnValue(null) }));

describe('useAssistantChatStream', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    vi.stubGlobal('requestAnimationFrame', (fn: FrameRequestCallback) => {
      setTimeout(() => fn(0), 0);
      return 0;
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('swallows axios CanceledError and leaves error state null', async () => {
    (streamChatMessage as Mock).mockRejectedValue(new axios.CanceledError('aborted'));

    const { result } = renderHook(() => useAssistantChatStream());

    await act(async () => {
      await result.current.sendMessage('hello');
    });

    expect(result.current.error).toBeNull();
    expect(result.current.isPending).toBe(false);
  });

  it('sets error state and strips the empty assistant placeholder on a generic error', async () => {
    (streamChatMessage as Mock).mockRejectedValue(new Error('network failure'));

    const { result } = renderHook(() => useAssistantChatStream());

    await act(async () => {
      await result.current.sendMessage('hello');
    });

    expect(result.current.error).toBe('network failure');
    expect(result.current.isPending).toBe(false);
    expect(result.current.messages).toEqual([{ role: 'user', content: 'hello' }]);
  });

  it('sets isPending true while streaming and false when complete', async () => {
    let resolveStream!: () => void;
    (streamChatMessage as Mock).mockImplementation(
      () => new Promise<void>((resolve) => { resolveStream = resolve; }),
    );

    const { result } = renderHook(() => useAssistantChatStream());

    // Start without awaiting so we can inspect mid-flight state
    act(() => { void result.current.sendMessage('hello'); });
    expect(result.current.isPending).toBe(true);

    await act(async () => { resolveStream(); });
    expect(result.current.isPending).toBe(false);
  });

  it('startNewChat clears messages, error, and pending state', async () => {
    (streamChatMessage as Mock).mockRejectedValue(new Error('boom'));

    const { result } = renderHook(() => useAssistantChatStream());

    await act(async () => {
      await result.current.sendMessage('hello');
    });

    act(() => { result.current.startNewChat(); });

    expect(result.current.messages).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(result.current.isPending).toBe(false);
  });
});
