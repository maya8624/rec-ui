import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCopilotChat } from './useCopilotChat';
import type { SuburbSummaryResponse } from '../types/copilot';

const mockSuburbData: SuburbSummaryResponse = {
  suburbs: [
    {
      name: 'Bondi Beach',
      description: 'A vibrant beach suburb.',
      rents: { oneBedroom: '$500/wk', twoBedroom: '$800/wk', threeBedroom: null },
      vacancyRate: '3.1%',
      trend: 'up 1.5% QoQ',
    },
    {
      name: 'Surry Hills',
      description: 'A trendy inner-city suburb.',
      rents: { oneBedroom: '$600/wk', twoBedroom: null, threeBedroom: null },
      vacancyRate: null,
      trend: null,
    },
  ],
};

describe('useCopilotChat — handleSendStructured', () => {
  it('appends a user message with the given text', () => {
    const { result } = renderHook(() => useCopilotChat());
    const before = result.current.messages.length;

    act(() => {
      result.current.handleSendStructured('Give me a suburb summary', mockSuburbData);
    });

    const userMsg = result.current.messages[before];
    expect(userMsg.role).toBe('user');
    expect(userMsg.text).toBe('Give me a suburb summary');
  });

  it('appends an AI message with type suburb-summary and the data', () => {
    const { result } = renderHook(() => useCopilotChat());
    const before = result.current.messages.length;

    act(() => {
      result.current.handleSendStructured('Give me a suburb summary', mockSuburbData);
    });

    const aiMsg = result.current.messages[before + 1];
    expect(aiMsg.role).toBe('ai');
    expect(aiMsg.type).toBe('suburb-summary');
    expect(aiMsg.suburbSummary).toEqual(mockSuburbData);
  });

  it('does not set isStreaming to true', () => {
    const { result } = renderHook(() => useCopilotChat());

    act(() => {
      result.current.handleSendStructured('Give me a suburb summary', mockSuburbData);
    });

    expect(result.current.isStreaming).toBe(false);
  });

  it('adds exactly two messages per call', () => {
    const { result } = renderHook(() => useCopilotChat());
    const before = result.current.messages.length;

    act(() => {
      result.current.handleSendStructured('Give me a suburb summary', mockSuburbData);
    });

    expect(result.current.messages.length).toBe(before + 2);
  });
});
