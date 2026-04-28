import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { propertyApi } from '../api/propertyApi';
import type { Property } from '../types/property';

export function useInfiniteProperties(
  propertyType?: Property['propertyType'],
  listingType?: Property['listingType']
) {
  return useInfiniteQuery({
    queryKey: ['properties', { propertyType, listingType }],
    queryFn: ({ pageParam }) =>
      propertyApi.getProperties(pageParam, propertyType, listingType),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getPropertyById(id),
    enabled: !!id,
  });
}
