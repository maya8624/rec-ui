import type { Property, WorkflowStep, CopilotMessage } from '../../types/copilot'

export const properties: Property[] = [
  { id: '1', address: '12 Campbell Parade', suburb: 'Bondi Beach', state: 'NSW', postcode: '2026', price: 920, beds: 3, baths: 2, cars: 1, sqm: 95, tags: ['Pet friendly', 'Ocean views', 'Parking'], agent: 'S. Evans', agentInitials: 'SE', badge: 'Best match', featured: true, image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&h=280&fit=crop&auto=format' },
  { id: '2', address: '4/8 Roscoe Street', suburb: 'Bondi', state: 'NSW', postcode: '2026', price: 850, beds: 2, baths: 2, cars: 0, sqm: 80, tags: ['Pet friendly', 'Balcony'], agent: 'S. Evans', agentInitials: 'SE', badge: 'Popular', image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=280&fit=crop&auto=format' },
  { id: '3', address: '8/42 Crown Street', suburb: 'Surry Hills', state: 'NSW', postcode: '2010', price: 750, beds: 2, baths: 1, cars: 0, sqm: 72, tags: ['Pet friendly', 'Natural light'], agent: 'M. Lee', agentInitials: 'ML', badge: 'Available now', image: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=280&fit=crop&auto=format' },
  { id: '4', address: '5 Australia Street', suburb: 'Newtown', state: 'NSW', postcode: '2042', price: 680, beds: 2, baths: 1, cars: 0, sqm: 65, tags: ['Pet friendly', 'Courtyard'], agent: 'T. Russo', agentInitials: 'TR', badge: 'Available now', image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=280&fit=crop&auto=format' },
]

export const initialMessages: CopilotMessage[] = [
  { id: '1', role: 'user', text: 'Find pet friendly 2-bed in Bondi under $950' },
  { id: '2', role: 'ai', text: 'Found 3 properties in Bondi and Surry Hills. Campbell Parade is the strongest match — 3 bed, ocean views, $920/wk. Results are showing in the grid.' },
  { id: '3', role: 'user', text: "What's the average rent in Bondi?" },
  { id: '4', role: 'ai', text: 'Median 2-bed in Bondi is $820/wk as of last month. Both Bondi listings you can see are at or below median — good value for the area.' },
]

export const workflowSteps: WorkflowStep[] = [
  { status: 'done', label: 'Intent classified', detail: 'property_search · 12ms' },
  { status: 'done', label: 'SQL search', detail: '18ms · 12 rows returned' },
  { status: 'done', label: 'pgvector matched', detail: 'agency docs' },
  { status: 'done', label: 'Filtered to 3', detail: 'budget + suburb criteria' },
  { status: 'pending', label: 'Awaiting selection', detail: 'user to proceed' },
]

export const suggestedSteps: string[] = [
  'Book inspection for 12 Campbell Pde',
  'View Harbour Realty agency profile',
  'Start deposit payment',
]

export const actionResponses: Record<string, string> = {
  'Find matching properties': 'Searching for properties matching your saved criteria across Bondi, Surry Hills and Newtown. Found 4 listings within budget.',
  'Suburb summary': 'Bondi Beach median rent is $820/wk for 2-bed, up 3.2% this quarter. Vacancy rate is 1.8% — low supply, move fast if you find something you like.',
  'Book inspection': 'Which property would you like to inspect? I can see availability for Campbell Parade this Saturday at 10am or 11:30am.',
  'Pay deposit': "To pay your holding deposit for 12 Campbell Parade, I'll need to confirm your identity first. Ready to proceed?",
  'View tenancy docs': 'Here are the tenancy documents for 12 Campbell Parade: Standard Residential Tenancy Agreement (NSW), Property Condition Report, and Harbour Realty Agency Disclosure.',
}

export async function streamMessage(
  text: string,
  onChunk: (chunk: string) => void,
  onDone: () => void
): Promise<void> {
  for (const word of text.split(' ')) {
    await new Promise(r => setTimeout(r, 35))
    onChunk(word + ' ')
  }
  onDone()
}
