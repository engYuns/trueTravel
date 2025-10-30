"use client";
// Original homepage content restored
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useEffect } from "react";

export default function Home() {
  const { language, setLanguage, t } = useLanguage();
  const [showScrollUp, setShowScrollUp] = useState(false);

  // Handle scroll to show/hide scroll up button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setShowScrollUp(scrollTop > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const openGoogleMaps = () => {
    // Open Google Maps with directions from current location to True Travel office
    const destination = "Gulan St Near Nazdar Bamarny Hospital Erbil, 44002, Iraq";
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-black text-white px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto">
          {/* Mobile Layout */}
          <div className="flex flex-col space-y-4 md:hidden">
            {/* Logo Row */}
            <div className="flex items-center justify-between">
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <Image
                  src="/logo.png"
                  alt="True Travel Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div>
                  <span className="text-blue-500 font-bold text-lg">truetravel</span>
                  <span className="text-white text-lg">.com</span>
                </div>
              </button>
              <select 
                className="bg-transparent text-white text-xs border border-gray-600 rounded px-2 py-1"
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'en' | 'ku')}
              >
                <option value="en" className="bg-black">🇺🇸 EN</option>
                <option value="ku" className="bg-black">🏳️ KU</option>
              </select>
            </div>
            
            {/* Navigation Row */}
            <div className="flex items-center justify-between text-sm">
              <a href={`tel:${t('contact.phone1')}`} className="text-orange-500 hover:text-orange-400 transition-colors">
                📞 {t('contact.phone1')}
              </a>
              <div className="flex items-center space-x-4">
                <a href="/login" className="text-blue-500 hover:text-blue-400 transition-colors">
                  {t('header.login')}
                </a>
                <a href="/dashboard" className="text-blue-500 hover:text-blue-400 transition-colors">{t('header.application')}</a>
              </div>
            </div>
            
            {/* Tagline */}
            <div className="text-xs text-gray-400 text-center">{t('header.tagline')}</div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between">
            <button 
              onClick={() => window.location.href = '/'}
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Image
                src="/logo.png"
                alt="True Travel Logo"
                width={50}
                height={50}
                className="object-contain"
              />
              <div>
                <span className="text-blue-500 font-bold text-xl">truetravel</span>
                <span className="text-white text-xl">.com</span>
                <div className="text-xs text-gray-400">{t('header.tagline')}</div>
              </div>
            </button>
            
            <div className="flex items-center space-x-6">
              <a href={`tel:${t('contact.phone1')}`} className="text-sm hover:text-orange-500 transition-colors cursor-pointer">
                {t('contact.phone1')}
              </a>
              <a href="/login" className="text-sm hover:text-blue-500 transition-colors">
                {t('header.login')}
              </a>
              <a href="/dashboard" className="text-sm hover:text-blue-500 transition-colors">{t('header.application')}</a>
              <div className="flex items-center space-x-2">
                <select 
                  className="bg-transparent text-white text-sm border border-gray-600 rounded px-2 py-1"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as 'en' | 'ku')}
                >
                  <option value="en" className="bg-black">🇺🇸 English</option>
                  <option value="ku" className="bg-black">🏳️ کوردی</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative min-h-screen">
        <div className="absolute inset-0">
          <Image
            src="/api/placeholder/1920/1080"
            alt="Beautiful mountain village with lake"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        
        <div className="relative z-10 flex items-center min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
            <div className={`max-w-2xl mx-auto lg:mx-0 text-center lg:${language === 'ku' ? 'text-right' : 'text-left'}`}>
              <h1 className={`text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 sm:mb-8 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('hero.title.marketplace')}
                <br />
                {t('hero.title.travel')} <span className="text-blue-500 italic">{t('hero.title.ever')}</span>
                <div className={`w-16 sm:w-20 h-1 bg-blue-500 mt-2 mx-auto lg:${language === 'ku' ? 'mr-auto ml-0' : 'ml-0 mr-auto'}`}></div>
              </h1>
              
              <div className="bg-blue-500 text-white py-4 sm:py-6 px-6 sm:px-8 rounded-lg inline-block max-w-full">
                <div className={`text-xl sm:text-2xl font-bold ${language === 'ku' ? 'font-arabic' : ''}`}>{t('hero.approved.title')}</div>
                <div className={`text-base sm:text-lg opacity-90 ${language === 'ku' ? 'font-arabic' : ''}`}>{t('hero.approved.subtitle')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </main>

      {/* Future Content Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        {/* Trust Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-12 sm:mb-20">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4 sm:mb-6 ${language === 'ku' ? 'font-arabic' : ''}`}>
            {t('trust.title')}
          </h2>
          <p className={`text-lg sm:text-xl text-orange-500 mb-3 sm:mb-4 ${language === 'ku' ? 'font-arabic' : ''}`}>
            {t('trust.subtitle')}
          </p>
          <p className={`text-base sm:text-lg text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
            {t('trust.description')}
          </p>
        </div>

        {/* Airline Partners */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-20">
          <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12 ${language === 'ku' ? 'font-arabic' : ''}`}>
            Airline <span className="text-blue-500">Partners</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-8 items-center opacity-60">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">AEGEAN</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-500">Air Europa</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600">AIR FRANCE</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-700">BRITISH AIRWAYS</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-500">Emirates</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-blue-600">flydubai</div>
            </div>
          </div>
        </div>

        {/* Services Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-20">
          <h3 className={`text-xl sm:text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12 ${language === 'ku' ? 'font-arabic' : ''}`}>
            Our <span className="text-blue-500">Services</span>
          </h3>
          {/* Mobile: Horizontal Scroll, Desktop: Grid */}
          <div className="block sm:hidden overflow-x-auto pb-4 -mx-4">
            <div className="flex space-x-4 px-4" style={{ minWidth: 'max-content' }}>
              {/* Flight Ticket */}
              <div className="text-center min-w-[200px] bg-white p-4 rounded-lg shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-blue-500 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </div>
                <h4 className={`text-lg font-bold text-gray-800 mb-2 ${language === 'ku' ? 'font-arabic' : ''}`}>
                  {t('services.flight.title')}
                </h4>
                <p className={`text-sm text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
                  {t('services.flight.description')}
                </p>
              </div>

              {/* Hotel */}
              <div className="text-center min-w-[200px] bg-white p-4 rounded-lg shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-blue-500 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                  </svg>
                </div>
                <h4 className={`text-lg font-bold text-gray-800 mb-2 ${language === 'ku' ? 'font-arabic' : ''}`}>
                  {t('services.hotel.title')}
                </h4>
                <p className={`text-sm text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
                  {t('services.hotel.description')}
                </p>
              </div>

              {/* Transfer */}
              <div className="text-center min-w-[200px] bg-white p-4 rounded-lg shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-blue-500 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                <h4 className={`text-lg font-bold text-gray-800 mb-2 ${language === 'ku' ? 'font-arabic' : ''}`}>
                  {t('services.transfer.title')}
                </h4>
                <p className={`text-sm text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
                  {t('services.transfer.description')}
                </p>
              </div>

              {/* Rent a Car */}
              <div className="text-center min-w-[200px] bg-white p-4 rounded-lg shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-blue-500 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                </div>
                <h4 className={`text-lg font-bold text-gray-800 mb-2 ${language === 'ku' ? 'font-arabic' : ''}`}>
                  {t('services.car.title')}
                </h4>
                <p className={`text-sm text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
                  {t('services.car.description')}
                </p>
              </div>

              {/* Tour */}
              <div className="text-center min-w-[200px] bg-white p-4 rounded-lg shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-blue-500 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className={`text-lg font-bold text-gray-800 mb-2 ${language === 'ku' ? 'font-arabic' : ''}`}>
                  {t('services.tour.title')}
                </h4>
                <p className={`text-sm text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
                  {t('services.tour.description')}
                </p>
              </div>

              {/* Visa */}
              <div className="text-center min-w-[200px] bg-white p-4 rounded-lg shadow-sm">
                <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center bg-blue-500 rounded-full">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className={`text-lg font-bold text-gray-800 mb-2 ${language === 'ku' ? 'font-arabic' : ''}`}>
                  {t('services.visa.title')}
                </h4>
                <p className={`text-sm text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
                  {t('services.visa.description')}
                </p>
              </div>
            </div>
          </div>
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Flight Ticket */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-500 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <h4 className={`text-xl font-bold text-gray-800 mb-3 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('services.flight.title')}
              </h4>
              <p className={`text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('services.flight.description')}
              </p>
            </div>

            {/* Hotel */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-500 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                </svg>
              </div>
              <h4 className={`text-xl font-bold text-gray-800 mb-3 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('services.hotel.title')}
              </h4>
              <p className={`text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('services.hotel.description')}
              </p>
            </div>

            {/* Transfer */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-500 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <h4 className={`text-xl font-bold text-gray-800 mb-3 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('services.transfer.title')}
              </h4>
              <p className={`text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('services.transfer.description')}
              </p>
            </div>

            {/* Rent a Car */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-500 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h4 className={`text-xl font-bold text-gray-800 mb-3 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('services.car.title')}
              </h4>
              <p className={`text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('services.car.description')}
              </p>
            </div>

            {/* Tour */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-500 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className={`text-xl font-bold text-gray-800 mb-3 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('services.tour.title')}
              </h4>
              <p className={`text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('services.tour.description')}
              </p>
            </div>

            {/* Visa */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center bg-blue-500 rounded-full">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h4 className={`text-xl font-bold text-gray-800 mb-3 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('services.visa.title')}
              </h4>
              <p className={`text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>
                {t('services.visa.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-12 sm:mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div className="p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center bg-blue-500 rounded-full">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500 mb-1 sm:mb-2">47</div>
              <div className={`text-sm sm:text-base text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>Country</div>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center bg-blue-500 rounded-full">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500 mb-1 sm:mb-2">21</div>
              <div className={`text-sm sm:text-base text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>GSA Office</div>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center bg-blue-500 rounded-full">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500 mb-1 sm:mb-2">5000+</div>
              <div className={`text-sm sm:text-base text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>Agency</div>
            </div>
            <div className="p-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center bg-blue-500 rounded-full">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                </svg>
              </div>
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-500 mb-1 sm:mb-2">12500+</div>
              <div className={`text-sm sm:text-base text-gray-600 ${language === 'ku' ? 'font-arabic' : ''}`}>User</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Image
                  src="/logo.png"
                  alt="True Travel Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <div>
                  <span className="text-orange-500 font-bold text-xl">truetravel</span>
                  <span className="text-white text-xl">.com</span>
                  <div className="text-xs text-gray-400">{t('header.tagline')}</div>
                </div>
              </div>
              <p className="text-gray-300 mb-4">
                {t('company.about')}
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                  <span className="text-white text-lg">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                  <span className="text-white text-lg">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                  <span className="text-white text-lg">in</span>
                </div>
              </div>
            </div>

            {/* Pages */}
            <div>
              <h4 className="text-lg font-bold mb-4">PAGES</h4>
              <ul className="space-y-2">
                <li><a href="/" className="text-gray-300 hover:text-blue-500">▶ Homepage</a></li>
                <li><a href="#" className="text-gray-300 hover:text-blue-500">▶ Contact</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-bold mb-4">CONTACT</h4>
              <div className="space-y-3">
                <a 
                  href={`tel:${t('contact.phone1')}`} 
                  className="text-gray-300 hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  {t('contact.phone1')}
                </a>
                <a 
                  href={`tel:${t('contact.phone2')}`} 
                  className="text-gray-300 hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  {t('contact.phone2')}
                </a>
                <a 
                  href={`tel:${t('contact.phone3')}`} 
                  className="text-gray-300 hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  {t('contact.phone3')}
                </a>
                <button 
                  onClick={openGoogleMaps}
                  className="text-gray-300 hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-3 text-left"
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Gulan St Near Nazdar Bamarny Hospital Erbil, 44002, Iraq
                </button>
                <a 
                  href={`mailto:${t('contact.email')}`} 
                  className="text-gray-300 hover:text-blue-500 transition-colors cursor-pointer flex items-center gap-3"
                >
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  {t('contact.email')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Scroll Up Button */}
      {showScrollUp && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}