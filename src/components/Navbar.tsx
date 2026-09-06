import React, { useState } from 'react';
import { Menu, X, Sparkles, Calendar } from 'lucide-react';
import { BUSINESS_INFO } from '../data/content';

interface NavbarProps {
  onBookNowClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookNowClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Services', href: '#services' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'About Us', href: '#about' },
    { name: 'FAQ', href: '#faq' },
    { name: 'Intake Form', href: '#intake-form-info', isSpecial: true },
  ];

  const handleNavLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 110;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-card-white/98 backdrop-blur-md border-b border-oak/20 shadow-xs relative">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-20">
          
          {/* Brand Logo */}
          <a href="#hero" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-2xl bg-nordic-mist text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
              <Sparkles className="w-4 h-4 sm:w-6 sm:h-6 text-oak-light" />
            </div>
            <div>
              <span className="font-serif text-base sm:text-2xl font-bold tracking-tight text-charcoal block leading-none">
                {BUSINESS_INFO.brandName}
              </span>
              <span className="text-[9px] sm:text-xs text-botanical font-semibold tracking-wider uppercase block mt-0.5 sm:mt-1">
                {BUSINESS_INFO.brandSubtitle}
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavLinkClick(link.href);
                }}
                className={`text-sm font-medium transition-colors ${
                  link.isSpecial
                    ? 'text-botanical hover:text-nordic-mist font-semibold'
                    : 'text-charcoal/85 hover:text-nordic-mist'
                }`}
              >
                {link.name}
              </a>
            ))}

            {/* Primary Action CTA */}
            <button
              onClick={onBookNowClick}
              className="bg-nordic-mist hover:bg-nordic-hover text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-spa-card hover:shadow-spa-hover hover:-translate-y-0.5 transition-all flex items-center gap-2 border border-oak/30"
            >
              <Calendar className="w-4 h-4 text-oak" />
              Book Now
            </button>
          </nav>

          {/* Mobile Actions: Fast Book Button + Hamburger Toggle */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={onBookNowClick}
              className="bg-nordic-mist hover:bg-nordic-hover text-white text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1 shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5 text-oak" />
              <span>Book</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-charcoal rounded-lg hover:bg-pearl focus:outline-hidden"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6 text-nordic-mist" /> : <Menu className="w-6 h-6 text-charcoal" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu (Anchored directly under fixed header) */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-card-white border-b-2 border-oak/30 px-4 pt-3 pb-6 space-y-2 shadow-2xl animate-fadeIn max-h-[calc(100vh-120px)] overflow-y-auto">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleNavLinkClick(link.href);
              }}
              className="block px-3 py-2.5 rounded-xl text-base font-semibold text-charcoal hover:bg-pearl hover:text-nordic-mist transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onBookNowClick();
            }}
            className="w-full bg-nordic-mist text-white font-bold py-3.5 rounded-xl shadow-md flex items-center justify-center gap-2 mt-4 text-sm"
          >
            <Calendar className="w-4 h-4 text-oak" />
            Book In-Home Appointment
          </button>
        </div>
      )}
    </div>
  );
};
