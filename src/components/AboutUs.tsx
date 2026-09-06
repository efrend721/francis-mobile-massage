import React from 'react';
import { Award, ShieldCheck, Sparkles, HeartHandshake, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO } from '../data/content';
import { BotanicalDecor } from './BotanicalDecor';

export const AboutUs: React.FC = () => {
  return (
    <section id="about" className="relative bg-pearl py-16 sm:py-20 lg:py-28 overflow-hidden">
      
      {/* Prominent Botanical Branch in Top-Left Corner */}
      <div className="absolute -top-8 -left-8 w-64 sm:w-80 pointer-events-none opacity-90 z-0">
        <BotanicalDecor variant="branch-left" className="w-full h-auto drop-shadow-md" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Image & Trust Highlights */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-oak/40 shadow-spa-hover bg-card-white">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=2400&q=85"
                alt="Francis - Certified Massage Therapist Calgary"
                className="w-full h-105 object-cover object-center"
                loading="lazy"
              />
              <div className="p-5 bg-card-white space-y-2 border-t border-oak/20">
                <div className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-botanical" />
                  <span className="font-serif font-bold text-charcoal text-base">{BUSINESS_INFO.therapistName}</span>
                </div>
                <p className="text-xs text-muted font-medium">{BUSINESS_INFO.therapistTitle} • Calgary, AB</p>
              </div>
            </div>
          </div>

          {/* About Text Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-widest text-botanical uppercase block">
                Meet Your Dedicated Therapist
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
                Professional Care & Comfort Delivered to Your Sanctuary
              </h2>
              <BotanicalDecor variant="divider" className="justify-start!" />
            </div>

            <p className="text-base text-muted leading-relaxed">
              Hi, I'm Francis. My mission is simple: to make high-quality therapeutic care deeply relaxing, personalized, and completely stress-free for Calgary residents.
            </p>

            <p className="text-base text-muted leading-relaxed">
              We know that after a restorative massage, the last thing you want is to rush out into the cold Calgary weather or sit in heavy traffic. That's why I bring the full luxury spa experience directly to you—complete with a professional ergonomic table, fresh hospital-grade sanitized linens, organic botanical oils, and soothing ambient soundscapes.
            </p>

            {/* Core Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-card-white border border-oak/30 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-botanical shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-charcoal">Alberta Certified & Insured</span>
              </div>
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-card-white border border-oak/30 shadow-2xs">
                <Sparkles className="w-5 h-5 text-oak shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-charcoal">Clinical Hygiene Standards</span>
              </div>
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-card-white border border-oak/30 shadow-2xs">
                <CheckCircle2 className="w-5 h-5 text-nordic-mist shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-charcoal">Punctual In-Home Setup</span>
              </div>
              <div className="flex items-center gap-2.5 p-3.5 rounded-2xl bg-card-white border border-oak/30 shadow-2xs">
                <HeartHandshake className="w-5 h-5 text-botanical shrink-0" />
                <span className="text-xs sm:text-sm font-semibold text-charcoal">Tailored Treatment Goals</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
