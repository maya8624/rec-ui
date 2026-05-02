import { useParams, Link } from 'react-router-dom';
import { formatPrice } from '../utils/formatPrice';
import { useProperty } from '../hooks/useProperties';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGavel,
  faArrowLeft,
  faCalendarDays,
  faCheck,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import DetailPageSkeleton from '../components/detail/DetailPageSkeleton';
import ImageGallery from '../components/detail/ImageGallery';
import PropertyStats from '../components/detail/PropertyStats';
import AgentCard from '../components/detail/AgentCard';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError } = useProperty(id!);

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (isError || !property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <p className="text-red-500 text-lg mb-4">Property not found</p>
        <Link to="/" className="text-red-600 hover:underline">
          Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 mb-4 no-underline"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to listings
      </Link>

      <ImageGallery
        images={property.images}
        title={property.title}
        auctionDate={property.auctionDate}
        isNew={property.isNew}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Price & Title */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {formatPrice(property)}
              </h1>
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-600 dark:text-gray-300 hover:border-red-500 hover:text-red-600 transition-colors cursor-pointer bg-white dark:bg-gray-800">
                <FontAwesomeIcon icon={faHeart} />
                Save
              </button>
            </div>
            {property.auctionDate && (
              <p className="text-red-600 font-medium text-sm mb-2">
                <FontAwesomeIcon icon={faGavel} className="mr-1.5" />
                Auction on {property.auctionDate}
              </p>
            )}
            <h2 className="text-lg text-gray-700 dark:text-gray-300 font-medium mb-1">
              {property.address}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <FontAwesomeIcon icon={faLocationDot} className="text-red-500" />
              {property.suburb}, {property.state} {property.postcode}
            </p>
          </div>

          <PropertyStats
            bedrooms={property.bedrooms}
            bathrooms={property.bathrooms}
            parking={property.parking}
            landSize={property.landSize}
            propertyType={property.propertyType}
          />

          {/* Description */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              About this property
            </h3>
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {property.description}
            </p>
          </div>

          {/* Features */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Features
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {property.features.map((feature) => (
                <div
                  key={feature}
                  className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                >
                  <FontAwesomeIcon icon={faCheck} className="text-green-500 text-xs" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Inspection Times */}
          {property.inspectionTimes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                Inspection Times
              </h3>
              <div className="space-y-2">
                {property.inspectionTimes.map((time, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <FontAwesomeIcon icon={faCalendarDays} className="text-red-500" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <AgentCard agent={property.agent} listedDate={property.listedDate} />
        </div>
      </div>
    </div>
  );
}
