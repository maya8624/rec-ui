import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSpinner,
  faCreditCard,
  faTriangleExclamation,
  faHouse,
} from '@fortawesome/free-solid-svg-icons';
import type { DepositPanelData } from '../../types/copilot';
import { useDeposit } from '../../hooks/useDeposit';

interface Props {
  data: DepositPanelData;
}

const DEPOSIT_PERCENT = 0.1;

export const DepositPanel = ({ data }: Props) => {
  const { checkout, isPending, error } = useDeposit();
  const [amount, setAmount] = useState<string>(
    data.suggestedAmount != null
      ? String(Math.round(data.suggestedAmount * DEPOSIT_PERCENT))
      : '',
  );

  const hasPropertyContext = data.propertyId != null && data.listingId != null;
  const parsedAmount = parseFloat(amount);
  const isValidAmount = !isNaN(parsedAmount) && parsedAmount > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPropertyContext || !isValidAmount) return;
    await checkout({
      propertyId: data.propertyId!,
      listingId: data.listingId!,
      amount: parsedAmount,
    });
  };

  if (!hasPropertyContext) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center gap-4">
        <FontAwesomeIcon
          icon={faHouse}
          className="text-3xl text-gray-300 dark:text-gray-600"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          To pay a deposit, please tell me which property you're interested in
          and I'll pull up the details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-4">
      {/* Property summary */}
      <div className="rounded-lg bg-white dark:bg-[#1C1917] border border-gray-200 dark:border-gray-700 p-4">
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-1">
          Property
        </p>
        <p className="text-sm font-medium text-gray-800 dark:text-white leading-snug">
          {data.propertyTitle ?? 'Selected property'}
        </p>
      </div>

      {/* Amount input */}
      <div>
        <label
          htmlFor="deposit-amount"
          className="block text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5"
        >
          Deposit Amount (AUD)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm select-none">
            $
          </span>
          <input
            id="deposit-amount"
            type="number"
            min="1"
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            disabled={isPending}
            placeholder="0.00"
            className="w-full pl-7 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1C1917] text-gray-800 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent disabled:opacity-50"
          />
        </div>
        {data.suggestedAmount != null && (
          <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
            Suggested: ${Math.round(data.suggestedAmount * DEPOSIT_PERCENT).toLocaleString()} (10% of listing price)
          </p>
        )}
      </div>

      {/* Inline error */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-3 py-2.5 text-xs text-red-600 dark:text-red-400">
          <FontAwesomeIcon icon={faTriangleExclamation} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending || !isValidAmount}
        className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors cursor-pointer border-none"
      >
        {isPending ? (
          <>
            <FontAwesomeIcon icon={faSpinner} className="animate-spin" />
            Redirecting to Stripe...
          </>
        ) : (
          <>
            <FontAwesomeIcon icon={faCreditCard} />
            Proceed to Payment
          </>
        )}
      </button>

      <p className="text-center text-xs text-gray-400 dark:text-gray-500">
        You'll be redirected to Stripe to complete your payment securely.
      </p>
    </form>
  );
};

