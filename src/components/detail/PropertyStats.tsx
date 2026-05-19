import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBed, faBath, faCar, faRulerCombined } from '@fortawesome/free-solid-svg-icons';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

interface StatItemProps {
  icon: IconDefinition;
  value: string | number;
  label: string;
}

function StatItem({ icon, value, label }: StatItemProps) {
  return (
    <div className="flex items-center gap-2">
      <FontAwesomeIcon icon={icon} className="text-gray-400 text-lg" />
      <div>
        <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </div>
  );
}

interface PropertyStatsProps {
  bedrooms: number;
  bathrooms: number;
  carSpaces: number;
  landSize: number;
  propertyType: string;
}

export default function PropertyStats({
  bedrooms,
  bathrooms,
  carSpaces,
  landSize,
  propertyType,
}: PropertyStatsProps) {
  return (
    <div className="flex items-center gap-6 py-4 px-6 bg-gray-50 dark:bg-gray-800 rounded-xl mb-6">
      {bedrooms > 0 && <StatItem icon={faBed} value={bedrooms} label="Beds" />}
      {bathrooms > 0 && <StatItem icon={faBath} value={bathrooms} label="Baths" />}
      {carSpaces > 0 && <StatItem icon={faCar} value={carSpaces} label="Cars" />}
      {landSize > 0 && <StatItem icon={faRulerCombined} value={`${landSize}m²`} label="Land" />}
      <div className="ml-auto">
        <span className="px-3 py-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300">
          {propertyType}
        </span>
      </div>
    </div>
  );
}
