export interface Property {
  id: number;
  listingId?: string;
  title: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
  price: string;
  priceValue: number;
  propertyType: 'House' | 'Apartment' | 'Townhouse' | 'Villa' | 'Land';
  bedrooms: number;
  bathrooms: number;
  parking: number;
  landSize: number;
  description: string;
  features: string[];
  images: string[];
  agent: {
    name: string;
    phone: string;
    agency: string;
    photo: string;
  };
  auctionDate: string | null;
  isNew: boolean;
  isFeatured: boolean;
  inspectionTimes: string[];
  listedDate: string;
}

export interface PropertiesResponse {
  properties: Property[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
