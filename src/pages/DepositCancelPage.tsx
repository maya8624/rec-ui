import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faArrowLeft, faRotateLeft } from '@fortawesome/free-solid-svg-icons';

export default function DepositCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <FontAwesomeIcon
        icon={faCircleXmark}
        className="text-5xl text-gray-400 dark:text-gray-500 mb-5"
      />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Payment Cancelled
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
        Your deposit payment was not completed. No charges have been made.
      </p>
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors cursor-pointer border-none"
        >
          <FontAwesomeIcon icon={faRotateLeft} />
          Try Again
        </button>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-red-600 no-underline"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to listings
        </Link>
      </div>
    </div>
  );
}
