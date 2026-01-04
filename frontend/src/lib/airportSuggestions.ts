export type AirportSuggestion = {
  code: string;
  name: string;
  city: string;
  country: string;
  displayText: string;
};

const middleEast: AirportSuggestion[] = [
  // Iraq
  { code: 'EBL', name: 'Erbil International Airport', city: 'Erbil', country: 'Iraq', displayText: 'EBL - Erbil International Airport' },
  { code: 'ISU', name: 'Sulaymaniyah International Airport', city: 'Sulaymaniyah', country: 'Iraq', displayText: 'ISU - Sulaymaniyah International Airport' },
  { code: 'BGW', name: 'Baghdad International Airport', city: 'Baghdad', country: 'Iraq', displayText: 'BGW - Baghdad International Airport' },
  { code: 'BSR', name: 'Basra International Airport', city: 'Basra', country: 'Iraq', displayText: 'BSR - Basra International Airport' },
  { code: 'NJF', name: 'Al Najaf International Airport', city: 'Najaf', country: 'Iraq', displayText: 'NJF - Al Najaf International Airport' },

  // Turkey
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', displayText: 'IST - Istanbul Airport' },
  { code: 'SAW', name: 'Sabiha Gökçen International Airport', city: 'Istanbul', country: 'Turkey', displayText: 'SAW - Sabiha Gökçen International Airport' },
  { code: 'ESB', name: 'Esenboğa Airport', city: 'Ankara', country: 'Turkey', displayText: 'ESB - Esenboğa Airport' },
  { code: 'AYT', name: 'Antalya Airport', city: 'Antalya', country: 'Turkey', displayText: 'AYT - Antalya Airport' },
  { code: 'ADB', name: 'İzmir Adnan Menderes Airport', city: 'İzmir', country: 'Turkey', displayText: 'ADB - İzmir Adnan Menderes Airport' },
  { code: 'BJV', name: 'Milas–Bodrum Airport', city: 'Bodrum', country: 'Turkey', displayText: 'BJV - Milas–Bodrum Airport' },

  // UAE
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', displayText: 'DXB - Dubai International Airport' },
  { code: 'DWC', name: 'Al Maktoum International Airport', city: 'Dubai', country: 'United Arab Emirates', displayText: 'DWC - Al Maktoum International Airport' },
  { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', displayText: 'AUH - Abu Dhabi International Airport' },
  { code: 'SHJ', name: 'Sharjah International Airport', city: 'Sharjah', country: 'United Arab Emirates', displayText: 'SHJ - Sharjah International Airport' },
  { code: 'RKT', name: 'Ras Al Khaimah International Airport', city: 'Ras Al Khaimah', country: 'United Arab Emirates', displayText: 'RKT - Ras Al Khaimah International Airport' },
  { code: 'AAN', name: 'Al Ain International Airport', city: 'Al Ain', country: 'United Arab Emirates', displayText: 'AAN - Al Ain International Airport' },

  // Qatar
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', displayText: 'DOH - Hamad International Airport' },

  // Saudi Arabia
  { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', displayText: 'RUH - King Khalid International Airport' },
  { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia', displayText: 'JED - King Abdulaziz International Airport' },
  { code: 'DMM', name: 'King Fahd International Airport', city: 'Dammam', country: 'Saudi Arabia', displayText: 'DMM - King Fahd International Airport' },
  { code: 'MED', name: 'Prince Mohammad bin Abdulaziz International Airport', city: 'Medina', country: 'Saudi Arabia', displayText: 'MED - Prince Mohammad bin Abdulaziz International Airport' },
  { code: 'AHB', name: 'Abha International Airport', city: 'Abha', country: 'Saudi Arabia', displayText: 'AHB - Abha International Airport' },

  // Kuwait
  { code: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait', displayText: 'KWI - Kuwait International Airport' },

  // Bahrain
  { code: 'BAH', name: 'Bahrain International Airport', city: 'Manama', country: 'Bahrain', displayText: 'BAH - Bahrain International Airport' },

  // Oman
  { code: 'MCT', name: 'Muscat International Airport', city: 'Muscat', country: 'Oman', displayText: 'MCT - Muscat International Airport' },
  { code: 'SLL', name: 'Salalah Airport', city: 'Salalah', country: 'Oman', displayText: 'SLL - Salalah Airport' },

  // Jordan
  { code: 'AMM', name: 'Queen Alia International Airport', city: 'Amman', country: 'Jordan', displayText: 'AMM - Queen Alia International Airport' },
  { code: 'AQJ', name: 'King Hussein International Airport', city: 'Aqaba', country: 'Jordan', displayText: 'AQJ - King Hussein International Airport' },

  // Lebanon
  { code: 'BEY', name: 'Beirut–Rafic Hariri International Airport', city: 'Beirut', country: 'Lebanon', displayText: 'BEY - Beirut–Rafic Hariri International Airport' },

  // Iran
  { code: 'IKA', name: 'Imam Khomeini International Airport', city: 'Tehran', country: 'Iran', displayText: 'IKA - Imam Khomeini International Airport' },
  { code: 'THR', name: 'Mehrabad International Airport', city: 'Tehran', country: 'Iran', displayText: 'THR - Mehrabad International Airport' },
  { code: 'MHD', name: 'Mashhad International Airport', city: 'Mashhad', country: 'Iran', displayText: 'MHD - Mashhad International Airport' },
  { code: 'SYZ', name: 'Shiraz International Airport', city: 'Shiraz', country: 'Iran', displayText: 'SYZ - Shiraz International Airport' },
  { code: 'IFN', name: 'Isfahan International Airport', city: 'Isfahan', country: 'Iran', displayText: 'IFN - Isfahan International Airport' },
  { code: 'TBZ', name: 'Tabriz International Airport', city: 'Tabriz', country: 'Iran', displayText: 'TBZ - Tabriz International Airport' },

  // Egypt
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', displayText: 'CAI - Cairo International Airport' },
  { code: 'HRG', name: 'Hurghada International Airport', city: 'Hurghada', country: 'Egypt', displayText: 'HRG - Hurghada International Airport' },
  { code: 'SSH', name: 'Sharm El Sheikh International Airport', city: 'Sharm El Sheikh', country: 'Egypt', displayText: 'SSH - Sharm El Sheikh International Airport' },
  { code: 'LXR', name: 'Luxor International Airport', city: 'Luxor', country: 'Egypt', displayText: 'LXR - Luxor International Airport' },
  { code: 'ASW', name: 'Aswan International Airport', city: 'Aswan', country: 'Egypt', displayText: 'ASW - Aswan International Airport' },
  { code: 'HBE', name: 'Borg El Arab Airport', city: 'Alexandria', country: 'Egypt', displayText: 'HBE - Borg El Arab Airport' },

  // Israel
  { code: 'TLV', name: 'Ben Gurion Airport', city: 'Tel Aviv', country: 'Israel', displayText: 'TLV - Ben Gurion Airport' },

  // Cyprus
  { code: 'LCA', name: 'Larnaca International Airport', city: 'Larnaca', country: 'Cyprus', displayText: 'LCA - Larnaca International Airport' },
  { code: 'PFO', name: 'Paphos International Airport', city: 'Paphos', country: 'Cyprus', displayText: 'PFO - Paphos International Airport' },
];

const other: AirportSuggestion[] = [
  // UK
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom', displayText: 'LHR - London Heathrow Airport' },
  { code: 'LGW', name: 'London Gatwick Airport', city: 'London', country: 'United Kingdom', displayText: 'LGW - London Gatwick Airport' },
  { code: 'MAN', name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom', displayText: 'MAN - Manchester Airport' },

  // France
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', displayText: 'CDG - Charles de Gaulle Airport' },
  { code: 'ORY', name: 'Orly Airport', city: 'Paris', country: 'France', displayText: 'ORY - Orly Airport' },
  { code: 'NCE', name: 'Nice Côte d’Azur Airport', city: 'Nice', country: 'France', displayText: 'NCE - Nice Côte d’Azur Airport' },

  // Germany
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', displayText: 'FRA - Frankfurt Airport' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany', displayText: 'MUC - Munich Airport' },
  { code: 'BER', name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany', displayText: 'BER - Berlin Brandenburg Airport' },

  // Netherlands
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', displayText: 'AMS - Amsterdam Airport Schiphol' },

  // Italy
  { code: 'FCO', name: 'Rome Fiumicino Airport', city: 'Rome', country: 'Italy', displayText: 'FCO - Rome Fiumicino Airport' },
  { code: 'MXP', name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', displayText: 'MXP - Milan Malpensa Airport' },
  { code: 'VCE', name: 'Venice Marco Polo Airport', city: 'Venice', country: 'Italy', displayText: 'VCE - Venice Marco Polo Airport' },

  // Spain
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain', displayText: 'MAD - Adolfo Suárez Madrid–Barajas Airport' },
  { code: 'BCN', name: 'Barcelona–El Prat Airport', city: 'Barcelona', country: 'Spain', displayText: 'BCN - Barcelona–El Prat Airport' },

  // USA
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', displayText: 'JFK - John F. Kennedy International Airport' },
  { code: 'EWR', name: 'Newark Liberty International Airport', city: 'Newark', country: 'United States', displayText: 'EWR - Newark Liberty International Airport' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', displayText: 'LAX - Los Angeles International Airport' },
  { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'United States', displayText: "ORD - O'Hare International Airport" },

  // Canada
  { code: 'YYZ', name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', displayText: 'YYZ - Toronto Pearson International Airport' },
  { code: 'YVR', name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada', displayText: 'YVR - Vancouver International Airport' },

  // India
  { code: 'DEL', name: 'Indira Gandhi International Airport', city: 'Delhi', country: 'India', displayText: 'DEL - Indira Gandhi International Airport' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', displayText: 'BOM - Chhatrapati Shivaji Maharaj International Airport' },

  // SE Asia
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', displayText: 'SIN - Singapore Changi Airport' },
  { code: 'KUL', name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', displayText: 'KUL - Kuala Lumpur International Airport' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', displayText: 'BKK - Suvarnabhumi Airport' },

  // East Asia
  { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan', displayText: 'HND - Tokyo Haneda Airport' },
  { code: 'NRT', name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', displayText: 'NRT - Narita International Airport' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', displayText: 'ICN - Incheon International Airport' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong', displayText: 'HKG - Hong Kong International Airport' },
];

export const MIDDLE_EAST_AIRPORTS = middleEast;
export const OTHER_AIRPORTS = other;
export const AIRPORT_SUGGESTIONS: AirportSuggestion[] = [...middleEast, ...other];

export function filterAirportSuggestions(keyword: string, limit = 8): AirportSuggestion[] {
  const q = keyword.trim().toLowerCase();
  if (!q) return AIRPORT_SUGGESTIONS.slice(0, limit);
  const filtered = AIRPORT_SUGGESTIONS.filter((a) => {
    return (
      a.code.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      a.displayText.toLowerCase().includes(q)
    );
  });
  return filtered.slice(0, limit);
}
