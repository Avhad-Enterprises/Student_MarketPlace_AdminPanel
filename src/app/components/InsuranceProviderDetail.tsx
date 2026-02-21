/**
 * INSURANCE PROVIDER DETAIL PAGE
 * Services & Marketplace → Insurance → Provider Details
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
  Heart,
  Stethoscope,
  Clock,
  AlertCircle,
  CheckSquare,
  XCircle,
  MapPin,
  FileCheck,
  Zap,
  AlertTriangle,
  Eye,
  Lock,
  Settings as SettingsIcon,
  Star,
  BarChart3,
  Percent,
  CreditCard,
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

const insuranceProvider: ServiceProvider = {
  id: 'INS-2024-001',
  name: 'ISO Student Insurance',
  avatar: '🏥',
  status: 'active',
  metadata: [
    {
      icon: FileText,
      value: 'INS-2024-001',
      color: 'gray',
    },
    {
      icon: CheckCircle,
      value: 'Active Partner',
      color: 'emerald',
    },
    {
      icon: Globe,
      value: '195 Countries',
      color: 'blue',
    },
    {
      icon: Building2,
      value: 'Premium Partner',
      color: 'purple',
    },
    {
      icon: Calendar,
      value: 'Onboarded Nov 8, 2023',
      color: 'gray',
    },
  ],
};

const kpis: KPICard[] = [
  {
    icon: Users,
    label: 'Total Students',
    value: '3,284',
    subtitle: 'Insured students',
    color: 'blue',
  },
  {
    icon: Shield,
    label: 'Active Policies',
    value: '3,145',
    subtitle: 'Currently active',
    color: 'emerald',
  },
  {
    icon: DollarSign,
    label: 'Monthly Premium',
    value: '$42.8K',
    subtitle: 'This month',
    color: 'purple',
  },
  {
    icon: TrendingUp,
    label: 'Claims Success',
    value: '94.2%',
    subtitle: 'Approved claims',
    color: 'amber',
  },
  {
    icon: Star,
    label: 'Satisfaction',
    value: '4.9/5',
    subtitle: 'Average rating',
    color: 'gray',
  },
];

// ============================================
// TAB COMPONENTS
// ============================================

const OverviewTab = () => (
  <div className="space-y-6">
    {/* Insurance Profile Card */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Insurance Profile</h2>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          View Full Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Legal Name</div>
          <div className="font-semibold text-gray-900">International Student Insurance, LLC</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Headquarters</div>
          <div className="text-sm text-gray-700">Chicago, IL, USA</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Account Manager</div>
          <div className="text-sm text-gray-700">Emily Chen</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Contract Period</div>
          <div className="text-sm text-gray-700">2023-2026 (3 years)</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Support Email</div>
          <div className="text-sm text-blue-600">support@isostudent.com</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Support Phone</div>
          <div className="text-sm text-gray-700">+1 (800) 244-1180</div>
        </div>
      </div>
    </div>

    {/* Coverage Highlights */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="w-5 h-5 text-emerald-600" />
        <h2 className="text-xl font-bold text-gray-900">Coverage Highlights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Medical Coverage */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-blue-600" />
            <div className="font-semibold text-blue-900">Medical Coverage</div>
          </div>
          <div className="text-2xl font-bold text-blue-700 mb-1">$500K</div>
          <div className="text-xs text-blue-600">Maximum coverage</div>
        </div>

        {/* Emergency Services */}
        <div className="p-4 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <Stethoscope className="w-5 h-5 text-red-600" />
            <div className="font-semibold text-red-900">Emergency Services</div>
          </div>
          <div className="text-2xl font-bold text-red-700 mb-1">24/7</div>
          <div className="text-xs text-red-600">Available worldwide</div>
        </div>

        {/* Mental Health */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-5 h-5 text-purple-600" />
            <div className="font-semibold text-purple-900">Mental Health</div>
          </div>
          <div className="text-2xl font-bold text-purple-700 mb-1">$50K</div>
          <div className="text-xs text-purple-600">Coverage included</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          'Prescription Drugs',
          'Dental Emergency',
          'Vision Care',
          'Maternity Care',
          'COVID-19 Coverage',
          'Preventive Care',
          'Physical Therapy',
          'Lab Services',
        ].map((benefit, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{benefit}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Plan Options */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Available Plans</h2>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          Manage Plans
        </button>
      </div>

      <div className="space-y-3">
        {[
          { name: 'Essential Plan', students: 1245, premium: '$45/mo', deductible: '$50', recommended: false },
          { name: 'Standard Plan', students: 1567, premium: '$78/mo', deductible: '$25', recommended: true },
          { name: 'Premium Plan', students: 333, premium: '$125/mo', deductible: '$0', recommended: false },
        ].map((plan, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-gray-900">{plan.name}</div>
                {plan.recommended && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase rounded-md">
                    Most Popular
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">{plan.students} students enrolled</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">{plan.premium}</div>
              <div className="text-xs text-gray-500">Deductible: {plan.deductible}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Claims */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Claims</h2>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {[
          { student: 'John Smith', type: 'Medical Consultation', amount: '$450', status: 'Approved', time: '2h ago' },
          { student: 'Maria Garcia', type: 'Prescription', amount: '$120', status: 'Approved', time: '5h ago' },
          { student: 'Wei Zhang', type: 'Emergency Room', amount: '$2,800', status: 'Processing', time: '1d ago' },
          { student: 'Priya Patel', type: 'Dental Emergency', amount: '$890', status: 'Approved', time: '2d ago' },
        ].map((claim, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${claim.status === 'Approved' ? 'bg-emerald-500' :
                  claim.status === 'Processing' ? 'bg-amber-500' : 'bg-gray-400'
                }`} />
              <div>
                <div className="font-medium text-gray-900">{claim.student}</div>
                <div className="text-sm text-gray-600">{claim.type} · {claim.amount}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-medium px-2 py-1 rounded-md ${claim.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                  claim.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                    'bg-gray-100 text-gray-700'
                }`}>
                {claim.status}
              </div>
              <div className="text-sm text-gray-500 mt-1">{claim.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PoliciesTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Student Policies</h2>
          <p className="text-sm text-gray-600 mt-1">All active insurance policies</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
            <option>All Policies</option>
            <option>Active</option>
            <option>Expired</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Student</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Plan</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Start Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">End Date</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Premium</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { student: 'John Smith', plan: 'Standard Plan', start: '2024-01-15', end: '2025-01-15', premium: '$78/mo', status: 'active' },
              { student: 'Maria Garcia', plan: 'Premium Plan', start: '2024-01-18', end: '2025-01-18', premium: '$125/mo', status: 'active' },
              { student: 'Wei Zhang', plan: 'Essential Plan', start: '2024-01-20', end: '2025-01-20', premium: '$45/mo', status: 'active' },
              { student: 'Priya Patel', plan: 'Standard Plan', start: '2024-01-22', end: '2025-01-22', premium: '$78/mo', status: 'active' },
            ].map((policy, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 font-medium text-gray-900">{policy.student}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{policy.plan}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{policy.start}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{policy.end}</td>
                <td className="py-4 px-4 text-right font-semibold text-gray-900">{policy.premium}</td>
                <td className="py-4 px-4">
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-medium">
                    {policy.status.charAt(0).toUpperCase() + policy.status.slice(1)}
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

const ClaimsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Claims History</h2>
          <p className="text-sm text-gray-600 mt-1">All insurance claims and their status</p>
        </div>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors flex items-center gap-2">
          <FileText size={16} />
          Export
        </button>
      </div>

      {/* Claims Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200">
          <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Total Claims</div>
          <div className="text-2xl font-bold text-gray-900">1,542</div>
          <div className="text-xs text-gray-600 mt-1">All time</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200">
          <div className="text-xs font-semibold text-emerald-600 uppercase mb-1">Approved</div>
          <div className="text-2xl font-bold text-emerald-700">1,453</div>
          <div className="text-xs text-emerald-600 mt-1">94.2% approval rate</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-amber-50 to-white rounded-xl border border-amber-200">
          <div className="text-xs font-semibold text-amber-600 uppercase mb-1">Processing</div>
          <div className="text-2xl font-bold text-amber-700">67</div>
          <div className="text-xs text-amber-600 mt-1">Under review</div>
        </div>
        <div className="p-4 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200">
          <div className="text-xs font-semibold text-red-600 uppercase mb-1">Denied</div>
          <div className="text-2xl font-bold text-red-700">22</div>
          <div className="text-xs text-red-600 mt-1">1.4% denial rate</div>
        </div>
      </div>

      {/* Claims Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Claim ID</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Student</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Type</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Amount</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Date</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { id: 'CLM-1245', student: 'John Smith', type: 'Medical', amount: '$450', date: '2024-02-05', status: 'Approved' },
              { id: 'CLM-1244', student: 'Maria Garcia', type: 'Prescription', amount: '$120', date: '2024-02-05', status: 'Approved' },
              { id: 'CLM-1243', student: 'Wei Zhang', type: 'Emergency', amount: '$2,800', date: '2024-02-04', status: 'Processing' },
              { id: 'CLM-1242', student: 'Priya Patel', type: 'Dental', amount: '$890', date: '2024-02-04', status: 'Approved' },
            ].map((claim, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="py-3 px-4 font-mono text-xs text-gray-700">{claim.id}</td>
                <td className="py-3 px-4 font-medium text-gray-900 text-sm">{claim.student}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{claim.type}</td>
                <td className="py-3 px-4 text-right font-semibold text-gray-900">{claim.amount}</td>
                <td className="py-3 px-4 text-sm text-gray-600">{claim.date}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium ${claim.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                      claim.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                    }`}>
                    {claim.status}
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
      <h2 className="text-xl font-bold text-gray-900 mb-4">Insurance Analytics</h2>
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
  const [autoApproval, setAutoApproval] = useState(false);
  const [requireMedicalHistory, setRequireMedicalHistory] = useState(true);

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
            <p className="text-xs text-blue-700 mt-2">Who can see this insurance</p>
          </div>
        </div>
      </div>

      {/* Insurance-Specific Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">Insurance Requirements</h2>
        </div>

        <div className="space-y-4">
          {/* Auto Approval */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div>
              <div className="font-semibold text-blue-900">Auto-Approval for Claims</div>
              <div className="text-sm text-blue-700 mt-1">Automatically approve claims under $500</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoApproval}
                onChange={(e) => setAutoApproval(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Medical History Required */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div>
              <div className="font-semibold text-emerald-900">Medical History Required</div>
              <div className="text-sm text-emerald-700 mt-1">Require medical history during enrollment</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={requireMedicalHistory}
                onChange={(e) => setRequireMedicalHistory(e.target.checked)}
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
  { id: 'policies', label: 'Policies', component: PoliciesTab },
  { id: 'claims', label: 'Claims', component: ClaimsTab },
  { id: 'analytics', label: 'Analytics', component: AnalyticsTab },
  { id: 'settings', label: 'Settings', component: SettingsTab },
  { id: 'logs', label: 'Logs', component: LogsTab },
  { id: 'contracts', label: 'Contracts', component: ContractsTab },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const InsuranceProviderDetail: React.FC<{ providerId?: string; onBack?: () => void }> = ({ providerId, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Initial provider data for edit modal
  const initialProviderData: ProviderBasicData = {
    providerName: 'ISO Student Insurance',
    legalName: 'International Student Insurance, LLC',
    headquarters: 'Chicago, IL, USA',
    supportedCountries: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain'],
    partnerType: 'Premium Partner',
    accountManager: 'Emily Chen',
    supportEmail: 'support@isostudent.com',
    supportPhone: '+1 (800) 244-1180',
  };

  // Initialize standardized provider actions
  const providerActions = useProviderActions({
    serviceType: 'Insurance',
    providerId: insuranceProvider.id,
    providerName: insuranceProvider.name,
    initialData: initialProviderData,
    onTabChange: (tabId) => {
      setActiveTab(tabId);
      toast.info(`Navigated to ${tabId.charAt(0).toUpperCase() + tabId.slice(1)} tab`);
    },
    onProviderUpdate: (data) => {
      console.log('Provider updated:', data);
      toast.success('Insurance provider details updated successfully');
    },
  });

  return (
    <>
      <ServiceProviderDetailTemplate
        provider={insuranceProvider}
        kpis={kpis}
        tabs={tabs}
        actions={providerActions.actions}
        onBack={onBack}
        breadcrumbs={['Services', 'Insurance', insuranceProvider.name]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        renderCustomActions={providerActions.renderMoreMenu}
      />

      {/* Edit Provider Modal */}
      <EditProviderModal
        isOpen={providerActions.isEditModalOpen}
        onClose={() => providerActions.setIsEditModalOpen(false)}
        onSave={providerActions.handleSaveProvider}
        serviceType="Insurance"
        initialData={providerActions.providerData}
      />
    </>
  );
};

export default InsuranceProviderDetail;
