"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  FileText, 
  DollarSign, 
  CreditCard, 
  History, 
  Send, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  Receipt,
  User,
  ShieldCheck,
  TrendingUp,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  ServiceProviderDetailTemplate, 
  TabDefinition, 
  KPICard, 
  ActionButton 
} from './common/ServiceProviderDetailTemplate';
import { ServiceProviderLogsTab, AuditLogEntry } from './common/ServiceProviderLogsTab';
import { financeService, Payment } from '@/services/financeService';
import { 
  InvoiceSummaryTab, 
  InvoicePaymentHistoryTab 
} from './FinanceInvoiceDetailTabs';

interface FinanceInvoiceDetailProps {
  invoiceId: string;
  onBack: () => void;
}

export const FinanceInvoiceDetail: React.FC<FinanceInvoiceDetailProps> = ({ invoiceId, onBack }) => {
  const [invoiceData, setInvoiceData] = useState<Payment | null>(null);
  const [loading, setLoading] = useState(true);
  const [activityLogs, setActivityLogs] = useState<AuditLogEntry[]>([]);
  const [userRole] = useState<'superadmin' | 'admin'>('superadmin');

  const fetchInvoiceData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await financeService.getPaymentById(Number(invoiceId));
      setInvoiceData(data);
      
      // Mock logs for demonstration
      setActivityLogs([
        {
          id: '1',
          timestamp: data.created_at,
          actor: 'System',
          actorType: 'System',
          action: 'Created',
          entity: 'Invoice',
          entityId: invoiceId,
          severity: 'Info',
          summary: 'Invoice generated automatically',
          source: 'System'
        } as AuditLogEntry
      ]);
    } catch (error) {
      toast.error('Failed to load invoice details');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    fetchInvoiceData();
  }, [fetchInvoiceData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#fafbfc]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading Invoice Profile...</p>
        </div>
      </div>
    );
  }

  if (!invoiceData) return null;

  const kpis: KPICard[] = [
    { 
      icon: DollarSign, 
      label: 'Invoice Amount', 
      value: `${invoiceData.currency} ${Number(invoiceData.amount).toFixed(2)}`, 
      subtitle: 'Total including taxes', 
      color: 'blue' 
    },
    { 
      icon: ShieldCheck, 
      label: 'Compliance', 
      value: 'Verified', 
      subtitle: 'Gateway checked', 
      color: 'emerald' 
    },
    { 
      icon: TrendingUp, 
      label: 'Value Index', 
      value: '100%', 
      subtitle: 'Full amount', 
      color: 'purple' 
    },
    { 
        icon: User, 
        label: 'Student ID', 
        value: `#${invoiceData.student_db_id}`, 
        subtitle: 'Linked account', 
        color: 'gray' 
    },
  ];

  const tabs: TabDefinition[] = [
    {
      id: 'summary',
      label: 'Summary',
      component: () => (
        <InvoiceSummaryTab
            invoiceId={invoiceId}
            invoiceData={invoiceData}
        />
      ),
    },
    {
      id: 'history',
      label: 'Payment History',
      component: () => (
        <InvoicePaymentHistoryTab
            invoiceId={invoiceId}
            invoiceData={invoiceData}
        />
      ),
    },
    {
      id: 'logs',
      label: 'Audit Trail',
      component: () => (
        <ServiceProviderLogsTab
          serviceId={invoiceId}
          serviceType="Invoice"
          serviceName={invoiceData.invoice_number}
          userRole={userRole as any}
          logs={activityLogs}
        />
      ),
    },
    {
        id: 'settings',
        label: 'Financial Rules',
        component: () => (
          <div className="bg-white p-8 rounded-[38px] border border-gray-100 shadow-sm text-center">
              <Settings size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Invoice Configuration</h3>
              <p className="text-gray-500 max-w-md mx-auto">Configure automated late fees, tax rates, and reminder intervals for this transaction category.</p>
              <div className="mt-8 flex justify-center gap-4">
                  <button className="px-6 py-3 bg-[#0e042f] text-white rounded-2xl font-bold hover:shadow-xl transition-all">Update Rule Set</button>
                  <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-bold hover:bg-gray-200 transition-all">History</button>
              </div>
          </div>
        ),
      },
  ];

  const actions: ActionButton[] = [
    { icon: Send, label: 'Resend', onClick: () => toast.success('Invoice email resent to student') },
    { icon: Download, label: 'Export PDF', onClick: () => toast.info('Generating PDF...') },
    { icon: CheckCircle2, label: 'Mark as Paid', onClick: () => toast.success('Invoice marked as paid manually') },
  ];

  return (
    <ServiceProviderDetailTemplate
      provider={{
        id: invoiceData.invoice_number,
        name: `Invoice ${invoiceData.invoice_number}`,
        avatar: '🧾',
        status: invoiceData.status === 'paid' ? 'active' : 'suspended',
        metadata: [
          { icon: Receipt, label: 'Ref', value: invoiceData.payment_id, color: 'gray' },
          { icon: User, label: 'Student', value: `${invoiceData.first_name} ${invoiceData.last_name}`, color: 'blue' },
          { icon: History, label: 'Method', value: invoiceData.payment_method, color: 'purple' },
        ],
      }}
      kpis={kpis}
      tabs={tabs}
      actions={actions}
      onBack={onBack}
      breadcrumbs={['Finance', 'Invoices', invoiceData.invoice_number]}
    />
  );
};
