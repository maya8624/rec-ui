import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import type { RightPanelData } from '../../types/chat';
import { PropertyResultCard } from './PropertyResultCard';

interface Props {
  data: RightPanelData;
  onDismiss: () => void;
}

export const RightPanel = ({ data, onDismiss }: Props) => (
  <aside className="w-80 xl:w-96 shrink-0 flex flex-col border-l border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
    <header className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0">
      <h2 className="text-sm font-semibold text-gray-800 dark:text-white truncate">
        {data.title}
      </h2>
      <button
        onClick={onDismiss}
        aria-label="Close panel"
        className="ml-2 shrink-0 w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-none bg-transparent cursor-pointer"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </header>

    <div className="flex-1 overflow-y-auto p-3 space-y-3">
      {data.type === 'properties' &&
        data.properties?.map((property) => (
          <PropertyResultCard key={property.id} property={property} />
        ))}
    </div>

    {data.type === 'properties' && (
      <footer className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shrink-0">
        <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
          {data.properties?.length ?? 0} properties · click any to view details
        </p>
      </footer>
    )}
  </aside>
);
