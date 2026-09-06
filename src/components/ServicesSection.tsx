import React, { useRef, useState, useEffect } from 'react';
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
  const [activePage, setActivePage] = useState(0);
  const [totalPages, setTotalPages] = useState(2);

  const getItemsPerPage = () => {
    if (typeof window === 'undefined') return 1;
    if (window.innerWidth >= 1024) return 3;
    if (window.innerWidth >= 640) return 2;
    return 1;
  };

  const updatePagination = () => {
    if (sliderRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      const itemsPerPage = getItemsPerPage();
      const pages = Math.ceil(SERVICES_DATA.length / itemsPerPage);
      setTotalPages(pages);

      const children = Array.from(sliderRef.current.children) as HTMLElement[];
      let closestPage = 0;
      let minDistance = Infinity;

      for (let p = 0; p < pages; p++) {
        const targetIndex = Math.min(p * itemsPerPage, children.length - 1);
        if (children[targetIndex]) {
          const distance = Math.abs(children[targetIndex].offsetLeft - scrollLeft);
          if (distance < minDistance) {
            minDistance = distance;
            closestPage = p;
          }
        }
      }

      setActivePage(closestPage);
    }
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener('scroll', updatePagination, { passive: true });
      window.addEventListener('resize', updatePagination);
      updatePagination();
      return () => {
        slider.removeEventListener('scroll', updatePagination);
        window.removeEventListener('resize', updatePagination);
      };
    }
  }, []);

  const slideLeft = () => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const children = Array.from(container.children) as HTMLElement[];
      if (!children.length) return;

      const currentScroll = container.scrollLeft;
      // Find the previous card target with tolerance for smooth snapping
      let targetScroll = 0;
      for (let i = children.length - 1; i >= 0; i--) {
        if (children[i].offsetLeft < currentScroll - 15) {
          targetScroll = children[i].offsetLeft;
          break;
        }
      }

      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const children = Array.from(container.children) as HTMLElement[];
      if (!children.length) return;

      const currentScroll = container.scrollLeft;
      // Find the next card target with tolerance for smooth snapping
      let targetScroll = container.scrollWidth - container.clientWidth;
      for (let i = 0; i < children.length; i++) {
        if (children[i].offsetLeft > currentScroll + 15) {
          targetScroll = children[i].offsetLeft;
          break;
        }
      }

      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  };

  const scrollToPage = (pageIdx: number) => {
    if (sliderRef.current) {
      const container = sliderRef.current;
      const children = Array.from(container.children) as HTMLElement[];
      const itemsPerPage = getItemsPerPage();
      const targetIndex = Math.min(pageIdx * itemsPerPage, children.length - 1);

      if (children[targetIndex]) {
        container.scrollTo({
          left: children[targetIndex].offsetLeft,
          behavior: 'smooth'
        });
      }
    }
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
          className="flex gap-6 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory scroll-smooth select-none items-stretch scroll-p-0"
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
              onClick={() => scrollToPage(idx)}
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
