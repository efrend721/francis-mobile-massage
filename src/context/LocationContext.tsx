import React, { createContext, useContext, useState, useEffect } from 'react';

export interface UserLocation {
  displayText: string;
  city: string;
  province: string;
  quadrant?: 'SW' | 'NW' | 'SE' | 'NE' | 'Airdrie';
  neighborhood?: string;
  isDetected: boolean;
  expiresAt: number;
}

interface LocationContextType {
  location: UserLocation;
  isDetecting: boolean;
  detectLocation: () => Promise<void>;
  setManualQuadrant: (quadrant: 'SW' | 'NW' | 'SE' | 'NE' | 'Airdrie') => void;
  resetToDefault: () => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = 'form_wellness_user_location';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const DEFAULT_LOCATION: UserLocation = {
  displayText: 'Calgary, AB • SW',
  city: 'Calgary',
  province: 'AB',
  quadrant: 'SW',
  isDetected: false,
  expiresAt: 0,
};

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyA1_EOOkixjNehiZbNu1qstgi6IXhZxePM';

// Helper to determine Calgary quadrant from coordinates or address string
function determineCalgaryQuadrant(lat: number, lng: number, formattedAddress: string): 'SW' | 'NW' | 'SE' | 'NE' | undefined {
  const upper = formattedAddress.toUpperCase();
  if (upper.includes(' SW ') || upper.includes(', SW') || upper.endsWith(' SW')) return 'SW';
  if (upper.includes(' NW ') || upper.includes(', NW') || upper.endsWith(' NW')) return 'NW';
  if (upper.includes(' SE ') || upper.includes(', SE') || upper.endsWith(' SE')) return 'SE';
  if (upper.includes(' NE ') || upper.includes(', NE') || upper.endsWith(' NE')) return 'NE';

  // Centre Street (lng approx -114.062) divides East/West
  // Centre Ave / Bow River (lat approx 51.050) divides North/South
  const isNorth = lat >= 51.048;
  const isEast = lng >= -114.062;

  if (isNorth && !isEast) return 'NW';
  if (isNorth && isEast) return 'NE';
  if (!isNorth && !isEast) return 'SW';
  if (!isNorth && isEast) return 'SE';

  return undefined;
}

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<UserLocation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: UserLocation = JSON.parse(saved);
        // Verify cache TTL expiration
        if (parsed.expiresAt && Date.now() < parsed.expiresAt) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return DEFAULT_LOCATION;
  });

  const [isDetecting, setIsDetecting] = useState(false);

  // Auto-detect silently on mount if not yet detected
  useEffect(() => {
    if (!location.isDetected && typeof navigator !== 'undefined' && 'permissions' in navigator) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName }).then((result) => {
        if (result.state === 'granted') {
          detectLocation();
        }
      }).catch(() => {
        // Ignore permission query error
      });
    }
  }, []);

  const saveLocation = (newLoc: UserLocation) => {
    setLocation(newLoc);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLoc));
    } catch {
      // Ignore storage quota
    }
  };

  const detectLocation = async (): Promise<void> => {
    if (!navigator.geolocation) {
      return;
    }

    setIsDetecting(true);

    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            // Call Google Maps Geocoding API
            const response = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
            );

            if (!response.ok) {
              throw new Error('Geocoding request failed');
            }

            const data = await response.json();

            if (data.results && data.results.length > 0) {
              const firstResult = data.results[0];
              const formattedAddress: string = firstResult.formatted_address || '';

              let cityName = 'Calgary';
              let provinceCode = 'AB';
              let neighborhoodName = '';

              for (const comp of firstResult.address_components) {
                if (comp.types.includes('locality')) {
                  cityName = comp.short_name || comp.long_name;
                }
                if (comp.types.includes('administrative_area_level_1')) {
                  provinceCode = comp.short_name || 'AB';
                }
                if (comp.types.includes('neighborhood') || comp.types.includes('sublocality')) {
                  neighborhoodName = comp.short_name || comp.long_name;
                }
              }

              const isCalgary = cityName.toLowerCase().includes('calgary');
              const isAirdrie = cityName.toLowerCase().includes('airdrie');

              let quadrant: 'SW' | 'NW' | 'SE' | 'NE' | 'Airdrie' | undefined;
              let displayText = `${cityName}, ${provinceCode}`;

              if (isCalgary) {
                const detectedQuadrant = determineCalgaryQuadrant(latitude, longitude, formattedAddress);
                quadrant = detectedQuadrant;
                displayText = detectedQuadrant ? `Calgary, AB • ${detectedQuadrant}` : 'Calgary, AB';
              } else if (isAirdrie) {
                quadrant = 'Airdrie';
                displayText = 'Airdrie & Calgary Area';
              }

              const resolvedLocation: UserLocation = {
                displayText,
                city: cityName,
                province: provinceCode,
                quadrant,
                neighborhood: neighborhoodName,
                isDetected: true,
                expiresAt: Date.now() + CACHE_TTL_MS,
              };

              saveLocation(resolvedLocation);
            }
          } catch (err) {
            console.warn('Google Maps Geocoding notice:', err);
          } finally {
            setIsDetecting(false);
            resolve();
          }
        },
        () => {
          // Denied or unavailable GPS
          setIsDetecting(false);
          resolve();
        },
        { timeout: 8000, enableHighAccuracy: false }
      );
    });
  };

  const setManualQuadrant = (quadrant: 'SW' | 'NW' | 'SE' | 'NE' | 'Airdrie') => {
    const displayText = quadrant === 'Airdrie' ? 'Airdrie & Calgary Area' : `Calgary, AB • ${quadrant}`;
    const newLoc: UserLocation = {
      displayText,
      city: quadrant === 'Airdrie' ? 'Airdrie' : 'Calgary',
      province: 'AB',
      quadrant,
      isDetected: true,
      expiresAt: Date.now() + CACHE_TTL_MS,
    };
    saveLocation(newLoc);
  };

  const resetToDefault = () => {
    saveLocation(DEFAULT_LOCATION);
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        isDetecting,
        detectLocation,
        setManualQuadrant,
        resetToDefault,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
