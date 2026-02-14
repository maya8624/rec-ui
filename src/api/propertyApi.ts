import axios from 'axios';
import { properties } from '../data/properties';
import type { PropertiesResponse, Property } from '../types/property';

// Base axios instance - will point to real API later
const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

const PAGE_SIZE = 20;

// Simulated API calls using dummy data - replace with real API calls later
export const propertyApi = {
  getProperties: async (
    page: number,
    propertyType?: Property['propertyType']
  ): Promise<PropertiesResponse> => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const filtered = propertyType
      ? properties.filter((p) => p.propertyType === propertyType)
      : properties;

    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageProperties = filtered.slice(start, end);

    return {
      properties: pageProperties,
      total: filtered.length,
      page,
      pageSize: PAGE_SIZE,
      hasMore: end < filtered.length,
    };

    // When backend is ready, replace with:
    // const { data } = await api.get<PropertiesResponse>('/properties', {
    //   params: { page, pageSize: PAGE_SIZE },
    // });
    // return data;
  },

  getPropertyById: async (id: number): Promise<Property | undefined> => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    return properties.find((p) => p.id === id);

    // When backend is ready, replace with:
    // const { data } = await api.get<Property>(`/properties/${id}`);
    // return data;
  },
};

export default api;
