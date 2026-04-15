import { api } from '../services/apiClient';
import { depositRequestSchema } from '../types/deposit';
import type { DepositRequest, DepositResponse } from '../types/deposit';

export const createCheckoutSession = async (payload: DepositRequest): Promise<DepositResponse> => {
  depositRequestSchema.parse(payload);
  const res = await api.post<DepositResponse>('/deposits/checkout', payload);
  return res.data;
};
