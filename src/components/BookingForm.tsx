import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Calendar,
  Clock,
  MessageCircle,
  CheckCircle,
  MapPin,
  User,
  Phone,
  Mail,
  Sparkles,
  FileText,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Hash,
  Loader2,
} from 'lucide-react';
import { SERVICES_DATA, BUSINESS_INFO } from '../data/content';
import { getServices } from '../services/catalogService';
import {
  createAppointment,
  getAvailability,
  AppointmentDto,
  TimeSlotDto,
} from '../services/appointmentService';
import { BookingFormData, IntakeFormData, ServiceItem } from '../types';
import { BotanicalDecor } from './BotanicalDecor';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { GoogleAuthButton } from './GoogleAuthButton';

interface BookingFormProps {
  preselectedServiceId?: string;
  onOpenIntakeForm?: (data?: Partial<IntakeFormData>) => void;
}

// Format name to First Name + First Initial of Last Name for privacy (e.g., Ervis Morales -> Ervis M.)
function getPrivacyFormattedName(fullName?: string): string {
  if (!fullName) return '';
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  const firstName = parts[0];
  const lastInitial = parts[parts.length - 1].charAt(0).toUpperCase();
  return `${firstName} ${lastInitial}.`;
}

// Standard Canadian Postal Code regex (e.g. T2P 2C4, T3H 0B1, T2S 0A1)
const CANADIAN_POSTAL_CODE_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

