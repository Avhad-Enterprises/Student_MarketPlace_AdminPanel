/**
 * BANK PROVIDER HEADER ACTIONS COMPONENT
 * Comprehensive action management for Bank Provider Detail page
 * Includes: Active/Inactive, Sync, Edit, Settings, 3-Dot Menu
 */

import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  RefreshCw,
  Edit3,
  Settings,
  MoreVertical,
  AlertCircle,
  Ban,
  XOctagon,
  RotateCcw,
  FileText,
  AlertTriangle,
  User,
  Clock,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from './ui/dialog';

export const useBankProviderActions = () => {
  // State Management
  const [bankStatus, setBankStatus] = useState<'active' | 'inactive'>('active');
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [statusChangeReason, setStatusChangeReason] = useState('');
  const [statusChangeReasonType, setStatusChangeReasonType] = useState('');

  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'success' | 'failed'>('idle');
  const [syncResults, setSyncResults] = useState<any>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    displayName: 'Chase Bank',
    logo: '🏦',
    description: 'Leading student banking partner offering checking and savings accounts',
    supportEmail: 'partners@chase.com',
    supportPhone: '+1 (800) 935-9935',
    accountManager: 'Sarah Johnson',
    marketingTags: 'No Fees, Student-Friendly, Quick Approval',
    internalNotes: 'Preferred partner for US-based students',
  });

  const [isSettingsQuickModalOpen, setIsSettingsQuickModalOpen] = useState(false);
  const [is3DotMenuOpen, setIs3DotMenuOpen] = useState(false);

  // 3-Dot Menu Actions
  const [isPauseAppsModalOpen, setIsPauseAppsModalOpen] = useState(false);
  const [pauseAppsReason, setPauseAppsReason] = useState('');
  const [isDisableRoutingModalOpen, setIsDisableRoutingModalOpen] = useState(false);
  const [disableRoutingReason, setDisableRoutingReason] = useState('');
  const [isForceResyncModalOpen, setIsForceResyncModalOpen] = useState(false);
  const [forceResyncConfirm, setForceResyncConfirm] = useState(false);
  const [isAuditHistoryModalOpen, setIsAuditHistoryModalOpen] = useState(false);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [archiveConfirmText, setArchiveConfirmText] = useState('');
  const [archiveReason, setArchiveReason] = useState('');

  // Handlers
  const handleStatusToggle = () => {
    if (!statusChangeReason.trim() || !statusChangeReasonType) {
      alert('Please select a reason type and provide details');
      return;
    }

    const newStatus = bankStatus === 'active' ? 'inactive' : 'active';
    setBankStatus(newStatus);
    setIsStatusModalOpen(false);
    setStatusChangeReason('');
    setStatusChangeReasonType('');

    console.log(`Audit Log: Bank status changed: ${bankStatus} → ${newStatus}`, {
      reason: statusChangeReasonType,
      details: statusChangeReason,
      admin: 'Current User',
      timestamp: new Date().toISOString(),
    });
  };

  const handleSync = () => {
    setSyncStatus('syncing');
    setIsSyncModalOpen(true);

    setTimeout(() => {
      setSyncStatus('success');
      setSyncResults({
        accountProducts: 'Updated (3 products)',
        supportedCountries: 'Updated (45 countries)',
        eligibilityMetadata: 'Updated',
        apiHealth: 'Healthy',
        webhookConnectivity: 'Connected',
        lastSync: new Date().toLocaleString(),
      });

      console.log('Audit Log: Sync completed', {
        admin: 'Current User',
        timestamp: new Date().toISOString(),
        result: 'success',
      });
    }, 2500);
  };

  const handleEditSave = () => {
    setIsEditModalOpen(false);
    console.log('Audit Log: Bank details edited', {
      changes: editFormData,
      admin: 'Current User',
      timestamp: new Date().toISOString(),
    });
  };

  const handleForceResync = () => {
    if (!forceResyncConfirm) {
      alert('Please confirm you understand this action');
      return;
    }
    setIsForceResyncModalOpen(false);
    setForceResyncConfirm(false);
    console.log('Audit Log: Force metadata resync triggered');
  };

  const handlePauseApps = () => {
    if (!pauseAppsReason.trim()) {
      alert('Please provide a reason');
      return;
    }
    setIsPauseAppsModalOpen(false);
    setPauseAppsReason('');
    console.log('Audit Log: Applications paused:', pauseAppsReason);
  };

  const handleDisableRouting = () => {
    if (!disableRoutingReason.trim()) {
      alert('Please provide a reason');
      return;
    }
    setIsDisableRoutingModalOpen(false);
    setDisableRoutingReason('');
    console.log('Audit Log: Auto-routing disabled:', disableRoutingReason);
  };

  const handleArchive = () => {
    if (archiveConfirmText !== 'ARCHIVE' || !archiveReason.trim()) {
      alert('Please type ARCHIVE and provide a reason');
      return;
    }
    setIsArchiveModalOpen(false);
    setArchiveConfirmText('');
    setArchiveReason('');
    console.log('Audit Log: Bank archived (CRITICAL):', archiveReason);
    alert('Bank has been archived. This action cannot be undone via UI.');
  };

  const auditHistory = [
    { action: 'Sync completed', admin: 'Admin: Sarah Johnson', timestamp: '2024-02-05 10:30 AM', details: 'Manual sync triggered' },
    { action: 'Bank activated', admin: 'Admin: Michael Chen', timestamp: '2024-02-03 02:15 PM', details: 'Reason: Integration testing completed' },
    { action: 'Eligibility rules updated', admin: 'Admin: Emily Rodriguez', timestamp: '2024-02-01 11:45 AM', details: 'Added support for J-1 visa holders' },
    { action: 'Settings modified', admin: 'Admin: David Park', timestamp: '2024-01-28 04:30 PM', details: 'Changed application mode to Instant Online' },
    { action: 'Bank details edited', admin: 'Admin: Sarah Johnson', timestamp: '2024-01-25 09:00 AM', details: 'Updated support email address' },
  ];

  // Return all state and handlers
  return {
    bankStatus,
    isStatusModalOpen,
    setIsStatusModalOpen,
    statusChangeReason,
    setStatusChangeReason,
    statusChangeReasonType,
    setStatusChangeReasonType,
    handleStatusToggle,
    isSyncModalOpen,
    setIsSyncModalOpen,
    syncStatus,
    setSyncStatus,
    syncResults,
    setSyncResults,
    handleSync,
    isEditModalOpen,
    setIsEditModalOpen,
    editFormData,
    setEditFormData,
    handleEditSave,
    isSettingsQuickModalOpen,
    setIsSettingsQuickModalOpen,
    is3DotMenuOpen,
    setIs3DotMenuOpen,
    isPauseAppsModalOpen,
    setIsPauseAppsModalOpen,
    pauseAppsReason,
    setPauseAppsReason,
    handlePauseApps,
    isDisableRoutingModalOpen,
    setIsDisableRoutingModalOpen,
    disableRoutingReason,
    setDisableRoutingReason,
    handleDisableRouting,
    isForceResyncModalOpen,
    setIsForceResyncModalOpen,
    forceResyncConfirm,
    setForceResyncConfirm,
    handleForceResync,
    isAuditHistoryModalOpen,
    setIsAuditHistoryModalOpen,
    isArchiveModalOpen,
    setIsArchiveModalOpen,
    archiveConfirmText,
    setArchiveConfirmText,
    archiveReason,
    setArchiveReason,
    handleArchive,
    auditHistory,
  };
};

