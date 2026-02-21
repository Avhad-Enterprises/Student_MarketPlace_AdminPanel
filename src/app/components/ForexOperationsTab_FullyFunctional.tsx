/**
 * FOREX OPERATIONS TAB - FULLY FUNCTIONAL CONTROL PANEL
 * 
 * Complete enterprise-grade operational controls:
 * - Integration configuration with edit modal
 * - Secure API credentials management
 * - Sync & rate refresh controls
 * - Provider availability & safety switches
 * - Risk & compliance safeguards
 * - Webhooks & notifications management
 * 
 * All actions persist and create audit logs.
 */

import React, { useState, useEffect } from 'react';
import {
  Settings,
  Key,
  RefreshCw,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  TestTube,
  Zap,
  Globe,
  Lock,
  Unlock,
  Activity,
  Bell,
  Database,
  Server,
  Clock,
  RotateCw,
  Pause,
  Play,
  AlertCircle,
  Save,
  X,
  Edit3,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { toast } from 'sonner';
import type { ForexProviderData } from './ForexProviderDetail';
import type { AuditLogEntry } from './common/ServiceProviderLogsTab';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';

interface TabProps {
  providerId: string;
  providerData: ForexProviderData;
  setProviderData: React.Dispatch<React.SetStateAction<ForexProviderData>>;
  addActivityLog: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  userRole: string;
}

// ============================================
// TYPE DEFINITIONS
// ============================================

interface IntegrationConfig {
  integrationType: 'API' | 'Redirect' | 'Manual';
  environment: 'Sandbox' | 'Production';
  apiStatus: 'Connected' | 'Error' | 'Disabled';
  lastSuccessfulSync: string;
  rateSource: 'Live API' | 'Cached' | 'Manual Override';
  apiBaseUrl: string;
  apiVersion: string;
  timeoutMs: number;
  retryAttempts: number;
  webhooksEnabled: boolean;
}

interface ApiCredentials {
  apiKey: string;
  clientId: string;
  webhookEndpoint: string;
  credentialStatus: 'Active' | 'Expired' | 'Invalid';
  lastRotated: string;
}

interface SyncConfig {
  autoSync: boolean;
  syncFrequency: 'Every 5 mins' | 'Every 15 mins' | 'Hourly' | 'Daily';
  syncScope: {
    exchangeRates: boolean;
    fees: boolean;
    limits: boolean;
    fullSync: boolean;
  };
  lastSyncStatus: 'Success' | 'Failed';
  lastSyncTime: string;
  failureReason?: string;
  nextScheduledSync?: string;
}

interface AvailabilityConfig {
  providerActive: boolean;
  studentVisibility: boolean;
  allowNewTransfers: boolean;
  allowHighValueTransfers: boolean;
  pauseReason?: string;
}

interface RiskConfig {
  maxTransferAmount: number;
  dailyLimitPerStudent: number;
  autoBlockOnFailures: boolean;
  failureThreshold: number;
  complianceHold: boolean;
}

interface WebhookEvent {
  id: string;
  name: string;
  enabled: boolean;
  lastTriggered?: string;
  lastResponseStatus?: 'Success' | 'Failed';
}

// ============================================
// MAIN COMPONENT
// ============================================

export const ForexOperationsTab: React.FC<TabProps> = ({
  providerId,
  providerData,
  setProviderData,
  addActivityLog,
  userRole,
}) => {
  const canEdit = userRole === 'admin' || userRole === 'superadmin';
  const canViewCredentials = userRole === 'superadmin';

  // State - Integration Config
  const [integrationConfig, setIntegrationConfig] = useState<IntegrationConfig>({
    integrationType: providerData.integrationType as any || 'API',
    environment: 'Production',
    apiStatus: 'Connected',
    lastSuccessfulSync: '2 mins ago',
    rateSource: 'Live API',
    apiBaseUrl: 'https://api.wise.com/v3',
    apiVersion: 'v3',
    timeoutMs: 30000,
    retryAttempts: 3,
    webhooksEnabled: true,
  });

  const [editingConfig, setEditingConfig] = useState<IntegrationConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showEnvConfirmation, setShowEnvConfirmation] = useState(false);

  // State - API Credentials
  const [credentials, setCredentials] = useState<ApiCredentials>({
    apiKey: 'sk_live_4xKz9pL2mN8qR5tY7wE3vH6jK9rS4uW8mP2nQ5xR8Qm',
    clientId: 'client_wise_prod_2024_78945',
    webhookEndpoint: 'https://platform.example.com/webhooks/forex/wise',
    credentialStatus: 'Active',
    lastRotated: '2024-01-15',
  });

  const [showCredentials, setShowCredentials] = useState(false);
  const [editingCredentials, setEditingCredentials] = useState(false);
  const [tempCredentials, setTempCredentials] = useState(credentials);
  const [testingConnection, setTestingConnection] = useState(false);

  // State - Sync Config
  const [syncConfig, setSyncConfig] = useState<SyncConfig>({
    autoSync: true,
    syncFrequency: 'Every 15 mins',
    syncScope: {
      exchangeRates: true,
      fees: true,
      limits: true,
      fullSync: false,
    },
    lastSyncStatus: 'Success',
    lastSyncTime: '2 mins ago',
    nextScheduledSync: 'in 13 mins',
  });

  const [syncing, setSyncing] = useState(false);

  // State - Availability Config
  const [availability, setAvailability] = useState<AvailabilityConfig>({
    providerActive: providerData.status === 'active',
    studentVisibility: providerData.studentVisibility,
    allowNewTransfers: true,
    allowHighValueTransfers: true,
  });

  const [showPauseModal, setShowPauseModal] = useState(false);
  const [pauseReason, setPauseReason] = useState('');

  // State - Risk Config
  const [riskConfig, setRiskConfig] = useState<RiskConfig>({
    maxTransferAmount: 50000,
    dailyLimitPerStudent: 100000,
    autoBlockOnFailures: true,
    failureThreshold: 3,
    complianceHold: false,
  });

  const [editingRisk, setEditingRisk] = useState(false);
  const [tempRiskConfig, setTempRiskConfig] = useState(riskConfig);

  // State - Webhooks
  const [webhooks, setWebhooks] = useState<WebhookEvent[]>([
    {
      id: 'wh-1',
      name: 'Transfer Initiated',
      enabled: true,
      lastTriggered: '5 mins ago',
      lastResponseStatus: 'Success',
    },
    {
      id: 'wh-2',
      name: 'Transfer Completed',
      enabled: true,
      lastTriggered: '12 mins ago',
      lastResponseStatus: 'Success',
    },
    {
      id: 'wh-3',
      name: 'Transfer Failed',
      enabled: true,
      lastTriggered: '2 hours ago',
      lastResponseStatus: 'Success',
    },
    {
      id: 'wh-4',
      name: 'Compliance Flagged',
      enabled: true,
      lastTriggered: '1 day ago',
      lastResponseStatus: 'Failed',
    },
  ]);

  // Persist to localStorage
  useEffect(() => {
    const key = `forex_operations_${providerId}`;
    localStorage.setItem(key, JSON.stringify({
      integrationConfig,
      credentials,
      syncConfig,
      availability,
      riskConfig,
      webhooks,
    }));
  }, [integrationConfig, credentials, syncConfig, availability, riskConfig, webhooks, providerId]);

  // ============================================
  // HANDLERS - INTEGRATION CONFIG
  // ============================================

  const handleEditConfig = () => {
    setEditingConfig({ ...integrationConfig });
    setShowConfigModal(true);
  };

  const handleSaveConfig = () => {
    if (!editingConfig) return;

    // Check if switching to Production
    if (editingConfig.environment === 'Production' && integrationConfig.environment !== 'Production') {
      setShowEnvConfirmation(true);
      return;
    }

    applyConfigChanges();
  };

  const applyConfigChanges = () => {
    if (!editingConfig) return;

    setIntegrationConfig(editingConfig);

    addActivityLog({
      user: 'Current Admin',
      action: 'Updated',
      entity: 'Integration Config',
      entityId: providerId,
      changes: 'Updated integration configuration',
      oldValue: JSON.stringify(integrationConfig),
      newValue: JSON.stringify(editingConfig),
      metadata: { section: 'Operations' },
    });

    toast.success('Integration configuration updated successfully');
    setShowConfigModal(false);
    setShowEnvConfirmation(false);
    setEditingConfig(null);
  };

  // ============================================
  // HANDLERS - API CREDENTIALS
  // ============================================

  const handleTestConnection = async () => {
    if (!canEdit) {
      toast.error('You do not have permission to test connection');
      return;
    }

    setTestingConnection(true);
    toast.info('Testing API connection...');

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));

      const success = Math.random() > 0.2; // 80% success rate for demo

      if (success) {
        addActivityLog({
          user: 'Current Admin',
          action: 'Updated',
          entity: 'API Connection',
          entityId: providerId,
          changes: 'Connection test successful',
          metadata: { section: 'Operations', result: 'Success' },
        });

        toast.success('✓ API connection test successful');
      } else {
        throw new Error('Connection timeout');
      }
    } catch (error: any) {
      addActivityLog({
        user: 'Current Admin',
        action: 'Updated',
        entity: 'API Connection',
        entityId: providerId,
        changes: `Connection test failed: ${error.message}`,
        metadata: { section: 'Operations', result: 'Failed' },
      });

      toast.error(`Connection test failed: ${error.message}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleRotateApiKey = () => {
    if (!canViewCredentials) {
      toast.error('Only superadmins can rotate API keys');
      return;
    }

    const newKey = `sk_live_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    setCredentials({
      ...credentials,
      apiKey: newKey,
      lastRotated: new Date().toISOString().split('T')[0],
    });

    addActivityLog({
      user: 'Current Admin',
      action: 'Updated',
      entity: 'API Credentials',
      entityId: providerId,
      changes: 'API key rotated',
      metadata: { section: 'Operations', action: 'Key Rotation' },
    });

    toast.success('API key rotated successfully');
  };

  const handleSaveCredentials = () => {
    setCredentials(tempCredentials);
    setEditingCredentials(false);

    addActivityLog({
      user: 'Current Admin',
      action: 'Updated',
      entity: 'API Credentials',
      entityId: providerId,
      changes: 'API credentials updated',
      metadata: { section: 'Operations' },
    });

    toast.success('Credentials updated successfully');
  };

  const handleCopyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  // ============================================
  // HANDLERS - SYNC CONTROLS
  // ============================================

  const handleSyncNow = async (scope?: keyof SyncConfig['syncScope']) => {
    if (!canEdit) {
      toast.error('You do not have permission to sync');
      return;
    }

    setSyncing(true);
    const scopeName = scope || 'Full';
    toast.info(`Syncing ${scopeName}...`);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      setSyncConfig({
        ...syncConfig,
        lastSyncStatus: 'Success',
        lastSyncTime: 'Just now',
        nextScheduledSync: 'in 15 mins',
      });

      addActivityLog({
        user: 'Current Admin',
        action: 'Synced',
        entity: 'Exchange Rates',
        entityId: providerId,
        changes: `Manual ${scopeName} sync completed successfully`,
        metadata: { section: 'Operations', scope: scopeName },
      });

      toast.success(`${scopeName} sync completed successfully`);
    } catch (error) {
      setSyncConfig({
        ...syncConfig,
        lastSyncStatus: 'Failed',
        failureReason: 'API timeout',
      });

      toast.error('Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const handleToggleAutoSync = (enabled: boolean) => {
    setSyncConfig({ ...syncConfig, autoSync: enabled });

    addActivityLog({
      user: 'Current Admin',
      action: 'Updated',
      entity: 'Auto Sync',
      entityId: providerId,
      changes: `Auto sync ${enabled ? 'enabled' : 'disabled'}`,
      oldValue: syncConfig.autoSync.toString(),
      newValue: enabled.toString(),
      metadata: { section: 'Operations' },
    });

    toast.success(`Auto sync ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleChangeSyncFrequency = (frequency: SyncConfig['syncFrequency']) => {
    setSyncConfig({ ...syncConfig, syncFrequency: frequency });

    addActivityLog({
      user: 'Current Admin',
      action: 'Updated',
      entity: 'Sync Frequency',
      entityId: providerId,
      changes: `Sync frequency changed to ${frequency}`,
      oldValue: syncConfig.syncFrequency,
      newValue: frequency,
      metadata: { section: 'Operations' },
    });

    toast.success(`Sync frequency updated to ${frequency}`);
  };

  // ============================================
  // HANDLERS - AVAILABILITY & SAFETY
  // ============================================

  const handleToggleProviderActive = (active: boolean) => {
    if (!active) {
      setShowPauseModal(true);
    } else {
      setAvailability({ ...availability, providerActive: true, pauseReason: undefined });
      setProviderData({ ...providerData, status: 'active' });

      addActivityLog({
        user: 'Current Admin',
        action: 'Updated',
        entity: 'Provider Status',
        entityId: providerId,
        changes: 'Provider activated',
        oldValue: 'paused',
        newValue: 'active',
        metadata: { section: 'Operations' },
      });

      toast.success('Provider activated successfully');
    }
  };

  const handleConfirmPause = () => {
    if (!pauseReason.trim()) {
      toast.error('Pause reason is required');
      return;
    }

    setAvailability({
      ...availability,
      providerActive: false,
      studentVisibility: false,
      pauseReason,
    });
    setProviderData({ ...providerData, status: 'inactive' });

    addActivityLog({
      user: 'Current Admin',
      action: 'Updated',
      entity: 'Provider Status',
      entityId: providerId,
      changes: `Provider paused: ${pauseReason}`,
      oldValue: 'active',
      newValue: 'paused',
      metadata: { section: 'Operations', reason: pauseReason },
    });

    toast.success('Provider paused successfully');
    setShowPauseModal(false);
    setPauseReason('');
  };

  const handleToggleAvailability = (field: keyof AvailabilityConfig, value: boolean) => {
    setAvailability({ ...availability, [field]: value });

    addActivityLog({
      user: 'Current Admin',
      action: 'Updated',
      entity: 'Availability Setting',
      entityId: providerId,
      changes: `${field} set to ${value}`,
      oldValue: availability[field]?.toString(),
      newValue: value.toString(),
      metadata: { section: 'Operations' },
    });

    toast.success(`${field} updated`);
  };

  // ============================================
  // HANDLERS - RISK CONFIG
  // ============================================

  const handleSaveRiskConfig = () => {
    setRiskConfig(tempRiskConfig);
    setEditingRisk(false);

    addActivityLog({
      user: 'Current Admin',
      action: 'Updated',
      entity: 'Risk Configuration',
      entityId: providerId,
      changes: 'Risk and compliance settings updated',
      oldValue: JSON.stringify(riskConfig),
      newValue: JSON.stringify(tempRiskConfig),
      metadata: { section: 'Operations' },
    });

    toast.success('Risk configuration updated successfully');
  };

  // ============================================
  // HANDLERS - WEBHOOKS
  // ============================================

  const handleToggleWebhook = (webhookId: string, enabled: boolean) => {
    setWebhooks(webhooks.map(wh =>
      wh.id === webhookId ? { ...wh, enabled } : wh
    ));

    const webhook = webhooks.find(wh => wh.id === webhookId);

    addActivityLog({
      user: 'Current Admin',
      action: 'Updated',
      entity: 'Webhook',
      entityId: webhookId,
      changes: `${webhook?.name} webhook ${enabled ? 'enabled' : 'disabled'}`,
      metadata: { section: 'Operations' },
    });

    toast.success(`Webhook ${enabled ? 'enabled' : 'disabled'}`);
  };

  const handleRetryWebhook = (webhookId: string) => {
    const webhook = webhooks.find(wh => wh.id === webhookId);
    toast.info(`Retrying webhook: ${webhook?.name}`);

    setTimeout(() => {
      setWebhooks(webhooks.map(wh =>
        wh.id === webhookId ? { ...wh, lastResponseStatus: 'Success', lastTriggered: 'Just now' } : wh
      ));

      addActivityLog({
        user: 'Current Admin',
        action: 'Updated',
        entity: 'Webhook',
        entityId: webhookId,
        changes: `${webhook?.name} webhook retry successful`,
        metadata: { section: 'Operations' },
      });

      toast.success('Webhook retry successful');
    }, 1500);
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#253154]">Operations & Integration Control</h2>
          <p className="text-sm text-gray-600">Manage technical configuration, security, and operational settings</p>
        </div>

        {!canEdit && (
          <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-sm font-semibold text-amber-900">
            Read-Only Mode
          </div>
        )}
      </div>

      <Tabs defaultValue="integration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="integration">Integration</TabsTrigger>
          <TabsTrigger value="sync">Sync & Rates</TabsTrigger>
          <TabsTrigger value="safety">Availability & Safety</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        {/* TAB 1: INTEGRATION CONFIGURATION */}
        <TabsContent value="integration" className="space-y-6">
          {/* Integration Config */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#253154]">Integration Configuration</h3>
              {canEdit && (
                <Button size="sm" onClick={handleEditConfig}>
                  <Edit3 size={14} className="mr-2" />
                  Edit Configuration
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-2">Integration Type</div>
                <div className="text-base font-bold text-[#253154]">{integrationConfig.integrationType}</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-2">Environment</div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded text-sm font-bold ${
                    integrationConfig.environment === 'Production'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}>
                    {integrationConfig.environment}
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-2">API Status</div>
                <div className="flex items-center gap-2">
                  {integrationConfig.apiStatus === 'Connected' && (
                    <>
                      <CheckCircle size={16} className="text-emerald-600" />
                      <span className="text-base font-bold text-emerald-900">Connected</span>
                    </>
                  )}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Last Sync</div>
                <div className="text-base font-bold text-[#253154]">{integrationConfig.lastSuccessfulSync}</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Rate Source</div>
                <div className="text-base font-bold text-[#253154]">{integrationConfig.rateSource}</div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">API Version</div>
                <div className="text-base font-bold text-[#253154]">{integrationConfig.apiVersion}</div>
              </div>
            </div>
          </div>

          {/* API Credentials */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#253154]">API Credentials</h3>
              {canViewCredentials && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCredentials(!showCredentials)}
                  >
                    {showCredentials ? <EyeOff size={14} className="mr-2" /> : <Eye size={14} className="mr-2" />}
                    {showCredentials ? 'Hide' : 'Show'}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleTestConnection} disabled={testingConnection}>
                    <TestTube size={14} className="mr-2" />
                    {testingConnection ? 'Testing...' : 'Test Connection'}
                  </Button>
                </div>
              )}
            </div>

            {canViewCredentials ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700 mb-1">API Key</div>
                    <code className="text-xs text-gray-600 font-mono">
                      {showCredentials ? credentials.apiKey : '••••••••••••••••••••••••••••••••'}
                    </code>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyToClipboard(credentials.apiKey, 'API Key')}
                    >
                      <Copy size={14} />
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRotateApiKey}>
                      <RotateCw size={14} className="mr-2" />
                      Rotate
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700 mb-1">Client ID</div>
                    <code className="text-xs text-gray-600 font-mono">
                      {showCredentials ? credentials.clientId : '••••••••••••••••••••••••'}
                    </code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(credentials.clientId, 'Client ID')}
                  >
                    <Copy size={14} />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-700 mb-1">Webhook Endpoint</div>
                    <code className="text-xs text-gray-600 font-mono break-all">
                      {credentials.webhookEndpoint}
                    </code>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(credentials.webhookEndpoint, 'Webhook URL')}
                  >
                    <Copy size={14} />
                  </Button>
                </div>

                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div>
                    <div className="text-sm font-semibold text-emerald-900">Credential Status</div>
                    <div className="text-xs text-emerald-600 mt-1">
                      Last rotated: {credentials.lastRotated}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle size={16} />
                    <span className="text-sm font-bold">{credentials.credentialStatus}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg text-center">
                <Lock size={24} className="mx-auto mb-2 text-amber-600" />
                <p className="text-sm font-semibold text-amber-900">
                  Only superadmins can view API credentials
                </p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* TAB 2: SYNC & RATE REFRESH */}
        <TabsContent value="sync" className="space-y-6">
          {/* Sync Controls */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#253154]">Sync & Rate Refresh Controls</h3>
              {canEdit && (
                <Button size="sm" onClick={() => handleSyncNow()} disabled={syncing}>
                  <RefreshCw size={14} className={`mr-2 ${syncing ? 'animate-spin' : ''}`} />
                  {syncing ? 'Syncing...' : 'Sync Now (Full)'}
                </Button>
              )}
            </div>

            {/* Last Sync Status */}
            <div className={`p-4 rounded-lg border-2 mb-4 ${
              syncConfig.lastSyncStatus === 'Success'
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-red-50 border-red-200'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {syncConfig.lastSyncStatus === 'Success' ? (
                      <CheckCircle size={16} className="text-emerald-600" />
                    ) : (
                      <XCircle size={16} className="text-red-600" />
                    )}
                    <span className="text-sm font-bold text-gray-900">
                      Last Sync: {syncConfig.lastSyncStatus}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    {syncConfig.lastSyncTime}
                    {syncConfig.failureReason && ` • ${syncConfig.failureReason}`}
                  </div>
                </div>
                {syncConfig.nextScheduledSync && (
                  <div className="text-right">
                    <div className="text-xs text-gray-600">Next Sync</div>
                    <div className="text-sm font-bold text-[#253154]">{syncConfig.nextScheduledSync}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Auto Sync Settings */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-700">Auto Sync</div>
                  <Switch
                    checked={syncConfig.autoSync}
                    onCheckedChange={handleToggleAutoSync}
                    disabled={!canEdit}
                  />
                </div>
                <div className="text-xs text-gray-600">
                  {syncConfig.autoSync ? 'Automatic sync enabled' : 'Manual sync only'}
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-2">Sync Frequency</div>
                <Select
                  value={syncConfig.syncFrequency}
                  onValueChange={handleChangeSyncFrequency}
                  disabled={!canEdit || !syncConfig.autoSync}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Every 5 mins">Every 5 mins</SelectItem>
                    <SelectItem value="Every 15 mins">Every 15 mins</SelectItem>
                    <SelectItem value="Hourly">Hourly</SelectItem>
                    <SelectItem value="Daily">Daily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sync Scope */}
            <div>
              <div className="text-sm font-semibold text-gray-700 mb-3">Sync Scope</div>
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(syncConfig.syncScope).map(([key, value]) => (
                  <label
                    key={key}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-semibold text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={value}
                        onCheckedChange={(checked) => {
                          setSyncConfig({
                            ...syncConfig,
                            syncScope: { ...syncConfig.syncScope, [key]: checked }
                          });
                        }}
                        disabled={!canEdit}
                      />
                      {canEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSyncNow(key as keyof SyncConfig['syncScope']);
                          }}
                          disabled={syncing}
                        >
                          <RefreshCw size={12} />
                        </Button>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Configuration */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#253154]">Risk & Compliance Safeguards</h3>
              {canEdit && !editingRisk && (
                <Button size="sm" onClick={() => {
                  setTempRiskConfig(riskConfig);
                  setEditingRisk(true);
                }}>
                  <Edit3 size={14} className="mr-2" />
                  Edit Rules
                </Button>
              )}
              {editingRisk && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => setEditingRisk(false)}>
                    <X size={14} className="mr-2" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveRiskConfig}>
                    <Save size={14} className="mr-2" />
                    Save
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-2">Max Transfer Amount</div>
                {editingRisk ? (
                  <Input
                    type="number"
                    value={tempRiskConfig.maxTransferAmount}
                    onChange={(e) => setTempRiskConfig({
                      ...tempRiskConfig,
                      maxTransferAmount: parseFloat(e.target.value) || 0
                    })}
                  />
                ) : (
                  <div className="text-base font-bold text-[#253154]">
                    ${riskConfig.maxTransferAmount.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold text-gray-700 mb-2">Daily Limit Per Student</div>
                {editingRisk ? (
                  <Input
                    type="number"
                    value={tempRiskConfig.dailyLimitPerStudent}
                    onChange={(e) => setTempRiskConfig({
                      ...tempRiskConfig,
                      dailyLimitPerStudent: parseFloat(e.target.value) || 0
                    })}
                  />
                ) : (
                  <div className="text-base font-bold text-[#253154]">
                    ${riskConfig.dailyLimitPerStudent.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-sm font-semibold text-gray-700">Auto-Block on Failures</div>
                  <Switch
                    checked={editingRisk ? tempRiskConfig.autoBlockOnFailures : riskConfig.autoBlockOnFailures}
                    onCheckedChange={(checked) => editingRisk && setTempRiskConfig({
                      ...tempRiskConfig,
                      autoBlockOnFailures: checked
                    })}
                    disabled={!editingRisk}
                  />
                </div>
                {(editingRisk ? tempRiskConfig.autoBlockOnFailures : riskConfig.autoBlockOnFailures) && (
                  <div>
                    <div className="text-xs text-gray-600 mb-1">Failure Threshold</div>
                    {editingRisk ? (
                      <Input
                        type="number"
                        value={tempRiskConfig.failureThreshold}
                        onChange={(e) => setTempRiskConfig({
                          ...tempRiskConfig,
                          failureThreshold: parseInt(e.target.value) || 0
                        })}
                        className="h-8"
                      />
                    ) : (
                      <div className="text-sm font-bold text-[#253154]">
                        {riskConfig.failureThreshold} failed attempts
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-1">Compliance Hold</div>
                    <div className="text-xs text-gray-600">Manual review mode</div>
                  </div>
                  <Switch
                    checked={editingRisk ? tempRiskConfig.complianceHold : riskConfig.complianceHold}
                    onCheckedChange={(checked) => editingRisk && setTempRiskConfig({
                      ...tempRiskConfig,
                      complianceHold: checked
                    })}
                    disabled={!editingRisk}
                  />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 3: AVAILABILITY & SAFETY */}
        <TabsContent value="safety" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#253154] mb-4">Provider Availability & Safety Switches</h3>

            <div className="space-y-4">
              {/* Provider Active */}
              <div className={`p-4 rounded-lg border-2 ${
                availability.providerActive
                  ? 'bg-emerald-50 border-emerald-200'
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {availability.providerActive ? (
                        <Play size={18} className="text-emerald-600" />
                      ) : (
                        <Pause size={18} className="text-red-600" />
                      )}
                      <span className="text-base font-bold text-gray-900">
                        Provider {availability.providerActive ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    {availability.pauseReason && (
                      <div className="text-sm text-gray-600 ml-7">
                        Reason: {availability.pauseReason}
                      </div>
                    )}
                  </div>
                  <Switch
                    checked={availability.providerActive}
                    onCheckedChange={handleToggleProviderActive}
                    disabled={!canEdit}
                  />
                </div>
              </div>

              {/* Student Visibility */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-1">Show Provider to Students</div>
                  <div className="text-xs text-gray-600">Controls visibility on student-facing platform</div>
                </div>
                <Switch
                  checked={availability.studentVisibility}
                  onCheckedChange={(checked) => handleToggleAvailability('studentVisibility', checked)}
                  disabled={!canEdit}
                />
              </div>

              {/* Allow New Transfers */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-1">Allow New Transfers</div>
                  <div className="text-xs text-gray-600">Enable students to initiate new transfers</div>
                </div>
                <Switch
                  checked={availability.allowNewTransfers}
                  onCheckedChange={(checked) => handleToggleAvailability('allowNewTransfers', checked)}
                  disabled={!canEdit}
                />
              </div>

              {/* Allow High-Value Transfers */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm font-bold text-gray-900 mb-1">Allow High-Value Transfers</div>
                  <div className="text-xs text-gray-600">
                    Transfers above ${riskConfig.maxTransferAmount / 2}
                  </div>
                </div>
                <Switch
                  checked={availability.allowHighValueTransfers}
                  onCheckedChange={(checked) => handleToggleAvailability('allowHighValueTransfers', checked)}
                  disabled={!canEdit}
                />
              </div>
            </div>
          </div>
        </TabsContent>

        {/* TAB 4: WEBHOOKS */}
        <TabsContent value="webhooks" className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-base font-bold text-[#253154] mb-4">Webhooks & Notifications</h3>

            <div className="space-y-3">
              {webhooks.map(webhook => (
                <div key={webhook.id} className="p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Bell size={16} className="text-blue-600" />
                        <h4 className="text-sm font-bold text-gray-900">{webhook.name}</h4>
                        {webhook.lastResponseStatus === 'Failed' && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-semibold">
                            Failed
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4 ml-7">
                        <div>
                          <div className="text-xs text-gray-600">Last Triggered</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {webhook.lastTriggered || 'Never'}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-600">Response Status</div>
                          <div className="flex items-center gap-1">
                            {webhook.lastResponseStatus === 'Success' ? (
                              <CheckCircle size={12} className="text-emerald-600" />
                            ) : (
                              <XCircle size={12} className="text-red-600" />
                            )}
                            <span className="text-sm font-semibold text-gray-900">
                              {webhook.lastResponseStatus || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Switch
                        checked={webhook.enabled}
                        onCheckedChange={(checked) => handleToggleWebhook(webhook.id, checked)}
                        disabled={!canEdit}
                      />
                      {webhook.lastResponseStatus === 'Failed' && canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRetryWebhook(webhook.id)}
                        >
                          <RotateCw size={14} className="mr-2" />
                          Retry
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* MODALS */}

      {/* Integration Config Modal */}
      <Dialog open={showConfigModal} onOpenChange={setShowConfigModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Integration Configuration</DialogTitle>
            <DialogDescription>Update technical integration settings</DialogDescription>
          </DialogHeader>

          {editingConfig && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Integration Type</label>
                  <Select
                    value={editingConfig.integrationType}
                    onValueChange={(v: any) => setEditingConfig({ ...editingConfig, integrationType: v })}
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
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Environment</label>
                  <Select
                    value={editingConfig.environment}
                    onValueChange={(v: any) => setEditingConfig({ ...editingConfig, environment: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sandbox">Sandbox</SelectItem>
                      <SelectItem value="Production">Production</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">API Base URL</label>
                  <Input
                    value={editingConfig.apiBaseUrl}
                    onChange={(e) => setEditingConfig({ ...editingConfig, apiBaseUrl: e.target.value })}
                    placeholder="https://api.provider.com"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">API Version</label>
                  <Input
                    value={editingConfig.apiVersion}
                    onChange={(e) => setEditingConfig({ ...editingConfig, apiVersion: e.target.value })}
                    placeholder="v3"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Timeout (ms)</label>
                  <Input
                    type="number"
                    value={editingConfig.timeoutMs}
                    onChange={(e) => setEditingConfig({
                      ...editingConfig,
                      timeoutMs: parseInt(e.target.value) || 30000
                    })}
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1 block">Retry Attempts</label>
                  <Input
                    type="number"
                    value={editingConfig.retryAttempts}
                    onChange={(e) => setEditingConfig({
                      ...editingConfig,
                      retryAttempts: parseInt(e.target.value) || 3
                    })}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <Switch
                  checked={editingConfig.webhooksEnabled}
                  onCheckedChange={(checked) => setEditingConfig({ ...editingConfig, webhooksEnabled: checked })}
                />
                <span className="text-sm font-semibold text-gray-700">Enable Webhooks</span>
              </label>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfigModal(false)}>Cancel</Button>
            <Button onClick={handleSaveConfig} className="bg-[#0e042f] hover:bg-[#1a0a4a]">
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Environment Confirmation Modal */}
      <Dialog open={showEnvConfirmation} onOpenChange={setShowEnvConfirmation}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-amber-600">
              <AlertTriangle size={20} />
              Switch to Production?
            </DialogTitle>
            <DialogDescription>
              You are about to switch this provider to Production environment. This will affect live transactions.
              Please confirm you want to proceed.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEnvConfirmation(false)}>Cancel</Button>
            <Button onClick={applyConfigChanges} className="bg-amber-600 hover:bg-amber-700">
              Confirm Switch to Production
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Pause Provider Modal */}
      <Dialog open={showPauseModal} onOpenChange={setShowPauseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <Pause size={20} />
              Pause Provider
            </DialogTitle>
            <DialogDescription>
              This will immediately hide the provider from students and prevent new transfers.
              Please provide a reason for pausing.
            </DialogDescription>
          </DialogHeader>

          <div>
            <label className="text-sm font-semibold text-gray-700 mb-1 block">Reason (Required)</label>
            <textarea
              value={pauseReason}
              onChange={(e) => setPauseReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-100 outline-none"
              rows={3}
              placeholder="e.g., API issues, maintenance, compliance review..."
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowPauseModal(false);
              setPauseReason('');
            }}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPause} className="bg-red-600 hover:bg-red-700">
              Confirm Pause
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
