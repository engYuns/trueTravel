'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const selectedCountry = searchParams.get('country') || 'TR';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - in real app, this would be API call
    if (credentials.username && credentials.password) {
      // Set cookie for authentication (in real app, this would be JWT token)
      document.cookie = `isLoggedIn=true; path=/; max-age=86400`; // 24 hours
      document.cookie = `userEmail=${credentials.username}; path=/; max-age=86400`;
      document.cookie = `selectedCountry=${selectedCountry}; path=/; max-age=86400`;
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left Panel - Login Form */}
      <div className="w-1/2 flex flex-col justify-center items-start px-16 py-8">
        {/* Header */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-end text-white">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 bg-gray-800 px-3 py-1 rounded">
              {selectedCountry === 'TR' && <span>🇹🇷</span>}
              {selectedCountry === 'IR' && <span>🇮🇷</span>}
              {selectedCountry === 'IQ' && <span>🇮🇶</span>}
              {selectedCountry === 'LY' && <span>🇱🇾</span>}
              {selectedCountry === 'AE' && <span>🇦🇪</span>}
              <span className="text-white text-sm">{selectedCountry}</span>
            </div>
            <img src="/api/placeholder/24/18" alt="UK Flag" className="w-6 h-4" />
            <span className="text-white">E</span>
          </div>
        </div>

        {/* Logo */}
        <div className="mb-8">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mb-2">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 8c0-.6-.4-1-1-1h-3V6c0-.6-.4-1-1-1s-1 .4-1 1v1H9V6c0-.6-.4-1-1-1s-1 .4-1 1v1H4c-.6 0-1 .4-1 1s.4 1 1 1h1v8c0 1.7 1.3 3 3 3h8c1.7 0 3-1.3 3-3V9h1c.6 0 1-.4 1-1zM8 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
          </div>
          <span className="text-blue-500 font-bold text-lg">truetravel</span>
          <span className="text-white text-lg">.com</span>
          <div className="text-xs text-gray-400 mt-1">{t('header.tagline')}</div>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md">
          <h1 className="text-white text-2xl font-light mb-2">Log-in</h1>
          <p className="text-gray-400 text-sm mb-8">
            Please use your user name and password to log-in
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <input
                type="text"
                placeholder="User Name"
                value={credentials.username}
                onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-500 py-3 px-0 focus:outline-none focus:border-orange-500 transition-colors"
                required
              />
            </div>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full bg-transparent border-b border-gray-600 text-white placeholder-gray-500 py-3 px-0 focus:outline-none focus:border-orange-500 transition-colors"
                required
              />
            </div>

            <div className="flex items-center justify-between mt-8">
              <a href="#" className="text-orange-500 hover:text-orange-400 text-sm">
                Forgot Password ?
              </a>
              <button
                type="submit"
                className="bg-white text-black px-8 py-3 rounded hover:bg-gray-100 transition-colors font-medium"
              >
                Log-in
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Logo */}
        <div className="absolute bottom-8 left-16">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 8c0-.6-.4-1-1-1h-3V6c0-.6-.4-1-1-1s-1 .4-1 1v1H9V6c0-.6-.4-1-1-1s-1 .4-1 1v1H4c-.6 0-1 .4-1 1s.4 1 1 1h1v8c0 1.7 1.3 3 3 3h8c1.7 0 3-1.3 3-3V9h1c.6 0 1-.4 1-1zM8 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
          </div>
          <span className="text-blue-500 font-bold text-sm">truetravel</span>
          <span className="text-white text-sm">.com</span>
        </div>
      </div>

      {/* Right Panel - Dubai Promotion */}
      <div className="w-1/2 relative">
        <div className="h-full relative bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600">
          {/* Beach Scene Background */}
          <div className="absolute inset-0 opacity-30">
            <div className="h-full w-full bg-gradient-to-b from-cyan-300 to-blue-600"></div>
            <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-yellow-200 via-yellow-100 to-transparent"></div>
          </div>
          
          {/* Burj Al Arab Silhouette */}
          <div className="absolute bottom-1/4 right-1/4 w-20 h-32 opacity-40">
            <div className="w-full h-full bg-white rounded-t-full relative">
              <div className="absolute top-0 left-1/2 w-1 h-8 bg-white transform -translate-x-1/2 -translate-y-2"></div>
            </div>
          </div>
          
          {/* Content */}
          <div className="relative h-full flex flex-col justify-center items-center text-white p-12">
            {/* True Travel Logo */}
            <div className="absolute top-8 right-8">
              <div className="text-white font-bold text-2xl tracking-wider">
                TRUE<span className="text-yellow-300">TRAVEL</span>
              </div>
            </div>

            {/* Main Content */}
            <div className="text-center z-10">
              <h1 className="text-6xl font-bold mb-6 leading-tight drop-shadow-lg">
                DISCOVER<br />
                <span className="text-yellow-300">KURDISTAN</span>
              </h1>
              
              <p className="text-xl mb-8 text-blue-100">
                Your Gateway to Kurdistan Tourism
              </p>
              
              <div className="mt-12">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-2xl">
                  BOOK NOW
                </button>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 left-8 w-16 h-16 bg-white/10 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-16 w-12 h-12 bg-yellow-300/20 rounded-full animate-bounce"></div>
            <div className="absolute bottom-1/3 left-1/4 w-8 h-8 bg-white/15 rounded-full"></div>

            {/* People Silhouettes */}
            <div className="absolute bottom-1/4 left-16 flex space-x-4 opacity-60">
              <div className="w-6 h-12 bg-white/80 rounded-full"></div>
              <div className="w-5 h-10 bg-white/70 rounded-full mt-2"></div>
              <div className="w-4 h-8 bg-white/60 rounded-full mt-4"></div>
            </div>

            {/* Bottom Text */}
            <div className="absolute bottom-8 left-8 text-sm text-white/90 font-medium">
              TERMS AND CONDITIONS APPLY
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 bg-black text-center py-4">
        <p className="text-gray-400 text-sm">
          Copyright © 2025. Powered by{' '}
          <span className="bg-yellow-500 text-black px-2 py-1 rounded font-bold">
            K<span className="text-yellow-500 bg-black px-1">PLUS</span>
          </span>
        </p>
      </div>
    </div>
  );
}

export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}