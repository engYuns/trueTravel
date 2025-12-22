'use client';

import { useEffect, useRef, useState } from 'react';

type HeaderUserMenuProps = {
  onLogout: () => void;
  notificationCount?: number;
  phone?: string;
  initials?: string;
  userName?: string;
  languageLabel?: string;
};

export default function HeaderUserMenu({
  onLogout,
  notificationCount = 9,
  phone = '+964 750 328 2768',
  initials = 'YP',
  userName = 'Younis Pshtiwan',
  languageLabel = '🇬🇧 English (USD)',
}: HeaderUserMenuProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notificationsRef = useRef<HTMLDivElement | null>(null);
  const profileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleDocumentMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;

      if (notificationsRef.current && !notificationsRef.current.contains(target)) {
        setShowNotifications(false);
      }

      if (profileMenuRef.current && !profileMenuRef.current.contains(target)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
  }, []);

  return (
    <div className="flex items-center space-x-6">
      {/* User Information */}
      <div className="flex items-center space-x-4 border-r border-gray-300 pr-6">
        <div className="flex items-center space-x-2">
          <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
          <span className="text-sm text-gray-600 font-medium">{phone}</span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="relative" ref={notificationsRef}>
              <button
                type="button"
                onClick={() => {
                  setShowNotifications(v => !v);
                  setShowProfileMenu(false);
                }}
                className="relative w-8 h-8 flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors"
                aria-label="Notifications"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5S10.5 3.17 10.5 4v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notificationCount}
                </span>
              </button>

              {showNotifications && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-[999999]">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-800">Notifications</p>
                  </div>
                  <div className="px-4 py-4 text-sm text-gray-500">No notifications</div>
                </div>
              )}
            </div>

            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">{initials}</span>
            </div>
          </div>

          <div className="text-sm">
            <p className="font-medium text-gray-800">{userName}</p>
            <p className="text-xs text-gray-500">{languageLabel}</p>
          </div>
        </div>
      </div>

      {/* Profile */}
      <div className="flex items-center space-x-4">
        <div className="relative" ref={profileMenuRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(v => !v);
              setShowNotifications(false);
            }}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            aria-label="Profile"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 top-full mt-2 w-44 bg-white rounded-lg shadow-lg border border-gray-200 z-[999999] overflow-hidden">
              <button
                type="button"
                onClick={onLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
