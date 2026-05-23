import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { beforeEach, describe, expect, it, vi, type Mock } from 'vitest';
import { usePreferences } from './usePreferences';
import { fetchPreferences, mockPreferencePayload } from '../api/preferencesApi';
import type { PreferenceResponse } from '../types/copilot';

vi.mock('../api/preferencesApi', () => ({
  fetchPreferences: vi.fn(),
  mockPreferencePayload: {
    suburbs: ['Bondi Beach', 'Surry Hills'],
    maxRent: 950,
    minBeds: 2,
    maxBeds: 3,
    petFriendly: true,
    availableWithinDays: 14,
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

const mockResponse: PreferenceResponse = {
  message: 'Found 2 listings',
  listings: [
    { listingId: '1', propertyId: 'p1', listingType: 'rental', listingStatus: 'available', imageUrl: '', address: '12 Campbell Parade', suburb: 'Bondi Beach', state: 'NSW', postcode: '2026', bedrooms: 2, bathrooms: 1, carSpaces: 0, petFriendly: true, price: 850, propertyType: 'Apartment', agentName: '', agentPhone: '', agencyName: '', propertyUrl: null },
  ],
  displayCount: 1,
  totalCount: 2,
  hasMore: true,
};

describe('usePreferences', () => {
  beforeEach(() => vi.clearAllMocks());

  it('does not fetch on mount', () => {
    renderHook(() => usePreferences(), { wrapper: createWrapper() });

    expect(fetchPreferences).not.toHaveBeenCalled();
  });

  it('fetches and returns data when refetch is called', async () => {
    (fetchPreferences as Mock).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => usePreferences(), { wrapper: createWrapper() });

    act(() => { result.current.refetch(); });

    await waitFor(() => expect(result.current.data).toEqual(mockResponse));
    expect(fetchPreferences).toHaveBeenCalledWith(mockPreferencePayload);
  });

  it('is not loading or fetching on mount', () => {
    const { result } = renderHook(() => usePreferences(), { wrapper: createWrapper() });

    expect(result.current.isFetching).toBe(false);
    expect(result.current.isLoading).toBe(false);
  });

  it('exposes the error when fetchPreferences rejects', async () => {
    (fetchPreferences as Mock).mockRejectedValue(new Error('AI service unavailable'));

    const { result } = renderHook(() => usePreferences(), { wrapper: createWrapper() });

    act(() => { result.current.refetch(); });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect((result.current.error as Error).message).toBe('AI service unavailable');
  });
});
