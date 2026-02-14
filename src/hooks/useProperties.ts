import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { propertyApi } from '../api/propertyApi';
import type { Property } from '../types/property';

export function useInfiniteProperties(
  propertyType?: Property['propertyType']
) {
  return useInfiniteQuery({
    queryKey: ['properties', { propertyType }],
    queryFn: ({ pageParam }) =>
      propertyApi.getProperties(pageParam, propertyType),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}

export function useProperty(id: number) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getPropertyById(id),
    enabled: !!id,
  });
}
