import React from 'react';
import { ShieldCheck, MessageCircle, Calendar, Sparkles, MapPin } from 'lucide-react';
import { BUSINESS_INFO } from '../data/content';
import { BotanicalDecor } from './BotanicalDecor';

interface HeroProps {
  onBookClick: () => void;
  onExploreServices: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookClick, onExploreServices }) => {
  const whatsappUrl = `https://wa.me/${BUSINESS_INFO.whatsappNumber}?text=Hi%20Francis,%20I'd%20like%20to%20inquire%20about%20an%20in-home%20massage%20in%20Calgary.`;

  return (
    <section id="hero" className="relative overflow-hidden bg-pearl pt-10 pb-16 lg:py-24">
      
      {/* Prominent Realistic Botanical Branches in top corners */}
      <div className="absolute -top-4 -left-4 w-52 sm:w-72 lg:w-96 pointer-events-none z-10 opacity-95 transition-transform duration-700 hover:scale-105">
        <BotanicalDecor variant="branch-left" className="w-full h-auto drop-shadow-md" />
      </div>

      <div className="absolute -top-4 -right-4 w-52 sm:w-72 lg:w-96 pointer-events-none z-10 opacity-95 transition-transform duration-700 hover:scale-105">
        <BotanicalDecor variant="branch-right" className="w-full h-auto drop-shadow-md" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-botanical-light/90 border border-botanical/40 text-botanical-dark text-xs sm:text-sm font-semibold tracking-wide shadow-xs backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-botanical" />
              <span>Registered Mobile Massage Therapy • Calgary, AB</span>
            </div>

            {/* Main H1 Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-charcoal tracking-tight leading-[1.15]">
              Restore Your Balance, Relieve Pain & Enjoy Pure Relaxation at Home.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg lg:text-xl text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Customized therapeutic, deep tissue, and relaxation massage therapy brought directly to your doorstep in Calgary. No traffic, no stress—just restorative care in your own sanctuary.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-nordic-mist hover:bg-nordic-hover text-white font-semibold px-7 py-4 rounded-xl shadow-spa-card hover:shadow-spa-hover hover:-translate-y-0.5 transition-all text-base border border-oak/30"
              >
                <MessageCircle className="w-5 h-5 text-oak" />
                Book via WhatsApp
              </a>

              <button
                onClick={onBookClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card-white hover:bg-oak-light text-charcoal font-semibold px-7 py-4 rounded-xl shadow-xs border border-oak/40 hover:-translate-y-0.5 transition-all text-base"
              >
                <Calendar className="w-5 h-5 text-nordic-mist" />
                Request Online Booking
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 border-t border-oak/30 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal/90 font-medium">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-botanical shrink-0" />
                <span>Alberta Certified</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal/90 font-medium">
                <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-oak shrink-0" />
                <span>Direct Billing</span>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-charcoal/90 font-medium">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-nordic-slate shrink-0" />
                <span>All Calgary Areas</span>
              </div>
            </div>

          </div>

          {/* Right Column: Hero High-Res Image with Framing Foliage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Card foliage corner overlay */}
              <div className="absolute -top-8 -right-8 w-28 sm:w-32 z-30 pointer-events-none">
                <BotanicalDecor variant="card-accent" className="w-full h-auto drop-shadow-md" />
              </div>

              {/* Main Image with border and shadow */}
              <div className="relative rounded-3xl overflow-hidden border-2 border-oak/40 shadow-spa-hover bg-card-white">
                <img
                  src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=2400&q=85"
                  alt="In-Home Luxury Mobile Massage Therapy Calgary"
                  className="w-full h-[380px] sm:h-[460px] object-cover object-center transform hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                
                {/* Overlay Badge */}
                <div className="absolute bottom-4 left-4 right-4 bg-card-white/95 backdrop-blur-md p-4 rounded-2xl border border-oak/30 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-botanical uppercase tracking-wider">In-Home Spa Setup</p>
                      <p className="text-sm font-semibold text-charcoal">Ergonomic Table, Linens & Oils Included</p>
                    </div>
                    <button
                      onClick={onExploreServices}
                      className="text-xs bg-nordic-mist text-white font-medium px-3 py-1.5 rounded-lg hover:bg-nordic-hover transition-colors shrink-0"
                    >
                      View Menu
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
