/**
 * TAX PROVIDER DETAIL PAGE
 * 
 * Complete tax service provider detail view matching the exact design system
 * of SIM Cards, Insurance, and Loan providers.
 * 
 * Features:
 * - 9 comprehensive tabs (Overview, Services & Pricing, Eligibility, Documents, Workflow, Transactions, Analytics, Operations, Logs)
 * - All read-only by default with Edit/Manage/Add buttons
 * - Large modals (1400px × 90vh) for all edit operations
 * - Header actions with Status, Sync, Edit, Settings, 3-dot menu
 * - 6 KPI cards showing key metrics
 * - Complete frontend validation and audit logging
 * - Lazy-load tab data with optimistic UI updates
 */

import React, { useState } from 'react';
import {
  FileText,
  Globe,
  CheckCircle,
  Award,
  Users,
  Activity,
  DollarSign,
  Clock,
  TrendingUp,
  Building2,
} from 'lucide-react';
import {
  ServiceProviderDetailTemplate,
  ServiceProvider,
  KPICard,
  TabDefinition,
} from './common/ServiceProviderDetailTemplate';
import { useProviderActions } from './common/useProviderActions';
import { EditProviderModal, ProviderBasicData } from './common/EditProviderModal';
import { TaxProviderOverviewTab } from './TaxProviderOverviewTab';
import { TaxProviderServicesTab } from './TaxProviderServicesTab';
import {
  TaxProviderEligibilityTab,
  TaxProviderDocumentsTab,
  TaxProviderWorkflowTab,
  TaxProviderTransactionsTab,
  TaxProviderAnalyticsTab,
  TaxProviderOperationsTab,
  TaxProviderLogsTab,
} from './TaxProviderRemainingTabs';
import { toast } from 'sonner';

// ============================================
// MAIN COMPONENT
// ============================================

export const TaxProviderDetail: React.FC<{ onBack?: () => void }> = ({ onBack }) => {
  // ============================================
  // STATE MANAGEMENT - Tab State Only
  // ============================================
  const [activeTab, setActiveTab] = useState('overview');

  // ============================================
  // MOCK DATA (Replace with API calls)
  // ============================================

  const taxProvider: ServiceProvider = {
    id: 'TAX-PROV-001',
    name: 'Sprintax Tax Services',
    avatar: '📊',
    status: 'active',
    metadata: [
      { icon: FileText, label: 'ID', value: 'TAX-PROV-001', color: 'gray' },
      { icon: Globe, label: 'Region', value: 'USA & Canada', color: 'blue' },
      { icon: Building2, label: 'Tax Type', value: 'Student / Non-Resident', color: 'purple' },
      { icon: CheckCircle, label: 'Status', value: 'Active Partner', color: 'emerald' },
      { icon: Award, label: 'Onboarded', value: 'Mar 2018', color: 'amber' },
    ],
  };

  const kpiCards: KPICard[] = [
    {
      icon: Users,
      label: 'Students Filed Taxes',
      value: '12,547',
      subtitle: 'All-time filings',
      color: 'blue',
    },
    {
      icon: Activity,
      label: 'Active Tax Filings',
      value: '892',
      subtitle: 'In progress',
      color: 'purple',
    },
    {
      icon: DollarSign,
      label: 'Avg Filing Fee',
      value: '$79',
      subtitle: 'Standard rate',
      color: 'emerald',
    },
    {
      icon: Globe,
      label: 'Countries Covered',
      value: '195+',
      subtitle: 'Global coverage',
      color: 'blue',
    },
    {
      icon: Clock,
      label: 'Avg Processing Time',
      value: '4.2 days',
      subtitle: 'Median turnaround',
      color: 'amber',
    },
    {
      icon: TrendingUp,
      label: 'Service Health',
      value: '99.1%',
      subtitle: 'SLA compliance',
      color: 'emerald',
    },
  ];

  // ============================================
  // STANDARDIZED PROVIDER ACTIONS
  // ============================================

  // Initial provider data for edit modal
  const initialProviderData: ProviderBasicData = {
    providerName: 'Sprintax Tax Services',
    legalName: 'Sprintax Inc.',
    headquarters: 'Durham, NC, USA',
    supportedCountries: ['United States', 'Canada', 'Australia', 'United Kingdom'],
    partnerType: 'Tax Filing Service',
    accountManager: 'Rachel Green',
    supportEmail: 'support@sprintax.com',
    supportPhone: '+1 (800) 678-8710',
  };

  // Initialize standardized provider actions
  const providerActions = useProviderActions({
    serviceType: 'Tax Service',
    providerId: taxProvider.id,
    providerName: taxProvider.name,
    initialData: initialProviderData,
    onTabChange: (tabId) => {
      setActiveTab(tabId);
      toast.info(`Navigated to ${tabId.charAt(0).toUpperCase() + tabId.slice(1)} tab`);
    },
    onProviderUpdate: (data) => {
      console.log('Provider updated:', data);
      toast.success('Tax provider details updated successfully');
    },
  });

  // ============================================
  // TAB DEFINITIONS
  // ============================================

  const tabs: TabDefinition[] = [
    { id: 'overview', label: 'Overview', component: TaxProviderOverviewTab },
    { id: 'services', label: 'Services & Pricing', component: TaxProviderServicesTab },
    { id: 'eligibility', label: 'Eligibility & Rules', component: TaxProviderEligibilityTab },
    { id: 'documents', label: 'Required Documents', component: TaxProviderDocumentsTab },
    { id: 'workflow', label: 'Filing Workflow', component: TaxProviderWorkflowTab },
    { id: 'transactions', label: 'Transactions', component: TaxProviderTransactionsTab },
    { id: 'analytics', label: 'Analytics', component: TaxProviderAnalyticsTab },
    { id: 'operations', label: 'Operations', component: TaxProviderOperationsTab },
    { id: 'logs', label: 'Logs', component: TaxProviderLogsTab },
  ];

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <ServiceProviderDetailTemplate
        provider={taxProvider}
        kpis={kpiCards}
        tabs={tabs}
        actions={providerActions.actions}
        onBack={onBack}
        breadcrumbs={['Services & Marketplace', 'Taxes', taxProvider.name]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        renderCustomActions={providerActions.renderMoreMenu}
      />

      {/* Edit Provider Modal */}
      <EditProviderModal
        open={providerActions.isEditModalOpen}
        onOpenChange={(open) => providerActions.setIsEditModalOpen(open)}
        onSave={providerActions.handleSaveProvider}
        serviceType="Tax Service"
        initialData={providerActions.providerData}
      />
    </>
  );
};

export default TaxProviderDetail;