import { api } from '../services/apiClient';
import type { PropertiesResponse, Property } from '../types/property';

const PAGE_SIZE = 20;

export const propertyApi = {
  getProperties: async (
    page: number,
    propertyType?: Property['propertyType'],
    listingType?: Property['listingType']
  ): Promise<PropertiesResponse> => {
    const { data } = await api.get<PropertiesResponse>('/properties', {
      params: {
        page,
        pageSize: PAGE_SIZE,
        ...(propertyType && { propertyType }),
        ...(listingType && { listingType }),
      },
    });
    return data;
  },

  getPropertyById: async (id: string): Promise<Property | undefined> => {
    const { data } = await api.get<Property>(`/properties/${id}`);
    return data;
  },
};
