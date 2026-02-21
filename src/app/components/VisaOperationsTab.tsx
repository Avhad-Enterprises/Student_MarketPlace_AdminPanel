/**
 * VISA OPERATIONS TAB - SYSTEM & SERVICE CONTROL
 * 🚨 CRITICAL: This tab controls how the visa operates inside the platform, NOT visa content
 * 
 * Purpose: Admin-level control over service availability, sync, and operational settings
 */

import React, { useState } from 'react';
import {
  Power,
  Globe,
  RefreshCw,
  FileText,
  Shield,
  AlertCircle,
  Lock,
  Zap,
  Save,
  XOctagon,
} from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';
import type { EditModeContextType } from './VisaProviderDetail';

export const VisaOperationsTab: React.FC<{ context: EditModeContextType }> = ({ context }) => {
  const { addActivityLog, userRole } = context;

  const [serviceAvailability, setServiceAvailability] = useState<'enabled' | 'disabled' | 'maintenance'>('enabled');
  const [countryControls, setCountryControls] = useState({
    USA: true,
    Canada: true,
    UK: false,
    Australia: false,
  });
  const [lastSyncDate, setLastSyncDate] = useState('2024-02-06 14:30');
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [operationalNotes, setOperationalNotes] = useState('');

  const handleToggleCountry = (country: string) => {
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      toast.error('You do not have permission to modify country controls');
      return;
    }

    setCountryControls(prev => ({ ...prev, [country]: !prev[country as keyof typeof countryControls] }));

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Country Control',
      summary: `${!countryControls[country as keyof typeof countryControls] ? 'Enabled' : 'Disabled'} visa for ${country}`,
    });

    toast.success(`Visa service ${!countryControls[country as keyof typeof countryControls] ? 'enabled' : 'disabled'} for ${country}`);
  };

  const handleManualSync = () => {
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      toast.error('You do not have permission to sync data');
      return;
    }

    toast.info('Syncing visa data...');

    setTimeout(() => {
      setLastSyncDate(new Date().toISOString().replace('T', ' ').substring(0, 16));

      addActivityLog({
        admin: 'Current Admin',
        action: 'Synced',
        entity: 'Visa Data',
        summary: 'Manual sync completed successfully',
      });

      toast.success('Visa data synchronized successfully');
    }, 2000);
  };

  const handleSaveOperationalNotes = () => {
    if (userRole !== 'admin' && userRole !== 'superadmin') {
      toast.error('You do not have permission to save operational notes');
      return;
    }

    addActivityLog({
      admin: 'Current Admin',
      action: 'Updated',
      entity: 'Operational Notes',
      summary: 'Updated internal operational notes',
    });

    toast.success('Operational notes saved');
  };

  return (
    <div className="space-y-6">
      {/* CRITICAL: Admin-Level Access Warning */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600" />
          <div>
            <h3 className="text-sm font-bold text-amber-900">Admin-Level Operations</h3>
            <p className="text-xs text-amber-700 mt-1">
              This tab controls how the visa operates within the platform. Changes here affect system behavior, not visa content.
            </p>
          </div>
        </div>
      </div>

      {/* 1️⃣ SERVICE AVAILABILITY CONTROL */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Power className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-gray-900">Service Availability</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Control whether this visa service is available to students on the platform
        </div>

        <div className="space-y-4">
          {/* Master Toggle */}
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div className="text-xs font-semibold text-purple-600 uppercase mb-2">Master Service Status</div>
            <select
              value={serviceAvailability}
              onChange={(e) => {
                if (userRole !== 'admin' && userRole !== 'superadmin') {
                  toast.error('You do not have permission to change service availability');
                  return;
                }
                setServiceAvailability(e.target.value as 'enabled' | 'disabled' | 'maintenance');

                addActivityLog({
                  admin: 'Current Admin',
                  action: 'Updated',
                  entity: 'Service Availability',
                  summary: `Changed status to ${e.target.value}`,
                });

                toast.success(`Service availability changed to ${e.target.value}`);
              }}
              className="w-full px-3 py-2 border border-purple-300 rounded-lg text-sm font-semibold"
              disabled={userRole === 'counselor' || userRole === 'support'}
            >
              <option value="enabled">🟢 Enabled (Visible to Students)</option>
              <option value="disabled">🔴 Disabled (Hidden from Students)</option>
              <option value="maintenance">🟡 Maintenance Mode (View Only)</option>
            </select>
            <div className="text-xs text-purple-700 mt-2">
              {serviceAvailability === 'enabled' && 'Students can browse and apply for this visa'}
              {serviceAvailability === 'disabled' && 'This visa is completely hidden from the student portal'}
              {serviceAvailability === 'maintenance' && 'Students can view but cannot apply (read-only mode)'}
            </div>
          </div>

          {/* Current Status Summary */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
              <div className="text-xs text-emerald-600 font-semibold uppercase mb-1">Platform Status</div>
              <div className="text-lg font-bold text-emerald-900">
                {serviceAvailability === 'enabled' ? 'Active' : serviceAvailability === 'disabled' ? 'Inactive' : 'Maintenance'}
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
              <div className="text-xs text-blue-600 font-semibold uppercase mb-1">Active Countries</div>
              <div className="text-lg font-bold text-blue-900">
                {Object.values(countryControls).filter(Boolean).length} / {Object.keys(countryControls).length}
              </div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
              <div className="text-xs text-purple-600 font-semibold uppercase mb-1">Access Level</div>
              <div className="text-lg font-bold text-purple-900">
                {userRole === 'superadmin' ? 'Super Admin' : userRole === 'admin' ? 'Admin' : 'View Only'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2️⃣ COUNTRY-LEVEL ENABLE / DISABLE */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Globe className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Country-Level Controls</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Enable or disable this visa service per destination country
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(countryControls).map(([country, enabled]) => (
            <div
              key={country}
              className={`flex items-center justify-between p-4 rounded-lg border ${enabled
                ? 'bg-emerald-50 border-emerald-200'
                : 'bg-gray-50 border-gray-200'
                }`}
            >
              <div className="flex items-center gap-2">
                <Globe size={16} className={enabled ? 'text-emerald-600' : 'text-gray-400'} />
                <div>
                  <div className={`font-semibold text-sm ${enabled ? 'text-emerald-900' : 'text-gray-500'
                    }`}>
                    {country}
                  </div>
                  <div className={`text-xs mt-0.5 ${enabled ? 'text-emerald-700' : 'text-gray-500'
                    }`}>
                    {enabled ? 'Active for students' : 'Disabled'}
                  </div>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleToggleCountry(country)}
                  className="sr-only peer"
                  disabled={userRole === 'counselor' || userRole === 'support'}
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 3️⃣ SYNC & REFRESH CONTROLS */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <RefreshCw className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Data Synchronization</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Sync visa data from external sources (embassy APIs, government databases)
        </div>

        <div className="space-y-4">
          {/* Last Sync Info */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-blue-600 font-semibold uppercase">Last Synchronized</div>
                <div className="text-sm font-bold text-blue-900 mt-1">{lastSyncDate}</div>
                <div className="text-xs text-blue-700 mt-1">
                  {autoSyncEnabled ? 'Auto-sync enabled (daily at 2:00 AM)' : 'Auto-sync disabled'}
                </div>
              </div>
              <Button
                onClick={handleManualSync}
                disabled={userRole === 'counselor' || userRole === 'support'}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw size={16} />
                Manual Sync
              </Button>
            </div>
          </div>

          {/* Auto-Sync Toggle */}
          <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-200">
            <div>
              <div className="font-semibold text-purple-900 text-sm">Automatic Synchronization</div>
              <div className="text-xs text-purple-700 mt-0.5">Sync visa data automatically every 24 hours</div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={autoSyncEnabled}
                onChange={(e) => {
                  if (userRole !== 'admin' && userRole !== 'superadmin') {
                    toast.error('You do not have permission to change auto-sync settings');
                    return;
                  }
                  setAutoSyncEnabled(e.target.checked);

                  addActivityLog({
                    admin: 'Current Admin',
                    action: 'Updated',
                    entity: 'Auto-Sync',
                    summary: `Auto-sync ${e.target.checked ? 'enabled' : 'disabled'}`,
                  });

                  toast.success(`Auto-sync ${e.target.checked ? 'enabled' : 'disabled'}`);
                }}
                className="sr-only peer"
                disabled={userRole === 'counselor' || userRole === 'support'}
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* 4️⃣ INTERNAL OPERATIONAL NOTES */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-5 h-5 text-gray-600" />
          <h2 className="text-lg font-bold text-gray-900">Internal Operational Notes</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Admin-only notes about system behavior, known issues, or operational considerations
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-xs font-semibold text-gray-600 uppercase mb-2">
              <div className="flex items-center gap-2">
                <Lock size={14} className="text-gray-500" />
                <span>Admin-Only Notes</span>
              </div>
            </div>
            <textarea
              value={operationalNotes}
              onChange={(e) => setOperationalNotes(e.target.value)}
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
              placeholder="E.g., 'API rate limit: 100 requests/hour. Embassy API down on weekends. Processing time increased due to seasonal demand.'"
              disabled={userRole === 'counselor' || userRole === 'support'}
            />
            <div className="text-xs text-gray-600 mt-2 flex items-center justify-between">
              <span>Not visible to students or counselors</span>
              <Button
                onClick={handleSaveOperationalNotes}
                disabled={userRole === 'counselor' || userRole === 'support' || !operationalNotes.trim()}
                size="sm"
                className="bg-gray-700 hover:bg-gray-800 text-white"
              >
                <Save size={14} className="mr-1" />
                Save Notes
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 5️⃣ ADMIN-ONLY CONTROLS */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-red-600" />
          <h2 className="text-lg font-bold text-gray-900">Admin-Only Controls</h2>
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Restricted operations for platform administrators only
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Force Refresh Cache */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <Zap size={16} className="text-amber-600" />
              <div className="text-xs font-semibold text-amber-600 uppercase">Force Cache Refresh</div>
            </div>
            <div className="text-xs text-amber-700 mb-3">Clear cached data and force reload from source</div>
            <Button
              onClick={() => {
                if (userRole !== 'admin' && userRole !== 'superadmin') {
                  toast.error('You do not have permission to clear cache');
                  return;
                }

                addActivityLog({
                  admin: 'Current Admin',
                  action: 'Updated',
                  entity: 'Cache',
                  summary: 'Forced cache refresh',
                });

                toast.success('Cache cleared successfully');
              }}
              disabled={userRole === 'counselor' || userRole === 'support'}
              size="sm"
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
            >
              <RefreshCw size={14} className="mr-1" />
              Clear Cache
            </Button>
          </div>

          {/* Reset to Default Configuration */}
          <div className="p-4 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center gap-2 mb-2">
              <XOctagon size={16} className="text-red-600" />
              <div className="text-xs font-semibold text-red-600 uppercase">Reset Configuration</div>
            </div>
            <div className="text-xs text-red-700 mb-3">Restore all operations settings to defaults</div>
            <Button
              onClick={() => {
                if (userRole !== 'superadmin') {
                  toast.error('Only Super Admins can reset configuration');
                  return;
                }

                addActivityLog({
                  admin: 'Current Admin',
                  action: 'Updated',
                  entity: 'Configuration',
                  summary: 'Reset operations to default',
                });

                toast.success('Configuration reset to defaults');
              }}
              disabled={userRole !== 'superadmin'}
              size="sm"
              variant="destructive"
              className="w-full"
            >
              <XOctagon size={14} className="mr-1" />
              Reset to Default
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
