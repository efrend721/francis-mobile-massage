import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MessageCircle, CheckCircle, MapPin, User, Phone, Mail, Sparkles, FileText, CheckCircle2 } from 'lucide-react';
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

export const BookingForm: React.FC<BookingFormProps> = ({ preselectedServiceId, onOpenIntakeForm }) => {
  const { user, loginWithGooglePopup } = useAuth();
  const { location, setManualQuadrant } = useLocation();
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: preselectedServiceId || SERVICES_DATA[0].id,
    duration: '60 min',
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    preferredDate: '',
    preferredTime: '10:00 AM',
    addressArea: location.displayText || 'Calgary, AB • SW',
    specialNotes: '',
  });

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

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
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
      `- *Calgary Area:* ${formData.addressArea}`,
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
                      calgaryQuadrant: formData.addressArea.includes('NW')
                        ? 'NW'
                        : formData.addressArea.includes('NE')
                        ? 'NE'
                        : formData.addressArea.includes('SE')
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
            {/* Google 1-Click Auto-Fill Bar */}
            <div className="sm:col-span-2 w-full">
              {user ? (
                <div className="flex items-center justify-between p-3.5 bg-botanical-light/70 border border-botanical/30 rounded-2xl text-xs sm:text-sm text-charcoal">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-botanical shrink-0" />
                    <span>Auto-filled as <strong>{user.name}</strong> ({user.email || 'Google Account'})</span>
                  </div>
                  <span className="text-botanical font-semibold text-xs hidden sm:inline">Verified Profile</span>
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
              <span
                id="booking-duration-label"
                className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
              >
                <Clock className="w-4 h-4 text-botanical shrink-0" />
                <span>Session Duration *</span>
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 w-full min-w-0">
                {(['60 min', '75 min', '90 min', '120 min'] as const).map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    name={`duration-${dur.replace(' ', '-')}`}
                    onClick={() => setFormData({ ...formData, duration: dur })}
                    aria-pressed={formData.duration === dur}
                    className={`h-12 px-3.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer shadow-xs flex items-center justify-center ${
                      formData.duration === dur
                        ? 'bg-nordic-mist text-white border-nordic-mist shadow-xs'
                        : 'bg-card-white text-charcoal border-oak/40 hover:bg-oak-light/60 hover:border-oak'
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

            {/* 8. Calgary Address / Quadrant */}
            <div className="flex flex-col gap-1.5 sm:gap-2 w-full min-w-0 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="booking-address"
                  className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
                >
                  <MapPin className="w-4 h-4 text-botanical shrink-0" />
                  <span>Calgary In-Home Address *</span>
                </label>
                <span className="text-[11px] text-botanical font-medium">✓ No travel fees in Calgary</span>
              </div>
              <input
                type="text"
                id="booking-address"
                name="addressArea"
                autoComplete="street-address"
                required
                placeholder="e.g. 123 17th Ave SW, Calgary, AB"
                value={formData.addressArea}
                onChange={(e) => setFormData({ ...formData, addressArea: e.target.value })}
                className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 h-12 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs box-border"
              />
              {/* Quick Calgary Quadrant Selection Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-muted mr-1">Quick pick:</span>
                {(['SW', 'NW', 'SE', 'NE', 'Airdrie'] as const).map((quadrant) => {
                  const label = quadrant === 'Airdrie' ? 'Airdrie Area' : `${quadrant} Calgary`;
                  const isMatch = formData.addressArea.includes(quadrant);
                  return (
                    <button
                      key={quadrant}
                      type="button"
                      onClick={() => {
                        setManualQuadrant(quadrant);
                        setFormData((prev) => ({
                          ...prev,
                          addressArea: quadrant === 'Airdrie' ? 'Airdrie & Calgary Area' : `Calgary, AB • ${quadrant}`,
                        }));
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
            </div>

            {/* 9. Special Requests / Notes */}
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

            {/* 10. Submit Button */}
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
