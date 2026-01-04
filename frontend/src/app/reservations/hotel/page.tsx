'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeaderUserMenu from '@/components/HeaderUserMenu';
import { copyTableToClipboard, exportTableToExcel, exportTableToPdf, printTable } from '@/lib/tableExport';

export default function ReservationsHotelPage() {
  const router = useRouter();

  // Navigation Dropdowns State (kept consistent with other pages)
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showFareRuleSubmenu, setShowFareRuleSubmenu] = useState(false);
  const [fareRuleSubmenuLocked, setFareRuleSubmenuLocked] = useState(false);
  const [showReservationsDropdown, setShowReservationsDropdown] = useState(false);
  const [showFinanceDropdown, setShowFinanceDropdown] = useState(false);
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);

  // UI State

  // Search Criteria State
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState('Transaction time');
  const [transactionType, setTransactionType] = useState('All selected (10)');
  const [hotel, setHotel] = useState('');
  const [reservationNumber, setReservationNumber] = useState('');
  const [guest, setGuest] = useState('');
  const [company, setCompany] = useState('All');
  const [user, setUser] = useState('');
  const [companyReference, setCompanyReference] = useState('');
  const [country, setCountry] = useState('All');
  const [location, setLocation] = useState('');
  const [channelType, setChannelType] = useState('All selected (9)');
  const [simulator, setSimulator] = useState('');

  // Collapsible Panels State
  const [isPageDisplayedOpen, setIsPageDisplayedOpen] = useState(true);
  const [isAllPagesListedOpen, setIsAllPagesListedOpen] = useState(true);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Table Data (empty, as in screenshot)
  const [reservations] = useState<any[]>([]);
  const totalRecords = reservations.length;

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

  const handleSearch = () => {
    console.log('Searching hotel reservations with criteria:', {
      dateFrom,
      dateTo,
      sort,
      transactionType,
      hotel,
      reservationNumber,
      guest,
      company,
      user,
      companyReference,
      country,
      location,
      channelType,
      simulator,
      currentPage,
      itemsPerPage,
    });
  };

  const handleExport = async (type: 'copy' | 'excel' | 'pdf' | 'print') => {
    const data = reservations.map((r) => ({ ...r } as unknown as Record<string, unknown>));

    if (type === 'print') {
      printTable('#export-table', 'Reservations - Hotel');
      return;
    }
    if (type === 'copy') {
      await copyTableToClipboard(data);
      return;
    }
    if (type === 'excel') {
      await exportTableToExcel('reservations-hotel.xlsx', data);
      return;
    }
    await exportTableToPdf('reservations-hotel.pdf', 'Reservations - Hotel', data);
  };

  const ChevronIcon = ({ open }: { open: boolean }) => (
    <svg className={`w-5 h-5 text-gray-700 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  const CalendarIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <Image src="/logo.png" alt="True Travel Logo" width={50} height={50} className="object-contain" />
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
                <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
              <span className="font-medium">Book a Service</span>
            </a>
            <a href="/panel" className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
              </svg>
              <span className="font-medium">Panel</span>
            </a>

            {/* Agency Dropdown */}
            <div className="relative z-[999998]" onMouseEnter={() => setShowAgencyDropdown(true)} onMouseLeave={() => setShowAgencyDropdown(false)}>
              <button className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap" type="button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span className="font-medium">Agency</span>
                <svg className={`w-4 h-4 transition-transform ${showAgencyDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
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
                  <a href="/agency/agencies/add" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="font-medium">Add Agent</span>
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
            <div className="relative" onMouseEnter={() => setShowProductDropdown(true)} onMouseLeave={() => setShowProductDropdown(false)}>
              <a href="#" className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-2.18c.11-.31.18-.65.18-1 0-1.66-1.34-3-3-3-1.05 0-1.96.54-2.5 1.35l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 11 8.76l1-1.36 1 1.36L15.38 12 17 10.83 14.92 8H20v6z" />
                </svg>
                <span className="font-medium">Product</span>
                <svg className={`w-4 h-4 transition-transform ${showProductDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>

              {showProductDropdown && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                  <a href="/product/offers" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
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
                        <a href="/product/fare-rule/flight-ticket" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                            </svg>
                            <span className="font-medium">Flight Ticket</span>
                          </div>
                        </a>
                        <a href="/product/fare-rule/hotel" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                            </svg>
                            <span className="font-medium">Hotel</span>
                          </div>
                        </a>
                        <a href="/product/fare-rule/rent-a-car" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                          <div className="flex items-center space-x-3">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 20 20">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z" />
                            </svg>
                            <span className="font-medium">Rent A Car</span>
                          </div>
                        </a>
                        <a href="/product/fare-rule/transfer" className="block px-4 py-3 text-white hover:bg-gray-800 transition-colors">
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
            <div className="relative" onMouseEnter={() => setShowReservationsDropdown(true)} onMouseLeave={() => setShowReservationsDropdown(false)}>
              <button className="flex items-center space-x-2 text-orange-500 hover:text-orange-400 transition-colors whitespace-nowrap" type="button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                </svg>
                <span className="font-medium">Reservations</span>
                <svg className={`w-4 h-4 transition-transform ${showReservationsDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
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
            <div className="relative" onMouseEnter={() => setShowFinanceDropdown(true)} onMouseLeave={() => setShowFinanceDropdown(false)}>
              <button className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap" type="button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </svg>
                <span className="font-medium">Finance</span>
                <svg className={`w-4 h-4 transition-transform ${showFinanceDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
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

            {/* Reports Dropdown */}
            <div className="relative" onMouseEnter={() => setShowReportsDropdown(true)} onMouseLeave={() => setShowReportsDropdown(false)}>
              <button className="flex items-center space-x-2 text-white hover:text-orange-500 transition-colors whitespace-nowrap" type="button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
                </svg>
                <span className="font-medium">Reports</span>
                <svg className={`w-4 h-4 transition-transform ${showReportsDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
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

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Title + Breadcrumb */}
        <div className="mb-6">
          <h2 className="text-3xl font-light text-gray-800">Hotel</h2>
          <div className="mt-2 text-sm text-gray-500">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Homepage
            </a>{' '}
            <span className="mx-2">»</span>
            <span className="text-gray-400">Hotel</span>
          </div>
        </div>

        {/* Searching Criterias */}
        <div className="bg-white border border-orange-500 rounded-sm overflow-hidden mb-8">
          <div className="bg-orange-500 text-white px-5 py-3">
            <h3 className="text-xl font-medium">Searching Criterias</h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
              {/* Date Range */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-orange-500 mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">{CalendarIcon()}</div>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full pl-11 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">{CalendarIcon()}</div>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full pl-11 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Transaction time">Transaction time</option>
                  <option value="Option Date">Option Date</option>
                  <option value="Check-In">Check-In</option>
                  <option value="Check-Out">Check-Out</option>
                </select>
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Transaction Type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="All selected (10)">All selected (10)</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Refund">Refund</option>
                </select>
              </div>

              {/* Hotel */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Hotel</label>
                <input
                  type="text"
                  value={hotel}
                  onChange={(e) => setHotel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Reservation Number */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-orange-500 mb-2">Reservation Number</label>
                <input
                  type="text"
                  value={reservationNumber}
                  onChange={(e) => setReservationNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Guest */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Guest</label>
                <input
                  type="text"
                  value={guest}
                  onChange={(e) => setGuest(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Company</label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="True Travel">True Travel</option>
                </select>
              </div>

              {/* User */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">User</label>
                <div className="relative">
                  <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  </div>
                </div>
              </div>

              {/* Company Reference */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-orange-500 mb-2">Company Reference</label>
                <input
                  type="text"
                  value={companyReference}
                  onChange={(e) => setCompanyReference(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Country</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="Iraq">Iraq</option>
                  <option value="Turkey">Turkey</option>
                  <option value="UAE">UAE</option>
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Location</label>
                <div className="relative">
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  </div>
                </div>
              </div>

              {/* Channel Type */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Channel Type</label>
                <select
                  value={channelType}
                  onChange={(e) => setChannelType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="All selected (9)">All selected (9)</option>
                  <option value="B2B">B2B</option>
                  <option value="B2C">B2C</option>
                </select>
              </div>

              {/* Simulator */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-orange-500 mb-2">Simulator</label>
                <div className="relative">
                  <input
                    type="text"
                    value={simulator}
                    onChange={(e) => setSimulator(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full lg:w-auto px-8 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Two Small Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Page Displayed */}
          <div className="bg-white border border-orange-500 rounded-sm overflow-hidden">
            <div className="bg-orange-500 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-xl font-medium">Page Displayed</h3>
              <button
                type="button"
                onClick={() => setIsPageDisplayedOpen((prev) => !prev)}
                className="bg-white rounded-md px-2 py-1 hover:bg-gray-50 transition-colors"
                aria-label="Toggle Page Displayed"
              >
                <ChevronIcon open={isPageDisplayedOpen} />
              </button>
            </div>

            {isPageDisplayedOpen && (
              <div className="p-6">
                <div className="border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-4 text-center text-base font-bold text-gray-900">Transaction Type</th>
                        <th className="px-4 py-4 text-center text-base font-bold text-gray-900">Room</th>
                        <th className="px-4 py-4 text-center text-base font-bold text-gray-900">Pax Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-gray-400"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* All Pages Listed */}
          <div className="bg-white border border-orange-500 rounded-sm overflow-hidden">
            <div className="bg-orange-500 text-white px-5 py-3 flex items-center justify-between">
              <h3 className="text-xl font-medium">All Pages Listed</h3>
              <button
                type="button"
                onClick={() => setIsAllPagesListedOpen((prev) => !prev)}
                className="bg-white rounded-md px-2 py-1 hover:bg-gray-50 transition-colors"
                aria-label="Toggle All Pages Listed"
              >
                <ChevronIcon open={isAllPagesListedOpen} />
              </button>
            </div>

            {isAllPagesListedOpen && (
              <div className="p-6">
                <div className="border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-4 text-center text-base font-bold text-gray-900">Transaction Type</th>
                        <th className="px-4 py-4 text-center text-base font-bold text-gray-900">Room</th>
                        <th className="px-4 py-4 text-center text-base font-bold text-gray-900">Pax Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-gray-400"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Actions + Pagination */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
              </svg>
              <span>COLUMN VISIBILITY</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => void handleExport('copy')}
              className="px-4 py-2 border border-teal-400 rounded-md bg-white text-teal-600 hover:bg-teal-50 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm4 4H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 18H8V7h12v16z" />
              </svg>
              <span>COPY</span>
            </button>

            <button
              type="button"
              onClick={() => void handleExport('excel')}
              className="px-4 py-2 border border-yellow-400 rounded-md bg-white text-yellow-600 hover:bg-yellow-50 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H9v-2h2v2zm0-4H9V7h2v6zm6 4h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2z" />
              </svg>
              <span>EXCEL</span>
            </button>

            <button
              type="button"
              onClick={() => void handleExport('pdf')}
              className="px-4 py-2 border border-purple-400 rounded-md bg-white text-purple-600 hover:bg-purple-50 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.83.48-5.53-.3-7.58-2.05l1.43-1.43A7.93 7.93 0 0013 19.93zm0-3.06c-1.7-.45-3.2-1.37-4.36-2.64l1.42-1.42A5.98 5.98 0 0013 15.87zm0-3.1c-.86-.36-1.62-.9-2.22-1.56l1.42-1.42c.22.24.48.45.8.61V8h2v5.77z" />
              </svg>
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={() => void handleExport('print')}
              className="px-4 py-2 border border-gray-500 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-10c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zM18 3H6v4h12V3z" />
              </svg>
              <span>PRINT</span>
            </button>

            <button type="button" className="px-6 py-2 border border-blue-500 rounded-md bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors font-bold">
              SYS-R
            </button>
          </div>

          <div className="flex items-center justify-end gap-3">
            <span className="text-base text-orange-500 font-medium whitespace-nowrap">
              Total Recording Number: <span className="font-bold">{totalRecords}</span>
            </span>
            <span className="text-base text-orange-500 font-medium whitespace-nowrap">Pagination</span>
            <input
              type="number"
              min={1}
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
              className="w-14 px-2 py-2 bg-gray-200 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              className="w-28 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Main Data Table */}
        <div className="bg-white border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table id="export-table" className="w-full">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">Transaction time</th>
                  <th className="px-4 py-4 text-left font-semibold">Reservation Number</th>
                  <th className="px-4 py-4 text-left font-semibold">Company Reference</th>
                  <th className="px-4 py-4 text-left font-semibold">Transaction Type</th>
                  <th className="px-4 py-4 text-left font-semibold">Option Date</th>
                  <th className="px-4 py-4 text-left font-semibold">Check-In</th>
                  <th className="px-4 py-4 text-left font-semibold">Check-Out</th>
                  <th className="px-4 py-4 text-left font-semibold">Hotel</th>
                  <th className="px-4 py-4 text-left font-semibold">Guest</th>
                  <th className="px-4 py-4 text-left font-semibold">Amount</th>
                  <th className="px-4 py-4 text-left font-semibold">Simulator</th>
                  <th className="px-4 py-4 text-left font-semibold">Sales Channel</th>
                  <th className="px-4 py-4 text-left font-semibold">Detail</th>
                  <th className="px-4 py-4 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={14} className="px-6 py-10 text-center text-gray-700">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  reservations.map((row, idx) => (
                    <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{row.transactionTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.reservationNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.companyReference}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.transactionType}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.optionDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.checkIn}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.checkOut}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.hotel}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.guest}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.amount}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.simulator}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.salesChannel}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.detail}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.status}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">N</span>
              </div>
            </div>

            <div className="text-sm">
              <p>
                Copyright © 2025. Powered by <span className="text-yellow-400 font-bold">Y</span>
              </p>
            </div>

            <div className="w-10" aria-hidden="true" />
          </div>
        </div>
      </footer>
    </div>
  );
}
