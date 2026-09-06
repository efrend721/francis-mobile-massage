import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MessageCircle, CheckCircle, MapPin, User, Phone, Mail, Sparkles, FileText } from 'lucide-react';
import { SERVICES_DATA, BUSINESS_INFO } from '../data/content';
import { BookingFormData } from '../types';
import { BotanicalDecor } from './BotanicalDecor';

interface BookingFormProps {
  preselectedServiceId?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({ preselectedServiceId }) => {
  const [formData, setFormData] = useState<BookingFormData>({
    serviceId: preselectedServiceId || SERVICES_DATA[0].id,
    duration: '60 min',
    fullName: '',
    phone: '',
    email: '',
    preferredDate: '',
    preferredTime: '10:00 AM',
    addressArea: 'SW Calgary',
    specialNotes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (preselectedServiceId) {
      setFormData((prev) => ({ ...prev, serviceId: preselectedServiceId }));
    }
  }, [preselectedServiceId]);

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
          <div className="bg-pearl p-8 sm:p-12 rounded-3xl border border-botanical/30 text-center space-y-4 shadow-spa-card animate-in fade-in">
            <div className="w-16 h-16 bg-botanical text-white rounded-full flex items-center justify-center mx-auto shadow-md">
              <CheckCircle className="w-8 h-8" />
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-charcoal">
              Booking Request Prepared!
            </h3>
            <p className="text-sm sm:text-base text-muted max-w-lg mx-auto">
              Your appointment details have been formatted. WhatsApp will open with your customized request for instant confirmation.
            </p>
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
            className="bg-pearl p-6 sm:p-10 lg:p-12 rounded-3xl border border-oak/40 shadow-spa-card space-y-6 w-full max-w-full overflow-hidden"
          >
            {/* 1. Treatment & Duration */}
            <fieldset className="border-none p-0 m-0 space-y-5 w-full min-w-0">
              <legend className="sr-only">Service and Duration Selection</legend>

              {/* Service Dropdown */}
              <div className="flex flex-col gap-2 w-full min-w-0">
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
                  className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 py-3 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none font-medium transition-all shadow-xs cursor-pointer box-border"
                >
                  {SERVICES_DATA.map((srv) => (
                    <option key={srv.id} value={srv.id}>
                      {srv.title} — {srv.pricing}
                    </option>
                  ))}
                </select>
              </div>

              {/* Session Duration Selector */}
              <div className="flex flex-col gap-2 w-full min-w-0" role="group" aria-labelledby="booking-duration-label">
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
                      className={`py-3 px-3.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer shadow-xs ${
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
            </fieldset>

            {/* 2. Personal & Contact Information */}
            <fieldset className="border-none p-0 m-0 w-full min-w-0">
              <legend className="sr-only">Client Contact Information</legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6 w-full min-w-0">
                {/* Full Name */}
                <div className="flex flex-col gap-2 w-full min-w-0 sm:col-span-1">
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
                    className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 py-3 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs box-border"
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div className="flex flex-col gap-2 w-full min-w-0 sm:col-span-1">
                  <label
                    htmlFor="booking-phone"
                    className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
                  >
                    <Phone className="w-4 h-4 text-botanical shrink-0" />
                    <span>Phone / WhatsApp *</span>
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
                    className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 py-3 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs box-border"
                  />
                </div>

                {/* Email Address */}
                <div className="flex flex-col gap-2 w-full min-w-0 sm:col-span-2">
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
                    className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 py-3 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs box-border"
                  />
                </div>
              </div>
            </fieldset>

            {/* 3. Appointment Time & Location */}
            <fieldset className="border-none p-0 m-0 w-full min-w-0">
              <legend className="sr-only">Appointment Schedule and Calgary Location</legend>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-6 w-full min-w-0">
                {/* Preferred Date (Fixed Mobile Width & Contained Calendar Icon) */}
                <div className="flex flex-col gap-2 w-full min-w-0 sm:col-span-1">
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
                      className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 py-3 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs cursor-pointer block box-border pr-11"
                    />
                    <Calendar className="w-4 h-4 text-botanical absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Preferred Time */}
                <div className="flex flex-col gap-2 w-full min-w-0 sm:col-span-1">
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
                    className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 py-3 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs cursor-pointer box-border"
                  >
                    <option>8:00 AM</option>
                    <option>10:00 AM</option>
                    <option>12:00 PM</option>
                    <option>2:00 PM</option>
                    <option>4:00 PM</option>
                    <option>6:00 PM</option>
                  </select>
                </div>

                {/* Calgary Address / Quadrant */}
                <div className="flex flex-col gap-2 w-full min-w-0 sm:col-span-2">
                  <label
                    htmlFor="booking-address"
                    className="text-xs sm:text-sm font-bold text-charcoal flex items-center gap-2 select-none"
                  >
                    <MapPin className="w-4 h-4 text-botanical shrink-0" />
                    <span>Calgary Location / Address *</span>
                  </label>
                  <input
                    type="text"
                    id="booking-address"
                    name="addressArea"
                    autoComplete="street-address"
                    required
                    placeholder="e.g. 123 Skyview Ranch NE, Calgary, AB"
                    value={formData.addressArea}
                    onChange={(e) => setFormData({ ...formData, addressArea: e.target.value })}
                    className="w-full min-w-0 max-w-full bg-card-white border border-oak/40 rounded-xl px-4 py-3 text-sm text-charcoal focus:ring-2 focus:ring-nordic-mist focus:outline-none transition-all shadow-xs box-border"
                  />
                </div>

                {/* Special Requests / Notes */}
                <div className="flex flex-col gap-2 w-full min-w-0 sm:col-span-2">
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
              </div>
            </fieldset>

            {/* Submit Button */}
            <div className="pt-2 w-full min-w-0">
              <button
                type="submit"
                id="booking-submit-btn"
                name="submit-booking"
                className="w-full bg-nordic-mist hover:bg-nordic-hover text-white font-bold py-4 px-6 rounded-xl shadow-spa-card hover:shadow-spa-hover transition-all text-base flex items-center justify-center gap-2.5 border border-oak/30 cursor-pointer group box-border"
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
