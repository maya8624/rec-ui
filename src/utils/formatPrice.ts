import type { Property } from '../types/property';

export const formatPrice = (property: Pick<Property, 'priceValue' | 'auctionDate'>): string =>
  property.auctionDate ? 'Auction' : `$${property.priceValue.toLocaleString('en-AU')}`;
