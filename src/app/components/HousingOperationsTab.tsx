/**
 * HOUSING OPERATIONS TAB - FULL CONTROL PANEL
 * 
 * Complete operational control system with:
 * - Integration & connection status
 * - Sync controls (manual/auto with frequency)
 * - Availability & emergency switches
 * - Webhooks/notifications management
 * - Incident & health monitoring
 * - RBAC enforcement
 * - Complete activity logging
 */

import React, { useState } from 'react';
import {
  Zap,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Settings,
  Eye,
  EyeOff,
  Power,
  Shield,
  Clock,
  Activity,
  AlertCircle,
  Play,
  Pause,
  Globe,
  Server,
  Link,
  Bell,
  FileText,
  Edit3,
  TestTube,
  RotateCw,
} from 'lucide-react';
import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { toast } from 'sonner';
import type { ActivityLogEntry } from './HousingProviderDetail';

// ============================================
// TYPE DEFINITIONS
// ============================================

interface OperationsState {
  integrationMode: 'API' | 'Redirect' | 'Manual';
  environment: 'Sandbox' | 'Production';
  connectionStatus: 'Connected' | 'Disconnected' | 'Error';
  providerEndpoint: string;
  lastSyncTime: string;
  lastSyncStatus: 'Success' | 'Failed';
  lastSyncError?: string;
  nextScheduledSync: string;
  autoSync: boolean;
  syncFrequency: 'Hourly' | 'Daily' | 'Weekly';
  providerActive: boolean;
  acceptNewBookings: boolean;
  studentVisibility: boolean;
  counselorVisibility: boolean;
  errorRate: number;
  recentErrors: Array<{
    id: string;
    message: string;
    time: string;
    severity: 'Low' | 'Medium' | 'High';
  }>;
  webhooks: {
    bookingCreated: { enabled: boolean; lastTriggered: string; lastStatus: 'ok' | 'failed' };
    paymentCompleted: { enabled: boolean; lastTriggered: string; lastStatus: 'ok' | 'failed' };
    bookingCancelled: { enabled: boolean; lastTriggered: string; lastStatus: 'ok' | 'failed' };
  };
}

interface HousingOperationsTabProps {
  providerId: string;
  addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  userRole: string;
}

