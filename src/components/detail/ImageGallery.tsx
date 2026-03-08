import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faGavel,
} from '@fortawesome/free-solid-svg-icons';

interface ImageGalleryProps {
  images: string[];
  title: string;
  auctionDate: string | null;
  isNew: boolean;
}

export default function ImageGallery({ images, title, auctionDate, isNew }: ImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      {/* Main Image */}
      <div className="relative rounded-xl overflow-hidden mb-8 bg-gray-900">
        <img
          src={images[currentIndex]}
          alt={`${title} - Image ${currentIndex + 1}`}
          className="w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover"
        />

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

        <div className="absolute bottom-4 right-4 bg-black/60 text-white text-sm px-3 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>

        <div className="absolute top-4 left-4 flex gap-2">
          {auctionDate && (
            <span className="bg-red-600 text-white text-sm font-semibold px-3 py-1 rounded flex items-center gap-1.5">
              <FontAwesomeIcon icon={faGavel} />
              AUCTION
            </span>
          )}
          {isNew && (
            <span className="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded">
              NEW
            </span>
          )}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 cursor-pointer p-0 ${
              index === currentIndex
                ? 'border-red-600'
                : 'border-transparent opacity-60 hover:opacity-100'
            } transition-all`}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </>
  );
}
