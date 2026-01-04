'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import TopNav from '@/components/TopNav';

type OfferRow = {
  id: number;
  registerDate: string;
  company: string;
  creative: string;
  sender: string;
  receiver: string;
  message: string;
  productType: string;
};

type AppliedFilters = {
  startDate: string;
  endDate: string;
  company: string;
  productType: string;
  sender: string;
  receiver: string;
};

export default function OffersPage() {
  const router = useRouter();

  // Helper functions
  const handleLogout = () => {
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
  };

  // Search Filters State
  const [startDate, setStartDate] = useState('2025-11-08');
  const [endDate, setEndDate] = useState('2025-11-08');
  const [company, setCompany] = useState('True Travel');
  const [productType, setProductType] = useState('All');
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    startDate,
    endDate,
    company,
    productType,
    sender,
    receiver,
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Table Data (Sample - currently empty as shown in image)
  const [offers, setOffers] = useState<OfferRow[]>([]);

  const filteredOffers = useMemo(() => {
    const companyNeedle = appliedFilters.company.trim().toLowerCase();
    const senderNeedle = appliedFilters.sender.trim().toLowerCase();
    const receiverNeedle = appliedFilters.receiver.trim().toLowerCase();

    return offers.filter((offer) => {
      if (companyNeedle && !offer.company.toLowerCase().includes(companyNeedle)) return false;
      if (senderNeedle && !offer.sender.toLowerCase().includes(senderNeedle)) return false;
      if (receiverNeedle && !offer.receiver.toLowerCase().includes(receiverNeedle)) return false;
      if (appliedFilters.productType !== 'All' && offer.productType !== appliedFilters.productType) return false;
      return true;
    });
  }, [offers, appliedFilters]);

  const totalRecords = filteredOffers.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));

  useEffect(() => {
    setCurrentPage((page) => Math.min(Math.max(page, 1), totalPages));
  }, [totalPages]);

  const pagedOffers = useMemo(() => {
    const safePage = Math.min(Math.max(currentPage, 1), totalPages);
    const startIndex = (safePage - 1) * itemsPerPage;
    return filteredOffers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredOffers, currentPage, itemsPerPage, totalPages]);

  const handleSearch = () => {
    setAppliedFilters({
      startDate,
      endDate,
      company,
      productType,
      sender,
      receiver,
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader onLogout={handleLogout} />
      <TopNav />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Breadcrumb */}
        <div className="mb-6">
          <h2 className="text-3xl font-light text-gray-800 mb-2">Offers</h2>
          <div className="flex items-center space-x-2 text-sm">
            <a href="/" className="text-blue-500 hover:underline">Homepage</a>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Offers</span>
          </div>
        </div>

        {/* Search Criterias Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="bg-orange-500 text-white px-6 py-3 rounded-t-lg">
            <h3 className="text-lg font-medium">Searching Criterias</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              {/* Date Range - Start */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Date Range - End */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Company */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Company</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
                  placeholder="True Travel"
                />
              </div>

              {/* Product Type */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Product Type</label>
                <select
                  value={productType}
                  onChange={(e) => setProductType(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="All">All</option>
                  <option value="Flight Ticket">Flight Ticket</option>
                  <option value="Hotel">Hotel</option>
                  <option value="Rent A Car">Rent A Car</option>
                  <option value="Transfer">Transfer</option>
                </select>
              </div>

              {/* Sender */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Sender</label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
                  placeholder="Enter sender name"
                />
              </div>

              {/* Receiver */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Receiver</label>
                <input
                  type="text"
                  value={receiver}
                  onChange={(e) => setReceiver(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 font-medium border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder:text-gray-400"
                  placeholder="Enter receiver name"
                />
              </div>

              {/* Search Button */}
              <div>
                <button
                  onClick={handleSearch}
                  className="w-full h-12 bg-orange-500 text-white px-6 text-base font-medium rounded-md hover:bg-orange-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                  </svg>
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Pagination Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-end space-x-4">
            <span className="text-sm text-orange-500 font-medium">
              Total Recording Number: <span className="font-bold">{totalRecords}</span>
            </span>
            <span className="text-sm text-orange-500 font-medium">Pagination</span>
            <input
              type="number"
              value={currentPage}
              min={1}
              max={totalPages}
              onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
              className="w-16 px-3 py-1 bg-gray-200 text-gray-700 rounded text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-600 text-white">
                  <th className="px-4 py-3 text-left text-sm font-medium">Register Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Company</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Creative</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Sender</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Receiver</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Message</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Product Type</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">#</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                      No offers found. Use the search filters above to find offers.
                    </td>
                  </tr>
                ) : (
                  pagedOffers.map((offer) => (
                    <tr key={offer.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700">{offer.registerDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{offer.company}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{offer.creative}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{offer.sender}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{offer.receiver}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{offer.message}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{offer.productType}</td>
                      <td className="px-4 py-3 text-sm">
                        <button className="text-blue-500 hover:text-blue-600 transition-colors">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-4 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center">
            <p className="text-sm">
              Copyright © 2025. Powered by{' '}
              <span className="text-yellow-400 font-bold">Y</span>
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
