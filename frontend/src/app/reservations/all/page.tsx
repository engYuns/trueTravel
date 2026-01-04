'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import TopNav from '@/components/TopNav';
import { copyTableToClipboard, exportTableToExcel, exportTableToPdf, printTable } from '@/lib/tableExport';

export default function ReservationsAllPage() {
  const router = useRouter();

  // UI State

  // Search Criteria State
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState('Transaction time');
  const [transactionType, setTransactionType] = useState('All selected (10)');
  const [serviceType, setServiceType] = useState('All selected (11)');
  const [paymentType, setPaymentType] = useState('All');
  const [reservationNumber, setReservationNumber] = useState('');
  const [guest, setGuest] = useState('');
  const [company, setCompany] = useState('All');
  const [user, setUser] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Table Data (empty, as in screenshot)
  const [reservations] = useState<any[]>([]);
  const totalRecords = reservations.length;

  const handleLogout = () => {
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
  };

  const handleSearch = () => {
    console.log('Searching all reservations with criteria:', {
      dateFrom,
      dateTo,
      sort,
      transactionType,
      serviceType,
      paymentType,
      reservationNumber,
      guest,
      company,
      user,
      currentPage,
      itemsPerPage,
    });
  };

  const handleExport = async (type: 'copy' | 'excel' | 'pdf' | 'print') => {
    const data = reservations.map((r) => ({ ...r } as unknown as Record<string, unknown>));

    if (type === 'print') {
      printTable('#export-table', 'Reservations - All');
      return;
    }
    if (type === 'copy') {
      await copyTableToClipboard(data);
      return;
    }
    if (type === 'excel') {
      await exportTableToExcel('reservations-all.xlsx', data);
      return;
    }
    await exportTableToPdf('reservations-all.pdf', 'Reservations - All', data);
  };

  const CalendarIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader onLogout={handleLogout} />
      <TopNav />

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Page Title + Breadcrumb */}
        <div className="mb-6">
          <h2 className="text-3xl font-light text-gray-800">All Reservations</h2>
          <div className="mt-2 text-sm text-gray-500">
            <a href="/dashboard" className="text-blue-600 hover:underline">
              Homepage
            </a>{' '}
            <span className="mx-2">»</span>
            <span className="text-gray-400">All Reservations</span>
          </div>
        </div>

        {/* Searching Criterias */}
        <div className="bg-white border border-orange-500 rounded-sm overflow-hidden mb-6">
          <div className="bg-orange-500 text-white px-5 py-3">
            <h3 className="text-xl font-medium">Searching Criterias</h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
              {/* Date Range */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-orange-500 mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">{CalendarIcon()}</div>
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => setDateFrom(e.target.value)}
                      className="w-full pl-11 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">{CalendarIcon()}</div>
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => setDateTo(e.target.value)}
                      className="w-full pl-11 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="Transaction time">Transaction time</option>
                  <option value="Service Date">Service Date</option>
                </select>
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Transaction Type</label>
                <select
                  value={transactionType}
                  onChange={(e) => setTransactionType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="All selected (10)">All selected (10)</option>
                  <option value="Reservation">Reservation</option>
                  <option value="Cancel">Cancel</option>
                  <option value="Refund">Refund</option>
                </select>
              </div>

              {/* Service Type */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Service Type</label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="All selected (11)">All selected (11)</option>
                  <option value="Flight Ticket">Flight Ticket</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Transfer">Transfer</option>
                  <option value="Rent a Car">Rent a Car</option>
                </select>
              </div>

              {/* Payment Type */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Payment Type</label>
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="Current">Current</option>
                  <option value="Credit Card">Credit Card</option>
                </select>
              </div>

              {/* Reservation Number */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-orange-500 mb-2">Reservation Number</label>
                <input
                  type="text"
                  value={reservationNumber}
                  onChange={(e) => setReservationNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Guest */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Guest</label>
                <input
                  type="text"
                  value={guest}
                  onChange={(e) => setGuest(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Company</label>
                <select
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="All">All</option>
                  <option value="True Travel">True Travel</option>
                </select>
              </div>

              {/* User */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">User</label>
                <div className="relative">
                  <input
                    type="text"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <button
                type="button"
                onClick={handleSearch}
                className="px-8 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Actions + Pagination */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-3">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 5h18v2H3V5zm0 6h18v2H3v-2zm0 6h18v2H3v-2z" />
              </svg>
              <span>COLUMN VISIBILITY</span>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>

            <button
              type="button"
              onClick={() => void handleExport('copy')}
              className="px-4 py-2 border border-teal-400 rounded-md bg-white text-teal-600 hover:bg-teal-50 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm4 4H8c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 18H8V7h12v16z" />
              </svg>
              <span>COPY</span>
            </button>

            <button
              type="button"
              onClick={() => void handleExport('excel')}
              className="px-4 py-2 border border-yellow-400 rounded-md bg-white text-yellow-600 hover:bg-yellow-50 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 14H9v-2h2v2zm0-4H9V7h2v6zm6 4h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2z" />
              </svg>
              <span>EXCEL</span>
            </button>

            <button
              type="button"
              onClick={() => void handleExport('pdf')}
              className="px-4 py-2 border border-purple-400 rounded-md bg-white text-purple-600 hover:bg-purple-50 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-2.83.48-5.53-.3-7.58-2.05l1.43-1.43A7.93 7.93 0 0013 19.93zm0-3.06c-1.7-.45-3.2-1.37-4.36-2.64l1.42-1.42A5.98 5.98 0 0013 15.87zm0-3.1c-.86-.36-1.62-.9-2.22-1.56l1.42-1.42c.22.24.48.45.8.61V8h2v5.77z" />
              </svg>
              <span>PDF</span>
            </button>

            <button
              type="button"
              onClick={() => void handleExport('print')}
              className="px-4 py-2 border border-gray-500 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-10c-.55 0-1 .45-1 1s.45 1 1 1 1-.45 1-1-.45-1-1-1zM18 3H6v4h12V3z" />
              </svg>
              <span>PRINT</span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-3">
            <span className="text-base text-orange-500 font-medium whitespace-nowrap">
              Total Recording Number: <span className="font-bold">{totalRecords}</span>
            </span>
            <span className="text-base text-orange-500 font-medium whitespace-nowrap">Pagination</span>
            <input
              type="number"
              min={1}
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
              className="w-14 px-2 py-2 bg-gray-200 border border-gray-300 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
              className="w-28 px-3 py-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table id="export-table" className="w-full">
              <thead className="bg-gray-700 text-white">
                <tr>
                  <th className="px-4 py-4 text-left font-semibold">Transaction time</th>
                  <th className="px-4 py-4 text-left font-semibold">Reservation Number</th>
                  <th className="px-4 py-4 text-left font-semibold">Service Type</th>
                  <th className="px-4 py-4 text-left font-semibold">Transaction Type</th>
                  <th className="px-4 py-4 text-left font-semibold">Service Date</th>
                  <th className="px-4 py-4 text-left font-semibold">Service Name</th>
                  <th className="px-4 py-4 text-left font-semibold">Guest</th>
                  <th className="px-4 py-4 text-left font-semibold">Amount</th>
                  <th className="px-4 py-4 text-left font-semibold">Sales Channel</th>
                  <th className="px-4 py-4 text-left font-semibold">Detail</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-10 text-center text-gray-700">
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  reservations.map((row, idx) => (
                    <tr key={idx} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-700">{row.transactionTime}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.reservationNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.serviceType}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.transactionType}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.serviceDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.serviceName}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.guest}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.amount}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.salesChannel}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{row.detail}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">N</span>
              </div>
            </div>

            <div className="text-sm">
              <p>
                Copyright © 2025. Powered by <span className="text-yellow-400 font-bold">Y</span>
              </p>
            </div>

            <div className="w-10" aria-hidden="true" />
          </div>
        </div>
      </footer>
    </div>
  );
}
