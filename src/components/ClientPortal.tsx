import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Edit3,
  XCircle,
  RefreshCw,
  User,
  HeartPulse,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthButton } from './GoogleAuthButton';
import { BotanicalDecor } from './BotanicalDecor';
import {
  AppointmentDto,
  getMyAppointments,
  cancelAppointment,
} from '../services/appointmentService';
import {
  IntakeFormDto,
  getMyLatestIntake,
} from '../services/intakeService';
import { getServices } from '../services/catalogService';
import { IntakeFormData, ServiceItem } from '../types';
import { BUSINESS_INFO, SERVICES_DATA } from '../data/content';
import { EditAppointmentModal } from './EditAppointmentModal';

interface ClientPortalProps {
  onOpenBooking: (serviceId?: string) => void;
  onOpenIntakeForm: (initialData?: Partial<IntakeFormData>) => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  onOpenBooking,
  onOpenIntakeForm,
}) => {
  const { user, isAuthenticated, loginWithGooglePopup } = useAuth();
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history' | 'intake'>('upcoming');

  const [appointments, setAppointments] = useState<AppointmentDto[]>([]);
  const [intakeForm, setIntakeForm] = useState<IntakeFormDto | null>(null);
  const [services, setServices] = useState<ServiceItem[]>(SERVICES_DATA);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedAppointmentToEdit, setSelectedAppointmentToEdit] = useState<AppointmentDto | null>(null);
  const [appointmentToCancel, setAppointmentToCancel] = useState<AppointmentDto | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  // Load services catalog
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

  // Fetch client data when authenticated
  const loadClientData = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const [apptsData, intakeData] = await Promise.all([
        getMyAppointments().catch(() => []),
        getMyLatestIntake().catch(() => null),
      ]);
      setAppointments(apptsData || []);
      setIntakeForm(intakeData);
    } catch (err) {
      console.warn('[ClientPortal] Error loading client data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadClientData();
  }, [loadClientData]);

  // Filter appointments
  const upcomingAppointments = useMemo(() => {
    return appointments.filter(
      (a) => a.statusCode.toUpperCase() !== 'COMPLETED' && a.statusCode.toUpperCase() !== 'CANCELLED'
    );
  }, [appointments]);

  const pastAppointments = useMemo(() => {
    return appointments.filter(
      (a) => a.statusCode.toUpperCase() === 'COMPLETED' || a.statusCode.toUpperCase() === 'CANCELLED'
    );
  }, [appointments]);

  // Handle Cancellation
  const handleConfirmCancel = async () => {
    if (!appointmentToCancel) return;
    setIsCancelling(true);
    try {
      const cancelled = await cancelAppointment(appointmentToCancel.id);
      setAppointments((prev) =>
        prev.map((a) => (a.id === cancelled.id ? { ...a, statusCode: 'CANCELLED', statusName: 'Cancelled' } : a))
      );

      // Open optional WhatsApp cancellation notice
      const apptDate = new Date(appointmentToCancel.scheduledAt);
      const dateFormatted = apptDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      const timeFormatted = apptDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

      const message = `🌿 *FORM WELLNESS — APPOINTMENT CANCELLATION*
 
📋 *CANCELLED SESSION*
🏷️ Ref Code: *#FW-${appointmentToCancel.id.slice(0, 8).toUpperCase()}*
💆 Service: *${appointmentToCancel.serviceTitle}*
📅 Original Time: *${dateFormatted} at ${timeFormatted}*
🏡 Address: *${appointmentToCancel.serviceAddress}*

_Thank you for your understanding._`;

      const url = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      setAppointmentToCancel(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Could not cancel appointment.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle Edit Update
  const handleAppointmentUpdated = (updated: AppointmentDto) => {
    setAppointments((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
  };

  // Map latest intake to form format for editing
  const handleEditIntakeForm = () => {
    if (!intakeForm) {
      onOpenIntakeForm({
        fullName: user?.name || '',
        email: user?.email || '',
      });
      return;
    }

    const focusAreasList = intakeForm.focusAreas.map((fa) => fa.focusAreaName);

    onOpenIntakeForm({
      fullName: intakeForm.clientName || user?.name || '',
      email: user?.email || '',
      isFirstVisit: intakeForm.isFirstVisit,
      hasHighBloodPressure: intakeForm.hasHighBloodPressure,
      isPregnant: intakeForm.isPregnant,
      pregnancyWeeks: intakeForm.pregnancyWeeks || '',
      hasRecentSurgeriesOrInjuries: intakeForm.hasRecentSurgeriesOrInjuries,
      surgeriesDetails: intakeForm.surgeriesDetails || '',
      hasAllergiesToOilsOrNuts: intakeForm.hasAllergiesToOilsOrNuts,
      allergiesDetails: intakeForm.allergiesDetails || '',
      otherHealthNotes: intakeForm.otherHealthNotes || '',
      pressurePreference: (intakeForm.pressureLevelName?.toLowerCase().includes('deep')
        ? 'deep'
        : intakeForm.pressureLevelName?.toLowerCase().includes('firm')
        ? 'firm'
        : intakeForm.pressureLevelName?.toLowerCase().includes('light')
        ? 'light'
        : 'medium') as 'light' | 'medium' | 'firm' | 'deep',
      aromatherapyPreference: (intakeForm.aromatherapyName?.toLowerCase().includes('lavender')
        ? 'lavender'
        : intakeForm.aromatherapyName?.toLowerCase().includes('unscented')
        ? 'unscented'
        : 'eucalyptus') as 'eucalyptus' | 'lavender' | 'unscented',
      signatureName: intakeForm.signatureName,
      focusAreas: focusAreasList.length > 0 ? focusAreasList : ['Neck & Shoulders', 'Lower Back & Lumbar'],
    });
  };

  return (
    <section id="my-bookings" className="relative bg-pearl py-16 sm:py-20 lg:py-24 border-t border-oak/30 scroll-mt-28">
      {/* Decorative Botanical Branch */}
      <div className="absolute top-0 left-0 w-32 sm:w-44 pointer-events-none opacity-20 z-0">
        <BotanicalDecor variant="branch-left" className="w-full h-auto drop-shadow-sm" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-1.5 bg-botanical-light/70 text-botanical-dark px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-botanical/20 shadow-xs">
            <Sparkles className="w-3.5 h-3.5" />
            Client Wellness Portal
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal tracking-tight">
            My Appointments & Health Record
          </h2>
          <BotanicalDecor variant="divider" />
          <p className="text-xs sm:text-sm text-muted max-w-md mx-auto leading-relaxed">
            Manage your scheduled in-home treatments, review past appointments, and keep your confidential clinical intake up to date.
          </p>
        </div>

        {!isAuthenticated ? (
          /* Unauthenticated Banner */
          <div className="bg-card-white rounded-3xl p-8 sm:p-12 border border-oak/40 shadow-spa-card text-center max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="w-16 h-16 bg-botanical-light text-botanical rounded-full flex items-center justify-center mx-auto shadow-md">
              <User className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
                Access Your Personal Booking Dashboard
              </h3>
              <p className="text-xs sm:text-sm text-glacier max-w-md mx-auto leading-relaxed">
                Sign in with Google to view your upcoming appointments in Calgary, modify scheduled dates, review insurance receipts, and access your clinical history.
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <GoogleAuthButton
                onClick={loginWithGooglePopup}
                text="Sign in with Google to View Portal"
                className="py-3.5! px-6! text-sm! font-bold! shadow-md! cursor-pointer!"
              />
              <button
                type="button"
                onClick={() => onOpenBooking()}
                className="w-full sm:w-auto py-3 px-5 rounded-xl border border-oak/40 hover:border-oak text-charcoal text-xs sm:text-sm font-semibold transition-colors cursor-pointer bg-pearl/40"
              >
                Schedule New Appointment
              </button>
            </div>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="space-y-6">
            {/* Client Profile Overview Ribbon */}
            <div className="bg-card-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-oak/40 shadow-spa-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                {user?.picture ? (
                  <img
                    src={user.picture}
                    alt={user.name}
                    className="w-12 h-12 rounded-full border-2 border-botanical/40 object-cover shadow-xs"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-botanical text-white flex items-center justify-center font-serif text-lg font-bold shadow-xs">
                    {user?.name.charAt(0) || 'C'}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-bold text-charcoal">{user?.name}</h3>
                    <span className="inline-flex items-center gap-1 bg-botanical-light text-botanical text-[10px] font-bold px-2 py-0.5 rounded-full border border-botanical/20">
                      <ShieldCheck className="w-3 h-3" /> Verified Client
                    </span>
                  </div>
                  <p className="text-xs text-glacier">{user?.email}</p>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="flex items-center gap-2 sm:gap-4 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-gray-100">
                <div className="text-center px-3 py-1.5 rounded-xl bg-pearl/60 border border-oak/20 min-w-[90px]">
                  <span className="text-[10px] text-glacier block font-medium">Upcoming</span>
                  <span className="text-sm font-bold text-charcoal font-mono">{upcomingAppointments.length}</span>
                </div>
                <div className="text-center px-3 py-1.5 rounded-xl bg-pearl/60 border border-oak/20 min-w-[90px]">
                  <span className="text-[10px] text-glacier block font-medium">Past History</span>
                  <span className="text-sm font-bold text-charcoal font-mono">{pastAppointments.length}</span>
                </div>
                <div className="text-center px-3 py-1.5 rounded-xl bg-pearl/60 border border-oak/20 min-w-[110px]">
                  <span className="text-[10px] text-glacier block font-medium">Health Intake</span>
                  <span className={`text-[11px] font-bold ${intakeForm ? 'text-botanical' : 'text-amber-600'}`}>
                    {intakeForm ? '✓ Verified' : '⚠️ Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-oak/30 pb-2 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('upcoming')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'upcoming'
                    ? 'bg-nordic-mist text-white shadow-xs'
                    : 'bg-card-white text-charcoal hover:bg-white border border-oak/20'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>Upcoming Appointments ({upcomingAppointments.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'history'
                    ? 'bg-nordic-mist text-white shadow-xs'
                    : 'bg-card-white text-charcoal hover:bg-white border border-oak/20'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>Session History ({pastAppointments.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('intake')}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeTab === 'intake'
                    ? 'bg-nordic-mist text-white shadow-xs'
                    : 'bg-card-white text-charcoal hover:bg-white border border-oak/20'
                }`}
              >
                <FileText className="w-4 h-4" />
                <span>Clinical Intake Record</span>
              </button>

              <button
                type="button"
                onClick={loadClientData}
                className="ml-auto p-2 rounded-xl text-glacier hover:text-charcoal hover:bg-white transition-colors cursor-pointer"
                title="Refresh bookings"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-botanical' : ''}`} />
              </button>
            </div>

            {/* TAB CONTENT */}

            {/* 1. UPCOMING APPOINTMENTS */}
            {activeTab === 'upcoming' && (
              <div className="space-y-4">
                {upcomingAppointments.length === 0 ? (
                  <div className="bg-card-white p-8 rounded-3xl border border-oak/30 text-center space-y-4 shadow-xs">
                    <div className="w-12 h-12 bg-pearl rounded-full flex items-center justify-center mx-auto text-glacier">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-serif text-base sm:text-lg font-bold text-charcoal">No Upcoming Treatments Scheduled</h4>
                      <p className="text-xs text-glacier mt-1 max-w-sm mx-auto">
                        Ready to relax in the comfort of your home? Book your next therapeutic session with Francis.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenBooking()}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-nordic-mist hover:bg-nordic-slate text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4 text-oak" />
                      <span>Book In-Home Massage Now</span>
                    </button>
                  </div>
                ) : (
                  upcomingAppointments.map((appt) => {
                    const apptDate = new Date(appt.scheduledAt);
                    const formattedDate = apptDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });
                    const formattedTime = apptDate.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    });

                    const isConfirmed = appt.statusCode.toUpperCase() === 'CONFIRMED';

                    return (
                      <div
                        key={appt.id}
                        className="bg-card-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-oak/40 shadow-spa-card hover:shadow-spa-hover transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                      >
                        {/* Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                                isConfirmed
                                  ? 'bg-botanical-light text-botanical-dark border border-botanical/30'
                                  : 'bg-amber-50 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {isConfirmed ? '● Confirmed Session' : '● Scheduled (Pending)'}
                            </span>
                            <span className="text-xs font-mono font-semibold text-glacier">
                              Ref: #FW-{appt.id.slice(0, 8).toUpperCase()}
                            </span>
                          </div>

                          <h4 className="font-serif text-lg sm:text-xl font-bold text-charcoal">
                            {appt.serviceTitle}
                          </h4>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 text-xs text-charcoal">
                            <div className="flex items-center gap-1.5 text-muted">
                              <Calendar className="w-3.5 h-3.5 text-botanical" />
                              <span className="font-semibold text-charcoal">{formattedDate}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted">
                              <Clock className="w-3.5 h-3.5 text-botanical" />
                              <span className="font-semibold text-charcoal">
                                {formattedTime} ({appt.durationMinutes} min)
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-muted sm:col-span-2">
                              <MapPin className="w-3.5 h-3.5 text-botanical shrink-0" />
                              <span className="truncate">
                                {appt.serviceAddress} {appt.postalCode ? `(${appt.postalCode})` : ''} • {appt.quadrantName || 'Calgary'}
                              </span>
                            </div>
                          </div>

                          {appt.clientSpecialNotes && (
                            <p className="text-[11px] text-glacier bg-pearl/60 p-2 rounded-lg border border-oak/20 max-w-xl">
                              <strong>Notes:</strong> {appt.clientSpecialNotes}
                            </p>
                          )}
                        </div>

                        {/* Price & Action Buttons */}
                        <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-gray-100">
                          <span className="text-base font-bold font-mono text-charcoal text-right">
                            ${Math.round(appt.price)} CAD
                          </span>

                          <div className="flex items-center gap-2 w-full md:w-auto">
                            <button
                              type="button"
                              onClick={() => setSelectedAppointmentToEdit(appt)}
                              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-oak/40 hover:border-oak hover:bg-pearl/50 text-xs font-semibold text-charcoal transition-all cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-botanical" />
                              <span>Reschedule</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => setAppointmentToCancel(appt)}
                              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 hover:bg-red-50 text-xs font-semibold text-red-600 transition-all cursor-pointer"
                            >
                              <XCircle className="w-3.5 h-3.5" />
                              <span>Cancel</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 2. TREATMENT HISTORY */}
            {activeTab === 'history' && (
              <div className="space-y-4">
                {pastAppointments.length === 0 ? (
                  <div className="bg-card-white p-8 rounded-3xl border border-oak/30 text-center space-y-2 shadow-xs">
                    <Clock className="w-8 h-8 text-glacier mx-auto" />
                    <h4 className="font-serif text-base font-bold text-charcoal">No Past Sessions Recorded</h4>
                    <p className="text-xs text-glacier">Your completed treatment history and receipts will appear here.</p>
                  </div>
                ) : (
                  pastAppointments.map((appt) => {
                    const apptDate = new Date(appt.scheduledAt);
                    const formattedDate = apptDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    });
                    const isCompleted = appt.statusCode.toUpperCase() === 'COMPLETED';

                    return (
                      <div
                        key={appt.id}
                        className="bg-card-white rounded-2xl p-4 sm:p-5 border border-oak/30 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 opacity-90"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                isCompleted
                                  ? 'bg-blue-50 text-nordic-mist border border-blue-200'
                                  : 'bg-gray-100 text-gray-600 border border-gray-200'
                              }`}
                            >
                              {isCompleted ? '✓ Completed' : 'Cancelled'}
                            </span>
                            <span className="text-xs font-mono text-glacier">
                              #FW-{appt.id.slice(0, 8).toUpperCase()}
                            </span>
                          </div>
                          <h4 className="font-serif text-base font-bold text-charcoal">{appt.serviceTitle}</h4>
                          <p className="text-xs text-glacier">
                            {formattedDate} • {appt.durationMinutes} min • {appt.serviceAddress}
                          </p>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span className="text-sm font-mono font-bold text-charcoal">${Math.round(appt.price)}</span>
                          <button
                            type="button"
                            onClick={() => onOpenBooking(appt.serviceId.toString())}
                            className="text-xs font-bold text-botanical hover:underline cursor-pointer"
                          >
                            Book Again →
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 3. CLINICAL INTAKE RECORD */}
            {activeTab === 'intake' && (
              <div className="bg-card-white rounded-3xl p-6 sm:p-8 border border-oak/40 shadow-spa-card space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-oak/20 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-xl font-bold text-charcoal">Digital Clinical Intake & Health Record</h3>
                      <span className="text-xs bg-botanical-light text-botanical font-semibold px-2.5 py-0.5 rounded-full border border-botanical/20">
                        Alberta PIPA Compliant
                      </span>
                    </div>
                    <p className="text-xs text-glacier mt-0.5">
                      Confidential health screening and therapy preferences on file for your registered massage sessions.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleEditIntakeForm}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-nordic-mist hover:bg-nordic-slate text-white text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer shrink-0"
                  >
                    <Edit3 className="w-4 h-4 text-oak" />
                    <span>{intakeForm ? 'Update Health Record' : 'Fill Intake Form'}</span>
                  </button>
                </div>

                {intakeForm ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Preferences & Areas */}
                    <div className="space-y-4 bg-pearl/60 p-5 rounded-2xl border border-oak/20">
                      <span className="text-xs font-bold text-botanical uppercase tracking-wider block">
                        Session Preferences
                      </span>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between border-b border-gray-200/70 pb-1.5">
                          <span className="text-glacier">Massage Pressure:</span>
                          <span className="font-semibold text-charcoal">{intakeForm.pressureLevelName || 'Medium'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200/70 pb-1.5">
                          <span className="text-glacier">Aromatherapy Oil:</span>
                          <span className="font-semibold text-charcoal">{intakeForm.aromatherapyName || 'Eucalyptus'}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200/70 pb-1.5">
                          <span className="text-glacier">Client Visit Type:</span>
                          <span className="font-semibold text-charcoal">{intakeForm.isFirstVisit ? 'First Visit' : 'Returning'}</span>
                        </div>
                        <div className="pt-1">
                          <span className="text-glacier block mb-1">Target Focus Areas:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {intakeForm.focusAreas.map((fa) => (
                              <span
                                key={fa.focusAreaId}
                                className="text-[11px] bg-card-white border border-botanical/30 text-charcoal px-2.5 py-1 rounded-lg font-medium"
                              >
                                {fa.focusAreaName}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Health Screening */}
                    <div className="space-y-4 bg-pearl/60 p-5 rounded-2xl border border-oak/20">
                      <span className="text-xs font-bold text-botanical uppercase tracking-wider block">
                        Health & Safety Screening
                      </span>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between border-b border-gray-200/70 pb-1.5">
                          <span className="text-glacier">Blood Pressure Alert:</span>
                          <span className={`font-semibold ${intakeForm.hasHighBloodPressure ? 'text-amber-700' : 'text-charcoal'}`}>
                            {intakeForm.hasHighBloodPressure ? 'Yes (Noted)' : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200/70 pb-1.5">
                          <span className="text-glacier">Pregnancy:</span>
                          <span className="font-semibold text-charcoal">
                            {intakeForm.isPregnant ? `Yes (${intakeForm.pregnancyWeeks || 'weeks unspecified'})` : 'No'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200/70 pb-1.5">
                          <span className="text-glacier">Allergies (Oils/Nuts):</span>
                          <span className="font-semibold text-charcoal">
                            {intakeForm.hasAllergiesToOilsOrNuts ? `Yes (${intakeForm.allergiesDetails || 'Listed'})` : 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between border-b border-gray-200/70 pb-1.5">
                          <span className="text-glacier">Surgeries / Injuries:</span>
                          <span className="font-semibold text-charcoal">
                            {intakeForm.hasRecentSurgeriesOrInjuries ? `Yes (${intakeForm.surgeriesDetails || 'Listed'})` : 'None'}
                          </span>
                        </div>
                        <div className="flex justify-between pt-1">
                          <span className="text-glacier">Electronic Consent:</span>
                          <span className="font-semibold text-botanical">
                            ✅ PIPA Verified ({intakeForm.signatureName})
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-3 bg-pearl/50 rounded-2xl border border-dashed border-oak/40">
                    <HeartPulse className="w-8 h-8 text-botanical mx-auto" />
                    <h4 className="font-serif text-base font-bold text-charcoal">No Health Intake Form on File</h4>
                    <p className="text-xs text-glacier max-w-sm mx-auto">
                      Complete your 90-second digital intake so Francis can prepare your personalized therapy session in advance.
                    </p>
                    <button
                      type="button"
                      onClick={handleEditIntakeForm}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-botanical text-white text-xs font-bold shadow-xs hover:bg-botanical/90 transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-oak" />
                      <span>Complete Intake Form (1 Min)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Reschedule / Edit Modal */}
      <EditAppointmentModal
        isOpen={Boolean(selectedAppointmentToEdit)}
        onClose={() => setSelectedAppointmentToEdit(null)}
        appointment={selectedAppointmentToEdit}
        onUpdated={handleAppointmentUpdated}
        services={services}
      />

      {/* Cancel Confirmation Modal */}
      {appointmentToCancel && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-nordic-dark/70 backdrop-blur-md animate-fade-in"
        >
          <div className="bg-card-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-oak/40 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="font-serif text-xl font-bold text-charcoal">Cancel In-Home Appointment?</h3>
              <p className="text-xs text-glacier leading-relaxed">
                Are you sure you want to cancel your <strong>{appointmentToCancel.serviceTitle}</strong> on{' '}
                <strong>{new Date(appointmentToCancel.scheduledAt).toLocaleDateString()}</strong>?
              </p>
              <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                Please note Calgary's <strong>24-hour cancellation policy</strong>. Francis will be notified on WhatsApp.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setAppointmentToCancel(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-charcoal hover:bg-gray-100 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                Keep Appointment
              </button>

              <button
                type="button"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer disabled:opacity-70 flex items-center justify-center gap-1.5"
              >
                {isCancelling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Cancelling...</span>
                  </>
                ) : (
                  <span>Yes, Cancel</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
