'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';

function FlightResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Search criteria from URL params
  const [searchCriteria, setSearchCriteria] = useState({
    from: searchParams.get('from') || '',
    to: searchParams.get('to') || '',
    departureDate: searchParams.get('departureDate') || '',
    returnDate: searchParams.get('returnDate') || '',
    passengers: searchParams.get('passengers') || '1 Adult',
    class: searchParams.get('class') || 'Economy',
    tripType: searchParams.get('tripType') || 'Roundtrip',
    isDirect: searchParams.get('isDirect') === 'true',
  });

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

  useEffect(() => {
    // Load flights from localStorage or state
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
  }, []);

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
      {/* Search Criteria Section */}
      {showCriteria && (
        <div 
          className="relative bg-cover bg-center py-8"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1600')`,
          }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-white">Searching Criterias</h1>
              <button
                onClick={() => setShowCriteria(false)}
                className="text-white hover:text-orange-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="bg-gray-700 bg-opacity-80 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                {/* From */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">From</label>
                  <div className="bg-white rounded-lg px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-900">{searchCriteria.from}</span>
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                  </div>
                </div>

                {/* Swap */}
                <div className="flex items-end justify-center">
                  <div className="bg-orange-500 rounded-lg p-3">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"/>
                    </svg>
                  </div>
                </div>

                {/* To */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">To</label>
                  <div className="bg-white rounded-lg px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-900">{searchCriteria.to}</span>
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                  </div>
                </div>

                {/* Departure Date */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Departure Date</label>
                  <div className="bg-white rounded-lg px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-900">{searchCriteria.departureDate}</span>
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Return Date */}
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Return Date</label>
                  <div className="bg-white rounded-lg px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-gray-900">{searchCriteria.returnDate || 'N/A'}</span>
                    <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Trip Type, Class, Passengers, Markup */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="flex space-x-2">
                  {['Oneway', 'Roundtrip', 'Multipoint +'].map((type) => (
                    <button
                      key={type}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        searchCriteria.tripType === type
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-600 text-white hover:bg-gray-500'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                <div>
                  <select className="w-full px-4 py-3 bg-white rounded-lg text-sm text-gray-900">
                    <option>{searchCriteria.class}</option>
                  </select>
                </div>

                <div>
                  <select className="w-full px-4 py-3 bg-white rounded-lg text-sm text-gray-900">
                    <option>{searchCriteria.passengers}</option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Markup :"
                    className="w-full px-4 py-3 bg-white rounded-lg text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Amount"
                    className="w-full px-4 py-3 bg-white rounded-lg text-sm text-gray-900 placeholder-gray-500"
                  />
                </div>
              </div>

              {/* Direct and Advanced Search */}
              <div className="flex items-center space-x-6 mt-4">
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={searchCriteria.isDirect}
                    className="w-5 h-5 rounded border-gray-300"
                    readOnly
                  />
                  <span className="text-sm font-medium">Direct</span>
                </label>
                <label className="flex items-center space-x-2 text-white cursor-pointer">
                  <input type="checkbox" className="w-5 h-5 rounded border-gray-300" />
                  <span className="text-sm font-medium">Advanced Search</span>
                </label>
              </div>
            </div>

            {/* Search Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <span>Search Flight</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 text-white rounded-t-lg p-4">
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

            {/* Day Navigation */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                « Previous Day
              </button>
              <div className="bg-orange-500 text-white py-3 rounded-lg font-bold text-center">
                {searchCriteria.from.split(' - ')[1]} - {searchCriteria.to.split(' - ')[1]} / {searchCriteria.departureDate}
              </div>
              <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                Next Day »
              </button>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading flights...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {/* Flight Cards */}
            {!isLoading && sortedFlights.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Flights Found</h3>
                <p className="text-gray-600">Try adjusting your search criteria or filters</p>
              </div>
            )}

            {sortedFlights.map((flight, index) => {
              // Use transformed data structure
              const airline = flight.airline || 'Unknown';
              const airlineCode = flight.logo || '';
              const flightNumber = flight.flightNumber || '';
              const price = flight.price || 0;
              const departureTime = flight.departure?.time || '';
              const departureAirport = flight.departure?.airport || '';
              const arrivalTime = flight.arrival?.time || '';
              const arrivalAirport = flight.arrival?.airport || '';
              const duration = flight.duration || '';
              const stops = flight.stops || 'Direct';
              const cabin = flight.class || 'Economy';
              const availability = flight.availability || '';
              
              return (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-sm mb-4 overflow-hidden border-l-4 ${
                    cabin.toLowerCase().includes('business') ? 'border-purple-500' :
                    cabin.toLowerCase().includes('promotion') || price < 500 ? 'border-red-400 bg-green-50' :
                    'border-blue-400'
                  }`}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Airline Info */}
                      <div className="flex items-center space-x-4 w-1/5">
                        <div className="text-center">
                          <div className="text-red-600 text-2xl font-bold">{airline}</div>
                          <div className="text-sm text-gray-600 mt-1">{flightNumber}</div>
                        </div>
                      </div>

                      {/* Flight Times */}
                      <div className="flex items-center space-x-8 flex-1">
                        <div className="text-center">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                            </svg>
                            <span className="text-2xl font-bold text-gray-900">
                              {departureAirport} {departureTime}
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 text-center">
                          <div className="relative">
                            <div className="h-1 bg-green-500 rounded-full"></div>
                            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600 mt-2">{formatDuration(duration)}</div>
                        </div>

                        <div className="text-center">
                          <div className="flex items-center space-x-2">
                            <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                            </svg>
                            <span className="text-2xl font-bold text-gray-900">
                              {arrivalAirport} {arrivalTime}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Price and Select */}
                      <div className="text-right w-1/6">
                        <div className="text-3xl font-bold text-gray-900 mb-2">
                          {price.toFixed(2)} <span className="text-lg">USD</span>
                        </div>
                        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition-colors">
                          Select
                        </button>
                      </div>
                    </div>

                    {/* Flight Details Tags */}
                    <div className="flex items-center space-x-3 mt-4">
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
              );
            })}

            {/* Return Flight Section (if roundtrip) */}
            {searchCriteria.tripType === 'Roundtrip' && searchCriteria.returnDate && sortedFlights.length > 0 && (
              <>
                <div className="grid grid-cols-3 gap-4 my-4">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                    « Previous Day
                  </button>
                  <div className="bg-orange-500 text-white py-3 rounded-lg font-bold text-center">
                    {searchCriteria.to.split(' - ')[0]} - {searchCriteria.from.split(' - ')[0]} / {searchCriteria.returnDate}
                  </div>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                    Next Day »
                  </button>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-center">
                  <p className="text-blue-800 text-sm">
                    Return flights are included in the prices shown above. Select any flight to see complete itinerary details.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
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
