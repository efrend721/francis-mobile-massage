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

const STORAGE_KEY = 'form_wellness_user_location_v2';
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const DEFAULT_LOCATION: UserLocation = {
  displayText: 'Calgary, AB • NW',
  city: 'Calgary',
  province: 'AB',
  quadrant: 'NW',
  isDetected: false,
  expiresAt: 0,
};

const GOOGLE_MAPS_API_KEY =
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
  'AIzaSyA1_EOOkixjNehiZbNu1qstgi6IXhZxePM';

/**
 * Accurately determines Calgary quadrant from coordinates or address string
 * Centre Street / Macleod Trail (~ -114.0625) divides East and West
 * Centre Ave / Bow River (~ 51.0486) divides North and South
 */
function resolveCalgaryQuadrant(lat: number, lng: number, addressText?: string): 'SW' | 'NW' | 'SE' | 'NE' | 'Airdrie' {
  if (addressText) {
    const upper = addressText.toUpperCase();
    if (upper.includes('AIRDRIE')) return 'Airdrie';
    if (upper.includes(' NW ') || upper.includes(', NW') || upper.endsWith(' NW') || upper.includes('NORTHWEST')) return 'NW';
    if (upper.includes(' NE ') || upper.includes(', NE') || upper.endsWith(' NE') || upper.includes('NORTHEAST')) return 'NE';
    if (upper.includes(' SW ') || upper.includes(', SW') || upper.endsWith(' SW') || upper.includes('SOUTHWEST')) return 'SW';
    if (upper.includes(' SE ') || upper.includes(', SE') || upper.endsWith(' SE') || upper.includes('SOUTHEAST')) return 'SE';
  }

  if (lat >= 51.24) return 'Airdrie';

  const isNorth = lat >= 51.048;
  const isEast = lng >= -114.062;

  if (isNorth && !isEast) return 'NW';
  if (isNorth && isEast) return 'NE';
  if (!isNorth && !isEast) return 'SW';
  return 'SE';
}

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<UserLocation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: UserLocation = JSON.parse(saved);
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

  const saveLocation = (newLoc: UserLocation) => {
    setLocation(newLoc);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newLoc));
    } catch {
      // Storage quota ignore
    }
  };

  /**
   * High-accuracy Geolocation Resolver
   * 1. Browser GPS Coordinates
   * 2. Reverse Geocoding (Nominatim / Google)
   * 3. IP Geolocation Fallback
   */
  const detectLocation = async (): Promise<void> => {
    setIsDetecting(true);

    const resolveCoords = async (latitude: number, longitude: number): Promise<UserLocation> => {
      let cityName = 'Calgary';
      let provinceCode = 'AB';
      let neighborhoodName = '';
      let addressStr = '';

      // Try reverse geocoding via OpenStreetMap Nominatim
      try {
        const nomRes = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          { headers: { Accept: 'application/json' } }
        );
        if (nomRes.ok) {
          const data = await nomRes.json();
          addressStr = data.display_name || '';
          if (data.address) {
            cityName = data.address.city || data.address.town || data.address.municipality || 'Calgary';
            provinceCode = data.address['ISO3166-2-lvl4']?.replace('CA-', '') || data.address.state || 'AB';
            neighborhoodName = data.address.suburb || data.address.neighbourhood || '';
          }
        }
      } catch {
        // Fallback to geometric math
      }

      // Try Google Maps Geocoding if available
      if (!addressStr && GOOGLE_MAPS_API_KEY) {
        try {
          const gRes = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );
          if (gRes.ok) {
            const gData = await gRes.json();
            if (gData.results && gData.results.length > 0) {
              addressStr = gData.results[0].formatted_address || '';
            }
          }
        } catch {
          // Ignore
        }
      }

      const quadrant = resolveCalgaryQuadrant(latitude, longitude, addressStr);
      const isAirdrie = quadrant === 'Airdrie' || cityName.toLowerCase().includes('airdrie');
      const displayText = isAirdrie
        ? 'Airdrie & Calgary Area'
        : quadrant
        ? `${cityName}, ${provinceCode} • ${quadrant}`
        : `${cityName}, ${provinceCode}`;

      return {
        displayText,
        city: cityName,
        province: provinceCode,
        quadrant,
        neighborhood: neighborhoodName,
        isDetected: true,
        expiresAt: Date.now() + CACHE_TTL_MS,
      };
    };

    // 1. Try Browser GPS
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      const gpsPromise = new Promise<boolean>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            try {
              const res = await resolveCoords(pos.coords.latitude, pos.coords.longitude);
              saveLocation(res);
              resolve(true);
            } catch {
              resolve(false);
            }
          },
          () => resolve(false),
          { timeout: 5000, enableHighAccuracy: true }
        );
      });

      const gpsSuccess = await gpsPromise;
      if (gpsSuccess) {
        setIsDetecting(false);
        return;
      }
    }

    // 2. Fallback: Fast IP Geolocation (e.g. FreeIPAPI / IPAPI)
    try {
      const ipRes = await fetch('https://freeipapi.com/api/json');
      if (ipRes.ok) {
        const ipData = await ipRes.json();
        if (ipData.latitude && ipData.longitude) {
          const res = await resolveCoords(ipData.latitude, ipData.longitude);
          saveLocation(res);
          setIsDetecting(false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    setIsDetecting(false);
  };

  // Run detection automatically on mount
  useEffect(() => {
    detectLocation();
  }, []);

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
