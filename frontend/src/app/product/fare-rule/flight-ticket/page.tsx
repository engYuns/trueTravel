'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import TopNav from '@/components/TopNav';

type FareRuleRow = {
  id: number;
  name: string;
  rule: string;
  salesChannel: string;
  provider: string;
  locationType: string;
  provider2: string;
  distance: string;
  calculatingType: string;
  currency: string;
  fareType: string;
  priceRange: string;
  agencyGroup: string;
  flightNumber?: string;
};

type AppliedFilters = {
  name: string;
  ruleType: string;
  channel: string;
  provider: string;
  agencyGroup: string;
  subCompanies: string;
  providerFilter: string;
  locationType: string;
  dateFrom: string;
  dateTo: string;
  sort: string;
  flightNumber: string;
};

export default function FareRuleFlightTicketPage() {
  const router = useRouter();

  // Helper functions
  const handleLogout = () => {
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
  };

  // Search Filters State
  const [name, setName] = useState('');
  const [ruleType, setRuleType] = useState('All');
  const [channel, setChannel] = useState('');
  const [provider, setProvider] = useState('');
  const [agencyGroup, setAgencyGroup] = useState('');
  const [subCompanies, setSubCompanies] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [locationType, setLocationType] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState('Flight Date');
  const [flightNumber, setFlightNumber] = useState('');

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    name,
    ruleType,
    channel,
    provider,
    agencyGroup,
    subCompanies,
    providerFilter,
    locationType,
    dateFrom,
    dateTo,
    sort,
    flightNumber,
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Table Data (Sample - currently empty as shown in image)
  const [fareRules, setFareRules] = useState<FareRuleRow[]>([]);

  const filteredRules = useMemo(() => {
    const nameNeedle = appliedFilters.name.trim().toLowerCase();
    const agencyNeedle = appliedFilters.agencyGroup.trim().toLowerCase();
    const flightNeedle = appliedFilters.flightNumber.trim().toLowerCase();

    return fareRules.filter((rule) => {
      if (nameNeedle && !rule.name.toLowerCase().includes(nameNeedle)) return false;
      if (agencyNeedle && !rule.agencyGroup.toLowerCase().includes(agencyNeedle)) return false;
      if (appliedFilters.channel && rule.salesChannel !== appliedFilters.channel) return false;
      if (appliedFilters.provider && rule.provider !== appliedFilters.provider) return false;
      if (appliedFilters.providerFilter && rule.provider2 !== appliedFilters.providerFilter) return false;
      if (appliedFilters.locationType !== 'All' && rule.locationType !== appliedFilters.locationType) return false;
      if (appliedFilters.ruleType !== 'All' && !rule.rule.toLowerCase().includes(appliedFilters.ruleType.toLowerCase())) return false;
      if (flightNeedle && !(rule.flightNumber ?? '').toLowerCase().includes(flightNeedle)) return false;
      return true;
    });
  }, [fareRules, appliedFilters]);

  const totalRecords = filteredRules.length;
  const totalPages = Math.max(1, Math.ceil(totalRecords / itemsPerPage));

  useEffect(() => {
    setCurrentPage((page) => Math.min(Math.max(page, 1), totalPages));
  }, [totalPages]);

  const pagedRules = useMemo(() => {
    const safePage = Math.min(Math.max(currentPage, 1), totalPages);
    const startIndex = (safePage - 1) * itemsPerPage;
    return filteredRules.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredRules, currentPage, itemsPerPage, totalPages]);

  const handleSearch = () => {
    setAppliedFilters({
      name,
      ruleType,
      channel,
      provider,
      agencyGroup,
      subCompanies,
      providerFilter,
      locationType,
      dateFrom,
      dateTo,
      sort,
      flightNumber,
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
          <h2 className="text-3xl font-light text-gray-800 mb-2">Fare Rules</h2>
          <div className="flex items-center space-x-2 text-sm">
            <a href="/dashboard" className="text-blue-500 hover:underline">Homepage</a>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Fare Rules</span>
          </div>
        </div>

        {/* Search Criterias Section */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="bg-orange-500 text-white px-6 py-3 rounded-t-lg">
            <h3 className="text-lg font-medium">Searching Criterias</h3>
          </div>
          
          <div className="p-6">
            {/* First Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Name</label>
                <select 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">None selected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Rule Type</label>
                <select 
                  value={ruleType}
                  onChange={(e) => setRuleType(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="All">All</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Channel</label>
                <select 
                  value={channel}
                  onChange={(e) => setChannel(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">None selected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Provider</label>
                <select 
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">None selected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Agency Group / Company Group</label>
                <select 
                  value={agencyGroup}
                  onChange={(e) => setAgencyGroup(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">None selected</option>
                </select>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Sub Companies</label>
                <input 
                  type="text"
                  value={subCompanies}
                  onChange={(e) => setSubCompanies(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Provider</label>
                <select 
                  value={providerFilter}
                  onChange={(e) => setProviderFilter(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="">None selected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Location Type</label>
                <select 
                  value={locationType}
                  onChange={(e) => setLocationType(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="All">All</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Date Range</label>
                <div className="flex space-x-2">
                  <input 
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="flex-1 h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <input 
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="flex-1 h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Sort</label>
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
                >
                  <option value="Flight Date">Flight Date</option>
                </select>
              </div>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Flight Number</label>
                <input 
                  type="text"
                  value={flightNumber}
                  onChange={(e) => setFlightNumber(e.target.value)}
                  className="w-full h-12 px-4 text-base text-gray-700 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-end">
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
          <div className="p-6">
            {/* New Button and Pagination */}
            <div className="flex justify-between items-center mb-4">
              <button className="h-10 bg-teal-500 hover:bg-teal-600 text-white px-4 rounded-md transition-colors flex items-center space-x-2 font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>New</span>
              </button>

              <div className="flex items-center space-x-4">
                <span className="text-orange-500 font-medium">Total Recording Number: {totalRecords}</span>
                <span className="text-gray-600">Pagination</span>
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
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-700 text-white">
                    <th className="px-4 py-3 text-left">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-4 py-3 text-left font-semibold">Name</th>
                    <th className="px-4 py-3 text-left font-semibold">Rule</th>
                    <th className="px-4 py-3 text-left font-semibold">Sales Channel</th>
                    <th className="px-4 py-3 text-left font-semibold">Provider</th>
                    <th className="px-4 py-3 text-left font-semibold">Location Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Provider</th>
                    <th className="px-4 py-3 text-left font-semibold">Distance</th>
                    <th className="px-4 py-3 text-left font-semibold">Calculating type</th>
                    <th className="px-4 py-3 text-left font-semibold">Currency</th>
                    <th className="px-4 py-3 text-left font-semibold">Fare Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Price Range</th>
                    <th className="px-4 py-3 text-left font-semibold">Agency Group / Company Group</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRules.length === 0 ? (
                    <tr>
                      <td colSpan={13} className="px-4 py-12 text-center text-gray-500">
                        No data available
                      </td>
                    </tr>
                  ) : (
                    pagedRules.map((rule) => (
                      <tr key={rule.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.rule}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.salesChannel}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.provider}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.locationType}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.provider2}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.distance}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.calculatingType}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.currency}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.fareType}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.priceRange}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{rule.agencyGroup}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Delete Button */}
            <div className="flex justify-end mt-4">
              <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors flex items-center space-x-2 font-medium">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Delete</span>
              </button>
            </div>
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
