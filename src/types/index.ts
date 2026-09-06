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
