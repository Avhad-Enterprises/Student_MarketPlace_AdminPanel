/**
 * SERVICE PROVIDER LOGS TAB - AUDIT & COMPLIANCE GRADE
 * 
 * Enterprise-grade audit trail system for ALL service providers.
 * Use for: Build Credit, Loans, Insurance, SIM Cards, Tax, Visa, etc.
 * 
 * FEATURES:
 * - Complete audit trail (append-only)
 * - Advanced multi-filter system
 * - Before/After diff view
 * - Export (CSV, JSON, PDF)
 * - RBAC enforcement
 * - System vs Admin logs
 * - Retention & compliance
 * - Pagination
 * - Real-time filtering
 * 
 * COMPLIANCE:
 * - Immutable from UI
 * - Complete before/after tracking
 * - IP address logging
 * - User agent tracking
 * - Timezone-aware timestamps
 */

import React, { useState, useMemo } from 'react';
import {
  FileText,
  Filter,
  Download,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  AlertTriangle,
  Info,
  AlertCircle,
  User,
  Bot,
  Calendar,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

// ============================================
// TYPES
// ============================================

export type ActionType = 'Created' | 'Updated' | 'Deleted' | 'Status Change' | 'Login' | 'Exported' | 'Duplicated' | 'Reordered' | 'Synced' | 'Viewed' | 'Enabled' | 'Disabled' | 'Failed' | 'Tested' | 'Rotated' | 'Archived' | 'Restored' | 'Paused' | 'Activated';
export type SeverityType = 'Info' | 'Warning' | 'Critical';
export type SourceType = 'System' | 'Admin' | 'API' | 'User' | 'Admin Action' | 'Automation';

export interface AuditLogEntry {
  id: string;
  timestamp: string; // ISO format with timezone
  timestampDisplay?: string; // Human-readable format
  actor?: string; // Admin name or "System"
  actorType?: 'Admin' | 'System';
  action: ActionType;
  entity: string; // "Eligibility Rules", "Credit Terms", "API Config", etc.
  entityId?: string;
  severity?: SeverityType;
  summary?: string; // Short description
  fullDescription?: string; // Detailed description
  beforeState?: any; // JSON object
  afterState?: any; // JSON object
  source?: SourceType;
  ipAddress?: string;
  userAgent?: string;
  triggerType?: 'Manual' | 'API' | 'Auto Sync' | 'System Rule';
  user?: string; // Legacy/Alias support
  metadata?: any; // Legacy/Alias support
  changes?: any; // Legacy/Alias support
  oldValue?: any; // Legacy/Alias support
  newValue?: any; // Legacy/Alias support
}

export interface LogFilters {
  dateRange: { start: string; end: string } | null;
  adminUsers: string[];
  actionTypes: ActionType[];
  entities: string[];
  sources: SourceType[];
  severities: SeverityType[];
  searchQuery: string;
}

export interface ServiceProviderLogsTabProps {
  serviceType: string;
  serviceId: string;
  serviceName: string;
  userRole: 'superadmin' | 'admin' | 'manager' | 'viewer';
  logs: AuditLogEntry[];
  onExport?: (format: 'csv' | 'json' | 'pdf', filteredLogs: AuditLogEntry[]) => void;
}

// ============================================
// MOCK DATA GENERATOR (for demo purposes)
// ============================================

const generateMockLogs = (serviceType: string, serviceName: string): AuditLogEntry[] => {
  const now = new Date();

  return [
    {
      id: '1',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
      timestampDisplay: '2024-02-06 13:30:00 UTC',
      actor: 'Sarah Admin',
      actorType: 'Admin',
      action: 'Updated',
      entity: 'Credit Terms',
      entityId: 'TERMS-001',
      severity: 'Info',
      summary: 'Updated max credit limit from $3,000 to $5,000',
      fullDescription: 'Administrator Sarah Admin updated the maximum credit limit configuration for the Deserve EDU program. This change increases the lending capacity for eligible students.',
      beforeState: { maxCreditLimit: 3000, currency: 'USD' },
      afterState: { maxCreditLimit: 5000, currency: 'USD' },
      source: 'Admin Action',
      ipAddress: '192.168.1.45',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      triggerType: 'Manual',
    },
    {
      id: '2',
      timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      timestampDisplay: '2024-02-06 10:15:00 UTC',
      actor: 'System',
      actorType: 'System',
      action: 'Synced',
      entity: 'API Integration',
      severity: 'Info',
      summary: 'Automatic sync completed - 127 applications updated',
      fullDescription: 'System-initiated automatic synchronization with provider API completed successfully. All application statuses and account data refreshed.',
      beforeState: { lastSync: '2024-02-06 09:15:00', syncedItems: 120 },
      afterState: { lastSync: '2024-02-06 10:15:00', syncedItems: 127 },
      source: 'Automation',
      triggerType: 'Auto Sync',
    },
    {
      id: '3',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
      timestampDisplay: '2024-02-05 15:30:00 UTC',
      actor: 'John Manager',
      actorType: 'Admin',
      action: 'Updated',
      entity: 'Eligibility Rules',
      entityId: 'ELIG-002',
      severity: 'Warning',
      summary: 'Changed minimum age requirement from 18 to 21',
      fullDescription: 'Eligibility criteria updated to comply with new regional regulations. Minimum age requirement increased to 21 years for all new applications.',
      beforeState: { minAge: 18, ageRestriction: 'Federal minimum' },
      afterState: { minAge: 21, ageRestriction: 'State compliance requirement' },
      source: 'Admin Action',
      ipAddress: '10.0.1.67',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      triggerType: 'Manual',
    },
    {
      id: '4',
      timestamp: new Date(now.getTime() - 36 * 60 * 60 * 1000).toISOString(),
      timestampDisplay: '2024-02-05 03:30:00 UTC',
      actor: 'System',
      actorType: 'System',
      action: 'Failed',
      entity: 'API Connection',
      severity: 'Critical',
      summary: 'API sync failed - connection timeout after 30000ms',
      fullDescription: 'Automated sync attempt failed due to provider API timeout. Max retry attempts (3) exceeded. System automatically triggered fallback queue mode.',
      beforeState: { connectionStatus: 'Connected', lastError: null },
      afterState: { connectionStatus: 'Error', lastError: 'ETIMEDOUT: Connection timeout' },
      source: 'System',
      triggerType: 'Auto Sync',
    },
    {
      id: '5',
      timestamp: new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString(),
      timestampDisplay: '2024-02-04 15:30:00 UTC',
      actor: 'Sarah Admin',
      actorType: 'Admin',
      action: 'Enabled',
      entity: 'Student Visibility',
      severity: 'Info',
      summary: 'Enabled student marketplace visibility',
      fullDescription: 'Administrator enabled program visibility in student marketplace. Students can now discover and apply for this program through the platform.',
      beforeState: { studentVisibility: false },
      afterState: { studentVisibility: true },
      source: 'Admin Action',
      ipAddress: '192.168.1.45',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      triggerType: 'Manual',
    },
    {
      id: '6',
      timestamp: new Date(now.getTime() - 72 * 60 * 60 * 1000).toISOString(),
      timestampDisplay: '2024-02-03 15:30:00 UTC',
      actor: 'Super Admin',
      actorType: 'Admin',
      action: 'Rotated',
      entity: 'API Credentials',
      entityId: 'CRED-001',
      severity: 'Critical',
      summary: 'API key rotated - old key revoked',
      fullDescription: 'Super Admin initiated API key rotation. Previous key has been revoked and new key generated. All active integrations require update.',
      beforeState: { apiKeyHash: 'sha256:abc123...', status: 'Active' },
      afterState: { apiKeyHash: 'sha256:xyz789...', status: 'Active' },
      source: 'Admin Action',
      ipAddress: '192.168.1.45',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      triggerType: 'Manual',
    },
    {
      id: '7',
      timestamp: new Date(now.getTime() - 96 * 60 * 60 * 1000).toISOString(),
      timestampDisplay: '2024-02-02 15:30:00 UTC',
      actor: 'John Manager',
      actorType: 'Admin',
      action: 'Updated',
      entity: 'Operational Notes',
      severity: 'Info',
      summary: 'Added operational note about provider maintenance',
      fullDescription: 'Admin added note: "Provider scheduled maintenance window Feb 15-16. Expect delayed sync during this period."',
      beforeState: { notes: '' },
      afterState: { notes: 'Provider scheduled maintenance window Feb 15-16. Expect delayed sync during this period.' },
      source: 'Admin Action',
      ipAddress: '10.0.1.67',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      triggerType: 'Manual',
    },
    {
      id: '8',
      timestamp: new Date(now.getTime() - 120 * 60 * 60 * 1000).toISOString(),
      timestampDisplay: '2024-02-01 15:30:00 UTC',
      actor: 'Sarah Admin',
      actorType: 'Admin',
      action: 'Paused',
      entity: 'Program Status',
      severity: 'Warning',
      summary: 'Paused program - no new applications accepted',
      fullDescription: 'Administrator paused program temporarily for maintenance. Existing applications continue processing but no new applications are accepted.',
      beforeState: { programActive: true, acceptNewApplications: true },
      afterState: { programActive: false, acceptNewApplications: false },
      source: 'Admin Action',
      ipAddress: '192.168.1.45',
      userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      triggerType: 'Manual',
    },
  ];
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

const getSeverityVariant = (severity: SeverityType | undefined): "default" | "secondary" | "destructive" | "outline" => {
  switch (severity) {
    case 'Critical': return 'destructive';
    case 'Warning': return 'secondary';
    case 'Info': return 'default';
    default: return 'outline';
  }
};

const getSeverityConfig = (severity: SeverityType) => {
  const config = {
    Info: { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Info },
    Warning: { color: 'bg-amber-100 text-amber-700 border-amber-300', icon: AlertTriangle },
    Critical: { color: 'bg-red-100 text-red-700 border-red-300', icon: AlertCircle },
  };
  return config[severity];
};

const getActorIcon = (actorType: 'Admin' | 'System') => {
  return actorType === 'Admin' ? User : Bot;
};

const formatJsonDiff = (before: any, after: any): { changed: boolean; fields: Array<{ key: string; before: any; after: any }> } => {
  if (!before || !after) return { changed: false, fields: [] };

  const fields: Array<{ key: string; before: any; after: any }> = [];
  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  allKeys.forEach(key => {
    const beforeVal = before[key];
    const afterVal = after[key];

    if (JSON.stringify(beforeVal) !== JSON.stringify(afterVal)) {
      fields.push({ key, before: beforeVal, after: afterVal });
    }
  });

  return { changed: fields.length > 0, fields };
};

// ============================================
// MAIN COMPONENT
// ============================================

export const ServiceProviderLogsTab: React.FC<ServiceProviderLogsTabProps> = ({
  serviceType,
  serviceId,
  serviceName,
  userRole,
  logs: externalLogs,
  onExport,
}) => {

  // ============================================
  // STATE
  // ============================================

  const [logs] = useState<AuditLogEntry[]>(
    externalLogs.length > 0 ? externalLogs : generateMockLogs(serviceType, serviceName)
  );

  const [filters, setFilters] = useState<LogFilters>({
    dateRange: null,
    adminUsers: [],
    actionTypes: [],
    entities: [],
    sources: [],
    severities: [],
    searchQuery: '',
  });

  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // ============================================
  // FILTER OPTIONS (derived from logs)
  // ============================================

  const filterOptions = useMemo(() => {
    const adminUsers = Array.from(new Set(logs.filter(l => l.actorType === 'Admin' && l.actor).map(l => l.actor as string)));
    const actionTypes = Array.from(new Set(logs.map(l => l.action))) as ActionType[];
    const entities = Array.from(new Set(logs.map(l => l.entity)));
    const sources = Array.from(new Set(logs.filter(l => l.source).map(l => l.source as SourceType)));
    const severities: SeverityType[] = ['Info', 'Warning', 'Critical'];

    return { adminUsers, actionTypes, entities, sources, severities };
  }, [logs]);

  // ============================================
  // FILTERING LOGIC
  // ============================================

  const filteredLogs = useMemo(() => {
    let result = [...logs];

    // Date range filter
    if (filters.dateRange) {
      const start = new Date(filters.dateRange.start).getTime();
      const end = new Date(filters.dateRange.end).getTime();
      result = result.filter(log => {
        const logTime = new Date(log.timestamp).getTime();
        return logTime >= start && logTime <= end;
      });
    }

    // Admin users filter
    if (filters.adminUsers.length > 0) {
      result = result.filter(log => filters.adminUsers.includes(log.actor || 'System'));
    }

    // Action types filter
    if (filters.actionTypes.length > 0) {
      result = result.filter(log => filters.actionTypes.includes(log.action));
    }

    // Entities filter
    if (filters.entities.length > 0) {
      result = result.filter(log => filters.entities.includes(log.entity));
    }

    // Sources filter
    if (filters.sources.length > 0) {
      result = result.filter(log => filters.sources.includes(log.source || 'System'));
    }

    // Severities filter
    if (filters.severities.length > 0) {
      result = result.filter(log => filters.severities.includes(log.severity || 'Info'));
    }

    // Search query filter
    if (filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter(log =>
        (log.summary || '').toLowerCase().includes(query) ||
        log.entity.toLowerCase().includes(query) ||
        (log.actor || '').toLowerCase().includes(query) ||
        (log.fullDescription || '').toLowerCase().includes(query)
      );
    }

    return result;
  }, [logs, filters]);

  // ============================================
  // PAGINATION
  // ============================================

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============================================
  // HANDLERS
  // ============================================

  const handleClearFilters = () => {
    setFilters({
      dateRange: null,
      adminUsers: [],
      actionTypes: [],
      entities: [],
      sources: [],
      severities: [],
      searchQuery: '',
    });
    setCurrentPage(1);
    toast.success('All filters cleared');
  };

  const handleViewDetails = (log: AuditLogEntry) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const handleExport = (format: 'csv' | 'json' | 'pdf') => {
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      toast.error('Only Admins can export logs');
      return;
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
    const filename = `${serviceType.toLowerCase().replace(/\s/g, '-')}_logs_${timestamp}`;

    if (format === 'csv') {
      const csvContent = [
        ['Timestamp', 'Actor', 'Action', 'Entity', 'Severity', 'Summary'].join(','),
        ...filteredLogs.map(log => [
          log.timestampDisplay || log.timestamp,
          log.actor || 'System',
          log.action,
          log.entity,
          log.severity || 'Info',
          `"${log.summary || ''}"`,
        ].join(',')),
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.csv`;
      a.click();

      toast.success(`Exported ${filteredLogs.length} logs as CSV`);
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(filteredLogs, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.json`;
      a.click();

      toast.success(`Exported ${filteredLogs.length} logs as JSON`);
    } else if (format === 'pdf') {
      toast.info('PDF export would generate a formatted report (not implemented in demo)');
    }

    if (onExport) {
      onExport(format, filteredLogs);
    }
  };

  const toggleFilter = (filterKey: keyof LogFilters, value: any) => {
    setFilters(prev => {
      const currentValues = prev[filterKey] as any[];
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];

      return { ...prev, [filterKey]: newValues };
    });
    setCurrentPage(1);
  };

  // ============================================
  // ACTIVE FILTERS COUNT
  // ============================================

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.dateRange) count++;
    if (filters.adminUsers.length > 0) count++;
    if (filters.actionTypes.length > 0) count++;
    if (filters.entities.length > 0) count++;
    if (filters.sources.length > 0) count++;
    if (filters.severities.length > 0) count++;
    if (filters.searchQuery.trim() !== '') count++;
    return count;
  }, [filters]);

  // ============================================
  // CRITICAL LOGS WARNING
  // ============================================

  const recentCriticalLogs = useMemo(() => {
    const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return logs.filter(log =>
      log.severity === 'Critical' &&
      new Date(log.timestamp) > last24Hours
    ).length;
  }, [logs]);

  // ============================================
  // RBAC CHECK
  // ============================================
  const canViewLogs = userRole === 'admin' || userRole === 'superadmin' || userRole === 'manager';

  if (!canViewLogs) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
        <Shield size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-2">Access Denied</h3>
        <p className="text-sm text-gray-600">Only Admins and Managers can view audit logs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Log Summary Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-sm text-gray-500 mb-1">Total Logs</div>
              <div className="text-3xl font-bold text-gray-900">{logs.length}</div>
            </div>

            <div className="h-12 w-px bg-gray-200"></div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Filtered Results</div>
              <div className="text-3xl font-bold text-blue-600">{filteredLogs.length}</div>
            </div>

            <div className="h-12 w-px bg-gray-200"></div>

            <div>
              <div className="text-sm text-gray-500 mb-1">Last Activity</div>
              <div className="text-sm font-semibold text-gray-900">
                {logs.length > 0 ? (logs[0].timestampDisplay || logs[0].timestamp) : 'No logs'}
              </div>
            </div>

            {recentCriticalLogs > 0 && (
              <>
                <div className="h-12 w-px bg-gray-200"></div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-200">
                  <AlertCircle size={18} className="text-red-600" />
                  <div>
                    <div className="text-xs text-red-600 font-semibold">Critical Alerts</div>
                    <div className="text-sm font-bold text-red-700">{recentCriticalLogs} in last 24h</div>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
              </span>
            )}
            <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
              <Filter size={16} className="mr-2" />
              {showFilters ? 'Hide' : 'Show'} Filters
              {showFilters ? <ChevronUp size={16} className="ml-2" /> : <ChevronDown size={16} className="ml-2" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Section 2: Advanced Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Advanced Filters</h3>
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X size={16} className="mr-2" />
              Clear All
            </Button>
          </div>

          <div className="space-y-4">
            {/* Search Query */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Search Logs</label>
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search by summary, entity, actor..."
                  value={filters.searchQuery}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => { setFilters({ ...filters, searchQuery: e.target.value }); setCurrentPage(1); }}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Start Date</label>
                <Input
                  type="date"
                  value={filters.dateRange?.start || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFilters({
                      ...filters,
                      dateRange: { start: e.target.value, end: filters.dateRange?.end || e.target.value }
                    });
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">End Date</label>
                <Input
                  type="date"
                  value={filters.dateRange?.end || ''}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setFilters({
                      ...filters,
                      dateRange: { start: filters.dateRange?.start || e.target.value, end: e.target.value }
                    });
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>

            {/* Multi-select Filters */}
            <div className="grid grid-cols-2 gap-4">
              {/* Admin Users */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Admin Users</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  {filterOptions.adminUsers.map(admin => (
                    <div key={admin} className="flex items-center gap-2">
                      <Checkbox
                        checked={filters.adminUsers.includes(admin)}
                        onCheckedChange={() => toggleFilter('adminUsers', admin)}
                      />
                      <span className="text-sm text-gray-700">{admin}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Types */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Action Types</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  {filterOptions.actionTypes.map(action => (
                    <div key={action} className="flex items-center gap-2">
                      <Checkbox
                        checked={filters.actionTypes.includes(action)}
                        onCheckedChange={() => toggleFilter('actionTypes', action)}
                      />
                      <span className="text-sm text-gray-700">{action}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Entities */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Entities</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  {filterOptions.entities.map(entity => (
                    <div key={entity} className="flex items-center gap-2">
                      <Checkbox
                        checked={filters.entities.includes(entity)}
                        onCheckedChange={() => toggleFilter('entities', entity)}
                      />
                      <span className="text-sm text-gray-700">{entity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sources */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Sources</label>
                <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3 bg-gray-50">
                  {filterOptions.sources.map(source => (
                    <div key={source} className="flex items-center gap-2">
                      <Checkbox
                        checked={filters.sources.includes(source)}
                        onCheckedChange={() => toggleFilter('sources', source)}
                      />
                      <span className="text-sm text-gray-700">{source}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Severities */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Severity</label>
                <div className="space-y-2 border rounded-lg p-3 bg-gray-50">
                  {filterOptions.severities.map(severity => (
                    <div key={severity} className="flex items-center gap-2">
                      <Checkbox
                        checked={filters.severities.includes(severity)}
                        onCheckedChange={() => toggleFilter('severities', severity)}
                      />
                      <span className="text-sm text-gray-700">{severity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section 3: Export Options */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {paginatedLogs.length} of {filteredLogs.length} logs
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
            <Download size={16} className="mr-2" />
            Export CSV
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('json')}>
            <Download size={16} className="mr-2" />
            Export JSON
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
            <Download size={16} className="mr-2" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Section 4: Logs Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Action</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Entity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Severity</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Summary</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm text-gray-500">
                    No logs found matching your filters
                  </td>
                </tr>
              ) : (
                paginatedLogs.map((log) => {
                  const severityConfig = getSeverityConfig(log.severity || 'Info');
                  const ActorIcon = getActorIcon(log.actorType || 'System');

                  return (
                    <tr key={log.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleViewDetails(log)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-mono">
                        {log.timestampDisplay || log.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <ActorIcon size={16} className="text-gray-500" />
                          <span className="text-sm font-semibold text-gray-900">{log.actor || 'System'}</span>
                          {(log.actorType === 'System' || !log.actorType) && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-600">
                              System
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {log.entity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${severityConfig.color}`}>
                          <severityConfig.icon size={12} />
                          {log.severity || 'Info'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700 max-w-md truncate">
                        {log.summary || 'No summary'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <Button variant="ghost" size="sm" onClick={(e: any) => { e.stopPropagation(); handleViewDetails(log); }}>
                          <Eye size={16} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Section 5: Retention & Compliance */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl border border-emerald-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Shield size={20} className="text-emerald-600" />
            </div>
            <div>
              <div className="font-bold text-gray-900 mb-1">Audit Compliance</div>
              <div className="text-sm text-gray-600">
                Logs retained for <strong>24 months</strong> • Append-only • Immutable
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-100 border border-emerald-300">
            <CheckCircle size={18} className="text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Audit Ready</span>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Audit Log Details</DialogTitle>
            <DialogDescription>Complete log entry with before/after state comparison</DialogDescription>
          </DialogHeader>

          {selectedLog && (
            <div className="space-y-6 py-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Log ID</div>
                  <div className="text-sm font-mono text-gray-900">{selectedLog.id}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Timestamp</div>
                  <div className="text-sm font-semibold text-gray-900">{selectedLog.timestampDisplay || selectedLog.timestamp}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Actor</div>
                  <div className="flex items-center gap-2">
                    {React.createElement(getActorIcon(selectedLog.actorType || 'System'), { size: 16, className: 'text-gray-500' })}
                    <span className="text-sm font-semibold text-gray-900">{selectedLog.actor || 'System'}</span>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Action</div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                    {selectedLog.action}
                  </span>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Entity</div>
                  <div className="text-sm font-semibold text-gray-900">{selectedLog.entity}</div>
                  {selectedLog.entityId && (
                    <div className="text-xs text-gray-500 mt-1">ID: {selectedLog.entityId}</div>
                  )}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Severity</div>
                  {(() => {
                    const config = getSeverityConfig(selectedLog.severity || 'Info');
                    return (
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
                        <config.icon size={12} />
                        {selectedLog.severity || 'Info'}
                      </span>
                    );
                  })()}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Source</div>
                  <div className="text-sm font-semibold text-gray-900">{selectedLog.source || 'System'}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-xs font-semibold text-gray-500 uppercase mb-1">Trigger Type</div>
                  <div className="text-sm font-semibold text-gray-900">{selectedLog.triggerType || 'Manual'}</div>
                </div>
              </div>

              {/* Full Description */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs font-semibold text-blue-700 uppercase mb-2">Full Description</div>
                <div className="text-sm text-blue-900">{selectedLog.fullDescription || selectedLog.summary || 'No description available'}</div>
              </div>

              {/* Before/After State Comparison */}
              {selectedLog.beforeState && selectedLog.afterState && (() => {
                const diff = formatJsonDiff(selectedLog.beforeState, selectedLog.afterState);

                return (
                  <div>
                    <div className="text-sm font-bold text-gray-900 mb-3">State Changes</div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <div className="text-xs font-semibold text-red-700 uppercase mb-3">Before</div>
                        <pre className="text-xs text-red-900 font-mono whitespace-pre-wrap">
                          {JSON.stringify(selectedLog.beforeState, null, 2)}
                        </pre>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <div className="text-xs font-semibold text-emerald-700 uppercase mb-3">After</div>
                        <pre className="text-xs text-emerald-900 font-mono whitespace-pre-wrap">
                          {JSON.stringify(selectedLog.afterState, null, 2)}
                        </pre>
                      </div>
                    </div>

                    {diff.changed && (
                      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="text-xs font-semibold text-amber-700 uppercase mb-2">Changed Fields</div>
                        <div className="space-y-2">
                          {diff.fields.map((field, idx) => (
                            <div key={idx} className="text-xs text-amber-900">
                              <strong>{field.key}:</strong> {JSON.stringify(field.before)} → {JSON.stringify(field.after)}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Technical Details */}
              {(selectedLog.ipAddress || selectedLog.userAgent) && (
                <div className="space-y-3">
                  <div className="text-sm font-bold text-gray-900">Technical Details</div>
                  {selectedLog.ipAddress && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">IP Address</div>
                      <div className="text-sm font-mono text-gray-900">{selectedLog.ipAddress}</div>
                    </div>
                  )}
                  {selectedLog.userAgent && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <div className="text-xs font-semibold text-gray-500 uppercase mb-1">User Agent</div>
                      <div className="text-xs font-mono text-gray-700">{selectedLog.userAgent}</div>
                    </div>
                  )}
                </div>
              )}

              {/* Immutable Notice */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Shield size={14} />
                  <span>This log entry is immutable and cannot be modified or deleted from the system.</span>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
