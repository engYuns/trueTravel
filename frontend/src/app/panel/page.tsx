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

export default function Panel() {
  const router = useRouter();
  const [showScrollUp, setShowScrollUp] = useState(false);
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("USD");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollUp(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    // Remove authentication cookie
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
                    <circle cx="50" cy="50" r="40" stroke="#f59e0b" strokeWidth="8" fill="none" 
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

      {/* Scroll Up Button */}
      {showScrollUp && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300"
          aria-label="Scroll to top"
        >
          <span className="text-sm font-bold">↑ Scroll Up</span>
        </button>
      )}
    </div>
  );
}
