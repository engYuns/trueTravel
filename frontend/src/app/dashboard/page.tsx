/**
 * True Travel B2B Booking Platform - Dashboard Page
 * 
 * ICON SYSTEM GUIDELINES:
 * All icons use professional Material Design SVG icons with solid fill style.
 * Icon specifications:
 * - Size: w-5 h-5 (20x20px) for consistency
 * - Fill: currentColor (inherits text color)
 * - ViewBox: 0 0 24 24 (Material Design standard)
 * 
 * For future development, always use SVG icons instead of emoji.
 * Maintain consistent icon style across the platform.
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeaderUserMenu from '@/components/HeaderUserMenu';

type RecentSearch = {
  from: string;
  to: string;
  departure: string;
  return?: string;
  tripType: string;
  adults?: number;
  children?: number;
  infants?: number;
  passengers?: string;
  class?: string;
  isDirect?: boolean;
  timestamp: string;
};

// Popular cities for Middle East region
const POPULAR_CITIES = [
  { code: 'EBL', name: 'Erbil International Airport', city: 'Erbil', country: 'Iraq', displayText: 'EBL - Erbil International Airport' },
  { code: 'ISU', name: 'Sulaymaniyah International Airport', city: 'Sulaymaniyah', country: 'Iraq', displayText: 'ISU - Sulaymaniyah International Airport' },
  { code: 'BGW', name: 'Baghdad International Airport', city: 'Baghdad', country: 'Iraq', displayText: 'BGW - Baghdad International Airport' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', displayText: 'IST - Istanbul Airport' },
  { code: 'ESB', name: 'Esenboğa Airport', city: 'Ankara', country: 'Turkey', displayText: 'ESB - Esenboğa Airport' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', displayText: 'DXB - Dubai International Airport' },
  { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', displayText: 'AUH - Abu Dhabi International Airport' },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar', displayText: 'DOH - Hamad International Airport' },
  { code: 'RUH', name: 'King Khalid International Airport', city: 'Riyadh', country: 'Saudi Arabia', displayText: 'RUH - King Khalid International Airport' },
  { code: 'JED', name: 'King Abdulaziz International Airport', city: 'Jeddah', country: 'Saudi Arabia', displayText: 'JED - King Abdulaziz International Airport' },
  { code: 'KWI', name: 'Kuwait International Airport', city: 'Kuwait City', country: 'Kuwait', displayText: 'KWI - Kuwait International Airport' },
  { code: 'BAH', name: 'Bahrain International Airport', city: 'Manama', country: 'Bahrain', displayText: 'BAH - Bahrain International Airport' },
  { code: 'MCT', name: 'Muscat International Airport', city: 'Muscat', country: 'Oman', displayText: 'MCT - Muscat International Airport' },
  { code: 'IKA', name: 'Imam Khomeini International Airport', city: 'Tehran', country: 'Iran', displayText: 'IKA - Imam Khomeini International Airport' },
  { code: 'BEY', name: 'Rafic Hariri International Airport', city: 'Beirut', country: 'Lebanon', displayText: 'BEY - Rafic Hariri International Airport' },
  { code: 'AMM', name: 'Queen Alia International Airport', city: 'Amman', country: 'Jordan', displayText: 'AMM - Queen Alia International Airport' },
  { code: 'DAM', name: 'Damascus International Airport', city: 'Damascus', country: 'Syria', displayText: 'DAM - Damascus International Airport' },
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', displayText: 'CAI - Cairo International Airport' },
];

export default function Dashboard() {
  const router = useRouter();
  
  // Agency Dropdown State
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  
  // Product Dropdown State
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showFareRuleSubmenu, setShowFareRuleSubmenu] = useState(false);
  const [fareRuleSubmenuLocked, setFareRuleSubmenuLocked] = useState(false);
  
  // Reservations Dropdown State
  const [showReservationsDropdown, setShowReservationsDropdown] = useState(false);
  
  // Finance Dropdown State
  const [showFinanceDropdown, setShowFinanceDropdown] = useState(false);
  
  // Reports Dropdown State
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);
  
  // Helper function to get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // Helper function to get date one week from today
  const getWeekLaterDate = () => {
    const weekLater = new Date();
    weekLater.setDate(weekLater.getDate() + 7);
    return weekLater.toISOString().split('T')[0];
  };
  
  // Flight Search State
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureDate, setDepartureDate] = useState(getTodayDate());
  const [returnDate, setReturnDate] = useState(getWeekLaterDate());
  const [tripType, setTripType] = useState("Roundtrip");
  const [flightClass, setFlightClass] = useState("Economy");
  const [activeService, setActiveService] = useState("Flight Ticket");
  const [isDirect, setIsDirect] = useState(false);
  const [markup, setMarkup] = useState("");
  const [markupType, setMarkupType] = useState("fixed"); // 'fixed' or 'percentage'
  
  // Passenger State
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  
  // Search State
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
  const [bottomTab, setBottomTab] = useState<'recent' | 'optional'>('recent');
  
  // Location Autocomplete State
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [isLoadingFrom, setIsLoadingFrom] = useState(false);
  const [isLoadingTo, setIsLoadingTo] = useState(false);

  // Helper functions
  const handleLogout = () => {
    // Remove authentication cookie
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
  };

  const openGoogleMaps = () => {
    const address = "Gulan St Near Nazdar Bamarny Hospital Erbil, 44002, Iraq";
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  // Passenger Management
  const getTotalPassengers = () => {
    return adults + children + infants;
  };

  const getPassengerText = () => {
    const total = getTotalPassengers();
    if (total === 0) return "Select Passengers";
    const parts = [];
    if (adults > 0) parts.push(`${adults} Adult${adults > 1 ? 's' : ''}`);
    if (children > 0) parts.push(`${children} Child${children > 1 ? 'ren' : ''}`);
    if (infants > 0) parts.push(`${infants} Infant${infants > 1 ? 's' : ''}`);
    return parts.join(', ');
  };

  const parsePassengerCounts = (text?: string): { adults: number; children: number; infants: number } => {
    if (!text) return { adults: 1, children: 0, infants: 0 };
    const adultsMatch = text.match(/(\d+)\s*Adult/i);
    const childrenMatch = text.match(/(\d+)\s*Child/i);
    const infantsMatch = text.match(/(\d+)\s*Infant/i);
    return {
      adults: adultsMatch ? Number(adultsMatch[1]) : 1,
      children: childrenMatch ? Number(childrenMatch[1]) : 0,
      infants: infantsMatch ? Number(infantsMatch[1]) : 0,
    };
  };

  const normalizeRecentSearch = (raw: any): RecentSearch | null => {
    if (!raw || typeof raw !== 'object') return null;
    if (typeof raw.from !== 'string' || typeof raw.to !== 'string') return null;
    if (typeof raw.departure !== 'string') return null;
    const timestamp = typeof raw.timestamp === 'string' ? raw.timestamp : new Date().toISOString();
    const passengerCounts = parsePassengerCounts(typeof raw.passengers === 'string' ? raw.passengers : undefined);

    return {
      from: raw.from,
      to: raw.to,
      departure: raw.departure,
      return: typeof raw.return === 'string' ? raw.return : undefined,
      tripType: typeof raw.tripType === 'string' ? raw.tripType : 'Roundtrip',
      adults: typeof raw.adults === 'number' ? raw.adults : passengerCounts.adults,
      children: typeof raw.children === 'number' ? raw.children : passengerCounts.children,
      infants: typeof raw.infants === 'number' ? raw.infants : passengerCounts.infants,
      passengers: typeof raw.passengers === 'string' ? raw.passengers : undefined,
      class: typeof raw.class === 'string' ? raw.class : undefined,
      isDirect: typeof raw.isDirect === 'boolean' ? raw.isDirect : undefined,
      timestamp,
    };
  };

  const recentSearchKey = (s: RecentSearch) => {
    const fromCode = s.from.split(' - ')[0]?.trim() || s.from;
    const toCode = s.to.split(' - ')[0]?.trim() || s.to;
    return [
      fromCode,
      toCode,
      s.departure,
      s.tripType,
      s.return || '',
      String(s.adults ?? 1),
      String(s.children ?? 0),
      String(s.infants ?? 0),
      s.class || '',
      String(Boolean(s.isDirect)),
    ].join('|');
  };

  // Form Validation
  const validateSearch = (): string | null => {
    if (!fromLocation || !toLocation) {
      return "Please select departure and arrival locations";
    }
    if (fromLocation === toLocation) {
      return "Departure and arrival locations must be different";
    }
    if (!departureDate) {
      return "Please select a departure date";
    }
    if (tripType === "Roundtrip" && !returnDate) {
      return "Please select a return date";
    }
    if (tripType === "Roundtrip" && new Date(returnDate) < new Date(departureDate)) {
      return "Return date must be after departure date";
    }
    if (getTotalPassengers() === 0) {
      return "Please select at least one passenger";
    }
    if (infants > adults) {
      return "Number of infants cannot exceed number of adults";
    }
    return null;
  };

  // Search Flights Function
  const searchFlights = async () => {
    const validationError = validateSearch();
    if (validationError) {
      setSearchError(validationError);
      setTimeout(() => setSearchError(""), 5000);
      return;
    }

    setIsSearching(true);
    setSearchError("");

    // Save to recent searches
    const searchData: RecentSearch = {
      from: fromLocation,
      to: toLocation,
      departure: departureDate,
      return: returnDate,
      tripType,
      adults,
      children,
      infants,
      passengers: getPassengerText(),
      class: flightClass,
      isDirect,
      timestamp: new Date().toISOString()
    };

    const existing = recentSearches.filter(s => recentSearchKey(s) !== recentSearchKey(searchData));
    const updatedSearches = [searchData, ...existing].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));

    try {
      // Extract airport codes from location strings (format: "EBL - Erbil, Kurdistan Region, IQ")
      const originCode = fromLocation.split(' - ')[0].trim();
      const destinationCode = toLocation.split(' - ')[0].trim();

      // Prepare API request
      const requestBody = {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: departureDate,
        returnDate: tripType === "Roundtrip" ? returnDate : undefined,
        adults: adults,
        children: children,
        infants: infants,
        travelClass: flightClass,
        nonStop: isDirect,
        currencyCode: 'USD',
        maxResults: 50,
      };

      console.log('Searching flights:', requestBody);

      // Call our Next.js API route
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search flights');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        console.log(`Found ${data.data.length} flights`);
        
        // Store results in localStorage for the results page
        localStorage.setItem('flightSearchResults', JSON.stringify(data.data));

        // Store criteria consistently for the results page (used for API refetch + markup)
        localStorage.setItem('flightSearchCriteria', JSON.stringify({
          from: fromLocation,
          to: toLocation,
          departureDate,
          returnDate,
          adults,
          children,
          infants,
          flightClass,
          tripType,
          markup,
          markupType,
          isDirect,
        }));
        
        // Prepare URL parameters for search criteria
        const searchParams = new URLSearchParams({
          from: fromLocation,
          to: toLocation,
          departureDate: departureDate,
          returnDate: returnDate || '',
          passengers: getPassengerText(),
          class: flightClass,
          tripType: tripType,
          isDirect: isDirect.toString(),
          markup: markup || '0',
          markupType: markupType || 'fixed',
        });
        
        // Redirect to flight results page
        router.push(`/flightResult?${searchParams.toString()}`);
      } else {
        throw new Error('No flights found');
      }

    } catch (error: any) {
      console.error('Flight search error:', error);
      setSearchError(error.message || 'Failed to search flights. Please try again.');
      setIsSearching(false);
    }
  };

  // Calculate final price with markup
  const calculatePrice = (basePrice: number) => {
    if (!markup || parseFloat(markup) === 0) return basePrice;
    
    const markupValue = parseFloat(markup);
    if (markupType === "percentage") {
      return basePrice + (basePrice * markupValue / 100);
    }
    return basePrice + markupValue;
  };

  // Close fare rule submenu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (fareRuleSubmenuLocked) {
        setShowFareRuleSubmenu(false);
        setFareRuleSubmenuLocked(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [fareRuleSubmenuLocked]);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const normalized = Array.isArray(parsed)
          ? (parsed.map(normalizeRecentSearch).filter(Boolean) as RecentSearch[])
          : [];
        setRecentSearches(normalized);
      } catch (e) {
        console.error('Error loading recent searches:', e);
      }
    }
  }, []);

  const handleSearchAgain = async (s: RecentSearch) => {
    setActiveService('Flight Ticket');
    setFromLocation(s.from);
    setToLocation(s.to);
    setDepartureDate(s.departure);
    setReturnDate(s.return || getWeekLaterDate());
    setTripType(s.tripType || 'Roundtrip');
    setFlightClass(s.class || 'Economy');
    setIsDirect(Boolean(s.isDirect));
    setAdults(s.adults ?? 1);
    setChildren(s.children ?? 0);
    setInfants(s.infants ?? 0);
    setBottomTab('recent');

    // Let state updates flush before searching.
    setTimeout(() => {
      void searchFlights();
    }, 0);
  };

  // Debounced location search
  useEffect(() => {
    const searchLocations = async (keyword: string, type: 'from' | 'to') => {
      if (keyword.length === 0) {
        // Show all popular cities when input is empty
        if (type === 'from') {
          setFromSuggestions(POPULAR_CITIES);
          setShowFromDropdown(true);
        } else {
          setToSuggestions(POPULAR_CITIES);
          setShowToDropdown(true);
        }
        return;
      }

      if (keyword.length === 1) {
        // Filter popular cities locally for first character (instant filtering)
        const filtered = POPULAR_CITIES.filter(city => 
          city.code.toLowerCase().startsWith(keyword.toLowerCase()) ||
          city.name.toLowerCase().includes(keyword.toLowerCase()) ||
          city.city.toLowerCase().startsWith(keyword.toLowerCase()) ||
          city.country.toLowerCase().includes(keyword.toLowerCase())
        );
        
        if (type === 'from') {
          setFromSuggestions(filtered.length > 0 ? filtered : POPULAR_CITIES);
          setShowFromDropdown(true);
        } else {
          setToSuggestions(filtered.length > 0 ? filtered : POPULAR_CITIES);
          setShowToDropdown(true);
        }
        return;
      }

      // Set loading state for API search (2+ characters)
      if (type === 'from') {
        setIsLoadingFrom(true);
      } else {
        setIsLoadingTo(true);
      }

      try {
        const response = await fetch(`/api/locations/search?keyword=${encodeURIComponent(keyword)}`);
        const data = await response.json();

        if (response.ok) {
          if (type === 'from') {
            setFromSuggestions(data.data || []);
            setShowFromDropdown(true);
          } else {
            setToSuggestions(data.data || []);
            setShowToDropdown(true);
          }
        }
      } catch (error) {
        console.error('Location search error:', error);
      } finally {
        if (type === 'from') {
          setIsLoadingFrom(false);
        } else {
          setIsLoadingTo(false);
        }
      }
    };

    // Determine debounce delay based on input length
    const getDebounceDelay = (text: string) => {
      if (!text || text.length < 2) return 0; // Instant for 0-1 characters
      return 200; // Fast debounce for 2+ characters
    };

    const fromDelay = fromLocation && !fromLocation.includes(' - ') ? getDebounceDelay(fromLocation) : 0;
    const toDelay = toLocation && !toLocation.includes(' - ') ? getDebounceDelay(toLocation) : 0;
    const delay = Math.max(fromDelay, toDelay);

    const debounceTimer = setTimeout(() => {
      if (fromLocation && !fromLocation.includes(' - ')) {
        searchLocations(fromLocation, 'from');
      }
      if (toLocation && !toLocation.includes(' - ')) {
        searchLocations(toLocation, 'to');
      }
    }, delay);

    return () => clearTimeout(debounceTimer);
  }, [fromLocation, toLocation]);

  const services = [
    { 
      id: "flight", 
      name: "Flight Ticket", 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>,
      active: true 
    },
    { 
      id: "hotel", 
      name: "Hotel", 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/></svg>
    },
    { 
      id: "transfer", 
      name: "Transfer", 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
    },
    { 
      id: "car", 
      name: "Rent A Car", 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/></svg>
    },
    { 
      id: "tour", 
      name: "Tour", 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
    },
    { 
      id: "cruise", 
      name: "Cruise", 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 21c-1.39 0-2.78-.47-4-1.32-2.44 1.71-5.56 1.71-8 0C6.78 20.53 5.39 21 4 21H2v2h2c1.38 0 2.74-.35 4-.99 2.52 1.29 5.48 1.29 8 0 1.26.65 2.62.99 4 .99h2v-2h-2zM3.95 19H4c1.6 0 3.02-.88 4-2 .98 1.12 2.4 2 4 2s3.02-.88 4-2c.98 1.12 2.4 2 4 2h.05l1.89-6.68c.08-.26.06-.54-.06-.78s-.34-.42-.6-.5L20 10.62V6c0-1.1-.9-2-2-2h-3V1H9v3H6c-1.1 0-2 .9-2 2v4.62l-1.29.42c-.26.08-.48.26-.6.5s-.15.52-.06.78L3.95 19zM6 6h12v3.97L12 8 6 9.97V6z"/></svg>
    },
    { 
      id: "visa", 
      name: "Visa", 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
    },
    { 
      id: "activity", 
      name: "Activity", 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>
    },
    { 
      id: "group", 
      name: "GroupRequest", 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
    },
    { 
      id: "package", 
      name: "Dynamic Package", 
      icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/></svg>
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <Image
                src="/logo.png"
                alt="True Travel Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              <h1 className="text-2xl font-bold text-gray-800">TRUE TRAVEL</h1>
            </a>
            <HeaderUserMenu onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-black shadow-sm sticky top-0 z-[99999]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-6 py-3">
            <a href="/dashboard" className="flex items-center space-x-2 text-[#155dfc] hover:text-[#155dfc]/90 transition-colors whitespace-nowrap">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              <span className="font-medium">Book a Service</span>
            </a>
            <a href="/panel" className="flex items-center space-x-2 text-white hover:text-[#155dfc] transition-colors whitespace-nowrap">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
              <span className="font-medium">Panel</span>
            </a>
            
            {/* Agency Dropdown */}
            <div 
              className="relative z-[999998]"
              onMouseEnter={() => setShowAgencyDropdown(true)}
              onMouseLeave={() => setShowAgencyDropdown(false)}
            >
              <button className="flex items-center space-x-2 text-white hover:text-[#155dfc] transition-colors whitespace-nowrap">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
                <span className="font-medium">Agency</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showAgencyDropdown ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {showAgencyDropdown && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                  <a 
                    href="/agency/agencies" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium">Agencies</span>
                    </div>
                  </a>
                  <a 
                    href="/agency/sales-representatives" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">Sales Representatives</span>
                    </div>
                  </a>
                  <a 
                    href="/agency/customers" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span className="font-medium">Agency Customers</span>
                    </div>
                  </a>
                </div>
              )}
            </div>
            
            {/* Product Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowProductDropdown(true)}
              onMouseLeave={() => setShowProductDropdown(false)}
            >
              <a href="#" className="flex items-center space-x-2 text-white hover:text-[#155dfc] transition-colors whitespace-nowrap">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
                </svg>
                <span className="font-medium">Product</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showProductDropdown ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              
              {/* Dropdown Menu */}
              {showProductDropdown && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                  <a 
                    href="/product/offers" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                      <span className="font-medium">Offers</span>
                    </div>
                  </a>
                  <div 
                    className="relative"
                    onMouseEnter={() => !fareRuleSubmenuLocked && setShowFareRuleSubmenu(true)}
                    onMouseLeave={() => !fareRuleSubmenuLocked && setShowFareRuleSubmenu(false)}
                  >
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFareRuleSubmenu(true);
                        setFareRuleSubmenuLocked(true);
                      }}
                      className="flex items-center justify-between px-4 py-3 text-white hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="font-medium">Fare Rule</span>
                      </div>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    {showFareRuleSubmenu && (
                      <div className="absolute left-full top-0 -ml-px w-56 bg-black rounded-lg shadow-lg py-2 border border-gray-700">
                        <a 
                          href="/product/fare-rule/flight-ticket" 
                          className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                            <span className="font-medium">Flight Ticket</span>
                          </div>
                        </a>
                        <a 
                          href="/product/fare-rule/hotel" 
                          className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                            <span className="font-medium">Hotel</span>
                          </div>
                        </a>
                        <a 
                          href="/product/fare-rule/rent-a-car" 
                          className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            <span className="font-medium">Rent A Car</span>
                          </div>
                        </a>
                        <a 
                          href="/product/fare-rule/transfer" 
                          className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="font-medium">Transfer</span>
                          </div>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Reservations Dropdown */}
            <div 
              className="relative z-[999998]"
              onMouseEnter={() => setShowReservationsDropdown(true)}
              onMouseLeave={() => setShowReservationsDropdown(false)}
            >
              <button className="flex items-center space-x-2 text-white hover:text-[#155dfc] transition-colors whitespace-nowrap">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 10H7v2h10v-2zm2-7h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-5-5H7v2h7v-2z"/>
                </svg>
                <span className="font-medium">Reservations</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showReservationsDropdown ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {showReservationsDropdown && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                  <a 
                    href="/reservations/all" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span className="font-medium">All Reservations</span>
                    </div>
                  </a>
                  <a 
                    href="/reservations/flight-ticket" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="font-medium">Flight Ticket</span>
                    </div>
                  </a>
                  <a 
                    href="/reservations/hotel" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium">Hotel</span>
                    </div>
                  </a>
                  <a 
                    href="/reservations/transfer" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium">Transfer</span>
                    </div>
                  </a>
                  <a 
                    href="/reservations/rent-a-car" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <span className="font-medium">Rent A Car</span>
                    </div>
                  </a>
                  <a 
                    href="/reservations/tour" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">Tour</span>
                    </div>
                  </a>
                  <a 
                    href="/reservations/visa" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                      </svg>
                      <span className="font-medium">Visa</span>
                    </div>
                  </a>
                </div>
              )}
            </div>
            
            {/* Finance Dropdown */}
            <div 
              className="relative z-[999998]"
              onMouseEnter={() => setShowFinanceDropdown(true)}
              onMouseLeave={() => setShowFinanceDropdown(false)}
            >
              <button className="flex items-center space-x-2 text-white hover:text-[#155dfc] transition-colors whitespace-nowrap">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                </svg>
                <span className="font-medium">Finance</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showFinanceDropdown ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {showFinanceDropdown && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                  <a 
                    href="/finance/agency-accounts" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">Agency Accounts</span>
                    </div>
                  </a>
                  <a 
                    href="/finance/receiving-discharge" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-medium">Receiving and Discharge</span>
                    </div>
                  </a>
                  <a 
                    href="/finance/virement" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span className="font-medium">Virement</span>
                    </div>
                  </a>
                </div>
              )}
            </div>
            
            <div 
              className="relative z-[999998]"
              onMouseEnter={() => setShowReportsDropdown(true)}
              onMouseLeave={() => setShowReportsDropdown(false)}
            >
              <button className="flex items-center space-x-2 text-white hover:text-[#155dfc] transition-colors whitespace-nowrap">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.1h-15V5h15v14.1zm0-16.1h-15c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                </svg>
                <span className="font-medium">Reports</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showReportsDropdown ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {showReportsDropdown && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                  <a href="/reports/flight-ticket/sales" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="font-medium">Flight Ticket Sales</span>
                    </div>
                  </a>
                  <a href="/reports/hotel/sales" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium">Hotel Sales</span>
                    </div>
                  </a>
                  <a href="/reports/rent-a-car/sales" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <span className="font-medium">Rent A Car Sales</span>
                    </div>
                  </a>
                  <a href="/reports/tour/sales" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">Tour Sales</span>
                    </div>
                  </a>
                  <a href="/reports/transfer/sales" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium">Transfer Sales</span>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Destination Cards */}
      <section className="relative bg-gradient-to-r from-cyan-400 to-blue-500 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Destination Cards */}
          <div className="flex flex-col lg:flex-row justify-center items-center space-y-6 lg:space-y-0 lg:space-x-8 mb-12">
            {/* Erbil Card */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden transform lg:-rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 w-72">
              <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-5">
                <h3 className="font-bold text-xl">Erbil</h3>
                <p className="text-sm opacity-90">KURDISTAN REGION</p>
              </div>
              <div className="p-5">
                <div className="w-full h-32 bg-gradient-to-br from-green-200 to-green-300 rounded-lg flex items-center justify-center text-green-800 font-medium">
                  City Image
                </div>
              </div>
            </div>

            {/* Dubai Card */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden hover:scale-105 transition-all duration-300 w-72">
              <div className="bg-gradient-to-r from-amber-500 to-yellow-600 text-white p-5 text-center">
                <h3 className="font-bold text-2xl">DUBAI</h3>
                <p className="text-sm opacity-90">UNITED ARAB EMIRATES</p>
              </div>
              <div className="p-5">
                <div className="w-full h-32 bg-gradient-to-br from-yellow-200 to-yellow-300 rounded-lg flex items-center justify-center text-yellow-800 font-medium">
                  City Image
                </div>
              </div>
            </div>

            {/* Istanbul Card */}
            <div className="bg-white rounded-xl shadow-xl overflow-hidden transform lg:rotate-6 hover:rotate-0 hover:scale-105 transition-all duration-300 w-72">
              <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-5">
                <h3 className="font-bold text-xl">Istanbul</h3>
                <p className="text-sm opacity-90">TURKEY</p>
              </div>
              <div className="p-5">
                <div className="w-full h-32 bg-gradient-to-br from-red-200 to-red-300 rounded-lg flex items-center justify-center text-red-800 font-medium">
                  City Image
                </div>
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg">
              True Travel
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-light drop-shadow-md">
              Your Gateway to Global Adventures
            </h2>
          </div>
        </div>
      </section>

      {/* Service Tabs */}
      <section className="bg-white shadow-md relative -mt-8 z-10 rounded-t-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => setActiveService(service.name)}
                className={`flex-shrink-0 flex items-center space-x-2 px-4 lg:px-6 py-4 border-b-4 transition-colors ${
                  activeService === service.name
                    ? 'border-[#155dfc] bg-[#155dfc]/10 text-[#155dfc]'
                    : 'border-transparent hover:bg-gray-50 text-gray-600'
                }`}
              >
                <span className="flex items-center justify-center">{service.icon}</span>
                <span className="font-medium whitespace-nowrap text-sm lg:text-base">{service.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Flight Search Form */}
      {activeService === "Flight Ticket" && (
        <section className="py-8 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-xl shadow-md p-6 lg:p-8">
            {/* Trip Type Selector */}
            <div className="flex flex-wrap space-x-2 lg:space-x-4 mb-6">
              {["Oneway", "Roundtrip", "Multipoint"].map((type) => (
                <button
                  key={type}
                  onClick={() => setTripType(type)}
                  className={`px-3 lg:px-4 py-2 rounded-lg font-medium transition-colors text-sm lg:text-base ${
                    tripType === type
                      ? 'bg-[#155dfc] text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Search Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
              {/* From */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <div className="relative">
                  <input
                    type="text"
                    value={fromLocation}
                    onChange={(e) => setFromLocation(e.target.value)}
                    onFocus={() => {
                      // Show popular cities or current suggestions
                      if (!fromLocation) {
                        setFromSuggestions(POPULAR_CITIES);
                        setShowFromDropdown(true);
                      } else if (fromSuggestions.length > 0) {
                        setShowFromDropdown(true);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                    placeholder="Type city or airport (e.g., Erbil, IST)"
                    className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#155dfc]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                  </button>
                  {isLoadingFrom && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {/* From Dropdown */}
                  {showFromDropdown && fromSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {fromSuggestions.map((location, index) => (
                        <button
                          key={index}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setFromLocation(location.displayText);
                            setShowFromDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#155dfc] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                            </svg>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{location.code} - {location.name}</div>
                              <div className="text-xs text-gray-500">{location.city}, {location.country}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex items-end">
                <button
                  onClick={swapLocations}
                  className="w-full mb-3 p-3 bg-[#155dfc] text-white rounded-lg hover:bg-[#155dfc]/90 transition-colors flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
                  </svg>
                </button>
              </div>

              {/* To */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <div className="relative">
                  <input
                    type="text"
                    value={toLocation}
                    onChange={(e) => setToLocation(e.target.value)}
                    onFocus={() => {
                      // Show popular cities or current suggestions
                      if (!toLocation) {
                        setToSuggestions(POPULAR_CITIES);
                        setShowToDropdown(true);
                      } else if (toSuggestions.length > 0) {
                        setShowToDropdown(true);
                      }
                    }}
                    onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                    placeholder="Type city or airport (e.g., Istanbul, DXB)"
                    className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#155dfc]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                  </button>
                  {isLoadingTo && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                  {/* To Dropdown */}
                  {showToDropdown && toSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {toSuggestions.map((location, index) => (
                        <button
                          key={index}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setToLocation(location.displayText);
                            setShowToDropdown(false);
                          }}
                          className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-[#155dfc] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                            </svg>
                            <div className="flex-1">
                              <div className="text-sm font-medium text-gray-900">{location.code} - {location.name}</div>
                              <div className="text-xs text-gray-500">{location.city}, {location.country}</div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Departure Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                  required
                />
              </div>

              {/* Return Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Return Date {tripType === "Oneway" && <span className="text-gray-400">(Optional)</span>}
                </label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={departureDate || new Date().toISOString().split('T')[0]}
                  disabled={tripType === "Oneway"}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
                />
              </div>
            </div>

            {/* Additional Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  value={flightClass}
                  onChange={(e) => setFlightClass(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
                >
                  <option>Economy</option>
                  <option>Business</option>
                </select>
              </div>

              {/* Passengers Selector */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
                <button
                  type="button"
                  onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-left bg-white flex items-center justify-between text-gray-900"
                >
                  <span>{getPassengerText()}</span>
                  <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Passenger Dropdown */}
                {showPassengerDropdown && (
                  <div className="absolute z-20 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                    {/* Adults */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-sm">Adults</p>
                        <p className="text-xs text-gray-500">12+ years</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setAdults(Math.max(1, adults - 1))}
                          className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-bold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">{adults}</span>
                        <button
                          type="button"
                          onClick={() => setAdults(Math.min(9, adults + 1))}
                          className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Children */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-sm">Children</p>
                        <p className="text-xs text-gray-500">2-11 years</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setChildren(Math.max(0, children - 1))}
                          className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-bold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">{children}</span>
                        <button
                          type="button"
                          onClick={() => setChildren(Math.min(9, children + 1))}
                          className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Infants */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="font-medium text-sm">Infants</p>
                        <p className="text-xs text-gray-500">Under 2 years</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          type="button"
                          onClick={() => setInfants(Math.max(0, infants - 1))}
                          className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-bold"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-medium">{infants}</span>
                        <button
                          type="button"
                          onClick={() => setInfants(Math.min(adults, infants + 1))}
                          className="w-8 h-8 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-50 font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {infants > adults && (
                      <p className="text-xs text-red-500 mb-2">Infants cannot exceed adults</p>
                    )}

                    <button
                      type="button"
                      onClick={() => setShowPassengerDropdown(false)}
                      className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-medium text-sm"
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>

              {/* Markup */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Markup</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={markup}
                    onChange={(e) => setMarkup(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="0.01"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                  />
                  <select
                    value={markupType}
                    onChange={(e) => setMarkupType(e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900"
                  >
                    <option value="fixed">$</option>
                    <option value="percentage">%</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={searchFlights}
                disabled={isSearching}
                className="bg-[#155dfc] text-white py-3 px-6 rounded-lg hover:bg-[#155dfc]/90 transition-colors font-medium flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSearching ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Searching...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                    </svg>
                    <span>Search Flight</span>
                  </>
                )}
              </button>
            </div>

            {/* Error Message */}
            {searchError && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-red-800">Search Error</p>
                  <p className="text-sm text-red-700">{searchError}</p>
                </div>
              </div>
            )}

            {/* Additional Options */}
            <div className="flex flex-wrap items-center space-x-6">
              <label className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  checked={isDirect}
                  onChange={(e) => setIsDirect(e.target.checked)}
                  className="rounded" 
                />
                <span className="text-sm text-gray-700">Direct Flights Only</span>
              </label>
            </div>
            </div>
          </div>
        </section>
      )}

      {/* Recent Searches / Optional Reservations */}
      <section className="py-8 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex space-x-8 mb-6 border-b border-gray-200">
            <button
              onClick={() => setBottomTab('recent')}
              className={
                bottomTab === 'recent'
                  ? 'flex items-center space-x-2 text-blue-600 border-b-2 border-blue-600 pb-2'
                  : 'flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors pb-2'
              }
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <span>Recent Searches</span>
            </button>
            <button
              onClick={() => setBottomTab('optional')}
              className={
                bottomTab === 'optional'
                  ? 'flex items-center space-x-2 text-blue-600 border-b-2 border-blue-600 pb-2'
                  : 'flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors pb-2'
              }
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              <span>Optional Reservations</span>
            </button>
          </div>

          {bottomTab === 'recent' ? (
            recentSearches.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Data Not Found</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-semibold text-gray-600">
                  <div className="col-span-6">Search</div>
                  <div className="col-span-3">Details</div>
                  <div className="col-span-3 text-right">Action</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {recentSearches.map((s, idx) => {
                    const fromCode = s.from.split(' - ')[0]?.trim() || s.from;
                    const toCode = s.to.split(' - ')[0]?.trim() || s.to;
                    const paxText =
                      s.passengers ||
                      `${s.adults ?? 1} Adult${(s.adults ?? 1) > 1 ? 's' : ''}` +
                        ((s.children ?? 0) > 0 ? `, ${s.children} Child${s.children === 1 ? '' : 'ren'}` : '') +
                        ((s.infants ?? 0) > 0 ? `, ${s.infants} Infant${s.infants === 1 ? '' : 's'}` : '');
                    const dateText = s.tripType === 'Roundtrip' && s.return ? `${s.departure} → ${s.return}` : s.departure;
                    const timeText = new Date(s.timestamp).toLocaleString();

                    return (
                      <div key={`${s.timestamp}-${idx}`} className="grid grid-cols-12 items-center px-4 py-4">
                        <div className="col-span-6 flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                            </svg>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{fromCode} → {toCode}</div>
                            <div className="text-xs text-gray-500">{timeText}</div>
                          </div>
                        </div>

                        <div className="col-span-3">
                          <div className="text-sm text-gray-900">{dateText}</div>
                          <div className="text-xs text-gray-500">{paxText} • {s.class || 'Economy'}{s.isDirect ? ' • Direct' : ''}</div>
                        </div>

                        <div className="col-span-3 flex justify-end">
                          <button
                            onClick={() => void handleSearchAgain(s)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                          >
                            Search Again
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Data Not Found</p>
            </div>
          )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white transform rotate-45" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                  </svg>
                </div>
                <span className="text-xl font-bold">TRUE TRAVEL</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">Your Gateway to Global Adventures</p>
              <h3 className="text-base font-semibold mb-4">Stay updated with our latest offers</h3>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                />
                <button className="bg-blue-600 px-6 py-2 rounded-r-lg hover:bg-blue-700 transition-colors">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                    <span>→</span>
                    <span>Homepage</span>
                  </a>
                </li>
                <li>
                  <a href="/panel" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                    <span>→</span>
                    <span>Panel</span>
                  </a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-400 hover:text-white transition-colors flex items-center space-x-2">
                    <span>→</span>
                    <span>Contact</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <div>
                    <p className="text-gray-300">+964 750 122 1122</p>
                    <p className="text-gray-400 text-sm">24/7 Support</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <div>
                    <p className="text-gray-300">info@truetravel.com</p>
                    <p className="text-gray-400 text-sm">Email Support</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-blue-500 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                  <div>
                    <p className="text-gray-300">Erbil, Kurdistan Region</p>
                    <p className="text-gray-400 text-sm">Iraq</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 pt-8 mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-6">
                <span className="text-white font-bold">IATA</span>
                <span className="text-white font-bold">TURSAB</span>
                <span className="text-blue-500 font-bold">Licensed Agency</span>
              </div>
              <div className="text-center text-sm text-gray-400">
                <p>Copyright © 2025. Powered by <span className="text-yellow-400 font-bold">Y</span></p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}







