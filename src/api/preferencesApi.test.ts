import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { api } from '../services/apiClient';
import { fetchPreferences, mockPreferencePayload } from './preferencesApi';
import type { PreferenceResponse } from '../types/copilot';

describe('fetchPreferences', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  it('calls POST /ai/preferences with the given payload', async () => {
    mock.onPost('/ai/preferences').reply(200, { message: '', listings: [], displayCount: 0, totalCount: 0, hasMore: false });

    await fetchPreferences(mockPreferencePayload);

    const req = mock.history.post[0];
    expect(req.url).toBe('/ai/preferences');
    expect(JSON.parse(req.data)).toEqual(mockPreferencePayload);
  });

  it('returns the response data', async () => {
    const response: PreferenceResponse = {
      message: 'Found 2 listings',
      listings: [{ propertyId: '1', listingId: 'l1', imageUrl: '', addressLine1: '12 Campbell Parade', suburb: 'Bondi', bedrooms: 2, bathrooms: 1, price: 500, buildingSizeSqm: null, propertyType: 'apartment' }],
      displayCount: 1,
      totalCount: 2,
      hasMore: true,
    };
    mock.onPost('/ai/preferences').reply(200, response);

    const result = await fetchPreferences(mockPreferencePayload);

    expect(result).toEqual(response);
  });

  it('rejects on a 500 response', async () => {
    mock.onPost('/ai/preferences').reply(500);

    await expect(fetchPreferences(mockPreferencePayload)).rejects.toThrow();
  });
});
