import React, { useState, useRef, useEffect } from 'react';
import { Phone, Clock, MapPin, UserCheck, LogIn, Navigation, Check, ChevronDown } from 'lucide-react';
import { BUSINESS_INFO } from '../data/content';
import { useAuth } from '../context/AuthContext';
import { useLocation } from '../context/LocationContext';

export const TopBar: React.FC = () => {
  const { user, openAuthModal, logout } = useAuth();
  const { location, isDetecting, detectLocation, setManualQuadrant } = useLocation();
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const locationMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (locationMenuRef.current && !locationMenuRef.current.contains(e.target as Node)) {
        setIsLocationMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const quadrants = [
    { id: 'SW', label: 'Southwest (SW Calgary)' },
    { id: 'NW', label: 'Northwest (NW Calgary)' },
    { id: 'SE', label: 'Southeast (SE Calgary)' },
    { id: 'NE', label: 'Northeast (NE Calgary)' },
    { id: 'Airdrie', label: 'Airdrie & Surrounding' },
  ] as const;

  return (
    <div className="bg-nordic-dark text-pearl/90 text-[11px] sm:text-xs md:text-sm py-1.5 sm:py-2 px-3 sm:px-6 border-b border-nordic-slate/30 relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Dynamic Calgary Location & Operating Hours */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Location Interactive Dropdown */}
          <div className="relative" ref={locationMenuRef}>
            <button
              type="button"
              id="location-menu-button"
              onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
              className="flex items-center gap-1 sm:gap-1.5 font-medium text-oak-light hover:text-white transition-colors cursor-pointer py-0.5 rounded-sm"
              title="Click to change quadrant or detect location"
            >
              <MapPin className={`w-3.5 h-3.5 text-oak shrink-0 ${isDetecting ? 'animate-bounce' : ''}`} />
              <span className="truncate max-w-[130px] sm:max-w-none">{location.displayText}</span>
              <ChevronDown className={`w-3 h-3 text-oak/70 shrink-0 transition-transform duration-200 ${isLocationMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isLocationMenuOpen && (
              <div
                id="location-dropdown-menu"
                className="absolute left-0 top-full mt-2 w-72 sm:w-80 bg-white text-charcoal rounded-xl shadow-2xl border border-oak/30 p-3 space-y-2.5 z-50 animate-fade-in text-xs"
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-nordic-mist" />
                    <span className="font-bold text-charcoal">Calgary Service Area</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      detectLocation();
                      setIsLocationMenuOpen(false);
                    }}
                    className="flex items-center gap-1 text-[11px] text-botanical hover:text-botanical-dark font-semibold hover:underline cursor-pointer bg-botanical/10 px-2 py-0.5 rounded"
                  >
                    <Navigation className={`w-3 h-3 ${isDetecting ? 'animate-spin' : ''}`} />
                    <span>{isDetecting ? 'Detecting...' : 'Auto-detect GPS'}</span>
                  </button>
                </div>

                <div className="space-y-1">
                  {quadrants.map((q) => {
                    const isSelected = location.quadrant === q.id;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => {
                          setManualQuadrant(q.id);
                          setIsLocationMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer text-xs ${
                          isSelected ? 'bg-nordic-mist text-white font-semibold shadow-xs' : 'hover:bg-pearl text-charcoal'
                        }`}
                      >
                        <span>{q.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-oak-light shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                <div className="text-[10px] text-glacier border-t border-gray-100 pt-1.5 flex items-center justify-between">
                  <span>Cached in your browser for 24h</span>
                  <button
                    type="button"
                    onClick={() => {
                      setManualQuadrant('SW');
                      setIsLocationMenuOpen(false);
                    }}
                    className="text-botanical hover:text-charcoal underline text-[10px] cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}
          </div>

          <span className="flex items-center gap-1 sm:gap-1.5 text-pearl/75 shrink-0">
            <Clock className="w-3.5 h-3.5 text-botanical shrink-0" />
            <span className="truncate">Mon – Sat: 8am – 8pm</span>
          </span>
        </div>

        {/* Right: Phone & Login / User Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
          <a
            href={`tel:${BUSINESS_INFO.phoneFormatted}`}
            className="flex items-center gap-1 sm:gap-1.5 text-oak hover:text-white transition-colors font-bold sm:font-semibold"
            aria-label="Call Francis Mobile Massage Calgary"
          >
            <Phone className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{BUSINESS_INFO.phoneFormatted}</span>
            <span className="sm:hidden">Call</span>
          </a>

          {user ? (
            <div className="flex items-center gap-1.5 pl-2 sm:pl-3 border-l border-white/20">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-5 h-5 rounded-full border border-oak shrink-0"
                />
              ) : (
                <UserCheck className="w-4 h-4 text-oak shrink-0" />
              )}
              <span className="text-oak-light truncate max-w-22.5 sm:max-w-30 font-medium">{user.name.split(' ')[0]}</span>
              <button
                type="button"
                onClick={logout}
                className="text-[11px] text-pearl/60 hover:text-white hover:underline ml-1 cursor-pointer"
                title="Sign out"
              >
                (Exit)
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => openAuthModal()}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-oak-light hover:text-white transition-colors pl-2 sm:pl-3 border-l border-white/20 cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-oak shrink-0" />
              <span>Login</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
