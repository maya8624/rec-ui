export interface Property {
  id: string;
  title: string;
  address: string;
  suburb: string;
  state: string;
  postcode: string;
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
    photo?: string;
  };
  listingType?: 'Sale' | 'Rent';
  auctionDate: string | null;
  isNew: boolean;
  isFeatured: boolean;
  inspectionTimes: string[];
  listedDate: string;
}

export interface PropertiesResponse {
  items: Property[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
