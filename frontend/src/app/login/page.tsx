'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import { Suspense, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PasswordInput from '@/components/PasswordInput';

function LoginContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const [credentials, setCredentials] = useState({ username: '', password: '' });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (credentials.username && credentials.password) {
      document.cookie = `isLoggedIn=true; path=/; max-age=86400`;
      document.cookie = `userEmail=${credentials.username}; path=/; max-age=86400`;
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <main className="flex flex-col lg:flex-row flex-1">
        <div className="w-full lg:w-1/2 relative flex flex-col justify-center items-start px-4 sm:px-8 lg:px-16 py-8">
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
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  className="w-full bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 py-3 px-4 focus:outline-none focus:border-orange-500 transition-colors"
                  required
                />
              </div>

              <div>
                <PasswordInput
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  placeholder="Password"
                  autoComplete="current-password"
                  className="flex items-center gap-3"
                  inputClassName="flex-1 bg-transparent border border-gray-600 rounded-lg text-white placeholder-gray-500 py-3 px-4 focus:outline-none focus:border-orange-500 transition-colors"
                  buttonClassName="shrink-0 text-orange-500 hover:text-orange-400 text-sm font-semibold cursor-pointer"
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
        </div>

        <div className="hidden lg:flex w-full lg:w-1/2 items-center justify-center">
          <button
            type="button"
            onClick={() => router.push('/')}
            aria-label="Go to homepage"
            className="flex items-center justify-center w-full h-full p-8 lg:p-12 hover:opacity-90 transition-opacity"
          >
            <Image
              src="/logo.png"
              alt="True Travel Logo"
              width={320}
              height={320}
              className="object-contain w-[260px] h-[260px] lg:w-[360px] lg:h-[360px]"
              priority
            />
          </button>
        </div>
      </main>

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

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}

