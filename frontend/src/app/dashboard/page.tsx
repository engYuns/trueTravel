'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const { t, language, setLanguage } = useLanguage();
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute
  useState(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  });

  const handleLogout = () => {
    // Clear authentication cookies
    document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    document.cookie = 'userEmail=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-black text-white px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M21 8c0-.6-.4-1-1-1h-3V6c0-.6-.4-1-1-1s-1 .4-1 1v1H9V6c0-.6-.4-1-1-1s-1 .4-1 1v1H4c-.6 0-1 .4-1 1s.4 1 1 1h1v8c0 1.7 1.3 3 3 3h8c1.7 0 3-1.3 3-3V9h1c.6 0 1-.4 1-1zM8 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                </svg>
              </div>
              <span className="text-white font-bold text-lg">truetravel.com</span>
              <span className="text-gray-400 text-sm">{t('header.tagline')}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-full bg-gray-800 text-white px-4 py-2 rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
              <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notification */}
            <div className="relative">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer">
                <span className="text-white text-sm">Y</span>
              </div>
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">2</span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <span className="text-white">younis pshtiwan</span>
            </div>

            {/* Language & Contact */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <img src="/api/placeholder/20/15" alt="UK Flag" className="w-5 h-3" />
                <span className="text-white text-sm">English (USD)</span>
              </div>
              <span className="text-white">📞 +964 750 330 3003</span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-300 hover:text-white transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="text-sm">{t('auth.logout')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex space-x-8 mt-4 border-t border-gray-700 pt-4">
          <a href="#" className="flex items-center space-x-2 text-blue-400 border-b-2 border-blue-400 pb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Homepage</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Panel</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span>Agency</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Product</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Reservations</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <span>Finance</span>
          </a>
          <a href="#" className="flex items-center space-x-2 text-gray-300 hover:text-white">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Reports</span>
          </a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {/* Company Header */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">TRUE TRAVEL</h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-800">{formatTime(currentTime)}</div>
                <div className="text-gray-600">{formatDate(currentTime)}</div>
              </div>
              <button className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-2">Company Name</label>
              <p className="text-gray-800">True Travel Tourism Services LLC</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-2">Tax Office</label>
              <p className="text-gray-800">Erbil</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-2">Tax Number</label>
              <p className="text-gray-800">2025001234</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-2">Amount</label>
              <input type="text" className="w-full border border-gray-300 rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-2">Currency</label>
              <select className="w-full border border-gray-300 rounded px-3 py-2">
                <option>USD</option>
                <option>EUR</option>
                <option>TRY</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-orange-500 mb-2">Currency</label>
              <div className="flex space-x-2">
                <select className="flex-1 border border-gray-300 rounded px-3 py-2">
                  <option>USD</option>
                  <option>EUR</option>
                  <option>TRY</option>
                </select>
                <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>
                <button className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Turnover Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Turnover</h3>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm">0</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">0.00</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>

          {/* Sale Count Card */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-gray-600 font-medium">Sale Count</h3>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-sm">0</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-green-600 mb-2">0</div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '0%' }}></div>
            </div>
          </div>
        </div>

        {/* Balance and Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Balance Info - Takes 2 columns */}
          <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">BALANCE INFO</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray="100, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">100%</span>
                  </div>
                </div>
                <h4 className="font-medium text-gray-700 mb-1">Defined Balance</h4>
                <p className="text-sm font-bold">3000.00 USD</p>
              </div>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#f97316"
                      strokeWidth="2"
                      strokeDasharray="100, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-orange-600 font-bold">100%</span>
                  </div>
                </div>
                <h4 className="font-medium text-gray-700 mb-1">Total Balance</h4>
                <p className="text-sm font-bold">4982.13 USD</p>
              </div>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="2"
                      strokeDasharray="0, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-red-600 font-bold">0%</span>
                  </div>
                </div>
                <h4 className="font-medium text-gray-700 mb-1">Used Balance</h4>
                <p className="text-sm font-bold">0.00 USD</p>
              </div>

              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      strokeDasharray="100, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-green-600 font-bold">100%</span>
                  </div>
                </div>
                <h4 className="font-medium text-gray-700 mb-1">Available Balance</h4>
                <p className="text-sm font-bold">4982.13 USD</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-700 mb-4">Commission</h4>
              <div className="text-center">
                <div className="relative w-20 h-20 mx-auto mb-3">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="2"
                      strokeDasharray="100, 100"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-cyan-600 font-bold">100%</span>
                  </div>
                </div>
                <p className="text-sm font-bold">5.01</p>
              </div>
            </div>
          </div>

          {/* Liable Person */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-800 mb-6">LIABLE PERSON</h3>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-900 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              
              <h4 className="text-lg font-bold text-blue-600 mb-1">Mr. Ahmad Hassan</h4>
              <p className="text-blue-500 text-sm mb-4">General Manager</p>
              
              <div className="space-y-2 text-left">
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm">info@truetravel.com</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-sm">+964 750 330 3003</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Bank Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">SYSTEM BANK INFORMATION</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
              <img src="/api/placeholder/120/40" alt="Ziraat Bankası" className="max-h-8" />
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
              <img src="/api/placeholder/120/40" alt="VakıfBank" className="max-h-8" />
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
              <img src="/api/placeholder/120/40" alt="Halkbank" className="max-h-8" />
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
              <img src="/api/placeholder/120/40" alt="DenizBank" className="max-h-8" />
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
              <img src="/api/placeholder/120/40" alt="Garanti" className="max-h-8" />
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
              <img src="/api/placeholder/120/40" alt="Akbank" className="max-h-8" />
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
              <img src="/api/placeholder/120/40" alt="Yapı Kredi" className="max-h-8" />
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
              <img src="/api/placeholder/120/40" alt="Türkiye İş Bankası" className="max-h-8" />
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
              <img src="/api/placeholder/120/40" alt="Kuveyt Türk" className="max-h-8" />
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
              <img src="/api/placeholder/120/40" alt="alBaraka" className="max-h-8" />
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
              <img src="/api/placeholder/120/40" alt="TEB" className="max-h-8" />
            </div>
            <div className="flex items-center justify-center p-4 border border-gray-200 rounded-lg">
              <img src="/api/placeholder/120/40" alt="Türkiye Finans" className="max-h-8" />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white text-center py-4 mt-8">
        <p className="text-sm">
          Copyright © 2025. Powered by{' '}
          <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold">
            K<span className="text-yellow-500">PLUS</span>
          </span>
        </p>
        
        {/* Scroll Up Button */}
        <button className="fixed bottom-4 right-4 bg-black text-white p-3 rounded-lg shadow-lg hover:bg-gray-800">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
          <span className="ml-2 text-sm">Scroll Up</span>
        </button>
      </footer>
    </div>
  );
}