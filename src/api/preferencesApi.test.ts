import MockAdapter from 'axios-mock-adapter';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { api } from '../services/apiClient';
import { fetchPreferences, fetchSuburbSummary, mockPreferencePayload } from './preferencesApi';
import type { PreferenceResponse, SuburbSummaryResponse } from '../types/copilot';

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
      listings: [{ propertyId: '1', listingId: 'l1', listingType: 'rental', listingStatus: 'available', imageUrl: '', address: '12 Campbell Parade', suburb: 'Bondi', state: 'NSW', postcode: '2026', bedrooms: 2, bathrooms: 1, carSpaces: 0, petFriendly: false, price: 500, propertyType: 'apartment', agentName: '', agentPhone: '', agencyName: '', propertyUrl: null }],
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

describe('fetchSuburbSummary', () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
  });

  afterEach(() => {
    mock.restore();
  });

  it('calls POST /ai/suburb-summary with the given suburbs', async () => {
    mock.onPost('/ai/suburb-summary').reply(200, { suburbs: [] });

    await fetchSuburbSummary(['Bondi Beach', 'Surry Hills']);

    const req = mock.history.post[0];
    expect(req.url).toBe('/ai/suburb-summary');
    expect(JSON.parse(req.data)).toEqual({ suburbs: ['Bondi Beach', 'Surry Hills'] });
  });

  it('returns the structured response data', async () => {
    const response: SuburbSummaryResponse = {
      suburbs: [
        {
          name: 'Bondi Beach',
          description: 'A vibrant beach suburb.',
          rents: { oneBedroom: '$500/wk', twoBedroom: '$800/wk', threeBedroom: null },
          vacancyRate: '3.1%',
          trend: 'up 1.5% QoQ',
        },
      ],
    };
    mock.onPost('/ai/suburb-summary').reply(200, response);

    const result = await fetchSuburbSummary(['Bondi Beach']);

    expect(result).toEqual(response);
  });

  it('rejects on a 500 response', async () => {
    mock.onPost('/ai/suburb-summary').reply(500);

    await expect(fetchSuburbSummary(['Bondi Beach'])).rejects.toThrow();
  });
});
