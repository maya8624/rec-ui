import { useQuery } from '@tanstack/react-query';
import { fetchPreferences, mockPreferencePayload } from '../api/preferencesApi';

export const usePreferences = () => {
  return useQuery({
    queryKey: ['preferences', mockPreferencePayload],
    queryFn: () => fetchPreferences(mockPreferencePayload),
  });
};
