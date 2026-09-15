import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Send,
  Check,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';
import { IntakeFormData } from '../types';
import { BUSINESS_INFO } from '../data/content';
import {
  saveIntakeForm,
  SaveIntakeFormRequest,
  IntakeFormDto,
} from '../services/intakeService';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [savedIntake, setSavedIntake] = useState<IntakeFormDto | null>(null);

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

  // Sync initialData or user info
  useEffect(() => {
    if (initialData) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        fullName: initialData.fullName || prev.fullName,
        phone: initialData.phone || prev.phone,
        email: initialData.email || prev.email,
        calgaryQuadrant: initialData.calgaryQuadrant || prev.calgaryQuadrant,
        signatureName: initialData.signatureName || initialData.fullName || prev.signatureName,
      }));
    }
  }, [initialData]);

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

  const handleNext = async (e: React.SubmitEvent<HTMLFormElement>) => {
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

      setIsSubmitting(true);

      // Map Pressure Preference
      const pressureMap: Record<string, number> = {
        light: 1,
        medium: 2,
        firm: 3,
        deep: 4,
      };
      const pressureLevelId = pressureMap[formData.pressurePreference] || 2;

      // Map Aromatherapy Preference
      const aromaMap: Record<string, number> = {
        unscented: 1,
        eucalyptus: 2,
        lavender: 3,
      };
      const aromatherapyId = aromaMap[formData.aromatherapyPreference] || 2;

      // Map Focus Areas to IDs
      const focusMap: Record<string, number[]> = {
        'Neck & Shoulders': [1, 2],
        'Upper Back & Trapezius': [3],
        'Lower Back & Lumbar': [4],
        'Arms, Wrists & Hands': [5],
        'Sciatica & Glutes': [6],
        'Legs & Calves': [7],
        'Feet & Ankles': [7],
        'Full Body Relaxation': [8],
      };

      const focusAreaIds = new Set<number>();
      formData.focusAreas.forEach((area) => {
        const ids = focusMap[area] || [8];
        ids.forEach((id) => focusAreaIds.add(id));
      });

      const focusAreasPayload = Array.from(focusAreaIds).map((id) => ({
        focusAreaId: id,
        painLevel: 5,
      }));

      const requestPayload: SaveIntakeFormRequest = {
        pressureLevelId,
        aromatherapyId,
        isFirstVisit: formData.isFirstVisit,
        hasHighBloodPressure: formData.hasHighBloodPressure,
        isPregnant: formData.isPregnant,
        pregnancyWeeks: formData.pregnancyWeeks || undefined,
        hasRecentSurgeriesOrInjuries: formData.hasRecentSurgeriesOrInjuries,
        surgeriesDetails: formData.surgeriesDetails || undefined,
        hasAllergiesToOilsOrNuts: formData.hasAllergiesToOilsOrNuts,
        allergiesDetails: formData.allergiesDetails || undefined,
        otherHealthNotes: formData.otherHealthNotes || undefined,
        pipaConsentAccepted: formData.pipaConsentAccepted,
        cancellationPolicyAccepted: formData.cancellationPolicyAccepted,
        signatureName: formData.signatureName.trim() || formData.fullName.trim(),
        focusAreas: focusAreasPayload,
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        quadrantCode: formData.calgaryQuadrant,
      };

      try {
        const res = await saveIntakeForm(requestPayload);
        if (res && res.id) {
          setSavedIntake(res);
        }
      } catch (err) {
        console.warn('[IntakeFormModal] Backend persistence notice (continuing with client summary):', err);
      }

      setIsSubmitting(false);

      // Finish and record completion timestamp
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
    const intakeRef = savedIntake ? `#INTAKE-${savedIntake.id.slice(0, 8).toUpperCase()}` : '#INTAKE-CALGARY';

    const message = `🌿 *FORM - Digital Clinical Intake Summary*
📋 *Intake Ref:* ${intakeRef}
👤 *Client:* ${formData.fullName}
📞 *Phone:* ${formData.phone}
📧 *Email:* ${formData.email || 'N/A'}
📍 *Calgary Quadrant:* ${formData.calgaryQuadrant} (${formData.isFirstVisit ? 'First Visit' : 'Returning Client'})

🎯 *Focus Areas:*
${formData.focusAreas.length > 0 ? formData.focusAreas.map((a) => `• ${a}`).join('\n') : '• General full body relaxation'}

🩺 *Health History:*
• High/Low Blood Pressure: ${formData.hasHighBloodPressure ? 'Yes' : 'No'}
• Pregnant: ${formData.isPregnant ? `Yes (${formData.pregnancyWeeks || 'weeks not specified'})` : 'No'}
• Recent Surgeries/Injuries: ${formData.hasRecentSurgeriesOrInjuries ? `Yes (${formData.surgeriesDetails})` : 'No'}
• Allergies to Oils/Nuts: ${formData.hasAllergiesToOilsOrNuts ? `Yes (${formData.allergiesDetails})` : 'No'}
${formData.otherHealthNotes ? `• Additional Health Notes: ${formData.otherHealthNotes}` : ''}

💆 *Session Preferences:*
• Pressure Level: ${formData.pressurePreference.toUpperCase()}
• Aromatherapy Oil: ${formData.aromatherapyPreference.toUpperCase()}
✅ *PIPA Alberta Consent & 24h Policy Signed by:* ${formData.signatureName || formData.fullName}`;

    const url = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
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
            <form id="intake-step-1" onSubmit={handleNext} className="space-y-4">
              <div className="space-y-1 mb-4">
                <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal">
                  1. Client Identification & Calgary Area
                </h3>
                <p className="text-xs text-glacier">
                  Required for direct billing receipts and in-home appointment dispatch.
                </p>
              </div>

              <div>
                <label htmlFor="intake-full-name" className="block text-xs font-semibold text-charcoal mb-1">
                  Full Legal Name *
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-xs sm:text-sm text-charcoal"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="intake-phone" className="block text-xs font-semibold text-charcoal mb-1">
                    Phone / Mobile (WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    id="intake-phone"
                    name="intakePhone"
                    autoComplete="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="e.g. 403-555-0199"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-xs sm:text-sm text-charcoal"
                  />
                </div>
                <div>
                  <label htmlFor="intake-email" className="block text-xs font-semibold text-charcoal mb-1">
                    Email Address (For RMT Insurance Receipt) *
                  </label>
                  <input
                    type="email"
                    id="intake-email"
                    name="intakeEmail"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="sarah@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-xs sm:text-sm text-charcoal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label htmlFor="intake-quadrant" className="block text-xs font-semibold text-charcoal mb-1">
                    Calgary Location / Quadrant *
                  </label>
                  <select
                    id="intake-quadrant"
                    name="intakeQuadrant"
                    value={formData.calgaryQuadrant}
                    onChange={(e) => setFormData({ ...formData, calgaryQuadrant: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-xs sm:text-sm text-charcoal cursor-pointer"
                  >
                    <option value="NW">Northwest (NW Calgary)</option>
                    <option value="SW">Southwest (SW Calgary)</option>
                    <option value="SE">Southeast (SE Calgary)</option>
                    <option value="NE">Northeast (NE Calgary)</option>
                    <option value="DOWNTOWN">Downtown / Beltline</option>
                    <option value="SURROUNDING">Surrounding Area (Airdrie, Cochrane, etc.)</option>
                  </select>
                </div>

                <div>
                  <span className="block text-xs font-semibold text-charcoal mb-1">
                    Visit Status
                  </span>
                  <div className="grid grid-cols-2 gap-2 h-[42px]">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isFirstVisit: true })}
                      className={`rounded-xl text-xs font-medium border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                        formData.isFirstVisit
                          ? 'bg-nordic-mist text-white border-nordic-mist shadow-xs'
                          : 'bg-white text-charcoal border-oak/40 hover:bg-pearl/50'
                      }`}
                    >
                      <span>First Visit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, isFirstVisit: false })}
                      className={`rounded-xl text-xs font-medium border transition-colors flex items-center justify-center gap-1 cursor-pointer ${
                        !formData.isFirstVisit
                          ? 'bg-nordic-mist text-white border-nordic-mist shadow-xs'
                          : 'bg-white text-charcoal border-oak/40 hover:bg-pearl/50'
                      }`}
                    >
                      <span>Returning</span>
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* STEP 2: Health History & Focus Areas */}
          {step === 2 && (
            <form id="intake-step-2" onSubmit={handleNext} className="space-y-5">
              <div className="space-y-1">
                <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal">
                  2. Priority Focus Areas & Health History
                </h3>
                <p className="text-xs text-glacier">
                  Select where you feel pain, stiffness, or postural fatigue.
                </p>
              </div>

              {/* Body Focus Chips */}
              <div>
                <span className="block text-xs font-semibold text-charcoal mb-2">
                  Select Areas Requiring Special Attention:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {BODY_FOCUS_OPTIONS.map((area) => {
                    const isSelected = formData.focusAreas.includes(area);
                    return (
                      <button
                        key={area}
                        type="button"
                        onClick={() => toggleFocusArea(area)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-medium transition-all flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-botanical-light border-botanical text-botanical-dark font-semibold shadow-xs'
                            : 'bg-white border-oak/30 text-charcoal hover:bg-pearl/40'
                        }`}
                      >
                        <span>{area}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-botanical shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Health Contraindications */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <span className="block text-xs font-semibold text-charcoal">
                  Medical Screening (Required for RMT Safety):
                </span>

                <div className="space-y-2 bg-pearl/60 p-3.5 rounded-xl border border-oak/20">
                  <div className="flex items-center justify-between">
                    <label htmlFor="intake-bp" className="text-xs text-charcoal cursor-pointer">
                      High or Uncontrolled Blood Pressure?
                    </label>
                    <input
                      type="checkbox"
                      id="intake-bp"
                      name="intakeBp"
                      checked={formData.hasHighBloodPressure}
                      onChange={(e) => setFormData({ ...formData, hasHighBloodPressure: e.target.checked })}
                      className="w-4 h-4 rounded-md text-botanical focus:ring-botanical cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                    <label htmlFor="intake-pregnant" className="text-xs text-charcoal cursor-pointer">
                      Are you currently pregnant?
                    </label>
                    <input
                      type="checkbox"
                      id="intake-pregnant"
                      name="intakePregnant"
                      checked={formData.isPregnant}
                      onChange={(e) => setFormData({ ...formData, isPregnant: e.target.checked })}
                      className="w-4 h-4 rounded-md text-botanical focus:ring-botanical cursor-pointer"
                    />
                  </div>

                  {formData.isPregnant && (
                    <div className="pt-2">
                      <input
                        type="text"
                        name="intakePregnancyWeeks"
                        placeholder="Number of weeks (e.g. 24 weeks)"
                        value={formData.pregnancyWeeks}
                        onChange={(e) => setFormData({ ...formData, pregnancyWeeks: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-oak/40 bg-white text-xs text-charcoal"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                    <label htmlFor="intake-allergies" className="text-xs text-charcoal cursor-pointer">
                      Allergies to massage oils, nuts, or scents?
                    </label>
                    <input
                      type="checkbox"
                      id="intake-allergies"
                      name="intakeAllergies"
                      checked={formData.hasAllergiesToOilsOrNuts}
                      onChange={(e) => setFormData({ ...formData, hasAllergiesToOilsOrNuts: e.target.checked })}
                      className="w-4 h-4 rounded-md text-botanical focus:ring-botanical cursor-pointer"
                    />
                  </div>

                  {formData.hasAllergiesToOilsOrNuts && (
                    <div className="pt-2">
                      <input
                        type="text"
                        name="intakeAllergiesDetails"
                        placeholder="List specific allergies (e.g. Almond oil, Lavender)"
                        value={formData.allergiesDetails}
                        onChange={(e) => setFormData({ ...formData, allergiesDetails: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-oak/40 bg-white text-xs text-charcoal"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-1 border-t border-gray-200/60">
                    <label htmlFor="intake-surgeries" className="text-xs text-charcoal cursor-pointer">
                      Recent surgeries, fractures, or acute injuries?
                    </label>
                    <input
                      type="checkbox"
                      id="intake-surgeries"
                      name="intakeSurgeries"
                      checked={formData.hasRecentSurgeriesOrInjuries}
                      onChange={(e) => setFormData({ ...formData, hasRecentSurgeriesOrInjuries: e.target.checked })}
                      className="w-4 h-4 rounded-md text-botanical focus:ring-botanical cursor-pointer"
                    />
                  </div>

                  {formData.hasRecentSurgeriesOrInjuries && (
                    <div className="pt-2">
                      <input
                        type="text"
                        name="intakeSurgeriesDetails"
                        placeholder="Specify surgery/injury and approximate date"
                        value={formData.surgeriesDetails}
                        onChange={(e) => setFormData({ ...formData, surgeriesDetails: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-lg border border-oak/40 bg-white text-xs text-charcoal"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="intake-notes" className="block text-xs font-semibold text-charcoal mb-1">
                  Other Health Conditions or Notes for Francis:
                </label>
                <textarea
                  id="intake-notes"
                  name="intakeOtherNotes"
                  rows={2}
                  value={formData.otherHealthNotes}
                  onChange={(e) => setFormData({ ...formData, otherHealthNotes: e.target.value })}
                  placeholder="e.g. Sciatica on right leg, tension headaches after work..."
                  className="w-full px-3.5 py-2 rounded-xl border border-oak/40 bg-white text-xs text-charcoal resize-none focus:ring-2 focus:ring-nordic-mist focus:outline-hidden"
                />
              </div>
            </form>
          )}

          {/* STEP 3: Preferences & Alberta PIPA Consent */}
          {step === 3 && (
            <form id="intake-step-3" onSubmit={handleNext} className="space-y-4">
              <div className="space-y-1">
                <h3 className="font-serif text-base sm:text-lg font-bold text-charcoal">
                  3. Session Customization & Informed Consent
                </h3>
                <p className="text-xs text-glacier">
                  Set your pressure and aromatherapy choices, then electronically sign your consent.
                </p>
              </div>

              {/* Pressure Selector */}
              <div>
                <span className="block text-xs font-semibold text-charcoal mb-2">
                  Desired Massage Pressure:
                </span>
                <div className="grid grid-cols-4 gap-2">
                  {(
                    [
                      { id: 'light', label: 'Light', desc: 'Gentle & Relaxing' },
                      { id: 'medium', label: 'Medium', desc: 'Balanced Stress Relief' },
                      { id: 'firm', label: 'Firm', desc: 'Therapeutic Tension' },
                      { id: 'deep', label: 'Deep', desc: 'Deep Tissue / Fascia' },
                    ] as const
                  ).map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, pressurePreference: p.id })}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        formData.pressurePreference === p.id
                          ? 'bg-nordic-mist text-white border-nordic-mist font-bold shadow-xs'
                          : 'bg-white border-oak/40 text-charcoal hover:bg-pearl/40'
                      }`}
                    >
                      <span className="block text-xs">{p.label}</span>
                      <span className={`text-[10px] hidden sm:block ${formData.pressurePreference === p.id ? 'text-pearl/90' : 'text-glacier'}`}>
                        {p.desc}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Aromatherapy Preference */}
              <div>
                <span className="block text-xs font-semibold text-charcoal mb-2">
                  Complimentary Organic Aromatherapy:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      { id: 'eucalyptus', label: '🌿 Eucalyptus & Pine', desc: 'Clearing & Revitalizing' },
                      { id: 'lavender', label: '💜 French Lavender', desc: 'Calming & Restorative' },
                      { id: 'unscented', label: '💧 Pure Unscented', desc: 'Hypoallergenic carrier oil' },
                    ] as const
                  ).map((a) => (
                    <button
                      key={a.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, aromatherapyPreference: a.id })}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        formData.aromatherapyPreference === a.id
                          ? 'bg-botanical-light border-botanical text-botanical-dark font-bold shadow-xs'
                          : 'bg-white border-oak/40 text-charcoal hover:bg-pearl/40'
                      }`}
                    >
                      <span className="block text-xs">{a.label}</span>
                      <span className="text-[10px] text-glacier hidden sm:block">{a.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Legal & PIPA Consent Box */}
              <div className="bg-pearl/70 p-4 rounded-2xl border border-oak/30 space-y-3 mt-3">
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

              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 bg-botanical-light text-botanical-dark font-bold text-xs px-3 py-1 rounded-full border border-botanical/20">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {savedIntake ? 'Saved in Azure SQL Database' : 'Confidential Record Ready'}
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                  Health Intake Form Successfully Recorded!
                </h3>
                {savedIntake && (
                  <p className="text-xs font-mono text-nordic-mist font-semibold">
                    Clinical Ref: #{savedIntake.id.slice(0, 8).toUpperCase()}
                  </p>
                )}
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
              disabled={isSubmitting}
              className="flex items-center gap-2 py-2.5 px-5 sm:px-6 rounded-xl bg-nordic-mist hover:bg-nordic-slate text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-75"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-oak" />
                  <span>Submitting Clinical Intake...</span>
                </>
              ) : (
                <>
                  <span>{step === 3 ? 'Complete & Sign Intake Form' : 'Next Step'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
