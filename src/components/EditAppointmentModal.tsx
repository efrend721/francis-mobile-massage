import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  Calendar,
  Sparkles,
  Loader2,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { AppointmentDto, updateAppointment, getAvailability, TimeSlotDto } from '../services/appointmentService';
import { ServiceItem } from '../types';
import { BUSINESS_INFO } from '../data/content';

interface EditAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: AppointmentDto | null;
  onUpdated: (updated: AppointmentDto) => void;
  services: ServiceItem[];
}

const CANADIAN_POSTAL_CODE_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

function formatPostalCodeInput(value: string): string {
  const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (cleaned.length > 3) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
  }
  return cleaned;
}

function combineDateAndTimeToIso(dateStr: string, timeStr: string): string {
  const targetDateStr = dateStr || new Date().toISOString().split('T')[0];
  let hours = 10;
  let minutes = 0;

  const match = timeStr.match(/^(\d{1,2}):(\d{2})(?:\s*(AM|PM))?$/i);
  if (match) {
    hours = parseInt(match[1], 10);
    minutes = parseInt(match[2], 10);
    const meridiem = match[3]?.toUpperCase();
    if (meridiem === 'PM' && hours < 12) hours += 12;
    if (meridiem === 'AM' && hours === 12) hours = 0;
  }

  const [year, month, day] = targetDateStr.split('-').map(Number);
  const localDate = new Date(year, month - 1, day, hours, minutes, 0);
  return localDate.toISOString();
}

