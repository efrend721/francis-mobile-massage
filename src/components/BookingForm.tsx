import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import { SERVICES_DATA, BUSINESS_INFO } from '../data/content';
import { BookingFormData, IntakeFormData } from '../types';
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

export const BookingForm: React.FC<BookingFormProps> = ({ preselectedServiceId, onOpenIntakeForm }) => {
  const { user, loginWithGooglePopup } = useAuth();
  const { setManualQuadrant } = useLocation();

  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: preselectedServiceId || SERVICES_DATA[0].id,
    duration: '60 min',
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    preferredDate: '',
    preferredTime: '10:00 AM',
    addressArea: '',
    postalCode: '',
    specialNotes: '',
  });

  const [addressError, setAddressError] = useState<string | null>(null);
  const [postalError, setPostalError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: preselectedServiceId }));
    }
  }, [preselectedServiceId]);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name,
        email: prev.email || user.email,
      }));
    }
  }, [user]);

  const selectedService = SERVICES_DATA.find((s) => s.id === formData.serviceId) || SERVICES_DATA[0];

  // Real-time Postal Code validation
  const isPostalCodeValid = Boolean(formData.postalCode && CANADIAN_POSTAL_CODE_REGEX.test(formData.postalCode.trim()));

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
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

    setSubmitted(true);

    // Create WhatsApp pre-filled message using clean lines and standard encoding
    const messageLines = [
      'Hello Francis, I would like to book a mobile massage:',
      `- *Service:* ${selectedService.title}`,
      `- *Duration:* ${formData.duration}`,
      `- *Name:* ${formData.fullName}`,
      `- *Phone:* ${formData.phone}`,
      `- *Email:* ${formData.email}`,
      `- *Date & Time:* ${formData.preferredDate} at ${formData.preferredTime}`,
      `- *Address:* ${formData.addressArea}`,
      `- *Postal Code:* ${formData.postalCode?.trim().toUpperCase()}`,
      `- *Notes:* ${formData.specialNotes.trim() || 'None'}`
    ];

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
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
              Booking Request Prepared!
            </h3>
            <p className="text-sm sm:text-base text-muted max-w-lg mx-auto">
              Your appointment details have been formatted. WhatsApp will open with your customized request for instant confirmation with Francis.
            </p>

            {onOpenIntakeForm && (
              <div className="pt-2 max-w-md mx-auto p-4 bg-card-white rounded-2xl border border-oak/40 shadow-xs space-y-2">
                <span className="text-xs font-bold text-botanical uppercase tracking-wider block">
                  Next Step (Recommended)
                </span>
                <p className="text-xs text-glacier">
                  Complete your digital health history now so Francis can arrive ready with tailored therapy.
                </p>
                <button
                  type="button"
                  onClick={() =>
                    onOpenIntakeForm({
                      fullName: formData.fullName,
                      phone: formData.phone,
                      email: formData.email,
                      calgaryQuadrant: formData.addressArea.toUpperCase().includes('NW')
                        ? 'NW'
                        : formData.addressArea.toUpperCase().includes('NE')
                        ? 'NE'
                        : formData.addressArea.toUpperCase().includes('SE')
                        ? 'SE'
                        : 'SW',
                    })
                  }
                  className="w-full py-3 px-4 bg-nordic-mist hover:bg-nordic-slate text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
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
                onClick={() => setSubmitted(false)}
                className="text-xs font-semibold text-nordic-mist underline underline-offset-4 hover:text-nordic-hover cursor-pointer"
              >
                Submit another booking request
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-pearl p-6 sm:p-10 lg:p-12 rounded-3xl border border-oak/40 shadow-spa-card grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5 sm:gap-y-6 w-full max-w-full overflow-hidden"
          >
            {/* Google 1-Click Auto-Fill Bar with Privacy Protection */}
            <div className="sm:col-span-2 w-full">
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
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-2">
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
                {SERVICES_DATA.map((srv) => (
                  <option key={srv.id} value={srv.id}>
                    {srv.title} - {srv.pricing}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Session Duration Selector */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-2" role="group" aria-labelledby="booking-duration-label">
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
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-1">
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
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-1">
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
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-2">
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
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-1">
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

            {/* 7. Preferred Time */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-1">
              <label
                htmlFor="booking-time"
                className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
              >
                <Clock className="w-4 h-4 text-botanical shrink-0" />
                <span>Preferred Time *</span>
              </label>
              <select
                id="booking-time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 h-12 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs cursor-pointer box-border"
              >
                <option>8:00 AM</option>
                <option>10:00 AM</option>
                <option>12:00 PM</option>
                <option>2:00 PM</option>
                <option>4:00 PM</option>
                <option>6:00 PM</option>
              </select>
            </div>

            {/* 8. Address Field */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="booking-address"
                  className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
                >
                  <MapPin className="w-4 h-4 text-botanical shrink-0" />
                  <span>Address *</span>
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
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-1">
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
                  Format: 6 characters (e.g. <strong>T2S 0A1</strong>)
                </p>
              ) : null}
            </div>

            {/* Quick Calgary Quadrant Selection Chips */}
            <div className="flex flex-wrap items-center gap-1.5 sm:col-span-2 pt-0.5">
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
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-2">
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
            <div className="pt-2 w-full min-w-0 sm:col-span-2">
              <button
                type="submit"
                id="booking-submit-btn"
                name="submit-booking"
                className="w-full bg-nordic-mist hover:bg-nordic-hover text-white font-bold h-14 px-6 rounded-xl shadow-spa-card hover:shadow-spa-hover transition-all text-base flex items-center justify-center gap-2.5 border border-oak/30 cursor-pointer group box-border"
              >
                <MessageCircle className="w-5 h-5 text-oak group-hover:scale-110 transition-transform" />
                <span>Confirm & Request Appointment via WhatsApp</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </section>
  );
};
