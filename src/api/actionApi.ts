import type { PreferenceRequest } from '../types/copilot';

export const mockPreferencePayload: PreferenceRequest = {
  suburbs: ['Bondi Beach', 'Surry Hills'],
  maxRent: 950,
  minBeds: 2,
  maxBeds: 3,
  petFriendly: true,
  availableWithinDays: 14,
};
