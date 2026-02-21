
import React from 'react';

// Common props for all tabs
interface TabProps {
    providerId: string;
}

export const LoanProviderEligibilityTab: React.FC<TabProps> = () => (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-[#253154] mb-4">Eligibility & Rules</h2>
        <p className="text-sm text-gray-600 italic">Eligibility configuration and business rules content will be implemented here.</p>
    </div>
);

export const LoanProviderDocumentsTab: React.FC<TabProps> = () => (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-[#253154] mb-4">Documents</h2>
        <p className="text-sm text-gray-600 italic">Document requirements and checklist management will be implemented here.</p>
    </div>
);

export const LoanProviderFlowTab: React.FC<TabProps> = () => (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-[#253154] mb-4">Application Flow</h2>
        <p className="text-sm text-gray-600 italic">Step-by-step application flow visualization and management.</p>
    </div>
);

export const LoanProviderTransactionsTab: React.FC<TabProps> = () => (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-[#253154] mb-4">Transactions</h2>
        <p className="text-sm text-gray-600 italic">Loan disbursement and repayment transaction history.</p>
    </div>
);

export const LoanProviderAnalyticsTab: React.FC<TabProps> = () => (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-[#253154] mb-4">Analytics</h2>
        <p className="text-sm text-gray-600 italic">Performance metrics, approval trends, and disbursement analytics.</p>
    </div>
);

export const LoanProviderOperationsTab: React.FC<TabProps> = () => (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-[#253154] mb-4">Operations</h2>
        <p className="text-sm text-gray-600 italic">Technical status monitoring and API health checks.</p>
    </div>
);

export const LoanProviderLogsTab: React.FC<TabProps> = () => (
    <div className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <h2 className="text-xl font-bold text-[#253154] mb-4">Logs</h2>
        <p className="text-sm text-gray-600 italic">System and activity audit logs for this provider.</p>
    </div>
);
