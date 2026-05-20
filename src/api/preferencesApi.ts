import { api } from '../services/apiClient';
import type { PreferenceRequest, PreferenceResponse, SuburbSummaryResponse } from '../types/copilot';

export const mockPreferencePayload: PreferenceRequest = {
  suburbs: ['Bondi Beach', 'Surry Hills'],
  maxRent: 950,
  minBeds: 2,
  maxBeds: 3,
  petFriendly: true,
  availableWithinDays: 14,
};

export const fetchPreferences = async (payload: PreferenceRequest): Promise<PreferenceResponse> => {
  const res = await api.post<PreferenceResponse>('/ai/preferences', payload);
  return res.data;
};

export const fetchSuburbSummary = async (suburbs: string[]): Promise<SuburbSummaryResponse> => {
  const res = await api.post<SuburbSummaryResponse>('/ai/suburb-summary', { suburbs });
  return res.data;
};
