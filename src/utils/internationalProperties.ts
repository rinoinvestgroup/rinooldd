import { Property } from '../data/properties';

const EXCLUDED_COUNTRIES = new Set([
  'spain',
  'uae',
  'dubai',
  'united arab emirates',
]);

const normalizeCountry = (country?: string | null) => (country || '').trim().toLowerCase();

export const isInternationalProperty = (property: Pick<Property, 'country'>) => {
  const normalizedCountry = normalizeCountry(property.country);
  return !EXCLUDED_COUNTRIES.has(normalizedCountry);
};
