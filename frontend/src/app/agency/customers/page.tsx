'use client';

import { useEffect, useMemo, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import AppHeader from '@/components/AppHeader';
import TopNav from '@/components/TopNav';
import { exportTableToExcel } from '@/lib/tableExport';
import { loadStoredAgencies } from '@/lib/agencyStorage';

type CustomerRow = {
  id: number;
  agency: string;
  type: string;
  gender: string;
  name: string;
  birthDate: string;
  idNumber: string;
  passportNumber: string;
  status: 'Active' | 'Inactive';
  selected: boolean;
};

type Notice = { type: 'success' | 'error'; message: string };

type AppliedFilters = {
  agency: string;
  status: 'All' | 'Active' | 'Inactive';
  name: string;
  lastName: string;
};

type NewCustomerDraft = {
  agency: string;
  type: string;
  gender: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  idNumber: string;
  passportNumber: string;
  status: CustomerRow['status'];
};

const CUSTOMER_STORAGE_KEY = 'trueTravel.agencyCustomers.v1';

export default function AgencyCustomersPage() {
  const router = useRouter();

  const [notice, setNotice] = useState<Notice | null>(null);

  const handleLogout = () => {
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
  };

  // Search Filters State
  const [agency, setAgency] = useState('');
  const [status, setStatus] = useState<AppliedFilters['status']>('All');
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');

  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    agency: '',
    status: 'All',
    name: '',
    lastName: '',
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Import state (UI-only)
  const [importFile, setImportFile] = useState<File | null>(null);

  // Table Data (Sample)
  const [customers, setCustomers] = useState<CustomerRow[]>([
    {
      id: 1,
      agency: 'True Travel',
      type: 'Adult',
      gender: 'Male',
      name: 'John Smith',
      birthDate: '1990-01-15',
      idNumber: 'ID-123456',
      passportNumber: 'P-987654',
      status: 'Active',
      selected: false,
    },
    {
      id: 2,
      agency: 'True Travel',
      type: 'Adult',
      gender: 'Female',
      name: 'Sarah Johnson',
      birthDate: '1988-07-03',
      idNumber: 'ID-654321',
      passportNumber: 'P-123789',
      status: 'Active',
      selected: false,
    },
    {
      id: 3,
      agency: 'Partner Agency',
      type: 'Child',
      gender: 'Male',
      name: 'Adam Lee',
      birthDate: '2014-05-20',
      idNumber: 'ID-112233',
      passportNumber: 'P-445566',
      status: 'Inactive',
      selected: false,
    },
  ]);

  // Load/save customers locally (simple persistence for this UI-only page)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CUSTOMER_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as unknown;
      if (!Array.isArray(parsed)) return;
      const safe = (parsed as CustomerRow[]).map((c) => ({
        ...c,
        selected: false,
      }));
      setCustomers(safe);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(
        CUSTOMER_STORAGE_KEY,
        JSON.stringify(customers.map((c) => ({ ...c, selected: false })))
      );
    } catch {
      // ignore
    }
  }, [customers]);

  const [showNewForm, setShowNewForm] = useState(false);
  const [newCustomer, setNewCustomer] = useState<NewCustomerDraft>({
    agency: '',
    type: 'Adult',
    gender: 'Male',
    firstName: '',
    lastName: '',
    birthDate: '',
    idNumber: '',
    passportNumber: '',
    status: 'Active',
  });

  const [storedAgencyNames, setStoredAgencyNames] = useState<string[]>([]);
  useEffect(() => {
    const list = loadStoredAgencies();
    const names = list
      .map((a) => a?.table?.agencyName)
      .filter((n): n is string => typeof n === 'string' && n.trim().length > 0)
      .map((n) => n.trim());

    const seen = new Set<string>();
    const unique = names.filter((n) => {
      const key = n.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
    setStoredAgencyNames(unique);
  }, []);

  const handleSearch = () => {
    setNotice(null);
    setAppliedFilters({
      agency: agency.trim(),
      status,
      name: name.trim(),
      lastName: lastName.trim(),
    });
    setCurrentPage(1);
  };

  const handleClear = () => {
    setNotice(null);
    setAgency('');
    setStatus('All');
    setName('');
    setLastName('');
    setAppliedFilters({ agency: '', status: 'All', name: '', lastName: '' });
    setCurrentPage(1);
  };

  const filteredCustomers = useMemo(() => {
    const normalize = (s: string) => s.trim().toLowerCase();
    const agencyNeedle = normalize(appliedFilters.agency);
    const nameNeedle = normalize(appliedFilters.name);
    const lastNameNeedle = normalize(appliedFilters.lastName);

    const getLastName = (full: string) => {
      const parts = full.trim().split(/\s+/).filter(Boolean);
      return parts.length ? parts[parts.length - 1] : '';
    };

    return customers.filter((c) => {
      if (agencyNeedle && !normalize(c.agency).includes(agencyNeedle)) return false;
      if (appliedFilters.status !== 'All' && c.status !== appliedFilters.status) return false;
      if (nameNeedle && !normalize(c.name).includes(nameNeedle)) return false;
      if (lastNameNeedle && !normalize(getLastName(c.name)).includes(lastNameNeedle)) return false;
      return true;
    });
  }, [customers, appliedFilters]);

  const agencySuggestions = useMemo(() => {
    const seen = new Set<string>();
    const add = (value: string) => {
      const v = value.trim();
      if (!v) return;
      const key = v.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      results.push(v);
    };

    const results: string[] = [];
    storedAgencyNames.forEach(add);
    customers.forEach((c) => add(c.agency));
    return results;
  }, [customers, storedAgencyNames]);

  const customerNameSuggestions = useMemo(() => {
    const seen = new Set<string>();
    const results: string[] = [];
    customers.forEach((c) => {
      const v = c.name.trim();
      if (!v) return;
      const key = v.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      results.push(v);
    });
    return results;
  }, [customers]);

  const customerLastNameSuggestions = useMemo(() => {
    const seen = new Set<string>();
    const results: string[] = [];
    customers.forEach((c) => {
      const parts = c.name.trim().split(/\s+/).filter(Boolean);
      const last = parts.length ? parts[parts.length - 1] : '';
      const v = last.trim();
      if (!v) return;
      const key = v.toLowerCase();
      if (seen.has(key)) return;
      seen.add(key);
      results.push(v);
    });
    return results;
  }, [customers]);

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(filteredCustomers.length / itemsPerPage));
  useEffect(() => {
    setCurrentPage((p) => Math.min(Math.max(1, p), totalPages));
  }, [totalPages]);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

  const allVisibleSelected = currentCustomers.length > 0 && currentCustomers.every((c) => c.selected);

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    const visibleIds = new Set(currentCustomers.map((c) => c.id));
    setCustomers((prev) => prev.map((c) => (visibleIds.has(c.id) ? { ...c, selected: checked } : c)));
  };

  const handleSelectCustomer = (id: number) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c)));
  };

  const handleNew = () => {
    setNotice(null);
    setShowNewForm(true);
  };

  const handleCancelNew = () => {
    setShowNewForm(false);
    setNewCustomer({
      agency: '',
      type: 'Adult',
      gender: 'Male',
      firstName: '',
      lastName: '',
      birthDate: '',
      idNumber: '',
      passportNumber: '',
      status: 'Active',
    });
  };

  const handleCreateCustomer = () => {
    setNotice(null);

    const agencyValue = newCustomer.agency.trim();
    const firstNameValue = newCustomer.firstName.trim();
    const lastNameValue = newCustomer.lastName.trim();
    const fullName = [firstNameValue, lastNameValue].filter(Boolean).join(' ');

    if (!agencyValue) {
      setNotice({ type: 'error', message: 'Agency is required.' });
      return;
    }
    if (!firstNameValue || !lastNameValue) {
      setNotice({ type: 'error', message: 'First name and last name are required.' });
      return;
    }

    setCustomers((prev) => {
      const nextId = prev.reduce((max, c) => Math.max(max, c.id), 0) + 1;
      const created: CustomerRow = {
        id: nextId,
        agency: agencyValue,
        type: newCustomer.type,
        gender: newCustomer.gender,
        name: fullName,
        birthDate: newCustomer.birthDate,
        idNumber: newCustomer.idNumber.trim(),
        passportNumber: newCustomer.passportNumber.trim(),
        status: newCustomer.status,
        selected: false,
      };
      return [created, ...prev];
    });

    setNotice({ type: 'success', message: 'Customer created successfully.' });
    setShowNewForm(false);
    setNewCustomer({
      agency: '',
      type: 'Adult',
      gender: 'Male',
      firstName: '',
      lastName: '',
      birthDate: '',
      idNumber: '',
      passportNumber: '',
      status: 'Active',
    });
    setCurrentPage(1);
  };

  const handleExportExcel = async () => {
    const exportHeaders = ['id', 'agency', 'type', 'gender', 'name', 'birthDate', 'idNumber', 'passportNumber', 'status'];

    try {
      await exportTableToExcel(
        'customers.xlsx',
        customers.map((c) => ({ ...c } as unknown as Record<string, unknown>)),
        exportHeaders
      );
    } catch (error) {
      console.error('Failed to export customers to Excel:', error);
      setNotice({ type: 'error', message: 'Failed to export to Excel.' });
    }
  };

  const handleImportExcel = () => {
    if (!importFile) {
      setNotice({ type: 'error', message: 'Please choose an Excel file first.' });
      return;
    }
    setNotice({ type: 'error', message: 'Excel import is not implemented yet.' });
  };

  const handleDelete = () => {
    const selectedIds = customers.filter((c) => c.selected).map((c) => c.id);
    if (selectedIds.length === 0) {
      setNotice({ type: 'error', message: 'Select at least one customer to delete.' });
      return;
    }
    if (!confirm(`Delete ${selectedIds.length} selected customer(s)?`)) return;
    setNotice(null);
    setCustomers((prev) => prev.filter((c) => !c.selected));
  };

  const handleEdit = (id: number) => {
    setNotice({ type: 'error', message: `Edit screen is not implemented yet (id: ${id}).` });
  };

  const selectedCount = customers.filter((c) => c.selected).length;

  return (
    <div className="min-h-screen bg-gray-100">
      <AppHeader onLogout={handleLogout} />
      <TopNav />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Page Title and Breadcrumb */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900">Agency Customers</h2>
          <div className="flex items-center space-x-2 text-sm mt-2">
            <a href="/" className="text-blue-500 hover:underline">
              Homepage
            </a>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500">Agency Customers</span>
          </div>
        </div>

        {notice && (
          <div
            className={
              'mb-6 rounded-md border px-4 py-3 text-sm ' +
              (notice.type === 'success' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800')
            }
            role="status"
          >
            {notice.message}
          </div>
        )}

        {/* Search Criteria */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="bg-orange-500 text-white px-6 py-3 rounded-t-lg">
            <h3 className="text-lg font-semibold">Search Criteria</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Agency</label>
                <input
                  type="text"
                  value={agency}
                  onChange={(e) => setAgency(e.target.value)}
                  list="agency-suggestions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as AppliedFilters['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                >
                  <option value="All">All</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  list="customer-name-suggestions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-orange-500 mb-2">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  list="customer-lastname-suggestions"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                />
              </div>
            </div>

            <datalist id="agency-suggestions">
              {agencySuggestions.map((a) => (
                <option key={a} value={a} />
              ))}
            </datalist>
            <datalist id="customer-name-suggestions">
              {customerNameSuggestions.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>
            <datalist id="customer-lastname-suggestions">
              {customerLastNameSuggestions.map((n) => (
                <option key={n} value={n} />
              ))}
            </datalist>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleClear}
                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleSearch}
                className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                </svg>
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons and Pagination Info */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-3">
            <button
              onClick={handleNew}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
              </svg>
              <span>New</span>
            </button>

            <label className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2 cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setImportFile(file);
                }}
              />
              <span>Choose File</span>
              <span className="text-gray-400">{importFile?.name ?? 'No file chosen'}</span>
            </label>

            <button
              onClick={handleImportExcel}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z" />
              </svg>
              <span>Import</span>
            </button>
          </div>

          <div className="text-sm text-orange-500 font-semibold">
            Total Records: {filteredCustomers.length} <span className="text-gray-600">• Page {currentPage} / {totalPages}</span>
          </div>
        </div>

        {showNewForm && (
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="bg-gray-700 text-white px-6 py-3 rounded-t-lg flex items-center justify-between">
              <h3 className="text-lg font-semibold">New Customer</h3>
              <button
                onClick={handleCancelNew}
                className="px-3 py-1 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
              >
                Close
              </button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-orange-500 mb-2">Agency</label>
                  <input
                    type="text"
                    value={newCustomer.agency}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, agency: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-500 mb-2">Type</label>
                  <select
                    value={newCustomer.type}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  >
                    <option value="Adult">Adult</option>
                    <option value="Child">Child</option>
                    <option value="Infant">Infant</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-500 mb-2">Gender</label>
                  <select
                    value={newCustomer.gender}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, gender: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-500 mb-2">Status</label>
                  <select
                    value={newCustomer.status}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, status: e.target.value as CustomerRow['status'] }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-500 mb-2">First Name</label>
                  <input
                    type="text"
                    value={newCustomer.firstName}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, firstName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-500 mb-2">Last Name</label>
                  <input
                    type="text"
                    value={newCustomer.lastName}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, lastName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-500 mb-2">Birth Date</label>
                  <input
                    type="date"
                    value={newCustomer.birthDate}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, birthDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-orange-500 mb-2">ID Number</label>
                  <input
                    type="text"
                    value={newCustomer.idNumber}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, idNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-orange-500 mb-2">Passport Number</label>
                  <input
                    type="text"
                    value={newCustomer.passportNumber}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, passportNumber: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={handleCancelNew}
                  className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateCustomer}
                  className="px-6 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex justify-end items-center space-x-2 mb-4">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            First
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <div className="px-2 text-sm text-gray-700">
            {currentPage} / {totalPages}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Last
          </button>
          <select
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6" id="export-table">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold">
                    <input type="checkbox" checked={allVisibleSelected} onChange={handleSelectAll} className="w-4 h-4" />
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Agency</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Gender</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Name - Last Name</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Birth Date</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">ID Number</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Passport Number</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="px-6 py-10 text-center text-sm text-gray-600">
                      No customers found for the selected criteria.
                    </td>
                  </tr>
                ) : (
                  currentCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={customer.selected}
                          onChange={() => handleSelectCustomer(customer.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.agency}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.type}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.gender}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.birthDate}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.idNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.passportNumber}</td>
                      <td className="px-4 py-3 text-sm text-gray-900">{customer.status}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleEdit(customer.id)}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                          aria-label="Edit customer"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zm2.92 2.83H5v-.92l9.06-9.06.92.92L5.92 20.08zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
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

        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={handleExportExcel}
            className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM8 17H6V7h2v10zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
            </svg>
            <span>Export Excel</span>
          </button>

          <button
            onClick={handleDelete}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={selectedCount === 0}
          >
            Delete{selectedCount > 0 ? ` (${selectedCount})` : ''}
          </button>
        </div>
      </div>

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