// Action Buttons Component
export const BankProviderActionButtons: React.FC<{
  bankStatus: 'active' | 'inactive';
  onStatusClick: () => void;
  onSyncClick: () => void;
  onEditClick: () => void;
  onSettingsClick: () => void;
  on3DotClick: () => void;
}> = ({ bankStatus, onStatusClick, onSyncClick, onEditClick, onSettingsClick, on3DotClick }) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={onStatusClick}
        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors ${bankStatus === 'active'
            ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
            : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
      >
        {bankStatus === 'active' ? (
          <><CheckCircle size={16} />Active</>
        ) : (
          <><XCircle size={16} />Inactive</>
        )}
      </button>

      <button
        onClick={onSyncClick}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 transition-colors"
      >
        <RefreshCw size={16} />
        Sync
      </button>

      <button
        onClick={onEditClick}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 transition-colors"
      >
        <Edit3 size={16} />
        Edit
      </button>

      <button
        onClick={onSettingsClick}
        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium flex items-center gap-2 transition-colors"
      >
        <Settings size={16} />
        Settings
      </button>

      <button
        onClick={on3DotClick}
        className="p-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <MoreVertical size={20} />
      </button>
    </div>
  );
};

// All Modals Component
export const BankProviderModals: React.FC<{
  actions: ReturnType<typeof useBankProviderActions>;
}> = ({ actions }) => {
  return (
    <>
      {/* Status Toggle Modal */}
      <Dialog open={actions.isStatusModalOpen} onOpenChange={actions.setIsStatusModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {actions.bankStatus === 'active' ? (
                <><XCircle className="w-5 h-5 text-red-600" />Deactivate Bank Partner</>
              ) : (
                <><CheckCircle className="w-5 h-5 text-emerald-600" />Activate Bank Partner</>
              )}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {actions.bankStatus === 'active'
                ? 'Deactivate the bank partner to hide it from students and stop new applications'
                : 'Activate the bank partner to make it visible to students and allow new applications'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className={`p-4 rounded-lg border flex items-start gap-2 ${actions.bankStatus === 'active' ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'
              }`}>
              <AlertCircle size={18} className={`flex-shrink-0 mt-0.5 ${actions.bankStatus === 'active' ? 'text-red-600' : 'text-emerald-600'
                }`} />
              <div className={`text-sm ${actions.bankStatus === 'active' ? 'text-red-800' : 'text-emerald-800'
                }`}>
                {actions.bankStatus === 'active' ? (
                  <>
                    <span className="font-semibold">Deactivating this bank will:</span>
                    <ul className="mt-2 space-y-1 ml-4 list-disc">
                      <li>Hide bank from all student-facing interfaces immediately</li>
                      <li>Block new applications from being initiated</li>
                      <li>Maintain existing applications in read-only mode</li>
                      <li>Keep counselor access for support purposes</li>
                    </ul>
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Activating this bank will:</span>
                    <ul className="mt-2 space-y-1 ml-4 list-disc">
                      <li>Make bank visible to eligible students immediately</li>
                      <li>Allow new applications to be initiated</li>
                      <li>Enable counselors to recommend this bank</li>
                      <li>Resume normal marketplace operations</li>
                    </ul>
                  </>
                )}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Reason Type <span className="text-red-600">*</span>
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                value={actions.statusChangeReasonType}
                onChange={(e) => actions.setStatusChangeReasonType(e.target.value)}
              >
                <option value="">Select a reason...</option>
                <option value="integration-maintenance">Integration Maintenance</option>
                <option value="partner-request">Partner Request</option>
                <option value="compliance-issue">Compliance Issue</option>
                <option value="performance-issue">Performance Issue</option>
                <option value="testing">Testing / QA</option>
                <option value="other">Other (specify below)</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Detailed Reason <span className="text-red-600">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={3}
                placeholder="Provide specific details about this status change..."
                value={actions.statusChangeReason}
                onChange={(e) => actions.setStatusChangeReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                actions.setIsStatusModalOpen(false);
                actions.setStatusChangeReason('');
                actions.setStatusChangeReasonType('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={actions.handleStatusToggle}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${actions.bankStatus === 'active'
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              disabled={!actions.statusChangeReason.trim() || !actions.statusChangeReasonType}
            >
              {actions.bankStatus === 'active' ? 'Deactivate Bank' : 'Activate Bank'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sync Modal */}
      <Dialog open={actions.isSyncModalOpen} onOpenChange={actions.setIsSyncModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className={`w-5 h-5 text-blue-600 ${actions.syncStatus === 'syncing' ? 'animate-spin' : ''}`} />
              Sync Bank Metadata
            </DialogTitle>
            <DialogDescription className="sr-only">
              Synchronize bank account products, supported countries, and eligibility metadata from the bank&apos;s API
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {actions.syncStatus === 'idle' && (
              <>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
                  <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <span className="font-semibold">This sync will refresh:</span>
                    <ul className="mt-2 space-y-1 ml-4 list-disc">
                      <li>Account product list and features</li>
                      <li>Supported countries and regions</li>
                      <li>Eligibility metadata</li>
                      <li>API health status</li>
                      <li>Webhook connectivity</li>
                    </ul>
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="text-xs text-gray-600">
                    <span className="font-semibold">Last Sync:</span> 2024-02-05 08:15 AM (2 hours ago)
                  </div>
                </div>
              </>
            )}

            {actions.syncStatus === 'syncing' && (
              <div className="py-8">
                <div className="flex flex-col items-center gap-4">
                  <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
                  <div className="text-center">
                    <div className="font-semibold text-gray-900">Syncing bank metadata...</div>
                    <div className="text-sm text-gray-600 mt-1">This may take a few moments</div>
                  </div>
                </div>
              </div>
            )}

            {actions.syncStatus === 'success' && actions.syncResults && (
              <div className="space-y-3">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <div>
                    <div className="font-semibold text-emerald-900">Sync Completed Successfully</div>
                    <div className="text-sm text-emerald-700">All metadata has been refreshed</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                  <div className="text-sm font-semibold text-gray-700 mb-3">Sync Results:</div>
                  <div className="space-y-2">
                    {Object.entries(actions.syncResults).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0">
                        <span className="text-sm text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                        <span className="text-sm font-medium text-gray-900">{value as string}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {actions.syncStatus === 'success' ? (
              <button
                onClick={() => {
                  actions.setIsSyncModalOpen(false);
                  actions.setSyncStatus('idle');
                  actions.setSyncResults(null);
                }}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            ) : (
              <button
                onClick={() => actions.setIsSyncModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
                disabled={actions.syncStatus === 'syncing'}
              >
                Cancel
              </button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={actions.isEditModalOpen} onOpenChange={actions.setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="w-5 h-5 text-purple-600" />
              Edit Bank Details
            </DialogTitle>
            <DialogDescription className="sr-only">
              Edit bank display name, logo, description, support contact information, and internal notes
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
              <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                <span className="font-semibold">Note:</span> You can only edit business and display information. API configuration, eligibility rules, compliance flags, and commission data must be modified in their respective tabs.
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Display Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={actions.editFormData.displayName}
                  onChange={(e) => actions.setEditFormData({ ...actions.editFormData, displayName: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Logo (Emoji)</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={actions.editFormData.logo}
                  onChange={(e) => actions.setEditFormData({ ...actions.editFormData, logo: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Description</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={3}
                  value={actions.editFormData.description}
                  onChange={(e) => actions.setEditFormData({ ...actions.editFormData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Support Email</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={actions.editFormData.supportEmail}
                  onChange={(e) => actions.setEditFormData({ ...actions.editFormData, supportEmail: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Support Phone</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={actions.editFormData.supportPhone}
                  onChange={(e) => actions.setEditFormData({ ...actions.editFormData, supportPhone: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Account Manager</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  value={actions.editFormData.accountManager}
                  onChange={(e) => actions.setEditFormData({ ...actions.editFormData, accountManager: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Marketing Tags</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Comma-separated tags"
                  value={actions.editFormData.marketingTags}
                  onChange={(e) => actions.setEditFormData({ ...actions.editFormData, marketingTags: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 mb-2 block">Internal Notes</label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  rows={2}
                  value={actions.editFormData.internalNotes}
                  onChange={(e) => actions.setEditFormData({ ...actions.editFormData, internalNotes: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => actions.setIsEditModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={actions.handleEditSave}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Save Changes
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Quick Access Modal */}
      <Dialog open={actions.isSettingsQuickModalOpen} onOpenChange={actions.setIsSettingsQuickModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Quick Settings Access
            </DialogTitle>
            <DialogDescription className="sr-only">
              Quick access to frequently used settings including visibility, application mode, and eligibility enforcement
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 flex items-start gap-2">
              <AlertCircle size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-800">
                This modal provides quick access to frequently used settings. For comprehensive configuration, please visit the <span className="font-semibold">Settings tab</span>.
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">Visible to Students</div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="text-xs text-gray-600">Students can see and apply for this bank</div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="font-semibold text-gray-900 mb-2">Application Mode</div>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                  <option>Instant Online</option>
                  <option>Counselor-Assisted</option>
                  <option>Appointment Required</option>
                  <option>Offline / Document-Based</option>
                </select>
              </div>

              <div className="p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold text-gray-900">Eligibility Enforcement</div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="text-xs text-gray-600">Automatically enforce eligibility rules</div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => actions.setIsSettingsQuickModalOpen(false)}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => actions.setIsSettingsQuickModalOpen(false)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Go to Full Settings
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 3-Dot Menu Dropdown */}
      {actions.is3DotMenuOpen && (
        <div className="fixed inset-0 z-50" onClick={() => actions.setIs3DotMenuOpen(false)}>
          <div
            className="absolute top-20 right-8 bg-white rounded-lg shadow-xl border border-gray-200 py-2 w-64 z-[9999]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-3 py-2 border-b border-gray-100">
              <div className="text-xs font-semibold text-gray-500 uppercase">Advanced Actions</div>
            </div>

            <button
              onClick={() => {
                actions.setIs3DotMenuOpen(false);
                actions.setIsPauseAppsModalOpen(true);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
            >
              <Ban className="w-4 h-4 text-amber-600" />
              <div>
                <div className="font-medium text-gray-900">Pause Applications</div>
                <div className="text-xs text-gray-500">Temporarily stop new applications</div>
              </div>
            </button>

            <button
              onClick={() => {
                actions.setIs3DotMenuOpen(false);
                actions.setIsDisableRoutingModalOpen(true);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
            >
              <XOctagon className="w-4 h-4 text-orange-600" />
              <div>
                <div className="font-medium text-gray-900">Disable Auto-Routing</div>
                <div className="text-xs text-gray-500">Manual handling required</div>
              </div>
            </button>

            <button
              onClick={() => {
                actions.setIs3DotMenuOpen(false);
                actions.setIsForceResyncModalOpen(true);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
            >
              <RotateCcw className="w-4 h-4 text-blue-600" />
              <div>
                <div className="font-medium text-gray-900">Force Metadata Resync</div>
                <div className="text-xs text-gray-500">Deep rebuild of metadata</div>
              </div>
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={() => {
                actions.setIs3DotMenuOpen(false);
                actions.setIsAuditHistoryModalOpen(true);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-gray-50 flex items-center gap-3 text-sm"
            >
              <FileText className="w-4 h-4 text-purple-600" />
              <div>
                <div className="font-medium text-gray-900">View Audit History</div>
                <div className="text-xs text-gray-500">All actions on this provider</div>
              </div>
            </button>

            <div className="border-t border-gray-100 my-1"></div>

            <button
              onClick={() => {
                actions.setIs3DotMenuOpen(false);
                actions.setIsArchiveModalOpen(true);
              }}
              className="w-full px-4 py-2.5 text-left hover:bg-red-50 flex items-center gap-3 text-sm"
            >
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <div>
                <div className="font-medium text-red-700">Archive Bank</div>
                <div className="text-xs text-red-600">Super Admin Only</div>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Pause Applications Modal */}
      <Dialog open={actions.isPauseAppsModalOpen} onOpenChange={actions.setIsPauseAppsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Ban className="w-5 h-5 text-amber-600" />
              Pause Applications
            </DialogTitle>
            <DialogDescription className="sr-only">
              Temporarily stop new applications from being initiated while keeping the bank visible to students
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-2">
              <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-800">
                <span className="font-semibold">This action will:</span>
                <ul className="mt-2 space-y-1 ml-4 list-disc">
                  <li>Temporarily stop new applications from being initiated</li>
                  <li>Keep bank visible to students (but with &quot;Applications Paused&quot; notice)</li>
                  <li>Maintain all existing applications without disruption</li>
                  <li>Allow counselors to view details but not submit new applications</li>
                </ul>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Reason for Pausing <span className="text-red-600">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={3}
                placeholder="Explain why applications are being paused..."
                value={actions.pauseAppsReason}
                onChange={(e) => actions.setPauseAppsReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                actions.setIsPauseAppsModalOpen(false);
                actions.setPauseAppsReason('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={actions.handlePauseApps}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              disabled={!actions.pauseAppsReason.trim()}
            >
              Pause Applications
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable Auto-Routing Modal */}
      <Dialog open={actions.isDisableRoutingModalOpen} onOpenChange={actions.setIsDisableRoutingModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XOctagon className="w-5 h-5 text-orange-600" />
              Disable Auto-Routing
            </DialogTitle>
            <DialogDescription className="sr-only">
              Disable automatic redirection to bank portal requiring all applications to be handled manually by counselors
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200 flex items-start gap-2">
              <AlertCircle size={18} className="text-orange-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-800">
                <span className="font-semibold">This action will:</span>
                <ul className="mt-2 space-y-1 ml-4 list-disc">
                  <li>Applications will no longer auto-redirect to bank portal</li>
                  <li>All applications must be handled manually by counselors</li>
                  <li>Students will see &quot;Contact Counselor&quot; instead of &quot;Apply&quot;</li>
                  <li>Existing in-progress applications are unaffected</li>
                </ul>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Reason for Disabling <span className="text-red-600">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                rows={3}
                placeholder="Explain why auto-routing is being disabled..."
                value={actions.disableRoutingReason}
                onChange={(e) => actions.setDisableRoutingReason(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                actions.setIsDisableRoutingModalOpen(false);
                actions.setDisableRoutingReason('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={actions.handleDisableRouting}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              disabled={!actions.disableRoutingReason.trim()}
            >
              Disable Auto-Routing
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Force Metadata Resync Modal */}
      <Dialog open={actions.isForceResyncModalOpen} onOpenChange={actions.setIsForceResyncModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-blue-600" />
              Force Metadata Resync
            </DialogTitle>
            <DialogDescription className="sr-only">
              Perform a deep rebuild of all bank metadata including account products, eligibility rules, and API integration checks
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
              <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <span className="font-semibold">WARNING:</span> This will perform a <strong>deep rebuild</strong> of all bank metadata including:
                <ul className="mt-2 space-y-1 ml-4 list-disc">
                  <li>Complete account product catalog refresh</li>
                  <li>Full eligibility rules reconstruction</li>
                  <li>Deep API integration health check</li>
                  <li>Webhook reconfiguration and validation</li>
                  <li>May take several minutes to complete</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={actions.forceResyncConfirm}
                  onChange={(e) => actions.setForceResyncConfirm(e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded"
                />
                <span className="text-sm text-blue-900 font-medium">
                  I understand this is a deep rebuild and may temporarily affect integration performance
                </span>
              </label>
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                actions.setIsForceResyncModalOpen(false);
                actions.setForceResyncConfirm(false);
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={actions.handleForceResync}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
              disabled={!actions.forceResyncConfirm}
            >
              Force Resync Now
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Audit History Modal */}
      <Dialog open={actions.isAuditHistoryModalOpen} onOpenChange={actions.setIsAuditHistoryModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              Audit History — Chase Bank
            </DialogTitle>
            <DialogDescription className="sr-only">
              View complete audit history of all administrative actions performed on this bank partner
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-4">
            <div className="flex items-center gap-3 mb-4">
              <input
                type="text"
                placeholder="Search audit logs..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option>All Actions</option>
                <option>Status Changes</option>
                <option>Syncs</option>
                <option>Settings Modified</option>
                <option>Edits</option>
              </select>
            </div>

            {actions.auditHistory.map((entry, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">{entry.action}</div>
                    <div className="text-sm text-gray-700 mt-1">{entry.details}</div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User size={12} />
                        {entry.admin}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        {entry.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <DialogFooter>
            <button
              onClick={() => actions.setIsAuditHistoryModalOpen(false)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Bank Modal */}
      <Dialog open={actions.isArchiveModalOpen} onOpenChange={actions.setIsArchiveModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Archive Bank Partner (Super Admin Only)
            </DialogTitle>
            <DialogDescription className="sr-only">
              Permanently remove the bank from the marketplace - this action cannot be undone via UI and requires database access to reverse
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
              <AlertTriangle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <span className="font-semibold">CRITICAL WARNING:</span>
                <ul className="mt-2 space-y-1 ml-4 list-disc">
                  <li>This will <strong>permanently remove</strong> the bank from the marketplace</li>
                  <li>Bank will be <strong>completely hidden</strong> from all interfaces</li>
                  <li>All existing student applications will remain <strong>read-only</strong></li>
                  <li>This action <strong>CANNOT be undone</strong> via UI (requires database access)</li>
                  <li>This action is <strong>logged</strong> and <strong>flagged for review</strong></li>
                </ul>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Reason for Archiving <span className="text-red-600">*</span>
              </label>
              <textarea
                className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm"
                rows={3}
                placeholder="Provide detailed justification for archiving this bank partner..."
                value={actions.archiveReason}
                onChange={(e) => actions.setArchiveReason(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Type <strong>ARCHIVE</strong> to confirm <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-red-300 rounded-lg text-sm font-mono"
                placeholder="Type ARCHIVE in capital letters"
                value={actions.archiveConfirmText}
                onChange={(e) => actions.setArchiveConfirmText(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <button
              onClick={() => {
                actions.setIsArchiveModalOpen(false);
                actions.setArchiveConfirmText('');
                actions.setArchiveReason('');
              }}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={actions.handleArchive}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={actions.archiveConfirmText !== 'ARCHIVE' || !actions.archiveReason.trim()}
            >
              Archive Bank Permanently
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
