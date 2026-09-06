import React from 'react';
import { Clock, Sparkles, Calendar, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../types';
import { BotanicalDecor } from './BotanicalDecor';

interface ServiceCardProps {
  service: ServiceItem;
  onBookThisService: (serviceId: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBookThisService }) => {
  return (
    <div className="bg-card-white rounded-3xl overflow-hidden border border-oak/40 shadow-spa-card hover:shadow-spa-hover hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between h-full group relative">
      
      {/* Top Image with fixed uniform height */}
      <div className="relative h-52 sm:h-56 shrink-0 overflow-hidden bg-pearl">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {service.badge && (
          <div className="absolute top-3 right-3 bg-card-white/95 backdrop-blur-xs border border-oak/30 text-nordic-mist text-xs font-semibold px-3 py-1 rounded-full shadow-xs flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-oak" />
            {service.badge}
          </div>
        )}

        {/* Decorative leaf accent on card top */}
        <div className="absolute -bottom-2 -left-2 w-16 opacity-90 pointer-events-none z-10">
          <BotanicalDecor variant="card-accent" className="w-full h-auto drop-shadow-sm" />
        </div>
      </div>

      {/* Content Area with equal vertical spacing across all cards */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        
        {/* Title, Tagline & Description with standardized heights */}
        <div className="space-y-2.5 flex-1 flex flex-col">
          {/* Title with locked 2-line height block for perfect horizontal alignment */}
          <h3 className="font-serif text-xl font-bold text-charcoal min-h-[3.25rem] flex items-center group-hover:text-nordic-mist transition-colors leading-snug">
            {service.title}
          </h3>

          {/* Tagline */}
          <p className="text-xs font-semibold text-botanical uppercase tracking-wider min-h-[1.25rem] flex items-center">
            {service.tagline}
          </p>

          {/* Description */}
          <p className="text-sm text-muted leading-relaxed flex-1 pt-1">
            {service.description}
          </p>
        </div>

        {/* Durations, Pricing & CTA Button locked to the exact bottom baseline */}
        <div className="pt-4 border-t border-oak/20 space-y-3 mt-auto">
          <div className="flex items-center justify-between text-xs text-muted min-h-[1.5rem]">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3.5 h-3.5 text-botanical shrink-0" />
              <span>Available: {service.durations.join(' • ')}</span>
            </span>
            <span className="font-serif font-bold text-base text-charcoal shrink-0">
              {service.pricing}
            </span>
          </div>

          {/* Book This Treatment CTA */}
          <button
            onClick={() => onBookThisService(service.id)}
            className="w-full bg-pearl hover:bg-nordic-mist text-nordic-mist hover:text-white font-semibold py-3 px-4 rounded-xl border border-oak/40 transition-all flex items-center justify-center gap-2 text-sm shadow-2xs group/btn cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-oak" />
            <span>Book This Treatment</span>
            <ArrowRight className="w-4 h-4 opacity-0 group-hover/btn:opacity-100 group-hover/btn:translate-x-1 transition-all" />
          </button>
        </div>

      </div>

    </div>
  );
};
