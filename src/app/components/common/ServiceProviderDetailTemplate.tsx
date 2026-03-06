/**
 * SERVICE PROVIDER DETAIL TEMPLATE
 * 
 * Reusable template for creating service provider detail pages
 * (e.g., Banks, Insurance, Visa Services, Housing, etc.)
 * 
 * Features:
 * - Unified sticky header matching Student Detail design
 * - Responsive breakpoints for mobile/tablet/desktop
 * - Customizable KPI cards
 * - Premium pill tab navigation
 * - Metadata badge system
 * - Gradient status badge with pulse animation
 * 
 * Usage Example:
 * ```tsx
 * <ServiceProviderDetailTemplate
 *   provider={{
 *     id: 'BNK-2024-001',
 *     name: 'Chase Bank',
 *     avatar: '🏦',
 *     status: 'active',
 *     metadata: [
 *       { icon: FileText, label: 'ID', value: 'BNK-2024-001', color: 'gray' },
 *       { icon: CheckCircle, label: 'Status', value: 'Active Partner', color: 'emerald' },
 *       // ... more metadata
 *     ]
 *   }}
 *   kpis={[
 *     { icon: Users, label: 'Total Students', value: '1,245', subtitle: 'Using this bank', color: 'blue' },
 *     // ... more KPIs
 *   ]}
 *   tabs={[
 *     { id: 'overview', label: 'Overview', component: <OverviewTab /> },
 *     { id: 'accounts', label: 'Accounts', component: <AccountsTab /> },
 *     // ... more tabs
 *   ]}
 *   actions={[
 *     { icon: RefreshCw, label: 'Sync', onClick: () => handleSync() },
 *     { icon: Edit3, label: 'Edit', onClick: () => handleEdit() },
 *     // ... more actions
 *   ]}
 *   onBack={() => navigate('/services/banks')}
 *   breadcrumbs={['Services', 'Banks', provider.name]}
 * />
 * ```
 */

import React, { useState, ReactNode } from 'react';
import {
  ChevronRight,
  MoreVertical,
  LucideIcon,
} from 'lucide-react';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface MetadataBadge {
  icon: LucideIcon;
  label?: string;
  value: string;
  color: 'gray' | 'emerald' | 'blue' | 'purple' | 'amber' | 'red';
}

export interface KPICard {
  icon: LucideIcon;
  label: string;
  value: string | number;
  subtitle: string;
  color: 'blue' | 'emerald' | 'purple' | 'amber' | 'gray' | 'red';
}

export interface TabDefinition {
  id: string;
  label: string;
  component: React.ComponentType<any> | (() => JSX.Element);
}

export interface ActionButton {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  status: 'active' | 'inactive' | 'suspended';
  metadata: MetadataBadge[];
}

export interface ServiceProviderDetailTemplateProps {
  provider: ServiceProvider;
  kpis: KPICard[];
  tabs: TabDefinition[];
  actions?: ActionButton[];
  onBack?: () => void;
  breadcrumbs: string[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  renderCustomActions?: () => React.ReactNode;
}

// ============================================
// COLOR CONFIGURATIONS
// ============================================

const METADATA_COLORS = {
  gray: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    icon: 'text-gray-500',
  },
  emerald: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    icon: 'text-emerald-600',
  },
  blue: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: 'text-blue-600',
  },
  purple: {
    bg: 'bg-purple-50',
    text: 'text-purple-700',
    icon: 'text-purple-600',
  },
  amber: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    icon: 'text-amber-600',
  },
  red: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    icon: 'text-red-600',
  },
};

