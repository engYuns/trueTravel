'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeaderUserMenu from '@/components/HeaderUserMenu';

export default function FareRuleFlightTicketPage() {
  const router = useRouter();

  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showFareRuleSubmenu, setShowFareRuleSubmenu] = useState(false);
  const [fareRuleSubmenuLocked, setFareRuleSubmenuLocked] = useState(false);
  const [showReservationsDropdown, setShowReservationsDropdown] = useState(false);
  const [showFinanceDropdown, setShowFinanceDropdown] = useState(false);
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);

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

  // Search Filters State
  const [name, setName] = useState('');
  const [ruleType, setRuleType] = useState('All');
  const [channel, setChannel] = useState('');
  const [provider, setProvider] = useState('');
  const [agencyGroup, setAgencyGroup] = useState('');
  const [subCompanies, setSubCompanies] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [locationType, setLocationType] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState('Flight Date');
  const [flightNumber, setFlightNumber] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Table Data (Sample - currently empty as shown in image)
  const [fareRules, setFareRules] = useState<any[]>([]);

  const totalRecords = fareRules.length;

  const handleSearch = () => {
    console.log('Searching with filters:', {
      name,
      ruleType,
      channel,
      provider,
      agencyGroup,
      subCompanies,
      providerFilter,
      locationType,
      dateFrom,
      dateTo,
      sort,
      flightNumber
    });
  };

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
            <a href="/dashboard" className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
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
                  <svg className={`w-4 h-4 transition-transform ${showAgencyDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
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

              <div 
                className="relative z-[999998]"
                onMouseEnter={() => setShowReservationsDropdown(true)}
                onMouseLeave={() => setShowReservationsDropdown(false)}
              >
                <button className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17 10H7v2h10v-2zm2-7h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-5-5H7v2h7v-2z"/>
                  </svg>
                  <span className="font-medium">Reservations</span>
                  <svg className={`w-4 h-4 transition-transform ${showReservationsDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
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

              <div 
                className="relative z-[999998]"
                onMouseEnter={() => setShowFinanceDropdown(true)}
                onMouseLeave={() => setShowFinanceDropdown(false)}
              >
                <button className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"/>
                  </svg>
                  <span className="font-medium">Finance</span>
                  <svg className={`w-4 h-4 transition-transform ${showFinanceDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {showFinanceDropdown && (
                  <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                    <a href="/finance/agency-accounts" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                        <span className="font-medium">Agency Accounts</span>
                      </div>
                    </a>
                    <a href="/finance/receiving-discharge" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                        </svg>
                        <span className="font-medium">Receiving and Discharge</span>
                      </div>
                    </a>
                    <a href="/finance/virement" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
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
                <button className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4zm2.5 2.1h-15V5h15v14.1zm0-16.1h-15c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
                  </svg>
                  <span className="font-medium">Reports</span>
                  <svg className={`w-4 h-4 transition-transform ${showReportsDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                {showReportsDropdown && (
                  <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                    <a href="/reports/flight-ticket/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                        </svg>
                        <span className="font-medium">Flight Ticket Sales</span>
                      </div>
                    </a>
                    <a href="/reports/hotel/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
                        </svg>
                        <span className="font-medium">Hotel Sales</span>
                      </div>
                    </a>
                    <a href="/reports/rent-a-car/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
                        </svg>
                        <span className="font-medium">Rent A Car Sales</span>
                      </div>
                    </a>
                    <a href="/reports/tour/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                        </svg>
                        <span className="font-medium">Tour Sales</span>
                      </div>
                    </a>
                    <a href="/reports/transfer/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <h2 className="text-3xl font-light text-gray-800 mb-2">Fare Rules</h2>
          <div className="flex items-center space-x-2 text-sm">
            <a href="/dashboard" className="text-blue-500 hover:underline">Homepage</a>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Fare Rules</span>
          </div>
        </div>

        {/* Search Criterias Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="bg-orange-500 text-white px-6 py-3 rounded-t-lg">
            <h3 className="text-lg font-medium">Searching Criterias</h3>
          </div>
          
          <div className="p-6">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Name</label>
                <select 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">None selected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Rule Type</label>
                <select 
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="All">All</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Channel</label>
                <select 
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">None selected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Provider</label>
                <select 
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">None selected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Agency Group / Company Group</label>
                <select 
                  value={agencyGroup}
                  onChange={(e) => setAgencyGroup(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">None selected</option>
                </select>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Sub Companies</label>
                <input 
                  type="text"
                  value={subCompanies}
                  onChange={(e) => setSubCompanies(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Provider</label>
                <select 
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">None selected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Location Type</label>
                <select 
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="All">All</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Date Range</label>
                <div className="flex space-x-2">
                  <input 
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input 
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Sort</label>
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="Flight Date">Flight Date</option>
                </select>
              </div>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Flight Number</label>
                <input 
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-end">
                <button 
                  onClick={handleSearch}
                  className="w-full h-12 bg-orange-500 text-white px-6 text-base font-medium rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {/* New Button and Pagination */}
            <div className="flex justify-between items-center mb-4">
              <button className="h-10 bg-teal-500 hover:bg-teal-600 text-white px-4 rounded-md transition-colors flex items-center space-x-2 font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>New</span>
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-orange-500 font-medium">Total Recording Number: {totalRecords}</span>
                <span className="text-gray-600">Pagination</span>
                <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors">
                  {currentPage}
                </button>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Rule</th>
                    <th className="px-4 py-3 text-left font-semibold">Sales Channel</th>
                    <th className="px-4 py-3 text-left font-semibold">Provider</th>
                    <th className="px-4 py-3 text-left font-semibold">Location Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Provider</th>
                    <th className="px-4 py-3 text-left font-semibold">Distance</th>
                    <th className="px-4 py-3 text-left font-semibold">Calculating type</th>
                    <th className="px-4 py-3 text-left font-semibold">Currency</th>
                    <th className="px-4 py-3 text-left font-semibold">Fare Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Price Range</th>
                    <th className="px-4 py-3 text-left font-semibold">Agency Group / Company Group</th>
                  </tr>
                </thead>
                <tbody>
                  {fareRules.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="px-4 py-12 text-center text-gray-500">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    fareRules.map((rule, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.rule}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.salesChannel}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.provider}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.locationType}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.provider2}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.distance}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.calculatingType}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.currency}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.fareType}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.priceRange}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.agencyGroup}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Delete Button */}
            <div className="flex justify-end mt-4">
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2 font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center">
            <p className="text-sm">
              Copyright © 2025. Powered by{' '}
              <span className="text-yellow-400 font-bold">Y</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
