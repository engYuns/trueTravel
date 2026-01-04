/**
 * True Travel B2B Booking Platform - Financial Panel Page
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

"use client"; 

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeaderUserMenu from '@/components/HeaderUserMenu';

export default function Panel() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("USD");
  
  // Dropdown States
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false);
  const [showProductDropdown, setShowProductDropdown] = useState(false);
  const [showFareRuleSubmenu, setShowFareRuleSubmenu] = useState(false);
  const [fareRuleSubmenuLocked, setFareRuleSubmenuLocked] = useState(false);
  const [showReservationsDropdown, setShowReservationsDropdown] = useState(false);
  const [showFinanceDropdown, setShowFinanceDropdown] = useState(false);
  const [showReportsDropdown, setShowReportsDropdown] = useState(false);

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

  const handleLogout = () => {
    // Remove authentication cookie
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
  };

  const currencies = ["USD", "EUR", "TRY", "IQD"];

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
            <a href="/panel" className="flex items-center space-x-2 text-orange-500 hover:text-orange-400 transition-colors whitespace-nowrap">
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
                <svg className={`w-4 h-4 transition-transform ${showReportsDropdown ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              {showReportsDropdown && (
                <div className="absolute top-full left-0 mt-0 w-56 bg-black rounded-lg shadow-lg py-2 z-[999999] border border-gray-700">
                  <a href="/reports/flight-ticket/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
                    </svg>
                    <span>Flight Ticket Sales</span>
                  </a>
                  <a href="/reports/hotel/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
                    </svg>
                    <span>Hotel Sales</span>
                  </a>
                  <a href="/reports/rent-a-car/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                    <span>Rent A Car Sales</span>
                  </a>
                  <a href="/reports/transfer/sales" className="flex items-center px-4 py-3 text-white hover:bg-gray-800 transition-colors">
                    <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
                    </svg>
                    <span>Transfer Sales</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Company Information Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-semibold text-orange-500 mb-2">Company Name</h3>
              <p className="text-gray-800">True Travel Tourism Services LLC</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-orange-500 mb-2">Tax Office</h3>
              <p className="text-gray-800">Erbil</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-orange-500 mb-2">Tax Number</h3>
              <p className="text-gray-800">1791169304</p>
            </div>
          </div>

          {/* Amount and Currency Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div>
              <label className="block text-sm font-semibold text-orange-500 mb-2">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-orange-500 mb-2">Currency</label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-orange-500 mb-2">Currency</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {currencies.map((currency) => (
                  <option key={currency} value={currency}>{currency}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end space-x-2">
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </button>
              <button className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-bold">
                $
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Turnover Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-600">Turnover</h3>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">0</span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">0.00</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>

          {/* Sale Count Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-600">Sale Count</h3>
              <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">0</span>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>

        {/* Balance Info and Liable Person */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Balance Information */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">BALANCE INFO</h3>
            
            {/* Balance Circles */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {/* Defined Balance */}
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="#3b82f6" strokeWidth="8" fill="none" 
                            strokeDasharray="251.2" strokeDashoffset="0" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">100%</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-700 mb-1 text-sm">Defined Balance</h4>
                <p className="text-sm font-bold">3000.00 USD</p>
              </div>

              {/* Total Balance */}
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="#155dfc" strokeWidth="8" fill="none" 
                            strokeDasharray="251.2" strokeDashoffset="0" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-orange-600">100%</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-700 mb-1 text-sm">Total Balance</h4>
                <p className="text-sm font-bold">3691.66 USD</p>
              </div>

              {/* Used Balance */}
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-red-600">0%</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-700 mb-1 text-sm">Used Balance</h4>
                <p className="text-sm font-bold">0.00 USD</p>
              </div>

              {/* Available Balance */}
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="#10b981" strokeWidth="8" fill="none" 
                            strokeDasharray="251.2" strokeDashoffset="0" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">100%</span>
                  </div>
                </div>
                <h4 className="font-semibold text-gray-700 mb-1 text-sm">Available Balance</h4>
                <p className="text-sm font-bold">3691.66 USD</p>
              </div>
            </div>

            {/* Commission */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3">Commission</h4>
              <div className="flex items-center space-x-4">
                <div className="relative w-16 h-16">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                    <circle cx="50" cy="50" r="40" stroke="#06b6d4" strokeWidth="8" fill="none" 
                            strokeDasharray="251.2" strokeDashoffset="0" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs font-bold text-cyan-600">100%</span>
                  </div>
                </div>
                <div>
                  <div className="text-lg font-bold text-cyan-600">5.01</div>
                  <div className="text-sm text-gray-600">USD</div>
                </div>
              </div>
            </div>
          </div>

          {/* Liable Person */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">LIABLE PERSON</h3>
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h4 className="text-lg font-semibold text-gray-600 mb-1">Mrs. Ceren Çipa</h4>
              <p className="text-sm text-blue-500 mb-3">Sales & Marketing Director</p>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                  <span>ccipa@bookingagora.com</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span>+90 533 705 5209</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Bank Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-6">SYSTEM BANK INFORMATION</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-red-600 font-bold">Ziraat Bankası</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-orange-500 font-bold">VakıfBank</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-blue-600 font-bold">HALKBANK</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-blue-800 font-bold">DenizBank</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-green-600 font-bold">Garanti</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-red-600 font-bold">AKBANK</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-blue-500 font-bold">YapıKredi</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-blue-700 font-bold">Türkiye İş Bankası</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-yellow-600 font-bold">KuveytTürk</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-orange-600 font-bold">alBaraka</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-green-600 font-bold">TEB</div>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="text-center">
                <div className="text-red-500 font-bold">Türkiye Finans</div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <p className="text-sm">Copyright © 2025. Powered by <span className="text-yellow-500 font-bold">Y</span></p>
          </div>
        </div>
      </footer>
    </div>
  );
}







