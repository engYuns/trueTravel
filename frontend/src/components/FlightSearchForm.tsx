'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { buildFlightResultSearchParams, performFlightSearch, type FlightSearchCriteria, type MultiPointSegment } from '@/lib/flightSearch';
import { AIRPORT_SUGGESTIONS, filterAirportSuggestions } from '@/lib/airportSuggestions';

interface FlightSearchFormProps {
  initialData?: {
    from?: string;
    to?: string;
    departureDate?: string;
    returnDate?: string;
    segments?: MultiPointSegment[];
    adults?: number;
    children?: number;
    infants?: number;
    flightClass?: string;
    tripType?: string;
    markup?: string;
    markupType?: 'fixed' | 'percentage';
    isDirect?: boolean;
    corporateCode?: string;
    preferredAirlines?: string[];
  };
  onSearchComplete?: (ctx: { criteria: FlightSearchCriteria; searchParams: URLSearchParams }) => void | Promise<void>;
}

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
  const [markupType, setMarkupType] = useState<'fixed' | 'percentage'>(initialData?.markupType || 'fixed');
  const [isDirect, setIsDirect] = useState(initialData?.isDirect || false);

  const [isAdvancedSearch, setIsAdvancedSearch] = useState(false);
  const [corporateCode, setCorporateCode] = useState(initialData?.corporateCode || '');
  const [preferredAirlineInput, setPreferredAirlineInput] = useState('');
  const [preferredAirlines, setPreferredAirlines] = useState<string[]>(Array.isArray(initialData?.preferredAirlines) ? initialData!.preferredAirlines! : []);

  const addPreferredAirlinesFromInput = () => {
    const raw = String(preferredAirlineInput || '').trim();
    if (!raw) return;

    const tokens = raw
      .split(/[,\s]+/)
      .map((t) => String(t || '').trim().toUpperCase())
      .filter(Boolean)
      .filter((t) => /^[A-Z0-9]{2,3}$/.test(t));

    if (tokens.length === 0) return;

    setPreferredAirlines((prev) => {
      const next = new Set((prev || []).map((c) => String(c || '').trim().toUpperCase()).filter(Boolean));
      for (const code of tokens) next.add(code);
      return Array.from(next);
    });

    setPreferredAirlineInput('');
  };

  const removePreferredAirline = (code: string) => {
    const needle = String(code || '').trim().toUpperCase();
    setPreferredAirlines((prev) => (prev || []).filter((c) => String(c || '').trim().toUpperCase() !== needle));
  };

  const makeDefaultSegments = (): MultiPointSegment[] => {
    const seed = Array.isArray(initialData?.segments) ? initialData!.segments! : [];
    if (seed.length >= 2) return seed;
    return [
      { from: initialData?.from || '', to: initialData?.to || '', departureDate: initialData?.departureDate || '' },
      { from: initialData?.to || '', to: '', departureDate: initialData?.returnDate || '' },
    ];
  };

  const [segments, setSegments] = useState<MultiPointSegment[]>(makeDefaultSegments());
  const [activeSegmentField, setActiveSegmentField] = useState<{ index: number; field: 'from' | 'to' } | null>(null);
  const [segmentSuggestions, setSegmentSuggestions] = useState<any[]>([]);
  const [showSegmentDropdown, setShowSegmentDropdown] = useState(false);
  const [isLoadingSegment, setIsLoadingSegment] = useState(false);

  // Keep the form in sync when parent updates initialData (e.g., after loading stored criteria or after a new search).
  // This avoids the form snapping back to the very first render defaults.
  useEffect(() => {
    if (!initialData) return;
    if (typeof initialData.tripType === 'string') setTripType(initialData.tripType || 'Roundtrip');
    if (typeof initialData.from === 'string') setFromLocation(initialData.from);
    if (typeof initialData.to === 'string') setToLocation(initialData.to);
    if (typeof initialData.departureDate === 'string') setDepartureDate(initialData.departureDate);
    if (typeof initialData.returnDate === 'string') setReturnDate(initialData.returnDate);
    if (Array.isArray(initialData.segments)) setSegments(initialData.segments);
    if (typeof initialData.flightClass === 'string') setFlightClass(initialData.flightClass || 'Economy');
    if (typeof initialData.adults === 'number') setAdults(initialData.adults);
    if (typeof initialData.children === 'number') setChildren(initialData.children);
    if (typeof initialData.infants === 'number') setInfants(initialData.infants);
    if (typeof initialData.markup === 'string') setMarkup(initialData.markup || '0');
    if (initialData.markupType === 'fixed' || initialData.markupType === 'percentage') setMarkupType(initialData.markupType);
    if (typeof initialData.isDirect === 'boolean') setIsDirect(initialData.isDirect);
    if (typeof initialData.corporateCode === 'string') setCorporateCode(initialData.corporateCode);
    if (Array.isArray(initialData.preferredAirlines)) setPreferredAirlines(initialData.preferredAirlines);
  }, [
    initialData?.tripType,
    initialData?.from,
    initialData?.to,
    initialData?.departureDate,
    initialData?.returnDate,
    initialData?.segments,
    initialData?.flightClass,
    initialData?.adults,
    initialData?.children,
    initialData?.infants,
    initialData?.markup,
    initialData?.markupType,
    initialData?.isDirect,
    initialData?.corporateCode,
    initialData?.preferredAirlines,
  ]);
  
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
    if (tripType === 'Multipoint') {
      if (!Array.isArray(segments) || segments.length < 2) {
        alert('Please add at least 2 flight legs');
        return false;
      }

      for (const seg of segments) {
        if (!seg?.from || !seg?.to || !seg?.departureDate) {
          alert('Please complete all fields for each flight leg');
          return false;
        }
        if (seg.from === seg.to) {
          alert('Departure and arrival locations must be different');
          return false;
        }
      }

      if (infants > adults) {
        alert('Number of infants cannot exceed number of adults');
        return false;
      }

      return true;
    }

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
      const isMultipoint = tripType === 'Multipoint';
      const segs = isMultipoint ? segments : undefined;
      const firstSeg = isMultipoint && Array.isArray(segs) && segs.length > 0 ? segs[0] : null;

      const criteria: FlightSearchCriteria = {
        from: firstSeg?.from ?? fromLocation,
        to: firstSeg?.to ?? toLocation,
        departureDate: firstSeg?.departureDate ?? departureDate,
        returnDate,
        segments: segs,
        adults,
        children,
        infants,
        flightClass,
        tripType,
        markup,
        markupType,
        isDirect,
        corporateCode: corporateCode.trim() ? corporateCode.trim() : undefined,
        preferredAirlines: preferredAirlines.length > 0 ? preferredAirlines : undefined,
      };

      const { searchParams } = await performFlightSearch(criteria);
      // Ensure params match criteria (helper trims to airport codes).
      const normalizedParams = searchParams || buildFlightResultSearchParams(criteria);

      if (onSearchComplete) {
        await onSearchComplete({ criteria, searchParams: normalizedParams });
      } else {
        router.push(`/flightResult?${normalizedParams.toString()}`);
      }
    } catch (error) {
      console.error('Flight search error:', error);
      alert(error instanceof Error ? error.message : 'Failed to search flights. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Location autocomplete with debouncing
  useEffect(() => {
    if (tripType === 'Multipoint') return;
    const timer = setTimeout(async () => {
      if (fromLocation && fromLocation.length >= 2 && !fromLocation.includes(' - ')) {
        setIsLoadingFrom(true);
        try {
          const response = await fetch(`/api/locations/search?keyword=${encodeURIComponent(fromLocation)}`);
          const data = await response.json();
          
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setFromSuggestions(data.data.slice(0, 8));
            setShowFromDropdown(true);
          } else {
            setFromSuggestions(filterAirportSuggestions(fromLocation, 8));
            setShowFromDropdown(true);
          }
        } catch (error) {
          console.error('Location search error:', error);
          setFromSuggestions(filterAirportSuggestions(fromLocation, 8));
          setShowFromDropdown(true);
        } finally {
          setIsLoadingFrom(false);
        }
      } else {
        setFromSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [fromLocation, tripType]);

  useEffect(() => {
    if (tripType === 'Multipoint') return;
    const timer = setTimeout(async () => {
      if (toLocation && toLocation.length >= 2 && !toLocation.includes(' - ')) {
        setIsLoadingTo(true);
        try {
          const response = await fetch(`/api/locations/search?keyword=${encodeURIComponent(toLocation)}`);
          const data = await response.json();
          
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setToSuggestions(data.data.slice(0, 8));
            setShowToDropdown(true);
          } else {
            setToSuggestions(filterAirportSuggestions(toLocation, 8));
            setShowToDropdown(true);
          }
        } catch (error) {
          console.error('Location search error:', error);
          setToSuggestions(filterAirportSuggestions(toLocation, 8));
          setShowToDropdown(true);
        } finally {
          setIsLoadingTo(false);
        }
      } else {
        setToSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [toLocation, tripType]);

  useEffect(() => {
    if (tripType !== 'Multipoint') return;
    if (!activeSegmentField) return;

    const value = String(segments[activeSegmentField.index]?.[activeSegmentField.field] || '');
    const keyword = value;

    const timer = setTimeout(async () => {
      if (!activeSegmentField) return;

      if (!keyword) {
        setSegmentSuggestions(filterAirportSuggestions('', 8));
        setShowSegmentDropdown(true);
        return;
      }

      if (keyword.length >= 2 && !keyword.includes(' - ')) {
        setIsLoadingSegment(true);
        try {
          const response = await fetch(`/api/locations/search?keyword=${encodeURIComponent(keyword)}`);
          const data = await response.json();

          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setSegmentSuggestions(data.data.slice(0, 8));
            setShowSegmentDropdown(true);
          } else {
            setSegmentSuggestions(filterAirportSuggestions(keyword, 8));
            setShowSegmentDropdown(true);
          }
        } catch (error) {
          console.error('Location search error:', error);
          setSegmentSuggestions(filterAirportSuggestions(keyword, 8));
          setShowSegmentDropdown(true);
        } finally {
          setIsLoadingSegment(false);
        }
      } else {
        setSegmentSuggestions(filterAirportSuggestions(keyword, 8));
        setShowSegmentDropdown(true);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [tripType, segments, activeSegmentField]);

  const updateSegment = (index: number, patch: Partial<MultiPointSegment>) => {
    setSegments((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], ...patch };
      return next;
    });
  };

  const addSegment = () => {
    setSegments((prev) => {
      const last = prev[prev.length - 1];
      return [...prev, { from: last?.to || '', to: '', departureDate: '' }];
    });
  };

  const removeSegment = (index: number) => {
    setSegments((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length >= 2 ? next : prev;
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 lg:p-8">
      {/* Trip Type Selector */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["Oneway", "Roundtrip", "Multipoint"].map((type) => (
          <button
            key={type}
            onClick={() => setTripType(type)}
            type="button"
            className={`h-12 px-6 rounded-xl font-medium transition-colors text-sm lg:text-base ${
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
      {tripType === 'Multipoint' ? (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm font-medium text-gray-900">Trip legs</div>
              <div className="text-xs text-gray-500">Add 2+ legs and search each leg.</div>
            </div>
            <button
              type="button"
              onClick={addSegment}
              className="h-10 px-4 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors text-sm font-medium"
            >
              + Add leg
            </button>
          </div>

          <div className="space-y-3">
            {segments.map((seg, index) => {
              const fromActive =
                showSegmentDropdown &&
                activeSegmentField?.index === index &&
                activeSegmentField?.field === 'from';
              const toActive =
                showSegmentDropdown &&
                activeSegmentField?.index === index &&
                activeSegmentField?.field === 'to';

              return (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* From */}
                  <div className="relative md:col-span-5 lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={seg.from}
                        onChange={(e) => updateSegment(index, { from: e.target.value })}
                        onFocus={() => {
                          setActiveSegmentField({ index, field: 'from' });
                          setSegmentSuggestions(filterAirportSuggestions(seg.from || '', 8));
                          setShowSegmentDropdown(true);
                        }}
                        onBlur={() => setTimeout(() => setShowSegmentDropdown(false), 200)}
                        placeholder="Type city or airport (e.g., Erbil, IST)"
                        className="w-full h-12 px-4 pr-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                      />
                      <button
                        type="button"
                        aria-label="Show all airports"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#155dfc]"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setActiveSegmentField({ index, field: 'from' });
                          setSegmentSuggestions(AIRPORT_SUGGESTIONS);
                          setShowSegmentDropdown(true);
                        }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                      </button>
                      {isLoadingSegment && fromActive && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        </div>
                      )}

                      {fromActive && segmentSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {segmentSuggestions.map((location, idx) => (
                            <button
                              key={idx}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                updateSegment(index, { from: location.displayText });
                                setShowSegmentDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#155dfc] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">
                                    {location.code} - {location.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {location.city}, {location.country}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* To */}
                  <div className="relative md:col-span-5 lg:col-span-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={seg.to}
                        onChange={(e) => updateSegment(index, { to: e.target.value })}
                        onFocus={() => {
                          setActiveSegmentField({ index, field: 'to' });
                          setSegmentSuggestions(filterAirportSuggestions(seg.to || '', 8));
                          setShowSegmentDropdown(true);
                        }}
                        onBlur={() => setTimeout(() => setShowSegmentDropdown(false), 200)}
                        placeholder="Type city or airport (e.g., Istanbul, DXB)"
                        className="w-full h-12 px-4 pr-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                      />
                      <button
                        type="button"
                        aria-label="Show all airports"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#155dfc]"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          setActiveSegmentField({ index, field: 'to' });
                          setSegmentSuggestions(AIRPORT_SUGGESTIONS);
                          setShowSegmentDropdown(true);
                        }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                      </button>
                      {isLoadingSegment && toActive && (
                        <div className="absolute right-10 top-1/2 -translate-y-1/2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                        </div>
                      )}

                      {toActive && segmentSuggestions.length > 0 && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {segmentSuggestions.map((location, idx) => (
                            <button
                              key={idx}
                              onMouseDown={(e) => {
                                e.preventDefault();
                                updateSegment(index, { to: location.displayText });
                                setShowSegmentDropdown(false);
                              }}
                              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 text-[#155dfc] flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                                </svg>
                                <div className="flex-1">
                                  <div className="text-sm font-medium text-gray-900">
                                    {location.code} - {location.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {location.city}, {location.country}
                                  </div>
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Date */}
                  <div className="md:col-span-6 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
                    <div className="relative">
                      <input
                        type="date"
                        value={seg.departureDate}
                        onChange={(e) => updateSegment(index, { departureDate: e.target.value })}
                        min={new Date().toISOString().split('T')[0]}
                        className="tt-date-input w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900"
                        required
                      />
                      <span
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none"
                        aria-hidden="true"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                        </svg>
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <div className="md:col-span-6 lg:col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={() => removeSegment(index)}
                      disabled={segments.length <= 2}
                      className="w-full h-12 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed"
                      aria-label="Remove leg"
                      title={segments.length <= 2 ? 'At least 2 legs required' : 'Remove leg'}
                    >
                      <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M19 13H5v-2h14v2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          {/* From */}
          <div className="relative md:col-span-5 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
            <div className="relative">
              <input
                type="text"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
                onFocus={() => {
                  if (!fromLocation) {
                    setFromSuggestions(filterAirportSuggestions('', 8));
                    setShowFromDropdown(true);
                  } else if (fromSuggestions.length > 0) {
                    setShowFromDropdown(true);
                  }
                }}
                onBlur={() => setTimeout(() => setShowFromDropdown(false), 200)}
                placeholder="Type city or airport (e.g., Erbil, IST)"
                className="w-full h-12 px-4 pr-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                aria-label="Show all airports"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#155dfc]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setFromSuggestions(AIRPORT_SUGGESTIONS);
                  setShowFromDropdown(true);
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </button>
              {isLoadingFrom && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
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
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {location.code} - {location.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {location.city}, {location.country}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex flex-col md:col-span-2 lg:col-span-1">
            <span className="block text-sm font-medium text-transparent mb-1 select-none">Swap</span>
            <button
              onClick={swapLocations}
              type="button"
              aria-label="Swap locations"
              className="w-12 h-12 mx-auto bg-[#155dfc] text-white rounded-lg hover:bg-[#155dfc]/90 transition-colors flex items-center justify-center"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
              </svg>
            </button>
          </div>

          {/* To */}
          <div className="relative md:col-span-5 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
            <div className="relative">
              <input
                type="text"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
                onFocus={() => {
                  if (!toLocation) {
                    setToSuggestions(filterAirportSuggestions('', 8));
                    setShowToDropdown(true);
                  } else if (toSuggestions.length > 0) {
                    setShowToDropdown(true);
                  }
                }}
                onBlur={() => setTimeout(() => setShowToDropdown(false), 200)}
                placeholder="Type city or airport (e.g., Istanbul, DXB)"
                className="w-full h-12 px-4 pr-14 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
              />
              <button
                type="button"
                aria-label="Show all airports"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#155dfc]"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  setToSuggestions(AIRPORT_SUGGESTIONS);
                  setShowToDropdown(true);
                }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                </svg>
              </button>
              {isLoadingTo && (
                <div className="absolute right-10 top-1/2 -translate-y-1/2">
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
                          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">
                            {location.code} - {location.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {location.city}, {location.country}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Departure Date */}
          <div className="md:col-span-6 lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
            <div className="relative">
              <input
                type="date"
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="tt-date-input w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900"
                required
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" aria-hidden="true">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                </svg>
              </span>
            </div>
          </div>

          {/* Return Date */}
          <div className="md:col-span-6 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Return Date {tripType === 'Oneway' && <span className="text-gray-400">(Optional)</span>}
            </label>
            <div className="relative">
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departureDate || new Date().toISOString().split('T')[0]}
                disabled={tripType === 'Oneway'}
                className="tt-date-input w-full h-12 px-4 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" aria-hidden="true">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Additional Options */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
        <div className="md:col-span-6 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
          <select
            value={flightClass}
            onChange={(e) => setFlightClass(e.target.value)}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900"
          >
            <option>Economy</option>
            <option>Business</option>
          </select>
        </div>

        {/* Passengers Selector */}
        <div className="relative md:col-span-6 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Passengers</label>
          <button
            type="button"
            onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
            className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-left bg-white flex items-center justify-between text-gray-900"
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
                    className="w-8 h-8 rounded-full border-2 border-[#155dfc] text-[#155dfc] hover:bg-[#155dfc]/10 font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{adults}</span>
                  <button
                    type="button"
                    onClick={() => setAdults(Math.min(9, adults + 1))}
                    className="w-8 h-8 rounded-full border-2 border-[#155dfc] text-[#155dfc] hover:bg-[#155dfc]/10 font-bold"
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
                    className="w-8 h-8 rounded-full border-2 border-[#155dfc] text-[#155dfc] hover:bg-[#155dfc]/10 font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{children}</span>
                  <button
                    type="button"
                    onClick={() => setChildren(Math.min(9, children + 1))}
                    className="w-8 h-8 rounded-full border-2 border-[#155dfc] text-[#155dfc] hover:bg-[#155dfc]/10 font-bold"
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
                    className="w-8 h-8 rounded-full border-2 border-[#155dfc] text-[#155dfc] hover:bg-[#155dfc]/10 font-bold"
                  >
                    −
                  </button>
                  <span className="w-8 text-center font-medium">{infants}</span>
                  <button
                    type="button"
                    onClick={() => setInfants(Math.min(adults, infants + 1))}
                    className="w-8 h-8 rounded-full border-2 border-[#155dfc] text-[#155dfc] hover:bg-[#155dfc]/10 font-bold"
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
                className="w-full bg-[#155dfc] text-white py-2 rounded-lg hover:bg-[#155dfc]/90 font-medium text-sm"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Markup */}
        <div className="md:col-span-6 lg:col-span-3">
          <label className="block text-sm font-medium text-gray-700 mb-1">Markup</label>
          <div className="flex space-x-2">
            <input
              type="number"
              value={markup}
              onChange={(e) => setMarkup(e.target.value)}
              placeholder="0"
              min="0"
              step="0.01"
              className="flex-1 h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
            />
            <select
              value={markupType}
              onChange={(e) => setMarkupType(e.target.value)}
              className="h-12 px-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900"
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
          className="h-12 w-full md:col-span-12 lg:col-span-3 bg-[#155dfc] text-white px-6 rounded-lg hover:bg-[#155dfc]/90 transition-colors font-medium flex items-center justify-center space-x-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="directFlights"
            checked={isDirect}
            onChange={(e) => setIsDirect(e.target.checked)}
            className="w-4 h-4 text-[#155dfc] bg-gray-100 border-gray-300 rounded focus:ring-[#155dfc]"
          />
          <label htmlFor="directFlights" className="ml-2 text-sm font-medium text-gray-700">
            Direct flights only
          </label>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="advancedSearch"
            checked={isAdvancedSearch}
            onChange={(e) => setIsAdvancedSearch(e.target.checked)}
            className="w-4 h-4 text-[#155dfc] bg-gray-100 border-gray-300 rounded focus:ring-[#155dfc]"
          />
          <label htmlFor="advancedSearch" className="ml-2 text-sm font-medium text-gray-700">
            Advanced search
          </label>
        </div>
      </div>

      {isAdvancedSearch && (
        <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Corporate code</label>
              <input
                type="text"
                value={corporateCode}
                onChange={(e) => setCorporateCode(e.target.value)}
                placeholder="Optional"
                className="w-full h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
              />
            </div>

            <div className="md:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Preferred airline</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={preferredAirlineInput}
                  onChange={(e) => setPreferredAirlineInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addPreferredAirlinesFromInput();
                    }
                  }}
                  placeholder="e.g. AF, KL, TK"
                  className="flex-1 h-12 px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#155dfc] focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={addPreferredAirlinesFromInput}
                  className="h-12 px-4 rounded-lg bg-[#155dfc] text-white hover:bg-[#155dfc]/90 font-medium text-sm"
                >
                  Add
                </button>
              </div>

              {preferredAirlines.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {preferredAirlines.map((code) => (
                    <button
                      key={code}
                      type="button"
                      onClick={() => removePreferredAirline(code)}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-3 py-1 text-sm text-gray-800 hover:bg-gray-100"
                      title="Remove"
                    >
                      <span className="font-medium">{code}</span>
                      <span className="text-gray-500">×</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
