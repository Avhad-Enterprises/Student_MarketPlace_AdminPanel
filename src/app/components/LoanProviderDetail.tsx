/**
 * LOAN PROVIDER DETAIL PAGE
 * Services & Marketplace → Loans → Loan Provider Details
 * 
 * Standardized loan provider management using shared components
 */

"use client";

import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  Globe,
  Building2,
  Award,
  Users,
  Activity,
  DollarSign,
  TrendingUp,
  Percent,
} from 'lucide-react';
import { toast } from 'sonner';
import { ServiceProviderDetailTemplate } from './common/ServiceProviderDetailTemplate';
import { useProviderActions } from './common/useProviderActions';
import { EditProviderModal, ProviderBasicData } from './common/EditProviderModal';
import { LoanProviderOverviewTab } from './LoanProviderOverviewTab';
import { LoanProviderPlansTab } from './LoanProviderPlansTab';
import {
  LoanProviderEligibilityTab,
  LoanProviderDocumentsTab,
  LoanProviderFlowTab,
  LoanProviderTransactionsTab,
  LoanProviderAnalyticsTab,
  LoanProviderOperationsTab,
  LoanProviderLogsTab
} from './LoanProviderRemainingTabs';

import type {
  ServiceProvider,
  KPICard,
  TabDefinition,
} from './common/ServiceProviderDetailTemplate';

// ============================================
// MOCK DATA
// ============================================

const loanProvider: ServiceProvider = {
  id: 'LOAN-PROV-001',
  name: 'Prodigy Finance',
  avatar: '🎓',
  status: 'active',
  metadata: [
    { icon: FileText, label: 'ID', value: 'LOAN-PROV-001', color: 'gray' },
    { icon: Building2, label: 'Partner Type', value: 'Direct Lender', color: 'blue' },
    { icon: Globe, label: 'Countries', value: '150+', color: 'blue' },
    { icon: CheckCircle, label: 'Status', value: 'Active Partner', color: 'emerald' },
    { icon: Award, label: 'Onboarded', value: 'Jan 2019', color: 'amber' },
  ],
};

const kpiCards: KPICard[] = [
  {
    icon: Users,
    label: 'Total Students Using Loan',
    value: '8,247',
    subtitle: 'All-time students',
    color: 'blue',
  },
  {
    icon: Activity,
    label: 'Active Applications',
    value: '342',
    subtitle: 'In progress',
    color: 'purple',
  },
  {
    icon: CheckCircle,
    label: 'Approved Loans',
    value: '6,523',
    subtitle: '79.1% approval rate',
    color: 'emerald',
  },
  {
    icon: DollarSign,
    label: 'Monthly Disbursed',
    value: '$12.4M',
    subtitle: 'Last 30 days',
    color: 'amber',
  },
  {
    icon: Percent,
    label: 'Avg Interest Rate',
    value: '8.2%',
    subtitle: 'APR across all plans',
    color: 'red',
  },
  {
    icon: TrendingUp,
    label: 'Service Health',
    value: '98.7%',
    subtitle: 'API uptime',
    color: 'emerald',
  },
];

// ============================================
// TABS CONFIGURATION
// ============================================

const tabs: TabDefinition[] = [
  { id: 'overview', label: 'Overview', component: LoanProviderOverviewTab },
  { id: 'plans', label: 'Plans & Pricing', component: LoanProviderPlansTab },
  { id: 'eligibility', label: 'Eligibility & Rules', component: LoanProviderEligibilityTab },
  { id: 'documents', label: 'Documents', component: LoanProviderDocumentsTab },
  { id: 'flow', label: 'Application Flow', component: LoanProviderFlowTab },
  { id: 'transactions', label: 'Transactions', component: LoanProviderTransactionsTab },
  { id: 'analytics', label: 'Analytics', component: LoanProviderAnalyticsTab },
  { id: 'operations', label: 'Operations', component: LoanProviderOperationsTab },
  { id: 'logs', label: 'Logs', component: LoanProviderLogsTab },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const LoanProviderDetail: React.FC<{ providerId?: string; onBack?: () => void }> = ({ providerId, onBack }) => {
  // ============================================
  // STATE MANAGEMENT - Tab State Only
  // ============================================
  const [activeTab, setActiveTab] = useState('overview');

  // ============================================
  // STANDARDIZED PROVIDER ACTIONS
  // ============================================

  // Initial provider data for edit modal
  const initialProviderData: ProviderBasicData = {
    providerName: 'Prodigy Finance',
    legalName: 'Prodigy Finance Limited',
    headquarters: 'London, United Kingdom',
    supportedCountries: ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany'],
    partnerType: 'Direct Lender',
    accountManager: 'David Wilson',
    supportEmail: 'support@prodigyfinance.com',
    supportPhone: '+44 20 7101 3843',
  };

  // Initialize standardized provider actions
  const providerActions = useProviderActions({
    serviceType: 'Loan Provider',
    providerId: loanProvider.id,
    providerName: loanProvider.name,
    initialData: initialProviderData,
    onTabChange: (tabId) => {
      setActiveTab(tabId);
      toast.info(`Navigated to ${tabId.charAt(0).toUpperCase() + tabId.slice(1)} tab`);
    },
    onProviderUpdate: (data) => {
      console.log('Provider updated:', data);
      toast.success('Loan provider details updated successfully');
    },
  });

  // ============================================
  // RENDER
  // ============================================

  return (
    <>
      <ServiceProviderDetailTemplate
        provider={loanProvider}
        kpis={kpiCards}
        tabs={tabs}
        actions={providerActions.actions}
        onBack={onBack}
        breadcrumbs={['Services & Marketplace', 'Loans', loanProvider.name]}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        renderCustomActions={providerActions.renderMoreMenu}
      />

      {/* Edit Provider Modal */}
      <EditProviderModal
        isOpen={providerActions.isEditModalOpen}
        onClose={() => providerActions.setIsEditModalOpen(false)}
        onSave={providerActions.handleSaveProvider}
        serviceType="Loan Provider"
        initialData={providerActions.providerData}
      />
    </>
  );
};

export default LoanProviderDetail;
