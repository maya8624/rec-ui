import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

export default function DepositSuccessPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <FontAwesomeIcon
        icon={faCircleCheck}
        className="text-5xl text-green-500 mb-5"
      />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Deposit Paid
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">
        Your deposit has been received. You'll get a confirmation email shortly.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-sm text-red-600 hover:underline no-underline"
      >
        <FontAwesomeIcon icon={faArrowLeft} />
        Back to listings
      </Link>
    </div>
  );
}
