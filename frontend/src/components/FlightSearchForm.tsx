'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface FlightSearchFormProps {
  initialData?: {
    from?: string;
    to?: string;
    departureDate?: string;
    returnDate?: string;
    adults?: number;
    children?: number;
    infants?: number;
    flightClass?: string;
    tripType?: string;
    markup?: string;
    isDirect?: boolean;
  };
  onSearchComplete?: () => void;
}

const POPULAR_CITIES = [
  { code: 'EBL', name: 'Erbil International Airport', city: 'Erbil', country: 'Iraq', displayText: 'EBL - Erbil International Airport' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey', displayText: 'IST - Istanbul Airport' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE', displayText: 'DXB - Dubai International Airport' },
  { code: 'BGW', name: 'Baghdad International Airport', city: 'Baghdad', country: 'Iraq', displayText: 'BGW - Baghdad International Airport' },
  { code: 'BSR', name: 'Basra International Airport', city: 'Basra', country: 'Iraq', displayText: 'BSR - Basra International Airport' },
  { code: 'SAW', name: 'Sabiha Gokcen Airport', city: 'Istanbul', country: 'Turkey', displayText: 'SAW - Sabiha Gokcen Airport' },
  { code: 'AUH', name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'UAE', displayText: 'AUH - Abu Dhabi International Airport' },
  { code: 'CAI', name: 'Cairo International Airport', city: 'Cairo', country: 'Egypt', displayText: 'CAI - Cairo International Airport' }
];

export default function FlightSearchForm({ initialData, onSearchComplete }: FlightSearchFormProps) {
  const router = useRouter();
  
  // Flight Search State
  const [tripType, setTripType] = useState(initialData?.tripType || "Roundtrip");
  const [fromLocation, setFromLocation] = useState(initialData?.from || '');
  const [toLocation, setToLocation] = useState(initialData?.to || '');
  const [departureDate, setDepartureDate] = useState(initialData?.departureDate || '');
  const [returnDate, setReturnDate] = useState(initialData?.returnDate || '');
  const [flightClass, setFlightClass] = useState(initialData?.flightClass || 'Economy');
  const [adults, setAdults] = useState(initialData?.adults || 1);
  const [children, setChildren] = useState(initialData?.children || 0);
  const [infants, setInfants] = useState(initialData?.infants || 0);
  const [markup, setMarkup] = useState(initialData?.markup || '0');
  const [markupType, setMarkupType] = useState('fixed');
  const [isDirect, setIsDirect] = useState(initialData?.isDirect || false);
  
  // Location Autocomplete State
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [fromSuggestions, setFromSuggestions] = useState<any[]>([]);
  const [toSuggestions, setToSuggestions] = useState<any[]>([]);
  const [isLoadingFrom, setIsLoadingFrom] = useState(false);
  const [isLoadingTo, setIsLoadingTo] = useState(false);
  
  // Passenger Dropdown
  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  
  // Search State
  const [isSearching, setIsSearching] = useState(false);

  const swapLocations = () => {
    const temp = fromLocation;
    setFromLocation(toLocation);
    setToLocation(temp);
  };

  const getPassengerText = () => {
    const total = adults + children + infants;
    if (total === 1) return '1 Passenger';
    return `${total} Passengers`;
  };

  // Validation
  const validateSearch = () => {
    if (!fromLocation || !toLocation) {
      alert('Please select both departure and arrival locations');
      return false;
    }
    if (fromLocation === toLocation) {
      alert('Departure and arrival locations must be different');
      return false;
    }
    if (!departureDate) {
      alert('Please select a departure date');
      return false;
    }
    if (tripType === "Roundtrip" && !returnDate) {
      alert('Please select a return date for round trip');
      return false;
    }
    if (infants > adults) {
      alert('Number of infants cannot exceed number of adults');
      return false;
    }
    return true;
  };

  const searchFlights = async () => {
    if (!validateSearch()) return;
    
    setIsSearching(true);

    try {
      // Extract airport codes from location strings
      const fromCode = fromLocation.split(' - ')[0].trim();
      const toCode = toLocation.split(' - ')[0].trim();

      const searchParams = new URLSearchParams({
        from: fromCode,
        to: toCode,
        departureDate,
        adults: adults.toString(),
        children: children.toString(),
        infants: infants.toString(),
        flightClass,
        tripType,
        markup,
        isDirect: isDirect.toString()
      });

      if (returnDate && tripType === "Roundtrip") {
        searchParams.set('returnDate', returnDate);
      }

      const response = await fetch('/api/flights/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originLocationCode: fromCode,
          destinationLocationCode: toCode,
          departureDate,
          returnDate: tripType === "Roundtrip" ? returnDate : undefined,
          adults,
          children,
          infants,
          travelClass: flightClass.toUpperCase(),
          nonStop: isDirect,
          currencyCode: 'USD',
          max: 50
        }),
      });

      const data = await response.json();

      if (data.success && data.data) {
        // Store search results
        localStorage.setItem('flightSearchResults', JSON.stringify(data.data));
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
          isDirect
        }));

        // Navigate to results page or reload
        if (onSearchComplete) {
          onSearchComplete();
        } else {
          router.push(`/flightResult?${searchParams.toString()}`);
        }
      } else {
        alert(data.message || 'No flights found');
      }
    } catch (error) {
      console.error('Flight search error:', error);
      alert('Failed to search flights. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Location autocomplete with debouncing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (fromLocation && fromLocation.length >= 2 && !fromLocation.includes(' - ')) {
        setIsLoadingFrom(true);
        try {
          const response = await fetch(`/api/locations/search?keyword=${encodeURIComponent(fromLocation)}`);
          const data = await response.json();
          
          if (data.success && data.data) {
            setFromSuggestions(data.data.slice(0, 8));
            setShowFromDropdown(true);
          }
        } catch (error) {
          console.error('Location search error:', error);
        } finally {
          setIsLoadingFrom(false);
        }
      } else {
        setFromSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [fromLocation]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (toLocation && toLocation.length >= 2 && !toLocation.includes(' - ')) {
        setIsLoadingTo(true);
        try {
          const response = await fetch(`/api/locations/search?keyword=${encodeURIComponent(toLocation)}`);
          const data = await response.json();
          
          if (data.success && data.data) {
            setToSuggestions(data.data.slice(0, 8));
            setShowToDropdown(true);
          }
        } catch (error) {
          console.error('Location search error:', error);
        } finally {
          setIsLoadingTo(false);
        }
      } else {
        setToSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [toLocation]);

  return (
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

      {/* Direct Flights Only Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="directFlights"
          checked={isDirect}
          onChange={(e) => setIsDirect(e.target.checked)}
          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="directFlights" className="ml-2 text-sm font-medium text-gray-700">
          Direct flights only
        </label>
      </div>
    </div>
  );
}
