
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faCar } from '@fortawesome/free-solid-svg-icons';
import type { PropertyListing } from '../../types/chat';
import { formatPrice } from '../../utils/formatPrice';
import { useProperty } from '../../hooks/useProperties';

interface Props {
  listing: PropertyListing;
}

export const PropertyResultCard = ({ listing }: Props) => {
  const { data: property, isLoading } = useProperty(listing.propertyId);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden animate-pulse">
        <div className="h-36 bg-gray-200 dark:bg-gray-700" />
        <div className="p-3 space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
        </div>
      </div>
    );
  }

  if (!property) return null;

  return (
    <a
      href={`/property/${property.id}`}
      target="property-detail"
      className="block no-underline bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md hover:border-red-300 dark:hover:border-red-700 transition-all"
    >
      {property.images[0] && (
        <div className="relative h-36 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <span className="absolute top-2 left-2 text-[10px] font-semibold bg-gray-900/60 text-white px-1.5 py-0.5 rounded">
            {property.propertyType}
          </span>
        </div>
      )}

      <div className="p-3">
        <p className="font-bold text-sm text-red-600 mb-0.5">{formatPrice(property)}</p>
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate leading-snug">
          {property.address}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {property.suburb}, {property.state} {property.postcode}
        </p>

        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
          {property.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faBed} />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faBath} />
              {property.bathrooms}
            </span>
          )}
          {property.parking > 0 && (
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faCar} />
              {property.parking}
            </span>
          )}
        </div>
      </div>
    </a>
  );
};
