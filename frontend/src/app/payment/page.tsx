'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import HeaderUserMenu from '@/components/HeaderUserMenu';

type PaymentData = {
  bookingData: any;
  paymentMethod?: string;
  commission?: string;
  couponCode?: string;
  reservationNote?: string;
  companyReference?: string;
  createdAt?: number;
};

export default function PaymentPage() {
  const router = useRouter();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('paymentData');
    if (stored) {
      try {
        setPaymentData(JSON.parse(stored));
        return;
      } catch {
        // fall through
      }
    }

    const bookingStored = localStorage.getItem('bookingData');
    if (bookingStored) {
      try {
        setPaymentData({ bookingData: JSON.parse(bookingStored) });
        return;
      } catch {
        // fall through
      }
    }

    router.push('/flightResult');
  }, [router]);

  const summary = useMemo(() => {
    const booking = paymentData?.bookingData;
    const outbound = booking?.outbound;
    const returnFlight = booking?.return;

    const outboundFrom = outbound?.departure?.airport || '—';
    const outboundTo = outbound?.arrival?.airport || '—';
    const outboundPrice = Number(outbound?.price ?? 0);

    const returnFrom = returnFlight?.departure?.airport || '—';
    const returnTo = returnFlight?.arrival?.airport || '—';
    const returnPrice = Number(returnFlight?.price ?? 0);

    const total = Number(booking?.total ?? outboundPrice + returnPrice);

    return {
      outboundFrom,
      outboundTo,
      outboundPrice,
      returnFrom,
      returnTo,
      returnPrice,
      hasReturn: Boolean(returnFlight),
      total,
    };
  }, [paymentData]);

  const handleLogout = () => {
    document.cookie = 'isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  if (!paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer">
              <Image src="/logo.png" alt="True Travel Logo" width={50} height={50} className="object-contain" />
              <h1 className="text-2xl font-bold text-gray-800">TRUE TRAVEL</h1>
            </a>
            <HeaderUserMenu onLogout={handleLogout} />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="bg-white rounded-lg shadow-sm p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Payment</h2>
              <p className="text-sm text-gray-600">UI-only payment step (no backend yet)</p>
            </div>
            <button
              onClick={() => router.push('/booking')}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold"
            >
              Back to Booking
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 border rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-3">Trip Summary</h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    <div className="font-semibold text-gray-900">Outbound</div>
                    <div>{summary.outboundFrom} → {summary.outboundTo}</div>
                  </div>
                  <div className="font-bold text-gray-900">${summary.outboundPrice.toFixed(2)}</div>
                </div>

                {summary.hasReturn && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      <div className="font-semibold text-gray-900">Return</div>
                      <div>{summary.returnFrom} → {summary.returnTo}</div>
                    </div>
                    <div className="font-bold text-gray-900">${summary.returnPrice.toFixed(2)}</div>
                  </div>
                )}

                <div className="border-t pt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-2xl font-extrabold text-green-600">${summary.total.toFixed(2)}</div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                Payment method: <span className="font-semibold text-gray-700">{paymentData.paymentMethod || '—'}</span>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-gray-900 mb-3">Pay</h3>

              {!isPaid ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    This button only simulates payment. It does not call any backend.
                  </p>
                  <button
                    onClick={() => setIsPaid(true)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold"
                  >
                    Confirm Payment (UI)
                  </button>
                </>
              ) : (
                <>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="font-bold text-green-800">Payment successful</div>
                    <div className="text-sm text-green-700">(UI-only confirmation)</div>
                  </div>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full mt-4 bg-gray-900 hover:bg-black text-white py-3 rounded-lg font-bold"
                  >
                    Go to Dashboard
                  </button>
                </>
              )}
            </div>
          </div>
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
