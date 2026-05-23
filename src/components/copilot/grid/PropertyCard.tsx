import { MapPin, Bed, Bath, Maximize, Heart } from 'lucide-react'
import type { ListingItem } from '../../../types/copilot'

interface Props {
  property: ListingItem
  onBook: (address: string) => void
}

export function PropertyCard({ property, onBook }: Props) {
  return (
    <div className="bg-navy-800 border border-navy-600 rounded-xl overflow-hidden cursor-pointer hover:border-gold/40 transition-colors">
      {/* Image */}
      <div className="h-24 relative overflow-hidden bg-slate-700">
        {property.imageUrl ? (
          <img
            src={property.imageUrl ?? ''}
            alt={property.address}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">
            No image
          </div>
        )}
        <button
          onClick={(e) => e.stopPropagation()}
          className="absolute top-2 right-2 bg-black/40 rounded-full p-1 border-none cursor-pointer"
          aria-label="Save"
        >
          <Heart className="w-3 h-3 text-slate-300" />
        </button>
      </div>

      {/* Body */}
      <div className="p-3">
        <p className="text-base font-medium text-gold">
          ${property.price}
          <span className="text-navy-500 text-xs font-normal">/wk</span>
        </p>
        <p className="text-sm text-slate-200">{property.address}</p>
        <p className="flex items-center gap-1 text-xs text-navy-500 mt-0.5">
          <MapPin className="w-2.5 h-2.5" />
          {property.suburb}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-2.5 mt-2 text-xs text-navy-500">
          <span className="flex items-center gap-1">
            <Bed className="w-3 h-3" />{property.bedrooms}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" />{property.bathrooms}
          </span>
          {property.carSpaces > 0 && (
            <span className="flex items-center gap-1">
              <Maximize className="w-3 h-3" />{property.carSpaces} car
            </span>
          )}
        </div>

        {/* Type tag */}
        {property.propertyType && (
          <div className="mt-1.5">
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-700 border border-navy-600 text-slate-400">
              {property.propertyType}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-end mt-2 pt-2 border-t border-navy-600">
          <button
            onClick={() => onBook(property.address)}
            className="px-2.5 py-1 rounded text-xs border border-gold/40 text-gold bg-gold/10 hover:bg-gold/20 transition-colors cursor-pointer"
          >
            Book
          </button>
        </div>
      </div>
    </div>
  )
}
