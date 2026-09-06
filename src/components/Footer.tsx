import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../data/content';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-nordic-dark text-pearl/80 border-t-2 border-oak/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Col 1: Brand & Tagline */}
          <div className="space-y-3">
            <h4 className="font-serif text-2xl font-bold text-white tracking-tight">
              {BUSINESS_INFO.brandName}
            </h4>
            <p className="text-xs text-oak-light font-medium uppercase tracking-wider">
              {BUSINESS_INFO.brandSubtitle}
            </p>
            <p className="text-xs text-pearl/70 leading-relaxed">
              Professional mobile massage therapy delivered to homes in Calgary, Alberta. Registered, certified, and committed to your wellness.
            </p>
          </div>

          {/* Col 2: Direct Contact */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-nordic-slate/40 pb-2">
              Contact & Booking
            </h5>
            <ul className="space-y-2.5 text-xs text-pearl/80">
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-oak shrink-0" />
                <a href={`tel:${BUSINESS_INFO.phoneFormatted}`} className="hover:text-white transition-colors">
                  {BUSINESS_INFO.phoneFormatted}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-oak shrink-0" />
                <a href={`mailto:${BUSINESS_INFO.email}`} className="hover:text-white transition-colors">
                  {BUSINESS_INFO.email}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-oak shrink-0" />
                <span>{BUSINESS_INFO.location}</span>
              </li>
            </ul>
          </div>

          {/* Col 3: Calgary Coverage Areas */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-nordic-slate/40 pb-2">
              Calgary Service Areas
            </h5>
            <ul className="space-y-1.5 text-xs text-pearl/70">
              {BUSINESS_INFO.serviceAreas.map((area) => (
                <li key={area}>• {area}</li>
              ))}
            </ul>
          </div>

          {/* Col 4: Legal & Intake Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider border-b border-nordic-slate/40 pb-2">
              Quick & Legal Links
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#intake-form-info" className="text-oak hover:underline flex items-center gap-1">
                  Client Intake Form (PIPA)
                </a>
              </li>
              <li>
                <a href="#services" className="text-pearl/70 hover:text-white">
                  Signature Massage Menu
                </a>
              </li>
              <li>
                <a href="#about" className="text-pearl/70 hover:text-white">
                  About Francis
                </a>
              </li>
              <li>
                <a href="#faq" className="text-pearl/70 hover:text-white">
                  24h Cancellation Policy
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: PIPA Notice & Copyright */}
        <div className="pt-8 border-t border-nordic-slate/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-pearl/60">
          <p>
            © {new Date().getFullYear()} {BUSINESS_INFO.brandName}. All rights reserved. Registered Massage Services in Calgary, AB.
          </p>
          <div className="flex items-center gap-1.5 text-oak-light text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-botanical" />
            <span>Health Information Protected under Alberta PIPA</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
