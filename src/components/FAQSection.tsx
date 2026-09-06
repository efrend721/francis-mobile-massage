import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { FAQ_DATA } from '../data/content';
import { BotanicalDecor } from './BotanicalDecor';

export const FAQSection: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_DATA[0].id);

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq" className="relative bg-pearl py-16 sm:py-20 lg:py-24 border-t border-oak/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-bold tracking-widest text-botanical uppercase block">
            Got Questions?
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-charcoal">
            Frequently Asked Questions
          </h2>
          <BotanicalDecor variant="divider" />
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {FAQ_DATA.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="bg-card-white rounded-2xl border border-oak/30 overflow-hidden shadow-2xs transition-all"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-hidden hover:bg-pearl/50 transition-colors"
                >
                  <span className="font-serif font-bold text-base sm:text-lg text-charcoal flex items-center gap-2.5">
                    <HelpCircle className="w-5 h-5 text-botanical shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-oak transition-transform duration-300 shrink-0 ${
                      isOpen ? 'rotate-180 text-nordic-mist' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 sm:pb-6 text-sm text-muted leading-relaxed border-t border-oak/10 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
