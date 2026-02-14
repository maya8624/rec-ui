import type { Property } from '../types/property';

const suburbs = [
  { name: 'Richmond', state: 'VIC', postcode: '3121' },
  { name: 'Bondi', state: 'NSW', postcode: '2026' },
  { name: 'South Yarra', state: 'VIC', postcode: '3141' },
  { name: 'Paddington', state: 'NSW', postcode: '2021' },
  { name: 'Toorak', state: 'VIC', postcode: '3142' },
  { name: 'Surry Hills', state: 'NSW', postcode: '2010' },
  { name: 'Carlton', state: 'VIC', postcode: '3053' },
  { name: 'Manly', state: 'NSW', postcode: '2095' },
  { name: 'St Kilda', state: 'VIC', postcode: '3182' },
  { name: 'Newtown', state: 'NSW', postcode: '2042' },
  { name: 'Fitzroy', state: 'VIC', postcode: '3065' },
  { name: 'Mosman', state: 'NSW', postcode: '2088' },
  { name: 'Brunswick', state: 'VIC', postcode: '3056' },
  { name: 'Coogee', state: 'NSW', postcode: '2034' },
  { name: 'Hawthorn', state: 'VIC', postcode: '3122' },
  { name: 'Neutral Bay', state: 'NSW', postcode: '2089' },
  { name: 'Prahran', state: 'VIC', postcode: '3181' },
  { name: 'Balmain', state: 'NSW', postcode: '2041' },
  { name: 'Collingwood', state: 'VIC', postcode: '3066' },
  { name: 'Darlinghurst', state: 'NSW', postcode: '2010' },
];

const streetNames = [
  'Church', 'Bridge', 'Swan', 'Victoria', 'Albert', 'George', 'Queen',
  'King', 'Park', 'High', 'Station', 'Chapel', 'William', 'Elizabeth',
  'Oxford', 'Collins', 'Bourke', 'Flinders', 'Lonsdale', 'Spring',
];

const streetTypes = ['Street', 'Road', 'Avenue', 'Drive', 'Lane', 'Crescent', 'Place', 'Court'];

const propertyTypes: Property['propertyType'][] = ['House', 'Apartment', 'Townhouse', 'Villa', 'Land'];

const agentFirstNames = ['James', 'Sarah', 'Michael', 'Emma', 'David', 'Olivia', 'Daniel', 'Sophie', 'Andrew', 'Jessica'];
const agentLastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Wilson', 'Taylor', 'Anderson', 'Thomas', 'Martin'];
const agencies = [
  'Ray White', 'McGrath', 'LJ Hooker', 'Belle Property', 'Jellis Craig',
  'Marshall White', 'Buxton', 'Harcourts', 'Raine & Horne', 'Barry Plant',
];

const features = [
  'Air Conditioning', 'Heating', 'Dishwasher', 'Built-in Wardrobes',
  'Floorboards', 'Gas', 'Gym', 'Swimming Pool', 'Balcony', 'Courtyard',
  'Garage', 'Garden', 'Laundry', 'Alarm System', 'Intercom',
  'Fireplace', 'Study', 'Solar Panels', 'Water Tank', 'Ensuite',
];

// Real house images from Unsplash (using specific photo IDs for consistency)
const houseImages = [
  'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1602343168117-bb8bbe693ce3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687644-aac4c3eac7f4?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585153490-76fb20a32601?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&h=600&fit=crop',
];

const interiorImages = [
  'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=600&fit=crop',
];

