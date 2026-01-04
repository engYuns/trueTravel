'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import HeaderUserMenu from '@/components/HeaderUserMenu';
import PasswordInput from '@/components/PasswordInput';
import { findStoredAgency } from '@/lib/agencyStorage';

type DetailSection =
  | 'general'
  | 'invoice'
  | 'financial'
  | 'balance'
  | 'account'
  | 'documents'
  | 'code';

type AgencyDetail = {
  id: string;
  title: string;
  agencyName: string;
  code: string;
  email: string;
  phone: string;
  fax: string;
  mobile: string;
  country: string;
  city: string;
  region: string;
  address: string;
  currency: string;
  credit: string;
  totalBalance: string;
  usedBalance: string;
  availableBalance: string;
  taxOffice: string;
  taxNumber: string;
  accountingCode: string;
  administrator: {
    gender: 'Mr' | 'Mrs' | 'Ms';
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    username: string;
  };
};

const SAMPLE_BY_ID: Record<string, AgencyDetail> = {
  '1': {
    id: '1',
    title: 'Agency Detail',
    agencyName: 'True Travel',
    code: 'IQT031168',
    email: 'sales@truetraveliq.com',
    phone: '+964 750 328 2768',
    fax: '+90 501 234 5678',
    mobile: '+964 750 328 2768',
    country: 'Iraq',
    city: 'Erbil',
    region: '',
    address: 'Erbil ,Gulan St Near Nazdar Bamarny hospital, 44001',
    currency: 'USD',
    credit: '3000.00',
    totalBalance: '3000.00',
    usedBalance: '50.78',
    availableBalance: '2949.22',
    taxOffice: 'Erbil',
    taxNumber: '11111111111',
    accountingCode: '120.01.15693',
    administrator: {
      gender: 'Mr',
      firstName: 'Ahmed',
      lastName: 'Hasan',
      email: 'sales@truetraveliq.com',
      phone: '+964 750 328 2768',
      username: 'sales@truetraveliq.com'
    }
  }
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

export default function AgencyDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = String(params?.id ?? '');

  const initialAgency = useMemo<AgencyDetail>(() => {
    return SAMPLE_BY_ID[id] ?? {
      ...SAMPLE_BY_ID['1'],
      id,
      agencyName: `Agency ${id || 'Detail'}`,
      code: id ? `CODE-${id}` : 'CODE',
      title: 'Agency Detail'
    };
  }, [id]);

  const [agency, setAgency] = useState<AgencyDetail>(initialAgency);

  useEffect(() => {
    setAgency(initialAgency);
    const stored = findStoredAgency(id);
    if (!stored) return;

    const g = stored.form.general;
    const inv = stored.form.invoice;
    const bal = stored.form.balance;
    const adminName = `${g.adminFirstName} ${g.adminLastName}`.trim();

    setAgency({
      id: String(stored.id),
      title: 'Agency Detail',
      agencyName: g.companyName,
      code: g.code,
      email: g.email,
      phone: g.phone,
      fax: g.fax,
      mobile: g.mobile,
      country: g.country,
      city: g.city,
      region: g.region,
      address: g.address,
      currency: bal.currency,
      credit: bal.definedBalance,
      totalBalance: bal.totalBalance,
      usedBalance: bal.usedBalance,
      availableBalance: bal.availableBalance,
      taxOffice: inv.taxOffice,
      taxNumber: inv.taxNumber,
      accountingCode: inv.accountingCode,
      administrator: {
        gender: (g.adminGender as 'Mr' | 'Mrs' | 'Ms') ?? 'Mr',
        firstName: g.adminFirstName,
        lastName: g.adminLastName,
        email: g.adminEmail,
        phone: g.adminPhone,
        username: g.adminUsername || adminName
      }
    });
  }, [id, initialAgency]);

  const [section, setSection] = useState<DetailSection>('general');

  const handleLogout = () => {
    document.cookie = 'isLoggedIn=false; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/');
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
          <span className="text-gray-500">Agency Detail</span>
        </div>

        <div className="border border-orange-500 bg-white">
          <div className="bg-orange-500 text-white px-6 py-4 text-2xl font-semibold">Agency Detail</div>

          <div className="p-6">
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
                      <h2 className="text-2xl text-gray-700">Agency Detail</h2>
                      <div className="text-right">
                        <Image src="/logo.png" alt="Agency Logo" width={110} height={55} className="object-contain" />
                      </div>
                    </div>
                    <div className="border-b border-gray-200 my-4" />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Logo ( 270*144 px )</label>
                        <div className="flex items-center gap-3">
                          <button type="button" className="w-40 h-12 border border-blue-400 bg-white flex items-center justify-center text-blue-600">
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H4zm0 2h6v4a2 2 0 002 2h4v4H4V5z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <button type="button" className="w-40 h-12 border border-red-300 bg-white text-red-500 font-semibold">✕Delete</button>
                        </div>
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">IATA Type</label>
                        <select className="w-full border border-gray-300 bg-gray-50 px-4 py-2">
                          <option>IATA</option>
                          <option>Non-IATA</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Main Agency</label>
                        <input className="w-full border border-gray-300 bg-white px-4 py-2" defaultValue="Merkez Acenta" />
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">External Account Region Code</label>
                        <input className="w-full border border-gray-300 bg-white px-4 py-2" defaultValue="" />
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Company Name</label>
                        <input className="w-full border border-red-200 bg-gray-100 px-4 py-2" defaultValue={agency.agencyName} />
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Code</label>
                        <div className="px-4 py-2 text-gray-800">{agency.code}</div>
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">E-mail</label>
                        <input className="w-full border border-gray-300 bg-white px-4 py-2" defaultValue={agency.email} />
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Phone</label>
                        <input className="w-full border border-red-200 bg-gray-100 px-4 py-2" defaultValue={agency.phone} />
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Fax</label>
                        <input className="w-full border border-gray-300 bg-white px-4 py-2" defaultValue={agency.fax} />
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Mobile</label>
                        <input className="w-full border border-gray-300 bg-white px-4 py-2" defaultValue={agency.mobile} />
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Country - City</label>
                        <div className="grid grid-cols-2 gap-4">
                          <select className="w-full border border-gray-300 bg-white px-4 py-2" defaultValue={agency.country}>
                            <option value="Iraq">Iraq</option>
                            <option value="Turkey">Turkey</option>
                          </select>
                          <select className="w-full border border-gray-300 bg-white px-4 py-2" defaultValue={agency.city}>
                            <option value="Erbil">Erbil</option>
                            <option value="Baghdad">Baghdad</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-orange-600 font-semibold mb-2">Region</label>
                        <input className="w-full border border-gray-300 bg-white px-4 py-2" defaultValue={agency.region} />
                      </div>

                      <div className="md:col-span-2">
                        <label className="block text-orange-600 font-semibold mb-2">Address</label>
                        <textarea className="w-full border border-gray-300 bg-white px-4 py-2 min-h-20" defaultValue={agency.address} />
                      </div>
                    </div>

                    <div className="mt-8">
                      <h3 className="text-2xl text-gray-600">Admin Info</h3>
                      <div className="border-b border-gray-200 my-4" />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">Gender</label>
                          <select className="w-full border border-gray-300 bg-white px-4 py-2" defaultValue={agency.administrator.gender}>
                            <option>Mr</option>
                            <option>Mrs</option>
                            <option>Ms</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">Name</label>
                          <input className="w-full border border-red-200 bg-gray-100 px-4 py-2" defaultValue={agency.administrator.firstName} />
                        </div>
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">Last Name</label>
                          <input className="w-full border border-red-200 bg-gray-100 px-4 py-2" defaultValue={agency.administrator.lastName} />
                        </div>
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">E-mail</label>
                          <input className="w-full border border-red-200 bg-gray-100 px-4 py-2" defaultValue={agency.administrator.email} />
                        </div>
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">Phone</label>
                          <input className="w-full border border-red-200 bg-gray-100 px-4 py-2" defaultValue={agency.administrator.phone} />
                        </div>
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">User Name</label>
                          <input className="w-full border border-red-200 bg-gray-100 px-4 py-2" defaultValue={agency.administrator.username} />
                        </div>
                        <div>
                          <label className="block text-orange-600 font-semibold mb-2">Password</label>
                          <PasswordInput
                            defaultValue=""
                            placeholder="••••••••"
                            className="flex items-center gap-3"
                            inputClassName="flex-1 w-full border border-gray-300 bg-gray-100 px-4 py-2 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-500"
                            buttonClassName="shrink-0 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-md font-semibold cursor-pointer"
                          />
                        </div>
                      </div>

                      <div className="mt-8 flex justify-end">
                        <button type="button" className="inline-flex items-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-semibold">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414l2.793 2.793 7.793-7.793a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Update
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {section === 'invoice' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 py-6">
                    {[
                      ['Title', agency.agencyName],
                      ['Tax Office', agency.taxOffice],
                      ['Tax Number', agency.taxNumber],
                      ['City', agency.city],
                      ['Accounting Code', agency.accountingCode],
                      ['Address', agency.address]
                    ].map(([k, v]) => (
                      <div key={k} className={k === 'Address' ? 'md:col-span-2' : ''}>
                        <div className="text-orange-600 font-semibold">{k}</div>
                        <div className="text-gray-800 mt-1">{v}</div>
                      </div>
                    ))}
                  </div>
                )}

                {section === 'financial' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-6 py-6">
                    <div>
                      <div className="text-orange-600 font-semibold">Type</div>
                      <div className="text-gray-800 mt-1">Agent</div>
                    </div>
                    <div>
                      <div className="text-orange-600 font-semibold">Not invoiced</div>
                      <div className="text-gray-800 mt-1">Default</div>
                    </div>
                    <div>
                      <div className="text-orange-600 font-semibold">Credit Card</div>
                      <div className="text-gray-800 mt-1">✖</div>
                    </div>
                    <div>
                      <div className="text-orange-600 font-semibold">3D Payment</div>
                      <div className="text-gray-800 mt-1">✔</div>
                    </div>
                    <div>
                      <div className="text-orange-600 font-semibold">Account Closure Type</div>
                      <div className="text-gray-800 mt-1">AccountingPeriod</div>
                    </div>
                    <div>
                      <div className="text-orange-600 font-semibold">Payment Period</div>
                      <div className="text-gray-800 mt-1">0</div>
                    </div>
                    <div>
                      <div className="text-orange-600 font-semibold">Start Date</div>
                      <div className="text-gray-800 mt-1">12.05.2023</div>
                    </div>
                  </div>
                )}

                {section === 'balance' && (
                  <div className="py-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                      {[
                        { title: 'Defined Balance', percent: '100%', value: `${agency.credit} ${agency.currency}`, ring: 'text-blue-600', stroke: '#2563eb' },
                        { title: 'Total Balance', percent: '100%', value: `${agency.totalBalance} ${agency.currency}`, ring: 'text-orange-600', stroke: '#f97316' },
                        { title: 'Used Balance', percent: '2%', value: `${agency.usedBalance} ${agency.currency}`, ring: 'text-red-600', stroke: '#dc2626' },
                        { title: 'Available Balance', percent: '98%', value: `${agency.availableBalance} ${agency.currency}`, ring: 'text-green-600', stroke: '#16a34a' }
                      ].map((c) => (
                        <div key={c.title} className="text-center">
                          <div className="text-lg font-semibold text-gray-800 mb-4">{c.title}</div>
                          <div className="relative w-28 h-28 mx-auto mb-4">
                            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="10" fill="none" />
                              <circle cx="50" cy="50" r="40" stroke={c.stroke} strokeWidth="10" fill="none" strokeDasharray="251.2" strokeDashoffset="0" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className={`text-xl font-bold ${c.ring}`}>{c.percent}</span>
                            </div>
                          </div>
                          <div className="text-lg font-bold text-gray-900">{c.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {section === 'account' && (
                  <div className="py-6">
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
                            <tr>
                              <td className="px-6 py-12 text-gray-500" colSpan={5}>
                                No accounts
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {section === 'documents' && (
                  <div className="py-6">
                    <div className="border border-gray-200 bg-white overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-600 text-white">
                            <tr>
                              <th className="px-6 py-4 text-left font-semibold">File</th>
                              <th className="px-6 py-4 text-left font-semibold">Date Range</th>
                              <th className="px-6 py-4 text-left font-semibold">Description</th>
                              <th className="px-6 py-4"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {[
                              {
                                key: 'contract',
                                desc: 'Acente Sözleşmesi',
                                pdfUrl: '/docs/company-contract.pdf'
                              },
                              {
                                key: 'government',
                                desc: 'Şirket Evrakları',
                                pdfUrl: '/docs/government-papers.pdf'
                              }
                            ].map((row) => (
                              <tr key={row.key} className="border-t border-gray-200">
                                <td className="px-6 py-4">
                                  <button
                                    type="button"
                                    onClick={() => window.open(row.pdfUrl, '_blank', 'noopener,noreferrer')}
                                    className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md font-semibold"
                                  >
                                    Detail
                                  </button>
                                </td>
                                <td className="px-6 py-4 text-gray-700">-</td>
                                <td className="px-6 py-4 text-gray-800">{row.desc}</td>
                                <td className="px-6 py-4"></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {section === 'code' && (
                  <div className="py-6">
                    <div className="border border-gray-200 bg-white overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="px-6 py-4 text-center text-orange-600 font-semibold">Type</th>
                              <th className="px-6 py-4 text-center text-orange-600 font-semibold">Code</th>
                              <th className="px-6 py-4 text-center text-orange-600 font-semibold">Description</th>
                              <th className="px-6 py-4 text-center">
                                <button type="button" className="inline-flex items-center gap-2 px-4 py-2 bg-teal-400 hover:bg-teal-500 text-white rounded-md font-semibold">
                                  <span className="text-xl leading-none">+</span> New
                                </button>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-t border-gray-200">
                              <td className="px-6 py-4">
                                <select className="w-full border border-gray-300 px-3 py-2 bg-white">
                                  <option>/*A - Star Alliance</option>
                                  <option>/*O - Oneworld</option>
                                  <option>/*S - SkyTeam Alliance</option>
                                </select>
                              </td>
                              <td className="px-6 py-4">
                                <input className="w-full border border-gray-300 px-3 py-2" />
                              </td>
                              <td className="px-6 py-4">
                                <input className="w-full border border-gray-300 px-3 py-2" />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <button type="button" className="w-10 h-10 inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md font-bold">×</button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button type="button" className="inline-flex items-center gap-2 px-8 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-md font-semibold">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8.5 8.5a1 1 0 01-1.414 0l-3.5-3.5a1 1 0 011.414-1.414l2.793 2.793 7.793-7.793a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Update
                      </button>
                    </div>
                  </div>
                )}
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
