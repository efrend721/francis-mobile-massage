import React from 'react';
import { FileText, Shield, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO } from '../data/content';

export const IntakeFormBanner: React.FC = () => {
  return (
    <section id="intake-form-info" className="bg-pearl py-12 sm:py-16 border-t border-oak/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-card-white p-6 sm:p-8 rounded-3xl border border-oak/40 shadow-spa-card space-y-5">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-botanical uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                Optional Self-Service
              </div>
              <h3 className="font-serif text-2xl font-bold text-charcoal">
                Already Booked? Complete Your Health History Online
              </h3>
            </div>

            <a
              href={`https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hi%20Francis,%20I%20would%20like%20the%20digital%20Intake%20Form%20link.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-botanical-light hover:bg-botanical text-botanical-dark hover:text-white font-semibold px-4 py-2.5 rounded-xl border border-botanical/30 transition-all text-xs sm:text-sm shrink-0 shadow-2xs"
            >
              <FileText className="w-4 h-4" />
              Request Digital Form Link
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          <p className="text-sm text-muted leading-relaxed">
            To maximize your hands-on massage time, you are welcome to optionally complete our quick digital Health Intake Form before your appointment. You can also complete it on-site upon arrival with Francis.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-oak/20 text-xs text-charcoal/90">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-botanical shrink-0" />
              <span>100% Confidential (PIPA)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-botanical shrink-0" />
              <span>Takes less than 2 minutes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-botanical shrink-0" />
              <span>Saves initial consultation time</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
