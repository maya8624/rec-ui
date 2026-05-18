import { useMutation } from '@tanstack/react-query';
import { fetchPreferences } from '../api/preferencesApi';
import type { PreferenceRequest } from '../types/copilot';

export const usePreferences = () => {
  return useMutation({
    mutationFn: (payload: PreferenceRequest) => fetchPreferences(payload),
  });
};
