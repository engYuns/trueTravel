'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import HeaderUserMenu from '@/components/HeaderUserMenu';
import PasswordInput from '@/components/PasswordInput';
import { useLanguage } from '@/contexts/LanguageContext';

type TwoFactorMethod = 'None' | 'E-mail' | 'Sms' | 'GoogleAuthenticator';

type ProfileData = {
  title: 'Mr' | 'Ms' | 'Mrs';
  firstName: string;
  lastName: string;
  gender: 'Mr' | 'Ms' | 'Mrs';
  birthDate: string;
  userName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  language: 'en' | 'ku';
  currency: 'USD' | 'IQD' | 'EUR';
  twoFactor: TwoFactorMethod;
  twoFactorSecret: string;
  avatarDataUrl?: string;
};

const STORAGE_KEY = 'ttUserProfile';

function getCookieValue(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const parts = document.cookie.split(';').map(p => p.trim());
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) return decodeURIComponent(part.slice(name.length + 1));
  }
  return null;
}

function isLoggedInCookie(): boolean {
  const v = getCookieValue('isLoggedIn');
  return v === 'true' || v === '1';
}

function base32Secret(length = 24): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let out = '';
  for (let i = 0; i < length; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

function titleCaseFromIdentifier(value: string): string {
  const cleaned = value
    .trim()
    .replace(/[_\.\-]+/g, ' ')
    .replace(/\s+/g, ' ');
  if (!cleaned) return '';
  return cleaned
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');
}

export default function ProfilePage() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();

  const [activeTab, setActiveTab] = useState<'general' | 'password'>('general');
  const [isSaving, setIsSaving] = useState(false);

  const defaultProfile: ProfileData = useMemo(() => ({
    title: 'Mr',
    firstName: 'User',
    lastName: '',
    gender: 'Mr',
    birthDate: '',
    userName: 'user',
    email: '',
    phoneCountryCode: '+964',
    phoneNumber: '',
    language,
    currency: 'USD',
    twoFactor: 'None',
    twoFactorSecret: '',
    avatarDataUrl: undefined,
  }), [language]);

  const [profile, setProfile] = useState<ProfileData>(() => defaultProfile);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!isLoggedInCookie()) {
      router.push('/login');
      return;
    }

    // Hydrate from storage first.
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<ProfileData>;
        setProfile(prev => ({
          ...prev,
          ...parsed,
          language: (parsed.language ?? prev.language) as 'en' | 'ku',
        }));

        if (parsed.language === 'en' || parsed.language === 'ku') {
          setLanguage(parsed.language);
        }
      } catch {
        // ignore
      }
    }

    // Then overlay cookie-based identity (demo auth).
    const email = getCookieValue('userEmail') || '';
    const userName = email ? (email.split('@')[0] || email) : '';
    setProfile(prev => {
      const next: ProfileData = {
        ...prev,
        email: prev.email || email,
        userName: prev.userName !== 'user' ? prev.userName : (userName || prev.userName),
        firstName: prev.firstName !== 'User' ? prev.firstName : (titleCaseFromIdentifier(userName) || prev.firstName),
      };
      if (!next.twoFactorSecret) next.twoFactorSecret = base32Secret(28);
      return next;
    });
  }, [router, setLanguage]);

  const handleLogout = () => {
    document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || 'User';

  const languageLabel = useMemo(() => {
    const langText = profile.language === 'ku' ? 'Kurdish' : 'English';
    return `${langText} (${profile.currency})`;
  }, [profile.currency, profile.language]);

  const handleSaveGeneral = async () => {
    setIsSaving(true);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
      setLanguage(profile.language);
    } finally {
      setTimeout(() => setIsSaving(false), 400);
    }
  };

  const handleAvatarChange = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : undefined;
      setProfile(prev => ({ ...prev, avatarDataUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRefresh2FA = () => {
    setProfile(prev => ({ ...prev, twoFactorSecret: base32Secret(28) }));
  };

  const show2FASetup = profile.twoFactor === 'GoogleAuthenticator';

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <Image src="/logo.png" alt="True Travel Logo" width={50} height={50} className="object-contain" />
              <h1 className="text-2xl font-bold text-gray-800">TRUE TRAVEL</h1>
            </a>
            <HeaderUserMenu
              onLogout={handleLogout}
              userName={fullName}
              languageLabel={languageLabel}
              initials={(profile.firstName?.[0] ?? 'U').toUpperCase() + (profile.lastName?.[0] ?? '').toUpperCase()}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <div className="mt-1 text-sm text-gray-500">
            <a href="/dashboard" className="text-blue-600 hover:text-blue-500">Dashboard</a>
            <span className="mx-2">»</span>
            <span>My Profile</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {profile.avatarDataUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={profile.avatarDataUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <svg className="w-24 h-24 text-gray-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                )}
              </div>
              <div className="mt-4">
                <div className="text-xl font-bold text-gray-800">{fullName}</div>
                <div className="text-sm text-blue-600 font-semibold mt-1">{profile.title.toUpperCase()}</div>
              </div>
            </div>

            <div className="border-t border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                  activeTab === 'general' ? 'bg-gray-50 text-orange-500 border-l-4 border-blue-500' : 'text-orange-500 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <span className="text-lg">General</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center gap-3 px-6 py-4 text-left transition-colors ${
                  activeTab === 'password' ? 'bg-gray-50 text-orange-500 border-l-4 border-blue-500' : 'text-orange-500 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 17a2 2 0 100-4 2 2 0 000 4zm6-7h-1V8a5 5 0 00-10 0v2H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2zm-3 0H9V8a3 3 0 016 0v2z" />
                </svg>
                <span className="text-lg">Password</span>
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-blue-600 tracking-wide">MY PROFILE</h3>
              <div>
                <label className="inline-flex items-center justify-center border border-blue-400 text-blue-600 px-5 py-2 rounded-md cursor-pointer hover:bg-gray-50 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAvatarChange(e.target.files?.[0] ?? null)}
                  />
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2zM8.5 13.5l2.5 3 3.5-4.5 4.5 6H6l2.5-4.5zM8 9a2 2 0 114 0 2 2 0 01-4 0z" />
                  </svg>
                </label>
              </div>
            </div>

            {activeTab === 'general' ? (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-orange-500 mb-2">Title</label>
                    <select
                      value={profile.title}
                      onChange={(e) => setProfile(prev => ({ ...prev, title: e.target.value as ProfileData['title'] }))}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Mr">Mr</option>
                      <option value="Ms">Ms</option>
                      <option value="Mrs">Mrs</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-500 mb-2">Name</label>
                    <input
                      value={profile.firstName}
                      onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="First name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-500 mb-2">Last Name</label>
                    <input
                      value={profile.lastName}
                      onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Last name"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-orange-500 mb-2">Gender</label>
                      <select
                        value={profile.gender}
                        onChange={(e) => setProfile(prev => ({ ...prev, gender: e.target.value as ProfileData['gender'] }))}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="Mr">Mr</option>
                        <option value="Ms">Ms</option>
                        <option value="Mrs">Mrs</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-orange-500 mb-2">Birth Date</label>
                      <input
                        type="date"
                        value={profile.birthDate}
                        onChange={(e) => setProfile(prev => ({ ...prev, birthDate: e.target.value }))}
                        className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-500 mb-2">User Name</label>
                    <input
                      value={profile.userName}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-4 py-3 bg-gray-50 text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-500 mb-2">E-mail</label>
                    <input
                      value={profile.email}
                      readOnly
                      className="w-full border border-gray-300 rounded-md px-4 py-3 bg-gray-50 text-gray-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-500 mb-2">Phone</label>
                    <div className="flex">
                      <select
                        value={profile.phoneCountryCode}
                        onChange={(e) => setProfile(prev => ({ ...prev, phoneCountryCode: e.target.value }))}
                        className="border border-gray-300 rounded-l-md px-3 py-3 bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="+964">+964</option>
                        <option value="+90">+90</option>
                        <option value="+971">+971</option>
                        <option value="+974">+974</option>
                      </select>
                      <input
                        value={profile.phoneNumber}
                        onChange={(e) => setProfile(prev => ({ ...prev, phoneNumber: e.target.value }))}
                        className="flex-1 border border-gray-300 rounded-r-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-500 mb-2">Language</label>
                    <select
                      value={profile.language}
                      onChange={(e) => setProfile(prev => ({ ...prev, language: e.target.value as 'en' | 'ku' }))}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="en">English</option>
                      <option value="ku">Kurdish</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-500 mb-2">Currency</label>
                    <select
                      value={profile.currency}
                      onChange={(e) => setProfile(prev => ({ ...prev, currency: e.target.value as ProfileData['currency'] }))}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD</option>
                      <option value="IQD">IQD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="text-sm font-semibold text-orange-500 mb-2">Two Factor Authentication</div>
                  <select
                    value={profile.twoFactor}
                    onChange={(e) => setProfile(prev => ({ ...prev, twoFactor: e.target.value as TwoFactorMethod }))}
                    className="w-full md:w-80 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="None">None</option>
                    <option value="E-mail">E-mail</option>
                    <option value="Sms">Sms</option>
                    <option value="GoogleAuthenticator">GoogleAuthenticator</option>
                  </select>

                  {show2FASetup && (
                    <div className="mt-5">
                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M11 17h2v-2h-2v2zm0-4h2V7h-2v6zm1-11C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                          </svg>
                          Info
                        </button>
                        <button
                          type="button"
                          onClick={handleRefresh2FA}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-semibold"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M17.65 6.35A7.95 7.95 0 0012 4V1L7 6l5 5V7c2.76 0 5 2.24 5 5a5 5 0 01-8.66 3.54l-1.42 1.42A7 7 0 0019 12c0-1.93-.78-3.68-2.05-4.95z" />
                          </svg>
                          Refresh
                        </button>
                        <div className="text-sm text-gray-800 font-semibold">
                          Secret Key: <span className="font-mono">{profile.twoFactorSecret}</span>
                        </div>
                      </div>

                      <div className="mt-4 flex items-start gap-6">
                        <div className="w-40 h-40 bg-gray-100 border border-gray-200 rounded-md flex items-center justify-center">
                          <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm10-2h2v2h-2v-2zm2 2h2v2h-2v-2zm-2 2h2v2h-2v-2zm4 0h2v4h-4v-2h2v-2z" />
                          </svg>
                        </div>
                        <div className="text-sm text-gray-600 max-w-md">
                          Use your authenticator app to scan the QR and enter the generated code.
                          <div className="text-xs text-gray-500 mt-1">(UI-only setup; no backend binding yet)</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveGeneral}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white px-6 py-3 rounded-md font-semibold"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17l-3.88-3.88L3.71 13.7 9 19l12-12-1.41-1.41z" />
                    </svg>
                    Update
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-orange-500 mb-2">Current Password</label>
                    <PasswordInput
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      className="flex items-center gap-3"
                      inputClassName="flex-1 w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      buttonClassName="shrink-0 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-md font-semibold cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-500 mb-2">New Password</label>
                    <PasswordInput
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="flex items-center gap-3"
                      inputClassName="flex-1 w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      buttonClassName="shrink-0 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-md font-semibold cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-orange-500 mb-2">Confirm Password</label>
                    <PasswordInput
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      className="flex items-center gap-3"
                      inputClassName="flex-1 w-full border border-gray-300 rounded-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      buttonClassName="shrink-0 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-md font-semibold cursor-pointer"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      // UI-only password change
                      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                    }}
                    className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md font-semibold"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M9 16.17l-3.88-3.88L3.71 13.7 9 19l12-12-1.41-1.41z" />
                    </svg>
                    Update
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
