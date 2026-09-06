import React from 'react';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DIRECT_BILLING_INSURERS } from '../data/content';

export const DirectBilling: React.FC = () => {
  return (
    <section className="bg-card-white border-y border-oak/25 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
          
          {/* Text Description */}
          <div className="space-y-1.5 text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold tracking-wider text-botanical uppercase">
              <ShieldCheck className="w-4 h-4 text-botanical" />
              Alberta Insurance Coverage
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-charcoal">
              Hassle-Free Direct Billing for Calgary Clients
            </h2>
            <p className="text-sm text-muted max-w-xl">
              We directly bill major Canadian insurance providers. Official receipts with practitioner license numbers provided for all treatments.
            </p>
          </div>

          {/* Insurer Badges Grid */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {DIRECT_BILLING_INSURERS.map((ins) => (
              <div
                key={ins.name}
                className="px-3.5 py-2 rounded-xl bg-pearl border border-oak/30 text-xs sm:text-sm font-medium text-charcoal flex items-center gap-1.5 shadow-2xs hover:border-nordic-mist transition-colors"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-botanical" />
                <span>{ins.name}</span>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
