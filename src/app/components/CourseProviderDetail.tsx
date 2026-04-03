"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  BookOpen, 
  Globe, 
  Zap, 
  Star, 
  Clock, 
  DollarSign, 
  Users, 
  Settings, 
  History,
  FileText,
  ShieldCheck,
  Award
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  ServiceProviderDetailTemplate, 
  TabDefinition, 
  KPICard, 
  ActionButton 
} from './common/ServiceProviderDetailTemplate';
import { ServiceProviderOperationsTab } from './common/ServiceProviderOperationsTab';
import { ServiceProviderLogsTab, AuditLogEntry } from './common/ServiceProviderLogsTab';
import { Course, getCourseById } from '../services/courseService';
// Import Course Specific Tabs
import { 
  CourseCurriculumTab, 
  CourseAdmissionsTab, 
  CourseProvidersTab 
} from './CourseProviderDetailTabs';
import { useProviderActions } from './common/useProviderActions';

interface CourseProviderDetailProps {
  providerId: string;
  onBack: () => void;
}

export const CourseProviderDetail: React.FC<CourseProviderDetailProps> = ({ providerId, onBack }) => {
  const [providerData, setProviderData] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<AuditLogEntry[]>([]);
  const [userRole] = useState<'superadmin' | 'admin'>('superadmin'); // Mocking role

  const fetchProviderData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getCourseById(providerId);
      setProviderData(data);
    } catch (error) {
      toast.error('Failed to load course details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [providerId]);

  useEffect(() => {
    fetchProviderData();
  }, [fetchProviderData]);

  const addActivityLog = (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => {
    const newLog: AuditLogEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const providerActions = useProviderActions({
    serviceType: 'Course',
    providerId: providerId,
    providerName: providerData?.course_name || 'Loading...',
    initialData: {
      providerName: providerData?.course_name || '',
      legalName: providerData?.provider || '',
      headquarters: providerData?.countries_covered?.toString() || '1',
      supportedCountries: [providerData?.countries_covered?.toString() || '1'],
      partnerType: providerData?.category || 'Academic',
      accountManager: 'Academic Director',
      supportEmail: 'academic-support@platform.com',
      supportPhone: '+1-555-0909',
    },
    onProviderUpdate: () => {
      fetchProviderData();
      toast.success('Course updated successfully');
    },
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fafbfc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Course Profile...</p>
        </div>
      </div>
    );
  }

  if (!providerData) return null;

  const kpis: KPICard[] = [
    { 
      icon: Users, 
      label: 'Active Learners', 
      value: providerData.learners_count?.toLocaleString() || '0', 
      subtitle: 'Enrolled students', 
      color: 'blue' 
    },
    { 
      icon: Star, 
      label: 'Avg. Rating', 
      value: `${providerData.rating || 0}/5.0`, 
      subtitle: 'Student satisfaction', 
      color: 'emerald' 
    },
    { 
      icon: Zap, 
      label: 'Popularity', 
      value: `${providerData.popularity || 0}/10`, 
      subtitle: 'Market demand', 
      color: 'amber' 
    },
    { 
      icon: Clock, 
      label: 'Duration', 
      value: providerData.duration || 'N/A', 
      subtitle: 'Course length', 
      color: 'purple' 
    },
    { 
      icon: DollarSign, 
      label: 'Avg. Tuition', 
      value: providerData.avg_cost || 'N/A', 
      subtitle: 'Estimated cost', 
      color: 'gray' 
    },
  ];

  const tabs: TabDefinition[] = [
    {
      id: 'overview',
      label: 'Overview',
      component: () => (
        <CourseCurriculumTab
            providerId={providerId}
            providerData={providerData}
            addActivityLog={addActivityLog}
            userRole={userRole}
        />
      ),
    },
    {
      id: 'admissions',
      label: 'Admissions',
      component: () => (
        <CourseAdmissionsTab
            providerId={providerId}
            providerData={providerData}
            addActivityLog={addActivityLog}
            userRole={userRole}
        />
      ),
    },
    {
        id: 'providers',
        label: 'Providers',
        component: () => (
          <CourseProvidersTab
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
          serviceType="Course"
          serviceName={providerData.course_name}
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
          serviceType="Course"
          serviceName={providerData.course_name}
          userRole={userRole as any}
          logs={activityLogs}
        />
      ),
    },
    {
      id: 'settings',
      label: 'Partner Manager',
      component: () => (
        <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
            <Settings size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Partner Management</h3>
            <p className="text-gray-500 max-w-md mx-auto">Configure partnership agreements, commission structures, and specialized API integrations for this academic provider.</p>
            <div className="mt-8 flex justify-center gap-4">
                <button className="px-6 py-3 bg-[#0e042f] text-white rounded-2xl font-bold hover:bg-[#1a0a4a] transition-all">Open Partner Settings</button>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all">View Contract</button>
            </div>
        </div>
      ),
    },
  ];

  const actions: ActionButton[] = [
    { icon: Globe, label: 'Analytics', onClick: () => toast.info('Advanced analytics dashboard coming soon') },
    { icon: FileText, label: 'Export Report', onClick: () => toast.success('Academic report generated') },
    { icon: ShieldCheck, label: 'Verify Quality', onClick: () => toast.success('Academic quality check triggered') },
  ];

  return (
    <ServiceProviderDetailTemplate
      provider={{
        id: providerData.reference_id,
        name: providerData.course_name,
        avatar: providerData.course_name.charAt(0),
        status: providerData.status,
        metadata: [
          { icon: BookOpen, label: 'Ref', value: providerData.reference_id, color: 'gray' },
          { icon: Globe, label: 'Category', value: providerData.category, color: 'blue' },
          { icon: Award, label: 'Institutions', value: `${providerData.countries_covered} Partners`, color: 'emerald' },
        ],
      }}
      kpis={kpis}
      tabs={tabs}
      actions={actions}
      onBack={onBack}
      breadcrumbs={['Services', 'Courses', providerData.course_name]}
    />
  );
};
