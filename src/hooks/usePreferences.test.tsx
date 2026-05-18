import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { usePreferences } from './usePreferences';
import { fetchPreferences, mockPreferencePayload } from '../api/preferencesApi';
import type { PreferenceResponse } from '../types/copilot';

vi.mock('../api/preferencesApi', () => ({
  fetchPreferences: vi.fn(),
  mockPreferencePayload: {
    suburbs: ['Bondi', 'Bondi Beach', 'Surry Hills'],
    maxRent: 950,
    minBeds: 2,
    maxBeds: 3,
    petFriendly: true,
    availableWithinDays: 14,
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockResponse: PreferenceResponse = {
  message: 'Found 2 listings',
  listings: [{ id: '1' }],
  displayCount: 1,
  totalCount: 2,
  hasMore: true,
};

describe('usePreferences', () => {
  beforeEach(() => vi.clearAllMocks());

  it('calls fetchPreferences with the given payload and returns data', async () => {
    (fetchPreferences as Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePreferences(), { wrapper: createWrapper() });

    act(() => { result.current.mutate(mockPreferencePayload); });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchPreferences).toHaveBeenCalledWith(mockPreferencePayload);
    expect(result.current.data).toEqual(mockResponse);
  });

  it('sets isPending true while the request is in flight', async () => {
    let resolve!: (val: PreferenceResponse) => void;
    (fetchPreferences as Mock).mockImplementation(
      () => new Promise<PreferenceResponse>((r) => { resolve = r; }),
    );

    const { result } = renderHook(() => usePreferences(), { wrapper: createWrapper() });

    act(() => { result.current.mutate(mockPreferencePayload); });

    await waitFor(() => expect(result.current.isPending).toBe(true));

    act(() => { resolve(mockResponse); });
    await waitFor(() => expect(result.current.isPending).toBe(false));
  });

  it('exposes the error when fetchPreferences rejects', async () => {
    (fetchPreferences as Mock).mockRejectedValue(new Error('AI service unavailable'));

    const { result } = renderHook(() => usePreferences(), { wrapper: createWrapper() });

    act(() => { result.current.mutate(mockPreferencePayload); });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect((result.current.error as Error).message).toBe('AI service unavailable');
  });
});
