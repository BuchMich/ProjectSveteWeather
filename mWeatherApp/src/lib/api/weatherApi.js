/**
 * Wetterdaten mit Open-Meteo API abrufen
 */

// Geocoding - Stadt zu Koordinaten
export async function geocodeCity(city) {
  const response = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=de`
  );
  
  const data = await response.json();
  
  if (!data.results || data.results.length === 0) {
    throw new Error('Stadt nicht gefunden');
  }
  
  return data.results[0];
}

// Aktuelle Wetterdaten abrufen
export async function getCurrentWeather(latitude, longitude) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weathercode&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto&forecast_days=3`
  );
  
  return await response.json();
}

// Erweiterte Wettervorhersage abrufen
export async function getForecastWeather(latitude, longitude, days = 7) {
  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,weathercode,precipitation_probability&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weathercode&timezone=auto&forecast_days=${days}`
  );
  
  return await response.json();
}

// Reverse Geocoding - Koordinaten zu Stadt
async function reverseGeocode(latitude, longitude) {
  try {
    // Verwende Nominatim für genauere Reverse-Geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=de`
    );
    
    if (!response.ok) {
      throw new Error('Reverse-Geocoding fehlgeschlagen');
    }
    
    const data = await response.json();
    
    if (!data || !data.address) {
      throw new Error('Keine Ortsinformationen gefunden');
    }
    
    // Extrahiere relevante Ortsinformationen
    const city = data.address.city || 
                data.address.town || 
                data.address.village || 
                data.address.hamlet || 
                data.address.municipality ||
                data.address.county ||
                'Unbekannter Ort';
                
    const country = data.address.country || 'Unbekanntes Land';
    const countryCode = data.address.country_code || 'unknown';
    
    return {
      name: city,
      country: country,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      country_code: countryCode
    };
  } catch (error) {
    console.error('Fehler beim Reverse-Geocoding:', error);
    throw error;
  }
}

// Browser-Geolocation abrufen (Promise)
export function getBrowserLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      // Default zu Grieskirchen, Österreich
      resolve({
        latitude: 48.2348,
        longitude: 13.8327
      });
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => {
        // Bei Fehler: Default-Position (Grieskirchen, Österreich)
        resolve({
          latitude: 48.2348,
          longitude: 13.8327
        });
      },
      { timeout: 5000 }
    );
  });
}