export const HousingOperationsTabEnhanced: React.FC<HousingOperationsTabProps> = ({
  providerId,
  addActivityLog,
  userRole,
}) => {
  const canEdit = userRole === 'admin' || userRole === 'superadmin';

  // State
  const [operations, setOperations] = useState<OperationsState>({
    integrationMode: 'API',
    environment: 'Production',
    connectionStatus: 'Connected',
    providerEndpoint: 'https://api.studenthousing.com/v1',
    lastSyncTime: '2024-02-07 10:30:00',
    lastSyncStatus: 'Success',
    nextScheduledSync: '2024-02-07 14:30:00',
    autoSync: true,
    syncFrequency: 'Hourly',
    providerActive: true,
    acceptNewBookings: true,
    studentVisibility: true,
    counselorVisibility: true,
    errorRate: 2.3,
    recentErrors: [
      { id: 'err-1', message: 'Listing sync timeout for Berlin listings', time: '2h ago', severity: 'Low' },
      { id: 'err-2', message: 'Payment webhook delivery failed (retry succeeded)', time: '5h ago', severity: 'Low' },
      { id: 'err-3', message: 'API rate limit exceeded temporarily', time: '1d ago', severity: 'Medium' },
    ],
    webhooks: {
      bookingCreated: { enabled: true, lastTriggered: '30m ago', lastStatus: 'ok' },
      paymentCompleted: { enabled: true, lastTriggered: '1h ago', lastStatus: 'ok' },
      bookingCancelled: { enabled: true, lastTriggered: '2h ago', lastStatus: 'failed' },
    },
  });

  const [showEditConfigModal, setShowEditConfigModal] = useState(false);
  const [showTestConnectionModal, setShowTestConnectionModal] = useState(false);
  const [showSwitchEnvModal, setShowSwitchEnvModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Temp config for editing
  const [tempConfig, setTempConfig] = useState({
    endpoint: operations.providerEndpoint,
    integrationMode: operations.integrationMode,
  });

  // Handlers
  const handleManualSync = async () => {
    if (!canEdit) {
      toast.error('You do not have permission to sync');
      return;
    }

    setIsSyncing(true);
    toast.info('Starting manual sync...');

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));

      setOperations(prev => ({
        ...prev,
        lastSyncTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
        lastSyncStatus: 'Success',
        lastSyncError: undefined,
      }));

      addActivityLog({
        admin: 'Current Admin',
        action: 'Synced',
        entity: 'Housing Listings',
        summary: 'Manual sync completed successfully - 1,067 listings updated',
      });

      toast.success('Manual sync completed successfully');
    } catch (error) {
      toast.error('Sync failed');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('Connection test successful - Provider API responding');
      setShowTestConnectionModal(false);

      addActivityLog({
        admin: 'Current Admin',
        action: 'Updated',
        entity: 'Integration',
        summary: 'Connection test successful',
      });
    } catch (error) {
      toast.error('Connection test failed');
    } finally {
      setIsTesting(false);
    }
  };

  const handleSwitchEnvironment = async () => {
    if (userRole !== 'superadmin') {
      toast.error('Only Super Admins can switch environments');
      return;
    }

    const newEnv = operations.environment === 'Sandbox' ? 'Production' : 'Sandbox';

    setOperations(prev => ({ ...prev, environment: newEnv as any }));

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Environment',
      summary: `Switched environment from ${operations.environment} to ${newEnv}`,
      oldValue: operations.environment,
      newValue: newEnv,
    });

    toast.success(`Switched to ${newEnv} environment`);
    setShowSwitchEnvModal(false);
  };

  const handleToggleActive = () => {
    if (!canEdit) {
      toast.error('You do not have permission to change provider status');
      return;
    }

    if (operations.providerActive) {
      setShowPauseModal(true);
    } else {
      setOperations(prev => ({ ...prev, providerActive: true }));

      addActivityLog({
        admin: 'Current Admin',
        action: 'Updated',
        entity: 'Provider Status',
        summary: 'Activated housing provider',
        oldValue: 'Paused',
        newValue: 'Active',
      });

      toast.success('Housing provider activated');
    }
  };

  const confirmPause = () => {
    setOperations(prev => ({ ...prev, providerActive: false, acceptNewBookings: false }));

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Provider Status',
      summary: 'Paused housing provider',
      oldValue: 'Active',
      newValue: 'Paused',
    });

    toast.success('Housing provider paused');
    setShowPauseModal(false);
  };

  const handleToggle = (field: keyof OperationsState, value: boolean) => {
    if (!canEdit) {
      toast.error('You do not have permission to change settings');
      return;
    }

    setOperations(prev => ({ ...prev, [field]: value }));

    const fieldLabels: Record<string, string> = {
      acceptNewBookings: 'Accept New Bookings',
      studentVisibility: 'Student Visibility',
      counselorVisibility: 'Counselor Visibility',
      autoSync: 'Auto Sync',
    };

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Operations Setting',
      summary: `${value ? 'Enabled' : 'Disabled'} ${fieldLabels[field]}`,
      oldValue: value ? 'Disabled' : 'Enabled',
      newValue: value ? 'Enabled' : 'Disabled',
    });

    toast.success(`${fieldLabels[field]} ${value ? 'enabled' : 'disabled'}`);
  };

  const handleSyncFrequencyChange = (frequency: 'Hourly' | 'Daily' | 'Weekly') => {
    if (!canEdit) {
      toast.error('You do not have permission to change sync settings');
      return;
    }

    setOperations(prev => ({ ...prev, syncFrequency: frequency }));

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Sync Frequency',
      summary: `Changed sync frequency to ${frequency}`,
      oldValue: operations.syncFrequency,
      newValue: frequency,
    });

    toast.success(`Sync frequency updated to ${frequency}`);
  };

  const handleToggleWebhook = (webhook: keyof OperationsState['webhooks'], enabled: boolean) => {
    if (!canEdit) {
      toast.error('You do not have permission to change webhook settings');
      return;
    }

    setOperations(prev => ({
      ...prev,
      webhooks: {
        ...prev.webhooks,
        [webhook]: { ...prev.webhooks[webhook], enabled },
      },
    }));

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Webhook',
      summary: `${enabled ? 'Enabled' : 'Disabled'} ${webhook} webhook`,
    });

    toast.success(`Webhook ${enabled ? 'enabled' : 'disabled'}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
            <Settings size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Operations Control Panel</h2>
            <p className="text-sm text-gray-600">Technical & operational management</p>
          </div>
        </div>

        {!canEdit && (
          <div className="px-4 py-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="text-sm font-semibold text-amber-800">Read-Only Mode</div>
            <div className="text-xs text-amber-700">Admin permissions required to edit</div>
          </div>
        )}
      </div>

      {/* Integration & Connection Status */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Link size={20} className="text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Integration & Connection</h3>
              <p className="text-sm text-gray-500">Provider API configuration</p>
            </div>
          </div>

          {canEdit && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTestConnectionModal(true)}
              >
                <TestTube size={14} className="mr-2" />
                Test Connection
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTempConfig({
                    endpoint: operations.providerEndpoint,
                    integrationMode: operations.integrationMode,
                  });
                  setShowEditConfigModal(true);
                }}
              >
                <Edit3 size={14} className="mr-2" />
                Edit Configuration
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Integration Mode</div>
            <div className="flex items-center gap-2">
              <Zap size={16} className="text-purple-600" />
              <span className="text-lg font-bold text-gray-900">{operations.integrationMode}</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Environment</div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe size={16} className={operations.environment === 'Production' ? 'text-emerald-600' : 'text-amber-600'} />
                <span className="text-lg font-bold text-gray-900">{operations.environment}</span>
              </div>
              {canEdit && userRole === 'superadmin' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSwitchEnvModal(true)}
                  className="text-xs"
                >
                  Switch
                </Button>
              )}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Connection Status</div>
            <div className="flex items-center gap-2">
              {operations.connectionStatus === 'Connected' ? (
                <>
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-lg font-bold text-emerald-900">Connected</span>
                </>
              ) : operations.connectionStatus === 'Error' ? (
                <>
                  <XCircle size={16} className="text-red-600" />
                  <span className="text-lg font-bold text-red-900">Error</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="text-gray-600" />
                  <span className="text-lg font-bold text-gray-900">Disconnected</span>
                </>
              )}
            </div>
          </div>

          <div className="col-span-3 p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-2">Provider Endpoint</div>
            <div className="flex items-center gap-2">
              <Server size={16} className="text-gray-400" />
              <code className="text-sm font-mono text-gray-700">{operations.providerEndpoint}</code>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Last Sync</div>
            <div className="text-sm font-semibold text-gray-900">{operations.lastSyncTime}</div>
            <div className={`text-xs font-semibold mt-1 ${operations.lastSyncStatus === 'Success' ? 'text-emerald-600' : 'text-red-600'}`}>
              {operations.lastSyncStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Sync Controls */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
              <RefreshCw size={20} className="text-emerald-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Sync & Automation</h3>
              <p className="text-sm text-gray-500">Control data synchronization</p>
            </div>
          </div>

          {canEdit && (
            <Button
              size="sm"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="flex items-center gap-2"
            >
              <RefreshCw size={14} className={isSyncing ? 'animate-spin' : ''} />
              {isSyncing ? 'Syncing...' : 'Manual Sync Now'}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-semibold text-gray-700">Auto Sync</div>
              <Switch
                checked={operations.autoSync}
                onCheckedChange={(val) => handleToggle('autoSync', val)}
                disabled={!canEdit}
              />
            </div>
            <div className="text-xs text-gray-600">
              {operations.autoSync ? 'Enabled' : 'Disabled'}
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm font-semibold text-gray-700 mb-2">Sync Frequency</div>
            <Select
              value={operations.syncFrequency}
              onValueChange={(val: any) => handleSyncFrequencyChange(val)}
              disabled={!canEdit || !operations.autoSync}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hourly">Hourly</SelectItem>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600 mb-1">Next Scheduled Sync</div>
            <div className="text-sm font-semibold text-gray-900">{operations.nextScheduledSync}</div>
            <div className="text-xs text-gray-500 mt-1">
              {operations.autoSync ? 'Auto-sync enabled' : 'Auto-sync disabled'}
            </div>
          </div>
        </div>

        {operations.lastSyncError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle size={16} className="text-red-600 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-red-900">Last Sync Failed</div>
                <div className="text-xs text-red-700 mt-1">{operations.lastSyncError}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Availability & Emergency Switches */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
            <Power size={20} className="text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Availability & Emergency Switches</h3>
            <p className="text-sm text-gray-500">Control provider visibility and booking acceptance</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`p-5 rounded-lg border-2 ${
            operations.providerActive ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">Provider Active</div>
                <div className="text-xs text-gray-600 mt-1">
                  {operations.providerActive ? 'Provider is active and operational' : 'Provider is paused'}
                </div>
              </div>
              <Switch
                checked={operations.providerActive}
                onCheckedChange={handleToggleActive}
                disabled={!canEdit}
              />
            </div>
            {operations.providerActive ? (
              <div className="flex items-center gap-2 text-emerald-700">
                <CheckCircle size={14} />
                <span className="text-xs font-semibold">Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-700">
                <Pause size={14} />
                <span className="text-xs font-semibold">Paused</span>
              </div>
            )}
          </div>

          <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">Accept New Bookings</div>
                <div className="text-xs text-gray-600 mt-1">
                  {operations.acceptNewBookings ? 'Accepting new booking requests' : 'Not accepting new bookings'}
                </div>
              </div>
              <Switch
                checked={operations.acceptNewBookings}
                onCheckedChange={(val) => handleToggle('acceptNewBookings', val)}
                disabled={!canEdit || !operations.providerActive}
              />
            </div>
          </div>

          <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">Student Visibility</div>
                <div className="text-xs text-gray-600 mt-1">
                  {operations.studentVisibility ? 'Visible to students' : 'Hidden from students'}
                </div>
              </div>
              <Switch
                checked={operations.studentVisibility}
                onCheckedChange={(val) => handleToggle('studentVisibility', val)}
                disabled={!canEdit}
              />
            </div>
          </div>

          <div className="p-5 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">Counselor Visibility</div>
                <div className="text-xs text-gray-600 mt-1">
                  {operations.counselorVisibility ? 'Visible to counselors' : 'Hidden from counselors'}
                </div>
              </div>
              <Switch
                checked={operations.counselorVisibility}
                onCheckedChange={(val) => handleToggle('counselorVisibility', val)}
                disabled={!canEdit}
              />
            </div>
          </div>
        </div>

        {!operations.providerActive && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle size={20} className="text-red-600 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-red-900">Provider is Currently Paused</div>
                <div className="text-xs text-red-700 mt-1">
                  Students cannot see listings or submit new bookings. Activate provider to resume operations.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Webhooks / Notifications */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
            <Bell size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Webhooks & Notifications</h3>
            <p className="text-sm text-gray-500">Event-driven integrations</p>
          </div>
        </div>

        <div className="space-y-3">
          {Object.entries(operations.webhooks).map(([key, webhook]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1">
                <div className="font-semibold text-gray-900">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  Last triggered: {webhook.lastTriggered} • Status: {' '}
                  <span className={webhook.lastStatus === 'ok' ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
                    {webhook.lastStatus === 'ok' ? '✓ OK' : '✗ Failed'}
                  </span>
                </div>
              </div>

              <Switch
                checked={webhook.enabled}
                onCheckedChange={(val) => handleToggleWebhook(key as any, val)}
                disabled={!canEdit}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Incident & Health */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <Activity size={20} className="text-amber-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Incident & Health Monitoring</h3>
            <p className="text-sm text-gray-500">System health and error tracking</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">Error Rate</span>
                <span className={`text-2xl font-bold ${operations.errorRate < 5 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {operations.errorRate}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${operations.errorRate < 5 ? 'bg-emerald-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(operations.errorRate, 100)}%` }}
                />
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {operations.errorRate < 5 ? 'System is healthy' : 'Elevated error rate detected'}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold text-gray-700 mb-3">Recent Errors</div>
            {operations.recentErrors.map(error => (
              <div key={error.id} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="text-sm text-gray-900">{error.message}</div>
                    <div className="text-xs text-gray-500 mt-1">{error.time}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    error.severity === 'Low' ? 'bg-blue-100 text-blue-700' :
                    error.severity === 'Medium' ? 'bg-amber-100 text-amber-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {error.severity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modals */}

      {/* Edit Configuration Modal */}
      <Dialog open={showEditConfigModal} onOpenChange={setShowEditConfigModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Integration Configuration</DialogTitle>
            <DialogDescription>Update provider API settings</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Integration Mode</label>
              <Select
                value={tempConfig.integrationMode}
                onValueChange={(val: any) => setTempConfig({ ...tempConfig, integrationMode: val })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="API">API</SelectItem>
                  <SelectItem value="Redirect">Redirect</SelectItem>
                  <SelectItem value="Manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Provider Endpoint</label>
              <Input
                value={tempConfig.endpoint}
                onChange={(e) => setTempConfig({ ...tempConfig, endpoint: e.target.value })}
                placeholder="https://api.provider.com/v1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditConfigModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => {
              setOperations(prev => ({
                ...prev,
                providerEndpoint: tempConfig.endpoint,
                integrationMode: tempConfig.integrationMode,
              }));

              addActivityLog({
                admin: 'Current Admin',
                action: 'Updated',
                entity: 'Integration Configuration',
                summary: `Updated endpoint to ${tempConfig.endpoint}`,
              });

              toast.success('Configuration updated successfully');
              setShowEditConfigModal(false);
            }}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Test Connection Modal */}
      <Dialog open={showTestConnectionModal} onOpenChange={setShowTestConnectionModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Test Connection</DialogTitle>
            <DialogDescription>Verify provider API connectivity</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-gray-600">
              This will send a test request to the provider API to verify connectivity and authentication.
            </p>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTestConnectionModal(false)} disabled={isTesting}>
              Cancel
            </Button>
            <Button onClick={handleTestConnection} disabled={isTesting}>
              {isTesting ? (
                <>
                  <RefreshCw size={14} className="mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube size={14} className="mr-2" />
                  Run Test
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Switch Environment Modal */}
      <Dialog open={showSwitchEnvModal} onOpenChange={setShowSwitchEnvModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Switch Environment</DialogTitle>
            <DialogDescription>Change between Sandbox and Production</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-sm text-amber-800 font-semibold">⚠️ Warning</p>
              <p className="text-xs text-amber-700 mt-1">
                Switching to {operations.environment === 'Sandbox' ? 'Production' : 'Sandbox'} will affect live operations.
                This action requires Super Admin permissions.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSwitchEnvModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSwitchEnvironment}>
              Switch to {operations.environment === 'Sandbox' ? 'Production' : 'Sandbox'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pause Provider Modal */}
      <Dialog open={showPauseModal} onOpenChange={setShowPauseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pause Housing Provider</DialogTitle>
            <DialogDescription>Temporarily stop accepting new bookings</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800 font-semibold">Impact:</p>
              <ul className="text-xs text-red-700 mt-2 space-y-1 ml-4">
                <li>• Students will not see listings from this provider</li>
                <li>• New booking requests will be blocked</li>
                <li>• Existing bookings remain active</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPauseModal(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmPause}>
              Pause Provider
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
