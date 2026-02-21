/**
 * SIM CARD PROVIDER DETAIL PAGE
 * Services & Marketplace → SIM Cards → Provider Details
 * 
 * Complete SIM card provider detail view with tabs:
 * Overview, Funnel, Plans, Analytics, Revenue, Attribution/Tracking, Operations, Settings, Logs, Contracts
 */

"use client";

import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  Globe,
  Building2,
  Calendar,
  Users,
  Activity,
  DollarSign,
  TrendingUp,
  Shield,
  RefreshCw,
  Edit3,
  Settings,
  XCircle,
  Smartphone,
  Signal,
  MapPin,
  Zap,
  Clock,
  Package,
  CreditCard,
  BarChart3,
  ExternalLink,
  Phone,
  Mail,
  AlertCircle,
  CheckSquare,
  Lock,
  Eye,
  EyeOff,
  Tag,
} from 'lucide-react';
import { ServiceProviderDetailTemplate } from './common/ServiceProviderDetailTemplate';
import type {
  ServiceProvider,
  KPICard,
  TabDefinition,
  ActionButton,
} from './common/ServiceProviderDetailTemplate';

// ============================================
// MOCK DATA
// ============================================

const simProvider: ServiceProvider = {
  id: 'SIM-2024-001',
  name: 'Airalo Plus',
  avatar: '📶',
  status: 'active',
  metadata: [
    {
      icon: FileText,
      value: 'SIM-2024-001',
      color: 'gray',
    },
    {
      icon: CheckCircle,
      value: 'Active Partner',
      color: 'emerald',
    },
    {
      icon: Globe,
      value: '150+ Countries',
      color: 'blue',
    },
    {
      icon: Building2,
      value: 'Enterprise Partner',
      color: 'purple',
    },
    {
      icon: Calendar,
      value: 'Onboarded Dec 10, 2023',
      color: 'gray',
    },
  ],
};

const kpis: KPICard[] = [
  {
    icon: Users,
    label: 'Total Students',
    value: '2,847',
    subtitle: 'Using this provider',
    color: 'blue',
  },
  {
    icon: Smartphone,
    label: 'Active SIMs',
    value: '2,634',
    subtitle: 'Currently active',
    color: 'emerald',
  },
  {
    icon: DollarSign,
    label: 'Monthly Revenue',
    value: '$42.8K',
    subtitle: 'This month',
    color: 'purple',
  },
  {
    icon: TrendingUp,
    label: 'Activation Rate',
    value: '94.2%',
    subtitle: 'Within 24h',
    color: 'amber',
  },
  {
    icon: Signal,
    label: 'Service Quality',
    value: '4.7/5',
    subtitle: 'Average rating',
    color: 'gray',
  },
];

// ============================================
// TAB COMPONENTS
// ============================================

