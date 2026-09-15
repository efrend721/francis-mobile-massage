import { fetchApi } from './apiClient';

export interface IntakeFocusAreaRequest {
  focusAreaId: number;
  painLevel?: number;
}

export interface IntakeFocusAreaDto {
  focusAreaId: number;
  focusAreaCode: string;
  focusAreaName: string;
  painLevel?: number;
}

export interface SaveIntakeFormRequest {
  pressureLevelId: number;
  aromatherapyId: number;
  isFirstVisit: boolean;
  hasHighBloodPressure: boolean;
  isPregnant: boolean;
  pregnancyWeeks?: string;
  hasRecentSurgeriesOrInjuries: boolean;
  surgeriesDetails?: string;
  hasAllergiesToOilsOrNuts: boolean;
  allergiesDetails?: string;
  otherHealthNotes?: string;
  pipaConsentAccepted: boolean;
  cancellationPolicyAccepted: boolean;
  signatureName: string;
  focusAreas: IntakeFocusAreaRequest[];
  fullName?: string;
  email?: string;
  phone?: string;
  quadrantCode?: string;
}

export interface IntakeFormDto {
  id: string;
  clientId: string;
  clientName: string;
  pressureLevelId: number;
  pressureLevelName: string;
  aromatherapyId: number;
  aromatherapyName: string;
  isFirstVisit: boolean;
  hasHighBloodPressure: boolean;
  isPregnant: boolean;
  pregnancyWeeks?: string;
  hasRecentSurgeriesOrInjuries: boolean;
  surgeriesDetails?: string;
  hasAllergiesToOilsOrNuts: boolean;
  allergiesDetails?: string;
  otherHealthNotes?: string;
  pipaConsentAccepted: boolean;
  cancellationPolicyAccepted: boolean;
  signatureName: string;
  completedAt: string;
  focusAreas: IntakeFocusAreaDto[];
}

/**
 * Submits and saves a clinical intake form to Azure SQL database.
 */
export async function saveIntakeForm(request: SaveIntakeFormRequest): Promise<IntakeFormDto> {
  return await fetchApi<IntakeFormDto>('intakeforms', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Fetches the latest submitted intake form for the authenticated client.
 */
export async function getMyLatestIntake(): Promise<IntakeFormDto | null> {
  try {
    return await fetchApi<IntakeFormDto>('intakeforms/my-intake');
  } catch (err) {
    console.warn('[IntakeService] No existing intake form or unauthenticated:', err);
    return null;
  }
}
