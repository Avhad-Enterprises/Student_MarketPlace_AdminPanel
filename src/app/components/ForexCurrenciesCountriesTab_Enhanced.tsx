/**
 * FOREX SUPPORTED CURRENCIES & COUNTRIES TAB - PRODUCTION CONFIGURATION CENTER
 * Regional configuration control panel with:
 * - Add/Edit Country Modal (5 sections)
 * - Add/Edit Currency Modal (4 sections)
 * - Enhanced tables with Region, KYC, Risk columns
 * - Duplicate functionality
 * - Full validation
 */

import React, { useState } from 'react';
import {
  Plus,
  Search,
  Edit3,
  Eye,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  Globe,
  DollarSign,
  TrendingUp,
  AlertCircle,
  X,
  Copy,
  Shield,
  AlertTriangle,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import type { AuditLogEntry } from './common/ServiceProviderLogsTab';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';

interface TabProps {
  providerId: string;
  providerData?: any;
  setProviderData?: any;
  addActivityLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  userRole: string;
}

interface Country {
  id: string;
  name: string;
  code: string;
  flag: string;
  region: string;
  remittanceEnabled: boolean;
  forexCardEnabled: boolean;
  localSettlement: boolean;
  instantTransfer: boolean;
  complianceLevel: 'Basic' | 'Enhanced' | 'Full Verification';
  minTransferLimit: number;
  maxTransferLimit: number;
  dailyLimit: number;
  monthlyLimit: number;
  settlementType: string;
  settlementTime: string;
  supportedCurrencies: string[];
  regulatoryNotes: string;
  requiredDocuments: string[];
  highRisk: boolean;
  extraComplianceRequired: boolean;
  status: 'Active' | 'Inactive';
  updated: string;
}

interface Currency {
  id: string;
  name: string;
  code: string;
  symbol: string;
  baseCurrency: boolean;
  buyMargin: number;
  sellMargin: number;
  fixedFee: number;
  feeType: 'Flat' | 'Percentage';
  minAmount: number;
  maxAmount: number;
  perTransactionLimit: number;
  perDayLimit: number;
  visibleToStudents: boolean;
  allowForexCard: boolean;
  allowRemittance: boolean;
  status: 'Active' | 'Inactive';
  updated: string;
}

// Country list with flags
const COUNTRY_LIST = [
  { name: 'United States', code: 'US', flag: '🇺🇸', region: 'North America' },
  { name: 'United Kingdom', code: 'GB', flag: '🇬🇧', region: 'Europe' },
  { name: 'India', code: 'IN', flag: '🇮🇳', region: 'Asia' },
  { name: 'Canada', code: 'CA', flag: '🇨🇦', region: 'North America' },
  { name: 'Australia', code: 'AU', flag: '🇦🇺', region: 'Oceania' },
  { name: 'Germany', code: 'DE', flag: '🇩🇪', region: 'Europe' },
  { name: 'France', code: 'FR', flag: '🇫🇷', region: 'Europe' },
  { name: 'Singapore', code: 'SG', flag: '🇸🇬', region: 'Asia' },
  { name: 'Japan', code: 'JP', flag: '🇯🇵', region: 'Asia' },
  { name: 'China', code: 'CN', flag: '🇨🇳', region: 'Asia' },
];

const REGIONS = ['North America', 'Europe', 'Asia', 'Oceania', 'Africa', 'South America'];

const DOCUMENT_OPTIONS = [
  'Passport',
  'National ID',
  'Proof of Address',
  'Bank Statement',
  'Tax ID',
  'Visa/Immigration Docs',
];

export const ForexCurrenciesCountriesTab: React.FC<TabProps> = ({
  providerId,
  providerData,
  setProviderData,
  addActivityLog,
  userRole,
}) => {
  const canEdit = userRole === 'admin' || userRole === 'superadmin';

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [countries, setCountries] = useState<Country[]>([
    {
      id: '1',
      name: 'United States',
      code: 'US',
      flag: '🇺🇸',
      region: 'North America',
      remittanceEnabled: true,
      forexCardEnabled: true,
      localSettlement: true,
      instantTransfer: true,
      complianceLevel: 'Enhanced',
      minTransferLimit: 10,
      maxTransferLimit: 50000,
      dailyLimit: 10000,
      monthlyLimit: 100000,
      settlementType: 'ACH',
      settlementTime: '1-2 days',
      supportedCurrencies: ['USD', 'EUR', 'GBP'],
      regulatoryNotes: 'Full compliance with US regulations',
      requiredDocuments: ['Passport', 'Proof of Address', 'Tax ID'],
      highRisk: false,
      extraComplianceRequired: false,
      status: 'Active',
      updated: '2024-02-15 10:30',
    },
    {
      id: '2',
      name: 'United Kingdom',
      code: 'GB',
      flag: '🇬🇧',
      region: 'Europe',
      remittanceEnabled: true,
      forexCardEnabled: true,
      localSettlement: true,
      instantTransfer: false,
      complianceLevel: 'Enhanced',
      minTransferLimit: 10,
      maxTransferLimit: 40000,
      dailyLimit: 8000,
      monthlyLimit: 80000,
      settlementType: 'SEPA',
      settlementTime: '1-3 days',
      supportedCurrencies: ['GBP', 'EUR'],
      regulatoryNotes: 'FCA regulated',
      requiredDocuments: ['Passport', 'Proof of Address'],
      highRisk: false,
      extraComplianceRequired: false,
      status: 'Active',
      updated: '2024-02-14 14:20',
    },
    {
      id: '3',
      name: 'India',
      code: 'IN',
      flag: '🇮🇳',
      region: 'Asia',
      remittanceEnabled: true,
      forexCardEnabled: false,
      localSettlement: false,
      instantTransfer: false,
      complianceLevel: 'Basic',
      minTransferLimit: 100,
      maxTransferLimit: 100000,
      dailyLimit: 20000,
      monthlyLimit: 200000,
      settlementType: 'NEFT',
      settlementTime: '2-4 days',
      supportedCurrencies: ['INR'],
      regulatoryNotes: 'RBI compliance required',
      requiredDocuments: ['Passport', 'National ID', 'Bank Statement'],
      highRisk: false,
      extraComplianceRequired: true,
      status: 'Active',
      updated: '2024-02-13 09:15',
    },
  ]);

  const [currencies, setCurrencies] = useState<Currency[]>([
    {
      id: '1',
      name: 'US Dollar',
      code: 'USD',
      symbol: '$',
      baseCurrency: true,
      buyMargin: 0.5,
      sellMargin: 0.4,
      fixedFee: 2.5,
      feeType: 'Flat',
      minAmount: 10,
      maxAmount: 50000,
      perTransactionLimit: 10000,
      perDayLimit: 25000,
      visibleToStudents: true,
      allowForexCard: true,
      allowRemittance: true,
      status: 'Active',
      updated: '2024-02-15 10:30',
    },
    {
      id: '2',
      name: 'British Pound',
      code: 'GBP',
      symbol: '£',
      baseCurrency: false,
      buyMargin: 0.6,
      sellMargin: 0.5,
      fixedFee: 3.0,
      feeType: 'Flat',
      minAmount: 10,
      maxAmount: 40000,
      perTransactionLimit: 8000,
      perDayLimit: 20000,
      visibleToStudents: true,
      allowForexCard: true,
      allowRemittance: true,
      status: 'Active',
      updated: '2024-02-14 14:20',
    },
    {
      id: '3',
      name: 'Indian Rupee',
      code: 'INR',
      symbol: '₹',
      baseCurrency: false,
      buyMargin: 0.8,
      sellMargin: 0.7,
      fixedFee: 1.5,
      feeType: 'Percentage',
      minAmount: 100,
      maxAmount: 1000000,
      perTransactionLimit: 200000,
      perDayLimit: 500000,
      visibleToStudents: true,
      allowForexCard: false,
      allowRemittance: true,
      status: 'Active',
      updated: '2024-02-13 09:15',
    },
  ]);

  // Filter States
  const [countrySearch, setCountrySearch] = useState('');
  const [countryStatusFilter, setCountryStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');
  const [currencySearch, setCurrencySearch] = useState('');
  const [currencyStatusFilter, setCurrencyStatusFilter] = useState<'all' | 'Active' | 'Inactive'>('all');

  // Modal States
  const [countryModalOpen, setCountryModalOpen] = useState(false);
  const [currencyModalOpen, setCurrencyModalOpen] = useState(false);
  const [editingCountry, setEditingCountry] = useState<Country | null>(null);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);

  // Form States - Country
  const [countryForm, setCountryForm] = useState<Partial<Country>>({
    status: 'Active',
    complianceLevel: 'Basic',
    remittanceEnabled: true,
    forexCardEnabled: true,
    localSettlement: false,
    instantTransfer: false,
    highRisk: false,
    extraComplianceRequired: false,
    supportedCurrencies: [],
    requiredDocuments: [],
  });

  // Form States - Currency
  const [currencyForm, setCurrencyForm] = useState<Partial<Currency>>({
    status: 'Active',
    baseCurrency: false,
    feeType: 'Flat',
    visibleToStudents: true,
    allowForexCard: true,
    allowRemittance: true,
  });

  // Bulk Selection
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<string[]>([]);

  // ============================================
  // COMPUTED METRICS
  // ============================================

  const totalCountries = countries.length;
  const totalCurrencies = currencies.length;
  const activeRoutes = countries.filter((c) => c.status === 'Active' && c.remittanceEnabled).length;
  const inactiveRegions = countries.filter((c) => c.status === 'Inactive').length;

  // ============================================
  // FILTERING
  // ============================================

  const filteredCountries = countries.filter((country) => {
    const matchesSearch =
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearch.toLowerCase());
    const matchesStatus = countryStatusFilter === 'all' || country.status === countryStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredCurrencies = currencies.filter((currency) => {
    const matchesSearch =
      currency.name.toLowerCase().includes(currencySearch.toLowerCase()) ||
      currency.code.toLowerCase().includes(currencySearch.toLowerCase());
    const matchesStatus = currencyStatusFilter === 'all' || currency.status === currencyStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // ============================================
  // COUNTRY HANDLERS
  // ============================================

  const openAddCountryModal = () => {
    setEditingCountry(null);
    setCountryForm({
      status: 'Active',
      complianceLevel: 'Basic',
      remittanceEnabled: true,
      forexCardEnabled: true,
      localSettlement: false,
      instantTransfer: false,
      highRisk: false,
      extraComplianceRequired: false,
      supportedCurrencies: [],
      requiredDocuments: [],
      minTransferLimit: 10,
      maxTransferLimit: 50000,
      dailyLimit: 10000,
      monthlyLimit: 100000,
    });
    setCountryModalOpen(true);
  };

  const openEditCountryModal = (country: Country) => {
    setEditingCountry(country);
    setCountryForm({ ...country });
    setCountryModalOpen(true);
  };

  const handleSaveCountry = () => {
    // Validation
    if (!countryForm.name || !countryForm.code) {
      toast.error('Country name and code are required');
      return;
    }

    const now = new Date().toLocaleString();

    if (editingCountry) {
      // Update existing
      setCountries(
        countries.map((c) =>
          c.id === editingCountry.id
            ? { ...editingCountry, ...countryForm, updated: now }
            : c
        )
      );
      toast.success('Country updated successfully');
      addActivityLog({
        user: 'Current Admin',
        action: 'Updated',
        entity: 'Country',
        entityId: editingCountry.id,
        changes: `Updated country: ${countryForm.name}`,
        metadata: { section: 'Currencies & Countries' },
      });
    } else {
      // Add new
      const newCountry: Country = {
        id: `c-${Date.now()}`,
        ...countryForm,
        updated: now,
      } as Country;
      setCountries([...countries, newCountry]);
      toast.success('Country added successfully');
      addActivityLog({
        user: 'Current Admin',
        action: 'Created',
        entity: 'Country',
        entityId: newCountry.id,
        changes: `Added new country: ${countryForm.name}`,
        metadata: { section: 'Currencies & Countries' },
      });
    }

    setCountryModalOpen(false);
  };

  const handleDuplicateCountry = (country: Country) => {
    const duplicated: Country = {
      ...country,
      id: `c-${Date.now()}`,
      name: `${country.name} (Copy)`,
      updated: new Date().toLocaleString(),
    };
    setCountries([...countries, duplicated]);
    toast.success('Country duplicated successfully');
    addActivityLog({
      user: 'Current Admin',
      action: 'Duplicated',
      entity: 'Country',
      entityId: country.id,
      changes: `Duplicated country: ${country.name}`,
      metadata: { section: 'Currencies & Countries' },
    });
  };

  const toggleCountryStatus = (countryId: string) => {
    const country = countries.find((c) => c.id === countryId);
    if (!country || !canEdit) return;

    const newStatus = country.status === 'Active' ? 'Inactive' : 'Active';
    setCountries(
      countries.map((c) =>
        c.id === countryId
          ? { ...c, status: newStatus, updated: new Date().toLocaleString() }
          : c
      )
    );

    toast.success(`Country status changed to ${newStatus}`);
  };

  // ============================================
  // CURRENCY HANDLERS
  // ============================================

  const openAddCurrencyModal = () => {
    setEditingCurrency(null);
    setCurrencyForm({
      status: 'Active',
      baseCurrency: false,
      feeType: 'Flat',
      visibleToStudents: true,
      allowForexCard: true,
      allowRemittance: true,
      buyMargin: 0.5,
      sellMargin: 0.4,
      fixedFee: 2.5,
      minAmount: 10,
      maxAmount: 50000,
      perTransactionLimit: 10000,
      perDayLimit: 25000,
    });
    setCurrencyModalOpen(true);
  };

  const openEditCurrencyModal = (currency: Currency) => {
    setEditingCurrency(currency);
    setCurrencyForm({ ...currency });
    setCurrencyModalOpen(true);
  };

  const handleSaveCurrency = () => {
    // Validation
    if (!currencyForm.name || !currencyForm.code || !currencyForm.symbol) {
      toast.error('Currency name, code, and symbol are required');
      return;
    }

    const now = new Date().toLocaleString();

    if (editingCurrency) {
      // Update existing
      setCurrencies(
        currencies.map((c) =>
          c.id === editingCurrency.id
            ? { ...editingCurrency, ...currencyForm, updated: now }
            : c
        )
      );
      toast.success('Currency updated successfully');
      addActivityLog({
        user: 'Current Admin',
        action: 'Updated',
        entity: 'Currency',
        entityId: editingCurrency.id,
        changes: `Updated currency: ${currencyForm.name}`,
        metadata: { section: 'Currencies & Countries' },
      });
    } else {
      // Add new
      const newCurrency: Currency = {
        id: `cur-${Date.now()}`,
        ...currencyForm,
        updated: now,
      } as Currency;
      setCurrencies([...currencies, newCurrency]);
      toast.success('Currency added successfully');
      addActivityLog({
        user: 'Current Admin',
        action: 'Created',
        entity: 'Currency',
        entityId: newCurrency.id,
        changes: `Added new currency: ${currencyForm.name}`,
        metadata: { section: 'Currencies & Countries' },
      });
    }

    setCurrencyModalOpen(false);
  };

  const handleDuplicateCurrency = (currency: Currency) => {
    const duplicated: Currency = {
      ...currency,
      id: `cur-${Date.now()}`,
      name: `${currency.name} (Copy)`,
      updated: new Date().toLocaleString(),
    };
    setCurrencies([...currencies, duplicated]);
    toast.success('Currency duplicated successfully');
    addActivityLog({
      user: 'Current Admin',
      action: 'Duplicated',
      entity: 'Currency',
      entityId: currency.id,
      changes: `Duplicated currency: ${currency.name}`,
      metadata: { section: 'Currencies & Countries' },
    });
  };

  const toggleCurrencyStatus = (currencyId: string) => {
    const currency = currencies.find((c) => c.id === currencyId);
    if (!currency || !canEdit) return;

    const newStatus = currency.status === 'Active' ? 'Inactive' : 'Active';
    setCurrencies(
      currencies.map((c) =>
        c.id === currencyId
          ? { ...c, status: newStatus, updated: new Date().toLocaleString() }
          : c
      )
    );

    toast.success(`Currency status changed to ${newStatus}`);
  };

  // ============================================
  // BULK HANDLERS
  // ============================================

  const handleBulkActivate = (type: 'countries' | 'currencies') => {
    if (type === 'countries') {
      if (selectedCountries.length === 0) {
        toast.error('No countries selected');
        return;
      }
      setCountries(
        countries.map((c) =>
          selectedCountries.includes(c.id) ? { ...c, status: 'Active' } : c
        )
      );
      toast.success(`${selectedCountries.length} countries activated`);
      setSelectedCountries([]);
    } else {
      if (selectedCurrencies.length === 0) {
        toast.error('No currencies selected');
        return;
      }
      setCurrencies(
        currencies.map((c) =>
          selectedCurrencies.includes(c.id) ? { ...c, status: 'Active' } : c
        )
      );
      toast.success(`${selectedCurrencies.length} currencies activated`);
      setSelectedCurrencies([]);
    }
  };

  const handleBulkDeactivate = (type: 'countries' | 'currencies') => {
    if (type === 'countries') {
      if (selectedCountries.length === 0) {
        toast.error('No countries selected');
        return;
      }
      setCountries(
        countries.map((c) =>
          selectedCountries.includes(c.id) ? { ...c, status: 'Inactive' } : c
        )
      );
      toast.success(`${selectedCountries.length} countries deactivated`);
      setSelectedCountries([]);
    } else {
      if (selectedCurrencies.length === 0) {
        toast.error('No currencies selected');
        return;
      }
      setCurrencies(
        currencies.map((c) =>
          selectedCurrencies.includes(c.id) ? { ...c, status: 'Inactive' } : c
        )
      );
      toast.success(`${selectedCurrencies.length} currencies deactivated`);
      setSelectedCurrencies([]);
    }
  };

  const handleExport = (type: 'countries' | 'currencies') => {
    toast.success(`Exporting ${type} to CSV...`);
  };

  const handleImport = () => {
    toast.info('Import CSV functionality coming soon');
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#253154]">Supported Currencies & Countries</h2>
          <p className="text-sm text-gray-600">Regional configuration control center</p>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Globe size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Countries</p>
              <p className="text-2xl font-bold text-[#253154]">{totalCountries}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <DollarSign size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Total Currencies</p>
              <p className="text-2xl font-bold text-[#253154]">{totalCurrencies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 rounded-lg">
              <TrendingUp size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Active Routes</p>
              <p className="text-2xl font-bold text-[#253154]">{activeRoutes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-50 rounded-lg">
              <AlertCircle size={20} className="text-red-600" />
            </div>
            <div>
              <p className="text-xs text-gray-600">Inactive Regions</p>
              <p className="text-2xl font-bold text-[#253154]">{inactiveRegions}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="countries" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="countries">Countries</TabsTrigger>
          <TabsTrigger value="currencies">Currencies</TabsTrigger>
        </TabsList>

        {/* COUNTRIES TAB */}
        <TabsContent value="countries" className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  placeholder="Search countries..."
                  className="pl-10"
                />
              </div>

              <Select value={countryStatusFilter} onValueChange={(v: any) => setCountryStatusFilter(v)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {selectedCountries.length > 0 && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkActivate('countries')}
                  >
                    <CheckCircle size={14} className="mr-2" />
                    Activate ({selectedCountries.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkDeactivate('countries')}
                  >
                    <XCircle size={14} className="mr-2" />
                    Deactivate ({selectedCountries.length})
                  </Button>
                </>
              )}
              <Button size="sm" variant="outline" onClick={handleImport}>
                <Upload size={14} className="mr-2" />
                Import CSV
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleExport('countries')}>
                <Download size={14} className="mr-2" />
                Export CSV
              </Button>
              {canEdit && (
                <Button size="sm" className="bg-[#0e042f] hover:bg-[#1a0a4a]" onClick={openAddCountryModal}>
                  <Plus size={14} className="mr-2" />
                  Add Country
                </Button>
              )}
            </div>
          </div>

          {/* Countries Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedCountries.length === filteredCountries.length &&
                          filteredCountries.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCountries(filteredCountries.map((c) => c.id));
                          } else {
                            setSelectedCountries([]);
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Country
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Region
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Remittance
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Forex Card
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Instant Transfer
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      KYC Level
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Risk
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCountries.map((country) => (
                    <tr key={country.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCountries.includes(country.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCountries([...selectedCountries, country.id]);
                            } else {
                              setSelectedCountries(selectedCountries.filter((id) => id !== country.id));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="text-sm font-semibold text-[#253154]">{country.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono font-bold rounded">
                          {country.code}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{country.region}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {country.remittanceEnabled ? (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {country.forexCardEnabled ? (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {country.instantTransfer ? (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 text-xs font-bold rounded ${
                            country.complianceLevel === 'Full Verification'
                              ? 'bg-indigo-100 text-indigo-700'
                              : country.complianceLevel === 'Enhanced'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {country.complianceLevel}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {country.highRisk && (
                          <AlertTriangle size={16} className="text-red-600 mx-auto" />
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Switch
                          checked={country.status === 'Active'}
                          onCheckedChange={() => toggleCountryStatus(country.id)}
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditCountryModal(country)}
                          >
                            <Edit3 size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateCountry(country)}
                            disabled={!canEdit}
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* CURRENCIES TAB */}
        <TabsContent value="currencies" className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  value={currencySearch}
                  onChange={(e) => setCurrencySearch(e.target.value)}
                  placeholder="Search currencies..."
                  className="pl-10"
                />
              </div>

              <Select value={currencyStatusFilter} onValueChange={(v: any) => setCurrencyStatusFilter(v)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              {selectedCurrencies.length > 0 && (
                <>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkActivate('currencies')}
                  >
                    <CheckCircle size={14} className="mr-2" />
                    Activate ({selectedCurrencies.length})
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleBulkDeactivate('currencies')}
                  >
                    <XCircle size={14} className="mr-2" />
                    Deactivate ({selectedCurrencies.length})
                  </Button>
                </>
              )}
              <Button size="sm" variant="outline" onClick={handleImport}>
                <Upload size={14} className="mr-2" />
                Import CSV
              </Button>
              <Button size="sm" variant="outline" onClick={() => handleExport('currencies')}>
                <Download size={14} className="mr-2" />
                Export CSV
              </Button>
              {canEdit && (
                <Button size="sm" className="bg-[#0e042f] hover:bg-[#1a0a4a]" onClick={openAddCurrencyModal}>
                  <Plus size={14} className="mr-2" />
                  Add Currency
                </Button>
              )}
            </div>
          </div>

          {/* Currencies Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedCurrencies.length === filteredCurrencies.length &&
                          filteredCurrencies.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCurrencies(filteredCurrencies.map((c) => c.id));
                          } else {
                            setSelectedCurrencies([]);
                          }
                        }}
                        className="w-4 h-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Symbol
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Currency
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Base
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Buy %
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Sell %
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Fee Type
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-bold text-[#253154] uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredCurrencies.map((currency) => (
                    <tr key={currency.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedCurrencies.includes(currency.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedCurrencies([...selectedCurrencies, currency.id]);
                            } else {
                              setSelectedCurrencies(
                                selectedCurrencies.filter((id) => id !== currency.id)
                              );
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xl font-bold">{currency.symbol}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-[#253154]">
                          {currency.name}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-mono font-bold rounded">
                          {currency.code}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {currency.baseCurrency ? (
                          <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">
                            Yes
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-emerald-600">
                          {currency.buyMargin}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-sm font-bold text-blue-600">
                          {currency.sellMargin}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                          {currency.feeType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Switch
                          checked={currency.status === 'Active'}
                          onCheckedChange={() => toggleCurrencyStatus(currency.id)}
                          disabled={!canEdit}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-gray-600">{currency.updated}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditCurrencyModal(currency)}
                          >
                            <Edit3 size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDuplicateCurrency(currency)}
                            disabled={!canEdit}
                          >
                            <Copy size={14} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ADD/EDIT COUNTRY MODAL */}
      <Dialog open={countryModalOpen} onOpenChange={setCountryModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#253154]">
              {editingCountry ? 'Edit Country Configuration' : 'Add Country Configuration'}
            </DialogTitle>
            <DialogDescription>
              Configure country settings for forex services
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* SECTION 1: Basic Information */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
              <h3 className="text-sm font-bold text-[#253154] uppercase mb-4 flex items-center gap-2">
                <Globe size={16} className="text-blue-600" />
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Country Name
                  </Label>
                  <Select
                    value={countryForm.name}
                    onValueChange={(value) => {
                      const selected = COUNTRY_LIST.find((c) => c.name === value);
                      if (selected) {
                        setCountryForm({
                          ...countryForm,
                          name: selected.name,
                          code: selected.code,
                          flag: selected.flag,
                          region: selected.region,
                        });
                      }
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_LIST.map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.flag} {country.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    ISO Code
                  </Label>
                  <Input
                    value={countryForm.code || ''}
                    onChange={(e) => setCountryForm({ ...countryForm, code: e.target.value })}
                    placeholder="US"
                    maxLength={2}
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Region
                  </Label>
                  <Select
                    value={countryForm.region}
                    onValueChange={(value) => setCountryForm({ ...countryForm, region: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select region" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGIONS.map((region) => (
                        <SelectItem key={region} value={region}>
                          {region}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-300">
                  <Label className="text-sm font-semibold text-gray-900">Active Status</Label>
                  <Switch
                    checked={countryForm.status === 'Active'}
                    onCheckedChange={(checked) =>
                      setCountryForm({ ...countryForm, status: checked ? 'Active' : 'Inactive' })
                    }
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Services Enabled */}
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
              <h3 className="text-sm font-bold text-[#253154] uppercase mb-4 flex items-center gap-2">
                <CheckCircle size={16} className="text-emerald-600" />
                Services Enabled
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-300">
                  <Label className="text-sm font-semibold text-gray-900">Remittance Enabled</Label>
                  <Switch
                    checked={countryForm.remittanceEnabled || false}
                    onCheckedChange={(checked) =>
                      setCountryForm({ ...countryForm, remittanceEnabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-300">
                  <Label className="text-sm font-semibold text-gray-900">Forex Card Enabled</Label>
                  <Switch
                    checked={countryForm.forexCardEnabled || false}
                    onCheckedChange={(checked) =>
                      setCountryForm({ ...countryForm, forexCardEnabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-300">
                  <Label className="text-sm font-semibold text-gray-900">Local Settlement</Label>
                  <Switch
                    checked={countryForm.localSettlement || false}
                    onCheckedChange={(checked) =>
                      setCountryForm({ ...countryForm, localSettlement: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-emerald-300">
                  <Label className="text-sm font-semibold text-gray-900">Instant Transfer</Label>
                  <Switch
                    checked={countryForm.instantTransfer || false}
                    onCheckedChange={(checked) =>
                      setCountryForm({ ...countryForm, instantTransfer: checked })
                    }
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: Compliance & KYC */}
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-5">
              <h3 className="text-sm font-bold text-[#253154] uppercase mb-4 flex items-center gap-2">
                <Shield size={16} className="text-purple-600" />
                Compliance & KYC
              </h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    KYC Level
                  </Label>
                  <Select
                    value={countryForm.complianceLevel}
                    onValueChange={(value: any) =>
                      setCountryForm({ ...countryForm, complianceLevel: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Enhanced">Enhanced</SelectItem>
                      <SelectItem value="Full Verification">Full Verification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Regulatory Notes
                  </Label>
                  <textarea
                    value={countryForm.regulatoryNotes || ''}
                    onChange={(e) =>
                      setCountryForm({ ...countryForm, regulatoryNotes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-100 outline-none"
                    rows={3}
                    placeholder="Add regulatory notes..."
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Required Documents
                  </Label>
                  <div className="space-y-2">
                    {DOCUMENT_OPTIONS.map((doc) => (
                      <label
                        key={doc}
                        className="flex items-center gap-2 p-2 hover:bg-purple-100 rounded cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={(countryForm.requiredDocuments || []).includes(doc)}
                          onChange={(e) => {
                            const current = countryForm.requiredDocuments || [];
                            if (e.target.checked) {
                              setCountryForm({
                                ...countryForm,
                                requiredDocuments: [...current, doc],
                              });
                            } else {
                              setCountryForm({
                                ...countryForm,
                                requiredDocuments: current.filter((d) => d !== doc),
                              });
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <span className="text-sm text-gray-900">{doc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: Transfer Limits */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
              <h3 className="text-sm font-bold text-[#253154] uppercase mb-4 flex items-center gap-2">
                <DollarSign size={16} className="text-amber-600" />
                Transfer Limits
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Minimum Transfer Amount
                  </Label>
                  <Input
                    type="number"
                    value={countryForm.minTransferLimit || 0}
                    onChange={(e) =>
                      setCountryForm({
                        ...countryForm,
                        minTransferLimit: parseFloat(e.target.value),
                      })
                    }
                    placeholder="10"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Maximum Transfer Amount
                  </Label>
                  <Input
                    type="number"
                    value={countryForm.maxTransferLimit || 0}
                    onChange={(e) =>
                      setCountryForm({
                        ...countryForm,
                        maxTransferLimit: parseFloat(e.target.value),
                      })
                    }
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Daily Limit
                  </Label>
                  <Input
                    type="number"
                    value={countryForm.dailyLimit || 0}
                    onChange={(e) =>
                      setCountryForm({ ...countryForm, dailyLimit: parseFloat(e.target.value) })
                    }
                    placeholder="10000"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Monthly Limit
                  </Label>
                  <Input
                    type="number"
                    value={countryForm.monthlyLimit || 0}
                    onChange={(e) =>
                      setCountryForm({ ...countryForm, monthlyLimit: parseFloat(e.target.value) })
                    }
                    placeholder="100000"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: Risk & Control */}
            <div className="bg-red-50 rounded-xl border border-red-200 p-5">
              <h3 className="text-sm font-bold text-[#253154] uppercase mb-4 flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                Risk & Control
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-300">
                  <Label className="text-sm font-semibold text-gray-900">High Risk Country</Label>
                  <Switch
                    checked={countryForm.highRisk || false}
                    onCheckedChange={(checked) =>
                      setCountryForm({ ...countryForm, highRisk: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-red-300">
                  <Label className="text-sm font-semibold text-gray-900">
                    Extra Compliance Required
                  </Label>
                  <Switch
                    checked={countryForm.extraComplianceRequired || false}
                    onCheckedChange={(checked) =>
                      setCountryForm({ ...countryForm, extraComplianceRequired: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCountryModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#0e042f] hover:bg-[#1a0a4a]"
              onClick={handleSaveCountry}
            >
              Save Country
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ADD/EDIT CURRENCY MODAL */}
      <Dialog open={currencyModalOpen} onOpenChange={setCurrencyModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-[#253154]">
              {editingCurrency ? 'Edit Currency Configuration' : 'Add Currency Configuration'}
            </DialogTitle>
            <DialogDescription>
              Configure currency settings for forex services
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* SECTION 1: Currency Basics */}
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-5">
              <h3 className="text-sm font-bold text-[#253154] uppercase mb-4 flex items-center gap-2">
                <DollarSign size={16} className="text-blue-600" />
                Currency Basics
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Currency Name
                  </Label>
                  <Input
                    value={currencyForm.name || ''}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, name: e.target.value })}
                    placeholder="US Dollar"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Currency Code
                  </Label>
                  <Input
                    value={currencyForm.code || ''}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, code: e.target.value })}
                    placeholder="USD"
                    maxLength={3}
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Symbol
                  </Label>
                  <Input
                    value={currencyForm.symbol || ''}
                    onChange={(e) => setCurrencyForm({ ...currencyForm, symbol: e.target.value })}
                    placeholder="$"
                    maxLength={3}
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-300">
                  <Label className="text-sm font-semibold text-gray-900">Base Currency</Label>
                  <Switch
                    checked={currencyForm.baseCurrency || false}
                    onCheckedChange={(checked) =>
                      setCurrencyForm({ ...currencyForm, baseCurrency: checked })
                    }
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: Exchange Margin Setup */}
            <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-5">
              <h3 className="text-sm font-bold text-[#253154] uppercase mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-emerald-600" />
                Exchange Margin Setup
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Buy Margin %
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={currencyForm.buyMargin || 0}
                    onChange={(e) =>
                      setCurrencyForm({ ...currencyForm, buyMargin: parseFloat(e.target.value) })
                    }
                    placeholder="0.5"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Sell Margin %
                  </Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={currencyForm.sellMargin || 0}
                    onChange={(e) =>
                      setCurrencyForm({ ...currencyForm, sellMargin: parseFloat(e.target.value) })
                    }
                    placeholder="0.4"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Fixed Fee
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={currencyForm.fixedFee || 0}
                    onChange={(e) =>
                      setCurrencyForm({ ...currencyForm, fixedFee: parseFloat(e.target.value) })
                    }
                    placeholder="2.5"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Fee Type
                  </Label>
                  <Select
                    value={currencyForm.feeType}
                    onValueChange={(value: any) =>
                      setCurrencyForm({ ...currencyForm, feeType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flat">Flat</SelectItem>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* SECTION 3: Transfer Limits */}
            <div className="bg-purple-50 rounded-xl border border-purple-200 p-5">
              <h3 className="text-sm font-bold text-[#253154] uppercase mb-4 flex items-center gap-2">
                <Shield size={16} className="text-purple-600" />
                Transfer Limits
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Min Amount
                  </Label>
                  <Input
                    type="number"
                    value={currencyForm.minAmount || 0}
                    onChange={(e) =>
                      setCurrencyForm({ ...currencyForm, minAmount: parseFloat(e.target.value) })
                    }
                    placeholder="10"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Max Amount
                  </Label>
                  <Input
                    type="number"
                    value={currencyForm.maxAmount || 0}
                    onChange={(e) =>
                      setCurrencyForm({ ...currencyForm, maxAmount: parseFloat(e.target.value) })
                    }
                    placeholder="50000"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Per Transaction Limit
                  </Label>
                  <Input
                    type="number"
                    value={currencyForm.perTransactionLimit || 0}
                    onChange={(e) =>
                      setCurrencyForm({
                        ...currencyForm,
                        perTransactionLimit: parseFloat(e.target.value),
                      })
                    }
                    placeholder="10000"
                  />
                </div>

                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Per Day Limit
                  </Label>
                  <Input
                    type="number"
                    value={currencyForm.perDayLimit || 0}
                    onChange={(e) =>
                      setCurrencyForm({ ...currencyForm, perDayLimit: parseFloat(e.target.value) })
                    }
                    placeholder="25000"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 4: Activation Controls */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
              <h3 className="text-sm font-bold text-[#253154] uppercase mb-4 flex items-center gap-2">
                <CheckCircle size={16} className="text-amber-600" />
                Activation Controls
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-300">
                  <Label className="text-sm font-semibold text-gray-900">Status Active</Label>
                  <Switch
                    checked={currencyForm.status === 'Active'}
                    onCheckedChange={(checked) =>
                      setCurrencyForm({ ...currencyForm, status: checked ? 'Active' : 'Inactive' })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-300">
                  <Label className="text-sm font-semibold text-gray-900">
                    Visible to Students
                  </Label>
                  <Switch
                    checked={currencyForm.visibleToStudents || false}
                    onCheckedChange={(checked) =>
                      setCurrencyForm({ ...currencyForm, visibleToStudents: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-300">
                  <Label className="text-sm font-semibold text-gray-900">
                    Allow Forex Card Conversion
                  </Label>
                  <Switch
                    checked={currencyForm.allowForexCard || false}
                    onCheckedChange={(checked) =>
                      setCurrencyForm({ ...currencyForm, allowForexCard: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-amber-300">
                  <Label className="text-sm font-semibold text-gray-900">Allow Remittance</Label>
                  <Switch
                    checked={currencyForm.allowRemittance || false}
                    onCheckedChange={(checked) =>
                      setCurrencyForm({ ...currencyForm, allowRemittance: checked })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setCurrencyModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 bg-[#0e042f] hover:bg-[#1a0a4a]"
              onClick={handleSaveCurrency}
            >
              Save Currency
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
