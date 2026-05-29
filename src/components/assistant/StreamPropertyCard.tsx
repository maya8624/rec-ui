import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faCar, faPaw } from '@fortawesome/free-solid-svg-icons';
import type { ListingResult } from '../../types/copilot';

interface Props {
  listing: ListingResult;
}

export const StreamPropertyCard = ({ listing }: Props) => {
  const card = (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:shadow-md hover:border-gray-300 dark:hover:border-gray-500 transition-all">
      <div className="relative h-36 overflow-hidden bg-gray-100 dark:bg-gray-700">
        {listing.image_url ? (
          <img
            src={listing.image_url}
            alt={listing.address}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 text-xs">
            No image
          </div>
        )}
        {listing.property_type && (
          <span className="absolute top-2 left-2 text-[10px] font-semibold bg-gray-900/60 text-white px-1.5 py-0.5 rounded">
            {listing.property_type}
          </span>
        )}
        {listing.pet_friendly && (
          <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-semibold bg-emerald-600/80 text-white px-1.5 py-0.5 rounded">
            <FontAwesomeIcon icon={faPaw} className="text-[9px]" />
            Pets OK
          </span>
        )}
      </div>

      <div className="p-3">
        <p className="font-bold text-sm text-red-600 dark:text-red-400 mb-0.5">
          ${listing.price.toLocaleString()}/wk
        </p>
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate leading-snug">
          {listing.address}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {listing.suburb}, {listing.state} {listing.postcode}
        </p>

        <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
          {listing.bedrooms > 0 && (
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faBed} />
              {listing.bedrooms}
            </span>
          )}
          {listing.bathrooms > 0 && (
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faBath} />
              {listing.bathrooms}
            </span>
          )}
          {listing.car_spaces > 0 && (
            <span className="flex items-center gap-1">
              <FontAwesomeIcon icon={faCar} />
              {listing.car_spaces}
            </span>
          )}
        </div>

        {listing.agency_name && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 truncate">
            {listing.agency_name}
            {listing.agent_name ? ` Â· ${listing.agent_name}` : ''}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <a href={`/property/${listing.property_id}`} target="property-detail" className="block no-underline">
      {card}
    </a>
  );
};

