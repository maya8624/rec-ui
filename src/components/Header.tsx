import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faMagnifyingGlass, faMoon, faSun, faRobot, faUser } from '@fortawesome/free-solid-svg-icons';
import { useTheme } from '../hooks/useTheme';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { useLogout } from '../hooks/useLogout';

export default function Header() {
  const { isDark, toggle } = useTheme();
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const username = user?.firstName ?? user?.email.split("@")[0];

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-gray-900 dark:text-white font-bold text-xl no-underline">
            <FontAwesomeIcon icon={faHouse} />
            <span>Harbour</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search suburb, postcode, or address..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <nav className="flex items-center gap-6">
            <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-red-600 text-sm font-medium no-underline">
              Buy
            </Link>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-red-600 text-sm font-medium no-underline">
              Rent
            </a>
            <a href="#" className="text-gray-600 dark:text-gray-300 hover:text-red-600 text-sm font-medium no-underline">
              Sold
            </a>
            <Link
              to="/assistant"
              className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 hover:text-red-600 text-sm font-medium no-underline"
            >
              <FontAwesomeIcon icon={faRobot} className="text-xs" />
              AI Assistant
            </Link>
            {user && username && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                  <FontAwesomeIcon icon={faUser} className="text-xs" />
                  <span>{username}</span>
                </div>
                <button
                  onClick={() => logout()}
                  className="text-xs text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer border-none bg-transparent"
                >
                  Sign out
                </button>
              </div>
            )}
            <button
              onClick={toggle}
              className="w-9 h-9 flex items-center justify-center rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer border-none bg-transparent"
              aria-label="Toggle dark mode"
            >
              <FontAwesomeIcon icon={isDark ? faSun : faMoon} />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
