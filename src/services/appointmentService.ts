import { fetchApi } from './apiClient';

export interface CreateAppointmentRequest {
  serviceId: number;
  durationMinutes: number;
  scheduledAt: string; // ISO 8601 string e.g. "2026-09-15T10:00:00Z"
  quadrantCode: string;
  serviceAddress: string;
  postalCode?: string;
  clientSpecialNotes?: string;
  clientName?: string;
  clientEmail?: string;
  clientPhone?: string;
}

export interface AppointmentDto {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  serviceId: number;
  serviceTitle: string;
  therapistName: string;
  statusId: number;
  statusCode: string;
  statusName: string;
  statusColorHex?: string;
  quadrantCode: string;
  quadrantName: string;
  durationMinutes: number;
  price: number;
  scheduledAt: string;
  bufferMinutes: number;
  serviceAddress: string;
  postalCode?: string;
  clientSpecialNotes?: string;
  therapistClinicalNotes?: string;
  createdAt: string;
}

export interface TimeSlotDto {
  time: string; // "09:00:00"
  formattedTime: string; // "9:00 AM"
  isAvailable: boolean;
  reasonUnavailable?: string;
}

export interface DayAvailabilityDto {
  date: string;
  isWorkingDay: boolean;
  slots: TimeSlotDto[];
}

/**
 * Checks therapist availability for a specific day and treatment duration.
 */
export async function getAvailability(date: string, durationMinutes = 60): Promise<DayAvailabilityDto> {
  try {
    const data = await fetchApi<DayAvailabilityDto>(
      `appointments/availability?date=${encodeURIComponent(date)}&duration=${durationMinutes}`
    );
    return data;
  } catch (err) {
    console.warn('[AppointmentService] Could not fetch real-time availability from API, returning default schedule:', err);
    // Graceful fallback for offline / mock usage
    return generateFallbackSlots(date);
  }
}

/**
 * Creates an appointment in Azure SQL database.
 */
export async function createAppointment(request: CreateAppointmentRequest): Promise<AppointmentDto> {
  return await fetchApi<AppointmentDto>('appointments', {
    method: 'POST',
    body: JSON.stringify(request),
  });
}

/**
 * Fetches appointments for the authenticated client.
 */
export async function getMyAppointments(): Promise<AppointmentDto[]> {
  return await fetchApi<AppointmentDto[]>('appointments/my-bookings');
}

export interface UpdateAppointmentRequest {
  serviceId?: number;
  durationMinutes?: number;
  scheduledAt?: string;
  quadrantCode?: string;
  serviceAddress?: string;
  postalCode?: string;
  clientSpecialNotes?: string;
}

/**
 * Updates or reschedules an appointment in Azure SQL database.
 */
export async function updateAppointment(id: string, request: UpdateAppointmentRequest): Promise<AppointmentDto> {
  return await fetchApi<AppointmentDto>(`appointments/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });
}

/**
 * Cancels an appointment.
 */
export async function cancelAppointment(id: string): Promise<AppointmentDto> {
  return await fetchApi<AppointmentDto>(`appointments/${id}/cancel`, {
    method: 'PUT',
  });
}

/**
 * Generates standard daytime slots (9:00 AM to 7:00 PM) as a fallback if API is unavailable.
 */
function generateFallbackSlots(date: string): DayAvailabilityDto {
  const defaultHours = [
    { time: '09:00:00', formattedTime: '9:00 AM' },
    { time: '10:30:00', formattedTime: '10:30 AM' },
    { time: '12:00:00', formattedTime: '12:00 PM' },
    { time: '14:00:00', formattedTime: '2:00 PM' },
    { time: '15:30:00', formattedTime: '3:30 PM' },
    { time: '17:00:00', formattedTime: '5:00 PM' },
    { time: '18:30:00', formattedTime: '6:30 PM' },
  ];

  return {
    date,
    isWorkingDay: true,
    slots: defaultHours.map((slot) => ({
      time: slot.time,
      formattedTime: slot.formattedTime,
      isAvailable: true,
    })),
  };
}
