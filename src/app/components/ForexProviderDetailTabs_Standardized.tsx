/**
 * FOREX PROVIDER DETAIL TABS - STANDARDIZED IMPLEMENTATION
 * 
 * Complete tab implementations matching standard pattern:
 * 1. Overview - Provider summary
 * 2. Supported Currencies & Countries - Currency pairs and country coverage
 * 3. Pricing & Fees - Fee structure and pricing preview
 * 4. Student Journey - Step-by-step flow with editing
 * 5. Analytics - Performance metrics and charts
 * 6. Operations - Enterprise-grade technical controls
 */

import React, { useState } from 'react';
import {
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Globe,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Clock,
  Shield,
  FileText,
  Download,
  Filter,
  Search,
  Eye,
  EyeOff,
  Settings,
  Zap,
  RefreshCw,
  TestTube,
  GripVertical,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import type { ForexProviderData } from './ForexProviderDetail';
import type { AuditLogEntry } from './common/ServiceProviderLogsTab';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

interface TabProps {
  providerId: string;
  providerData: ForexProviderData;
  setProviderData: React.Dispatch<React.SetStateAction<ForexProviderData>>;
  addActivityLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  userRole: string;
}

interface ReadOnlyTabProps {
  providerId: string;
  addActivityLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  userRole: string;
}

// ============================================
// TAB 1: OVERVIEW
// ============================================

export const ForexOverviewTab: React.FC<TabProps> = ({
  providerId,
  providerData,
  setProviderData,
  addActivityLog,
  userRole,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#253154]">Provider Overview</h2>
        <p className="text-sm text-gray-600">Executive summary and performance snapshot</p>
      </div>

      {/* CURRENT SNAPSHOT - KPI CARDS */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wide">Current Snapshot</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {/* Active Users */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Active Users</span>
              <Users size={16} className="text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-[#253154] mb-1">
              {providerData.activeUsers.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp size={12} />
              +12.5%
            </div>
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              vs last month
            </div>
          </div>

          {/* Total Transfers */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Total Transfers</span>
              <ArrowRightLeft size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-[#253154] mb-1">
              {providerData.totalTransfers.toLocaleString()}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp size={12} />
              +8.3%
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              vs last month
            </div>
          </div>

          {/* Avg Transfer Fee */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Avg Transfer Fee</span>
              <DollarSign size={16} className="text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-[#253154] mb-1">
              ${providerData.avgTransferFee.toFixed(2)}
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingDown size={12} />
              -2.1%
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Lower is better
            </div>
          </div>

          {/* Avg FX Margin */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Avg FX Margin</span>
              <Target size={16} className="text-amber-600" />
            </div>
            <div className="text-2xl font-bold text-[#253154] mb-1">
              {providerData.avgFxMargin}%
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingDown size={12} />
              -0.3%
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Markup percentage
            </div>
          </div>

          {/* Instant Transfer % */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Instant Transfer</span>
              <Zap size={16} className="text-indigo-600" />
            </div>
            <div className="text-2xl font-bold text-[#253154] mb-1">
              {providerData.instantTransferPercent}%
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp size={12} />
              +5.2%
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Same-day completion
            </div>
          </div>

          {/* Success Rate */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm group relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-600">Success Rate</span>
              <CheckCircle size={16} className="text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-[#253154] mb-1">
              {providerData.successRate}%
            </div>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
              <TrendingUp size={12} />
              +1.2%
            </div>
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
              Transaction success
            </div>
          </div>
        </div>
      </div>

      {/* PROVIDER SUMMARY */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#253154] mb-4">Provider Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">Provider Description</div>
              <p className="text-sm text-gray-900 leading-relaxed">{providerData.description}</p>
            </div>
            
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">Type</div>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold inline-block">
                {providerData.providerType}
              </span>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">Integration Type</div>
              <span className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-semibold inline-block">
                {providerData.integrationType}
              </span>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">Partner Since</div>
              <div className="text-sm font-bold text-gray-900">January 2022</div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">Primary Markets</div>
              <div className="flex flex-wrap gap-2">
                {['United States', 'United Kingdom', 'India', 'Canada', 'Australia'].map((market) => (
                  <span key={market} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                    {market}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-gray-600 mb-2">Partner SLA</div>
              <div className="text-sm font-bold text-gray-900">{providerData.partnerSLA}</div>
            </div>
          </div>
        </div>
      </div>

      {/* CORE CAPABILITIES */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#253154] mb-4">Core Capabilities</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Send International Transfers */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ArrowRightLeft size={18} className="text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Send International Transfers</span>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Enabled</span>
          </div>

          {/* Receive Local Transfers */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <ArrowRightLeft size={18} className="text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Receive Local Transfers</span>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Enabled</span>
          </div>

          {/* Hold Multi-Currency Balances */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign size={18} className="text-purple-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Hold Multi-Currency Balances</span>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Enabled</span>
          </div>

          {/* FX Conversion */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <RefreshCw size={18} className="text-amber-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">FX Conversion</span>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Enabled</span>
          </div>

          {/* Student Remittance Optimization */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Target size={18} className="text-indigo-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Student Remittance Optimization</span>
            </div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded">Enabled</span>
          </div>

          {/* Real-Time Rate Updates */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Zap size={18} className="text-red-600" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Real-Time Rate Updates</span>
            </div>
            <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded">Disabled</span>
          </div>
        </div>
      </div>

      {/* SERVICE MODEL SUMMARY & COVERAGE SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Service Model Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Service Model Summary</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">Fee Model</div>
              <div className="text-sm font-bold text-gray-900">Flat + Percentage</div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">FX Markup %</div>
              <div className="text-sm font-bold text-gray-900">{providerData.avgFxMargin}%</div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">Settlement Time</div>
              <div className="text-sm font-bold text-gray-900">1-3 Business Days</div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">KYC Required</div>
              <div className="text-sm font-bold text-emerald-600">Yes</div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">Minimum Transfer</div>
              <div className="text-sm font-bold text-gray-900">$10</div>
            </div>

            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-1">Maximum Transfer</div>
              <div className="text-sm font-bold text-gray-900">$1,000,000</div>
            </div>
          </div>
        </div>

        {/* Coverage Snapshot */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Coverage Snapshot</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Globe size={20} className="text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">Countries Covered</span>
              </div>
              <span className="text-2xl font-bold text-blue-900">{providerData.countries.length}</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign size={20} className="text-purple-600" />
                <span className="text-sm font-semibold text-purple-900">Currency Pairs</span>
              </div>
              <span className="text-2xl font-bold text-purple-900">{providerData.currencyPairs}</span>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-xs font-semibold text-gray-600 mb-3">Top 3 Transfer Routes</div>
              <div className="space-y-2">
                {['USD → INR', 'GBP → USD', 'EUR → GBP'].map((route, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm">
                    <span className="font-semibold text-gray-900">{route}</span>
                    <span className="text-xs text-gray-600">
                      {idx === 0 ? '32%' : idx === 1 ? '24%' : '18%'} of volume
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* COMPLIANCE & RISK STATUS */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#253154] mb-4">Compliance & Risk Status</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            <Shield size={20} className="text-emerald-600 mx-auto mb-2" />
            <div className="text-xs font-semibold text-emerald-700 mb-1">KYC Required</div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">Active</span>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            <Eye size={20} className="text-emerald-600 mx-auto mb-2" />
            <div className="text-xs font-semibold text-emerald-700 mb-1">AML Monitoring</div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">Enabled</span>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            <FileText size={20} className="text-emerald-600 mx-auto mb-2" />
            <div className="text-xs font-semibold text-emerald-700 mb-1">Regulatory License</div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">Valid</span>
          </div>

          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center">
            <Shield size={20} className="text-emerald-600 mx-auto mb-2" />
            <div className="text-xs font-semibold text-emerald-700 mb-1">Fraud Monitoring</div>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded">Active</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TAB 2: SUPPORTED CURRENCIES & COUNTRIES
// ============================================

export const ForexCurrenciesCountriesTab: React.FC<TabProps> = ({
  providerId,
  providerData,
  setProviderData,
  addActivityLog,
  userRole,
}) => {
  const canEdit = userRole === 'admin' || userRole === 'superadmin';

  const [currencyPairs, setCurrencyPairs] = useState([
    { id: '1', from: 'USD', to: 'INR', rate: 83.25, enabled: true },
    { id: '2', from: 'USD', to: 'EUR', rate: 0.92, enabled: true },
    { id: '3', from: 'GBP', to: 'USD', rate: 1.27, enabled: true },
    { id: '4', from: 'EUR', to: 'GBP', rate: 0.86, enabled: true },
    { id: '5', from: 'CAD', to: 'USD', rate: 0.74, enabled: true },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleTogglePair = (pairId: string) => {
    setCurrencyPairs(prev => prev.map(pair =>
      pair.id === pairId ? { ...pair, enabled: !pair.enabled } : pair
    ));

    const pair = currencyPairs.find(p => p.id === pairId);
    toast.success(`Currency pair ${pair?.enabled ? 'disabled' : 'enabled'}`);
  };

  const filteredPairs = currencyPairs.filter(pair =>
    `${pair.from} ${pair.to}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#253154]">Supported Currencies & Countries</h2>
          <p className="text-sm text-gray-600">Manage currency pairs and country coverage</p>
        </div>

        {canEdit && (
          <Button size="sm" className="bg-[#0e042f] hover:bg-[#1a0a4a]">
            <Plus size={14} className="mr-2" />
            Add Currency Pair
          </Button>
        )}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search currency pairs..."
            className="pl-10"
          />
        </div>
      </div>

      {/* Currency Pairs */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#253154] uppercase tracking-wider">From → To</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#253154] uppercase tracking-wider">Exchange Rate</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#253154] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-[#253154] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPairs.map(pair => (
                <tr key={pair.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                        {pair.from}
                      </span>
                      <ArrowRightLeft size={14} className="text-gray-400" />
                      <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-bold">
                        {pair.to}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#253154]">{pair.rate.toFixed(4)}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Switch
                      checked={pair.enabled}
                      onCheckedChange={() => handleTogglePair(pair.id)}
                      disabled={!canEdit}
                    />
                  </td>
                  <td className="px-6 py-4">
                    <Button variant="ghost" size="sm" disabled={!canEdit}>
                      <Edit3 size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Supported Countries */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#253154] mb-4">Supported Countries</h3>
        <div className="flex flex-wrap gap-2">
          {providerData.countries.map(country => (
            <span key={country} className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 rounded-lg text-sm font-semibold">
              {country}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TAB 3: PRICING & FEES
// ============================================

export const ForexPricingFeesTab: React.FC<TabProps> = ({
  providerId,
  providerData,
  setProviderData,
  addActivityLog,
  userRole,
}) => {
  const canEdit = userRole === 'admin' || userRole === 'superadmin';

  const [fees, setFees] = useState([
    { id: '1', name: 'Transfer Fee', type: 'Percentage', amount: 0.65, enabled: true },
    { id: '2', name: 'FX Margin', type: 'Percentage', amount: 0.35, enabled: true },
    { id: '3', name: 'Instant Transfer Surcharge', type: 'Percentage', amount: 1.50, enabled: true },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#253154]">Pricing & Fees</h2>
          <p className="text-sm text-gray-600">Configure fee structure and pricing</p>
        </div>

        {canEdit && (
          <Button size="sm" className="bg-[#0e042f] hover:bg-[#1a0a4a]">
            <Plus size={14} className="mr-2" />
            Add Fee
          </Button>
        )}
      </div>

      {/* Fee List */}
      <div className="space-y-3">
        {fees.map(fee => (
          <div key={fee.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-base font-bold text-[#253154] mb-2">{fee.name}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Type</div>
                    <div className="text-sm font-semibold text-gray-900">{fee.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Amount</div>
                    <div className="text-sm font-bold text-[#253154]">{fee.amount}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Status</div>
                    <div className="text-sm font-semibold text-gray-900">{fee.enabled ? 'Active' : 'Disabled'}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={fee.enabled} disabled={!canEdit} />
                <Button variant="ghost" size="sm" disabled={!canEdit}>
                  <Edit3 size={14} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Student Price Preview */}
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#253154] mb-4">Student Price Preview</h3>
        <div className="bg-white rounded-lg p-4 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Transfer Amount</span>
            <span className="text-sm font-bold text-gray-900">$1,000.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Transfer Fee (0.65%)</span>
            <span className="text-sm font-semibold text-gray-900">$6.50</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">FX Margin (0.35%)</span>
            <span className="text-sm font-semibold text-gray-900">$3.50</span>
          </div>
          <div className="h-px bg-gray-200" />
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-[#253154]">Total Cost</span>
            <span className="text-base font-bold text-[#253154]">$1,010.00</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TAB 4: STUDENT JOURNEY
// ============================================

export const ForexStudentJourneyTab: React.FC<ReadOnlyTabProps> = ({
  providerId,
  addActivityLog,
  userRole,
}) => {
  const canEdit = userRole === 'admin' || userRole === 'superadmin';

  const [journeySteps, setJourneySteps] = useState([
    { id: '1', name: 'Select Provider', description: 'Student browses and selects forex provider', enabled: true, order: 1 },
    { id: '2', name: 'Enter Transfer Details', description: 'Amount, currency, recipient info', enabled: true, order: 2 },
    { id: '3', name: 'KYC Verification', description: 'Identity verification if required', enabled: true, order: 3 },
    { id: '4', name: 'Rate Lock / Quote', description: 'Exchange rate locked for transfer', enabled: true, order: 4 },
    { id: '5', name: 'Payment Initiation', description: 'Student initiates payment', enabled: true, order: 5 },
    { id: '6', name: 'Transfer Processing', description: 'Transfer in progress', enabled: true, order: 6 },
    { id: '7', name: 'Completion Confirmation', description: 'Transfer completed successfully', enabled: true, order: 7 },
  ]);

  const handleToggleStep = (stepId: string) => {
    setJourneySteps(prev => prev.map(step =>
      step.id === stepId ? { ...step, enabled: !step.enabled } : step
    ));
    toast.success('Journey step updated');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#253154]">Student Journey</h2>
          <p className="text-sm text-gray-600">Step-by-step transfer flow configuration</p>
        </div>

        {canEdit && (
          <Button size="sm" className="bg-[#0e042f] hover:bg-[#1a0a4a]">
            <Plus size={14} className="mr-2" />
            Add Step
          </Button>
        )}
      </div>

      {/* Journey Steps */}
      <div className="space-y-3">
        {journeySteps.map((step, index) => (
          <div key={step.id} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-start gap-4">
              {canEdit && (
                <div className="cursor-move">
                  <GripVertical size={20} className="text-gray-400" />
                </div>
              )}

              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm">
                {index + 1}
              </div>

              <div className="flex-1">
                <h3 className="text-base font-bold text-[#253154] mb-1">{step.name}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={step.enabled}
                  onCheckedChange={() => handleToggleStep(step.id)}
                  disabled={!canEdit}
                />
                {canEdit && (
                  <Button variant="ghost" size="sm">
                    <Edit3 size={14} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// TAB 5: ANALYTICS
// ============================================

export const ForexAnalyticsTab: React.FC<ReadOnlyTabProps> = ({
  providerId,
  addActivityLog,
  userRole,
}) => {
  const volumeData = [
    { month: 'Jan', transfers: 950, volume: 450000 },
    { month: 'Feb', transfers: 1120, volume: 520000 },
    { month: 'Mar', transfers: 1050, volume: 480000 },
    { month: 'Apr', transfers: 1340, volume: 610000 },
    { month: 'May', transfers: 1480, volume: 680000 },
    { month: 'Jun', transfers: 1560, volume: 720000 },
  ];

  const countryData = [
    { country: 'USA', value: 3500, color: '#3b82f6' },
    { country: 'UK', value: 2800, color: '#8b5cf6' },
    { country: 'Canada', value: 2100, color: '#10b981' },
    { country: 'Australia', value: 1600, color: '#f59e0b' },
    { country: 'Others', value: 2456, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#253154]">Performance Analytics</h2>
          <p className="text-sm text-gray-600">Transfer metrics and insights</p>
        </div>

        <div className="flex items-center gap-2">
          <Select defaultValue="last_30_days">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last_7_days">Last 7 Days</SelectItem>
              <SelectItem value="last_30_days">Last 30 Days</SelectItem>
              <SelectItem value="last_90_days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm">
            <Download size={14} className="mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <ArrowRightLeft size={16} className="text-blue-600" />
            <span className="text-xs font-semibold text-gray-700">Total Transfers</span>
          </div>
          <div className="text-2xl font-bold text-[#253154]">12,456</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">+12.5% vs last period</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-emerald-600" />
            <span className="text-xs font-semibold text-gray-700">Avg Transfer Size</span>
          </div>
          <div className="text-2xl font-bold text-[#253154]">$1,245</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">+5.2% vs last period</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Target size={16} className="text-purple-600" />
            <span className="text-xs font-semibold text-gray-700">Conversion Rate</span>
          </div>
          <div className="text-2xl font-bold text-[#253154]">94.5%</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">+2.1% vs last period</div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-amber-600" />
            <span className="text-xs font-semibold text-gray-700">Avg Completion</span>
          </div>
          <div className="text-2xl font-bold text-[#253154]">2.1h</div>
          <div className="text-xs text-emerald-600 font-semibold mt-1">-0.3h vs last period</div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Transfer Volume Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={volumeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="volume" stroke="#8b5cf6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Usage by Country</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={countryData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {countryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TAB 6: OPERATIONS
// ============================================

export const ForexOperationsTab: React.FC<TabProps> = ({
  providerId,
  providerData,
  setProviderData,
  addActivityLog,
  userRole,
}) => {
  const canEdit = userRole === 'admin' || userRole === 'superadmin';
  const canViewCredentials = userRole === 'superadmin';

  const [operations, setOperations] = useState({
    integrationMode: providerData.integrationType,
    environment: 'Production' as 'Sandbox' | 'Production',
    autoSync: true,
    syncFrequency: 'Hourly' as 'Hourly' | 'Daily' | 'Weekly',
    apiStatus: 'Connected' as 'Connected' | 'Disconnected' | 'Error',
    lastSync: '2 mins ago',
    webhookEnabled: true,
  });

  const [showCredentials, setShowCredentials] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleTestConnection = async () => {
    setIsTesting(true);
    toast.info('Testing API connection...');

    await new Promise(resolve => setTimeout(resolve, 2000));

    addActivityLog({
      user: 'Current Admin',
      action: 'Updated',
      entity: 'API Connection',
      entityId: providerId,
      changes: 'Connection test successful',
      metadata: { section: 'Operations' },
    });

    toast.success('API connection test successful');
    setIsTesting(false);
  };

  const handleSyncNow = async () => {
    toast.info('Syncing exchange rates...');

    await new Promise(resolve => setTimeout(resolve, 1500));

    addActivityLog({
      user: 'Current Admin',
      action: 'Synced',
      entity: 'Exchange Rates',
      entityId: providerId,
      changes: 'Manual sync completed successfully',
      metadata: { section: 'Operations' },
    });

    toast.success('Exchange rates synced successfully');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#253154]">Operations & Integration</h2>
          <p className="text-sm text-gray-600">Technical and operational controls</p>
        </div>

        {!canEdit && (
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-sm font-semibold text-amber-900">
            Read-Only Mode
          </div>
        )}
      </div>

      {/* Integration Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-base font-bold text-[#253154] mb-4">Integration Configuration</h3>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Integration Mode</div>
            <div className="text-base font-bold text-[#253154]">{operations.integrationMode}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Environment</div>
            <div className="text-base font-bold text-[#253154]">{operations.environment}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">API Status</div>
            <div className="flex items-center gap-2">
              {operations.apiStatus === 'Connected' && (
                <>
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-base font-bold text-emerald-900">Connected</span>
                </>
              )}
            </div>
          </div>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2 mt-4">
            <Button size="sm" onClick={handleTestConnection} disabled={isTesting}>
              <TestTube size={14} className="mr-2" />
              {isTesting ? 'Testing...' : 'Test Connection'}
            </Button>
            <Button variant="outline" size="sm">
              <Settings size={14} className="mr-2" />
              Edit Configuration
            </Button>
          </div>
        )}
      </div>

      {/* Sync Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-[#253154]">Sync & Automation</h3>

          {canEdit && (
            <Button size="sm" onClick={handleSyncNow}>
              <RefreshCw size={14} className="mr-2" />
              Sync Now
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-gray-700">Auto Sync</div>
              <Switch checked={operations.autoSync} disabled={!canEdit} />
            </div>
            <div className="text-xs text-gray-600">
              {operations.autoSync ? 'Enabled' : 'Disabled'}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-semibold text-gray-700 mb-2">Sync Frequency</div>
            <div className="text-base font-bold text-[#253154]">{operations.syncFrequency}</div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Last Sync</div>
            <div className="text-base font-bold text-[#253154]">{operations.lastSync}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">✓ Success</div>
          </div>
        </div>
      </div>

      {/* API Credentials */}
      {canViewCredentials && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">API Credentials</h3>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-700 mb-1">API Key</div>
              <code className="text-xs text-gray-600 font-mono">
                {showCredentials ? 'sk_live_4xKz9...R8Qm' : '••••••••••••••••'}
              </code>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCredentials(!showCredentials)}
            >
              {showCredentials ? <EyeOff size={14} /> : <Eye size={14} />}
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button variant="outline" size="sm">
              Rotate Credentials
            </Button>
            <Button variant="outline" size="sm">
              Copy API Key
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};