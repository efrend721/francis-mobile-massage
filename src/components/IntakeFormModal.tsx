import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  AlertCircle,
  Send,
  User,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { IntakeFormData } from '../types';
import { BUSINESS_INFO } from '../data/content';

interface IntakeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<IntakeFormData>;
}

const BODY_FOCUS_OPTIONS = [
  'Neck & Shoulders',
  'Upper Back & Trapezius',
  'Lower Back & Lumbar',
  'Sciatica & Glutes',
  'Legs & Calves',
  'Arms, Wrists & Hands',
  'Feet & Ankles',
  'Full Body Relaxation',
];

export const IntakeFormModal: React.FC<IntakeFormModalProps> = ({
  isOpen,
  onClose,
  initialData,
}) => {
  const { user } = useAuth();
  const { location } = useLocation();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Form State
  const [formData, setFormData] = useState<IntakeFormData>({
    fullName: initialData?.fullName || user?.name || '',
    phone: initialData?.phone || '',
    email: initialData?.email || user?.email || '',
    calgaryQuadrant: initialData?.calgaryQuadrant || location.quadrant || 'NW',
    isFirstVisit: initialData?.isFirstVisit ?? true,
    focusAreas: initialData?.focusAreas || ['Neck & Shoulders', 'Lower Back & Lumbar'],
    hasHighBloodPressure: initialData?.hasHighBloodPressure ?? false,
    isPregnant: initialData?.isPregnant ?? false,
    pregnancyWeeks: initialData?.pregnancyWeeks || '',
    hasRecentSurgeriesOrInjuries: initialData?.hasRecentSurgeriesOrInjuries ?? false,
    surgeriesDetails: initialData?.surgeriesDetails || '',
    hasAllergiesToOilsOrNuts: initialData?.hasAllergiesToOilsOrNuts ?? false,
    allergiesDetails: initialData?.allergiesDetails || '',
    otherHealthNotes: initialData?.otherHealthNotes || '',
    pressurePreference: initialData?.pressurePreference || 'medium',
    aromatherapyPreference: initialData?.aromatherapyPreference || 'eucalyptus',
    pipaConsentAccepted: initialData?.pipaConsentAccepted ?? false,
    cancellationPolicyAccepted: initialData?.cancellationPolicyAccepted ?? false,
    signatureName: initialData?.signatureName || user?.name || '',
    completedAt: '',
  });

  // Sync user info when modal opens or user logs in
  useEffect(() => {
    if (user && !formData.fullName) {
      setFormData((prev) => ({
        ...prev,
        fullName: user.name,
        email: user.email,
        signatureName: user.name,
      }));
    }
  }, [user, formData.fullName]);

  // Keyboard escape handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const toggleFocusArea = (area: string) => {
    setFormData((prev) => {
      const exists = prev.focusAreas.includes(area);
      if (exists) {
        return { ...prev, focusAreas: prev.focusAreas.filter((a) => a !== area) };
      } else {
        return { ...prev, focusAreas: [...prev.focusAreas, area] };
      }
    });
  };

  const handleNext = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.phone.trim()) {
        alert('Please complete your name and phone number.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      if (!formData.pipaConsentAccepted || !formData.cancellationPolicyAccepted) {
        alert('Please accept the informed consent and cancellation policy to proceed.');
        return;
      }
      // Finish and record completion
      const completedData = {
        ...formData,
        completedAt: new Date().toLocaleDateString('en-CA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setFormData(completedData);
      setIsSubmitted(true);
      setStep(4);
    }
  };

  const handleSendViaWhatsApp = () => {
    const message = `🌿 *FORM - Digital Health Intake Form Summary*
👤 *Client:* ${formData.fullName}
📞 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email || 'N/A'}
📍 *Calgary Area:* ${formData.calgaryQuadrant} (${formData.isFirstVisit ? 'First Visit' : 'Returning Client'})

🎯 *Focus Areas:*
${formData.focusAreas.length > 0 ? formData.focusAreas.map((a) => `• ${a}`).join('\n') : '• General full body relaxation'}

🩺 *Health History:*
• High/Low BP: ${formData.hasHighBloodPressure ? 'Yes' : 'No'}
• Pregnant: ${formData.isPregnant ? `Yes (${formData.pregnancyWeeks || 'weeks not specified'})` : 'No'}
• Recent Surgeries/Injuries: ${formData.hasRecentSurgeriesOrInjuries ? `Yes (${formData.surgeriesDetails})` : 'No'}
• Allergies: ${formData.hasAllergiesToOilsOrNuts ? `Yes (${formData.allergiesDetails})` : 'No'}
${formData.otherHealthNotes ? `• Additional Notes: ${formData.otherHealthNotes}` : ''}

💆 *Preferences:*
• Pressure: ${formData.pressurePreference.toUpperCase()}
• Aromatherapy: ${formData.aromatherapyPreference.toUpperCase()}
✅ *PIPA Alberta Consent & 24h Policy Signed by:* ${formData.signatureName || formData.fullName}`;

    const url = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="intake-form-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-nordic-dark/70 backdrop-blur-md overflow-y-auto"
    >
      <div
        className="bg-card-white rounded-2xl sm:rounded-3xl shadow-2xl border border-oak/30 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden relative my-auto animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-linear-to-r from-nordic-mist to-nordic-slate text-white p-4 sm:p-6 shrink-0 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-pearl/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close intake form modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-oak-light text-xs font-semibold tracking-wider uppercase mb-1">
            <ShieldCheck className="w-4 h-4 text-oak" />
            <span>Digital Health Intake • Alberta PIPA Compliant</span>
          </div>

          <h2 id="intake-form-title" className="font-serif text-lg sm:text-2xl font-bold text-white">
            Client Health History & Preferences
          </h2>
          <p className="text-pearl/85 text-xs sm:text-sm mt-0.5 sm:mt-1">
            Fill out in under 90 seconds to maximize your hands-on massage time.
          </p>

          {/* Stepper Progress Bar */}
          {step <= 3 && (
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 1 ? 'bg-oak text-nordic-dark' : 'bg-white/20 text-white'
                  }`}
                >
                  1
                </span>
                <span className="text-xs font-medium hidden sm:inline">Profile</span>
              </div>
              <div className="h-0.5 flex-1 bg-white/20 mx-1">
                <div
                  className={`h-full bg-oak transition-all duration-300 ${
                    step === 1 ? 'w-1/3' : step === 2 ? 'w-2/3' : 'w-full'
                  }`}
                />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 2 ? 'bg-oak text-nordic-dark' : 'bg-white/20 text-white'
                  }`}
                >
                  2
                </span>
                <span className="text-xs font-medium hidden sm:inline">Health & Focus</span>
              </div>
              <div className="h-0.5 flex-1 bg-white/20 mx-1">
                <div
                  className={`h-full bg-oak transition-all duration-300 ${
                    step >= 3 ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    step >= 3 ? 'bg-oak text-nordic-dark' : 'bg-white/20 text-white'
                  }`}
                >
                  3
                </span>
                <span className="text-xs font-medium hidden sm:inline">Preferences & Consent</span>
              </div>
            </div>
          )}
        </div>

        {/* Scrollable Form Content */}
        <div className="p-4 sm:p-7 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: Profile & Contact */}
          {step === 1 && (
            <form id="intake-step-1" onSubmit={handleNext} className="space-y-4 sm:space-y-5">
              {user?.isGoogleUser && (
                <div className="flex items-center gap-3 p-3 bg-botanical-light/60 border border-botanical/30 rounded-xl text-xs sm:text-sm text-charcoal">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="w-8 h-8 rounded-full border border-botanical shrink-0"
                    />
                  ) : (
                    <User className="w-6 h-6 text-botanical shrink-0" />
                  )}
                  <div>
                    <span className="font-semibold text-botanical block">Verified with Google:</span>
                    <span>{user.name} ({user.email})</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="intake-full-name"
                    className="block text-xs sm:text-sm font-semibold text-charcoal mb-1"
                  >
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="intake-full-name"
                    name="intakeFullName"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="e.g. Sarah Miller"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-sm text-charcoal transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="intake-phone"
                    className="block text-xs sm:text-sm font-semibold text-charcoal mb-1"
                  >
                    Phone / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="intake-phone"
                    name="intakePhone"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. +1 (403) 555-0199"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-sm text-charcoal transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="intake-email"
                    className="block text-xs sm:text-sm font-semibold text-charcoal mb-1"
                  >
                    Email Address <span className="text-glacier text-xs font-normal">(For receipts)</span>
                  </label>
                  <input
                    type="email"
                    id="intake-email"
                    name="intakeEmail"
                    autoComplete="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. sarah@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-sm text-charcoal transition-all"
                  />
                </div>

                <div>
                  <label
                    htmlFor="intake-quadrant"
                    className="block text-xs sm:text-sm font-semibold text-charcoal mb-1"
                  >
                    Calgary Service Quadrant <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="intake-quadrant"
                    name="intakeQuadrant"
                    value={formData.calgaryQuadrant}
                    onChange={(e) => setFormData({ ...formData, calgaryQuadrant: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-sm text-charcoal transition-all cursor-pointer"
                  >
                    <option value="SW">Southwest Calgary (SW)</option>
                    <option value="NW">Northwest Calgary (NW)</option>
                    <option value="SE">Southeast Calgary (SE)</option>
                    <option value="NE">Northeast Calgary (NE)</option>
                    <option value="Airdrie">Airdrie & Surrounding Area</option>
                  </select>
                </div>
              </div>

              {/* First Visit Toggle with strict accessible radios/buttons */}
              <div className="p-3.5 bg-pearl rounded-xl border border-oak/30">
                <span className="block text-xs sm:text-sm font-semibold text-charcoal mb-2">
                  Is this your first mobile massage session with Francis?
                </span>
                <div className="flex gap-4">
                  <label
                    htmlFor="first-visit-yes"
                    className="flex items-center gap-2 text-xs sm:text-sm text-charcoal cursor-pointer font-medium"
                  >
                    <input
                      type="radio"
                      id="first-visit-yes"
                      name="isFirstVisitRadio"
                      checked={formData.isFirstVisit === true}
                      onChange={() => setFormData({ ...formData, isFirstVisit: true })}
                      className="w-4 h-4 text-nordic-mist focus:ring-nordic-mist"
                    />
                    <span>Yes, first session</span>
                  </label>

                  <label
                    htmlFor="first-visit-no"
                    className="flex items-center gap-2 text-xs sm:text-sm text-charcoal cursor-pointer font-medium"
                  >
                    <input
                      type="radio"
                      id="first-visit-no"
                      name="isFirstVisitRadio"
                      checked={formData.isFirstVisit === false}
                      onChange={() => setFormData({ ...formData, isFirstVisit: false })}
                      className="w-4 h-4 text-nordic-mist focus:ring-nordic-mist"
                    />
                    <span>No, returning client</span>
                  </label>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: Health Focus & Medical History */}
          {step === 2 && (
            <form id="intake-step-2" onSubmit={handleNext} className="space-y-5 sm:space-y-6">
              {/* Focus Areas Interactive Chips */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-charcoal mb-1">
                  Primary Areas of Tension or Pain <span className="text-glacier font-normal">(Select all that apply)</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {BODY_FOCUS_OPTIONS.map((area) => {
                    const isSelected = formData.focusAreas.includes(area);
                    const chipId = `chip-${area.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
                    return (
                      <button
                        key={area}
                        type="button"
                        id={chipId}
                        onClick={() => toggleFocusArea(area)}
                        className={`p-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all text-left flex items-center justify-between min-h-11 cursor-pointer ${
                          isSelected
                            ? 'bg-nordic-mist text-white border-nordic-mist shadow-xs'
                            : 'bg-pearl/80 hover:bg-pearl text-charcoal border-gray-200'
                        }`}
                      >
                        <span className="leading-tight">{area}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-oak-light shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Health Contraindications & Alerts */}
              <div className="space-y-3 pt-2">
                <span className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-charcoal">
                  <AlertCircle className="w-4 h-4 text-oak" />
                  Health & Medical Background (Confidential)
                </span>

                {/* Blood Pressure */}
                <div className="p-3 bg-pearl rounded-xl border border-gray-200 flex items-center justify-between gap-3">
                  <label htmlFor="intake-bp-toggle" className="text-xs sm:text-sm text-charcoal cursor-pointer flex-1">
                    Do you have high/low blood pressure or cardiac conditions?
                  </label>
                  <input
                    type="checkbox"
                    id="intake-bp-toggle"
                    name="intakeBpToggle"
                    checked={formData.hasHighBloodPressure}
                    onChange={(e) => setFormData({ ...formData, hasHighBloodPressure: e.target.checked })}
                    className="w-5 h-5 rounded-md text-nordic-mist focus:ring-nordic-mist cursor-pointer shrink-0"
                  />
                </div>

                {/* Pregnancy */}
                <div className="p-3 bg-pearl rounded-xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="intake-pregnancy-toggle" className="text-xs sm:text-sm text-charcoal cursor-pointer flex-1">
                      Are you currently pregnant?
                    </label>
                    <input
                      type="checkbox"
                      id="intake-pregnancy-toggle"
                      name="intakePregnancyToggle"
                      checked={formData.isPregnant}
                      onChange={(e) => setFormData({ ...formData, isPregnant: e.target.checked })}
                      className="w-5 h-5 rounded-md text-nordic-mist focus:ring-nordic-mist cursor-pointer shrink-0"
                    />
                  </div>
                  {formData.isPregnant && (
                    <div className="pt-2 border-t border-gray-200">
                      <label htmlFor="intake-pregnancy-weeks" className="block text-xs font-semibold text-charcoal mb-1">
                        Estimated Gestational Weeks:
                      </label>
                      <input
                        type="text"
                        id="intake-pregnancy-weeks"
                        name="intakePregnancyWeeks"
                        value={formData.pregnancyWeeks}
                        onChange={(e) => setFormData({ ...formData, pregnancyWeeks: e.target.value })}
                        placeholder="e.g. 24 weeks"
                        className="w-full px-3 py-1.5 rounded-lg border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-xs text-charcoal"
                      />
                    </div>
                  )}
                </div>

                {/* Recent Surgeries or Injuries */}
                <div className="p-3 bg-pearl rounded-xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="intake-surgery-toggle" className="text-xs sm:text-sm text-charcoal cursor-pointer flex-1">
                      Any recent surgeries, fractures, or acute joint injuries?
                    </label>
                    <input
                      type="checkbox"
                      id="intake-surgery-toggle"
                      name="intakeSurgeryToggle"
                      checked={formData.hasRecentSurgeriesOrInjuries}
                      onChange={(e) => setFormData({ ...formData, hasRecentSurgeriesOrInjuries: e.target.checked })}
                      className="w-5 h-5 rounded-md text-nordic-mist focus:ring-nordic-mist cursor-pointer shrink-0"
                    />
                  </div>
                  {formData.hasRecentSurgeriesOrInjuries && (
                    <div className="pt-2 border-t border-gray-200">
                      <label htmlFor="intake-surgery-details" className="block text-xs font-semibold text-charcoal mb-1">
                        Please specify injury or surgery & date:
                      </label>
                      <input
                        type="text"
                        id="intake-surgery-details"
                        name="intakeSurgeryDetails"
                        value={formData.surgeriesDetails}
                        onChange={(e) => setFormData({ ...formData, surgeriesDetails: e.target.value })}
                        placeholder="e.g. Right knee arthroscopy 6 months ago"
                        className="w-full px-3 py-1.5 rounded-lg border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-xs text-charcoal"
                      />
                    </div>
                  )}
                </div>

                {/* Allergies */}
                <div className="p-3 bg-pearl rounded-xl border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="intake-allergy-toggle" className="text-xs sm:text-sm text-charcoal cursor-pointer flex-1">
                      Allergies to massage oils, nuts (almond oil), or fragrances?
                    </label>
                    <input
                      type="checkbox"
                      id="intake-allergy-toggle"
                      name="intakeAllergyToggle"
                      checked={formData.hasAllergiesToOilsOrNuts}
                      onChange={(e) => setFormData({ ...formData, hasAllergiesToOilsOrNuts: e.target.checked })}
                      className="w-5 h-5 rounded-md text-nordic-mist focus:ring-nordic-mist cursor-pointer shrink-0"
                    />
                  </div>
                  {formData.hasAllergiesToOilsOrNuts && (
                    <div className="pt-2 border-t border-gray-200">
                      <label htmlFor="intake-allergy-details" className="block text-xs font-semibold text-charcoal mb-1">
                        Please specify allergies:
                      </label>
                      <input
                        type="text"
                        id="intake-allergy-details"
                        name="intakeAllergyDetails"
                        value={formData.allergiesDetails}
                        onChange={(e) => setFormData({ ...formData, allergiesDetails: e.target.value })}
                        placeholder="e.g. Nut allergy (use organic jojoba or grapeseed oil only)"
                        className="w-full px-3 py-1.5 rounded-lg border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-xs text-charcoal"
                      />
                    </div>
                  )}
                </div>
              </div>
            </form>
          )}

          {/* STEP 3: Preferences & Informed Consent */}
          {step === 3 && (
            <form id="intake-step-3" onSubmit={handleNext} className="space-y-5 sm:space-y-6">
              {/* Pressure Level Preference */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-charcoal mb-1">
                  Preferred Massage Pressure:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
                  {[
                    { id: 'light', label: 'Light', desc: 'Gentle & Soothing' },
                    { id: 'medium', label: 'Medium', desc: 'Balanced Relief' },
                    { id: 'firm', label: 'Firm', desc: 'Moderate Deep' },
                    { id: 'deep', label: 'Deep Tissue', desc: 'Maximum Tension' },
                  ].map((p) => {
                    const isSelected = formData.pressurePreference === p.id;
                    const pressureButtonId = `pressure-pref-${p.id}`;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        id={pressureButtonId}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            pressurePreference: p.id as 'light' | 'medium' | 'firm' | 'deep',
                          })
                        }
                        className={`p-3 rounded-xl border text-left transition-all min-h-11 cursor-pointer ${
                          isSelected
                            ? 'bg-nordic-mist text-white border-nordic-mist shadow-xs'
                            : 'bg-pearl/80 hover:bg-pearl text-charcoal border-gray-200'
                        }`}
                      >
                        <span className="font-bold text-xs sm:text-sm block">{p.label}</span>
                        <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-oak-light' : 'text-glacier'}`}>
                          {p.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Aromatherapy Preference */}
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-charcoal mb-1">
                  Complimentary Botanical Aromatherapy:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2">
                  {[
                    { id: 'eucalyptus', label: '🌿 Pure Eucalyptus', desc: 'Invigorating & Airway Clearing' },
                    { id: 'lavender', label: '🌸 French Lavender', desc: 'Calming & Deep Sleep' },
                    { id: 'unscented', label: '💧 Unscented', desc: 'Pure Organic Hypoallergenic Oil' },
                  ].map((a) => {
                    const isSelected = formData.aromatherapyPreference === a.id;
                    const aromaButtonId = `aroma-pref-${a.id}`;
                    return (
                      <button
                        key={a.id}
                        type="button"
                        id={aromaButtonId}
                        onClick={() =>
                          setFormData({
                            ...formData,
                            aromatherapyPreference: a.id as 'eucalyptus' | 'lavender' | 'unscented',
                          })
                        }
                        className={`p-3 rounded-xl border text-left transition-all min-h-11 cursor-pointer ${
                          isSelected
                            ? 'bg-botanical text-white border-botanical shadow-xs'
                            : 'bg-pearl/80 hover:bg-pearl text-charcoal border-gray-200'
                        }`}
                      >
                        <span className="font-bold text-xs sm:text-sm block">{a.label}</span>
                        <span className={`text-[11px] block mt-0.5 ${isSelected ? 'text-pearl/90' : 'text-glacier'}`}>
                          {a.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Alberta PIPA Consent & Policies with Strict HTML Accessibility */}
              <div className="p-4 bg-botanical-light/50 border border-botanical/30 rounded-2xl space-y-3">
                <span className="text-xs font-bold text-botanical uppercase tracking-wider block">
                  Alberta PIPA Informed Consent & Policy Acknowledgement
                </span>

                <div className="flex items-start gap-2.5">
                  <input
                    type="checkbox"
                    id="intake-pipa-consent"
                    name="intakePipaConsent"
                    required
                    checked={formData.pipaConsentAccepted}
                    onChange={(e) => setFormData({ ...formData, pipaConsentAccepted: e.target.checked })}
                    className="w-5 h-5 mt-0.5 rounded-md text-botanical focus:ring-botanical cursor-pointer shrink-0"
                  />
                  <label htmlFor="intake-pipa-consent" className="text-xs text-charcoal leading-relaxed cursor-pointer">
                    I understand that massage therapy is for the purpose of stress reduction, pain relief, and muscular relaxation. It is not a substitute for medical examination or diagnosis. I consent to the confidential collection of my health history in compliance with the <strong>Alberta Personal Information Protection Act (PIPA)</strong>.
                  </label>
                </div>

                <div className="flex items-start gap-2.5 pt-2 border-t border-botanical/20">
                  <input
                    type="checkbox"
                    id="intake-cancellation-policy"
                    name="intakeCancellationPolicy"
                    required
                    checked={formData.cancellationPolicyAccepted}
                    onChange={(e) =>
                      setFormData({ ...formData, cancellationPolicyAccepted: e.target.checked })
                    }
                    className="w-5 h-5 mt-0.5 rounded-md text-botanical focus:ring-botanical cursor-pointer shrink-0"
                  />
                  <label
                    htmlFor="intake-cancellation-policy"
                    className="text-xs text-charcoal leading-relaxed cursor-pointer"
                  >
                    I acknowledge the <strong>24-hour cancellation & rescheduling policy</strong> for mobile in-home appointments in Calgary.
                  </label>
                </div>

                <div className="pt-2">
                  <label htmlFor="intake-signature-name" className="block text-xs font-semibold text-charcoal mb-1">
                    Electronic Client Signature (Type your full name):
                  </label>
                  <input
                    type="text"
                    id="intake-signature-name"
                    name="intakeSignatureName"
                    autoComplete="name"
                    required
                    value={formData.signatureName}
                    onChange={(e) => setFormData({ ...formData, signatureName: e.target.value })}
                    placeholder="e.g. Sarah Miller"
                    className="w-full px-3.5 py-2 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-xs sm:text-sm text-charcoal"
                  />
                </div>
              </div>
            </form>
          )}

          {/* STEP 4: Success & Summary */}
          {step === 4 && isSubmitted && (
            <div className="text-center py-4 sm:py-6 space-y-4">
              <div className="w-14 h-14 bg-botanical-light text-botanical rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                  Health Intake Form Ready!
                </h3>
                <p className="text-glacier text-xs sm:text-sm mt-1 max-w-md mx-auto">
                  Thank you, <strong>{formData.fullName}</strong>. Francis now has your health focus and session preferences on file for your Calgary appointment.
                </p>
              </div>

              {/* Summary Card */}
              <div className="bg-pearl p-4 sm:p-5 rounded-2xl border border-oak/30 text-left text-xs sm:text-sm space-y-2 max-w-md mx-auto">
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-glacier">Focus Areas:</span>
                  <span className="font-semibold text-charcoal text-right">{formData.focusAreas.join(', ')}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-glacier">Preferred Pressure:</span>
                  <span className="font-semibold text-charcoal capitalize">{formData.pressurePreference}</span>
                </div>
                <div className="flex justify-between border-b border-gray-200 pb-2">
                  <span className="text-glacier">Aromatherapy:</span>
                  <span className="font-semibold text-charcoal capitalize">{formData.aromatherapyPreference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-glacier">Consent Signed:</span>
                  <span className="font-semibold text-botanical">✅ PIPA Verified ({formData.completedAt})</span>
                </div>
              </div>

              {/* Send Button via WhatsApp */}
              <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                <button
                  type="button"
                  onClick={handleSendViaWhatsApp}
                  className="w-full flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-botanical hover:bg-botanical/90 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Summary to Francis via WhatsApp</span>
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
          )}
        </div>

        {/* Modal Footer Controls for Steps 1 - 3 */}
        {step <= 3 && (
          <div className="p-4 sm:p-5 bg-pearl/60 border-t border-gray-200 shrink-0 flex items-center justify-between gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-gray-300 text-charcoal hover:bg-gray-100 text-xs sm:text-sm font-medium transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-gray-300 text-glacier hover:bg-gray-100 text-xs sm:text-sm font-medium transition-colors"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              form={`intake-step-${step}`}
              className="flex items-center gap-2 py-2.5 px-5 sm:px-6 rounded-xl bg-nordic-mist hover:bg-nordic-slate text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>{step === 3 ? 'Complete & Sign Intake Form' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