const OverviewTab = () => (
  <div className="space-y-6">
    {/* Provider Profile */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Provider Profile</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500 mb-1">Legal Name</div>
          <div className="font-semibold text-gray-900">Airalo Plus International Ltd.</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Headquarters</div>
          <div className="text-sm text-gray-700">Singapore</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Account Manager</div>
          <div className="text-sm text-gray-700">Michael Chen</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Contract Period</div>
          <div className="text-sm text-gray-700">2024-2026</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Support Email</div>
          <div className="text-sm text-blue-600">partners@airalo.com</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1">Support Phone</div>
          <div className="text-sm text-gray-700">+65 6123 4567</div>
        </div>
      </div>
    </div>

    {/* SIM Types Available */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Available SIM Types</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Smartphone className="w-5 h-5 text-purple-600" />
            <div className="font-semibold text-purple-900">eSIM</div>
          </div>
          <div className="text-2xl font-bold text-purple-900 mb-1">1,845</div>
          <div className="text-xs text-purple-700">Active eSIMs</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Package className="w-5 h-5 text-blue-600" />
            <div className="font-semibold text-blue-900">Physical SIM</div>
          </div>
          <div className="text-2xl font-bold text-blue-900 mb-1">789</div>
          <div className="text-xs text-blue-700">Active Physical SIMs</div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="flex items-center gap-2 mb-2">
            <Signal className="w-5 h-5 text-emerald-600" />
            <div className="font-semibold text-emerald-900">Activation Rate</div>
          </div>
          <div className="text-2xl font-bold text-emerald-900 mb-1">94.2%</div>
          <div className="text-xs text-emerald-700">Within 24 hours</div>
        </div>
      </div>
    </div>

    {/* Coverage */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Global Coverage</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {['USA', 'Canada', 'UK', 'EU', 'Australia', 'Japan', 'Singapore', 'India'].map((country) => (
          <div key={country} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-4 h-4 text-gray-600" />
            <span className="text-sm text-gray-700">{country}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-sm text-gray-600">
        + 142 more countries
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Activity</h2>
      <div className="space-y-3">
        {[
          { student: 'Sarah Johnson', action: 'eSIM activated', plan: '10GB USA Plan', time: '1h ago' },
          { student: 'Wei Zhang', action: 'Physical SIM ordered', plan: '5GB EU Plan', time: '3h ago' },
          { student: 'Maria Garcia', action: 'Plan renewed', plan: '20GB Global Plan', time: '5h ago' },
        ].map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div>
              <div className="font-medium text-gray-900">{activity.student}</div>
              <div className="text-sm text-gray-600">{activity.action} · {activity.plan}</div>
            </div>
            <div className="text-sm text-gray-500">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const FunnelTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Activation Funnel</h2>
      <div className="text-center py-12 text-gray-500">
        <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Funnel analytics coming soon</p>
      </div>
    </div>
  </div>
);

const PlansTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Available Plans</h2>
      <div className="space-y-3">
        {[
          { name: '5GB USA Plan', price: '$15', validity: '30 days', students: 543 },
          { name: '10GB Global Plan', price: '$35', validity: '30 days', students: 892 },
          { name: '20GB EU Plan', price: '$25', validity: '30 days', students: 456 },
        ].map((plan, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div>
              <div className="font-semibold text-gray-900">{plan.name}</div>
              <div className="text-sm text-gray-600">{plan.students} students • {plan.validity}</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{plan.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AnalyticsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Analytics Dashboard</h2>
      <div className="text-center py-12 text-gray-500">
        <TrendingUp className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Analytics dashboard coming soon</p>
      </div>
    </div>
  </div>
);

const RevenueTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-xs font-semibold text-purple-600 uppercase mb-1">This Month</div>
          <div className="text-2xl font-bold text-purple-900">$42,845</div>
          <div className="text-xs text-purple-700 mt-1">+12.5% vs last month</div>
        </div>
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs font-semibold text-blue-600 uppercase mb-1">Last Month</div>
          <div className="text-2xl font-bold text-blue-900">$38,120</div>
          <div className="text-xs text-blue-700 mt-1">Previous period</div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="text-xs font-semibold text-emerald-600 uppercase mb-1">Year to Date</div>
          <div className="text-2xl font-bold text-emerald-900">$387.5K</div>
          <div className="text-xs text-emerald-700 mt-1">2024 total</div>
        </div>
      </div>
    </div>
  </div>
);

const OperationsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Operational Metrics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-xs font-semibold text-blue-600 uppercase mb-1">Avg. Activation Time</div>
          <div className="text-2xl font-bold text-blue-900">18 min</div>
          <div className="text-xs text-blue-700 mt-1">For eSIM activation</div>
        </div>
        <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
          <div className="text-xs font-semibold text-emerald-600 uppercase mb-1">Success Rate</div>
          <div className="text-2xl font-bold text-emerald-900">98.4%</div>
          <div className="text-xs text-emerald-700 mt-1">Activation success</div>
        </div>
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="text-xs font-semibold text-amber-600 uppercase mb-1">Support Tickets</div>
          <div className="text-2xl font-bold text-amber-900">23</div>
          <div className="text-xs text-amber-700 mt-1">Open tickets</div>
        </div>
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <div className="text-xs font-semibold text-purple-600 uppercase mb-1">Network Quality</div>
          <div className="text-2xl font-bold text-purple-900">4.7/5</div>
          <div className="text-xs text-purple-700 mt-1">Average rating</div>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// SETTINGS TAB (MINIMAL & ESSENTIAL)
// ============================================

const SettingsTab = () => {
  const [serviceStatus, setServiceStatus] = useState<'active' | 'paused'>('active');
  const [displayName, setDisplayName] = useState('Airalo Plus');
  const [partnerType] = useState('API');
  const [internalNotes, setInternalNotes] = useState('');

  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [supportedCountries, setSupportedCountries] = useState(['USA', 'Canada', 'UK', 'EU']);
  const [temporarilyDisabled, setTemporarilyDisabled] = useState(false);

  const [simType, setSimType] = useState<'esim' | 'physical' | 'both'>('both');
  const [autoActivate, setAutoActivate] = useState(true);
  const [activationWindow, setActivationWindow] = useState('24');
  const [dataRollover, setDataRollover] = useState(false);

  return (
    <div className="space-y-6">
      {/* 1️⃣ GENERAL SETTINGS */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">General Settings</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Core service configuration
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Service Status */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xs font-semibold text-purple-600 uppercase mb-2">Service Status</div>
            <select
              value={serviceStatus}
              onChange={(e) => setServiceStatus(e.target.value as 'active' | 'paused')}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
            <div className="text-xs text-purple-700 mt-1">Current operational status</div>
          </div>

          {/* Display Name */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs font-semibold text-blue-600 uppercase mb-2">Display Name</div>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
            />
            <div className="text-xs text-blue-700 mt-1">Public-facing name</div>
          </div>

          {/* Partner Type (Read-Only) */}
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-gray-500 uppercase">Partner Type</div>
              <Lock size={14} className="text-gray-500" />
            </div>
            <div className="font-bold text-gray-900 text-sm">{partnerType}</div>
            <div className="text-xs text-gray-600 mt-1">Integration method (read-only)</div>
          </div>
        </div>

        {/* Internal Notes */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="text-xs font-semibold text-gray-600 uppercase mb-2">Internal Notes (Admin Only)</div>
          <textarea
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
            placeholder="Add internal notes about this provider..."
          />
          <div className="text-xs text-gray-600 mt-1">Private notes, not visible to students</div>
        </div>
      </div>

      {/* 2️⃣ AVAILABILITY & VISIBILITY */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Eye className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Availability & Visibility</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Control where SIM cards are available
        </div>

        <div className="space-y-4">
          {/* Visibility */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs font-semibold text-blue-600 uppercase mb-2">Visibility</div>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
            >
              <option value="public">Public</option>
              <option value="private">Private (Admin Only)</option>
            </select>
            <div className="text-xs text-blue-700 mt-1">Who can see this provider</div>
          </div>

          {/* Supported Countries */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xs font-semibold text-purple-600 uppercase mb-2">Supported Countries</div>
            <div className="flex flex-wrap gap-2 mb-2">
              {supportedCountries.map((country) => (
                <span key={country} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs font-medium">
                  {country}
                </span>
              ))}
            </div>
            <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors">
              + Add Country
            </button>
          </div>

          {/* Temporary Disable */}
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div>
              <div className="font-semibold text-amber-900 text-sm">Temporarily Disabled</div>
              <div className="text-xs text-amber-700 mt-0.5">Pause service without deleting configuration</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={temporarilyDisabled}
                onChange={(e) => setTemporarilyDisabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 3️⃣ SIM-SPECIFIC SETTINGS */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Smartphone className="w-5 h-5 text-emerald-600" />
          <h2 className="text-lg font-bold text-gray-900">SIM-Specific Settings</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Core SIM behavior configuration
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* SIM Type */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-xs font-semibold text-blue-600 uppercase mb-2">SIM Type</div>
            <select
              value={simType}
              onChange={(e) => setSimType(e.target.value as 'esim' | 'physical' | 'both')}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
            >
              <option value="esim">eSIM Only</option>
              <option value="physical">Physical SIM Only</option>
              <option value="both">Both eSIM & Physical</option>
            </select>
            <div className="text-xs text-blue-700 mt-1">Type of SIM card offered</div>
          </div>

          {/* Activation Time Window */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xs font-semibold text-purple-600 uppercase mb-2">Activation Time Window (hours)</div>
            <input
              type="number"
              value={activationWindow}
              onChange={(e) => setActivationWindow(e.target.value)}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm"
              placeholder="e.g., 24"
            />
            <div className="text-xs text-purple-700 mt-1">Time window for activation</div>
          </div>

          {/* Auto-Activate on Purchase */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
            <div>
              <div className="font-semibold text-emerald-900 text-sm">Auto-Activate on Purchase</div>
              <div className="text-xs text-emerald-700 mt-0.5">Automatically activate upon purchase</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoActivate}
                onChange={(e) => setAutoActivate(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          {/* Data Rollover Allowed */}
          <div className="flex items-center justify-between p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div>
              <div className="font-semibold text-amber-900 text-sm">Data Rollover Allowed</div>
              <div className="text-xs text-amber-700 mt-0.5">Allow unused data to rollover</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={dataRollover}
                onChange={(e) => setDataRollover(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

const LogsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Activity Logs</h2>
      <div className="space-y-3">
        {[
          { action: 'Provider settings updated', admin: 'Sarah Johnson', time: '2024-02-09 10:30 AM' },
          { action: 'New plan added: 15GB Global', admin: 'Michael Chen', time: '2024-02-08 02:15 PM' },
          { action: 'Coverage expanded to Japan', admin: 'Emily Rodriguez', time: '2024-02-07 09:45 AM' },
        ].map((log, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <FileText className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">{log.action}</div>
              <div className="text-xs text-gray-600 mt-0.5">
                By {log.admin} • {log.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ContractsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Contracts & Agreements</h2>
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>Contract management coming soon</p>
      </div>
    </div>
  </div>
);

// ============================================
// TABS CONFIGURATION
// ============================================

const tabs: TabDefinition[] = [
  { id: 'overview', label: 'Overview', component: OverviewTab },
  { id: 'funnel', label: 'Funnel', component: FunnelTab },
  { id: 'plans', label: 'Plans', component: PlansTab },
  { id: 'analytics', label: 'Analytics', component: AnalyticsTab },
  { id: 'revenue', label: 'Revenue', component: RevenueTab },
  { id: 'operations', label: 'Operations', component: OperationsTab },
  { id: 'settings', label: 'Settings', component: SettingsTab }, // 👈 ADDED AFTER OPERATIONS
  { id: 'logs', label: 'Logs', component: LogsTab },
  { id: 'contracts', label: 'Contracts', component: ContractsTab },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const SIMCardProviderDetail: React.FC<{ providerId?: string; onBack?: () => void }> = ({ providerId, onBack }) => {
  const [providerStatus, setProviderStatus] = useState<'active' | 'inactive'>('active');

  // Action buttons
  const actionButtons: ActionButton[] = [
    {
      icon: RefreshCw,
      label: 'Sync',
      onClick: () => console.log('Sync clicked'),
      variant: 'secondary' as const,
    },
    {
      icon: Edit3,
      label: 'Edit',
      onClick: () => console.log('Edit clicked'),
      variant: 'secondary' as const,
    },
    {
      icon: Settings,
      label: 'Settings',
      onClick: () => console.log('Settings clicked'),
      variant: 'secondary' as const,
    },
  ];

  return (
    <ServiceProviderDetailTemplate
      provider={simProvider}
      kpis={kpis}
      tabs={tabs}
      actions={actionButtons}
      onBack={onBack}
      breadcrumbs={['Services', 'SIM Cards', 'Airalo Plus']}
    />
  );
};

export default SIMCardProviderDetail;