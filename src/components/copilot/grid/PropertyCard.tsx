import { MapPin, Bed, Bath, Car, Maximize, Heart } from 'lucide-react'

// BG_BY_ID kept as fallback behind the image

import type { Property } from '../../../types/copilot'

const BG_BY_ID: Record<string, string> = {
  '1': '#0d2137',
  '2': '#1a1030',
  '3': '#0d210d',
  '4': '#21100d',
}

const BADGE_STYLES: Record<string, string> = {
  'Best match': 'bg-green-500/20 text-green-400 border border-green-500/30',
  'Popular': 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
  'Available now': 'bg-green-500/20 text-green-400 border border-green-500/30',
}

interface Props {
  property: Property
  onBook: (address: string) => void
}

export function PropertyCard({ property, onBook }: Props) {
  const bg = BG_BY_ID[property.id] ?? '#1f2d42'

  return (
    <div
      className={`bg-navy-800 border rounded-xl overflow-hidden cursor-pointer hover:border-gold/40 transition-colors ${
        property.featured ? 'border-gold' : 'border-navy-600'
      }`}
    >
      {/* Image */}
      <div className="h-24 relative overflow-hidden" style={{ backgroundColor: bg }}>
        <img
          src={property.image}
          alt={property.address}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {property.badge && (
          <span
            className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded font-medium ${BADGE_STYLES[property.badge]}`}
          >
            {property.badge}
          </span>
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
          {property.suburb}, {property.state}
        </p>

        {/* Specs */}
        <div className="flex items-center gap-2.5 mt-2 text-xs text-navy-500">
          <span className="flex items-center gap-1">
            <Bed className="w-3 h-3" />{property.beds}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="w-3 h-3" />{property.baths}
          </span>
          <span className="flex items-center gap-1">
            <Car className="w-3 h-3" />{property.cars}
          </span>
          <span className="flex items-center gap-1">
            <Maximize className="w-3 h-3" />{property.sqm}m²
          </span>
        </div>

        {/* Tags */}
        <div className="flex gap-1 flex-wrap mt-1.5">
          {property.tags.map(tag => (
            <span
              key={tag}
              className="text-[10px] px-1.5 py-0.5 rounded bg-navy-700 border border-navy-600 text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy-600">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-navy-600 flex items-center justify-center text-gold text-[9px] font-bold select-none">
              {property.agentInitials}
            </div>
            <span className="text-xs text-navy-500">{property.agent}</span>
          </div>
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
