/**
 * BANK PROVIDER DETAIL PAGE
 * Services & Marketplace → Banks → Provider Details
 * 
 * ✅ FULLY STANDARDIZED TO MATCH SIM CARDS HEADER PATTERN
 * - Uses ServiceProviderDetailTemplate for consistent layout
 * - Uses EditProviderModal for universal edit functionality
 * - Uses useProviderActions hook for standardized actions
 * - Includes 3-dot overflow menu with all standard options
 * - Tab switching (not navigation)
 * - Consistent interactions and feedback
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
  CreditCard,
  Percent,
  Clock,
  AlertCircle,
  CheckSquare,
  XCircle,
  MapPin,
  Flag,
  FileCheck,
  Link2,
  Zap,
  AlertTriangle,
  Eye,
  EyeOff,
  Lock,
  Settings as SettingsIcon,
  RotateCcw,
  Search,
  Filter,
  MoreVertical,
  Star,
  BarChart3,
} from 'lucide-react';
import { toast } from 'sonner';
import { ServiceProviderDetailTemplate } from './common/ServiceProviderDetailTemplate';
import { EditProviderModal } from './common/EditProviderModal';
import { useProviderActions } from './common/useProviderActions';
import type { ProviderBasicData } from './common/EditProviderModal';
import type {
  ServiceProvider,
  KPICard,
  TabDefinition,
} from './common/ServiceProviderDetailTemplate';

// ============================================
// PROVIDER DATA
// ============================================

const bankProvider: ServiceProvider = {
  id: 'BNK-2024-001',
  name: 'Chase Bank',
  avatar: '🏦',
  status: 'active',
  metadata: [
    {
      icon: FileText,
      value: 'BNK-2024-001',
      color: 'gray',
    },
    {
      icon: CheckCircle,
      value: 'Active Partner',
      color: 'emerald',
    },
    {
      icon: Globe,
      value: '50+ Countries',
      color: 'blue',
    },
    {
      icon: Building2,
      value: 'Enterprise Partner',
      color: 'purple',
    },
    {
      icon: Calendar,
      value: 'Onboarded Jan 15, 2024',
      color: 'gray',
    },
  ],
};

const kpis: KPICard[] = [
  {
    icon: Users,
    label: 'Total Students',
    value: '1,245',
    subtitle: 'Using this bank',
    color: 'blue',
  },
  {
    icon: Activity,
    label: 'Active Accounts',
    value: '1,089',
    subtitle: 'Currently active',
    color: 'emerald',
  },
  {
    icon: DollarSign,
    label: 'Monthly Volume',
    value: '$2.4M',
    subtitle: 'This month',
    color: 'purple',
  },
  {
    icon: TrendingUp,
    label: 'Conversion Rate',
    value: '87.5%',
    subtitle: 'Last 30 days',
    color: 'amber',
  },
  {
    icon: Star,
    label: 'Satisfaction',
    value: '4.8/5',
    subtitle: 'Average rating',
    color: 'gray',
  },
];

// ============================================
// TAB COMPONENTS
// ============================================

const OverviewTab = () => (
  <div className="space-y-6">
    {/* Bank Profile Card */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Bank Profile</h2>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          View Full Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Legal Name</div>
          <div className="font-semibold text-gray-900">JPMorgan Chase Bank, N.A.</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Headquarters</div>
          <div className="text-sm text-gray-700">New York, NY, USA</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Account Manager</div>
          <div className="text-sm text-gray-700">Sarah Johnson</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Contract Period</div>
          <div className="text-sm text-gray-700">2024-2027 (3 years)</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Support Email</div>
          <div className="text-sm text-blue-600">partners@chase.com</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Support Phone</div>
          <div className="text-sm text-gray-700">+1 (800) 935-9935</div>
        </div>
      </div>
    </div>

    {/* Application Flow Section */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Zap className="w-5 h-5 text-purple-600" />
        <h2 className="text-xl font-bold text-gray-900">Application Flow</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Application Type */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Application Type</div>
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <Link2 className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-blue-900">Instant Online</div>
              <div className="text-xs text-blue-700 mt-0.5">Students apply directly via bank portal</div>
            </div>
          </div>
        </div>

        {/* Application Redirection */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Application Redirection</div>
          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
            <Globe className="w-6 h-6 text-purple-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-purple-900">External Website</div>
              <div className="text-xs text-purple-700 font-mono truncate mt-0.5">chase.com/student</div>
            </div>
          </div>
        </div>

        {/* Average Onboarding Time */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Avg. Onboarding Time</div>
          <div className="flex items-center gap-3 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <Clock className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-emerald-900">2-3 Business Days</div>
              <div className="text-xs text-emerald-700 mt-0.5">From application to activation</div>
            </div>
          </div>
        </div>

        {/* Known Failure Points */}
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase mb-3">Known Failure Points</div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Incomplete visa documentation</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Address verification delays</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-700">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>International ID validation issues</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
        <div className="text-xs text-gray-600">
          <span className="font-semibold">Note:</span> Application flow settings can be configured in the Settings tab. Changes require admin approval.
        </div>
      </div>
    </div>

    {/* Account Types */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Available Account Types</h2>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          Manage Accounts
        </button>
      </div>

      <div className="space-y-3">
        {[
          { name: 'Chase College Checking', students: 543, fee: '$0', minBalance: '$0', recommended: true },
          { name: 'Chase Total Checking', students: 312, fee: '$12/mo', minBalance: '$1,500', recommended: false },
          { name: 'Chase Savings Account', students: 234, fee: '$5/mo', minBalance: '$300', recommended: false },
        ].map((account, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all group">
            <div>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-gray-900">{account.name}</div>
                {account.recommended && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase rounded-md">
                    Recommended
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">{account.students} students enrolled</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">{account.fee}</div>
              <div className="text-xs text-gray-500">Min: {account.minBalance}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Activity */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {[
          { student: 'John Smith', action: 'Account opened', account: 'College Checking', time: '2h ago', status: 'success' },
          { student: 'Maria Garcia', action: 'Deposit made', account: 'Total Checking', time: '5h ago', status: 'success' },
          { student: 'Wei Zhang', action: 'Card activated', account: 'College Checking', time: '1d ago', status: 'success' },
          { student: 'Priya Patel', action: 'Application pending', account: 'Savings Account', time: '2d ago', status: 'pending' },
        ].map((activity, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${activity.status === 'success' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <div>
                <div className="font-medium text-gray-900">{activity.student}</div>
                <div className="text-sm text-gray-600">{activity.action} · {activity.account}</div>
              </div>
            </div>
            <div className="text-sm text-gray-500">{activity.time}</div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const AccountsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Student Accounts</h2>
          <p className="text-sm text-gray-600 mt-1">All bank accounts opened by students</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            />
          </div>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
            <option>All Accounts</option>
            <option>Active</option>
            <option>Inactive</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Student</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Account Type</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Opened</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Balance</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { student: 'John Smith', type: 'College Checking', opened: '2024-01-15', balance: '$2,456', status: 'active' },
              { student: 'Maria Garcia', type: 'Total Checking', opened: '2024-01-18', balance: '$5,234', status: 'active' },
              { student: 'Wei Zhang', type: 'Savings', opened: '2024-01-20', balance: '$8,123', status: 'active' },
              { student: 'Priya Patel', type: 'College Checking', opened: '2024-01-22', balance: '$1,890', status: 'active' },
              { student: 'Alex Johnson', type: 'Total Checking', opened: '2024-01-25', balance: '$3,567', status: 'pending' },
            ].map((account, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 font-medium text-gray-900">{account.student}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{account.type}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{account.opened}</td>
                <td className="py-4 px-4 text-right font-semibold text-gray-900">{account.balance}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${account.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                    }`}>
                    {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-4 text-center">
                  <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">5</span> of <span className="font-semibold">1,089</span> accounts
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button className="px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium">1</button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">2</button>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">3</button>
          <span className="px-2 text-gray-500">...</span>
          <button className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
);

const TransactionsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
          <p className="text-sm text-gray-600 mt-1">All transactions are read-only for audit purposes</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2">
          <FileText size={16} />
          Export
        </button>
      </div>

      {/* Read-Only Notice */}
      <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200 flex items-center gap-3">
        <Lock size={18} className="text-blue-600 flex-shrink-0" />
        <div className="text-sm text-blue-800">
          <span className="font-semibold">Read-Only:</span> Transaction data is immutable for compliance and audit purposes.
        </div>
      </div>

      {/* Transaction Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Volume</div>
          <div className="text-2xl font-bold text-gray-900">$87,450</div>
          <div className="text-xs text-gray-600 mt-1">Last 30 days</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200">
          <div className="text-xs font-semibold text-emerald-600 uppercase mb-1">Completed</div>
          <div className="text-2xl font-bold text-emerald-700">1,089</div>
          <div className="text-xs text-emerald-600 mt-1">87.4% success rate</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200">
          <div className="text-xs font-semibold text-amber-600 uppercase mb-1">Pending</div>
          <div className="text-2xl font-bold text-amber-700">42</div>
          <div className="text-xs text-amber-600 mt-1">Awaiting settlement</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200">
          <div className="text-xs font-semibold text-red-600 uppercase mb-1">Failed</div>
          <div className="text-2xl font-bold text-red-700">15</div>
          <div className="text-xs text-red-600 mt-1">Requires attention</div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Transaction ID</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Student</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { id: 'TXN-1245', student: 'John Smith', type: 'Deposit', amount: '+$500.00', date: '2024-02-05', status: 'Completed' },
              { id: 'TXN-1244', student: 'Maria Garcia', type: 'Withdrawal', amount: '-$150.00', date: '2024-02-05', status: 'Completed' },
              { id: 'TXN-1243', student: 'Wei Zhang', type: 'Transfer', amount: '-$1,200.00', date: '2024-02-04', status: 'Pending' },
              { id: 'TXN-1242', student: 'Priya Patel', type: 'Deposit', amount: '+$2,500.00', date: '2024-02-04', status: 'Failed' },
            ].map((txn, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-xs text-gray-700">{txn.id}</td>
                <td className="py-3 px-4 font-medium text-gray-900 text-sm">{txn.student}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{txn.type}</td>
                <td className={`py-3 px-4 text-right font-semibold text-sm ${txn.amount.startsWith('+') ? 'text-emerald-700' : 'text-gray-900'
                  }`}>
                  {txn.amount}
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{txn.date}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${txn.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                    txn.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const AnalyticsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Banking Analytics</h2>
      <div className="text-center py-20 text-gray-500">
        <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">Analytics Dashboard</p>
        <p className="text-sm mt-2">Detailed analytics coming soon</p>
      </div>
    </div>
  </div>
);

const SettingsTab = () => {
  const [serviceStatus, setServiceStatus] = useState<'active' | 'paused'>('active');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [kycRequired, setKycRequired] = useState(true);
  const [ssnRequired, setSsnRequired] = useState(true);

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <SettingsIcon className="w-5 h-5 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900">General Settings</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Service Status */}
          <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
            <label className="block text-sm font-semibold text-purple-900 mb-2">Service Status</label>
            <select
              value={serviceStatus}
              onChange={(e) => setServiceStatus(e.target.value as 'active' | 'paused')}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
            </select>
            <p className="text-xs text-purple-700 mt-2">Current operational status</p>
          </div>

          {/* Visibility */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <label className="block text-sm font-semibold text-blue-900 mb-2">Visibility</label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as 'public' | 'private')}
              className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="public">Public (Visible to all students)</option>
              <option value="private">Private (Admin only)</option>
            </select>
            <p className="text-xs text-blue-700 mt-2">Who can see this bank</p>
          </div>
        </div>
      </div>

      {/* Bank Requirements */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">Bank Requirements</h2>
        </div>

        <div className="space-y-4">
          {/* KYC Required */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div>
              <div className="font-semibold text-blue-900">KYC Required</div>
              <div className="text-sm text-blue-700 mt-1">Know Your Customer verification</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={kycRequired}
                onChange={(e) => setKycRequired(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* SSN Required */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div>
              <div className="font-semibold text-emerald-900">SSN / ITIN Required</div>
              <div className="text-sm text-emerald-700 mt-1">Tax identification number required</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ssnRequired}
                onChange={(e) => setSsnRequired(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={() => toast.success('Settings saved successfully')}
          className="px-6 py-3 bg-[#253154] hover:bg-[#1a0a4a] text-white rounded-xl font-semibold transition-colors shadow-lg"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
};

const LogsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Activity Logs</h2>
      <div className="text-center py-20 text-gray-500">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">Activity Logs</p>
        <p className="text-sm mt-2">Audit trail and system logs coming soon</p>
      </div>
    </div>
  </div>
);

const ContractsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Contracts & Agreements</h2>
      <div className="text-center py-20 text-gray-500">
        <FileCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">Contract Management</p>
        <p className="text-sm mt-2">Partner agreements and documents coming soon</p>
      </div>
    </div>
  </div>
);

// ============================================
// TAB DEFINITIONS
// ============================================

const tabs: TabDefinition[] = [
  { id: 'overview', label: 'Overview', component: OverviewTab },
  { id: 'accounts', label: 'Accounts', component: AccountsTab },
  { id: 'transactions', label: 'Transactions', component: TransactionsTab },
  { id: 'analytics', label: 'Analytics', component: AnalyticsTab },
  { id: 'settings', label: 'Settings', component: SettingsTab },
  { id: 'logs', label: 'Logs', component: LogsTab },
  { id: 'contracts', label: 'Contracts', component: ContractsTab },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const BankProviderDetail: React.FC<{ providerId?: string; onBack?: () => void }> = ({ providerId, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Initial provider data for edit modal
  const initialProviderData: ProviderBasicData = {
    providerName: 'Chase Bank',
    legalName: 'JPMorgan Chase Bank, N.A.',
    headquarters: 'New York, NY, USA',
    supportedCountries: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'],
    partnerType: 'API Integration',
    accountManager: 'Sarah Johnson',
    supportEmail: 'partners@chase.com',
    supportPhone: '+1 (800) 935-9935',
  };

  // Initialize standardized provider actions
  const providerActions = useProviderActions({
    serviceType: 'Bank',
    providerId: bankProvider.id,
    providerName: bankProvider.name,
    initialData: initialProviderData,
    onTabChange: (tabId) => {
      setActiveTab(tabId);
      toast.info(`Navigated to ${tabId.charAt(0).toUpperCase() + tabId.slice(1)} tab`);
    },
    onProviderUpdate: (data) => {
      console.log('Provider updated:', data);
      toast.success('Bank provider details updated successfully');
    },
  });

  return (
    <>
      <ServiceProviderDetailTemplate
        provider={bankProvider}
        kpis={kpis}
        tabs={tabs}
        actions={providerActions.actions}
        onBack={onBack}
        breadcrumbs={['Services', 'Banks', bankProvider.name]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        renderCustomActions={providerActions.renderMoreMenu}
      />

      {/* Edit Provider Modal */}
      <EditProviderModal
        isOpen={providerActions.isEditModalOpen}
        onClose={() => providerActions.setIsEditModalOpen(false)}
        onSave={providerActions.handleSaveProvider}
        serviceType="Bank"
        initialData={providerActions.providerData}
      />
    </>
  );
};

export default BankProviderDetail;
