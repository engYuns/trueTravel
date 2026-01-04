'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import TopNav from '@/components/TopNav';

type TransferRuleRow = {
  id: number;
  name: string;
  rule: string;
  salesChannel: string;
  provider: string;
  fareType: string;
  fare: string;
  priceRange: string;
  agencyGroup: string;
  agentInclusionType: string;
  agency: string;
  reservationDate: string;
  transferDate: string;
};

type AppliedFilters = {
  name: string;
  salesChannel: string;
  provider: string;
  dateFrom: string;
  dateTo: string;
  sort: string;
  agencyGroup: string;
  subCompanies: string;
};

export default function TransferFeeRulesPage() {
  const router = useRouter();
  
  // Form State
  const [name, setName] = useState('');
  const [salesChannel, setSalesChannel] = useState('');
  const [provider, setProvider] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sort, setSort] = useState('Reservation Date');
  const [agencyGroup, setAgencyGroup] = useState('');
  const [subCompanies, setSubCompanies] = useState('');

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    name,
    salesChannel,
    provider,
    dateFrom,
    dateTo,
    sort,
    agencyGroup,
    subCompanies,
  });
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);
  
  // Mock data - replace with actual API call
  const [transferRules, setTransferRules] = useState<TransferRuleRow[]>([]);
  
  // Helper functions
  const handleLogout = () => {
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
  };

  const filteredRules = useMemo(() => {
    const nameNeedle = appliedFilters.name.trim().toLowerCase();
    const agencyNeedle = appliedFilters.agencyGroup.trim().toLowerCase();
    const channelNeedle = appliedFilters.salesChannel.trim();
    const providerNeedle = appliedFilters.provider.trim();

    return transferRules.filter((rule) => {
      if (nameNeedle && !rule.name.toLowerCase().includes(nameNeedle)) return false;
      if (agencyNeedle && !rule.agencyGroup.toLowerCase().includes(agencyNeedle)) return false;
      if (channelNeedle && rule.salesChannel !== channelNeedle) return false;
      if (providerNeedle && providerNeedle !== 'All' && rule.provider !== providerNeedle) return false;
      return true;
    });
  }, [transferRules, appliedFilters]);

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

  useEffect(() => {
    const allowedIds = new Set(filteredRules.map((r) => r.id));
    setSelectedRowIds((prev) => prev.filter((id) => allowedIds.has(id)));
  }, [filteredRules]);

  const handleSearch = () => {
    setAppliedFilters({
      name,
      salesChannel,
      provider,
      dateFrom,
      dateTo,
      sort,
      agencyGroup,
      subCompanies,
    });
    setCurrentPage(1);
  };

  const handleNew = () => {
    // Navigate to create new transfer fee rule page
    console.log('Create new transfer fee rule');
  };

  const handleDelete = () => {
    if (selectedRowIds.length === 0) {
      alert('Please select at least one row to delete');
      return;
    }
    if (confirm(`Are you sure you want to delete ${selectedRowIds.length} record(s)?`)) {
      setTransferRules((prev) => prev.filter((row) => !selectedRowIds.includes(row.id)));
      setSelectedRowIds([]);
    }
  };

  const toggleRowSelection = (id: number) => {
    setSelectedRowIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedRowIds.length === filteredRules.length) {
      setSelectedRowIds([]);
    } else {
      setSelectedRowIds(filteredRules.map((r) => r.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader onLogout={handleLogout} />
      <TopNav />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Page Title and Breadcrumb */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Transfer Fee Rules</h1>
          <div className="flex items-center space-x-2 text-sm">
            <button 
              onClick={() => router.push('/dashboard')}
              className="text-blue-500 hover:text-blue-600 transition-colors"
            >
              Homepage
            </button>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">Transfer Fee Rules</span>
          </div>
        </div>

        {/* Search Criteria Section */}
        <div className="bg-white rounded-lg shadow-sm border border-orange-200 overflow-hidden mb-6">
          {/* Orange Header */}
          <div className="bg-orange-500 text-white px-6 py-4">
            <h2 className="text-lg font-semibold">Searching Criterias</h2>
          </div>

          {/* Search Form */}
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Name</label>
                <select
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-700"
                >
                  <option value="">None selected</option>
                  <option value="transfer1">Transfer 1</option>
                  <option value="transfer2">Transfer 2</option>
                </select>
              </div>

              {/* Sales Channel */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Sales Channel</label>
                <select
                  value={salesChannel}
                  onChange={(e) => setSalesChannel(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-700"
                >
                  <option value="">None selected</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>

              {/* Provider */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Provider</label>
                <select
                  value={provider}
                  onChange={(e) => setProvider(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-700"
                >
                  <option value="All">All</option>
                  <option value="provider1">Provider 1</option>
                  <option value="provider2">Provider 2</option>
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Sort</label>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-700"
                >
                  <option value="Reservation Date">Reservation Date</option>
                  <option value="Transfer Date">Transfer Date</option>
                  <option value="Name">Name</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              {/* Date Range */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-orange-500 mb-2">Date Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Agency Group / Company Group */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Agency Group / Company Group</label>
                <select
                  value={agencyGroup}
                  onChange={(e) => setAgencyGroup(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-700"
                >
                  <option value="">None selected</option>
                  <option value="group1">Group 1</option>
                  <option value="group2">Group 2</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Sub Companies */}
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Sub Companies</label>
                <input
                  type="text"
                  value={subCompanies}
                  onChange={(e) => setSubCompanies(e.target.value)}
                  placeholder="Enter sub companies"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  onClick={handleSearch}
                  className="w-full sm:w-auto px-8 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span>Search</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Actions and Stats Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-4">
          <button
            onClick={handleNew}
            className="px-6 py-2 bg-cyan-500 text-white rounded-md hover:bg-cyan-600 transition-colors font-medium flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>New</span>
          </button>

          <div className="flex items-center space-x-4 ml-auto">
            <span className="text-sm text-orange-500 font-medium">
              Total Recording Number: <span className="font-bold">{totalRecords}</span>
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Pagination</span>
              <input
                type="number"
                value={currentPage}
                onChange={(e) => setCurrentPage(parseInt(e.target.value) || 1)}
                min="1"
                max={totalPages}
                className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedRowIds.length === filteredRules.length && filteredRules.length > 0}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-orange-500"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Rule</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Sales Channel</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Provider</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fare Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Fare</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Price Range</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Agency Group / Company Group</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Agent Inclusion Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Agency</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Reservation Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Transfer Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRules.length === 0 ? (
                  <tr>
                    <td colSpan={13} className="px-4 py-8 text-center text-gray-500">
                      No records found. Click "New" to create a transfer fee rule.
                    </td>
                  </tr>
                ) : (
                  pagedRules.map((rule) => (
                    <tr 
                      key={rule.id}
                      className={`hover:bg-gray-50 transition-colors ${selectedRowIds.includes(rule.id) ? 'bg-blue-50' : ''}`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedRowIds.includes(rule.id)}
                          onChange={() => toggleRowSelection(rule.id)}
                          className="w-4 h-4 rounded border-gray-300 focus:ring-2 focus:ring-orange-500"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm">{rule.name}</td>
                      <td className="px-4 py-3 text-sm">{rule.rule}</td>
                      <td className="px-4 py-3 text-sm">{rule.salesChannel}</td>
                      <td className="px-4 py-3 text-sm">{rule.provider}</td>
                      <td className="px-4 py-3 text-sm">{rule.fareType}</td>
                      <td className="px-4 py-3 text-sm">{rule.fare}</td>
                      <td className="px-4 py-3 text-sm">{rule.priceRange}</td>
                      <td className="px-4 py-3 text-sm">{rule.agencyGroup}</td>
                      <td className="px-4 py-3 text-sm">{rule.agentInclusionType}</td>
                      <td className="px-4 py-3 text-sm">{rule.agency}</td>
                      <td className="px-4 py-3 text-sm">{rule.reservationDate}</td>
                      <td className="px-4 py-3 text-sm">{rule.transferDate}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Button */}
        <div className="flex justify-end">
          <button
            onClick={handleDelete}
            disabled={selectedRowIds.length === 0}
            className={`px-6 py-2 rounded-md font-medium flex items-center space-x-2 transition-colors ${
              selectedRowIds.length === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-500 text-white hover:bg-red-600'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span>Delete</span>
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white py-4 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Left - Logo Circle */}
            <div className="flex items-center">
              <div className="w-10 h-10 border-2 border-white rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">N</span>
              </div>
            </div>

            {/* Center - Copyright */}
            <div className="text-sm">
              <p>Copyright © 2025. Powered by <span className="text-yellow-400 font-bold">Y</span></p>
            </div>

            <div className="w-10" aria-hidden="true" />
          </div>
        </div>
      </footer>
    </div>
  );
}
