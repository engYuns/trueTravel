export type AgencyTableRow = {
  id: number;
  status: string;
  code: string;
  accountingCode: string;
  mainAgency: string;
  agencyName: string;
  invoice: string;
  administrator: string;
  country: string;
  city: string;
  region: string;
  registerDate: string;
  currency: string;
  credit: string;
  totalBalance: string;
  usedBalance: string;
  availableBalance: string;
  selected?: boolean;
};

export type StoredAgency = {
  id: number;
  createdAt: string;
  table: AgencyTableRow;
  form: {
    general: {
      iataType: string;
      mainAgency: string;
      externalAccountRegionCode: string;
      companyName: string;
      code: string;
      email: string;
      phone: string;
      fax: string;
      mobile: string;
      country: string;
      city: string;
      region: string;
      address: string;
      adminGender: string;
      adminFirstName: string;
      adminLastName: string;
      adminEmail: string;
      adminPhone: string;
      adminUsername: string;
      adminPassword: string;
      logoFileName: string | null;
    };
    invoice: {
      title: string;
      taxOffice: string;
      taxNumber: string;
      city: string;
      accountingCode: string;
      address: string;
    };
    financial: {
      type: string;
      notInvoiced: string;
      creditCard: boolean;
      threeDPayment: boolean;
      accountClosureType: string;
      paymentPeriod: string;
      startDate: string;
    };
    balance: {
      currency: string;
      definedBalance: string;
      totalBalance: string;
      usedBalance: string;
      availableBalance: string;
    };
    accounts: Array<{
      id: string;
      type: string;
      accountName: string;
      currency: string;
      ibanOrCardNumber: string;
    }>;
    documents: {
      contractPdfName: string | null;
      governmentPapersPdfName: string | null;
    };
    codes: Array<{
      id: string;
      type: string;
      code: string;
      description: string;
    }>;
  };
};

const STORAGE_KEY = 'ttAgencies.v1';

function safeParseJson<T>(raw: string): T | null {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function loadStoredAgencies(): StoredAgency[] {
  if (typeof window === 'undefined') return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  const parsed = safeParseJson<unknown>(raw);
  if (!Array.isArray(parsed)) return [];
  return parsed as StoredAgency[];
}

export function saveStoredAgencies(list: StoredAgency[]): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function upsertStoredAgency(next: StoredAgency): void {
  const list = loadStoredAgencies();
  const filtered = list.filter((a) => a?.id !== next.id);
  saveStoredAgencies([next, ...filtered]);
}

export function findStoredAgency(id: string | number): StoredAgency | null {
  const numericId = typeof id === 'number' ? id : Number(id);
  if (!Number.isFinite(numericId)) return null;
  const list = loadStoredAgencies();
  return list.find((a) => a?.id === numericId) ?? null;
}
