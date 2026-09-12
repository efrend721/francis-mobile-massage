import React from 'react';
import { Phone, Clock, ShieldCheck, UserCheck, LogIn } from 'lucide-react';
import { BUSINESS_INFO } from '../data/content';
import { useAuth } from '../context/AuthContext';

export const TopBar: React.FC = () => {
  const { user, openAuthModal, logout } = useAuth();

  return (
    <div className="bg-nordic-dark text-pearl/90 text-[11px] sm:text-xs md:text-sm py-1.5 sm:py-2 px-3 sm:px-6 border-b border-nordic-slate/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        
        {/* Left: Calgary Location & Direct Billing */}
        <div className="flex items-center gap-2 sm:gap-4 truncate">
          <span className="flex items-center gap-1 sm:gap-1.5 font-medium text-oak-light truncate">
            <ShieldCheck className="w-3.5 h-3.5 text-oak shrink-0" />
            <span className="truncate">Calgary, AB • Direct Billing</span>
          </span>
          <span className="hidden lg:flex items-center gap-1.5 text-pearl/70 shrink-0">
            <Clock className="w-3.5 h-3.5 text-botanical" />
            Mon – Sat: 8am – 8pm
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
              <span className="text-oak-light truncate max-w-[90px] sm:max-w-[120px] font-medium">{user.name.split(' ')[0]}</span>
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

