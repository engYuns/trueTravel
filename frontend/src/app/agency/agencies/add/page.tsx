'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import HeaderUserMenu from '@/components/HeaderUserMenu';
import PasswordInput from '@/components/PasswordInput';
import { loadStoredAgencies, type StoredAgency, upsertStoredAgency } from '@/lib/agencyStorage';

type AddSection =
  | 'general'
  | 'invoice'
  | 'financial'
  | 'balance'
  | 'account'
  | 'documents'
  | 'code';

type AccountRow = {
  id: string;
  type: string;
  accountName: string;
  currency: string;
  ibanOrCardNumber: string;
};

type CodeRow = {
  id: string;
  type: string;
  code: string;
  description: string;
};

function SideItem({
  active,
  label,
  onClick,
  icon
}: {
  active: boolean;
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'w-full flex items-center gap-3 px-5 py-4 border border-gray-200 text-left transition-colors ' +
        (active ? 'bg-white text-orange-600' : 'bg-gray-50 hover:bg-white text-orange-600')
      }
    >
      <span className="shrink-0">{icon}</span>
      <span className="text-lg font-medium">{label}</span>
    </button>
  );
}

export default function AddAgencyPage() {
  const router = useRouter();

  const SECTION_ORDER: AddSection[] = ['general', 'invoice', 'financial', 'balance', 'account', 'documents', 'code'];
  const SECTION_LABEL: Record<AddSection, string> = {
    general: 'General Info',
    invoice: 'Invoice Information',
    financial: 'Financial Info',
    balance: 'Balance Info',
    account: 'Account Information',
    documents: 'Documents',
    code: 'Code'
  };

  const inputClass =
    'w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500';
  const inputMutedClass =
    'w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500';
  const textareaClass =
    'w-full border border-gray-300 bg-white px-4 py-2 min-h-20 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500';
  const fileInputClass =
    'w-full border border-gray-300 bg-white px-4 py-2 cursor-pointer file:cursor-pointer';

  const generatePassword = (length = 12) => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    const digits = '23456789';
    const symbols = '!@#$%^&*_-+=?';
    const all = alphabet + digits + symbols;

    const bytes = new Uint32Array(length);
    if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
      window.crypto.getRandomValues(bytes);
    } else {
      for (let i = 0; i < length; i++) bytes[i] = Math.floor(Math.random() * 2 ** 32);
    }

    return Array.from(bytes, (n) => all[n % all.length]).join('');
  };

  const handleLogout = () => {
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
  };

  const [section, setSection] = useState<AddSection>('general');

  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [storedAgents, setStoredAgents] = useState<StoredAgency[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState('');
  const [editingAgentId, setEditingAgentId] = useState<number | null>(null);
  const [editingCreatedAt, setEditingCreatedAt] = useState<string | null>(null);

  const accountIdRef = useRef(1);
  const codeIdRef = useRef(1);

  const nextAccountId = () => `acc-${accountIdRef.current++}`;
  const nextCodeId = () => `code-${codeIdRef.current++}`;

  const [general, setGeneral] = useState({
    logoFile: null as File | null,
    iataType: 'IATA',
    mainAgency: '',
    externalAccountRegionCode: '',
    companyName: '',
    code: '',
    email: '',
    phone: '',
    fax: '',
    mobile: '',
    country: 'Iraq',
    city: 'Erbil',
    region: '',
    address: '',
    adminGender: 'Mr',
    adminFirstName: '',
    adminLastName: '',
    adminEmail: '',
    adminPhone: '',
    adminUsername: '',
    adminPassword: ''
  });

  useEffect(() => {
    setGeneral((p) => {
      if (p.code) return p;
      const random = String(Math.floor(100000 + Math.random() * 900000));
      return { ...p, code: `IQT${random}` };
    });
  }, []);

  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!general.logoFile) {
      setLogoPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(general.logoFile);
    setLogoPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [general.logoFile]);

  useEffect(() => {
    setStoredAgents(loadStoredAgencies());
  }, []);

  const [invoice, setInvoice] = useState({
    title: '',
    taxOffice: '',
    taxNumber: '',
    city: 'Erbil',
    accountingCode: '',
    address: ''
  });

  const [financial, setFinancial] = useState({
    type: 'Agent',
    notInvoiced: 'Default',
    creditCard: false,
    threeDPayment: true,
    accountClosureType: 'AccountingPeriod',
    paymentPeriod: '0',
    startDate: ''
  });

  const [balance, setBalance] = useState({
    currency: 'USD',
    definedBalance: '',
    totalBalance: '',
    usedBalance: '',
    availableBalance: ''
  });

  const [accounts, setAccounts] = useState<AccountRow[]>([
    {
      id: 'acc-0',
      type: 'Bank',
      accountName: '',
      currency: 'USD',
      ibanOrCardNumber: ''
    }
  ]);

  const [documents, setDocuments] = useState({
    contractPdf: null as File | null,
    governmentPapersPdf: null as File | null
  });

  const [codes, setCodes] = useState<CodeRow[]>([
    {
      id: 'code-0',
      type: '/*A - Star Alliance',
      code: '',
      description: ''
    }
  ]);

  const goNext = () => {
    if (!validateSection(section)) {
      setNotice({ type: 'error', message: 'Please fix the highlighted fields before continuing.' });
      return;
    }
    const idx = SECTION_ORDER.indexOf(section);
    setSection(SECTION_ORDER[Math.min(SECTION_ORDER.length - 1, idx + 1)]);
  };

  const goPrev = () => {
    const idx = SECTION_ORDER.indexOf(section);
    setSection(SECTION_ORDER[Math.max(0, idx - 1)]);
  };

  const clearError = (key: string) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const setError = (key: string, message: string) => {
    setErrors((prev) => ({ ...prev, [key]: message }));
  };

  const firstSectionWithErrors = (nextErrors: Record<string, string>): AddSection | null => {
    const keys = Object.keys(nextErrors);
    if (keys.length === 0) return null;
    const mapKeyToSection = (k: string): AddSection => {
      if (k.startsWith('general.')) return 'general';
      if (k.startsWith('invoice.')) return 'invoice';
      if (k.startsWith('financial.')) return 'financial';
      if (k.startsWith('balance.')) return 'balance';
      if (k.startsWith('accounts[')) return 'account';
      if (k.startsWith('documents.')) return 'documents';
      if (k.startsWith('codes[')) return 'code';
      return 'general';
    };
    const sectionsInOrder = new Set(keys.map(mapKeyToSection));
    for (const s of SECTION_ORDER) {
      if (sectionsInOrder.has(s)) return s;
    }
    return null;
  };

  const validateSection = (s: AddSection): boolean => {
    const next: Record<string, string> = {};
    const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (s === 'general') {
      if (!general.companyName.trim()) next['general.companyName'] = 'Company name is required.';
      if (general.email.trim() && !isEmail(general.email.trim())) next['general.email'] = 'Enter a valid email address.';
      if (general.adminEmail.trim() && !isEmail(general.adminEmail.trim())) next['general.adminEmail'] = 'Enter a valid email address.';
      if (!general.adminUsername.trim()) next['general.adminUsername'] = 'Username is required.';
      if (!general.adminPassword.trim()) next['general.adminPassword'] = 'Password is required.';
    }

    if (s === 'balance') {
      const numericFields: Array<[keyof typeof balance, string]> = [
        ['definedBalance', 'Defined balance'],
        ['totalBalance', 'Total balance'],
        ['usedBalance', 'Used balance'],
        ['availableBalance', 'Available balance']
      ];
      for (const [k, label] of numericFields) {
        const raw = String(balance[k] ?? '').trim();
        if (!raw) continue;
        const n = Number(raw);
        if (!Number.isFinite(n)) next[`balance.${String(k)}`] = `${label} must be a number.`;
      }
    }

    setErrors((prev) => {
      // Clear only errors for this section, then apply next
      const cleared = { ...prev };
      const prefixes: Record<AddSection, string[]> = {
        general: ['general.'],
        invoice: ['invoice.'],
        financial: ['financial.'],
        balance: ['balance.'],
        account: ['accounts['],
        documents: ['documents.'],
        code: ['codes[']
      };
      for (const prefix of prefixes[s]) {
        for (const k of Object.keys(cleared)) {
          if (k.startsWith(prefix)) delete cleared[k];
        }
      }
      return { ...cleared, ...next };
    });

    return Object.keys(next).length === 0;
  };

  const validateAll = (): boolean => {
    // Validate key sections that can block save.
    const all: Record<string, string> = {};
    const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!general.companyName.trim()) all['general.companyName'] = 'Company name is required.';
    if (general.email.trim() && !isEmail(general.email.trim())) all['general.email'] = 'Enter a valid email address.';
    if (general.adminEmail.trim() && !isEmail(general.adminEmail.trim())) all['general.adminEmail'] = 'Enter a valid email address.';
    if (!general.adminUsername.trim()) all['general.adminUsername'] = 'Username is required.';
    if (!general.adminPassword.trim()) all['general.adminPassword'] = 'Password is required.';

    const numericFields: Array<[keyof typeof balance, string]> = [
      ['definedBalance', 'Defined balance'],
      ['totalBalance', 'Total balance'],
      ['usedBalance', 'Used balance'],
      ['availableBalance', 'Available balance']
    ];
    for (const [k, label] of numericFields) {
      const raw = String(balance[k] ?? '').trim();
      if (!raw) continue;
      const n = Number(raw);
      if (!Number.isFinite(n)) all[`balance.${String(k)}`] = `${label} must be a number.`;
    }

    setErrors(all);
    const first = firstSectionWithErrors(all);
    if (first) setSection(first);
    return Object.keys(all).length === 0;
  };

  const resetFormForNew = () => {
    setSelectedAgentId('');
    setEditingAgentId(null);
    setEditingCreatedAt(null);
    setNotice(null);
    setErrors({});
    const random = String(Math.floor(100000 + Math.random() * 900000));

    setSection('general');
    setGeneral({
      logoFile: null,
      iataType: 'IATA',
      mainAgency: '',
      externalAccountRegionCode: '',
      companyName: '',
      code: `IQT${random}`,
      email: '',
      phone: '',
      fax: '',
      mobile: '',
      country: 'Iraq',
      city: 'Erbil',
      region: '',
      address: '',
      adminGender: 'Mr',
      adminFirstName: '',
      adminLastName: '',
      adminEmail: '',
      adminPhone: '',
      adminUsername: '',
      adminPassword: ''
    });
    setInvoice({ title: '', taxOffice: '', taxNumber: '', city: 'Erbil', accountingCode: '', address: '' });
    setFinancial({
      type: 'Agent',
      notInvoiced: 'Default',
      creditCard: false,
      threeDPayment: true,
      accountClosureType: 'AccountingPeriod',
      paymentPeriod: '0',
      startDate: ''
    });
    setBalance({ currency: 'USD', definedBalance: '', totalBalance: '', usedBalance: '', availableBalance: '' });
    setAccounts([{ id: 'acc-0', type: 'Bank', accountName: '', currency: 'USD', ibanOrCardNumber: '' }]);
    setDocuments({ contractPdf: null, governmentPapersPdf: null });
    setCodes([{ id: 'code-0', type: '/*A - Star Alliance', code: '', description: '' }]);
    accountIdRef.current = 1;
    codeIdRef.current = 1;
  };

  const handleSave = () => {
    setNotice(null);
    if (!validateAll()) {
      setNotice({ type: 'error', message: 'Please fix the highlighted fields, then save again.' });
      return;
    }

    const now = new Date();
    const pad2 = (n: number) => String(n).padStart(2, '0');
    const registerDate = `${pad2(now.getDate())}.${pad2(now.getMonth() + 1)}.${now.getFullYear()} ${pad2(now.getHours())}:${pad2(now.getMinutes())}`;

    const id = editingAgentId ?? Date.now();
    const administratorName = `${general.adminFirstName} ${general.adminLastName}`.trim();

    const table = {
      id,
      status: 'Active',
      code: general.code,
      accountingCode: invoice.accountingCode,
      mainAgency: general.mainAgency,
      agencyName: general.companyName,
      invoice: invoice.title || general.companyName,
      administrator: administratorName || general.adminUsername || '-',
      country: general.country,
      city: general.city,
      region: general.region,
      registerDate,
      currency: balance.currency,
      credit: balance.definedBalance,
      totalBalance: balance.totalBalance,
      usedBalance: balance.usedBalance,
      availableBalance: balance.availableBalance,
      selected: false
    };

    const { logoFile, ...generalRest } = general;

    const payload = {
      general: {
        ...generalRest,
        logoFileName: logoFile?.name ?? null
      },
      invoice,
      financial,
      balance,
      accounts,
      documents: {
        contractPdfName: documents.contractPdf?.name ?? null,
        governmentPapersPdfName: documents.governmentPapersPdf?.name ?? null
      },
      codes
    };

    upsertStoredAgency({ id, createdAt: editingCreatedAt ?? now.toISOString(), table, form: payload });
    setStoredAgents(loadStoredAgencies());
    setNotice({ type: 'success', message: 'Saved locally.' });
    // Save only (no redirect)
  };

  const loadAgentIntoForm = (agentId: string) => {
    setSelectedAgentId(agentId);

    setNotice(null);
    setErrors({});

    if (!agentId) {
      setEditingAgentId(null);
      setEditingCreatedAt(null);
      // Keep the current form as-is when unselecting.
      return;
    }

    const found = storedAgents.find((a) => String(a.id) === agentId);
    if (!found) return;

    setEditingAgentId(found.id);
    setEditingCreatedAt(found.createdAt);
    setSection('general');

    const { logoFileName: _logoFileName, ...generalRest } = found.form.general;
    setGeneral({
      logoFile: null,
      ...generalRest
    });
    setInvoice(found.form.invoice);
    setFinancial(found.form.financial);
    setBalance(found.form.balance);
    setAccounts(found.form.accounts);
    setDocuments({ contractPdf: null, governmentPapersPdf: null });
    setCodes(found.form.codes);

    const maxAcc = Math.max(
      0,
      ...found.form.accounts
        .map((a) => Number(String(a.id).replace('acc-', '')))
        .filter((n) => Number.isFinite(n))
    );
    accountIdRef.current = maxAcc + 1;

    const maxCode = Math.max(
      0,
      ...found.form.codes
        .map((c) => Number(String(c.id).replace('code-', '')))
        .filter((n) => Number.isFinite(n))
    );
    codeIdRef.current = maxCode + 1;
  };

  return (
    <div className="min-h-screen bg-gray-100">
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
        <div className="text-sm text-blue-600 mb-4">
          <a href="/" className="hover:underline">Homepage</a>
          <span className="mx-2 text-gray-400">•</span>
          <a href="/agency/agencies" className="hover:underline">Agencies</a>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-gray-500">Add Agent</span>
        </div>

        <div className="border border-orange-500 bg-white">
          <div className="bg-orange-500 text-white px-6 py-4 text-2xl font-semibold">Add Agent</div>

          <div className="p-6">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-gray-600">
                Step <span className="font-semibold">{SECTION_ORDER.indexOf(section) + 1}</span> of{' '}
                <span className="font-semibold">{SECTION_ORDER.length}</span> — {SECTION_LABEL[section]}
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-md font-semibold cursor-pointer"
                  onClick={() => router.push('/agency/agencies')}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-white hover:bg-gray-50 text-orange-600 border border-orange-500 rounded-md font-semibold cursor-pointer"
                  onClick={resetFormForNew}
                >
                  New Agent
                </button>
              </div>
            </div>

            {notice && (
              <div
                className={
                  'mb-6 rounded-md border px-4 py-3 text-sm ' +
                  (notice.type === 'success'
                    ? 'border-green-200 bg-green-50 text-green-800'
                    : 'border-red-200 bg-red-50 text-red-800')
                }
                role="status"
              >
                {notice.message}
              </div>
            )}

            <div className="mb-6 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
              <label className="md:col-span-2 text-sm font-medium text-gray-700">Edit Existing Agent</label>
              <div className="md:col-span-6">
                <select
                  value={selectedAgentId}
                  onChange={(e) => loadAgentIntoForm(e.target.value)}
                  className="w-full border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:outline-none focus:border-orange-500"
                >
                  <option value="">Select an agent to edit</option>
                  {storedAgents.map((a) => {
                    const label = a.table.agencyName || a.form.general.companyName || a.table.code || String(a.id);
                    return (
                      <option key={a.id} value={String(a.id)}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
              {editingAgentId !== null && (
                <div className="md:col-span-4 text-sm text-gray-500">
                  Editing: <span className="font-semibold text-gray-700">{editingAgentId}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4">
                <div className="bg-white">
                  <SideItem
                    active={section === 'general'}
                    label="General Info"
                    onClick={() => setSection('general')}
                    icon={
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 10a4 4 0 100-8 4 4 0 000 8zm-7 8a7 7 0 0114 0H3z" />
                      </svg>
                    }
                  />
                  <SideItem
                    active={section === 'invoice'}
                    label="Invoice Informations"
                    onClick={() => setSection('invoice')}
                    icon={
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0011.414 6L8 2.586A2 2 0 006.586 2H4zm6 1.5V7a1 1 0 001 1h3.5L10 3.5z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                  <SideItem
                    active={section === 'financial'}
                    label="Financial Info"
                    onClick={() => setSection('financial')}
                    icon={
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4h12v3H4V4zm0 5h12v3H4V9zm0 5h12v3H4v-3z" />
                      </svg>
                    }
                  />
                  <SideItem
                    active={section === 'balance'}
                    label="Balance Info"
                    onClick={() => setSection('balance')}
                    icon={
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 6a1 1 0 011-1h12a1 1 0 011 1v8a1 1 0 01-1 1H4a1 1 0 01-1-1V6zm3 1a1 1 0 100 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                  <SideItem
                    active={section === 'account'}
                    label="Account Informations"
                    onClick={() => setSection('account')}
                    icon={
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 6h12v2H4V6zm0 4h12v2H4v-2zm0 4h12v2H4v-2z" />
                      </svg>
                    }
                  />
                  <SideItem
                    active={section === 'documents'}
                    label="Documents"
                    onClick={() => setSection('documents')}
                    icon={
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H4zm7 1.5V7a1 1 0 001 1h3.5L11 3.5z" clipRule="evenodd" />
                      </svg>
                    }
                  />
                  <SideItem
                    active={section === 'code'}
                    label="Code"
                    onClick={() => setSection('code')}
                    icon={
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M7 4a1 1 0 000 2h6a1 1 0 100-2H7zm-2 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zm1 3a1 1 0 100 2h8a1 1 0 100-2H6z" />
                      </svg>
                    }
                  />
                </div>
              </div>

              <div className="lg:col-span-8">
                {section === 'general' && (
                  <div>
                    <div className="flex items-start justify-between">
                      <h2 className="text-2xl text-gray-700">General Info</h2>
                      <div className="text-right">
                        <Image src="/logo.png" alt="Agency Logo" width={110} height={55} className="object-contain" />
                      </div>
                    </div>
                    <div className="border-b border-gray-200 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Logo ( 270*144 px )</label>
                        <input
                          type="file"
                          accept="image/*"
                          className={fileInputClass}
                          onChange={(e) => {
                            setGeneral((p) => ({ ...p, logoFile: e.target.files?.[0] ?? null }));
                          }}
                        />
                        {general.logoFile && <div className="mt-2 text-sm text-gray-600">{general.logoFile.name}</div>}
                        {logoPreviewUrl && (
                          <div className="mt-3">
                            <div className="text-xs text-gray-500 mb-2">Preview</div>
                            <img
                              src={logoPreviewUrl}
                              alt="Selected logo preview"
                              className="h-16 w-auto border border-gray-200 bg-white object-contain"
                            />
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">IATA Type</label>
                        <select
                          className={inputMutedClass + ' cursor-pointer'}
                          value={general.iataType}
                          onChange={(e) => setGeneral((p) => ({ ...p, iataType: e.target.value }))}
                        >
                          <option>IATA</option>
                          <option>Non-IATA</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Main Agency</label>
                        <input
                          className={inputClass}
                          value={general.mainAgency}
                          onChange={(e) => setGeneral((p) => ({ ...p, mainAgency: e.target.value }))}
                          placeholder="Main agency name"
                        />
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">External Account Region Code</label>
                        <input
                          className={inputClass}
                          value={general.externalAccountRegionCode}
                          onChange={(e) => setGeneral((p) => ({ ...p, externalAccountRegionCode: e.target.value }))}
                          placeholder="Region code"
                        />
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">
                          Company Name <span className="text-red-600">*</span>
                        </label>
                        <input
                          className={inputClass}
                          value={general.companyName}
                          onChange={(e) => {
                            clearError('general.companyName');
                            setGeneral((p) => ({ ...p, companyName: e.target.value }));
                          }}
                          placeholder="Company / agency name"
                          aria-invalid={!!errors['general.companyName']}
                          aria-describedby={errors['general.companyName'] ? 'err-general-companyName' : undefined}
                        />
                        {errors['general.companyName'] && (
                          <div id="err-general-companyName" className="mt-1 text-sm text-red-600">
                            {errors['general.companyName']}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Code</label>
                        <div className="px-4 py-2 text-gray-800 border border-gray-300 bg-gray-50">
                          {general.code || 'Generating...'}
                        </div>
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">E-mail</label>
                        <input
                          type="email"
                          className={inputClass}
                          value={general.email}
                          onChange={(e) => {
                            clearError('general.email');
                            setGeneral((p) => ({ ...p, email: e.target.value }));
                          }}
                          placeholder="name@example.com"
                          aria-invalid={!!errors['general.email']}
                          aria-describedby={errors['general.email'] ? 'err-general-email' : undefined}
                        />
                        {errors['general.email'] && (
                          <div id="err-general-email" className="mt-1 text-sm text-red-600">
                            {errors['general.email']}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Phone</label>
                        <input
                          type="tel"
                          className={inputClass}
                          value={general.phone}
                          onChange={(e) => setGeneral((p) => ({ ...p, phone: e.target.value }))}
                          placeholder="+964 ..."
                        />
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Fax</label>
                        <input
                          className={inputClass}
                          value={general.fax}
                          onChange={(e) => setGeneral((p) => ({ ...p, fax: e.target.value }))}
                          placeholder="Fax number"
                        />
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Mobile</label>
                        <input
                          type="tel"
                          className={inputClass}
                          value={general.mobile}
                          onChange={(e) => setGeneral((p) => ({ ...p, mobile: e.target.value }))}
                          placeholder="Mobile number"
                        />
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Country - City</label>
                        <div className="grid grid-cols-2 gap-4">
                          <select
                            className={inputClass + ' cursor-pointer'}
                            value={general.country}
                            onChange={(e) => setGeneral((p) => ({ ...p, country: e.target.value }))}
                          >
                            <option value="Iraq">Iraq</option>
                            <option value="Turkey">Turkey</option>
                          </select>
                          <select
                            className={inputClass + ' cursor-pointer'}
                            value={general.city}
                            onChange={(e) => setGeneral((p) => ({ ...p, city: e.target.value }))}
                          >
                            <option value="Erbil">Erbil</option>
                            <option value="Baghdad">Baghdad</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Region</label>
                        <input
                          className={inputClass}
                          value={general.region}
                          onChange={(e) => setGeneral((p) => ({ ...p, region: e.target.value }))}
                          placeholder="Region"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-orange-600 font-semibold mb-2">Address</label>
                        <textarea
                          className={textareaClass}
                          value={general.address}
                          onChange={(e) => setGeneral((p) => ({ ...p, address: e.target.value }))}
                          placeholder="Full address"
                        />
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-2xl text-gray-600">Agent Info</h3>
                      <div className="border-b border-gray-200 my-4" />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">Gender</label>
                          <select
                            className={inputClass + ' cursor-pointer'}
                            value={general.adminGender}
                            onChange={(e) => setGeneral((p) => ({ ...p, adminGender: e.target.value }))}
                          >
                            <option>Mr</option>
                            <option>Mrs</option>
                            <option>Ms</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">Name</label>
                          <input
                            className={inputClass}
                            value={general.adminFirstName}
                            onChange={(e) => setGeneral((p) => ({ ...p, adminFirstName: e.target.value }))}
                            placeholder="First name"
                          />
                        </div>
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">Last Name</label>
                          <input
                            className={inputClass}
                            value={general.adminLastName}
                            onChange={(e) => setGeneral((p) => ({ ...p, adminLastName: e.target.value }))}
                            placeholder="Last name"
                          />
                        </div>
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">E-mail</label>
                          <input
                            type="email"
                            className={inputClass}
                            value={general.adminEmail}
                            onChange={(e) => {
                              clearError('general.adminEmail');
                              setGeneral((p) => ({ ...p, adminEmail: e.target.value }));
                            }}
                            placeholder="admin@example.com"
                            aria-invalid={!!errors['general.adminEmail']}
                            aria-describedby={errors['general.adminEmail'] ? 'err-general-adminEmail' : undefined}
                          />
                          {errors['general.adminEmail'] && (
                            <div id="err-general-adminEmail" className="mt-1 text-sm text-red-600">
                              {errors['general.adminEmail']}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">Phone</label>
                          <input
                            type="tel"
                            className={inputClass}
                            value={general.adminPhone}
                            onChange={(e) => setGeneral((p) => ({ ...p, adminPhone: e.target.value }))}
                            placeholder="+964 ..."
                          />
                        </div>
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">
                            User Name <span className="text-red-600">*</span>
                          </label>
                          <input
                            className={inputClass}
                            value={general.adminUsername}
                            onChange={(e) => {
                              clearError('general.adminUsername');
                              setGeneral((p) => ({ ...p, adminUsername: e.target.value }));
                            }}
                            placeholder="Username"
                            aria-invalid={!!errors['general.adminUsername']}
                            aria-describedby={errors['general.adminUsername'] ? 'err-general-adminUsername' : undefined}
                          />
                          {errors['general.adminUsername'] && (
                            <div id="err-general-adminUsername" className="mt-1 text-sm text-red-600">
                              {errors['general.adminUsername']}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">
                            Password <span className="text-red-600">*</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <PasswordInput
                              value={general.adminPassword}
                              onChange={(e) => {
                                clearError('general.adminPassword');
                                setGeneral((p) => ({ ...p, adminPassword: e.target.value }));
                              }}
                              placeholder="Password"
                              className="flex-1 flex items-center gap-3"
                              inputClassName="flex-1 border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                            />
                            <button
                              type="button"
                              className="shrink-0 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-md font-semibold cursor-pointer"
                              onClick={() => setGeneral((p) => ({ ...p, adminPassword: generatePassword(12) }))}
                            >
                              Generate
                            </button>
                          </div>
                          {errors['general.adminPassword'] && (
                            <div id="err-general-adminPassword" className="mt-1 text-sm text-red-600">
                              {errors['general.adminPassword']}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {section === 'invoice' && (
                  <div>
                    <h2 className="text-2xl text-gray-700">Invoice Information</h2>
                    <div className="border-b border-gray-200 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[
                        { k: 'Title', v: invoice.title, set: (val: string) => setInvoice((p) => ({ ...p, title: val })) },
                        { k: 'Tax Office', v: invoice.taxOffice, set: (val: string) => setInvoice((p) => ({ ...p, taxOffice: val })) },
                        { k: 'Tax Number', v: invoice.taxNumber, set: (val: string) => setInvoice((p) => ({ ...p, taxNumber: val })) },
                        { k: 'City', v: invoice.city, set: (val: string) => setInvoice((p) => ({ ...p, city: val })) },
                        { k: 'Accounting Code', v: invoice.accountingCode, set: (val: string) => setInvoice((p) => ({ ...p, accountingCode: val })) }
                      ].map((row) => (
                        <div key={row.k}>
                          <label className="block text-orange-600 font-semibold mb-2">{row.k}</label>
                          <input
                            className={inputClass}
                            value={row.v}
                            onChange={(e) => row.set(e.target.value)}
                            placeholder={row.k}
                          />
                        </div>
                      ))}
                      <div className="md:col-span-2">
                        <label className="block text-orange-600 font-semibold mb-2">Address</label>
                        <textarea
                          className={textareaClass}
                          value={invoice.address}
                          onChange={(e) => setInvoice((p) => ({ ...p, address: e.target.value }))}
                          placeholder="Invoice address"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {section === 'financial' && (
                  <div>
                    <h2 className="text-2xl text-gray-700">Financial Info</h2>
                    <div className="border-b border-gray-200 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Type</label>
                        <input
                          className={inputClass}
                          value={financial.type}
                          onChange={(e) => setFinancial((p) => ({ ...p, type: e.target.value }))}
                          placeholder="Agent"
                        />
                      </div>
                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Not invoiced</label>
                        <input
                          className={inputClass}
                          value={financial.notInvoiced}
                          onChange={(e) => setFinancial((p) => ({ ...p, notInvoiced: e.target.value }))}
                          placeholder="Default"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={financial.creditCard} onChange={(e) => setFinancial((p) => ({ ...p, creditCard: e.target.checked }))} />
                        <span className="text-orange-600 font-semibold">Credit Card</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input type="checkbox" checked={financial.threeDPayment} onChange={(e) => setFinancial((p) => ({ ...p, threeDPayment: e.target.checked }))} />
                        <span className="text-orange-600 font-semibold">3D Payment</span>
                      </div>
                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Account Closure Type</label>
                        <input
                          className={inputClass}
                          value={financial.accountClosureType}
                          onChange={(e) => setFinancial((p) => ({ ...p, accountClosureType: e.target.value }))}
                          placeholder="AccountingPeriod"
                        />
                      </div>
                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Payment Period</label>
                        <input
                          className={inputClass}
                          value={financial.paymentPeriod}
                          onChange={(e) => setFinancial((p) => ({ ...p, paymentPeriod: e.target.value }))}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Start Date</label>
                        <input
                          type="date"
                          className={inputClass}
                          value={financial.startDate}
                          onChange={(e) => setFinancial((p) => ({ ...p, startDate: e.target.value }))}
                        />
                        <div className="mt-1 text-xs text-gray-500">Optional</div>
                      </div>
                    </div>
                  </div>
                )}

                {section === 'balance' && (
                  <div>
                    <h2 className="text-2xl text-gray-700">Balance Info</h2>
                    <div className="border-b border-gray-200 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Currency</label>
                        <select className={inputClass + ' cursor-pointer'} value={balance.currency} onChange={(e) => setBalance((p) => ({ ...p, currency: e.target.value }))}>
                          <option value="USD">USD</option>
                          <option value="IQD">IQD</option>
                          <option value="TRY">TRY</option>
                        </select>
                      </div>
                      {[
                        { k: 'Defined Balance', v: balance.definedBalance, set: (val: string) => setBalance((p) => ({ ...p, definedBalance: val })) },
                        { k: 'Total Balance', v: balance.totalBalance, set: (val: string) => setBalance((p) => ({ ...p, totalBalance: val })) },
                        { k: 'Used Balance', v: balance.usedBalance, set: (val: string) => setBalance((p) => ({ ...p, usedBalance: val })) },
                        { k: 'Available Balance', v: balance.availableBalance, set: (val: string) => setBalance((p) => ({ ...p, availableBalance: val })) }
                      ].map((row) => (
                        <div key={row.k}>
                          <label className="block text-orange-600 font-semibold mb-2">{row.k}</label>
                          <input
                            inputMode="decimal"
                            className={inputClass}
                            value={row.v}
                            onChange={(e) => {
                              const key = `balance.${row.k.replace(/\s+/g, '').replace(/^./, (c) => c.toLowerCase())}`;
                              clearError(key);
                              row.set(e.target.value);
                            }}
                            placeholder={row.k}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'account' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl text-gray-700">Account Informations</h2>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-400 hover:bg-teal-500 text-white rounded-md font-semibold cursor-pointer"
                        onClick={() =>
                          setAccounts((p) => [
                            ...p,
                            { id: nextAccountId(), type: 'Bank', accountName: '', currency: 'USD', ibanOrCardNumber: '' }
                          ])
                        }
                      >
                        <span className="text-xl leading-none">+</span> New
                      </button>
                    </div>
                    <div className="border-b border-gray-200 my-4" />

                    <div className="border border-gray-200 bg-white overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-6 py-4 text-left text-orange-600 font-semibold">Type</th>
                              <th className="px-6 py-4 text-left text-orange-600 font-semibold">Account Name</th>
                              <th className="px-6 py-4 text-left text-orange-600 font-semibold">Currency</th>
                              <th className="px-6 py-4 text-left text-orange-600 font-semibold">IBAN , Card Number</th>
                              <th className="px-6 py-4"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {accounts.map((row) => (
                              <tr key={row.id} className="border-t border-gray-200">
                                <td className="px-6 py-4">
                                  <select
                                    className={
                                      'w-full border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:border-orange-500 cursor-pointer'
                                    }
                                    value={row.type}
                                    onChange={(e) => setAccounts((p) => p.map((r) => (r.id === row.id ? { ...r, type: e.target.value } : r)))}
                                  >
                                    <option>Bank</option>
                                    <option>Card</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4">
                                  <input
                                    className="w-full border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                                    value={row.accountName}
                                    onChange={(e) => setAccounts((p) => p.map((r) => (r.id === row.id ? { ...r, accountName: e.target.value } : r)))}
                                    placeholder="Account name"
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  <select
                                    className={
                                      'w-full border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:border-orange-500 cursor-pointer'
                                    }
                                    value={row.currency}
                                    onChange={(e) => setAccounts((p) => p.map((r) => (r.id === row.id ? { ...r, currency: e.target.value } : r)))}
                                  >
                                    <option>USD</option>
                                    <option>IQD</option>
                                    <option>TRY</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4">
                                  <input
                                    className="w-full border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                                    value={row.ibanOrCardNumber}
                                    onChange={(e) => setAccounts((p) => p.map((r) => (r.id === row.id ? { ...r, ibanOrCardNumber: e.target.value } : r)))}
                                    placeholder="IBAN or card number"
                                  />
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <button
                                    type="button"
                                    className="w-10 h-10 inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md font-bold cursor-pointer"
                                    onClick={() => {
                                      if (accounts.length <= 1) {
                                        setNotice({ type: 'error', message: 'At least one account row is required.' });
                                        return;
                                      }
                                      if (confirm('Remove this account row?')) {
                                        setAccounts((p) => p.filter((r) => r.id !== row.id));
                                      }
                                    }}
                                    aria-label="Remove account row"
                                  >
                                    ×
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {section === 'documents' && (
                  <div>
                    <h2 className="text-2xl text-gray-700">Documents</h2>
                    <div className="border-b border-gray-200 my-4" />

                    <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Company Contract (Acente Sözleşmesi) PDF</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          className={fileInputClass}
                          onChange={(e) => setDocuments((p) => ({ ...p, contractPdf: e.target.files?.[0] ?? null }))}
                        />
                        {documents.contractPdf && <div className="mt-2 text-sm text-gray-600">{documents.contractPdf.name}</div>}
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Government Papers (Şirket Evrakları) PDF</label>
                        <input
                          type="file"
                          accept="application/pdf"
                          className={fileInputClass}
                          onChange={(e) => setDocuments((p) => ({ ...p, governmentPapersPdf: e.target.files?.[0] ?? null }))}
                        />
                        {documents.governmentPapersPdf && <div className="mt-2 text-sm text-gray-600">{documents.governmentPapersPdf.name}</div>}
                      </div>
                    </div>
                  </div>
                )}

                {section === 'code' && (
                  <div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl text-gray-700">Code</h2>
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-teal-400 hover:bg-teal-500 text-white rounded-md font-semibold cursor-pointer"
                        onClick={() =>
                          setCodes((p) => [
                            ...p,
                            { id: nextCodeId(), type: '/*A - Star Alliance', code: '', description: '' }
                          ])
                        }
                      >
                        <span className="text-xl leading-none">+</span> New
                      </button>
                    </div>
                    <div className="border-b border-gray-200 my-4" />

                    <div className="border border-gray-200 bg-white overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-6 py-4 text-center text-orange-600 font-semibold">Type</th>
                              <th className="px-6 py-4 text-center text-orange-600 font-semibold">Code</th>
                              <th className="px-6 py-4 text-center text-orange-600 font-semibold">Description</th>
                              <th className="px-6 py-4 text-center"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {codes.map((row) => (
                              <tr key={row.id} className="border-t border-gray-200">
                                <td className="px-6 py-4">
                                  <select
                                    className={
                                      'w-full border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:border-orange-500 cursor-pointer'
                                    }
                                    value={row.type}
                                    onChange={(e) => setCodes((p) => p.map((r) => (r.id === row.id ? { ...r, type: e.target.value } : r)))}
                                  >
                                    <option>/*A - Star Alliance</option>
                                    <option>/*O - Oneworld</option>
                                    <option>/*S - SkyTeam Alliance</option>
                                  </select>
                                </td>
                                <td className="px-6 py-4">
                                  <input
                                    className="w-full border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                                    value={row.code}
                                    onChange={(e) => setCodes((p) => p.map((r) => (r.id === row.id ? { ...r, code: e.target.value } : r)))}
                                    placeholder="Code"
                                  />
                                </td>
                                <td className="px-6 py-4">
                                  <input
                                    className="w-full border border-gray-300 px-3 py-2 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                                    value={row.description}
                                    onChange={(e) => setCodes((p) => p.map((r) => (r.id === row.id ? { ...r, description: e.target.value } : r)))}
                                    placeholder="Description"
                                  />
                                </td>
                                <td className="px-6 py-4 text-center">
                                  <button
                                    type="button"
                                    className="w-10 h-10 inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md font-bold cursor-pointer"
                                    onClick={() => {
                                      if (codes.length <= 1) {
                                        setNotice({ type: 'error', message: 'At least one code row is required.' });
                                        return;
                                      }
                                      if (confirm('Remove this code row?')) {
                                        setCodes((p) => p.filter((r) => r.id !== row.id));
                                      }
                                    }}
                                    aria-label="Remove code row"
                                  >
                                    ×
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-10 flex items-center justify-between">
                  <button
                    type="button"
                    className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-md font-semibold cursor-pointer"
                    onClick={goPrev}
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold cursor-pointer"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button type="button" className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-semibold cursor-pointer" onClick={goNext}>
                      Next
                    </button>
                  </div>
                </div>
              </div>
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
