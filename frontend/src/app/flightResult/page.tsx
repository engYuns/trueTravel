'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import FlightSearchForm from '@/components/FlightSearchForm';

function FlightResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Time state
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showFareRuleSubmenu, setShowFareRuleSubmenu] = useState(false);
  const [fareRuleSubmenuLocked, setFareRuleSubmenuLocked] = useState(false);
  const [showReservationsDropdown, setShowReservationsDropdown] = useState(false);
  const [showFinanceDropdown, setShowFinanceDropdown] = useState(false);
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);
  
  // Search criteria from URL params - now editable
  const [fromLocation, setFromLocation] = useState(searchParams.get('from') || '');
  const [toLocation, setToLocation] = useState(searchParams.get('to') || '');
  const [departureDate, setDepartureDate] = useState(searchParams.get('departureDate') || '');
  const [returnDate, setReturnDate] = useState(searchParams.get('returnDate') || '');
  const [passengers, setPassengers] = useState(searchParams.get('passengers') || '1 Adult');
  const [flightClass, setFlightClass] = useState(searchParams.get('class') || 'Economy');
  const [tripType, setTripType] = useState(searchParams.get('tripType') || 'Roundtrip');
  const [isDirect, setIsDirect] = useState(searchParams.get('isDirect') === 'true');
  const [markup, setMarkup] = useState('');
  const [amount, setAmount] = useState('');
  
  // Combined search criteria object for compatibility
  const searchCriteria = {
    from: fromLocation,
    to: toLocation,
    departureDate,
    returnDate,
    passengers,
    class: flightClass,
    tripType,
    isDirect,
  };
  
  // Location autocomplete state
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [isLoadingFrom, setIsLoadingFrom] = useState(false);
  const [isLoadingTo, setIsLoadingTo] = useState(false);

  const [flights, setFlights] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [selectedBaggage, setSelectedBaggage] = useState<string[]>([]);
  const [selectedStops, setSelectedStops] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [selectedCabinType, setSelectedCabinType] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [departureTimeRange, setDepartureTimeRange] = useState({ start: 0, end: 1439 });
  const [returnTimeRange, setReturnTimeRange] = useState({ start: 0, end: 1439 });
  const [durationRange, setDurationRange] = useState({ min: 0, max: 1440 });
  
  // Sorting and display
  const [sortBy, setSortBy] = useState('price');
  const [showCriteria, setShowCriteria] = useState(true);
  
  // Selected flights for roundtrip
  const [selectedOutboundFlight, setSelectedOutboundFlight] = useState<any>(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState<any>(null);
  const [showReturnFlights, setShowReturnFlights] = useState(false);
  const [returnFlights, setReturnFlights] = useState<any[]>([]);
  
  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingFlightClasses, setBookingFlightClasses] = useState<{ outbound: any[], return: any[] }>({ outbound: [], return: [] });
  const [selectedOutboundClass, setSelectedOutboundClass] = useState<any>(null);
  const [selectedReturnClass, setSelectedReturnClass] = useState<any>(null);
  const [isLoadingClasses, setIsLoadingClasses] = useState(false);

  // Helper functions for header
  const handleLogout = () => {
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
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

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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

  // Helper function to change date by days
  const changeDateByDays = (dateString: string, days: number): string => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + days);
    return date.toISOString().split('T')[0];
  };

  // Function to search flights with new date
  const searchFlightsForDate = async (newDepartureDate: string, newReturnDate: string | null = null, criteria: any = null) => {
    setIsLoading(true);
    setError('');

    try {
      // Use passed criteria or current searchCriteria state
      const activeCriteria = criteria || searchCriteria;
      
      // Extract airport codes from location strings
      const originCode = activeCriteria.from.split(' - ')[0].trim();
      const destinationCode = activeCriteria.to.split(' - ')[0].trim();

      // Prepare API request
      const requestBody = {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: newDepartureDate,
        returnDate: activeCriteria.tripType === 'Roundtrip' && newReturnDate ? newReturnDate : undefined,
        adults: parseInt(activeCriteria.passengers.match(/(\d+)\s*Adult/)?.[1] || '1'),
        children: parseInt(activeCriteria.passengers.match(/(\d+)\s*Child/)?.[1] || '0'),
        infants: parseInt(activeCriteria.passengers.match(/(\d+)\s*Infant/)?.[1] || '0'),
        travelClass: activeCriteria.class,
        nonStop: activeCriteria.isDirect,
        currencyCode: 'USD',
        maxResults: 50,
      };

      console.log('Searching flights for new date:', requestBody);

      // Call API
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
        console.log(`Found ${data.data.length} flights for new date`);
        
        // Update flights
        setFlights(data.data);
        
        // Store in localStorage
        localStorage.setItem('flightSearchResults', JSON.stringify(data.data));
        
        // Update dates
        setDepartureDate(newDepartureDate);
        if (newReturnDate) {
          setReturnDate(newReturnDate);
        }
        
        // Calculate price range from results
        if (data.data.length > 0) {
          const prices = data.data.map((f: any) => f.price || 0);
          setPriceRange({ min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) });
        }
      } else {
        setFlights([]);
        setError('No flights found for this date');
      }

    } catch (error: any) {
      console.error('Flight search error:', error);
      setError(error.message || 'Failed to search flights. Please try again.');
      setFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Previous Day button for OUTBOUND flights
  const handlePreviousDay = async () => {
    const newDepartureDate = changeDateByDays(searchCriteria.departureDate, -1);
    await searchFlightsForDate(newDepartureDate, searchCriteria.returnDate);
    
    // Reset selections when changing date
    setSelectedOutboundFlight(null);
    setSelectedReturnFlight(null);
    setShowReturnFlights(false);
    
    // Reload return flights for roundtrip
    if (searchCriteria.tripType === 'Roundtrip' && searchCriteria.returnDate) {
      const updatedCriteria = { 
        ...searchCriteria, 
        departureDate: newDepartureDate 
      };
      await searchReturnFlightsInitial(updatedCriteria);
    }
  };

  // Handle Next Day button for OUTBOUND flights
  const handleNextDay = async () => {
    const newDepartureDate = changeDateByDays(searchCriteria.departureDate, 1);
    await searchFlightsForDate(newDepartureDate, searchCriteria.returnDate);
    
    // Reset selections when changing date
    setSelectedOutboundFlight(null);
    setSelectedReturnFlight(null);
    setShowReturnFlights(false);
    
    // Reload return flights for roundtrip
    if (searchCriteria.tripType === 'Roundtrip' && searchCriteria.returnDate) {
      const updatedCriteria = { 
        ...searchCriteria, 
        departureDate: newDepartureDate 
      };
      await searchReturnFlightsInitial(updatedCriteria);
    }
  };

  // Handle Previous Day button for RETURN flights
  const handleReturnPreviousDay = async () => {
    const newReturnDate = changeDateByDays(searchCriteria.returnDate!, -1);
    setReturnDate(newReturnDate);
    // Reset return flight selection
    setSelectedReturnFlight(null);
    // Re-search return flights with new date
    await searchReturnFlightsForDate(newReturnDate);
  };

  // Handle Next Day button for RETURN flights
  const handleReturnNextDay = async () => {
    const newReturnDate = changeDateByDays(searchCriteria.returnDate!, 1);
    setReturnDate(newReturnDate);
    // Reset return flight selection
    setSelectedReturnFlight(null);
    // Re-search return flights with new date
    await searchReturnFlightsForDate(newReturnDate);
  };

  // Search return flights for a specific date
  const searchReturnFlightsForDate = async (returnDate: string) => {
    setIsLoading(true);
    setError('');

    try {
      const originCode = searchCriteria.to.split(' - ')[0].trim();
      const destinationCode = searchCriteria.from.split(' - ')[0].trim();

      const requestBody = {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: returnDate,
        adults: parseInt(searchCriteria.passengers.match(/(\d+)\s*Adult/)?.[1] || '1'),
        children: parseInt(searchCriteria.passengers.match(/(\d+)\s*Child/)?.[1] || '0'),
        infants: parseInt(searchCriteria.passengers.match(/(\d+)\s*Infant/)?.[1] || '0'),
        travelClass: searchCriteria.class,
        nonStop: searchCriteria.isDirect,
        currencyCode: 'USD',
        maxResults: 50,
      };

      console.log('Searching return flights for date:', returnDate, requestBody);

      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('Return flights API response:', data);

      if (data.success && data.data && data.data.length > 0) {
        setReturnFlights(data.data);
      } else {
        setReturnFlights([]);
        setError('No return flights found for this date');
      }
    } catch (error: any) {
      console.error('Return flight search error:', error);
      setError(error.message || 'Failed to search return flights');
      setReturnFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Search Flights button - perform new search with current criteria
  const handleSearchFlights = async () => {
    // Reset selections
    setSelectedOutboundFlight(null);
    setSelectedReturnFlight(null);
    setShowReturnFlights(false);
    setReturnFlights([]);
    
    // Perform new search with current criteria
    await searchFlightsForDate(searchCriteria.departureDate, searchCriteria.returnDate, searchCriteria);
    
    // If roundtrip, also load initial return flights
    if (searchCriteria.tripType === 'Roundtrip' && searchCriteria.returnDate) {
      await searchReturnFlightsInitial(searchCriteria);
    }
  };

  // Handle BUY NOW button - fetch flight class options
  const handleBuyNow = async () => {
    setIsLoadingClasses(true);
    setShowBookingModal(true);
    
    try {
      // Fetch flight class options from Amadeus API
      // We'll use the Amadeus Flight Offers Price API to get detailed pricing with different classes
      const outboundOfferId = selectedOutboundFlight?.amadeus_id || selectedOutboundFlight?.id;
      const returnOfferId = selectedReturnFlight?.amadeus_id || selectedReturnFlight?.id;
      
      console.log('Fetching class options for:', { outboundOfferId, returnOfferId });
      
      // For now, simulate the class data based on the selected flights
      // In production, you would call the Amadeus Flight Offers Price API
      const outboundClasses = [
        {
          name: 'Economy Value',
          features: [
            { text: 'FREE BAGGAGE ALLOWANCE', available: true },
            { text: 'CARRY ON BAGGAGE', available: true },
            { text: 'MILEAGE ACCRUAL', available: true },
            { text: 'CHANGEABLE TICKET', available: false, cost: true },
            { text: 'REFUND BEFORE DEPARTURE', available: false, cost: true },
            { text: 'PRE RESERVED SEAT ASSIGNMENT', available: false },
          ],
          price: selectedOutboundFlight?.price || 0,
          selected: true,
        },
        {
          name: 'Economy Flex',
          features: [
            { text: 'FREE BAGGAGE ALLOWANCE', available: true },
            { text: 'CARRY ON BAGGAGE', available: true },
            { text: 'MILEAGE ACCRUAL', available: true },
            { text: 'CHANGEABLE TICKET', available: true },
            { text: 'REFUND AFTER DEPARTURE', available: true },
            { text: 'REFUND BEFORE DEPARTURE', available: true },
          ],
          price: (selectedOutboundFlight?.price || 0) * 1.25,
          selected: false,
        },
        {
          name: 'Business Flex',
          features: [
            { text: 'FREE BAGGAGE ALLOWANCE', available: true },
            { text: 'CARRY ON BAGGAGE', available: true },
            { text: 'MILEAGE ACCRUAL', available: true },
            { text: 'PRE RESERVED SEAT ASSIGNMENT', available: true },
            { text: 'CHANGEABLE TICKET', available: false, cost: true },
            { text: 'REFUND AFTER DEPARTURE', available: false, cost: true },
          ],
          price: (selectedOutboundFlight?.price || 0) * 2.88,
          selected: false,
        },
      ];

      const returnClasses = [
        {
          name: 'Basic',
          features: [
            { text: '1X8 KG Cabin Baggage', available: true },
            { text: 'MILEAGE ACCRUAL', available: true },
            { text: 'CHANGEABLE TICKET', available: false, cost: true },
            { text: 'REFUND BEFORE DEPARTURE', available: false, cost: true },
            { text: 'PRE RESERVED SEAT ASSIGNMENT', available: false },
          ],
          price: selectedReturnFlight?.price || 0,
          selected: true,
        },
        {
          name: 'ECOJET',
          features: [
            { text: '1X8 KG Cabin Baggage', available: true },
            { text: '1X20 KG Baggage', available: true },
            { text: 'Changeable With Penalty', available: true },
            { text: 'REFUND AFTER DEPARTURE', available: true },
            { text: 'REFUND BEFORE DEPARTURE', available: true },
          ],
          price: (selectedReturnFlight?.price || 0) * 1.19,
          selected: false,
        },
        {
          name: 'FLEX',
          features: [
            { text: '1X8 KG Cabin Baggage', available: true },
            { text: 'Standart Seat Selection', available: true },
            { text: 'Changeable With Penalty', available: true },
            { text: 'Refundable With Penalty', available: true },
          ],
          price: (selectedReturnFlight?.price || 0) * 1.32,
          selected: false,
        },
      ];

      setBookingFlightClasses({
        outbound: outboundClasses,
        return: returnClasses,
      });
      
      setSelectedOutboundClass(outboundClasses[0]);
      setSelectedReturnClass(returnClasses[0]);
      
    } catch (error) {
      console.error('Error fetching class options:', error);
    } finally {
      setIsLoadingClasses(false);
    }
  };

  // Handle Select Flight button
  const handleSelectFlight = async (flight: any) => {
    // If it's a one-way trip or return flights are already shown, just select the flight
    if (searchCriteria.tripType !== 'Roundtrip') {
      console.log('One-way flight selected:', flight);
      // TODO: Navigate to booking page or show booking form
      return;
    }

    // For roundtrip: if this is outbound flight selection
    if (!showReturnFlights) {
      setSelectedOutboundFlight(flight);
      setShowReturnFlights(true);
      
      // Search for return flights (reverse direction)
      // Pass the selected flight so sorting can happen
      await searchReturnFlights(flight);
    } else {
      // This is return flight selection
      setSelectedReturnFlight(flight);
      console.log('Roundtrip complete:', {
        outbound: selectedOutboundFlight,
        return: flight
      });
      // TODO: Navigate to booking page with both flights
    }
  };

  // Search for return flights (reverse route)
  const searchReturnFlights = async (selectedFlight: any = null) => {
    setIsLoading(true);
    setError('');

    try {
      // Use passed flight or state
      const outboundFlight = selectedFlight || selectedOutboundFlight;
      
      // Extract airport codes (reversed for return)
      const originCode = searchCriteria.to.split(' - ')[0].trim();
      const destinationCode = searchCriteria.from.split(' - ')[0].trim();

      // Prepare API request for return flights
      const requestBody = {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: searchCriteria.returnDate,
        adults: parseInt(searchCriteria.passengers.match(/(\d+)\s*Adult/)?.[1] || '1'),
        children: parseInt(searchCriteria.passengers.match(/(\d+)\s*Child/)?.[1] || '0'),
        infants: parseInt(searchCriteria.passengers.match(/(\d+)\s*Infant/)?.[1] || '0'),
        travelClass: searchCriteria.class,
        nonStop: searchCriteria.isDirect,
        currencyCode: 'USD',
        maxResults: 50,
      };

      console.log('Searching return flights:', requestBody);

      // Call API
      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search return flights');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        console.log(`Found ${data.data.length} return flights`);
        console.log('Selected outbound airline:', outboundFlight?.airline, 'Logo:', outboundFlight?.logo);
        
        // Create a copy and sort return flights: same airline first, then others
        const sortedReturnFlights = [...data.data].sort((a: any, b: any) => {
          const aCarrierCode = a.carrierCode || '';
          const bCarrierCode = b.carrierCode || '';
          const selectedCarrierCode = outboundFlight?.carrierCode || '';
          
          const aIsSameAirline = aCarrierCode === selectedCarrierCode;
          const bIsSameAirline = bCarrierCode === selectedCarrierCode;
          
          console.log(`🔄 Comparing: [${a.airline}]${aIsSameAirline?'✅':''} vs [${b.airline}]${bIsSameAirline?'✅':''}`);
          
          // Same airline comes first (return negative to put 'a' before 'b')
          if (aIsSameAirline && !bIsSameAirline) {
            console.log(`   → ${a.airline} wins (same airline)`);
            return -1;
          }
          if (!aIsSameAirline && bIsSameAirline) {
            console.log(`   → ${b.airline} wins (same airline)`);
            return 1;
          }
          
          // Within same priority group, sort by price
          const priceCompare = (a.price || 0) - (b.price || 0);
          console.log(`   → Same priority, price compare: ${priceCompare}`);
          return priceCompare;
        });
        
        const sameAirlineCount = sortedReturnFlights.filter((f: any) => {
          return f.carrierCode === outboundFlight?.carrierCode;
        }).length;
        
        console.log(`✈️ Prioritizing ${outboundFlight?.airline} (${outboundFlight?.carrierCode}) flights for return. Found ${sameAirlineCount} matching flights.`);
        console.log('First 3 sorted flights:', sortedReturnFlights.slice(0, 3).map((f: any) => ({
          airline: f.airline,
          carrierCode: f.carrierCode,
          price: f.price
        })));
        console.log('🔍 Full sorted array order:', sortedReturnFlights.map((f: any, i: number) => `${i}: ${f.airline} (${f.carrierCode}) ($${f.price})`));
        
        setReturnFlights(sortedReturnFlights);
        
        // Verify state immediately after setState
        console.log('✅ State set with', sortedReturnFlights.length, 'return flights');
      } else {
        setReturnFlights([]);
        setError('No return flights found');
      }

    } catch (error: any) {
      console.error('Return flight search error:', error);
      setError(error.message || 'Failed to search return flights. Please try again.');
      setReturnFlights([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      // Load search criteria from localStorage
      const storedCriteria = localStorage.getItem('searchCriteria');
      if (storedCriteria) {
        const criteria = JSON.parse(storedCriteria);
        // Update individual state variables
        setFromLocation(criteria.from || fromLocation);
        setToLocation(criteria.to || toLocation);
        setDepartureDate(criteria.departureDate || departureDate);
        setReturnDate(criteria.returnDate || returnDate);
        setPassengers(criteria.passengers || passengers);
        setFlightClass(criteria.class || flightClass);
        setTripType(criteria.tripType || tripType);
        setIsDirect(criteria.isDirect || isDirect);
        
        // Fetch fresh departure flights from API (real-time data)
        console.log('Fetching fresh departure flights from API...');
        await searchFlightsForDate(criteria.departureDate, criteria.returnDate, criteria);
        
        // Automatically search for return flights if roundtrip
        if (criteria.tripType === 'Roundtrip' && criteria.returnDate) {
          console.log('Loading return flights for roundtrip...');
          await searchReturnFlightsInitial(criteria);
        }
      } else {
        // Fallback: Load flights from localStorage if no criteria found
        const storedFlights = localStorage.getItem('flightSearchResults');
        if (storedFlights) {
          const results = JSON.parse(storedFlights);
          setFlights(results);
          
          // Calculate price range from results
          if (results.length > 0) {
            const prices = results.map((f: any) => f.price || 0);
            setPriceRange({ min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) });
          }
        }
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Debug: Log when returnFlights state changes
  useEffect(() => {
    console.log('🔍 returnFlights state changed:', {
      length: returnFlights.length,
      tripType: searchCriteria.tripType,
      returnDate: searchCriteria.returnDate,
      hasOutboundSelection: !!selectedOutboundFlight,
      departureFlights: flights.length
    });
  }, [returnFlights, searchCriteria.tripType, searchCriteria.returnDate, selectedOutboundFlight, flights.length]);

  // Search return flights on initial load
  const searchReturnFlightsInitial = async (criteria: any) => {
    try {
      console.log('Searching initial return flights...');
      
      // Check if criteria has the required fields
      if (!criteria.to || !criteria.from || !criteria.returnDate) {
        console.error('Missing required fields for return flights');
        return;
      }

      const originCode = criteria.to.split(' - ')[0].trim();
      const destinationCode = criteria.from.split(' - ')[0].trim();

      const requestBody = {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: criteria.returnDate,
        adults: parseInt(criteria.passengers.match(/(\d+)\s*Adult/)?.[1] || '1'),
        children: parseInt(criteria.passengers.match(/(\d+)\s*Child/)?.[1] || '0'),
        infants: parseInt(criteria.passengers.match(/(\d+)\s*Infant/)?.[1] || '0'),
        travelClass: criteria.class,
        nonStop: criteria.isDirect,
        currencyCode: 'USD',
        maxResults: 50,
      };

      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data && data.data.length > 0) {
          console.log(`✅ Loaded ${data.data.length} return flights`);
          setReturnFlights(data.data);
        } else {
          console.log('No return flights found');
          setReturnFlights([]);
        }
      } else {
        console.error('Return flights API error:', response.status);
        setReturnFlights([]);
      }
    } catch (error) {
      console.error('Error loading return flights:', error);
      setReturnFlights([]);
    }
  };


  // Extract unique airlines from flights
  const airlines = [...new Set(flights.map(f => f.logo || f.airline || 'Unknown'))];
  
  // Filter and sort flights
  const filteredFlights = flights.filter(flight => {
    // Airline filter
    if (selectedAirlines.length > 0) {
      const airline = flight.logo || flight.airline;
      if (!selectedAirlines.includes(airline)) return false;
    }
    
    // Price filter
    const price = flight.price || 0;
    if (price < priceRange.min || price > priceRange.max) return false;
    
    // Stops filter
    if (selectedStops.length > 0) {
      const isDirect = flight.stops === 'Direct' || flight.stops === '0 Stops';
      if (selectedStops.includes('direct') && !isDirect) return false;
      if (selectedStops.includes('connecting') && isDirect) return false;
    }
    
    // Cabin type filter
    if (selectedCabinType.length > 0) {
      const cabin = flight.class?.toLowerCase() || 'economy';
      if (!selectedCabinType.some(c => cabin.includes(c.toLowerCase()))) return false;
    }
    
    return true;
  });

  // Sort flights
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    if (sortBy === 'price') {
      return (a.price || 0) - (b.price || 0);
    } else if (sortBy === 'duration') {
      const durationA = parseDuration(a.duration || '0h 0m');
      const durationB = parseDuration(b.duration || '0h 0m');
      return durationA - durationB;
    }
    return 0;
  });

  function parseDuration(duration: string): number {
    // Handle both formats: "5h 10m" and "PT5H10M"
    const hours = duration.match(/(\d+)h/i)?.[1] || duration.match(/(\d+)H/)?.[1] || '0';
    const minutes = duration.match(/(\d+)m/i)?.[1] || duration.match(/(\d+)M/)?.[1] || '0';
    return parseInt(hours) * 60 + parseInt(minutes);
  }

  // Location autocomplete functions
  const fetchLocationSuggestions = async (query: string, setLoading: (val: boolean) => void, setSuggestions: (val: any[]) => void) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/locations/search?keyword=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success && data.data) {
        setSuggestions(data.data.slice(0, 8));
      }
    } catch (error) {
      console.error('Location search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFromLocationChange = (value: string) => {
    setFromLocation(value);
    setShowFromDropdown(true);
    fetchLocationSuggestions(value, setIsLoadingFrom, setFromSuggestions);
  };

  const handleToLocationChange = (value: string) => {
    setToLocation(value);
    setShowToDropdown(true);
    fetchLocationSuggestions(value, setIsLoadingTo, setToSuggestions);
  };

  const selectFromLocation = (location: any) => {
    const locationText = `${location.iataCode} - ${location.name}`;
    setFromLocation(locationText);
    setShowFromDropdown(false);
  };

  const selectToLocation = (location: any) => {
    const locationText = `${location.iataCode} - ${location.name}`;
    setToLocation(locationText);
    setShowToDropdown(false);
  };

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  // New search function
  const handleNewSearch = async () => {
    if (!fromLocation || !toLocation || !departureDate) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');
    setFlights([]);
    setReturnFlights([]);
    setSelectedOutboundFlight(null);
    setSelectedReturnFlight(null);

    try {
      const originCode = fromLocation.split(' - ')[0].trim();
      const destinationCode = toLocation.split(' - ')[0].trim();

      const requestBody = {
        originLocationCode: originCode,
        destinationLocationCode: destinationCode,
        departureDate: departureDate,
        returnDate: tripType === "Roundtrip" ? returnDate : undefined,
        adults: 1,
        children: 0,
        infants: 0,
        travelClass: flightClass,
        nonStop: isDirect,
        currencyCode: 'USD',
        maxResults: 50,
      };

      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to search flights');
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setFlights(data.data);
        localStorage.setItem('flightSearchResults', JSON.stringify(data.data));
        
        // Update URL with new search criteria
        const newSearchParams = new URLSearchParams({
          from: fromLocation,
          to: toLocation,
          departureDate: departureDate,
          returnDate: returnDate || '',
          passengers: passengers,
          class: flightClass,
          tripType: tripType,
          isDirect: isDirect.toString(),
        });
        
        router.push(`/flightResult?${newSearchParams.toString()}`, { scroll: false });
      } else {
        throw new Error('No flights found');
      }
    } catch (error: any) {
      console.error('Flight search error:', error);
      setError(error.message || 'Failed to search flights');
    } finally {
      setIsLoading(false);
    }
  };

  function formatDuration(duration: string): string {
    // Already formatted like "5h 10m", just make it pretty
    const hours = duration.match(/(\d+)h/i)?.[1] || duration.match(/(\d+)H/)?.[1] || '0';
    const minutes = duration.match(/(\d+)m/i)?.[1] || duration.match(/(\d+)M/)?.[1] || '0';
    return `${hours} H ${minutes} Min.`;
  }

  function getAirlineName(code: string): string {
    const airlines: { [key: string]: string } = {
      'EK': 'Emirates',
      'TK': 'Turkish Airlines',
      'QR': 'Qatar Airways',
      'RJ': 'Royal Jordanian',
      'MS': 'Egyptair',
      'FZ': 'Flynas',
      'KU': 'Kuwait Airways',
      'ME': 'Middle East Airlines',
      'SV': 'Saudia Arabian Airlines',
      'HY': 'Uzbekistan Airways',
      'XY': 'Flynas',
      'VF': 'AJet',
    };
    return airlines[code] || code;
  }

  const toggleFilter = (selected: string[], setSelected: (arr: string[]) => void, value: string) => {
    if (selected.includes(value)) {
      setSelected(selected.filter(item => item !== value));
    } else {
      setSelected([...selected, value]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
      <nav className="bg-black shadow-sm relative z-[99999] overflow-visible">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 overflow-visible">
          <div className="flex items-center space-x-6 py-3 overflow-x-auto overflow-y-visible">
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
            
            {/* Agency Dropdown */}
            <div 
              className="relative z-[200]"
              onMouseEnter={() => setShowAgencyDropdown(true)}
              onMouseLeave={() => setShowAgencyDropdown(false)}
            >
              <button className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
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
                <div className="fixed top-[115px] w-56 bg-white rounded-lg shadow-lg py-2 z-[99999] border border-gray-200">
                  <a 
                    href="/agency/agencies" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span className="font-medium">Agencies</span>
                    </div>
                  </a>
                  <a 
                    href="/agency/sales-representatives" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                      </svg>
                      <span className="font-medium">Sales Representatives</span>
                    </div>
                  </a>
                  <a 
                    href="/agency/customers" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
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
              <a href="#" className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
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
                <div className="fixed top-[115px] w-56 bg-white rounded-lg shadow-lg py-2 z-[99999] border border-gray-200">
                  <a 
                    href="/product/offers" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
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
                      className="flex items-center justify-between px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium">Fare Rule</span>
                      </div>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    {showFareRuleSubmenu && (
                      <div className="absolute left-full top-0 -ml-px w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                        <a 
                          href="/product/fare-rule/flight-ticket" 
                          className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                            <span className="font-medium">Flight Ticket</span>
                          </div>
                        </a>
                        <a 
                          href="/product/fare-rule/hotel" 
                          className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span className="font-medium">Hotel</span>
                          </div>
                        </a>
                        <a 
                          href="/product/fare-rule/rent-a-car" 
                          className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                              <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                            </svg>
                            <span className="font-medium">Rent A Car</span>
                          </div>
                        </a>
                        <a 
                          href="/product/fare-rule/transfer" 
                          className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
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
              className="relative"
              onMouseEnter={() => setShowReservationsDropdown(true)}
              onMouseLeave={() => setShowReservationsDropdown(false)}
            >
              <a href="#" className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/>
                </svg>
                <span className="font-medium">Reservations</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showReservationsDropdown ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              
              {/* Dropdown Menu */}
              {showReservationsDropdown && (
                <div className="fixed top-[115px] w-56 bg-white rounded-lg shadow-lg py-2 z-[99999] border border-gray-200">
                  <a 
                    href="/reservations/all" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">All Reservations</span>
                    </div>
                  </a>
                  <a 
                    href="/reservations/flight-ticket" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                      </svg>
                      <span className="font-medium">Flight Ticket</span>
                    </div>
                  </a>
                  <a 
                    href="/reservations/hotel" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                      </svg>
                      <span className="font-medium">Hotel</span>
                    </div>
                  </a>
                  <a 
                    href="/reservations/transfer" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Transfer</span>
                    </div>
                  </a>
                  <a 
                    href="/reservations/rent-a-car" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      <span className="font-medium">Rent A Car</span>
                    </div>
                  </a>
                  <a 
                    href="/reservations/tour" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Tour</span>
                    </div>
                  </a>
                  <a 
                    href="/reservations/visa" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Visa</span>
                    </div>
                  </a>
                </div>
              )}
            </div>
            
            {/* Finance Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setShowFinanceDropdown(true)}
              onMouseLeave={() => setShowFinanceDropdown(false)}
            >
              <a href="#" className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
                </svg>
                <span className="font-medium">Finance</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${showFinanceDropdown ? 'rotate-180' : ''}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
              
              {/* Dropdown Menu */}
              {showFinanceDropdown && (
                <div className="fixed top-[115px] w-56 bg-white rounded-lg shadow-lg py-2 z-[99999] border border-gray-200">
                  <a 
                    href="/finance/agency-accounts" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Agency Accounts</span>
                    </div>
                  </a>
                  <a 
                    href="/finance/receiving-discharge" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Receiving and Discharge</span>
                    </div>
                  </a>
                  <a 
                    href="/finance/virement" 
                    className="block px-4 py-2 text-gray-800 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                  >
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Virement</span>
                    </div>
                  </a>
                </div>
              )}
            </div>
            
            <div 
              className="relative"
              onMouseEnter={() => setShowReportsDropdown(true)}
              onMouseLeave={() => setShowReportsDropdown(false)}
            >
              <button className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
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
                <div className="fixed top-[115px] w-56 bg-white rounded-lg shadow-lg py-2 z-[99999] border border-gray-200">
                  <a href="/reports/flight-ticket/sales" className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                    <span>Flight Ticket Sales</span>
                  </a>
                  <a href="/reports/hotel/sales" className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
                    </svg>
                    <span>Hotel Sales</span>
                  </a>
                  <a href="/reports/rent-a-car/sales" className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                    <span>Rent A Car Sales</span>
                  </a>
                  <a href="/reports/tour/sales" className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span>Tour Sales</span>
                  </a>
                  <a href="/reports/transfer/sales" className="flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    </svg>
                    <span>Transfer Sales</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Search Criteria Section */}
      {showCriteria && (
        <div className="relative bg-gray-100 py-4 md:py-8">
          <div className="max-w-7xl mx-auto px-2 sm:px-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Modify Search</h1>
              <button
                onClick={() => setShowCriteria(false)}
                className="text-gray-600 hover:text-orange-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <FlightSearchForm
              initialData={{
                from: fromLocation,
                to: toLocation,
                departureDate,
                returnDate,
                adults: parseInt(passengers.match(/(\d+)\s*Adult/)?.[1] || '1'),
                children: parseInt(passengers.match(/(\d+)\s*Child/)?.[1] || '0'),
                infants: parseInt(passengers.match(/(\d+)\s*Infant/)?.[1] || '0'),
                flightClass,
                tripType,
                markup,
                isDirect
              }}
              onSearchComplete={() => {
                // Reload the page to show new results
                window.location.reload();
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 md:py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 text-white rounded-t-lg p-3 sm:p-4">
              <div className="flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-800" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
              <h2 className="text-xl font-bold text-center mt-2">Filter</h2>
            </div>

            <div className="bg-white rounded-b-lg shadow-lg">
              {/* Airlines Filter */}
              <div className="border-b border-gray-200">
                <button
                  className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50"
                  onClick={() => {}}
                >
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                    <span className="font-bold text-gray-900">Airlines</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="px-4 pb-4">
                  {airlines.slice(0, 10).map((airline) => (
                    <label key={airline} className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedAirlines.includes(airline)}
                        onChange={() => toggleFilter(selectedAirlines, setSelectedAirlines, airline)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{getAirlineName(airline)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Baggage Filter */}
              <div className="border-b border-gray-200">
                <button className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2 0 .55.45 1 1 1s1-.45 1-1h6c0 .55.45 1 1 1s1-.45 1-1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9.5 18H8V9h1.5v9zm3.25 0h-1.5V9h1.5v9zm.75-12h-3V3.5h3V6zM16 18h-1.5V9H16v9z"/>
                    </svg>
                    <span className="font-bold text-gray-900">Baggage</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="px-4 pb-4">
                  {['1 PC', '2 PC', '20 KG', '25 KG', '30 KG', 'Hand Bag'].map((bag) => (
                    <label key={bag} className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedBaggage.includes(bag)}
                        onChange={() => toggleFilter(selectedBaggage, setSelectedBaggage, bag)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{bag}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="border-b border-gray-200">
                <button className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-gray-900">Price Range</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="px-4 pb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">USD {priceRange.min}</span>
                    <span className="text-sm font-medium text-gray-600">USD {priceRange.max}</span>
                  </div>
                  <input
                    type="range"
                    min={priceRange.min}
                    max={priceRange.max}
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                    className="w-full h-2 bg-orange-500 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              {/* Stopovers Filter */}
              <div className="border-b border-gray-200">
                <button className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-bold text-gray-900">Stopovers</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="px-4 pb-4">
                  {[
                    { value: 'direct', label: 'Direct' },
                    { value: 'connecting', label: 'Connecting' },
                  ].map((stop) => (
                    <label key={stop.value} className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedStops.includes(stop.value)}
                        onChange={() => toggleFilter(selectedStops, setSelectedStops, stop.value)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{stop.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Groups Filter */}
              <div className="border-b border-gray-200">
                <button className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                    </svg>
                    <span className="font-bold text-gray-900">Groups</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="px-4 pb-4">
                  {['OneWay', 'Package'].map((group) => (
                    <label key={group} className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group)}
                        onChange={() => toggleFilter(selectedGroups, setSelectedGroups, group)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{group}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cabin Type Filter */}
              <div>
                <button className="w-full px-4 py-4 flex items-center justify-between text-left hover:bg-gray-50">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 9.3V4h-3v2.6L12 3 2 12h3v8h5v-6h4v6h5v-8h3l-3-2.7zM10 10c0-1.1.9-2 2-2s2 .9 2 2h-4z"/>
                    </svg>
                    <span className="font-bold text-gray-900">Cabin Type</span>
                  </div>
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <div className="px-4 pb-4">
                  {['Business', 'Economy', 'Promotion'].map((cabin) => (
                    <label key={cabin} className="flex items-center space-x-2 py-2 cursor-pointer hover:bg-gray-50 -mx-2 px-2 rounded">
                      <input
                        type="checkbox"
                        checked={selectedCabinType.includes(cabin)}
                        onChange={() => toggleFilter(selectedCabinType, setSelectedCabinType, cabin)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-gray-700">{cabin}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            {/* Sorting Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4 flex items-center justify-between">
              <div className="flex space-x-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="price">Increasing per price</option>
                  <option value="duration">Travel Duration</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500">
                  <option>Hour</option>
                </select>
                <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-blue-500">
                  <option>Travel Duration</option>
                </select>
              </div>
            </div>

            {/* Departure Flights Header */}
            {sortedFlights.length > 0 && (
              <div className="bg-orange-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg mb-4">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                  {searchCriteria.tripType === 'Roundtrip' ? 'Departure Flights' : 'Available Flights'}
                </h2>
                <p className="text-xs sm:text-sm mt-1">
                  {searchCriteria.from.split(' - ')[0]} to {searchCriteria.to.split(' - ')[0]} on {searchCriteria.departureDate}
                </p>
              </div>
            )}

            {/* Day Navigation */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4">
              <button 
                onClick={handlePreviousDay}
                disabled={isLoading}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
              >
                « Previous Day
              </button>
              <div className="bg-orange-500 text-white py-2 sm:py-3 rounded-lg font-bold text-center text-xs sm:text-sm md:text-base flex items-center justify-center px-2">
                <span className="hidden sm:inline">{searchCriteria.from.split(' - ')[0] || 'Origin'} - {searchCriteria.to.split(' - ')[0] || 'Destination'} / </span>{searchCriteria.departureDate}
              </div>
              <button 
                onClick={handleNextDay}
                disabled={isLoading}
                className="bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
              >
                Next Day »
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-8 sm:py-12">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-3 sm:mt-4 text-sm sm:text-base text-gray-600">Loading flights...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4">
                <p className="text-sm sm:text-base text-red-700">{error}</p>
              </div>
            )}

            {/* Flight Cards */}
            {!isLoading && sortedFlights.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-8 sm:p-12 text-center">
                <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No Flights Found</h3>
                <p className="text-sm sm:text-base text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            )}

            {sortedFlights.map((flight, index) => {
              // Use transformed data structure
              const airline = flight.airline || 'Unknown';
              const logo = flight.logo || '';
              const flightNumber = flight.flightNumber || '';
              const price = flight.price || 0;
              
              // Debug: Log logo URL
              if (index === 0) {
                console.log('🖼️ First flight logo URL:', logo);
                console.log('🖼️ First flight data:', flight);
              }
              const departureTime = flight.departure?.time || '';
              const departureAirport = flight.departure?.airport || '';
              const arrivalTime = flight.arrival?.time || '';
              const arrivalAirport = flight.arrival?.airport || '';
              const duration = flight.duration || '';
              const stops = flight.stops || 'Direct';
              const cabin = flight.class || 'Economy';
              const availability = flight.availability || '';
              const isSelected = selectedOutboundFlight?.id === flight.id;
              
              // Hide non-selected flights when one is selected
              if (selectedOutboundFlight && !isSelected) {
                return null;
              }
              
              return (
                <div key={index}>
                  <div
                    className={`bg-white rounded-lg shadow-sm mb-4 overflow-hidden ${
                      isSelected 
                        ? 'border-4 border-green-500' 
                        : `border-l-4 ${
                            cabin.toLowerCase().includes('business') ? 'border-purple-500' :
                            cabin.toLowerCase().includes('promotion') || price < 500 ? 'border-red-400 bg-green-50' :
                            'border-blue-400'
                          }`
                    }`}
                  >
                    <div className="p-6">
                      {isSelected && (
                        <div className="mb-4 flex items-center justify-between bg-green-100 p-3 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-green-700 font-bold">Outbound Flight Selected</span>
                          </div>
                          <button
                            onClick={() => {
                              setShowReturnFlights(false);
                              setSelectedOutboundFlight(null);
                              setReturnFlights([]);
                            }}
                            className="text-sm text-red-600 hover:text-red-800 font-medium"
                          >
                            Change Flight
                          </button>
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                        {/* Airline Info */}
                        <div className="flex items-center space-x-3 md:w-1/5">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            {/* Airline Logo */}
                            {logo && (
                              <img 
                                src={logo} 
                                alt={airline}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-contain bg-gray-100 rounded p-1 flex-shrink-0"
                                onError={(e) => {
                                  // Hide if logo fails to load
                                  e.currentTarget.style.display = 'none';
                                  console.warn(`Failed to load logo for ${airline}: ${logo}`);
                                }}
                                onLoad={() => {
                                  console.log(`✅ Logo loaded for ${airline}: ${logo}`);
                                }}
                              />
                            )}
                            <div className="text-left">
                              <div className="text-red-600 text-lg sm:text-xl font-bold">{airline}</div>
                              <div className="text-xs sm:text-sm text-gray-600">{flightNumber}</div>
                            </div>
                          </div>
                        </div>

                        {/* Flight Times */}
                        <div className="flex items-center justify-between md:space-x-4 lg:space-x-8 flex-1">
                          <div className="text-center">
                            <div className="flex flex-col sm:flex-row items-center sm:space-x-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mb-1 sm:mb-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                              </svg>
                              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                                {departureAirport} {departureTime}
                              </span>
                            </div>
                          </div>

                          <div className="flex-1 text-center">
                            <div className="relative px-2 sm:px-4">
                              <div className="h-0.5 sm:h-1 bg-green-500 rounded-full"></div>
                              <div className="absolute -top-2 sm:-top-3 left-1/2 transform -translate-x-1/2">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                </svg>
                              </div>
                            </div>
                            <div className="text-xs sm:text-sm text-gray-600 mt-2">{formatDuration(duration)}</div>
                          </div>

                          <div className="text-center">
                            <div className="flex flex-col sm:flex-row items-center sm:space-x-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 mb-1 sm:mb-0" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                              </svg>
                              <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900">
                                {arrivalAirport} {arrivalTime}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Price and Select */}
                        <div className="text-right md:w-1/6 w-full mt-4 md:mt-0">
                          <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            {price.toFixed(2)} <span className="text-sm sm:text-base md:text-lg">USD</span>
                          </div>
                          <button 
                            onClick={() => handleSelectFlight(flight)}
                            disabled={isLoading || isSelected}
                            className={`w-full px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-bold transition-colors text-sm sm:text-base ${
                              isSelected 
                                ? 'bg-green-600 text-white cursor-default' 
                                : 'bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                            }`}
                          >
                            {isSelected ? '✓ Selected' : 'Select'}
                          </button>
                        </div>
                      </div>

                      {/* Flight Details Tags */}
                      <div className="flex flex-wrap items-center gap-2 mt-4">
                      {cabin.toLowerCase().includes('promotion') || price < 500 ? (
                        <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                          </svg>
                          Promotion (M)
                        </span>
                      ) : cabin.toLowerCase().includes('business') ? (
                        <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Business (D,D)
                        </span>
                      ) : (
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {cabin} (H,H)
                        </span>
                      )}
                      
                      <span className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                        </svg>
                        {stops}
                      </span>

                      <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17 6h-2V3c0-.55-.45-1-1-1h-4c-.55 0-1 .45-1 1v3H7c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2 0 .55.45 1 1 1s1-.45 1-1h6c0 .55.45 1 1 1s1-.45 1-1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9.5 18H8V9h1.5v9zm3.25 0h-1.5V9h1.5v9zm.75-12h-3V3.5h3V6zM16 18h-1.5V9H16v9z"/>
                        </svg>
                        1 PC
                      </span>

                      {price < 500 && (
                        <>
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                            + Offer
                          </span>
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                            </svg>
                            Special Offer
                          </span>
                        </>
                      )}
                    </div>

                    {/* Availability */}
                    {availability && (
                      <div className="mt-3 text-sm text-orange-600 font-medium">
                        {availability}
                      </div>
                    )}
                  </div>
                </div>

                {/* Return Flights Display (inline below selected outbound flight) */}
                {isSelected && showReturnFlights && searchCriteria.tripType === 'Roundtrip' && (
                  <div className="ml-8 mt-4 mb-4">
                    {/* Return Flight Header */}
                    <div className="bg-blue-600 text-white py-3 px-6 rounded-lg mb-4">
                      <h3 className="text-lg font-bold">Select Your Return Flight</h3>
                      <p className="text-sm">{searchCriteria.to.split(' - ')[0]} to {searchCriteria.from.split(' - ')[0]} on {searchCriteria.returnDate}</p>
                    </div>

                    {/* Previous/Next Day Navigation for Return Flights */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4">
                      <button 
                        onClick={handleReturnPreviousDay}
                        disabled={isLoading}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                      >
                        « Previous Day
                      </button>
                      <div className="bg-blue-500 text-white py-2 sm:py-3 rounded-lg font-bold text-center text-xs sm:text-sm md:text-base">
                        {searchCriteria.returnDate}
                      </div>
                      <button 
                        onClick={handleReturnNextDay}
                        disabled={isLoading}
                        className="bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                      >
                        Next Day »
                      </button>
                    </div>

                    {/* Loading Return Flights */}
                    {isLoading && returnFlights.length === 0 && (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="mt-3 text-gray-600">Searching return flights...</p>
                      </div>
                    )}

                    {/* No Return Flights */}
                    {!isLoading && returnFlights.length === 0 && (
                      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                        <svg className="w-12 h-12 text-gray-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">No Return Flights Found</h4>
                        <p className="text-gray-600 text-sm">Try selecting a different outbound flight or date</p>
                      </div>
                    )}

                    {/* Return Flight Cards */}
                    {returnFlights.map((returnFlight, returnIndex) => {
                      const airline = returnFlight.airline || 'Unknown';
                      console.log(`🎨 Rendering return flight #${returnIndex}: ${airline} (${returnFlight.logo}) - $${returnFlight.price}`);
                      const flightNumber = returnFlight.flightNumber || '';
                      const price = returnFlight.price || 0;
                      const departureTime = returnFlight.departure?.time || '';
                      const departureAirport = returnFlight.departure?.airport || '';
                      const arrivalTime = returnFlight.arrival?.time || '';
                      const arrivalAirport = returnFlight.arrival?.airport || '';
                      const duration = returnFlight.duration || '';
                      const stops = returnFlight.stops || 'Direct';
                      const cabin = returnFlight.class || 'Economy';
                      const outboundPrice = selectedOutboundFlight?.price || 0;
                      const totalPrice = outboundPrice + price;
                      const isReturnSelected = selectedReturnFlight?.id === returnFlight.id;
                      const isSameAirline = airline === selectedOutboundFlight?.airline || returnFlight.logo === selectedOutboundFlight?.logo;

                      // Hide non-selected return flights when one is selected
                      if (selectedReturnFlight && !isReturnSelected) {
                        return null;
                      }

                      return (
                        <div
                          key={`return-${returnIndex}`}
                          className={`bg-white rounded-lg shadow-md mb-3 overflow-hidden border-l-4 ${
                            isReturnSelected ? 'border-4 border-green-500' : 'border-blue-500'
                          }`}
                        >
                          <div className="p-3 sm:p-4 md:p-5">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                              {/* Airline Info */}
                              <div className="flex items-center space-x-3 md:w-1/6">
                                <div className="flex items-center space-x-2 sm:space-x-3">
                                  {/* Airline Logo */}
                                  <img 
                                    src={returnFlight.logo} 
                                    alt={airline}
                                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain bg-gray-100 rounded p-1 flex-shrink-0"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                  <div className="text-left">
                                    <div className="text-blue-600 text-lg sm:text-xl font-bold">{airline}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">{flightNumber}</div>
                                    <div className="flex flex-col gap-1 mt-1">
                                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full inline-block">
                                        Return
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Flight Times */}
                              <div className="flex items-center justify-between md:space-x-4 lg:space-x-6 flex-1">
                                <div className="text-center">
                                  <div className="flex flex-col sm:flex-row items-center sm:space-x-1">
                                    <svg className="w-4 h-4 text-blue-500 mb-1 sm:mb-0" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                                    </svg>
                                    <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                                      {departureAirport} {departureTime}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex-1 text-center">
                                  <div className="relative px-2 sm:px-4">
                                    <div className="h-0.5 bg-blue-400 rounded-full"></div>
                                  </div>
                                  <div className="text-xs text-gray-600 mt-1">{formatDuration(duration)} | {stops}</div>
                                </div>

                                <div className="text-center">
                                  <div className="flex flex-col sm:flex-row items-center sm:space-x-1">
                                    <svg className="w-4 h-4 text-blue-500 mb-1 sm:mb-0" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                                    </svg>
                                    <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900">
                                      {arrivalAirport} {arrivalTime}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Price and Select */}
                              <div className="text-right md:w-1/6 w-full mt-4 md:mt-0">
                                <div className="text-xl sm:text-2xl font-bold text-blue-700 mb-2">
                                  ${price.toFixed(2)}
                                </div>
                                <div className="text-xs text-gray-500 mb-2">Return Flight</div>
                                <button 
                                  onClick={() => handleSelectFlight(returnFlight)}
                                  disabled={isLoading || isReturnSelected}
                                  className={`w-full px-4 sm:px-6 py-2 rounded-lg font-bold text-sm transition-colors ${
                                    isReturnSelected 
                                      ? 'bg-green-600 text-white cursor-default' 
                                      : 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-50'
                                  }`}
                                >
                                  {isReturnSelected ? '✓ Selected' : 'Select Return'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Total Amount and BUY Button - shown when both flights are selected */}
                    {selectedOutboundFlight && selectedReturnFlight && (
                      <div className="mt-6 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-500 rounded-lg p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Your Complete Trip</h3>
                            <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                              <div className="flex items-start sm:items-center">
                                <svg className="w-4 h-4 text-green-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="break-words"><strong>Outbound:</strong> {selectedOutboundFlight.departure.airport} → {selectedOutboundFlight.arrival.airport} - ${selectedOutboundFlight.price.toFixed(2)}</span>
                              </div>
                              <div className="flex items-start sm:items-center">
                                <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 sm:mt-0 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="break-words"><strong>Return:</strong> {selectedReturnFlight.departure.airport} → {selectedReturnFlight.arrival.airport} - ${selectedReturnFlight.price.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-center lg:text-right lg:ml-6 border-t lg:border-t-0 lg:border-l-2 border-green-300 pt-4 lg:pt-0 lg:pl-6">
                            <div className="text-xs sm:text-sm text-gray-600 mb-1">Total Amount</div>
                            <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-600 mb-3 sm:mb-4">
                              ${(selectedOutboundFlight.price + selectedReturnFlight.price).toFixed(2)}
                            </div>
                            <button 
                              onClick={handleBuyNow}
                              className="w-full lg:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                              BUY NOW
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
            })}

            {/* Return Flights Header (after departure flights end) */}
            {searchCriteria.tripType === 'Roundtrip' && searchCriteria.returnDate && sortedFlights.length > 0 && !selectedOutboundFlight && returnFlights.length > 0 && (
              <div className="mt-6 sm:mt-8 mb-4">
                <div className="bg-blue-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-lg">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Return Flights</h2>
                  <p className="text-xs sm:text-sm mt-1">
                    {searchCriteria.to.split(' - ')[0]} to {searchCriteria.from.split(' - ')[0]} on {searchCriteria.returnDate}
                  </p>
                </div>
              </div>
            )}

            {/* Return Flights Section (when no outbound flight is selected) */}
            {searchCriteria.tripType === 'Roundtrip' && searchCriteria.returnDate && sortedFlights.length > 0 && !selectedOutboundFlight && returnFlights.length > 0 && (
              <>
                {/* Previous/Next Day Navigation for Return Flights */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 mb-4">
                  <button 
                    onClick={handleReturnPreviousDay}
                    disabled={isLoading}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                  >
                    « Previous Day
                  </button>
                  <div className="bg-blue-500 text-white py-2 sm:py-3 rounded-lg font-bold text-center text-xs sm:text-sm md:text-base">
                    {searchCriteria.returnDate}
                  </div>
                  <button 
                    onClick={handleReturnNextDay}
                    disabled={isLoading}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 sm:py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm md:text-base"
                  >
                    Next Day »
                  </button>
                </div>

                {/* Return Flight Cards */}
                {returnFlights.map((flight, index) => {
                  const airline = flight.airline || 'Unknown';
                  const flightNumber = flight.flightNumber || '';
                  const price = flight.price || 0;
                  const departureTime = flight.departure?.time || '';
                  const departureAirport = flight.departure?.airport || '';
                  const arrivalTime = flight.arrival?.time || '';
                  const arrivalAirport = flight.arrival?.airport || '';
                  const duration = flight.duration || '';
                  const stops = flight.stops || 'Direct';
                  const cabin = flight.class || 'Economy';

                  return (
                    <div
                      key={`initial-return-${index}`}
                      className="bg-white rounded-lg shadow-md mb-4 overflow-hidden border-l-4 border-blue-500"
                    >
                      <div className="p-5">
                        <div className="flex items-center justify-between">
                          {/* Airline Info */}
                          <div className="flex items-center space-x-3 w-1/6">
                            <div className="flex items-center space-x-2">
                              {/* Airline Logo */}
                              <img 
                                src={flight.logo} 
                                alt={airline}
                                className="w-10 h-10 object-contain"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                              <div className="text-left">
                                <div className="text-blue-600 text-lg font-bold">{airline}</div>
                                <div className="text-xs text-gray-600">{flightNumber}</div>
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full mt-1 inline-block">
                                  Return
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Flight Times */}
                          <div className="flex items-center space-x-6 flex-1">
                            <div className="text-center">
                              <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                                </svg>
                                <span className="text-xl font-bold text-gray-900">
                                  {departureAirport} {departureTime}
                                </span>
                              </div>
                            </div>

                            <div className="flex-1 text-center">
                              <div className="relative">
                                <div className="h-0.5 bg-blue-400 rounded-full"></div>
                              </div>
                              <div className="text-xs text-gray-600 mt-1">{formatDuration(duration)} | {stops}</div>
                            </div>

                            <div className="text-center">
                              <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                                </svg>
                                <span className="text-xl font-bold text-gray-900">
                                  {arrivalAirport} {arrivalTime}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right w-1/6">
                            <div className="text-2xl font-bold text-blue-700 mb-2">
                              ${price.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500">Per Person</div>
                          </div>
                        </div>

                        {/* Flight Details Tags */}
                        <div className="flex items-center space-x-2 mt-3">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Return Flight
                          </span>
                          <span className="bg-gray-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {stops}
                          </span>
                          <span className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                            {cabin}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-center">
                  <p className="text-blue-800 text-sm">
                    💡 Select a departure flight above to see combined pricing and complete your booking
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-full sm:max-w-6xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center z-10">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">Select Flight Class</h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {isLoadingClasses ? (
              <div className="flex items-center justify-center py-12 sm:py-20">
                <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
                {/* Outbound Flight Classes */}
                <div>
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-3 rounded-t-lg flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold">{selectedOutboundFlight?.airline}</h3>
                      <p className="text-xs sm:text-sm opacity-90 break-words">
                        {selectedOutboundFlight?.departure?.airport} {selectedOutboundFlight?.departure?.time} → {selectedOutboundFlight?.arrival?.airport} {selectedOutboundFlight?.arrival?.time}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs opacity-75">Departure</p>
                      <p className="text-sm sm:text-base md:text-lg font-semibold">{selectedOutboundFlight?.departure?.date || searchCriteria.departureDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
                    {bookingFlightClasses.outbound?.map((classOption: any, index: number) => {
                      const isSelected = selectedOutboundClass?.name === classOption.name;
                      return (
                        <div
                          key={`outbound-${index}`}
                          className={`rounded-lg shadow-md overflow-hidden border-2 transition-all ${
                            isSelected ? 'border-green-500 shadow-lg' : 'border-gray-200'
                          }`}
                        >
                          <div className={`p-4 border-l-4 ${
                            index === 0 ? 'border-yellow-400' : index === 1 ? 'border-orange-400' : 'border-pink-400'
                          }`}>
                            <h4 className="text-lg font-bold text-gray-800 mb-3">{classOption.name}</h4>
                            
                            <div className="space-y-2 mb-4">
                              {classOption.features.map((feature: any, fIndex: number) => (
                                <div key={fIndex} className="flex items-start space-x-2 text-sm">
                                  {feature.available ? (
                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <span className={`flex-shrink-0 mt-0.5 ${feature.cost ? 'text-purple-600' : 'text-gray-400'}`}>
                                      {feature.cost ? '$' : '✕'}
                                    </span>
                                  )}
                                  <span className={feature.available ? 'text-gray-700' : feature.cost ? 'text-purple-600' : 'text-gray-400'}>
                                    {feature.text}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="border-t pt-3 mt-3">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xl sm:text-2xl font-bold text-gray-900">{classOption.price.toFixed(2)}</span>
                                <span className="text-xs sm:text-sm text-gray-500">USD</span>
                              </div>
                              <button
                                onClick={() => setSelectedOutboundClass(classOption)}
                                className={`w-full py-2 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                                  isSelected
                                    ? 'bg-green-600 text-white cursor-default'
                                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                                }`}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Return Flight Classes */}
                <div>
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-3 rounded-t-lg flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                    <div>
                      <h3 className="text-base sm:text-lg md:text-xl font-bold">{selectedReturnFlight?.airline}</h3>
                      <p className="text-xs sm:text-sm opacity-90 break-words">
                        {selectedReturnFlight?.departure?.airport} {selectedReturnFlight?.departure?.time} → {selectedReturnFlight?.arrival?.airport} {selectedReturnFlight?.arrival?.time}
                      </p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs opacity-75">Return</p>
                      <p className="text-sm sm:text-base md:text-lg font-semibold">{selectedReturnFlight?.departure?.date || searchCriteria.returnDate}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-4">
                    {bookingFlightClasses.return?.map((classOption: any, index: number) => {
                      const isSelected = selectedReturnClass?.name === classOption.name;
                      return (
                        <div
                          key={`return-${index}`}
                          className={`rounded-lg shadow-md overflow-hidden border-2 transition-all ${
                            isSelected ? 'border-green-500 shadow-lg' : 'border-gray-200'
                          }`}
                        >
                          <div className={`p-3 sm:p-4 border-l-4 ${
                            index === 0 ? 'border-yellow-400' : index === 1 ? 'border-orange-400' : 'border-pink-400'
                          }`}>
                            <h4 className="text-base sm:text-lg font-bold text-gray-800 mb-3">{classOption.name}</h4>
                            
                            <div className="space-y-2 mb-4">
                              {classOption.features.map((feature: any, fIndex: number) => (
                                <div key={fIndex} className="flex items-start space-x-2 text-xs sm:text-sm">
                                  {feature.available ? (
                                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <span className={`flex-shrink-0 mt-0.5 ${feature.cost ? 'text-purple-600' : 'text-gray-400'}`}>
                                      {feature.cost ? '$' : '✕'}
                                    </span>
                                  )}
                                  <span className={feature.available ? 'text-gray-700' : feature.cost ? 'text-purple-600' : 'text-gray-400'}>
                                    {feature.text}
                                  </span>
                                </div>
                              ))}
                            </div>

                            <div className="border-t pt-3 mt-3">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-xl sm:text-2xl font-bold text-gray-900">{classOption.price.toFixed(2)}</span>
                                <span className="text-xs sm:text-sm text-gray-500">USD</span>
                              </div>
                              <button
                                onClick={() => setSelectedReturnClass(classOption)}
                                className={`w-full py-2 px-4 rounded-lg font-semibold text-sm sm:text-base transition-all ${
                                  isSelected
                                    ? 'bg-green-600 text-white cursor-default'
                                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                                }`}
                              >
                                {isSelected ? 'Selected' : 'Select'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Total and Continue Button */}
                <div className="border-t pt-4 sm:pt-6 sticky bottom-0 bg-white">
                  <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="text-center">
                      <p className="text-xs sm:text-sm text-gray-600 mb-1">Total</p>
                      <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">
                        {((selectedOutboundClass?.price || 0) + (selectedReturnClass?.price || 0)).toFixed(2)}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">USD</p>
                    </div>
                    <button
                      onClick={() => {
                        // Save booking data to localStorage
                        const bookingData = {
                          outbound: selectedOutboundFlight,
                          outboundClass: selectedOutboundClass,
                          return: selectedReturnFlight,
                          returnClass: selectedReturnClass,
                          total: (selectedOutboundClass?.price || 0) + (selectedReturnClass?.price || 0),
                          searchCriteria: searchCriteria
                        };
                        localStorage.setItem('bookingData', JSON.stringify(bookingData));
                        
                        // Navigate to booking page
                        router.push('/booking');
                      }}
                      className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all shadow-lg"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 bg-orange-500 hover:bg-orange-600 text-white p-3 sm:p-4 rounded-full shadow-lg transition-colors z-40"
      >
        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Footer */}
      <footer className="bg-black text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-sm">
            Copyright © 2025. Powered by <span className="text-yellow-400 font-bold">Y</span>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function FlightResult() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <FlightResultContent />
    </Suspense>
  );
}







