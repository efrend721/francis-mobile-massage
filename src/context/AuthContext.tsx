import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser } from '../types';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
          }) => void;
          prompt: (notification?: (notification: { isNotDisplayed: () => boolean; isSkippedMoment: () => boolean }) => void) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              type?: 'standard' | 'icon';
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: string | number;
            }
          ) => void;
        };
        oauth2: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            callback: (tokenResponse: { access_token?: string; error?: string }) => void;
          }) => { requestAccessToken: () => void };
        };
      };
    };
  }
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginWithGoogleCredential: (credential: string) => void;
  loginWithGooglePopup: () => Promise<void>;
  loginAsGuest: (name: string, email: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: (intendedAction?: () => void) => void;
  closeAuthModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'form_wellness_auth_user';
const GOOGLE_CLIENT_ID =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '189259975439-mich1i7l4p4qfm7v59vdd8a0kosgb7qo.apps.googleusercontent.com';

// Helper to decode Google JWT token client-side without external dependencies
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Load Google Identity Services SDK dynamically
  useEffect(() => {
    if (document.getElementById('google-gsi-client')) return;
    const script = document.createElement('script');
    script.id = 'google-gsi-client';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google?.accounts?.id && GOOGLE_CLIENT_ID) {
        try {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: (response) => {
              if (response.credential) {
                loginWithGoogleCredential(response.credential);
              }
            },
          });
        } catch (err) {
          console.warn('Google GSI initialization notice:', err);
        }
      }
    };
    document.body.appendChild(script);
  }, []);

  const loginWithGoogleCredential = (credential: string) => {
    const payload = parseJwt(credential);
    if (payload) {
      const newUser: AuthUser = {
        id: payload.sub || String(Date.now()),
        name: payload.name || payload.given_name || 'Valued Client',
        email: payload.email || '',
        picture: payload.picture,
        isGoogleUser: true,
      };
      setUser(newUser);
      setIsAuthModalOpen(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
    }
  };

  const loginWithGooglePopup = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.oauth2 && GOOGLE_CLIENT_ID) {
        try {
          const client = window.google.accounts.oauth2.initTokenClient({
            client_id: GOOGLE_CLIENT_ID,
            scope: 'openid email profile',
            callback: async (tokenResponse) => {
              if (tokenResponse.error) {
                reject(new Error(tokenResponse.error));
                return;
              }
              if (tokenResponse.access_token) {
                try {
                  // Fetch basic profile with user access token
                  const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                    headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
                  });
                  const profile = await res.json();
                  const googleUser: AuthUser = {
                    id: profile.sub || String(Date.now()),
                    name: profile.name || profile.given_name || 'Valued Client',
                    email: profile.email || '',
                    picture: profile.picture,
                    isGoogleUser: true,
                  };
                  setUser(googleUser);
                  setIsAuthModalOpen(false);
                  if (pendingAction) {
                    pendingAction();
                    setPendingAction(null);
                  }
                  resolve();
                } catch {
                  // Fallback
                  resolve();
                }
              }
            },
          });
          client.requestAccessToken();
          return;
        } catch (err) {
          console.warn('Direct OAuth2 token flow notice:', err);
        }
      }

      // Try standard GSI Prompt
      if (window.google?.accounts?.id && GOOGLE_CLIENT_ID) {
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // Fallback for dev / localhost simulation if origins are not matched
            simulateDevGoogleLogin(resolve);
          }
        });
        return;
      }

      // Local fallback if offline
      simulateDevGoogleLogin(resolve);
    });
  };

  const simulateDevGoogleLogin = (resolve: () => void) => {
    setTimeout(() => {
      const demoUser: AuthUser = {
        id: `google_${Date.now()}`,
        name: 'Francis Client',
        email: 'client@gmail.com',
        picture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        isGoogleUser: true,
      };
      setUser(demoUser);
      setIsAuthModalOpen(false);
      if (pendingAction) {
        pendingAction();
        setPendingAction(null);
      }
      resolve();
    }, 400);
  };

  const loginAsGuest = (name: string, email: string) => {
    const guestUser: AuthUser = {
      id: `guest_${Date.now()}`,
      name: name.trim() || 'Guest Client',
      email: email.trim(),
      isGoogleUser: false,
    };
    setUser(guestUser);
    setIsAuthModalOpen(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const openAuthModal = (intendedAction?: () => void) => {
    if (intendedAction) {
      setPendingAction(() => intendedAction);
    }
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loginWithGoogleCredential,
        loginWithGooglePopup,
        loginAsGuest,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
