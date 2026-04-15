import { useRef } from 'react';
import { useMutation } from '@tanstack/react-query';
import { createCheckoutSession } from '../api/depositApi';
import { extractErrorMessage } from '../utils/errorUtils';
import type { DepositRequest } from '../types/deposit';

type CheckoutPayload = Omit<DepositRequest, 'idempotencyKey'>;

interface UseDepositReturn {
  checkout: (payload: CheckoutPayload) => Promise<void>;
  isPending: boolean;
  error: string | null;
}

export function useDeposit(): UseDepositReturn {
  // Generated once per panel mount — retries within the same panel reuse the same key.
  const idempotencyKey = useRef(crypto.randomUUID());

  const { mutateAsync, isPending, error: mutationError } = useMutation({
    mutationFn: (req: DepositRequest) => createCheckoutSession(req),
    onSuccess: (data) => {
      window.location.href = data.sessionUrl;
    },
  });

  const checkout = async (payload: CheckoutPayload): Promise<void> => {
    await mutateAsync({ ...payload, idempotencyKey: idempotencyKey.current });
  };

  const error = mutationError
    ? extractErrorMessage(mutationError, 'Payment could not be initiated. Please try again.')
    : null;

  return { checkout, isPending, error };
}