// Real land / vacant lot images from Unsplash
const landImages = [
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1473773508845-188df298d2d1?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1440342359743-84fcb8c21f21?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1416339306562-f3d12fefd36f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1518173946687-a1e4e1b3f2be?w=800&h=600&fit=crop',
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateProperties(): Property[] {
  const properties: Property[] = [];
  const rand = seededRandom(42);

  for (let i = 1; i <= 100; i++) {
    const suburb = suburbs[Math.floor(rand() * suburbs.length)];
    const streetNumber = Math.floor(rand() * 200) + 1;
    const streetName = streetNames[Math.floor(rand() * streetNames.length)];
    const streetType = streetTypes[Math.floor(rand() * streetTypes.length)];
    const type = propertyTypes[Math.floor(rand() * propertyTypes.length)];

    const bedrooms = type === 'Land' ? 0 : Math.floor(rand() * 5) + 1;
    const bathrooms = type === 'Land' ? 0 : Math.floor(rand() * Math.min(bedrooms + 1, 4)) + 1;
    const parking = type === 'Land' ? 0 : Math.floor(rand() * 3) + 1;
    const landSize = type === 'Apartment' ? 0 : Math.floor(rand() * 800) + 150;

    const basePrice = type === 'House' ? 800000 : type === 'Apartment' ? 400000 : type === 'Townhouse' ? 600000 : type === 'Villa' ? 700000 : 300000;
    const priceValue = Math.round((basePrice + rand() * 1500000) / 10000) * 10000;
    const hasAuction = rand() > 0.5;
    const isGuide = rand() > 0.4;

    const price = hasAuction && !isGuide
      ? 'Auction'
      : isGuide
        ? `$${(priceValue / 1000000).toFixed(1)}m - $${((priceValue + 200000) / 1000000).toFixed(1)}m`
        : `$${priceValue.toLocaleString()}`;

    const agentFirst = agentFirstNames[Math.floor(rand() * agentFirstNames.length)];
    const agentLast = agentLastNames[Math.floor(rand() * agentLastNames.length)];
    const agency = agencies[Math.floor(rand() * agencies.length)];

    const numFeatures = Math.floor(rand() * 8) + 3;
    const shuffled = [...features].sort(() => rand() - 0.5);
    const propertyFeatures = shuffled.slice(0, numFeatures);

    const imagePool = type === 'Land' ? landImages : houseImages;
    const mainImage = imagePool[i % imagePool.length];
    const extraImages = type === 'Land'
      ? [
          landImages[(i + 1) % landImages.length],
          landImages[(i + 2) % landImages.length],
          landImages[(i + 3) % landImages.length],
          landImages[(i + 4) % landImages.length],
          landImages[(i + 5) % landImages.length],
        ]
      : [
          houseImages[(i + 3) % houseImages.length],
          houseImages[(i + 7) % houseImages.length],
          interiorImages[i % interiorImages.length],
          interiorImages[(i + 2) % interiorImages.length],
          interiorImages[(i + 4) % interiorImages.length],
        ];

    const auctionDay = hasAuction ? Math.floor(rand() * 28) + 1 : null;
    const auctionMonth = hasAuction ? Math.floor(rand() * 3) + 3 : null;

    const daysAgo = Math.floor(rand() * 30);
    const listedDate = new Date();
    listedDate.setDate(listedDate.getDate() - daysAgo);

    const inspectionCount = Math.floor(rand() * 3);
    const inspections: string[] = [];
    for (let j = 0; j < inspectionCount; j++) {
      const day = Math.floor(rand() * 14) + 1;
      const hour = Math.floor(rand() * 4) + 10;
      inspections.push(`Sat ${day} Mar, ${hour}:00am - ${hour}:30am`);
    }

    properties.push({
      id: i,
      title: `${bedrooms > 0 ? bedrooms + ' Bedroom ' : ''}${type} in ${suburb.name}`,
      address: `${streetNumber} ${streetName} ${streetType}`,
      suburb: suburb.name,
      state: suburb.state,
      postcode: suburb.postcode,
      price,
      priceValue,
      propertyType: type,
      bedrooms,
      bathrooms,
      parking,
      landSize,
      description: `This stunning ${type.toLowerCase()} is located in the heart of ${suburb.name}. Featuring ${bedrooms} spacious bedrooms, ${bathrooms} modern bathrooms, and ${parking} car spaces. ${landSize > 0 ? `Set on a generous ${landSize}m² block, t` : 'T'}his property offers the perfect blend of comfort and convenience. Walking distance to shops, cafes, public transport and schools. Don't miss this incredible opportunity!`,
      features: propertyFeatures,
      images: [mainImage, ...extraImages],
      agent: {
        name: `${agentFirst} ${agentLast}`,
        phone: `04${Math.floor(rand() * 10)}${Math.floor(rand() * 10)} ${Math.floor(rand() * 10)}${Math.floor(rand() * 10)}${Math.floor(rand() * 10)} ${Math.floor(rand() * 10)}${Math.floor(rand() * 10)}${Math.floor(rand() * 10)}`,
        agency,
        photo: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
      },
      auctionDate: auctionDay && auctionMonth ? `${auctionDay} ${['', '', '', 'March', 'April', 'May'][auctionMonth]} 2026` : null,
      isNew: daysAgo < 3,
      isFeatured: rand() > 0.85,
      inspectionTimes: inspections,
      listedDate: listedDate.toISOString().split('T')[0],
    });
  }

  return properties;
}

export const properties = generateProperties();
