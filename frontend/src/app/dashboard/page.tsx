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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showScrollUp, setShowScrollUp] = useState(false);
  
  // Flight Search State
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [departureDate, setDepartureDate] = useState("2025-10-18");
  const [returnDate, setReturnDate] = useState("2025-10-25");
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
  const [recentSearches, setRecentSearches] = useState<any[]>([]);
  
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openGoogleMaps = () => {
    const address = "Gulan St Near Nazdar Bamarny Hospital Erbil, 44002, Iraq";
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    window.open(mapsUrl, '_blank');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-GB', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
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
    const searchData = {
      from: fromLocation,
      to: toLocation,
      departure: departureDate,
      return: returnDate,
      tripType,
      passengers: getPassengerText(),
      class: flightClass,
      timestamp: new Date().toISOString()
    };

    const updatedSearches = [searchData, ...recentSearches.slice(0, 4)];
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

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Scroll up button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollUp(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading recent searches:', e);
      }
    }
  }, []);

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
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white transform rotate-45" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">TRUE TRAVEL</h1>
            </a>
            <div className="flex items-center space-x-6">
              {/* User Information */}
              <div className="flex items-center space-x-4 border-r border-gray-300 pr-6">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span className="text-sm text-gray-600 font-medium">+964 750 328 2768</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      9
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">YP</span>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-800">Younis Pshtiwan</p>
                    <p className="text-xs text-gray-500">🇬🇧 English (USD)</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-500 hover:text-red-600 font-medium transition-colors"
                >
                  Logout
                </button>
              </div>
              
              {/* Time and Settings */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="text-3xl font-light text-gray-800">{formatTime(currentTime)}</div>
                  <div className="text-sm text-gray-500">{formatDate(currentTime)}</div>
                </div>
                <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-black shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-6 py-3 overflow-x-auto">
            <a href="/dashboard" className="flex items-center space-x-2 text-orange-500 hover:text-orange-400 transition-colors whitespace-nowrap">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
              </svg>
              <span className="font-medium">Book a Service</span>
            </a>
            <a href="/panel" className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
              <span className="font-medium">Panel</span>
            </a>
            <a href="/agency" className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span className="font-medium">Agency</span>
            </a>
            <a href="/product" className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z"/>
              </svg>
              <span className="font-medium">Product</span>
            </a>
            <a href="/reservations" className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              <span className="font-medium">Reservations</span>
            </a>
            <a href="/finance" className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
              </svg>
              <span className="font-medium">Finance</span>
            </a>
            <a href="/reports" className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
              </svg>
              <span className="font-medium">Reports</span>
            </a>
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
                    ? 'border-orange-500 bg-orange-50 text-orange-600'
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
                      ? 'bg-blue-600 text-white'
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
                    className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500">
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
                            <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
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
                  className="w-full mb-3 p-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center"
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
                    className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-500">
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
                            <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                  />
                  <select
                    value={markupType}
                    onChange={(e) => setMarkupType(e.target.value)}
                    className="px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900"
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
                className="bg-orange-500 text-white py-3 px-6 rounded-lg hover:bg-orange-600 transition-colors font-medium flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
            <button className="flex items-center space-x-2 text-blue-600 border-b-2 border-blue-600 pb-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
              </svg>
              <span>Recent Searches</span>
            </button>
            <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
              </svg>
              <span>Optional Reservations</span>
            </button>
          </div>
          
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Data Not Found</p>
          </div>
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
                © 2025 True Travel. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll Up Button */}
      {showScrollUp && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