const KPI_COLORS = {
  blue: {
    gradient: 'from-white to-blue-50/30',
    border: 'border-blue-100/50',
    iconBg: 'bg-blue-100',
    iconText: 'text-blue-600',
    subtitle: 'text-blue-600',
    corner: 'from-blue-100/40',
  },
  emerald: {
    gradient: 'from-white to-emerald-50/30',
    border: 'border-emerald-100/50',
    iconBg: 'bg-emerald-100',
    iconText: 'text-emerald-600',
    subtitle: 'text-emerald-600',
    corner: 'from-emerald-100/40',
  },
  purple: {
    gradient: 'from-white to-purple-50/30',
    border: 'border-purple-100/50',
    iconBg: 'bg-purple-100',
    iconText: 'text-purple-600',
    subtitle: 'text-purple-600',
    corner: 'from-purple-100/40',
  },
  amber: {
    gradient: 'from-white to-amber-50/30',
    border: 'border-amber-100/50',
    iconBg: 'bg-amber-100',
    iconText: 'text-amber-600',
    subtitle: 'text-amber-600',
    corner: 'from-amber-100/40',
  },
  gray: {
    gradient: 'from-white to-gray-50/30',
    border: 'border-gray-100/50',
    iconBg: 'bg-gray-100',
    iconText: 'text-gray-600',
    subtitle: 'text-gray-600',
    corner: 'from-gray-100/40',
  },
  red: {
    gradient: 'from-white to-red-50/30',
    border: 'border-red-100/50',
    iconBg: 'bg-red-100',
    iconText: 'text-red-600',
    subtitle: 'text-red-600',
    corner: 'from-red-100/40',
  },
};

const STATUS_COLORS = {
  active: {
    gradient: 'from-emerald-50 to-emerald-100/50',
    text: 'text-emerald-700',
    border: 'border-emerald-200/50',
    shadow: 'shadow-emerald-500/20',
    dot: 'bg-emerald-500',
    label: 'Active',
  },
  inactive: {
    gradient: 'from-gray-50 to-gray-100/50',
    text: 'text-gray-700',
    border: 'border-gray-200/50',
    shadow: 'shadow-gray-500/20',
    dot: 'bg-gray-500',
    label: 'Inactive',
  },
  suspended: {
    gradient: 'from-amber-50 to-amber-100/50',
    text: 'text-amber-700',
    border: 'border-amber-200/50',
    shadow: 'shadow-amber-500/20',
    dot: 'bg-amber-500',
    label: 'Suspended',
  },
};

// ============================================
// MAIN COMPONENT
// ============================================

