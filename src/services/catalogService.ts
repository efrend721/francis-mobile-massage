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

export function mapServiceDtoToItem(dto: ServiceDto): ServiceItem {
  // Map code e.g. "THERAPEUTIC_SWEDISH" to "swedish-relaxation" if matching, or slugify
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