export const EditAppointmentModal: React.FC<EditAppointmentModalProps> = ({
  isOpen,
  onClose,
  appointment,
  onUpdated,
  services,
}) => {
  const [selectedServiceId, setSelectedServiceId] = useState<number>(1);
  const [duration, setDuration] = useState<'60 min' | '75 min' | '90 min'>('60 min');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [address, setAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [specialNotes, setSpecialNotes] = useState('');

  const [availableSlots, setAvailableSlots] = useState<TimeSlotDto[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [postalError, setPostalError] = useState<string | null>(null);
  const [updatedSuccess, setUpdatedSuccess] = useState<AppointmentDto | null>(null);

  // Initialize form with appointment values
  useEffect(() => {
    if (appointment) {
      setSelectedServiceId(appointment.serviceId);
      setDuration(appointment.durationMinutes === 90 ? '90 min' : appointment.durationMinutes === 75 ? '75 min' : '60 min');
      
      const apptDate = new Date(appointment.scheduledAt);
      const dateString = apptDate.toISOString().split('T')[0];
      const timeString = apptDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
      
      setPreferredDate(dateString);
      setPreferredTime(timeString);
      setAddress(appointment.serviceAddress || '');
      setPostalCode(appointment.postalCode || '');
      setSpecialNotes(appointment.clientSpecialNotes || '');
      setUpdatedSuccess(null);
    }
  }, [appointment]);

  // Query slot availability when date or duration changes
  const fetchAvailability = useCallback(async (date: string, durStr: string) => {
    if (!date) return;
    setIsLoadingSlots(true);
    const durationMin = parseInt(durStr, 10) || 60;
    try {
      const res = await getAvailability(date, durationMin);
      setAvailableSlots(res.slots || []);
    } catch {
      // Fallback handled in service
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && preferredDate) {
      fetchAvailability(preferredDate, duration);
    }
  }, [isOpen, preferredDate, duration, fetchAvailability]);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !appointment) return null;

  const resolveQuadrantCode = (): string => {
    const addr = address.toUpperCase();
    if (addr.includes('NW')) return 'NW';
    if (addr.includes('SW')) return 'SW';
    if (addr.includes('SE')) return 'SE';
    if (addr.includes('NE')) return 'NE';
    if (addr.includes('DOWNTOWN')) return 'DOWNTOWN';
    return appointment.quadrantCode || 'NW';
  };

  const handleSave = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;
    const trimmedAddress = address.trim();
    if (!trimmedAddress || trimmedAddress.length < 5) {
      setAddressError('Please enter a valid street address.');
      hasError = true;
    } else {
      setAddressError(null);
    }

    const trimmedPostal = postalCode.trim();
    if (!trimmedPostal || !CANADIAN_POSTAL_CODE_REGEX.test(trimmedPostal)) {
      setPostalError('Please enter a valid format (e.g. T2S 0A1).');
      hasError = true;
    } else {
      setPostalError(null);
    }

    if (hasError) return;

    setIsSubmitting(true);

    const durationMinutes = parseInt(duration, 10) || 60;
    const scheduledAtIso = combineDateAndTimeToIso(preferredDate, preferredTime);
    const quadrantCode = resolveQuadrantCode();

    try {
      const updated = await updateAppointment(appointment.id, {
        serviceId: selectedServiceId,
        durationMinutes,
        scheduledAt: scheduledAtIso,
        quadrantCode,
        serviceAddress: trimmedAddress,
        postalCode: trimmedPostal.toUpperCase(),
        clientSpecialNotes: specialNotes.trim() || undefined,
      });

      setUpdatedSuccess(updated);
      onUpdated(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not update appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNotifyWhatsApp = () => {
    if (!updatedSuccess && !appointment) return;
    const appt = updatedSuccess || appointment;
    const srvTitle = services.find((s) => s.numericId === selectedServiceId)?.title || appt.serviceTitle;

    // Format date nicely (e.g. "Mon, Sep 21, 2026")
    let prettyDate = preferredDate;
    try {
      const [y, m, d] = preferredDate.split('-').map(Number);
      if (y && m && d) {
        const dObj = new Date(y, m - 1, d);
        prettyDate = dObj.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      }
    } catch {
      // fallback
    }

    const postalFormatted = postalCode ? postalCode.trim().toUpperCase() : '';

    const messageLines = [
      '🌿 *FORM WELLNESS — RESCHEDULED APPOINTMENT*',
      '━━━━━━━━━━━━━━━━━━━━━━━━━',
      '📋 *UPDATED SESSION DETAILS*',
      `💆 *Service:* ${srvTitle} (${duration})`,
      `📅 *New Date & Time:* ${prettyDate} at ${preferredTime}`,
      `🏷️ *Ref Code:* #FW-${appt.id.slice(0, 8).toUpperCase()}`,
      '',
      '📍 *CALGARY SERVICE LOCATION*',
      `• *Address:* ${address.trim()}${postalFormatted ? ` (${postalFormatted})` : ''}`,
      specialNotes.trim() ? `• *Notes:* ${specialNotes.trim()}` : '',
      '',
      '━━━━━━━━━━━━━━━━━━━━━━━━━',
      '_Please confirm this updated schedule at your earliest convenience!_',
    ].filter((line) => line !== '');

    const url = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(messageLines.join('\n'))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-appointment-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-nordic-dark/70 backdrop-blur-md overflow-y-auto"
    >
      <div
        className="bg-card-white rounded-2xl sm:rounded-3xl shadow-2xl border border-oak/30 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden relative my-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-linear-to-r from-nordic-mist to-nordic-slate text-white p-4 sm:p-6 shrink-0 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-pearl/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close edit appointment modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-oak-light text-xs font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-4 h-4 text-oak" />
            <span>Modify In-Home Session</span>
          </div>

          <h2 id="edit-appointment-title" className="font-serif text-lg sm:text-2xl font-bold text-white">
            Reschedule & Update Appointment
          </h2>
          <p className="text-pearl/85 text-xs sm:text-sm mt-0.5">
            Booking Ref: <span className="font-mono font-bold">#FW-{appointment.id.slice(0, 8).toUpperCase()}</span>
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-7 overflow-y-auto flex-1">
          {updatedSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-botanical-light text-botanical rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                  Appointment Successfully Updated!
                </h3>
                <p className="text-glacier text-xs sm:text-sm mt-1 max-w-md mx-auto">
                  Your mobile treatment on <strong>{preferredDate}</strong> at <strong>{preferredTime}</strong> is saved in Azure SQL database.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                  type="button"
                  onClick={handleNotifyWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-botanical hover:bg-botanical/90 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Notify Francis on WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto py-3 px-6 rounded-xl border border-gray-300 text-charcoal font-medium text-xs sm:text-sm hover:bg-gray-100 transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form id="edit-appointment-form" onSubmit={handleSave} className="space-y-4">
              {/* Treatment Service */}
              <div>
                <label htmlFor="edit-service-select" className="block text-xs font-semibold text-charcoal mb-1">
                  Treatment Service *
                </label>
                <select
                  id="edit-service-select"
                  name="serviceId"
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist text-xs sm:text-sm text-charcoal cursor-pointer"
                >
                  {services.map((srv) => (
                    <option key={srv.id} value={srv.numericId || 1}>
                      {srv.title} - {srv.pricing}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Buttons */}
              <div>
                <label className="block text-xs font-semibold text-charcoal mb-1.5">
                  Treatment Duration *
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['60 min', '75 min', '90 min'] as const).map((dur) => (
                    <button
                      key={dur}
                      type="button"
                      onClick={() => setDuration(dur)}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                        duration === dur
                          ? 'bg-nordic-mist text-white border-nordic-mist shadow-xs'
                          : 'bg-white text-charcoal border-oak/40 hover:bg-pearl/50'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="edit-date" className="block text-xs font-semibold text-charcoal mb-1">
                    New Date *
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      id="edit-date"
                      name="preferredDate"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist text-xs sm:text-sm text-charcoal cursor-pointer pr-10"
                    />
                    <Calendar className="w-4 h-4 text-botanical absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="edit-time" className="text-xs font-semibold text-charcoal">
                      New Time *
                    </label>
                    {isLoadingSlots && (
                      <span className="text-[10px] text-muted flex items-center gap-1">
                        <Loader2 className="w-2.5 h-2.5 animate-spin text-botanical" /> Checking...
                      </span>
                    )}
                  </div>
                  <select
                    id="edit-time"
                    name="preferredTime"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist text-xs sm:text-sm text-charcoal cursor-pointer font-medium"
                  >
                    {availableSlots && availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <option
                          key={slot.time}
                          value={slot.formattedTime}
                          disabled={!slot.isAvailable}
                        >
                          {slot.formattedTime} {slot.isAvailable ? '✓ (Available)' : `✗ (${slot.reasonUnavailable || 'Booked'})`}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="9:00 AM">9:00 AM</option>
                        <option value="10:30 AM">10:30 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="2:00 PM">2:00 PM</option>
                        <option value="3:30 PM">3:30 PM</option>
                        <option value="5:00 PM">5:00 PM</option>
                        <option value="6:30 PM">6:30 PM</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Address & Postal Code */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label htmlFor="edit-address" className="block text-xs font-semibold text-charcoal mb-1">
                    Calgary Address *
                  </label>
                  <input
                    type="text"
                    id="edit-address"
                    name="address"
                    autoComplete="street-address"
                    required
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      if (addressError) setAddressError(null);
                    }}
                    placeholder="e.g. 123 17th Ave SW"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist text-xs sm:text-sm text-charcoal"
                  />
                  {addressError && (
                    <p className="text-[10px] text-red-600 font-medium mt-0.5">{addressError}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="edit-postal-code" className="block text-xs font-semibold text-charcoal mb-1">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="edit-postal-code"
                    name="postalCode"
                    autoComplete="postal-code"
                    maxLength={7}
                    required
                    value={postalCode}
                    onChange={(e) => {
                      setPostalCode(formatPostalCodeInput(e.target.value));
                      if (postalError) setPostalError(null);
                    }}
                    placeholder="e.g. T2S 0A1"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist text-xs sm:text-sm font-mono uppercase text-charcoal"
                  />
                  {postalError && (
                    <p className="text-[10px] text-red-600 font-medium mt-0.5">{postalError}</p>
                  )}
                </div>
              </div>

              {/* Special Notes */}
              <div>
                <label htmlFor="edit-notes" className="block text-xs font-semibold text-charcoal mb-1">
                  Updated Special Requests or Notes:
                </label>
                <textarea
                  id="edit-notes"
                  name="specialNotes"
                  rows={2}
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="Focus areas, parking instructions, buzzer code..."
                  className="w-full px-3.5 py-2 rounded-xl border border-oak/40 bg-white text-xs sm:text-sm text-charcoal resize-none focus:ring-2 focus:ring-nordic-mist"
                />
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        {!updatedSuccess && (
          <div className="p-4 sm:p-5 bg-pearl/60 border-t border-gray-200 shrink-0 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-gray-300 text-charcoal hover:bg-gray-100 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              form="edit-appointment-form"
              disabled={isSubmitting}
              className="flex items-center gap-2 py-2.5 px-6 rounded-xl bg-nordic-mist hover:bg-nordic-slate text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-oak" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <span>Save & Reschedule</span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
