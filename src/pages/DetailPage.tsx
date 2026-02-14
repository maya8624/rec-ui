import { useParams, Link } from 'react-router-dom';
import { useProperty } from '../hooks/useProperties';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBed,
  faBath,
  faCar,
  faRulerCombined,
  faGavel,
  faPhone,
  faEnvelope,
  faArrowLeft,
  faCalendarDays,
  faCheck,
  faLocationDot,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { faHeart } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';

export default function DetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, isError } = useProperty(Number(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 animate-pulse">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-6" />
        <div className="h-[500px] bg-gray-200 dark:bg-gray-700 rounded-lg mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-2/3" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        </div>
      </div>
    );
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

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 mb-4 no-underline"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to listings
      </Link>

      {/* Image Gallery */}
      <div className="relative rounded-xl overflow-hidden mb-8 bg-gray-900">
        <img
          src={property.images[currentImageIndex]}
          alt={`${property.title} - Image ${currentImageIndex + 1}`}
          className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
        />

        {/* Navigation arrows */}
        <button
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer border-none"
        >
          <FontAwesomeIcon icon={faChevronLeft} className="text-gray-700" />
        </button>
        <button
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors cursor-pointer border-none"
        >
          <FontAwesomeIcon icon={faChevronRight} className="text-gray-700" />
        </button>

        {/* Image counter */}
        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
          {currentImageIndex + 1} / {property.images.length}
        </div>

        {/* Badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {property.auctionDate && (
            <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded flex items-center gap-1.5">
              <FontAwesomeIcon icon={faGavel} />
              AUCTION
            </span>
          )}
          {property.isNew && (
            <span className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {property.images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 cursor-pointer p-0 ${
              index === currentImageIndex ? 'border-red-600' : 'border-transparent opacity-60 hover:opacity-100'
            } transition-all`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Price & Title */}
          <div className="mb-6">
            <div className="flex items-start justify-between gap-4 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {property.price}
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

          {/* Property Stats */}
          <div className="flex items-center gap-6 py-4 px-6 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
            {property.bedrooms > 0 && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBed} className="text-gray-400 text-lg" />
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{property.bedrooms}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Beds</p>
                </div>
              </div>
            )}
            {property.bathrooms > 0 && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBath} className="text-gray-400 text-lg" />
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{property.bathrooms}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Baths</p>
                </div>
              </div>
            )}
            {property.parking > 0 && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faCar} className="text-gray-400 text-lg" />
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{property.parking}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Cars</p>
                </div>
              </div>
            )}
            {property.landSize > 0 && (
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faRulerCombined} className="text-gray-400 text-lg" />
                <div>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{property.landSize}m²</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Land</p>
                </div>
              </div>
            )}
            <div className="ml-auto">
              <span className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300">
                {property.propertyType}
              </span>
            </div>
          </div>

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

        {/* Sidebar - Agent Card */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 sticky top-24">
            <div className="text-center mb-4">
              <img
                src={property.agent.photo}
                alt={property.agent.name}
                className="w-20 h-20 rounded-full mx-auto mb-3 object-cover"
              />
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {property.agent.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{property.agent.agency}</p>
            </div>

            <div className="space-y-3">
              <a
                href={`tel:${property.agent.phone}`}
                className="flex items-center justify-center gap-2 w-full py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors no-underline text-sm"
              >
                <FontAwesomeIcon icon={faPhone} />
                {property.agent.phone}
              </a>
              <button className="flex items-center justify-center gap-2 w-full py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:border-red-500 hover:text-red-600 transition-colors cursor-pointer text-sm">
                <FontAwesomeIcon icon={faEnvelope} />
                Email Agent
              </button>
            </div>

            <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
              Listed {property.listedDate}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
