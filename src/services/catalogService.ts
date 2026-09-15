import { fetchApi } from './apiClient';
import { ServiceItem } from '../types';
import { SERVICES_DATA } from '../data/content';

export interface ServiceDto {
  id: number;
  code: string;
  title: string;
  tagline?: string;
  description?: string;
  availableDurationsMin: number[];
  basePrice: number;
  badge?: string;
  icon?: string;
  imageUrl?: string;
  displayOrder: number;
}

export interface CalgaryQuadrantDto {
  id: number;
  code: string;
  name: string;
  displayOrder: number;
}

export interface PressureLevelDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  displayOrder: number;
}

export interface AromatherapyOptionDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  extraCharge: number;
  displayOrder: number;
}

export interface FocusAreaDto {
  id: number;
  code: string;
  name: string;
  description?: string;
  displayOrder: number;
}

export interface AppointmentStatusDto {
  id: number;
  code: string;
  name: string;
  colorHex?: string;
  description?: string;
}

export interface AllCatalogsDto {
  quadrants: CalgaryQuadrantDto[];
  pressureLevels: PressureLevelDto[];
  aromatherapyOptions: AromatherapyOptionDto[];
  focusAreas: FocusAreaDto[];
  services: ServiceDto[];
  statuses: AppointmentStatusDto[];
}

export const FALLBACK_QUADRANTS: CalgaryQuadrantDto[] = [
  { id: 1, code: 'NW', name: 'Northwest (NW)', displayOrder: 1 },
  { id: 2, code: 'SW', name: 'Southwest (SW)', displayOrder: 2 },
  { id: 3, code: 'SE', name: 'Southeast (SE)', displayOrder: 3 },
  { id: 4, code: 'NE', name: 'Northeast (NE)', displayOrder: 4 },
  { id: 5, code: 'DOWNTOWN', name: 'Downtown / Beltline', displayOrder: 5 },
  { id: 6, code: 'SURROUNDING', name: 'Surrounding Calgary Area', displayOrder: 6 },
];

export const FALLBACK_PRESSURE_LEVELS: PressureLevelDto[] = [
  { id: 1, code: 'LIGHT', name: 'Light & Gentle', description: 'Gentle, soothing touch for surface relaxation and stress relief', displayOrder: 1 },
  { id: 2, code: 'MEDIUM', name: 'Medium (Balanced)', description: 'Harmonious balance between muscular relief and relaxation', displayOrder: 2 },
  { id: 3, code: 'FIRM', name: 'Firm (Therapeutic)', description: 'Firm, targeted pressure designed to release stubborn tension knots', displayOrder: 3 },
  { id: 4, code: 'DEEP_TISSUE', name: 'Deep Tissue (Intense)', description: 'Deep, sustained pressure on inner muscle layers and connective fascia', displayOrder: 4 },
];

export const FALLBACK_AROMATHERAPIES: AromatherapyOptionDto[] = [
  { id: 1, code: 'UNSCENTED', name: 'Unscented (Fragrance-Free)', description: 'Pure organic hypoallergenic carrier oil without fragrances', extraCharge: 0, displayOrder: 1 },
  { id: 2, code: 'EUCALYPTUS', name: 'Nordic Eucalyptus & Pine', description: 'Clears respiratory airways, refreshes and revitalizes energy', extraCharge: 0, displayOrder: 2 },
  { id: 3, code: 'LAVENDER', name: 'French Lavender Serenity', description: 'Promotes deep nervous system relaxation and restorative sleep', extraCharge: 0, displayOrder: 3 },
  { id: 4, code: 'PEPPERMINT', name: 'Reviving Peppermint', description: 'Relieves tension headaches and stimulates muscular recovery', extraCharge: 0, displayOrder: 4 },
  { id: 5, code: 'SWEET_ORANGE', name: 'Calgary Sunshine Sweet Orange', description: 'Elevates mood and dissolves daily emotional stress', extraCharge: 0, displayOrder: 5 },
];

