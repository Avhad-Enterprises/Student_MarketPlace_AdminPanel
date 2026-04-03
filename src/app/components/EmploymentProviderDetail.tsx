"use client";

import React, { useState, useEffect } from 'react';
import {
  FileText,
  CheckCircle,
  Briefcase,
  Users,
  TrendingUp,
  Globe,
  Settings as SettingsIcon,
  Activity,
  MapPin,
  Shield,
  Eye,
  Edit3,
  RefreshCw,
  XCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { ServiceProviderDetailTemplate } from './common/ServiceProviderDetailTemplate';
import { useProviderActions } from './common/useProviderActions';
import type { 
  ServiceProvider, 
  KPICard, 
  TabDefinition, 
  ActionButton 
} from './common/ServiceProviderDetailTemplate';
import { ServiceProviderLogsTab, AuditLogEntry } from './common/ServiceProviderLogsTab';
import { ServiceProviderOperationsTab } from './common/ServiceProviderOperationsTab';
import { getEmploymentById, Employment } from '@/app/services/employmentService';
import { EmploymentOverviewTab, EmploymentJobsTab } from './EmploymentProviderDetailTabs';

interface EmploymentProviderDetailProps {
  providerId: string;
  userRole?: string;
  onBack?: () => void;
}

export const EmploymentProviderDetail: React.FC<EmploymentProviderDetailProps> = ({
  providerId,
  userRole = 'admin',
  onBack,
}) => {
  const [loading, setLoading] = useState(true);
  const [providerData, setProviderData] = useState<Employment | null>(null);
  const [activityLogs, setActivityLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getEmploymentById(providerId);
        setProviderData(data?.data || null);
        
        // Mock some activity logs
        setActivityLogs([
          {
            id: 'log-1',
            timestamp: new Date().toISOString(),
            actor: 'System',
            actorType: 'System',
            action: 'Synced',
            entity: 'Employment Platform',
            entityId: providerId,
            severity: 'Info',
            summary: 'Automatic data sync completed',
            fullDescription: 'Successfully synced latest job listings from the platform.',
            source: 'API Sync',
            triggerType: 'Scheduled'
          } as any
        ]);
      } catch (error) {
        console.error("Error loading employment details:", error);
        toast.error("Failed to load employment platform details");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [providerId]);

  const addActivityLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ...entry,
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const providerActions = useProviderActions({
    serviceType: 'Employment',
    providerId: providerId,
    providerName: providerData?.platform || 'Loading...',
    initialData: {
      providerName: providerData?.platform || '',
      legalName: providerData?.platform || '',
      headquarters: providerData?.countries_covered?.toString() || '1',
      supportedCountries: [providerData?.countries_covered?.toString() || '1'],
      partnerType: providerData?.service_type || 'Employment',
      accountManager: 'Platform Manager',
      supportEmail: 'support@platform.com',
      supportPhone: '+1-555-0101',
    },
    onProviderUpdate: () => {
      toast.success('Employment provider updated');
    },
  });

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="animate-spin text-purple-600" size={32} />
          <p className="text-gray-500 font-medium">Loading platform details...</p>
        </div>
      </div>
    );
  }

  if (!providerData) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white min-h-[400px]">
        <div className="text-center space-y-4">
          <XCircle className="text-red-500 mx-auto" size={48} />
          <h2 className="text-2xl font-bold text-gray-900">Platform Not Found</h2>
          <p className="text-gray-500">We couldn't find the requested employment platform.</p>
          <button onClick={onBack} className="text-purple-600 font-bold hover:underline">Go Back</button>
        </div>
      </div>
    );
  }

  const provider: ServiceProvider = {
    id: providerData.id,
    name: providerData.platform,
    avatar: '💼',
    status: providerData.status,
    metadata: [
      { icon: FileText, label: 'Ref', value: providerData.reference_id || providerData.id, color: 'gray' },
      { icon: Briefcase, label: 'Type', value: providerData.service_type, color: 'blue' },
      { icon: Globe, label: 'Countries', value: `${providerData.countries_covered}`, color: 'purple' },
      { icon: Shield, label: 'Verified', value: providerData.verified ? 'Verified' : 'Unverified', color: providerData.verified ? 'emerald' : 'gray' },
    ],
  };

  const kpis: KPICard[] = [
    { icon: Briefcase, label: 'Active Listings', value: '1,245', subtitle: 'Job postings', color: 'blue' },
    { icon: Users, label: 'Student Placements', value: '856', subtitle: 'Successful hires', color: 'emerald' },
    { icon: TrendingUp, label: 'Growth Rate', value: '+18.5%', subtitle: 'Month over month', color: 'purple' },
    { icon: Clock, label: 'Avg Fill Time', value: '14 Days', subtitle: 'Time to hire', color: 'amber' },
    { icon: CheckCircle, label: 'Success Rate', value: '92%', subtitle: 'Placement success', color: 'emerald' },
  ];

  const tabs: TabDefinition[] = [
    {
      id: 'overview',
      label: 'Overview',
      component: () => (
        <EmploymentOverviewTab
          providerId={providerId}
          providerData={providerData}
          addActivityLog={addActivityLog}
          userRole={userRole}
        />
      ),
    },
    {
      id: 'jobs',
      label: 'Jobs & Opportunities',
      component: () => (
        <EmploymentJobsTab
          providerId={providerId}
          providerData={providerData}
          addActivityLog={addActivityLog}
          userRole={userRole}
        />
      ),
    },
    {
      id: 'operations',
      label: 'Operations',
      component: () => (
        <ServiceProviderOperationsTab
          serviceId={providerId}
          serviceType="Employment"
          serviceName={providerData.platform}
          userRole={userRole as any}
          onActivityLog={addActivityLog as any}
        />
      ),
    },
    {
      id: 'logs',
      label: 'Logs',
      component: () => (
        <ServiceProviderLogsTab
          serviceId={providerId}
          serviceType="Employment"
          serviceName={providerData.platform}
          userRole={userRole as any}
          logs={activityLogs}
        />
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      component: () => (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          <SettingsIcon className="mx-auto mb-4 text-gray-300" size={48} />
          <h3 className="text-lg font-bold text-gray-900">Advanced Settings</h3>
          <p className="text-sm">Manage API integrations, webhooks, and core platform visibility.</p>
        </div>
      ),
    },
  ];

  return (
    <ServiceProviderDetailTemplate
      provider={provider}
      kpis={kpis}
      tabs={tabs}
      actions={providerActions.actions}
      onBack={onBack}
      breadcrumbs={['Services', 'Employment', providerData.platform]}
      renderCustomActions={providerActions.renderMoreMenu}
    />
  );
};
