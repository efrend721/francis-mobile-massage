import React, { useState, useEffect } from 'react';
import { X, Sparkles, User, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { GoogleAuthButton } from './GoogleAuthButton';
import { BUSINESS_INFO } from '../data/content';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginWithGooglePopup, loginAsGuest } = useAuth();
  const [isGuestMode, setIsGuestMode] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestEmail, setGuestEmail] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  const handleGoogleClick = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      await loginWithGooglePopup();
    } catch {
      setErrorMsg('Google sign-in encountered an issue. You may continue as a guest below.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!guestName.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    loginAsGuest(guestName, guestEmail);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-nordic-dark/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        className="bg-card-white rounded-2xl sm:rounded-3xl shadow-2xl border border-oak/30 w-full max-w-md overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-linear-to-r from-nordic-mist to-nordic-slate text-white p-5 sm:p-6 relative">
          <button
            type="button"
            onClick={closeAuthModal}
            className="absolute top-4 right-4 p-2 rounded-full text-pearl/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close authentication modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-oak-light text-xs font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{BUSINESS_INFO.brandName} • {BUSINESS_INFO.brandSubtitle}</span>
          </div>

          <h2 id="auth-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-white">
            Quick Identification
          </h2>
          <p className="text-pearl/80 text-xs sm:text-sm mt-1">
            Sign in to auto-fill your booking & access your Health Intake Form.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 space-y-5">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm rounded-xl">
              {errorMsg}
            </div>
          )}

          {!isGuestMode ? (
            <div className="space-y-4">
              {/* Google 1-Click Button */}
              <div className="space-y-2">
                <GoogleAuthButton onClick={handleGoogleClick} isLoading={isLoading} />
                <p className="text-[11px] sm:text-xs text-glacier text-center">
                  Instant, secure access. We never share your personal information.
                </p>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-gray-200 w-full" />
                <span className="bg-card-white px-3 text-xs text-glacier uppercase tracking-wider font-medium shrink-0">
                  Or continue manually
                </span>
              </div>

              {/* Guest Button */}
              <button
                type="button"
                onClick={() => setIsGuestMode(true)}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-oak/50 bg-pearl hover:bg-oak/10 text-charcoal font-medium text-sm sm:text-base transition-colors cursor-pointer"
              >
                <User className="w-4 h-4 text-botanical" />
                <span>Continue as Guest</span>
                <ArrowRight className="w-4 h-4 text-glacier ml-auto" />
              </button>
            </div>
          ) : (
            /* Guest Mode Form with Strict HTML Accessibility */
            <form onSubmit={handleGuestSubmit} className="space-y-4">
              <div>
                <label htmlFor="auth-guest-name" className="block text-xs sm:text-sm font-semibold text-charcoal mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="auth-guest-name"
                  name="authGuestName"
                  autoComplete="name"
                  required
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="e.g. Sarah Miller"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-sm text-charcoal transition-all"
                />
              </div>

              <div>
                <label htmlFor="auth-guest-email" className="block text-xs sm:text-sm font-semibold text-charcoal mb-1">
                  Email Address <span className="text-glacier text-xs font-normal">(Optional for direct billing)</span>
                </label>
                <input
                  type="email"
                  id="auth-guest-email"
                  name="authGuestEmail"
                  autoComplete="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                  placeholder="e.g. sarah@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-sm text-charcoal transition-all"
                />
              </div>

              <div>
                <label htmlFor="auth-guest-phone" className="block text-xs sm:text-sm font-semibold text-charcoal mb-1">
                  Phone Number <span className="text-glacier text-xs font-normal">(For appointment confirmation)</span>
                </label>
                <input
                  type="tel"
                  id="auth-guest-phone"
                  name="authGuestPhone"
                  autoComplete="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="e.g. +1 (403) 555-0199"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-oak/40 bg-white focus:ring-2 focus:ring-nordic-mist focus:outline-hidden text-sm text-charcoal transition-all"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGuestMode(false)}
                  className="w-1/3 py-2.5 px-3 rounded-xl border border-gray-300 text-glacier text-xs sm:text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="w-2/3 py-2.5 px-4 rounded-xl bg-nordic-mist hover:bg-nordic-slate text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Continue to Form
                </button>
              </div>
            </form>
          )}

          {/* Privacy Footnote */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-glacier pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-botanical shrink-0" />
            <span>Alberta PIPA Compliant • Secure & Confidential</span>
          </div>
        </div>
      </div>
    </div>
  );
};
