import React from 'react';
import { Phone, Clock, FileText, ShieldCheck } from 'lucide-react';
import { BUSINESS_INFO } from '../data/content';

export const TopBar: React.FC = () => {
  return (
    <div className="bg-nordic-dark text-pearl/90 text-[11px] sm:text-xs md:text-sm py-1.5 sm:py-2 px-3 sm:px-6 border-b border-nordic-slate/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Calgary Location & Direct Billing */}
        <div className="flex items-center gap-2 sm:gap-4 truncate">
          <span className="flex items-center gap-1 sm:gap-1.5 font-medium text-oak-light truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-oak shrink-0" />
            <span className="truncate">Calgary, AB • Direct Billing</span>
          </span>
          <span className="hidden lg:flex items-center gap-1.5 text-pearl/70 shrink-0">
            <Clock className="w-3.5 h-3.5 text-botanical" />
            Mon – Sat: 8am – 8pm
          </span>
        </div>

        {/* Right: Phone & Client Intake Form */}
        <div className="flex items-center gap-3 sm:gap-5 shrink-0">
          <a
            href={`tel:${BUSINESS_INFO.phoneFormatted}`}
            className="flex items-center gap-1 sm:gap-1.5 text-oak hover:text-white transition-colors font-bold sm:font-semibold"
            aria-label="Call Francis Mobile Massage Calgary"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span>{BUSINESS_INFO.phoneFormatted}</span>
          </a>

          <a
            href="#intake-form-info"
            className="hidden sm:flex items-center gap-1 text-pearl/80 hover:text-white transition-colors underline underline-offset-2 decoration-oak/60"
          >
            <FileText className="w-3.5 h-3.5 text-oak" />
            Intake Form
          </a>
        </div>

      </div>
    </div>
  );
};
