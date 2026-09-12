export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  durations: string[];
  pricing: string;
  badge?: string;
  icon: string;
  image: string;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  location: string;
  serviceReceived: string;
  rating: number;
  review: string;
  avatar: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface BookingFormData {
  serviceId: string;
  duration: string;
  fullName: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  addressArea: string;
  specialNotes: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  picture?: string;
  isGoogleUser: boolean;
}

export interface IntakeFormData {
  fullName: string;
  phone: string;
  email: string;
  calgaryQuadrant: string;
  isFirstVisit: boolean;
  focusAreas: string[];
  hasHighBloodPressure: boolean;
  isPregnant: boolean;
  pregnancyWeeks: string;
  hasRecentSurgeriesOrInjuries: boolean;
  surgeriesDetails: string;
  hasAllergiesToOilsOrNuts: boolean;
  allergiesDetails: string;
  otherHealthNotes: string;
  pressurePreference: 'light' | 'medium' | 'firm' | 'deep';
  aromatherapyPreference: 'eucalyptus' | 'lavender' | 'unscented';
  pipaConsentAccepted: boolean;
  cancellationPolicyAccepted: boolean;
  signatureName: string;
  completedAt?: string;
}

