import { ServiceItem, TestimonialItem, FAQItem } from '../types';

export const BUSINESS_INFO = {
  brandName: "FORM",
  brandSubtitle: "Recovery & Wellness",
  tagline: "Experience deep relaxation and lasting pain relief in the comfort of your home.",
  phone: "+1 (403) 396-4233",
  phoneFormatted: "+1 403-396-4233",
  whatsappNumber: "14033964233",
  email: "info@recoverywellnesscalgary.ca",
  location: "Calgary, Alberta, Canada",
  serviceAreas: ["Northwest (NW)", "Southwest (SW)", "Northeast (NE)", "Southeast (SE)", "Airdrie & Surrounding Areas"],
  hours: "Monday - Saturday: 8:00 AM - 8:00 PM | Sunday: By Advance Appointment",
  directBillingText: "Direct Billing Available for Alberta Residents (Sun Life, Manulife, Alberta Blue Cross, Canada Life, Green Shield & more)",
  intakeFormUrl: "#intake-form-info",
  therapistName: "Francis",
  therapistTitle: "Certified Registered Massage Practitioner",
};

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: "swedish-relaxation",
    title: "Swedish & Relaxation Massage",
    tagline: "Unwind, de-stress, and recharge your body and mind.",
    description: "A soothing full-body massage using smooth, rhythmic gliding strokes to calm the nervous system, stimulate circulation, and alleviate daily tension in your home.",
    durations: ["60 min", "90 min", "120 min"],
    pricing: "From $115",
    badge: "Most Popular",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=2400&q=85",
  },
  {
    id: "deep-tissue",
    title: "Deep Tissue & Therapeutic Massage",
    tagline: "Targeted relief for persistent tightness, knots, and chronic pain.",
    description: "Focused firm pressure aimed at deeper muscle layers and connective tissues. Ideal for relieving neck stiffness, lower back pain, and posture fatigue from work or sports.",
    durations: ["60 min", "90 min", "120 min"],
    pricing: "From $125",
    badge: "Therapeutic Focus",
    icon: "Activity",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=2400&q=85",
  },
  {
    id: "hot-stone",
    title: "Hot Stone Therapy",
    tagline: "Deep thermal relaxation with natural volcanic basalt stones.",
    description: "Heated smooth volcanic basalt stones massaged over tight muscles, melting away deep-seated tension, boosting circulation, and promoting total tranquility.",
    durations: ["75 min", "90 min"],
    pricing: "From $140",
    badge: "Deep Thermal Warmth",
    icon: "Flame",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=2400&q=85",
  },
  {
    id: "prenatal-massage",
    title: "Prenatal Massage (Expecting Mothers)",
    tagline: "Nurturing, safe care designed specifically for mothers-to-be.",
    description: "Gentle and supportive techniques using specialized ergonomic positioning to ease lower back strain, reduce leg swelling, and promote restful sleep throughout pregnancy.",
    durations: ["60 min", "75 min"],
    pricing: "From $120",
    badge: "Gentle & Safe",
    icon: "HeartHandshake",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=2400&q=85",
  },
  {
    id: "aromatherapy-bliss",
    title: "Aromatherapy Bliss Massage",
    tagline: "A multi-sensory journey with pure therapeutic essential oils.",
    description: "Custom botanical aromatherapy blends (eucalyptus, French lavender, bergamot) combined with therapeutic bodywork to restore emotional balance and soothe tight muscles.",
    durations: ["60 min", "90 min"],
    pricing: "From $125",
    badge: "Botanical Essence",
    icon: "Leaf",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=2400&q=85",
  },
  {
    id: "trigger-point",
    title: "Trigger Point & Sports Recovery",
    tagline: "Targeted myofascial release for athletes and active lifestyles.",
    description: "Focused pressure on neuromuscular trigger points to dissolve stubborn referral pain, restore range of motion, and accelerate post-workout muscular recovery.",
    durations: ["60 min", "90 min"],
    pricing: "From $130",
    badge: "Performance & Rehab",
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=2400&q=85",
  },
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: "test-1",
    clientName: "Sarah M.",
    location: "SW Calgary (Aspen Woods)",
    serviceReceived: "Deep Tissue & Mobile Massage",
    rating: 5,
    review: "Having Francis come to my home after a long exhausting work week was the absolute best decision. The massage table was top tier, the setup was spotless and calming, and my chronic shoulder pain was gone without having to brave Calgary traffic afterward.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "test-2",
    clientName: "David K.",
    location: "NW Calgary (Tuscany)",
    serviceReceived: "Sports Recovery & Trigger Point",
    rating: 5,
    review: "Exceptional deep tissue massage! Francis arrived exactly on time, brought fresh clinical linens, and knew precisely how to release my lower back tightness. Direct billing through my Alberta Blue Cross was seamless. Highly recommended!",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: "test-3",
    clientName: "Elena R.",
    location: "SE Calgary (Mahogany)",
    serviceReceived: "Prenatal & Relaxation Massage",
    rating: 5,
    review: "The prenatal massage was heaven for my hips and lower back in my third trimester. Francis made sure I was completely supported and comfortable with pillows throughout the entire session. 10/10 service in Calgary!",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
  },
];

export const FAQ_DATA: FAQItem[] = [
  {
    id: "faq-1",
    question: "How does the mobile in-home massage service work?",
    answer: "We bring the complete 5-star luxury spa experience directly to your home in Calgary. We provide a professional ergonomic massage table, fresh sanitized hospital-grade linens, organic massage oils, therapeutic heating elements, and relaxing ambient music. All you need to provide is a quiet space of approximately 2x2 meters.",
  },
  {
    id: "faq-2",
    question: "Do you offer Direct Billing to insurance plans in Alberta?",
    answer: "Yes! We can directly bill most major Canadian insurance providers including Alberta Blue Cross, Sun Life, Manulife, Canada Life, Green Shield Canada, Desjardins, and Chambers Plan. If your specific policy requires manual submission, we provide detailed official receipts immediately.",
  },
  {
    id: "faq-3",
    question: "Is the Client Intake Form mandatory before booking?",
    answer: "No! You can reserve your appointment slot immediately via our quick booking form or WhatsApp. Completing the digital Health Intake Form beforehand is completely optional and simply saves a few minutes of consultation time when we arrive.",
  },
  {
    id: "faq-4",
    question: "What areas of Calgary do you cover for mobile service?",
    answer: "We provide mobile in-home massage therapy across all quadrants of Calgary including Northwest (NW), Southwest (SW), Northeast (NE), and Southeast (SE), as well as select surrounding communities such as Airdrie.",
  },
  {
    id: "faq-5",
    question: "What is your cancellation and rescheduling policy?",
    answer: "We kindly ask for at least 24 hours' notice if you need to reschedule or cancel your appointment. This allows us to offer the reserved time slot to another client in Calgary.",
  },
];

export const DIRECT_BILLING_INSURERS = [
  { name: "Alberta Blue Cross", logoText: "Alberta Blue Cross" },
  { name: "Sun Life", logoText: "Sun Life Financial" },
  { name: "Manulife", logoText: "Manulife" },
  { name: "Canada Life", logoText: "Canada Life (Great-West Life)" },
  { name: "Green Shield Canada", logoText: "Green Shield Canada" },
  { name: "Desjardins", logoText: "Desjardins Insurance" },
];
