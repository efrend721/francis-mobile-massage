import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { TESTIMONIALS_DATA } from '../data/content';
import { BotanicalDecor } from './BotanicalDecor';

export const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="relative bg-card-white py-16 sm:py-20 lg:py-24 border-y border-oak/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12 sm:mb-16">
          <span className="text-xs font-bold tracking-widest text-botanical uppercase block">
            Client Experiences
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            Trusted by Calgary Residents
          </h2>
          <div className="flex items-center justify-center gap-1 pt-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-oak text-oak" />
            ))}
            <span className="text-sm font-bold text-charcoal ml-2">5.0 Star Average Rating</span>
          </div>
          <BotanicalDecor variant="divider" />
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS_DATA.map((test) => (
            <div
              key={test.id}
              className="bg-pearl p-6 sm:p-8 rounded-2xl border border-oak/30 shadow-spa-card relative flex flex-col justify-between hover:-translate-y-1 transition-transform"
            >
              <Quote className="w-8 h-8 text-oak/40 absolute top-4 right-4" />
              
              <div className="space-y-4">
                <div className="flex items-center gap-1">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-oak text-oak" />
                  ))}
                </div>
                <p className="text-sm text-charcoal/90 leading-relaxed italic">
                  "{test.review}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-6 mt-6 border-t border-oak/20">
                <img
                  src={test.avatar}
                  alt={test.clientName}
                  className="w-11 h-11 rounded-full object-cover border border-oak"
                  loading="lazy"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-charcoal text-sm">{test.clientName}</span>
                    <CheckCircle className="w-3.5 h-3.5 text-botanical" />
                  </div>
                  <p className="text-xs text-muted">{test.location}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
