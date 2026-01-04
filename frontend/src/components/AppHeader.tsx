'use client';

import Image from 'next/image';

import HeaderUserMenu from './HeaderUserMenu';

type AppHeaderProps = {
  onLogout: () => void;
};

export default function AppHeader({ onLogout }: AppHeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
            <Image src="/logo.png" alt="True Travel Logo" width={50} height={50} className="object-contain" />
            <h1 className="text-2xl font-bold text-gray-800">TRUE TRAVEL</h1>
          </a>
          <HeaderUserMenu onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
}
