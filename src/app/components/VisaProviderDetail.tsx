/**
 * VISA PROVIDER DETAIL PAGE
 * Services & Marketplace → Visa → Provider Details
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
  Flag,
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
  Target,
  Percent,
  Briefcase,
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

// Export types expected by other files (even if unused, to fix build)
export interface Document {
  id: string;
  name: string;
  required: boolean;
  notes: string;
}

export interface ProcessStep {
  id: string;
  step: string;
  description: string;
  duration: string;
  order?: number;
  title?: string;
  fastTrack?: boolean;
}

export interface Fee {
  id: string;
  name: string;
  amount: number;
  currency: string;
  description: string;
  refundable?: boolean;
  variableByCountry?: boolean;
}

export interface AdminNote {
  id: string;
  date: string;
  author: string;
  note: string;
  // Aliases/Legacy
  content?: string;
  createdBy?: string;
  createdAt?: string;
  visibility?: 'Internal' | 'Public';
  severity?: 'Low' | 'Medium' | 'High';
  title?: string;
  country?: string;
}

export interface EditModeContextType {
  isEditMode: boolean;
  toggleEditMode: () => void;
  handleSave: () => void;
  isLoading: boolean;
  providerData: any;
  setProviderData: React.Dispatch<React.SetStateAction<any>>;
  addActivityLog: (entry: any) => void;
  userRole: string;
  [key: string]: any;
}

// ============================================
// PROVIDER DATA
// ============================================

const visaProvider: ServiceProvider = {
  id: 'VIS-2024-001',
  name: 'VisaFirst Services',
  avatar: '🛂',
  status: 'active',
  metadata: [
    {
      icon: FileText,
      value: 'VIS-2024-001',
      color: 'gray',
    },
    {
      icon: CheckCircle,
      value: 'Active Partner',
      color: 'emerald',
    },
    {
      icon: Globe,
      value: '85+ Countries',
      color: 'blue',
    },
    {
      icon: Building2,
      value: 'Premium Partner',
      color: 'purple',
    },
    {
      icon: Calendar,
      value: 'Onboarded Sep 12, 2023',
      color: 'gray',
    },
  ],
};

const kpis: KPICard[] = [
  {
    icon: Users,
    label: 'Total Students',
    value: '2,567',
    subtitle: 'Visa applications',
    color: 'blue',
  },
  {
    icon: CheckCircle,
    label: 'Approved Visas',
    value: '2,389',
    subtitle: 'Successfully approved',
    color: 'emerald',
  },
  {
    icon: DollarSign,
    label: 'Monthly Revenue',
    value: '$38.9K',
    subtitle: 'This month',
    color: 'purple',
  },
  {
    icon: TrendingUp,
    label: 'Success Rate',
    value: '93.1%',
    subtitle: 'Approval rate',
    color: 'amber',
  },
  {
    icon: Star,
    label: 'Satisfaction',
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
    {/* Visa Service Profile Card */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Visa Service Profile</h2>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          View Full Details
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Legal Name</div>
          <div className="font-semibold text-gray-900">VisaFirst Immigration Services, Inc.</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Headquarters</div>
          <div className="text-sm text-gray-700">Washington, DC, USA</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Account Manager</div>
          <div className="text-sm text-gray-700">David Martinez</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Contract Period</div>
          <div className="text-sm text-gray-700">2023-2026 (3 years)</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Support Email</div>
          <div className="text-sm text-blue-600">support@visafirst.com</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-1 font-semibold uppercase">Support Phone</div>
          <div className="text-sm text-gray-700">+1 (888) 407-8182</div>
        </div>
      </div>
    </div>

    {/* Service Highlights */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Flag className="w-5 h-5 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900">Service Highlights</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Visa Types Supported */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div className="font-semibold text-blue-900">Visa Types</div>
          </div>
          <div className="text-2xl font-bold text-blue-700 mb-1">12</div>
          <div className="text-xs text-blue-600">Different visa categories</div>
        </div>

        {/* Processing Time */}
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-white rounded-xl border border-emerald-200">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-emerald-600" />
            <div className="font-semibold text-emerald-900">Avg. Processing</div>
          </div>
          <div className="text-2xl font-bold text-emerald-700 mb-1">4-6</div>
          <div className="text-xs text-emerald-600">Weeks average</div>
        </div>

        {/* Success Rate */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-purple-600" />
            <div className="font-semibold text-purple-900">Success Rate</div>
          </div>
          <div className="text-2xl font-bold text-purple-700 mb-1">93.1%</div>
          <div className="text-xs text-purple-600">Approval success</div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          'F-1 Student Visa',
          'M-1 Vocational',
          'J-1 Exchange',
          'H-1B Work Visa',
          'OPT Extensions',
          'STEM OPT',
          'CPT Authorization',
          'Visa Renewals',
          'Status Changes',
        ].map((service, index) => (
          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{service}</span>
          </div>
        ))}
      </div>
    </div>

    {/* Visa Packages */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Service Packages</h2>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          Manage Packages
        </button>
      </div>

      <div className="space-y-3">
        {[
          { name: 'Basic F-1 Processing', students: 1234, price: '$499', timeline: '6-8 weeks', recommended: false },
          { name: 'Premium F-1 + Support', students: 987, price: '$799', timeline: '4-6 weeks', recommended: true },
          { name: 'Express Processing', students: 346, price: '$1,299', timeline: '2-3 weeks', recommended: false },
        ].map((pkg, index) => (
          <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-md transition-all">
            <div>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-gray-900">{pkg.name}</div>
                {pkg.recommended && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase rounded-md">
                    Most Popular
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-600 mt-1">{pkg.students} students processed</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-semibold text-gray-900">{pkg.price}</div>
              <div className="text-xs text-gray-500">Timeline: {pkg.timeline}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Recent Applications */}
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
          View All
        </button>
      </div>

      <div className="space-y-4">
        {[
          { student: 'John Smith', type: 'F-1 Student Visa', status: 'Approved', time: '2h ago' },
          { student: 'Maria Garcia', type: 'OPT Extension', status: 'Processing', time: '5h ago' },
          { student: 'Wei Zhang', type: 'J-1 Exchange', status: 'Approved', time: '1d ago' },
          { student: 'Priya Patel', type: 'H-1B Work Visa', status: 'Under Review', time: '2d ago' },
        ].map((app, index) => (
          <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${app.status === 'Approved' ? 'bg-emerald-500' :
                app.status === 'Processing' ? 'bg-blue-500' :
                  'bg-amber-500'
                }`} />
              <div>
                <div className="font-medium text-gray-900">{app.student}</div>
                <div className="text-sm text-gray-600">{app.type}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-medium px-2 py-1 rounded-md ${app.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' :
                app.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                  'bg-amber-100 text-amber-700'
                }`}>
                {app.status}
              </div>
              <div className="text-sm text-gray-500 mt-1">{app.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ApplicationsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Visa Applications</h2>
          <p className="text-sm text-gray-600 mt-1">All visa applications and their status</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none">
            <option>All Applications</option>
            <option>Approved</option>
            <option>Processing</option>
            <option>Under Review</option>
            <option>Rejected</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Student</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Visa Type</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Applied</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Package</th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Fee</th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {[
              { student: 'John Smith', type: 'F-1 Student', applied: '2024-01-15', package: 'Premium', fee: '$799', status: 'approved' },
              { student: 'Maria Garcia', type: 'OPT Extension', applied: '2024-01-18', package: 'Express', fee: '$1,299', status: 'processing' },
              { student: 'Wei Zhang', type: 'J-1 Exchange', applied: '2024-01-20', package: 'Basic', fee: '$499', status: 'approved' },
              { student: 'Priya Patel', type: 'H-1B Work', applied: '2024-01-22', package: 'Premium', fee: '$799', status: 'review' },
            ].map((app, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-4 font-medium text-gray-900">{app.student}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{app.type}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{app.applied}</td>
                <td className="py-4 px-4 text-sm text-gray-600">{app.package}</td>
                <td className="py-4 px-4 text-right font-semibold text-gray-900">{app.fee}</td>
                <td className="py-4 px-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${app.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                    app.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
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

const DocumentsTab = () => (
  <div className="space-y-6">
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Required Documents</h2>
          <p className="text-sm text-gray-600 mt-1">Document requirements by visa type</p>
        </div>
      </div>

      {/* Document Requirements by Visa Type */}
      <div className="space-y-4">
        {[
          {
            visaType: 'F-1 Student Visa',
            documents: ['Valid Passport', 'I-20 Form', 'DS-160 Form', 'SEVIS Fee Receipt', 'Financial Proof', 'Acceptance Letter'],
          },
          {
            visaType: 'OPT Extension',
            documents: ['Valid EAD Card', 'Employment Offer', 'Updated I-20', 'Proof of Enrollment'],
          },
          {
            visaType: 'H-1B Work Visa',
            documents: ['Valid Passport', 'LCA Approval', 'Job Offer Letter', 'Degree Certificates', 'Resume/CV'],
          },
        ].map((item, index) => (
          <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="font-semibold text-gray-900 mb-3">{item.visaType}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {item.documents.map((doc, docIndex) => (
                <div key={docIndex} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckSquare className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>{doc}</span>
                </div>
              ))}
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
      <h2 className="text-xl font-bold text-gray-900 mb-4">Visa Analytics</h2>
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
  const [autoNotifications, setAutoNotifications] = useState(true);
  const [expressProcessing, setExpressProcessing] = useState(true);

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
            <p className="text-xs text-blue-700 mt-2">Who can see this service</p>
          </div>
        </div>
      </div>

      {/* Visa-Specific Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-emerald-600" />
          <h2 className="text-xl font-bold text-gray-900">Visa Service Settings</h2>
        </div>

        <div className="space-y-4">
          {/* Auto Notifications */}
          <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div>
              <div className="font-semibold text-blue-900">Automatic Notifications</div>
              <div className="text-sm text-blue-700 mt-1">Send status updates to students automatically</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoNotifications}
                onChange={(e) => setAutoNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Express Processing */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div>
              <div className="font-semibold text-emerald-900">Express Processing Available</div>
              <div className="text-sm text-emerald-700 mt-1">Allow students to select expedited processing</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={expressProcessing}
                onChange={(e) => setExpressProcessing(e.target.checked)}
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
  { id: 'applications', label: 'Applications', component: ApplicationsTab },
  { id: 'documents', label: 'Documents', component: DocumentsTab },
  { id: 'analytics', label: 'Analytics', component: AnalyticsTab },
  { id: 'settings', label: 'Settings', component: SettingsTab },
  { id: 'logs', label: 'Logs', component: LogsTab },
  { id: 'contracts', label: 'Contracts', component: ContractsTab },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const VisaProviderDetail: React.FC<{ providerId?: string; onBack?: () => void }> = ({ providerId, onBack }) => {
  const [activeTab, setActiveTab] = useState('overview');

  // Initial provider data for edit modal
  const initialProviderData: ProviderBasicData = {
    providerName: 'VisaFirst Services',
    legalName: 'VisaFirst Immigration Services, Inc.',
    headquarters: 'Washington, DC, USA',
    supportedCountries: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'Singapore'],
    partnerType: 'Premium Partner',
    accountManager: 'David Martinez',
    supportEmail: 'support@visafirst.com',
    supportPhone: '+1 (888) 407-8182',
  };

  // Initialize standardized provider actions
  const providerActions = useProviderActions({
    serviceType: 'Visa',
    providerId: visaProvider.id,
    providerName: visaProvider.name,
    initialData: initialProviderData,
    onTabChange: (tabId) => {
      setActiveTab(tabId);
      toast.info(`Navigated to ${tabId.charAt(0).toUpperCase() + tabId.slice(1)} tab`);
    },
    onProviderUpdate: (data) => {
      console.log('Provider updated:', data);
      toast.success('Visa provider details updated successfully');
    },
  });

  return (
    <>
      <ServiceProviderDetailTemplate
        provider={visaProvider}
        kpis={kpis}
        tabs={tabs}
        actions={providerActions.actions}
        onBack={onBack}
        breadcrumbs={['Services', 'Visa Services', visaProvider.name]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        renderCustomActions={providerActions.renderMoreMenu}
      />

      {/* Edit Provider Modal */}
      <EditProviderModal
        open={providerActions.isEditModalOpen}
        onOpenChange={(open) => providerActions.setIsEditModalOpen(open)}
        onSave={providerActions.handleSaveProvider}
        serviceType="Visa"
        initialData={providerActions.providerData}
      />
    </>
  );
};

export default VisaProviderDetail;
