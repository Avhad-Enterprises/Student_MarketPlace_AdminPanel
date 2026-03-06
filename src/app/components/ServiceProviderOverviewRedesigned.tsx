/**
 * SERVICE PROVIDER OVERVIEW PAGE - REDESIGNED
 * 
 * Enterprise-grade dashboard with improved visual hierarchy, spacing, and readability
 * 
 * Improvements:
 * - 12-column responsive grid system (max-width 1440px)
 * - Better vertical section flow with consistent 32-40px spacing
 * - Fixed sales funnel overflow issues
 * - Unsqueezed student table with better row heights
 * - Improved right sidebar card system
 * - Enhanced typography scale and spacing system
 * - Clean, modular card design
 * - Executive-friendly analytics layout
 */

import React, { useState } from 'react';
import { 
  ChevronRight, 
  Building2, 
  MoreVertical, 
  Settings, 
  Edit3, 
  RefreshCw,
  Users,
  DollarSign,
  TrendingUp,
  Activity,
  Shield,
  CheckCircle2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Globe,
  FileText,
  Download,
  Upload,
  Filter,
  Search,
  ChevronDown,
  ExternalLink,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Zap,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Link as LinkIcon,
  Key,
  Webhook,
  AlertCircle,
  CreditCard,
  Percent,
  Server,
  Database,
  WifiOff,
  Package,
  ScrollText
} from 'lucide-react';

// ============================================
// TYPES & INTERFACES
// ============================================

interface ServiceProvider {
  id: string;
  name: string;
  legalName: string;
  category: 'sim' | 'bank' | 'insurance' | 'visa' | 'housing' | 'other';
  status: 'active' | 'suspended' | 'inactive';
  avatar: string;
  coverage: string;
  contractType: 'Enterprise Partner' | 'Standard' | 'Premium';
  onboardedDate: string;
  hq: string;
  supportEmail: string;
  supportPhone: string;
  accountManager: string;
  slaTier: string;
  contractPeriod: string;
  totalStudents: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  conversionRate: number;
  uptime: number;
}

interface FunnelStage {
  id: string;
  name: string;
  count: number;
  conversion: number;
  revenue: number;
  color: string;
}

interface Student {
  id: string;
  name: string;
  country: string;
  counselor: string;
  stage: string;
  plan: string;
  revenue: number;
  lastActivity: string;
  avatar: string;
}

// ============================================
// MOCK DATA
// ============================================

const mockProvider: ServiceProvider = {
  id: 'PRV-2024-001',
  name: 'Airalo',
  legalName: 'Airalo Global eSIM Solutions Ltd.',
  category: 'sim',
  status: 'active',
  avatar: '📱',
  coverage: '195 Countries',
  contractType: 'Enterprise Partner',
  onboardedDate: '2023-01-15',
  hq: 'Singapore',
  supportEmail: 'support@airalo.com',
  supportPhone: '+65 1234 5678',
  accountManager: 'Sarah Johnson',
  slaTier: '99.9% Uptime',
  contractPeriod: '2023-2026',
  totalStudents: 3847,
  activeSubscriptions: 2956,
  monthlyRevenue: 125840,
  conversionRate: 68.5,
  uptime: 99.8,
};

const mockFunnelStages: FunnelStage[] = [
  { id: '1', name: 'Leads', count: 5620, conversion: 100, revenue: 0, color: '#7c3aed' },
  { id: '2', name: 'Interested', count: 4890, conversion: 87, revenue: 0, color: '#8b5cf6' },
  { id: '3', name: 'Trial', count: 4123, conversion: 73, revenue: 0, color: '#a855f7' },
  { id: '4', name: 'Activated', count: 3847, conversion: 68, revenue: 89500, color: '#c084fc' },
  { id: '5', name: 'Paid', count: 2956, conversion: 53, revenue: 125840, color: '#d8b4fe' },
  { id: '6', name: 'Retained', count: 2341, conversion: 42, revenue: 98200, color: '#e9d5ff' },
];

