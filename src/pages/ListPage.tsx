import { useState, useEffect, useRef, useCallback } from 'react';
import type { Property } from '../types/property';
import { useInfiniteProperties } from '../hooks/useProperties';
import PropertyCard from '../components/PropertyCard';
import PropertyCardSkeleton from '../components/PropertyCardSkeleton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSliders } from '@fortawesome/free-solid-svg-icons';

export default function ListPage() {
  const [selectedType, setSelectedType] = useState<Property['propertyType'] | null>(null);
  const [listingType, setListingType] = useState<Property['listingType'] | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteProperties(selectedType ?? undefined, listingType ?? undefined);

  const observerRef = useRef<IntersectionObserver | null>(null);

  const lastCardRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isFetchingNextPage) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasNextPage) {
            fetchNextPage();
          }
        },
        { rootMargin: '200px' }
      );

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const allProperties = data?.pages.flatMap((page) => page.items ?? []) ?? [];
  const total = data?.pages[0]?.totalCount ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {listingType === 'Sale' ? 'Properties for Sale' : listingType === 'Rent' ? 'Properties for Rent' : 'All Properties'}
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {total > 0 && `${total} properties found`}
        </p>
      </div>

      {/* Buy / Rent toggle */}
      <div className="flex items-center gap-2 mb-4">
        {([null, 'Sale', 'Rent'] as const).map((type) => {
          const label = type === null ? 'All' : type === 'Sale' ? 'Buy' : 'Rent';
          const isActive = listingType === type;
          return (
            <button
              key={label}
              onClick={() => setListingType(type)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ${
                isActive
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Property type filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 transition-colors cursor-pointer">
          <FontAwesomeIcon icon={faSliders} />
          Filters
        </button>
        <button
          onClick={() => setSelectedType(null)}
          className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer border ${
            selectedType === null
              ? 'bg-red-600 text-white border-red-600 dark:bg-red-600 dark:text-white dark:border-red-600'
              : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600'
          }`}
        >
          All
        </button>
        {(['House', 'Apartment', 'Townhouse', 'Villa', 'Land'] as const).map((type) => {
          const isActive = selectedType === type;
          return (
            <button
              key={type}
              onClick={() => setSelectedType(isActive ? null : type)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer border ${
                isActive
                  ? 'bg-red-600 text-white border-red-600 dark:bg-red-600 dark:text-white dark:border-red-600'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600'
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Error State */}
      {isError && (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg">
            Failed to load properties. Please try again.
          </p>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Property Grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allProperties.map((property, index) => {
            const isLast = index === allProperties.length - 1;
            return (
              <div key={property.id} ref={isLast ? lastCardRef : undefined}>
                <PropertyCard property={property} />
              </div>
            );
          })}

          {/* Loading more skeletons */}
          {isFetchingNextPage &&
            Array.from({ length: 3 }).map((_, i) => (
              <PropertyCardSkeleton key={`loading-${i}`} />
            ))}
        </div>
      )}

      {/* End of results */}
      {!hasNextPage && allProperties.length > 0 && (
        <p className="text-center text-gray-400 dark:text-gray-500 text-sm mt-8 mb-4">
          You've reached the end of the listings
        </p>
      )}
    </div>
  );
}
