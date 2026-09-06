import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { SERVICES_DATA } from '../data/content';
import { ServiceCard } from './ServiceCard';
import { BotanicalDecor } from './BotanicalDecor';

interface ServicesSectionProps {
  onBookService: (serviceId: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onBookService }) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getStep = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const scrollToIndex = useCallback((index: number) => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const validIndex = Math.max(0, Math.min(index, SERVICES_DATA.length - 1));
      const card = container.children[validIndex] as HTMLElement;

      if (card) {
        const containerRect = container.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const targetScroll = container.scrollLeft + (cardRect.left - containerRect.left);

        container.scrollTo({
          left: Math.max(0, targetScroll),
          behavior: 'smooth'
        });
      }
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const { scrollLeft, scrollWidth, clientWidth } = container;

      setCanScrollLeft(scrollLeft > 15);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 15);

      // Find the card whose left edge is closest to container left
      const containerRect = container.getBoundingClientRect();
      const children = Array.from(container.children) as HTMLElement[];

      let closestIdx = 0;
      let minDiff = Infinity;

      children.forEach((child, idx) => {
        const childRect = child.getBoundingClientRect();
        const diff = Math.abs(childRect.left - containerRect.left);
        if (diff < minDiff) {
          minDiff = diff;
          closestIdx = idx;
        }
      });

      setCurrentIndex(closestIdx);
    }
  }, []);

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleScroll);
      handleScroll();

      return () => {
        slider.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      };
    }
  }, [handleScroll]);

  const slideLeft = () => {
    const step = getStep();
    const targetIdx = Math.max(0, currentIndex - step);
    scrollToIndex(targetIdx);
  };

  const slideRight = () => {
    const step = getStep();
    const targetIdx = Math.min(SERVICES_DATA.length - 1, currentIndex + step);
    scrollToIndex(targetIdx);
  };

  // Calculate total pages and active page for pagination dots
  const step = getStep();
  const totalPages = Math.ceil(SERVICES_DATA.length / step);
  const activePage = Math.min(Math.floor(currentIndex / step), totalPages - 1);

  const handleDotClick = (pageIdx: number) => {
    const targetIdx = Math.min(pageIdx * step, SERVICES_DATA.length - 1);
    scrollToIndex(targetIdx);
  };

  return (
    <section id="services" className="relative bg-pearl py-16 sm:py-20 lg:py-28 overflow-hidden">
      
      {/* Prominent Lateral Botanical Branches */}
      <div className="absolute top-1/4 -left-12 w-56 sm:w-72 pointer-events-none opacity-90 z-0">
        <BotanicalDecor variant="branch-left" className="w-full h-auto drop-shadow-md" />
      </div>

      <div className="absolute top-2/3 -right-12 w-56 sm:w-72 pointer-events-none opacity-90 z-0">
        <BotanicalDecor variant="branch-right" className="w-full h-auto drop-shadow-md" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12">
          
          <div className="text-center md:text-left space-y-2 max-w-2xl">
            <span className="text-xs font-bold tracking-widest text-botanical uppercase flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-oak" />
              Our Signature Treatments
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal">
              Personalized Massage Therapy in Calgary
            </h2>
            <p className="text-sm sm:text-base text-muted pt-1">
              Browse our specialized in-home treatments. Swipe or use the arrows to explore our full menu.
            </p>
          </div>

          {/* Slider Navigation Arrows (Right / Left) */}
          <div className="flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={slideLeft}
              disabled={!canScrollLeft}
              aria-label="Previous Massage Treatments"
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                canScrollLeft
                  ? 'bg-card-white text-nordic-mist border-oak/50 hover:bg-nordic-mist hover:text-white shadow-spa-card hover:scale-105 cursor-pointer'
                  : 'bg-pearl text-muted/40 border-oak/20 cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              type="button"
              onClick={slideRight}
              disabled={!canScrollRight}
              aria-label="Next Massage Treatments"
              className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${
                canScrollRight
                  ? 'bg-nordic-mist text-white border-nordic-mist hover:bg-nordic-hover shadow-spa-card hover:scale-105 cursor-pointer'
                  : 'bg-pearl text-muted/40 border-oak/20 cursor-not-allowed opacity-40'
              }`}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

        </div>

        {/* 
          Horizontal Carousel Container:
          - Snap alignment to exact card offsets
          - Equal card heights via items-stretch
        */}
        <div
          ref={sliderRef}
          className="relative flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth select-none items-stretch scroll-p-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {SERVICES_DATA.map((service) => (
            <div
              key={service.id}
              className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 snap-start flex flex-col h-auto"
            >
              <ServiceCard
                service={service}
                onBookThisService={onBookService}
              />
            </div>
          ))}
        </div>

        {/* Responsive Pagination Dots Indicator */}
        <div className="flex items-center justify-center gap-2.5 pt-4">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleDotClick(idx)}
              aria-label={`Go to page ${idx + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                activePage === idx
                  ? 'w-9 bg-nordic-mist shadow-xs'
                  : 'w-2.5 bg-oak/40 hover:bg-oak'
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};