export const FALLBACK_FOCUS_AREAS: FocusAreaDto[] = [
  { id: 1, code: 'NECK', name: 'Neck & Cervical', description: 'Cervical tension and cranial base tightness', displayOrder: 1 },
  { id: 2, code: 'SHOULDERS', name: 'Shoulders & Trapezius', description: 'Postural fatigue, trapezius knots and desk strain', displayOrder: 2 },
  { id: 3, code: 'UPPER_BACK', name: 'Upper & Mid Back', description: 'Rhomboids, thoracic spine and shoulder blades', displayOrder: 3 },
  { id: 4, code: 'LOWER_BACK', name: 'Lower Back (Lumbar)', description: 'Lumbar pain, sciatic nerve relief and stiffness', displayOrder: 4 },
  { id: 5, code: 'ARMS_HANDS', name: 'Arms & Hands', description: 'Keyboard repetitive strain and forearm tightness', displayOrder: 5 },
  { id: 6, code: 'HIPS_GLUTES', name: 'Hips & Glutes', description: 'Pelvic imbalance and sitting-induced tightness', displayOrder: 6 },
  { id: 7, code: 'LEGS_FEET', name: 'Legs, Calves & Feet', description: 'Tired legs, calf cramps and plantar fascia', displayOrder: 7 },
  { id: 8, code: 'FULL_BODY', name: 'Full Body Relaxation', description: 'Comprehensive, holistic body-wide relaxation', displayOrder: 8 },
];

export function mapServiceDtoToItem(dto: ServiceDto): ServiceItem {
  const codeToIdMap: Record<string, string> = {
    'THERAPEUTIC_SWEDISH': 'swedish-relaxation',
    'DEEP_TISSUE': 'deep-tissue',
    'HOT_STONE': 'hot-stone',
    'PRENATAL': 'prenatal-massage',
    'AROMATHERAPY': 'aromatherapy-bliss',
    'TRIGGER_POINT': 'trigger-point',
  };

  const id = codeToIdMap[dto.code] || dto.code.toLowerCase().replace(/_/g, '-');

  return {
    id,
    numericId: dto.id,
    title: dto.title,
    tagline: dto.tagline || '',
    description: dto.description || '',
    durations: dto.availableDurationsMin && dto.availableDurationsMin.length > 0
      ? dto.availableDurationsMin.map(m => `${m} min`)
      : ['60 min', '90 min'],
    pricing: `From $${Math.round(dto.basePrice)}`,
    badge: dto.badge || undefined,
    icon: dto.icon || 'Sparkles',
    image: dto.imageUrl || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2400&q=85',
  };
}

/**
 * Fetches services from the Azure SQL backend API.
 * Gracefully falls back to static content if API is unavailable.
 */
export async function getServices(): Promise<ServiceItem[]> {
  try {
    const dtos = await fetchApi<ServiceDto[]>('services');
    if (dtos && dtos.length > 0) {
      return dtos.map(mapServiceDtoToItem);
    }
  } catch (err) {
    console.warn('[CatalogService] Could not fetch live services from API, falling back to static cache:', err);
  }
  return SERVICES_DATA;
}

/**
 * Fetches all catalogs from the Azure SQL backend API.
 */
export async function getAllCatalogs(): Promise<AllCatalogsDto> {
  try {
    const data = await fetchApi<AllCatalogsDto>('catalogs');
    if (data) {
      return data;
    }
  } catch (err) {
    console.warn('[CatalogService] Could not fetch all catalogs from API, using defaults:', err);
  }

  return {
    quadrants: FALLBACK_QUADRANTS,
    pressureLevels: FALLBACK_PRESSURE_LEVELS,
    aromatherapyOptions: FALLBACK_AROMATHERAPIES,
    focusAreas: FALLBACK_FOCUS_AREAS,
    services: [],
    statuses: [],
  };
}

/**
 * Fetches Calgary Quadrants from the Azure SQL backend API.
 */
export async function getQuadrants(): Promise<CalgaryQuadrantDto[]> {
  try {
    const data = await fetchApi<CalgaryQuadrantDto[]>('catalogs/quadrants');
    if (data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('[CatalogService] Could not fetch quadrants from API, using fallback:', err);
  }
  return FALLBACK_QUADRANTS;
}