// Auto-format Canadian Postal Code (e.g. "t2s0a1" -> "T2S 0A1")
function formatPostalCodeInput(value: string): string {
  const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  if (cleaned.length > 3) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)}`;
  }
  return cleaned;
}

// Map service string ID to Azure SQL numeric service ID
function getNumericServiceId(service: ServiceItem): number {
  if (service.numericId && service.numericId > 0) return service.numericId;
  const fallbackMap: Record<string, number> = {
    'swedish-relaxation': 1,
    'deep-tissue': 2,
    'hot-stone': 3,
    'prenatal-massage': 4,
    'aromatherapy-bliss': 5,
    'trigger-point': 6,
  };
  return fallbackMap[service.id] || 1;
}

// Combine date and formatted time into an ISO 8601 UTC string
function combineDateAndTimeToIso(dateStr: string, timeStr: string): string {
  const targetDateStr = dateStr || new Date(Date.now() + 86400000).toISOString().split('T')[0];
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

export const BookingForm: React.FC<BookingFormProps> = ({ preselectedServiceId, onOpenIntakeForm }) => {
  const { user, loginWithGooglePopup } = useAuth();
  const { location, setManualQuadrant } = useLocation();
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATA);

  // Default date: tomorrow
  const defaultDate = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  }, []);

  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: preselectedServiceId || SERVICES_DATA[0].id,
    duration: '60 min',
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    preferredDate: defaultDate,
    preferredTime: '10:00 AM',
    addressArea: '',
    postalCode: '',
    specialNotes: '',
  });

  const [addressError, setAddressError] = useState<string | null>(null);
  const [postalError, setPostalError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdAppointment, setCreatedAppointment] = useState<AppointmentDto | null>(null);

  // Slots availability state
  const [availableSlots, setAvailableSlots] = useState<TimeSlotDto[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isWorkingDay, setIsWorkingDay] = useState(true);

  // Load services dynamically
  useEffect(() => {
    let isMounted = true;
    getServices().then((data) => {
      if (isMounted && data && data.length > 0) {
        setServices(data);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  // Sync preselected service
  useEffect(() => {
    if (preselectedServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: preselectedServiceId }));
    }
  }, [preselectedServiceId]);

  // Sync authenticated user info
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  // Query slot availability when date or duration changes
  const fetchAvailability = useCallback(async (date: string, durationStr: string) => {
    if (!date) return;
    setIsLoadingSlots(true);
    const durationMinutes = parseInt(durationStr, 10) || 60;
    try {
      const res = await getAvailability(date, durationMinutes);
      setIsWorkingDay(res.isWorkingDay);
      setAvailableSlots(res.slots || []);

      // If current preferred time is not among available slots, select first available slot
      if (res.slots && res.slots.length > 0) {
        const isCurrentSlotAvailable = res.slots.some(
          (s) => s.isAvailable && s.formattedTime.toLowerCase() === formData.preferredTime.toLowerCase()
        );
        if (!isCurrentSlotAvailable) {
          const firstAvailable = res.slots.find((s) => s.isAvailable);
          if (firstAvailable) {
            setFormData((prev) => ({ ...prev, preferredTime: firstAvailable.formattedTime }));
          }
        }
      }
    } catch {
      // Handled in service fallback
    } finally {
      setIsLoadingSlots(false);
    }
  }, [formData.preferredTime]);

  useEffect(() => {
    if (formData.preferredDate) {
      fetchAvailability(formData.preferredDate, formData.duration);
    }
  }, [formData.preferredDate, formData.duration, fetchAvailability]);

  const selectedService = useMemo(() => {
    return services.find((s) => s.id === formData.serviceId) || services[0] || SERVICES_DATA[0];
  }, [services, formData.serviceId]);

  // Real-time Postal Code validation
  const isPostalCodeValid = Boolean(
    formData.postalCode && CANADIAN_POSTAL_CODE_REGEX.test(formData.postalCode.trim())
  );

  // Infer Calgary quadrant code from address or context
  const resolveQuadrantCode = (): string => {
    const addr = formData.addressArea.toUpperCase();
    if (addr.includes('NW')) return 'NW';
    if (addr.includes('SW')) return 'SW';
    if (addr.includes('SE')) return 'SE';
    if (addr.includes('NE')) return 'NE';
    if (addr.includes('DOWNTOWN') || addr.includes('BELTLINE')) return 'DOWNTOWN';
    if (location.quadrant) return location.quadrant;
    return 'NW';
  };

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasError = false;

    // 1. Validate Address
    const trimmedAddress = formData.addressArea.trim();
    if (!trimmedAddress || trimmedAddress.length < 5) {
      setAddressError('Please enter your full street name and house/unit number.');
      hasError = true;
    } else {
      setAddressError(null);
    }

    // 2. Validate Postal Code
    const trimmedPostal = (formData.postalCode || '').trim();
    if (!trimmedPostal) {
      setPostalError('Please enter your 6-character Canadian Postal Code.');
      hasError = true;
    } else if (!CANADIAN_POSTAL_CODE_REGEX.test(trimmedPostal)) {
      setPostalError('Please enter a valid format (e.g. T2S 0A1).');
      hasError = true;
    } else {
      setPostalError(null);
    }

    if (hasError) {
      if (!trimmedAddress || trimmedAddress.length < 5) {
        document.getElementById('booking-address')?.focus();
      } else {
        document.getElementById('booking-postal-code')?.focus();
      }
      return;
    }

    setIsSubmitting(true);

    const durationMinutes = parseInt(formData.duration, 10) || 60;
    const scheduledAtIso = combineDateAndTimeToIso(formData.preferredDate, formData.preferredTime);
    const numericServiceId = getNumericServiceId(selectedService);
    const quadrantCode = resolveQuadrantCode();

    let apptResult: AppointmentDto | null = null;
    let appointmentRef = 'DIRECT-CALGARY';

    try {
      apptResult = await createAppointment({
        serviceId: numericServiceId,
        durationMinutes,
        scheduledAt: scheduledAtIso,
        quadrantCode,
        serviceAddress: trimmedAddress,
        postalCode: trimmedPostal.toUpperCase(),
        clientSpecialNotes: formData.specialNotes.trim() || undefined,
        clientName: formData.fullName.trim(),
        clientEmail: formData.email.trim(),
        clientPhone: formData.phone.trim(),
      });

      if (apptResult && apptResult.id) {
        setCreatedAppointment(apptResult);
        appointmentRef = `FW-${apptResult.id.slice(0, 8).toUpperCase()}`;
      }
    } catch (apiError) {
      console.warn('[BookingForm] Backend API persistence notice (proceeding with WhatsApp dispatch):', apiError);
    }

    setIsSubmitting(false);
    setSubmitted(true);

    // Format date nicely (e.g. "Mon, Sep 21, 2026")
    let prettyDate = formData.preferredDate;
    try {
      const [y, m, d] = formData.preferredDate.split('-').map(Number);
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
      // fallback to raw
    }

    const postalClean = formData.postalCode ? formData.postalCode.trim().toUpperCase() : '';

    // Create WhatsApp message with 100% universal text formatting and clean executive layout
    const messageLines = [
      '*FORM WELLNESS & RECOVERY*',
      '_Mobile Massage Therapy — Calgary_',
      '----------------------------------------',
      '',
      '*NEW IN-HOME BOOKING*',
      '',
      '*Treatment Details:*',
      `• Service: *${selectedService.title}*`,
      `• Duration: *${formData.duration}*`,
      `• Date & Time: *${prettyDate} at ${formData.preferredTime}*`,
      `• Booking Ref: *#${appointmentRef}*`,
      '',
      '*Client Information:*',
      `• Name: *${formData.fullName.trim()}*`,
      `• Phone: *${formData.phone.trim()}*`,
      `• Email: *${formData.email.trim()}*`,
      '',
      '*Service Location:*',
      `• Address: *${formData.addressArea.trim()}*`,
      postalClean ? `• Calgary Area: *${postalClean} (${quadrantCode} Calgary)*` : `• Calgary Area: *${quadrantCode} Calgary*`,
      formData.specialNotes.trim() ? `• Special Notes: *${formData.specialNotes.trim()}*` : '',
      '',
      '----------------------------------------',
      '_Looking forward to your confirmation!_',
    ].filter((line) => line !== '');

    const message = messageLines.join('\n');
    const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="booking" className="relative bg-card-white py-16 sm:py-20 lg:py-28 border-t border-oak/20">
      {/* Decorative Botanical Branch */}
      <div className="absolute top-0 right-0 w-32 sm:w-44 pointer-events-none opacity-25 z-0">
        <BotanicalDecor variant="branch-right" className="w-full h-auto drop-shadow-md" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 bg-botanical-light/60 text-botanical-dark px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-botanical/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Fast & Direct In-Home Booking
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal tracking-tight">
            Schedule Your Mobile Treatment
          </h2>
          <BotanicalDecor variant="divider" />
          <p className="text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed">
            Select your desired treatment and preferred time. Francis will arrive equipped with a professional table, fresh linens, and organic oils.
          </p>
        </div>

        {submitted ? (
          <div className="bg-pearl p-8 sm:p-12 rounded-3xl border border-botanical/30 text-center space-y-5 shadow-spa-card animate-in fade-in">
            <div className="w-16 h-16 bg-botanical text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 bg-botanical-light text-botanical-dark font-bold text-xs px-3 py-1 rounded-full border border-botanical/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                {createdAppointment ? 'Confirmed in System • Azure SQL' : 'Direct WhatsApp Booking'}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
                Booking Request Successfully Submitted!
              </h3>
              {createdAppointment && (
                <p className="text-xs sm:text-sm font-mono text-nordic-mist font-semibold">
                  Reference Code: #{createdAppointment.id.slice(0, 8).toUpperCase()}
                </p>
              )}
            </div>

            <p className="text-sm sm:text-base text-muted max-w-lg mx-auto">
              Your appointment details have been secured. WhatsApp will open with your customized request for immediate coordination with Francis.
            </p>

            {onOpenIntakeForm && (
              <div className="pt-2 max-w-md mx-auto p-5 bg-card-white rounded-2xl border border-oak/40 shadow-xs space-y-3">
                <span className="text-xs font-bold text-botanical uppercase tracking-wider block">
                  Next Step (Recommended)
                </span>
                <p className="text-xs text-glacier leading-relaxed">
                  Complete your confidential digital health history now so Francis can prepare your customized treatment prior to arrival.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onOpenIntakeForm({
                      fullName: formData.fullName,
                      phone: formData.phone,
                      email: formData.email,
                      calgaryQuadrant: resolveQuadrantCode(),
                    })
                  }
                  className="w-full py-3.5 px-4 bg-nordic-mist hover:bg-nordic-slate text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-oak" />
                  <span>Open Digital Intake Form (1 Min)</span>
                </button>
              </div>
            )}

            <div className="pt-2">
              <button
                type="button"
                id="booking-reset-btn"
                name="reset-booking"
                onClick={() => {
                  setSubmitted(false);
                  setCreatedAppointment(null);
                }}
                className="text-xs font-semibold text-nordic-mist underline underline-offset-4 hover:text-nordic-hover cursor-pointer"
              >
                Submit another booking request
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-pearl p-6 sm:p-10 lg:p-12 rounded-3xl border border-oak/40 shadow-spa-card grid grid-cols-1 sm:grid-cols-12 gap-x-5 gap-y-5 sm:gap-y-6 w-full max-w-full overflow-hidden"
          >
            {/* Google 1-Click Auto-Fill Bar with Privacy Protection */}
            <div className="sm:col-span-12 w-full">
              {user ? (
                <div className="flex items-center justify-between p-3.5 bg-botanical-light/70 border border-botanical/30 rounded-2xl text-xs sm:text-sm text-charcoal">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-botanical shrink-0" />
                    <span>
                      Auto-filled as <strong>{getPrivacyFormattedName(user.name)}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-botanical font-semibold text-xs">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Privacy Protected (Google Verified)</span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-card-white border border-gray-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                  <div className="text-xs text-glacier">
                    <span className="font-semibold text-charcoal block">Save time booking:</span>
                    Sign in with Google to auto-fill your contact info.
                  </div>
                  <div className="w-full sm:w-auto">
                    <GoogleAuthButton
                      onClick={loginWithGooglePopup}
                      text="Sign in with Google"
                      className="py-2! px-3! text-xs! h-auto!"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 1. Service Dropdown */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-12">
              <label
                htmlFor="booking-service-select"
                className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
              >
                <Sparkles className="w-4 h-4 text-botanical shrink-0" />
                <span>Select Massage Treatment *</span>
              </label>
              <select
                id="booking-service-select"
                name="serviceId"
                value={formData.serviceId}
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 h-12 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none font-medium transition-all shadow-xs cursor-pointer box-border"
              >
                {services.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.title} - {srv.pricing}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Session Duration Selector */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-12" role="group" aria-labelledby="booking-duration-label">
              <div className="flex items-center justify-between">
                <span id="booking-duration-label" className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none">
                  <Clock className="w-4 h-4 text-botanical shrink-0" />
                  <span>Treatment Duration *</span>
                </span>
                <span className="text-[11px] text-glacier">Extended recovery options</span>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
                {(['60 min', '75 min', '90 min'] as const).map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setFormData({ ...formData, duration: dur })}
                    className={`h-12 rounded-xl text-xs sm:text-sm font-bold transition-all border cursor-pointer ${
                      formData.duration === dur
                        ? 'bg-nordic-mist text-white border-nordic-mist shadow-xs scale-[1.02]'
                        : 'bg-card-white text-charcoal border-oak/40 hover:border-oak hover:bg-pearl/50'
                    }`}
                  >
                    {dur}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Full Name */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-6">
              <label
                htmlFor="booking-fullname"
                className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
              >
                <User className="w-4 h-4 text-botanical shrink-0" />
                <span>Full Name *</span>
              </label>
              <input
                type="text"
                id="booking-fullname"
                name="fullName"
                autoComplete="name"
                required
                placeholder="e.g. Sarah Miller"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 h-12 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs box-border"
              />
            </div>

            {/* 4. Phone Number / WhatsApp */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-6">
              <label
                htmlFor="booking-phone"
                className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
              >
                <Phone className="w-4 h-4 text-botanical shrink-0" />
                <span>Phone Number (WhatsApp) *</span>
              </label>
              <input
                type="tel"
                id="booking-phone"
                name="phone"
                autoComplete="tel"
                required
                placeholder="e.g. 403-396-4233"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 h-12 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs box-border"
              />
            </div>

            {/* 5. Email Address */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-12">
              <label
                htmlFor="booking-email"
                className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
              >
                <Mail className="w-4 h-4 text-botanical shrink-0" />
                <span>Email Address *</span>
              </label>
              <input
                type="email"
                id="booking-email"
                name="email"
                autoComplete="email"
                required
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 h-12 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs box-border"
              />
            </div>

            {/* 6. Preferred Date */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-6">
              <label
                htmlFor="booking-date"
                className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
              >
                <Calendar className="w-4 h-4 text-botanical shrink-0" />
                <span>Preferred Date *</span>
              </label>
              <div className="relative w-full min-w-0 max-w-full">
                <input
                  type="date"
                  id="booking-date"
                  name="preferredDate"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  onClick={(e) => {
                    try {
                      e.currentTarget.showPicker?.();
                    } catch {
                      // fallback
                    }
                  }}
                  className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 h-12 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs cursor-pointer block box-border pr-11"
                />
                <Calendar className="w-4 h-4 text-botanical absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 7. Preferred Time / Dynamic Slot Availability */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-6">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="booking-time"
                  className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
                >
                  <Clock className="w-4 h-4 text-botanical shrink-0" />
                  <span>Preferred Time *</span>
                </label>
                {isLoadingSlots && (
                  <span className="text-[10px] text-muted flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin text-botanical" /> Checking slots...
                  </span>
                )}
              </div>

              <select
                id="booking-time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 h-12 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs cursor-pointer box-border font-medium"
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

            {/* Real-Time Available Slot Quick-Chips */}
            {availableSlots && availableSlots.length > 0 && isWorkingDay && (
              <div className="sm:col-span-12 -mt-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] font-semibold text-charcoal mr-1">Available Slots:</span>
                  {availableSlots.map((slot) => {
                    const isSelected = formData.preferredTime.toLowerCase() === slot.formattedTime.toLowerCase();
                    if (!slot.isAvailable) {
                      return (
                        <span
                          key={slot.time}
                          className="text-[11px] px-2 py-1 rounded-md bg-gray-100 text-gray-400 line-through cursor-not-allowed border border-gray-200"
                          title={slot.reasonUnavailable || 'Booked'}
                        >
                          {slot.formattedTime}
                        </span>
                      );
                    }
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => setFormData({ ...formData, preferredTime: slot.formattedTime })}
                        className={`text-[11px] px-2.5 py-1 rounded-md font-semibold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-botanical text-white border-botanical shadow-xs scale-105'
                            : 'bg-card-white hover:bg-botanical-light text-charcoal border-botanical/30'
                        }`}
                      >
                        {slot.formattedTime}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 8. Address Field */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-7 lg:col-span-8">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="booking-address"
                  className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
                >
                  <MapPin className="w-4 h-4 text-botanical shrink-0" />
                  <span>Address in Calgary *</span>
                </label>
                <span className="text-[10px] text-botanical font-medium">✓ No travel fees in Calgary</span>
              </div>
              
              <input
                type="text"
                id="booking-address"
                name="address"
                autoComplete="street-address"
                required
                placeholder="e.g. 123 17th Ave SW"
                value={formData.addressArea}
                onChange={(e) => {
                  setFormData({ ...formData, addressArea: e.target.value });
                  if (addressError) setAddressError(null);
                }}
                className={`w-full min-w-0 max-w-full bg-card-white border rounded-xl px-4 h-12 text-sm text-charcoal focus:ring-2 focus:outline-none transition-all shadow-xs box-border ${
                  addressError
                    ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                    : 'border-oak/40 focus:ring-nordic-mist'
                }`}
              />

              {addressError && (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5 animate-fadeIn">
                  <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                  <span>{addressError}</span>
                </p>
              )}
            </div>

            {/* 9. Separate Dedicated Postal Code Field */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-5 lg:col-span-4">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="booking-postal-code"
                  className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
                >
                  <Hash className="w-4 h-4 text-botanical shrink-0" />
                  <span>Postal Code *</span>
                </label>
                {isPostalCodeValid && (
                  <span className="text-[10px] text-botanical font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Valid
                  </span>
                )}
              </div>
              
              <input
                type="text"
                id="booking-postal-code"
                name="postalCode"
                autoComplete="postal-code"
                maxLength={7}
                required
                placeholder="e.g. T2S 0A1"
                value={formData.postalCode}
                onChange={(e) => {
                  const formatted = formatPostalCodeInput(e.target.value);
                  setFormData({ ...formData, postalCode: formatted });
                  if (postalError) setPostalError(null);
                }}
                className={`w-full min-w-0 max-w-full bg-card-white border rounded-xl px-4 h-12 text-sm font-medium tracking-wide uppercase text-charcoal focus:ring-2 focus:outline-none transition-all shadow-xs box-border ${
                  postalError
                    ? 'border-red-400 focus:ring-red-400 bg-red-50/20'
                    : isPostalCodeValid
                    ? 'border-botanical/60 focus:ring-nordic-mist'
                    : 'border-oak/40 focus:ring-nordic-mist'
                }`}
              />

              {postalError ? (
                <p className="text-[11px] text-red-600 font-medium flex items-center gap-1 pt-0.5 animate-fadeIn">
                  <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                  <span>{postalError}</span>
                </p>
              ) : formData.postalCode && !isPostalCodeValid && formData.postalCode.length >= 3 ? (
                <p className="text-[10px] text-glacier pt-0.5">
                  Format: 6 chars (e.g. <strong>T2S 0A1</strong>)
                </p>
              ) : null}
            </div>

            {/* Quick Calgary Quadrant Selection Chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:col-span-12 pt-0.5">
              <span className="text-[11px] text-muted mr-1 font-medium">Quick pick:</span>
              {(['SW', 'NW', 'SE', 'NE', 'Airdrie'] as const).map((quadrant) => {
                const label = quadrant === 'Airdrie' ? 'Airdrie Area' : `${quadrant} Calgary`;
                const isMatch = formData.addressArea.toUpperCase().includes(quadrant);
                return (
                  <button
                    key={quadrant}
                    type="button"
                    onClick={() => {
                      setManualQuadrant(quadrant);
                      const current = formData.addressArea.trim();
                      if (!current) {
                        setFormData((prev) => ({
                          ...prev,
                          addressArea: quadrant === 'Airdrie' ? 'Airdrie, AB' : `${quadrant} Calgary, AB`,
                        }));
                      } else if (!current.toUpperCase().includes(quadrant)) {
                        setFormData((prev) => ({
                          ...prev,
                          addressArea: `${current} (${label})`,
                        }));
                      }
                      if (addressError) setAddressError(null);
                      document.getElementById('booking-address')?.focus();
                    }}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      isMatch
                        ? 'bg-nordic-mist text-white border-nordic-mist font-semibold shadow-xs'
                        : 'bg-pearl/80 hover:bg-pearl text-charcoal border-oak/30'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            {/* 10. Special Requests / Notes */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-12">
              <label
                htmlFor="booking-notes"
                className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
              >
                <FileText className="w-4 h-4 text-botanical shrink-0" />
                <span>Special Requests or Focus Areas (Optional)</span>
              </label>
              <textarea
                id="booking-notes"
                name="specialNotes"
                rows={3}
                placeholder="e.g. Focus on neck and shoulders, preferred organic oil scent..."
                value={formData.specialNotes}
                onChange={(e) => setFormData({ ...formData, specialNotes: e.target.value })}
                className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 py-3 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs resize-none box-border"
              />
            </div>

            {/* 11. Submit Button */}
            <div className="pt-2 w-full min-w-0 sm:col-span-12">
              <button
                type="submit"
                id="booking-submit-btn"
                name="submit-booking"
                disabled={isSubmitting}
                className="w-full bg-nordic-mist hover:bg-nordic-hover text-white font-bold h-14 px-6 rounded-xl shadow-spa-card hover:shadow-spa-hover transition-all text-base flex items-center justify-center gap-2.5 border border-oak/30 cursor-pointer group box-border disabled:opacity-75"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 text-oak animate-spin" />
                    <span>Reserving Session & Connecting...</span>
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 text-oak group-hover:scale-110 transition-transform" />
                    <span>Confirm & Request Appointment via WhatsApp</span>
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};