export const ServiceProviderDetailTemplate: React.FC<ServiceProviderDetailTemplateProps> = ({
  provider,
  kpis,
  tabs,
  actions = [],
  onBack,
  breadcrumbs,
  defaultTab,
  activeTab: externalActiveTab,
  onTabChange,
  renderCustomActions,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id || '');

  // Use external activeTab if provided, otherwise use internal state
  const currentTab = externalActiveTab !== undefined ? externalActiveTab : internalActiveTab;

  const statusConfig = STATUS_COLORS[provider.status] || STATUS_COLORS.active; // Fallback to active
  const activeTabDef = tabs.find(tab => tab.id === currentTab);
  const ActiveTabComponent = activeTabDef?.component;

  // Helper to render the active tab component safely
  const renderActiveTab = () => {
    if (!ActiveTabComponent) return null;

    // Check if it&apos;s a function component or a React element
    if (typeof ActiveTabComponent === 'function') {
      const Component = ActiveTabComponent as React.ComponentType;
      return <Component />;
    }

    return null;
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#fafbfc] custom-scrollbar-light">
      {/* UNIFIED STICKY HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100">
        <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-4 sm:pb-5">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            {breadcrumbs.map((crumb, index) => (
              <span key={index} className="flex items-center gap-2">
                {index > 0 && <ChevronRight size={14} />}
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-700 font-medium">{crumb}</span>
                ) : (
                  <button
                    onClick={onBack}
                    className="hover:text-gray-600 transition-colors"
                  >
                    {crumb}
                  </button>
                )}
              </span>
            ))}
          </div>

          {/* Provider Identity Section */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6 lg:gap-8 mb-6">
            {/* Left: Identity Block */}
            <div className="flex items-start gap-4 lg:gap-5 w-full lg:w-auto">
              {/* Avatar Badge */}
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-purple-500/20 flex-shrink-0">
                {provider.avatar}
              </div>

              {/* Name & Metadata */}
              <div className="flex-1 lg:flex-initial min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 tracking-tight break-words">
                  {provider.name}
                </h1>

                {/* Metadata Pills */}
                <div className="flex items-center gap-2 flex-wrap">
                  {provider.metadata.map((badge, index) => {
                    const colors = METADATA_COLORS[badge.color];
                    return (
                      <div key={index} className={`flex items-center gap-1.5 px-2.5 py-1 ${colors.bg} rounded-lg`}>
                        <badge.icon size={12} className={colors.icon} />
                        <span className={`text-xs font-semibold ${colors.text}`}>
                          {badge.label && `${badge.label}: `}{badge.value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right: Status & Action Cluster */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto lg:flex-shrink-0">
              {/* Status Badge with Glow & Pulse */}
              <div className={`px-4 py-2 bg-gradient-to-br ${statusConfig.gradient} ${statusConfig.text} rounded-xl font-bold text-sm shadow-lg ${statusConfig.shadow} border ${statusConfig.border} flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start`}>
                <div className={`w-2 h-2 ${statusConfig.dot} rounded-full animate-pulse`}></div>
                {statusConfig.label}
              </div>

              {/* Action Cluster - WRAPPER WITH RELATIVE POSITIONING FOR DROPDOWN */}
              {actions.length > 0 && (
                <div className="relative w-full sm:w-auto">
                  <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-xl border border-gray-200/50 w-full sm:w-auto">
                    {actions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.onClick}
                        disabled={action.disabled}
                        className={`${action.label === ''
                            ? 'w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0'
                            : 'px-3 sm:px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all text-sm font-semibold flex items-center gap-2 text-gray-700 whitespace-nowrap flex-1 sm:flex-initial justify-center'
                          } ${action.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <action.icon size={action.label === '' ? 18 : 15} className={action.label === '' ? 'text-gray-600' : ''} />
                        {action.label && <span className="hidden sm:inline">{action.label}</span>}
                      </button>
                    ))}
                  </div>
                  {/* Render dropdown OUTSIDE the scrollable container but INSIDE relative wrapper */}
                  {renderCustomActions && renderCustomActions()}
                </div>
              )}
            </div>
          </div>

          {/* Current Snapshot - KPI Cards */}
          {kpis.length > 0 && (
            <div className="mb-5">
              <div className="mb-3">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Current Snapshot</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                {kpis.map((kpi, index) => {
                  const colors = KPI_COLORS[kpi.color];
                  return (
                    <div key={index} className={`group relative bg-gradient-to-br ${colors.gradient} rounded-xl p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 border ${colors.border} cursor-pointer overflow-hidden`}>
                      <div className={`absolute top-0 right-0 w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${colors.corner} to-transparent rounded-bl-full`}></div>
                      <div className="relative">
                        <div className="flex items-center gap-2 mb-2 sm:mb-3">
                          <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg ${colors.iconBg} flex items-center justify-center flex-shrink-0`}>
                            <kpi.icon size={12} className={`${colors.iconText} sm:w-3.5 sm:h-3.5`} />
                          </div>
                          <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider leading-tight">
                            {kpi.label}
                          </span>
                        </div>
                        <div className="text-lg sm:text-xl font-bold text-gray-900 mb-0.5">
                          {kpi.value}
                        </div>
                        <div className={`text-[9px] sm:text-[10px] ${colors.subtitle} font-semibold`}>
                          ● {kpi.subtitle}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tabs - Premium Pill Navigation */}
          <div className="flex gap-1.5 sm:gap-2 flex-wrap -mx-1 sm:mx-0">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setInternalActiveTab(tab.id);
                  if (onTabChange) onTabChange(tab.id);
                }}
                className={`group relative px-3 sm:px-5 py-2 sm:py-3 text-xs sm:text-sm font-semibold whitespace-nowrap rounded-lg sm:rounded-xl transition-all duration-300 ${currentTab === tab.id
                    ? 'bg-gradient-to-br from-[#253154] to-[#1a0a4a] text-white shadow-lg shadow-purple-900/30'
                    : 'bg-white/60 text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md border border-gray-200/50'
                  }`}
              >
                {/* Active Tab Accent Line */}
                {currentTab === tab.id && (
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent rounded-full"></div>
                )}

                {/* Tab Label */}
                <span className="relative z-10">{tab.label}</span>

                {/* Inactive Tab Hover Glow */}
                {currentTab !== tab.id && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-50/0 to-purple-50/0 group-hover:from-purple-50/40 group-hover:to-blue-50/40 rounded-lg sm:rounded-xl transition-all duration-300"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* TAB CONTENT */}
      <div className="p-4 sm:p-6 lg:p-8">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default ServiceProviderDetailTemplate;