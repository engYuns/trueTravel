'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Country {
  code: string;
  name: string;
  flag: string;
}

const countries: Country[] = [
  { code: 'TR', name: 'Turkey, TR', flag: '🇹🇷' },
  { code: 'IR', name: 'Iran (Islamic Republic of), IR', flag: '🇮🇷' },
  { code: 'IQ', name: 'Iraq, IQ', flag: '🇮🇶' },
  { code: 'LY', name: 'Libya, LY', flag: '🇱🇾' },
  { code: 'AE', name: 'United Arab Emirates, AE', flag: '🇦🇪' },
  { code: 'SA', name: 'Saudi Arabia, SA', flag: '🇸🇦' },
  { code: 'EG', name: 'Egypt, EG', flag: '🇪🇬' },
  { code: 'JO', name: 'Jordan, JO', flag: '🇯🇴' },
  { code: 'LB', name: 'Lebanon, LB', flag: '🇱🇧' },
  { code: 'SY', name: 'Syria, SY', flag: '🇸🇾' },
  { code: 'KW', name: 'Kuwait, KW', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar, QA', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain, BH', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman, OM', flag: '🇴🇲' },
  { code: 'YE', name: 'Yemen, YE', flag: '🇾🇪' },
];

interface CountrySelectProps {
  onCountrySelect: (country: Country) => void;
  children: React.ReactNode;
}

export default function CountrySelector({ onCountrySelect, children }: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCountryClick = (country: Country) => {
    onCountrySelect(country);
    setIsOpen(false);
    setSearchTerm('');
    // Redirect to login page with country parameter
    router.push(`/login?country=${country.code}`);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-sm hover:text-blue-500 transition-colors cursor-pointer flex items-center space-x-1"
      >
        {children}
        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-hidden">
          {/* Search Input */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <input
                type="text"
                placeholder="Select"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Countries List */}
          <div className="bg-gray-100 p-2">
            <div className="text-sm text-gray-600 font-medium mb-2">Select</div>
            <div className="max-h-64 overflow-y-auto bg-white rounded border border-gray-200">
              {filteredCountries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountryClick(country)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 flex items-center space-x-3"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-gray-800">{country.name}</span>
                </button>
              ))}
              {filteredCountries.length === 0 && (
                <div className="px-3 py-4 text-gray-500 text-center">
                  No countries found
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}