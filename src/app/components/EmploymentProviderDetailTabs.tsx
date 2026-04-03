import React from 'react';
import { 
  Briefcase, 
  Users, 
  MapPin, 
  TrendingUp, 
  CheckCircle, 
  DollarSign, 
  Globe, 
  Zap,
  Target,
  Clock,
  Shield,
  FileText
} from 'lucide-react';
import type { AuditLogEntry } from './common/ServiceProviderLogsTab';
import { Employment } from '@/app/services/employmentService';

interface TabProps {
  providerId: string;
  providerData: Employment;
  addActivityLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  userRole: string;
}

// ============================================
// TAB 1: OVERVIEW
// ============================================

export const EmploymentOverviewTab: React.FC<TabProps> = ({
  providerData,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#253154]">Platform Overview</h2>
        <p className="text-sm text-gray-600">Summary of employment platform performance and reach</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Platform Summary</h3>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Service Type</div>
              <span className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm font-semibold inline-block">
                {providerData.service_type}
              </span>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Job Types</div>
              <p className="text-sm text-gray-900 font-medium">{providerData.job_types || 'General'}</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1 uppercase tracking-wider">Average Salary</div>
              <p className="text-sm text-gray-900 font-bold text-emerald-600">{providerData.avg_salary || 'Competitive'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h3 className="text-base font-bold text-[#253154] mb-4">Coverage & Trust</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={18} className="text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Countries Covered</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{providerData.countries_covered}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield size={18} className="text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">Verified Platform</span>
              </div>
              <span className={`text-sm font-bold ${providerData.verified ? 'text-emerald-600' : 'text-gray-400'}`}>
                {providerData.verified ? 'Yes' : 'No'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp size={18} className="text-amber-600" />
                <span className="text-sm font-medium text-gray-700">Popularity Score</span>
              </div>
              <span className="text-sm font-bold text-gray-900">{providerData.popularity}/10</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TAB 2: JOBS & OPPORTUNITIES
// ============================================

export const EmploymentJobsTab: React.FC<TabProps> = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#253154]">Jobs & Opportunities</h2>
          <p className="text-sm text-gray-600">Active job listings and placement statistics</p>
        </div>
      </div>
      <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
        <Briefcase size={48} className="text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-gray-900">Job Listings Management</h3>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">This section will allow admins to monitor and manage specific job postings integrated from this platform.</p>
      </div>
    </div>
  );
};
