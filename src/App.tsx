import React, { useState } from 'react';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { DirectBilling } from './components/DirectBilling';
import { ServicesSection } from './components/ServicesSection';
import { Testimonials } from './components/Testimonials';
import { AboutUs } from './components/AboutUs';
import { BookingForm } from './components/BookingForm';
import { IntakeFormBanner } from './components/IntakeFormBanner';
import { FAQSection } from './components/FAQSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { BotanicalDecor } from './components/BotanicalDecor';
import { AuthProvider } from './context/AuthContext';
import { AuthModal } from './components/AuthModal';
import { IntakeFormModal } from './components/IntakeFormModal';
import { IntakeFormData } from './types';

export const AppContent: React.FC = () => {
  const [selectedServiceId, setSelectedServiceId] = useState<string | undefined>();
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [intakeInitialData, setIntakeInitialData] = useState<Partial<IntakeFormData> | undefined>();

  const handleOpenIntakeForm = (data?: Partial<IntakeFormData>) => {
    if (data) {
      setIntakeInitialData(data);
    }
    setIsIntakeModalOpen(true);
  };

  const handleScrollToBooking = (serviceId?: string) => {
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
    const bookingElement = document.getElementById('booking');
    if (bookingElement) {
      // Offset for fixed header
      const headerOffset = 110;
      const elementPosition = bookingElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleScrollToServices = () => {
    const servicesElement = document.getElementById('services');
    if (servicesElement) {
      const headerOffset = 110;
      const elementPosition = servicesElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-pearl text-charcoal relative selection:bg-nordic-mist selection:text-white">
      
      {/* Full-Height Realistic Eucalyptus Garlands along outer margins on desktop/32" screens */}
      <div className="hidden 2xl:block fixed left-1 top-28 bottom-10 w-28 pointer-events-none z-30 opacity-85">
        <BotanicalDecor variant="garland-left" className="w-full h-full drop-shadow-md" />
      </div>
      <div className="hidden 2xl:block fixed right-1 top-28 bottom-10 w-28 pointer-events-none z-30 opacity-85">
        <BotanicalDecor variant="garland-right" className="w-full h-full scale-x-[-1] drop-shadow-md" />
      </div>

      {/* 100% BULLETPROOF FIXED HEADER (TopBar + Navbar remain permanently anchored at the top) */}
      <header className="fixed top-0 left-0 right-0 z-50 shadow-md bg-card-white">
        <TopBar onOpenIntakeForm={() => handleOpenIntakeForm()} />
        <Navbar
          onBookNowClick={() => handleScrollToBooking()}
          onOpenIntakeForm={() => handleOpenIntakeForm()}
        />
      </header>

      {/* Main Content with top padding offsetting the fixed header */}
      <main className="flex-1 pt-[88px] sm:pt-[108px] lg:pt-[116px]">
        {/* Hero Section */}
        <Hero
          onBookClick={() => handleScrollToBooking()}
          onExploreServices={handleScrollToServices}
        />

        {/* Direct Billing & Alberta Insurance Coverage */}
        <DirectBilling />

        {/* Services Section */}
        <ServicesSection onBookService={handleScrollToBooking} />

        {/* Testimonials */}
        <Testimonials />

        {/* About Us */}
        <AboutUs />

        {/* Independent Fast Booking Form */}
        <BookingForm
          preselectedServiceId={selectedServiceId}
          onOpenIntakeForm={handleOpenIntakeForm}
        />

        {/* Optional Client Intake Form Callout */}
        <IntakeFormBanner onOpenIntakeForm={() => handleOpenIntakeForm()} />

        {/* FAQ Accordion */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Pulse Button */}
      <FloatingWhatsApp />

      {/* In-Page Modals */}
      <AuthModal />
      <IntakeFormModal
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        initialData={intakeInitialData}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
