'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeaderUserMenu from '@/components/HeaderUserMenu';

export default function BookingPage() {
  const router = useRouter();
  const [bookingData, setBookingData] = useState<any>(null);
  const [carrierNames, setCarrierNames] = useState<Record<string, string>>({});
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showFareRuleSubmenu, setShowFareRuleSubmenu] = useState(false);
  const [fareRuleSubmenuLocked, setFareRuleSubmenuLocked] = useState(false);
  const [showReservationsDropdown, setShowReservationsDropdown] = useState(false);
  const [showFinanceDropdown, setShowFinanceDropdown] = useState(false);
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [commission, setCommission] = useState('0.00');
  const [paymentMethod, setPaymentMethod] = useState('current');
  const [confirmPassenger, setConfirmPassenger] = useState(false);
  const [confirmTerms, setConfirmTerms] = useState(false);

  // Passenger form state
  const [passengerTitle, setPassengerTitle] = useState('');
  const [passengerName, setPassengerName] = useState('');
  const [passengerLastName, setPassengerLastName] = useState('');
  const [passengerBirthDate, setPassengerBirthDate] = useState('');
  const [passengerMiles, setPassengerMiles] = useState('');
  const [passengerNationality, setPassengerNationality] = useState('');
  const [passengerPassport, setPassengerPassport] = useState('');
  const [passengerValidity, setPassengerValidity] = useState('');
  const [passengerIdNumber, setPassengerIdNumber] = useState('');

  // Contact form state
  const [contactTitle, setContactTitle] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactLastName, setContactLastName] = useState('');
  const [contactEmail, setContactEmail] = useState('r87ej9x3@gmail.com');
  const [contactPhone, setContactPhone] = useState('+964 750 324 2018');

  // Reservation & Company
  const [reservationNote, setReservationNote] = useState('');
  const [companyReference, setCompanyReference] = useState('');

  // Helper functions
  const handleLogout = () => {
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
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

  useEffect(() => {
    // Load booking data from localStorage
    const storedBooking = localStorage.getItem('bookingData');
    if (storedBooking) {
      setBookingData(JSON.parse(storedBooking));
    } else {
      // Redirect back if no booking data
      router.push('/flightResult');
    }
  }, [router]);

  useEffect(() => {
    const storedCarrierNames = localStorage.getItem('flightCarrierNames');
    if (storedCarrierNames) {
      try {
        setCarrierNames(JSON.parse(storedCarrierNames));
      } catch {
        // ignore
      }
    }
  }, []);

  const getCarrierLabel = (flight: any): string => {
    const code = flight?.carrierCode || flight?.originalOffer?.itineraries?.[0]?.segments?.[0]?.carrierCode || '';
    if (!code) return flight?.airline || 'Unknown';
    return carrierNames?.[code] || flight?.airline || code;
  };

  const handleApplyCoupon = () => {
    // Handle coupon application
    console.log('Applying coupon:', couponCode);
  };

  const handleUpdateCommission = () => {
    // Handle commission update
    console.log('Updating commission:', commission);
  };

  const handlePreReservation = () => {
    if (!confirmPassenger || !confirmTerms) {
      alert('Please confirm passenger information and accept terms of use');
      return;
    }

    // UI-only: persist payment inputs and continue to payment page
    try {
      const paymentData = {
        bookingData,
        paymentMethod,
        commission,
        couponCode,
        reservationNote,
        companyReference,
        createdAt: Date.now(),
      };
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
    } catch {
      // ignore storage errors
    }

    router.push('/payment');
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const { outbound, outboundClass, return: returnFlight, returnClass } = bookingData;
  const outboundAirlineLabel = getCarrierLabel(outbound);
  const returnAirlineLabel = getCarrierLabel(returnFlight);
  const outboundPrice = (outboundClass?.price ?? outbound?.price ?? 0) as number;
  const returnPrice = (returnClass?.price ?? returnFlight?.price ?? 0) as number;
  const baseFare = outboundPrice + returnPrice;
  // Amadeus offer prices are already total-inclusive; avoid adding simulated taxes.
  const taxes = 0;
  const total = baseFare + parseFloat(commission || '0');

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
            <HeaderUserMenu onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Navigation Bar */}
      <nav className="bg-black shadow-sm sticky top-0 z-[99999]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center space-x-6 py-3">
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
              className="relative z-[999998]"
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
                <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                  <a href="/agency/agencies" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium">Agencies</span>
                    </div>
                  </a>
                  <a href="/agency/sales-representatives" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span className="font-medium">Sales Representatives</span>
                    </div>
                  </a>
                  <a href="/agency/customers" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
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
                <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                  <a 
                    href="/product/offers" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
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
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
                        </svg>
                        <span className="font-medium">Fare Rule</span>
                      </div>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
                      </svg>
                    </div>
                    {showFareRuleSubmenu && (
                      <div className="absolute left-full top-0 -ml-px w-56 bg-black rounded-lg shadow-lg py-2 border border-gray-700">
                        <a 
                          href="/product/fare-rule/flight-ticket" 
                          className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                            <span className="font-medium">Flight Ticket</span>
                          </div>
                        </a>
                        <a 
                          href="/product/fare-rule/hotel" 
                          className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span className="font-medium">Hotel</span>
                          </div>
                        </a>
                        <a 
                          href="/product/fare-rule/rent-a-car" 
                          className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                            </svg>
                            <span className="font-medium">Rent A Car</span>
                          </div>
                        </a>
                        <a 
                          href="/product/fare-rule/transfer" 
                          className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
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
                <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                  <a href="/reservations/all" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                      </svg>
                      <span className="font-medium">All Reservations</span>
                    </div>
                  </a>
                  <a href="/reservations/flight-ticket" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      <span className="font-medium">Flight Ticket</span>
                    </div>
                  </a>
                  <a href="/reservations/hotel" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="font-medium">Hotel</span>
                    </div>
                  </a>
                  <a href="/reservations/transfer" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-medium">Transfer</span>
                    </div>
                  </a>
                  <a href="/reservations/rent-a-car" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                      </svg>
                      <span className="font-medium">Rent A Car</span>
                    </div>
                  </a>
                  <a href="/reservations/tour" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 0 1 6 0z" />
                      </svg>
                      <span className="font-medium">Tour</span>
                    </div>
                  </a>
                  <a href="/reservations/visa" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
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
                <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                  <a 
                    href="/finance/agency-accounts" 
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
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
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
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
                    className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors"
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
                <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                  <a href="/reports/flight-ticket/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                    <span className="font-medium">Flight Ticket Sales</span>
                  </a>
                  <a href="/reports/hotel/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
                    </svg>
                    <span className="font-medium">Hotel Sales</span>
                  </a>
                  <a href="/reports/rent-a-car/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                    <span className="font-medium">Rent A Car Sales</span>
                  </a>
                  <a href="/reports/tour/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                    <span className="font-medium">Tour Sales</span>
                  </a>
                  <a href="/reports/transfer/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/>
                    </svg>
                    <span className="font-medium">Transfer Sales</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            {/* Passenger Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-orange-100 p-2 rounded">
                  <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Passenger Info</h2>
              </div>

              <div className="mb-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-medium text-gray-900">Adult</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Passenger:</span>
                    <button className="bg-green-500 text-white px-3 py-1 rounded text-sm">Select</button>
                    <button className="bg-orange-500 text-white px-3 py-1 rounded text-sm">Save</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <select
                    value={passengerTitle}
                    onChange={(e) => setPassengerTitle(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="Mr">Mr</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Ms">Ms</option>
                  </select>
                  <input
                    type="text"
                    value={passengerName}
                    onChange={(e) => setPassengerName(e.target.value)}
                    placeholder="Name"
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={passengerLastName}
                    onChange={(e) => setPassengerLastName(e.target.value)}
                    placeholder="Last Name"
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <input
                    type="date"
                    value={passengerBirthDate}
                    onChange={(e) => setPassengerBirthDate(e.target.value)}
                    placeholder="Birth Date"
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="flex items-center space-x-2">
                    <button className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium">EK</button>
                    <input
                      type="text"
                      value={passengerMiles}
                      onChange={(e) => setPassengerMiles(e.target.value)}
                      placeholder="Miles & Smiles"
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <select
                    value={passengerNationality}
                    onChange={(e) => setPassengerNationality(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select</option>
                    <option value="IQ">Iraq</option>
                    <option value="TR">Turkey</option>
                    <option value="US">USA</option>
                  </select>
                  <input
                    type="text"
                    value={passengerPassport}
                    onChange={(e) => setPassengerPassport(e.target.value)}
                    placeholder="Passport Number"
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="date"
                    value={passengerValidity}
                    onChange={(e) => setPassengerValidity(e.target.value)}
                    placeholder="Validity Date"
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    value={passengerIdNumber}
                    onChange={(e) => setPassengerIdNumber(e.target.value)}
                    placeholder="ID Number"
                    className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-orange-100 p-2 rounded">
                  <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Contact Info</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <select
                  value={contactTitle}
                  onChange={(e) => setContactTitle(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="Mr">Mr</option>
                  <option value="Mrs">Mrs</option>
                  <option value="Ms">Ms</option>
                </select>
                <input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Name"
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  value={contactLastName}
                  onChange={(e) => setContactLastName(e.target.value)}
                  placeholder="Last Name"
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="Email"
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Phone"
                  className="border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Reservation Note */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-orange-100 p-2 rounded">
                  <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Reservation Note</h2>
              </div>

              <textarea
                value={reservationNote}
                onChange={(e) => setReservationNote(e.target.value)}
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add any special requests or notes..."
              />
            </div>

            {/* Company Reference */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-orange-100 p-2 rounded">
                  <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Company Reference</h2>
              </div>

              <input
                type="text"
                value={companyReference}
                onChange={(e) => setCompanyReference(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Company reference number..."
              />
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-orange-100 p-2 rounded">
                  <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                    <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Payment Details</h2>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <button
                  onClick={() => setPaymentMethod('pre')}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    paymentMethod === 'pre'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Pre-Reservation
                </button>
                <button
                  onClick={() => setPaymentMethod('current')}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    paymentMethod === 'current'
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Current
                </button>
              </div>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">Total :</span>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-orange-500">{total.toFixed(2)} USD</div>
                    <div className="text-sm text-gray-500">({(total * 34.45).toFixed(2)} TRY)</div>
                  </div>
                </div>

                <div className="space-y-3 mb-6">
                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmPassenger}
                      onChange={(e) => setConfirmPassenger(e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">
                      I Confirm that Passenger / Guest Information is Entered Accurately and Completely.
                    </span>
                  </label>

                  <label className="flex items-start space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={confirmTerms}
                      onChange={(e) => setConfirmTerms(e.target.checked)}
                      className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-orange-500">
                      I read terms of use and approve..
                    </span>
                  </label>
                </div>

                <button
                  onClick={handlePreReservation}
                  disabled={!confirmPassenger || !confirmTerms}
                  className="w-full bg-orange-300 hover:bg-orange-400 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-lg font-bold text-lg transition-colors"
                >
                  Pre-Reservation
                </button>

                <div className="mt-6 flex items-center justify-center space-x-4">
                  <Image src="/visa-mastercard.png" alt="Visa Mastercard" width={150} height={40} className="object-contain" />
                  <div className="border-l h-10"></div>
                  <div className="text-center">
                    <div className="text-xs text-gray-600">3D Secure</div>
                    <div className="text-xs text-gray-600">Payment System</div>
                    <div className="text-xs font-bold">256 bit SSL</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Flight Info & Price */}
          <div className="lg:col-span-1 space-y-6">
            {/* Flight Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                  <h3 className="font-bold text-gray-900">Flight Info</h3>
                </div>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">1 Warning</span>
              </div>

              {/* Outbound Flight */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Image src={outbound?.logo || '/default-airline.png'} alt={outboundAirlineLabel} width={40} height={40} className="object-contain" />
                  <span className="font-medium text-red-600">{outboundAirlineLabel}</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                    <span className="font-medium">Departure</span>
                  </div>
                  <div className="ml-5">
                    <div className="text-lg font-bold text-teal-600">{outbound?.departure?.time}</div>
                    <div className="text-gray-600">{outbound?.departure?.date}</div>
                    <div className="text-gray-600">{outbound?.departure?.airport}</div>
                  </div>

                  <div className="flex items-center space-x-2 mt-3">
                    <div className="w-3 h-3 bg-white border-2 border-teal-500 rounded-full"></div>
                    <span className="font-medium">Arrival</span>
                  </div>
                  <div className="ml-5">
                    <div className="text-lg font-bold">{outbound?.arrival?.time}</div>
                    <div className="text-gray-600">{outbound?.arrival?.date}</div>
                    <div className="text-gray-600">{outbound?.arrival?.airport}</div>
                  </div>

                  <div className="ml-5 mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-600">Class: {outboundClass?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                      </svg>
                      <span className="text-gray-600">Flight Code: {outbound?.flightNumber}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                      </svg>
                      <span className="text-gray-600">Adult: 25 KG</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Return Flight */}
              {returnFlight && (
                <div className="border-t pt-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <Image src={returnFlight?.logo || '/default-airline.png'} alt={returnAirlineLabel} width={40} height={40} className="object-contain" />
                    <span className="font-medium text-red-600">{returnAirlineLabel}</span>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                      <span className="font-medium">Departure</span>
                    </div>
                    <div className="ml-5">
                      <div className="text-lg font-bold text-teal-600">{returnFlight?.departure?.time}</div>
                      <div className="text-gray-600">{returnFlight?.departure?.date}</div>
                      <div className="text-gray-600">{returnFlight?.departure?.airport}</div>
                    </div>

                    <div className="flex items-center space-x-2 mt-3">
                      <div className="w-3 h-3 bg-white border-2 border-teal-500 rounded-full"></div>
                      <span className="font-medium">Arrival</span>
                    </div>
                    <div className="ml-5">
                      <div className="text-lg font-bold">{returnFlight?.arrival?.time}</div>
                      <div className="text-gray-600">{returnFlight?.arrival?.date}</div>
                      <div className="text-gray-600">{returnFlight?.arrival?.airport}</div>
                    </div>

                    <div className="ml-5 mt-2 space-y-1">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-600">Class: {returnClass?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1z" />
                        </svg>
                        <span className="text-gray-600">Flight Code: {returnFlight?.flightNumber}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                        </svg>
                        <span className="text-gray-600">Adult: 25 KG</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Price Info */}
            <div className="bg-blue-50 rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-6">
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <h3 className="font-bold text-gray-900">Price Info</h3>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Apply Coupon</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Coupon Code"
                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Base Fare</span>
                  <div className="text-right">
                    <div className="font-bold">{(baseFare * 34.45).toFixed(2)} TRY</div>
                    <div className="text-xs text-gray-500">({baseFare.toFixed(2)} USD)</div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes</span>
                  <div className="text-right">
                    <div className="font-bold">{(taxes * 34.45).toFixed(2)} TRY</div>
                    <div className="text-xs text-gray-500">({taxes.toFixed(2)} USD)</div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commission</span>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      value={commission}
                      onChange={(e) => setCommission(e.target.value)}
                      className="w-24 border border-gray-300 rounded px-2 py-1 text-right text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      step="0.01"
                    />
                    <span className="font-medium">USD</span>
                  </div>
                </div>

                <button
                  onClick={handleUpdateCommission}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white py-2 rounded-lg font-medium transition-colors"
                >
                  Update
                </button>

                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-orange-500">{(total * 34.45).toFixed(2)} TRY</div>
                      <div className="text-sm text-gray-500">({total.toFixed(2)} USD)</div>
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mt-4">
                  <p className="text-xs text-red-600">
                    <strong>Remark:</strong> The original currency is fixed and the exchange rate will be updated at the time of payment and the related amount will be charged.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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








