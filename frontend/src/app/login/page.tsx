'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { useState, Suspense, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

function LoginContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [showScrollUp, setShowScrollUp] = useState(false);

  // Scroll up button visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollUp(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation - in real app, this would be API call
    if (credentials.username && credentials.password) {
      // Set cookie for authentication (in real app, this would be JWT token)
      document.cookie = `isLoggedIn=true; path=/; max-age=86400`; // 24 hours
      document.cookie = `userEmail=${credentials.username}; path=/; max-age=86400`;
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col lg:flex-row">
      {/* Left Panel - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-start px-4 sm:px-8 lg:px-16 py-8 order-2 lg:order-1">
        {/* Header */}
        <div className="lg:absolute top-4 left-4 right-4 flex items-center justify-between lg:justify-end text-white mb-6 lg:mb-0">
          <button 
            onClick={() => router.push('/')}
            className="lg:hidden flex items-center space-x-2 hover:opacity-80 transition-opacity cursor-pointer"
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
        </div>

        {/* Logo - Hidden on Mobile (shown in header) */}
        <button 
          onClick={() => router.push('/')}
          className="mb-6 sm:mb-8 hidden lg:block hover:opacity-80 transition-opacity cursor-pointer text-left"
        >
          <Image
            src="/logo.png"
            alt="True Travel Logo"
            width={60}
            height={60}
            className="object-contain mb-2"
          />
          <span className="text-blue-500 font-bold text-lg">truetravel</span>
          <span className="text-white text-lg">.com</span>
          <div className="text-xs text-gray-400 mt-1">{t('header.tagline')}</div>
        </button>

        {/* Login Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          <h1 className="text-white text-xl sm:text-2xl font-light mb-2 text-center lg:text-left">Log-in</h1>
          <p className="text-gray-400 text-sm mb-6 sm:mb-8 text-center lg:text-left">
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

            <div className="flex flex-col sm:flex-row items-center justify-between mt-8 space-y-4 sm:space-y-0">
              <a href="#" className="text-orange-500 hover:text-orange-400 text-sm order-2 sm:order-1">
                Forgot Password ?
              </a>
              <button
                type="submit"
                className="bg-white text-black px-6 sm:px-8 py-3 rounded hover:bg-gray-100 transition-colors font-medium w-full sm:w-auto order-1 sm:order-2"
              >
                Log-in
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Logo */}
        <button 
          onClick={() => router.push('/')}
          className="hidden lg:block absolute bottom-8 left-4 sm:left-8 lg:left-16 hover:opacity-80 transition-opacity cursor-pointer text-left"
        >
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mb-2">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 8c0-.6-.4-1-1-1h-3V6c0-.6-.4-1-1-1s-1 .4-1 1v1H9V6c0-.6-.4-1-1-1s-1 .4-1 1v1H4c-.6 0-1 .4-1 1s.4 1 1 1h1v8c0 1.7 1.3 3 3 3h8c1.7 0 3-1.3 3-3V9h1c.6 0 1-.4 1-1zM8 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm8 0c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
            </svg>
          </div>
          <span className="text-blue-500 font-bold text-sm">truetravel</span>
          <span className="text-white text-sm">.com</span>
        </button>
      </div>

      {/* Right Panel - Dubai Promotion (Hidden on Mobile) */}
      <div className="hidden lg:block w-full lg:w-1/2 relative order-1 lg:order-2">
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
          <div className="relative h-full flex flex-col justify-center items-center text-white p-6 sm:p-8 lg:p-12">
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
            Y
          </span>
        </p>
      </div>

      {/* Scroll Up Button */}
      {showScrollUp && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 w-12 h-12 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300 z-50 flex items-center justify-center"
          aria-label="Scroll to top"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
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

