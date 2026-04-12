import { properties } from '../data/properties';
import type { PropertyPanelData } from '../types/chat';
import type { Property } from '../types/property';

const PROPERTY_INTENT_KEYWORDS = [
  'show', 'list', 'find', 'search', 'browse',
  'properties', 'houses', 'apartments', 'townhouses', 'listings',
  'available', 'for sale', 'buying', 'purchase',
];

const PROPERTY_TYPE_MAP: Record<string, Property['propertyType']> = {
  house:      'House',
  houses:     'House',
  home:       'House',
  homes:      'House',
  apartment:  'Apartment',
  apartments: 'Apartment',
  unit:       'Apartment',
  units:      'Apartment',
  townhouse:  'Townhouse',
  townhouses: 'Townhouse',
  villa:      'Villa',
  villas:     'Villa',
  land:       'Land',
};

const MAX_PANEL_RESULTS = 6;

/**
 * Infers whether a user message implies a property-search intent and, if so,
 * returns a populated RightPanelData payload from the local mock dataset.
 *
 * This is a client-side fallback: if the backend already returns `panelData`
 * on the ChatResponse, that takes precedence over this function.
 */
export function detectPanelData(userMessage: string): PropertyPanelData | null {
  const lower = userMessage.toLowerCase();

  const hasIntent = PROPERTY_INTENT_KEYWORDS.some((kw) => lower.includes(kw));
  if (!hasIntent) return null;

  const matchedKey = Object.keys(PROPERTY_TYPE_MAP).find((k) => lower.includes(k));
  const propertyType = matchedKey ? PROPERTY_TYPE_MAP[matchedKey] : undefined;

  const filtered = propertyType
    ? properties.filter((p) => p.propertyType === propertyType)
    : properties;

  return {
    type: 'properties' as const,
    title: propertyType ? `${propertyType}s for Sale` : 'Properties for Sale',
    properties: filtered.slice(0, MAX_PANEL_RESULTS),
  };
}
