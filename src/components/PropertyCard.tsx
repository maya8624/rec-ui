import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faCar, faRulerCombined, faGavel, faPhone } from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import type { Property } from '../types/property';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <Link to={`/property/${property.id}`} className="no-underline">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.isNew && (
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
                NEW
              </span>
            )}
            {property.isFeatured && (
              <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded">
                FEATURED
              </span>
            )}
            {property.auctionDate && (
              <span className="bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                <FontAwesomeIcon icon={faGavel} className="text-[10px]" />
                AUCTION
              </span>
            )}
          </div>

          {/* Favourite */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="absolute top-3 right-3 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer border-none"
          >
            <FontAwesomeIcon icon={faHeart} className="text-gray-600 text-sm" />
          </button>

          {/* Image count */}
          <div className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded">
            1/{property.images.length}
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Price */}
          <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            {formatPrice(property)}
          </div>

          {/* Auction date */}
          {property.auctionDate && (
            <p className="text-xs text-red-600 font-medium mb-2">
              Auction {property.auctionDate}
            </p>
          )}

          {/* Address */}
          <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-0.5">
            {property.address}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
            {property.suburb}, {property.state} {property.postcode}
          </p>

          {/* Features */}
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400 text-sm border-t border-gray-100 dark:border-gray-700 pt-3 mb-3">
            {property.bedrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faBed} className="text-gray-400" />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms > 0 && (
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faBath} className="text-gray-400" />
                {property.bathrooms}
              </span>
            )}
            {property.parking > 0 && (
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faCar} className="text-gray-400" />
                {property.parking}
              </span>
            )}
            {property.landSize > 0 && (
              <span className="flex items-center gap-1.5">
                <FontAwesomeIcon icon={faRulerCombined} className="text-gray-400" />
                {property.landSize}m²
              </span>
            )}
            <span className="ml-auto text-xs text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
              {property.propertyType}
            </span>
          </div>

          {/* Agent */}
          <div className="flex items-center gap-3 border-t border-gray-100 dark:border-gray-700 pt-3">
            {property.agent.photo && (
              <img
                src={property.agent.photo}
                alt={property.agent.name}
                className="w-9 h-9 rounded-full object-cover"
                loading="lazy"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {property.agent.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {property.agent.agency}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `tel:${property.agent.phone}`;
              }}
              className="flex items-center gap-1.5 text-xs text-red-600 font-medium hover:text-red-700 bg-transparent border-none cursor-pointer"
            >
              <FontAwesomeIcon icon={faPhone} />
              <span className="hidden sm:inline">{property.agent.phone}</span>
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