const mockStudents: Student[] = [
  { id: 'S001', name: 'John Smith', country: 'USA', counselor: 'Alice Chen', stage: 'Paid', plan: 'Global 10GB', revenue: 45, lastActivity: '2h ago', avatar: '👨' },
  { id: 'S002', name: 'Maria Garcia', country: 'Spain', counselor: 'Bob Wilson', stage: 'Trial', plan: 'Europe 5GB', revenue: 0, lastActivity: '5h ago', avatar: '👩' },
  { id: 'S003', name: 'Wei Zhang', country: 'China', counselor: 'Alice Chen', stage: 'Activated', plan: 'Asia 8GB', revenue: 38, lastActivity: '1d ago', avatar: '👨' },
  { id: 'S004', name: 'Priya Patel', country: 'India', counselor: 'Carol Davis', stage: 'Retained', plan: 'Global 15GB', revenue: 62, lastActivity: '3h ago', avatar: '👩' },
  { id: 'S005', name: 'Ahmed Hassan', country: 'UAE', counselor: 'Bob Wilson', stage: 'Paid', plan: 'Middle East 7GB', revenue: 35, lastActivity: '6h ago', avatar: '👨' },
  { id: 'S006', name: 'Sophie Martin', country: 'France', counselor: 'Alice Chen', stage: 'Interested', plan: 'Europe 5GB', revenue: 28, lastActivity: '4h ago', avatar: '👩' },
  { id: 'S007', name: 'Raj Kumar', country: 'India', counselor: 'Carol Davis', stage: 'Paid', plan: 'Asia 8GB', revenue: 38, lastActivity: '1h ago', avatar: '👨' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const ServiceProviderOverviewRedesigned: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Eye },
    { id: 'funnel', label: 'Funnel', icon: BarChart3 },
    { id: 'plans', label: 'Plans', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'operations', label: 'Operations', icon: Settings },
    { id: 'logs', label: 'Logs', icon: ScrollText },
    { id: 'contracts', label: 'Contracts', icon: FileText },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 custom-scrollbar-light">
      {/* HEADER ZONE - Sticky */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1440px] mx-auto px-8 py-6">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button onClick={onBack} className="hover:text-gray-700 transition-colors font-medium">
              Services
            </button>
            <ChevronRight size={14} />
            <button onClick={onBack} className="hover:text-gray-700 transition-colors font-medium">
              SIM Cards
            </button>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-semibold">{mockProvider.name}</span>
          </div>

          {/* Provider Header - A. Header Zone */}
          <div className="flex items-start justify-between gap-8 mb-8">
            {/* Left: Identity */}
            <div className="flex items-start gap-5">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30 flex-shrink-0">
                {mockProvider.avatar}
              </div>
              
              {/* Name & Metadata */}
              <div>
                <h1 className="text-[32px] font-bold text-gray-900 mb-4 leading-none">{mockProvider.name}</h1>
                
                {/* Metadata Pills */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
                    <FileText size={14} className="text-gray-600" />
                    <span className="text-sm font-semibold text-gray-700">{mockProvider.id}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-emerald-700">Active Partner</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-200">
                    <Globe size={14} className="text-blue-600" />
                    <span className="text-sm font-semibold text-blue-700">{mockProvider.coverage}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-purple-50 rounded-lg border border-purple-200">
                    <Building2 size={14} className="text-purple-600" />
                    <span className="text-sm font-semibold text-purple-700">{mockProvider.contractType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3">
              <button className="px-5 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-sm font-semibold flex items-center gap-2 text-gray-700 shadow-sm">
                <RefreshCw size={16} />
                Sync
              </button>
              <button className="px-5 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all text-sm font-semibold flex items-center gap-2 text-gray-700 shadow-sm">
                <Edit3 size={16} />
                Edit
              </button>
              <button className="px-5 py-3 bg-[#253154] text-white rounded-xl hover:bg-[#1a0c4a] transition-all text-sm font-semibold flex items-center gap-2 shadow-lg shadow-purple-900/30">
                <Settings size={16} />
                Settings
              </button>
              <button className="w-11 h-11 rounded-xl border border-gray-300 hover:bg-gray-50 flex items-center justify-center transition-colors">
                <MoreVertical size={18} className="text-gray-600" />
              </button>
            </div>
          </div>

          {/* B. KPI Snapshot Zone */}
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Performance Snapshot</h3>
            
            <div className="grid grid-cols-5 gap-4">
              {/* KPI 1: Total Students */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center">
                    <Users size={20} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">Total Students</span>
                </div>
                <div className="text-[28px] font-bold text-gray-900 leading-none mb-2">{mockProvider.totalStudents.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs text-blue-600 font-medium">
                  <ArrowUpRight size={12} />
                  <span>+12% vs last month</span>
                </div>
              </div>

              {/* KPI 2: Active Subscriptions */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-2xl p-6 border border-emerald-200/50 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center">
                    <Activity size={20} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Active Subs</span>
                </div>
                <div className="text-[28px] font-bold text-gray-900 leading-none mb-2">{mockProvider.activeSubscriptions.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                  <ArrowUpRight size={12} />
                  <span>+8% vs last month</span>
                </div>
              </div>

              {/* KPI 3: Monthly Revenue */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200/50 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-500 flex items-center justify-center">
                    <DollarSign size={20} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Revenue</span>
                </div>
                <div className="text-[28px] font-bold text-gray-900 leading-none mb-2">${(mockProvider.monthlyRevenue / 1000).toFixed(1)}k</div>
                <div className="flex items-center gap-1 text-xs text-purple-600 font-medium">
                  <ArrowUpRight size={12} />
                  <span>+15% vs last month</span>
                </div>
              </div>

              {/* KPI 4: Conversion Rate */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-2xl p-6 border border-amber-200/50 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-amber-700 uppercase tracking-wide">Conversion</span>
                </div>
                <div className="text-[28px] font-bold text-gray-900 leading-none mb-2">{mockProvider.conversionRate}%</div>
                <div className="flex items-center gap-1 text-xs text-amber-600 font-medium">
                  <ArrowUpRight size={12} />
                  <span>+3.2% vs last month</span>
                </div>
              </div>

              {/* KPI 5: Uptime */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-2xl p-6 border border-gray-200/50 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-500 flex items-center justify-center">
                    <Zap size={20} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">Uptime</span>
                </div>
                <div className="text-[28px] font-bold text-gray-900 leading-none mb-2">{mockProvider.uptime}%</div>
                <div className="flex items-center gap-1 text-xs text-gray-600 font-medium">
                  <CheckCircle size={12} />
                  <span>99.9% SLA</span>
                </div>
              </div>
            </div>
          </div>

          {/* C. Tab Navigation Zone - Sticky Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200 -mb-px">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-4 text-sm font-semibold transition-all flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'text-[#253154] border-b-2 border-[#253154]'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* D. ANALYTICS ZONE - Main Content */}
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        {activeTab === 'overview' && <OverviewTab provider={mockProvider} stages={mockFunnelStages} students={mockStudents} />}
        {activeTab === 'funnel' && <div className="text-gray-500">Funnel tab content</div>}
        {activeTab === 'plans' && <div className="text-gray-500">Plans tab content</div>}
        {activeTab === 'analytics' && <div className="text-gray-500">Analytics tab content</div>}
        {activeTab === 'revenue' && <div className="text-gray-500">Revenue tab content</div>}
        {activeTab === 'operations' && <div className="text-gray-500">Operations tab content</div>}
        {activeTab === 'logs' && <div className="text-gray-500">Logs tab content</div>}
        {activeTab === 'contracts' && <div className="text-gray-500">Contracts tab content</div>}
      </div>
    </div>
  );
};

// ============================================
// OVERVIEW TAB - TWO COLUMN LAYOUT
// ============================================

const OverviewTab: React.FC<{ 
  provider: ServiceProvider; 
  stages: FunnelStage[]; 
  students: Student[] 
}> = ({ provider, stages, students }) => {
  return (
    <div className="grid grid-cols-12 gap-8">
      {/* LEFT COLUMN - 8 columns */}
      <div className="col-span-8 space-y-8">
        {/* Sales Funnel */}
        <SalesFunnelSection stages={stages} />

        {/* Students by Stage */}
        <StudentListSection students={students} stages={stages} />

        {/* Usage & Engagement Chart */}
        <UsageChartSection />
      </div>

      {/* RIGHT COLUMN - 4 columns */}
      <div className="col-span-4 space-y-6">
        {/* Provider Profile */}
        <ProviderProfileCard provider={provider} />

        {/* System Health */}
        <SystemHealthCard />

        {/* Risk & Compliance */}
        <RiskComplianceCard />
      </div>
    </div>
  );
};

// ============================================
// SALES FUNNEL SECTION - REDESIGNED
// ============================================

const SalesFunnelSection: React.FC<{ stages: FunnelStage[] }> = ({ stages }) => {
  return (
    <div className="bg-white rounded-[14px] border border-gray-200 shadow-sm p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900 mb-1">Sales Funnel</h2>
          <p className="text-sm text-gray-500">Lead-to-customer conversion pipeline</p>
        </div>
        <button className="text-sm text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-1">
          View Analysis
          <ChevronRight size={14} />
        </button>
      </div>

      {/* Funnel Visualization - Fixed Layout */}
      <div className="space-y-6">
        {stages.map((stage, index) => {
          const width = (stage.count / stages[0].count) * 100;
          const dropOff = index < stages.length - 1 
            ? ((stages[index].count - stages[index + 1].count) / stages[index].count * 100).toFixed(1)
            : null;
          
          return (
            <div key={stage.id} className="space-y-2">
              {/* Stage Info Row */}
              <div className="grid grid-cols-12 gap-4 items-center">
                {/* Stage Name - Fixed Width */}
                <div className="col-span-3">
                  <span className="text-sm font-semibold text-gray-900">{stage.name}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="col-span-7">
                  <div className="h-14 bg-gray-100 rounded-xl overflow-hidden">
                    <div 
                      className="h-full flex items-center justify-between px-4 transition-all duration-500"
                      style={{ 
                        width: `${width}%`,
                        backgroundColor: stage.color
                      }}
                    >
                      {width > 15 && (
                        <>
                          <span className="text-white font-semibold text-sm">{stage.conversion}%</span>
                          {stage.revenue > 0 && (
                            <span className="text-white font-bold text-sm">${(stage.revenue / 1000).toFixed(0)}k</span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Count - Fixed Width */}
                <div className="col-span-2 text-right">
                  <div className="text-base font-bold text-gray-900">{stage.count.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">students</div>
                </div>
              </div>
              
              {/* Drop-off Info */}
              {dropOff && (
                <div className="pl-[25%] text-xs text-gray-500 flex items-center gap-1">
                  <ArrowDownRight size={12} className="text-red-500" />
                  <span className="font-medium text-red-600">{dropOff}% drop-off</span>
                  <span>to next stage</span>
                </div>
              )}

              {/* Divider */}
              {index < stages.length - 1 && (
                <div className="h-px bg-gray-100 my-4" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ============================================
// STUDENT LIST SECTION - REDESIGNED
// ============================================

const StudentListSection: React.FC<{ students: Student[]; stages: FunnelStage[] }> = ({ students, stages }) => {
  const [selectedStage, setSelectedStage] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="bg-white rounded-[14px] border border-gray-200 shadow-sm">
      {/* Card Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[20px] font-bold text-gray-900 mb-1">Students by Stage</h2>
            <p className="text-sm text-gray-500">{students.length} active students tracked</p>
          </div>
          <button className="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-semibold flex items-center gap-2">
            <Download size={14} />
            Export
          </button>
        </div>
        
        {/* Search & Filter Bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, country, or plan..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <select
            value={selectedStage}
            onChange={(e) => setSelectedStage(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          >
            <option value="all">All Stages</option>
            {stages.map(stage => (
              <option key={stage.id} value={stage.id}>{stage.name}</option>
            ))}
          </select>
          <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Table with Better Spacing */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Student</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Country</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Counselor</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Stage</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Plan</th>
              <th className="text-right py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Revenue</th>
              <th className="text-left py-4 px-6 text-xs font-bold text-gray-600 uppercase tracking-wider">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {students.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                {/* Student Name - Increased Height */}
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-lg flex-shrink-0">
                      {student.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{student.name}</div>
                      <div className="text-xs text-gray-500">{student.id}</div>
                    </div>
                  </div>
                </td>
                
                {/* Country */}
                <td className="py-5 px-6">
                  <span className="text-sm text-gray-700 font-medium">{student.country}</span>
                </td>
                
                {/* Counselor */}
                <td className="py-5 px-6">
                  <span className="text-sm text-gray-700">{student.counselor}</span>
                </td>
                
                {/* Stage Badge */}
                <td className="py-5 px-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                    {student.stage}
                  </span>
                </td>
                
                {/* Plan */}
                <td className="py-5 px-6">
                  <span className="text-sm text-gray-700">{student.plan}</span>
                </td>
                
                {/* Revenue */}
                <td className="py-5 px-6 text-right">
                  <span className="text-sm font-bold text-gray-900">
                    {student.revenue > 0 ? `$${student.revenue}` : '-'}
                  </span>
                </td>
                
                {/* Last Activity */}
                <td className="py-5 px-6">
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <Clock size={12} />
                    {student.lastActivity}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 border-t border-gray-200 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">1-7</span> of <span className="font-semibold">247</span> students
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Previous
          </button>
          <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// USAGE & ENGAGEMENT CHART - REDESIGNED
// ============================================

const UsageChartSection: React.FC = () => {
  return (
    <div className="bg-white rounded-[14px] border border-gray-200 shadow-sm p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-bold text-gray-900 mb-1">Usage & Engagement</h2>
          <p className="text-sm text-gray-500">Monthly trend over last 12 months</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
            7D
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-white bg-purple-600 rounded-lg">
            30D
          </button>
          <button className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50">
            12M
          </button>
        </div>
      </div>

      {/* Chart Placeholder - Increased Height */}
      <div className="h-[320px] bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl flex items-center justify-center mb-6">
        <div className="text-center">
          <BarChart3 size={48} className="text-purple-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 font-medium">Chart visualization area</p>
          <p className="text-xs text-gray-400 mt-1">Line graph showing usage trends</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-200 my-6" />

      {/* KPI Summary Below Chart */}
      <div className="grid grid-cols-4 gap-6">
        <div>
          <div className="text-xs text-gray-500 mb-2">Avg Daily Users</div>
          <div className="text-xl font-bold text-gray-900">1,247</div>
          <div className="text-xs text-green-600 font-medium mt-1">+8.2%</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-2">Peak Usage</div>
          <div className="text-xl font-bold text-gray-900">2,341</div>
          <div className="text-xs text-green-600 font-medium mt-1">+12.5%</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-2">Engagement Rate</div>
          <div className="text-xl font-bold text-gray-900">76.3%</div>
          <div className="text-xs text-green-600 font-medium mt-1">+3.1%</div>
        </div>
        <div>
          <div className="text-xs text-gray-500 mb-2">Retention</div>
          <div className="text-xl font-bold text-gray-900">89.2%</div>
          <div className="text-xs text-red-600 font-medium mt-1">-1.2%</div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// PROVIDER PROFILE CARD
// ============================================

const ProviderProfileCard: React.FC<{ provider: ServiceProvider }> = ({ provider }) => {
  return (
    <div className="bg-white rounded-[14px] border border-gray-200 shadow-sm p-6">
      <h3 className="text-base font-bold text-gray-900 mb-6">Provider Profile</h3>
      
      <div className="space-y-5">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Legal Name</div>
          <div className="text-sm text-gray-900 font-medium">{provider.legalName}</div>
        </div>
        
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Headquarters</div>
          <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
            <MapPin size={14} className="text-gray-400" />
            {provider.hq}
          </div>
        </div>
        
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Support Email</div>
          <div className="flex items-center gap-2 text-sm text-purple-600 font-medium">
            <Mail size={14} />
            {provider.supportEmail}
          </div>
        </div>
        
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Support Phone</div>
          <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
            <Phone size={14} className="text-gray-400" />
            {provider.supportPhone}
          </div>
        </div>
        
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account Manager</div>
          <div className="text-sm text-gray-900 font-medium">{provider.accountManager}</div>
        </div>
        
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contract Period</div>
          <div className="flex items-center gap-2 text-sm text-gray-900 font-medium">
            <Calendar size={14} className="text-gray-400" />
            {provider.contractPeriod}
          </div>
        </div>
      </div>
      
      <button className="w-full mt-6 px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors text-sm font-semibold text-gray-700 flex items-center justify-center gap-2">
        <ExternalLink size={14} />
        View Full Profile
      </button>
    </div>
  );
};

// ============================================
// SYSTEM HEALTH CARD
// ============================================

const SystemHealthCard: React.FC = () => {
  return (
    <div className="bg-white rounded-[14px] border border-gray-200 shadow-sm p-6">
      <h3 className="text-base font-bold text-gray-900 mb-6">System Health</h3>
      
      <div className="space-y-5">
        {/* API Status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <Server size={18} className="text-green-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">API Status</div>
              <div className="text-xs text-gray-500">All systems operational</div>
            </div>
          </div>
          <CheckCircle2 size={20} className="text-green-500" />
        </div>
        
        {/* Database */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <Database size={18} className="text-blue-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Database</div>
              <div className="text-xs text-gray-500">Response time: 12ms</div>
            </div>
          </div>
          <CheckCircle2 size={20} className="text-green-500" />
        </div>
        
        {/* Network */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Activity size={18} className="text-amber-600" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-900">Network</div>
              <div className="text-xs text-gray-500">Latency: 45ms</div>
            </div>
          </div>
          <AlertTriangle size={20} className="text-amber-500" />
        </div>
        
        {/* Uptime Badge */}
        <div className="mt-4 p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Current Uptime</div>
              <div className="text-2xl font-bold text-emerald-900">99.98%</div>
            </div>
            <Zap size={32} className="text-emerald-500 opacity-50" />
          </div>
          <div className="text-xs text-emerald-600 font-medium mt-2">28 days, 14 hours</div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// RISK & COMPLIANCE CARD
// ============================================

const RiskComplianceCard: React.FC = () => {
  return (
    <div className="bg-white rounded-[14px] border border-gray-200 shadow-sm p-6">
      <h3 className="text-base font-bold text-gray-900 mb-6">Risk & Compliance</h3>
      
      <div className="space-y-5">
        {/* Security Score */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-semibold text-gray-900">Security Score</span>
            <span className="text-sm font-bold text-green-600">A+</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full w-[92%] bg-gradient-to-r from-green-500 to-emerald-500" />
          </div>
          <div className="text-xs text-gray-500 mt-2">92/100 - Excellent</div>
        </div>
        
        {/* Compliance Items */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">GDPR Compliant</div>
              <div className="text-xs text-gray-500">Verified Jan 2024</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">PCI DSS Level 1</div>
              <div className="text-xs text-gray-500">Certified</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">ISO 27001</div>
              <div className="text-xs text-gray-500">Valid until Dec 2025</div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <AlertCircle size={18} className="text-amber-500 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900">SOC 2 Type II</div>
              <div className="text-xs text-amber-600">Renewal due Mar 2024</div>
            </div>
          </div>
        </div>
        
        {/* Risk Badge */}
        <div className="mt-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={18} className="text-blue-600" />
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">Risk Level</span>
          </div>
          <div className="text-2xl font-bold text-blue-900">Low</div>
          <div className="text-xs text-blue-600 font-medium mt-1">All checks passed</div>
        </div>
      </div>
    </div>
  );
};