// Nahegelegene Orte basierend auf Koordinaten finden
export async function getNearbyLocations(latitude, longitude) {
  try {
    // Verwende Nominatim für genauere Standortsuche
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=de`
    );
    
    if (!response.ok) {
      throw new Error('Standortsuche fehlgeschlagen');
    }
    
    const data = await response.json();
    
    if (!data || !data.address) {
      throw new Error('Keine Ortsinformationen gefunden');
    }
    
    // Extrahiere relevante Ortsinformationen
    const city = data.address.city || 
                data.address.town || 
                data.address.village || 
                data.address.hamlet || 
                data.address.municipality ||
                data.address.county ||
                'Unbekannter Ort';
                
    const country = data.address.country || 'Unbekanntes Land';
    
    return [{
      name: city,
      country: country,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude)
    }];
  } catch (error) {
    console.error('Fehler bei der Standortsuche:', error);
    throw error;
  }
}

// Wettercode zu lesbarem Text und Icon konvertieren
export function getWeatherInfo(code, temperature = null) {
  // Wenn die Temperatur über 15°C liegt, keine Schnee- oder Eisbedingungen anzeigen
  if (temperature !== null && temperature > 15) {
    // Schnee- und Eis-Codes in Regen umwandeln
    if ([71, 73, 75, 77, 80, 81, 82, 85, 86].includes(code)) {
      // Schnee zu Regen
      if (code <= 77) {
        code = code - 20; // Schnee zu Regen
      } else {
        code = code - 19; // Schneeregen zu Regen
      }
    }
    // Gefrierender Regen zu normalem Regen
    if ([56, 57, 66, 67].includes(code)) {
      code = code - 5;
    }
  }

  const weatherCodes = {
    // Klar und sonnig
    0: { description: 'Klar', icon: '☀️', theme: 'sunny' },
    1: { description: 'Überwiegend klar', icon: '🌤️', theme: 'sunny' },
    2: { description: 'Teilweise bewölkt', icon: '⛅', theme: 'partly-cloudy' },
    3: { description: 'Bewölkt', icon: '☁️', theme: 'cloudy' },
    
    // Nebel und Dunst
    45: { description: 'Nebel', icon: '🌫️', theme: 'foggy' },
    48: { description: 'Reifnebel', icon: '🌫️', theme: 'foggy' },
    
    // Nieselregen
    51: { description: 'Leichter Nieselregen', icon: '🌦️', theme: 'rainy' },
    53: { description: 'Mäßiger Nieselregen', icon: '🌦️', theme: 'rainy' },
    55: { description: 'Starker Nieselregen', icon: '🌦️', theme: 'rainy' },
    
    // Regen
    56: { description: 'Leichter gefrierender Nieselregen', icon: '🌧️', theme: 'rainy' },
    57: { description: 'Starker gefrierender Nieselregen', icon: '🌧️', theme: 'rainy' },
    61: { description: 'Leichter Regen', icon: '🌧️', theme: 'rainy' },
    63: { description: 'Mäßiger Regen', icon: '🌧️', theme: 'rainy' },
    65: { description: 'Starker Regen', icon: '🌧️', theme: 'rainy' },
    
    // Gefrierender Regen
    66: { description: 'Leichter gefrierender Regen', icon: '🌧️', theme: 'rainy' },
    67: { description: 'Starker gefrierender Regen', icon: '🌧️', theme: 'rainy' },
    
    // Schnee
    71: { description: 'Leichter Schneefall', icon: '❄️', theme: 'snowy' },
    73: { description: 'Mäßiger Schneefall', icon: '❄️', theme: 'snowy' },
    75: { description: 'Starker Schneefall', icon: '❄️', theme: 'snowy' },
    77: { description: 'Schneegriesel', icon: '❄️', theme: 'snowy' },
    
    // Schneeregen
    80: { description: 'Leichter Schneeregen', icon: '🌨️', theme: 'snowy' },
    81: { description: 'Mäßiger Schneeregen', icon: '🌨️', theme: 'snowy' },
    82: { description: 'Starker Schneeregen', icon: '🌨️', theme: 'snowy' },
    
    // Schauer
    85: { description: 'Leichte Schneeschauer', icon: '🌨️', theme: 'snowy' },
    86: { description: 'Starke Schneeschauer', icon: '🌨️', theme: 'snowy' },
    
    // Gewitter
    95: { description: 'Gewitter', icon: '⛈️', theme: 'stormy' },
    96: { description: 'Gewitter mit leichtem Hagel', icon: '⛈️', theme: 'stormy' },
    99: { description: 'Gewitter mit starkem Hagel', icon: '⛈️', theme: 'stormy' }
  };
  
  // Wenn der Code nicht exakt übereinstimmt, suche nach dem nächstgelegenen Code
  if (!weatherCodes[code]) {
    // Gruppiere Codes in Kategorien
    const categories = {
      clear: [0, 1],
      partlyCloudy: [2],
      cloudy: [3],
      foggy: [45, 48],
      drizzle: [51, 53, 55, 56, 57],
      rain: [61, 63, 65, 66, 67],
      snow: [71, 73, 75, 77],
      sleet: [80, 81, 82],
      snowShowers: [85, 86],
      thunderstorm: [95, 96, 99]
    };
    
    // Finde die passende Kategorie
    for (const [category, codes] of Object.entries(categories)) {
      if (codes.some(c => Math.abs(c - code) <= 2)) {
        // Verwende den nächstgelegenen Code aus der Kategorie
        const closestCode = codes.reduce((prev, curr) => 
          Math.abs(curr - code) < Math.abs(prev - code) ? curr : prev
        );
        return weatherCodes[closestCode];
      }
    }
  }
  
  return weatherCodes[code] || { description: 'Klar', icon: '☀️', theme: 'sunny' };
} 