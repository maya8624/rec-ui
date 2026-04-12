import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faHouse } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

interface Props {
  onNewChat: () => void;
}

// Placeholder items give the sidebar an authentic feel without real persistence
const PLACEHOLDER_HISTORY: string[] = [
  'Show me apartments in Bondi',
  'How does stamp duty work?',
  'Find houses under $1.5M',
  'What is the buying process?',
  'Townhouses in South Yarra',
];

export const Sidebar = ({ onNewChat }: Props) => (
  <aside className="w-56 xl:w-64 shrink-0 flex flex-col bg-gray-900 text-white overflow-hidden">
    {/* Brand + New Chat */}
    <div className="px-3 py-4 space-y-2 border-b border-gray-700/50">
      <Link
        to="/"
        className="flex items-center gap-2 px-2 py-1.5 text-red-400 hover:text-red-300 no-underline transition-colors"
      >
        <FontAwesomeIcon icon={faHouse} className="text-sm" />
        <span className="text-sm font-bold tracking-tight">RealEstateHub</span>
      </Link>

      <button
        onClick={onNewChat}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-600 text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors bg-transparent cursor-pointer"
      >
        <span>New chat</span>
        <FontAwesomeIcon icon={faPenToSquare} className="text-gray-500 text-xs" />
      </button>
    </div>

    {/* Recent conversations */}
    <div className="flex-1 overflow-y-auto px-2 py-3">
      <p className="text-[10px] uppercase tracking-widest text-gray-500 px-2 mb-2 font-medium">
        Recent
      </p>
      <ul className="space-y-0.5">
        {PLACEHOLDER_HISTORY.map((label) => (
          <li key={label}>
            <button className="w-full text-left text-xs text-gray-400 hover:text-white hover:bg-gray-800 px-2 py-2 rounded-lg transition-colors truncate bg-transparent border-none cursor-pointer">
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  </aside>
);
