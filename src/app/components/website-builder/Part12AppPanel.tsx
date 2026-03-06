/**
 * PART 12: EXTENSION & INTEGRATION UI FOUNDATION
 * App Panel Pattern - Standard layout for future app panels
 * 
 * This defines the visual pattern that all app panels must follow
 * to ensure consistency and native feel across all integrations.
 */

import React from 'react';
import { X, ExternalLink, Settings, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';
import { AppTrustBadge, AppExtension } from './Part12ExtensionZones';

// ============================================
// TYPES
// ============================================

export interface AppPanelProps {
  app: AppExtension;
  onClose: () => void;
  children?: React.ReactNode;
}

export interface AppPanelHeaderProps {
  app: AppExtension;
  description?: string;
  onConfigure?: () => void;
  onClose: () => void;
}

export interface AppPanelSectionProps {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  isLoading?: boolean;
}

export interface AppDataDisplayProps {
  label: string;
  value: string | number;
  helpText?: string;
}

// ============================================
// STANDARD APP PANEL LAYOUT
// ============================================

export const AppPanel: React.FC<AppPanelProps> = ({ app, onClose, children }) => {
  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-lg z-50 flex flex-col">
      {/* Panel content */}
      <ScrollArea className="flex-1">
        {children}
      </ScrollArea>
    </div>
  );
};

// ============================================
// APP PANEL HEADER (Required)
// ============================================

export const AppPanelHeader: React.FC<AppPanelHeaderProps> = ({
  app,
  description,
  onConfigure,
  onClose
}) => {
  return (
    <div className="p-6 border-b border-gray-200 bg-gray-50">
      {/* Top row: Icon, Name, Status, Close */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
            <app.icon className="w-5 h-5 text-[#253154]" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{app.name}</h2>
            <AppTrustBadge type={app.type} status={app.status} />
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Description */}
      {description && (
        <p className="text-sm text-gray-600 mb-3">{description}</p>
      )}

      {/* Configure button */}
      {onConfigure && app.status === 'active' && (
        <Button
          variant="outline"
          size="sm"
          onClick={onConfigure}
          className="w-full"
        >
          <Settings className="w-4 h-4 mr-2" />
          Configure App
        </Button>
      )}

      {/* Status Messages */}
      {app.status !== 'active' && (
        <AppStatusMessage status={app.status} appName={app.name} />
      )}
    </div>
  );
};

// ============================================
// APP PANEL SECTION
// ============================================

export const AppPanelSection: React.FC<AppPanelSectionProps> = ({
  title,
  children,
  action,
  isLoading
}) => {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-sm text-gray-700">{title}</h3>
        {action}
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="space-y-3">
          {children}
        </div>
      )}
    </div>
  );
};

// ============================================
// APP DATA DISPLAY (Read-only)
// ============================================

export const AppDataDisplay: React.FC<AppDataDisplayProps> = ({
  label,
  value,
  helpText
}) => {
  return (
    <div className="flex items-start justify-between py-2">
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-700">{label}</div>
        {helpText && (
          <div className="text-xs text-gray-500 mt-0.5">{helpText}</div>
        )}
      </div>
      <div className="text-sm font-mono text-gray-900">{value}</div>
    </div>
  );
};

// ============================================
// APP ACTION AREA
// ============================================

export const AppActionArea: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-2">
      {children}
    </div>
  );
};

// ============================================
// APP SETTINGS SECTION
// ============================================

export const AppSettingsSection: React.FC<{
  title?: string;
  children: React.ReactNode;
}> = ({ title = 'Settings', children }) => {
  return (
    <div className="p-6 border-t border-gray-200">
      <h3 className="font-semibold text-sm text-gray-700 mb-4">{title}</h3>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

// ============================================
// APP STATUS MESSAGE
// ============================================

const AppStatusMessage: React.FC<{
  status: AppExtension['status'];
  appName: string;
}> = ({ status, appName }) => {
  const config = {
    inactive: {
      icon: AlertCircle,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      message: `${appName} is installed but not activated.`
    },
    disconnected: {
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200',
      message: `${appName} has lost connection. Reconnect to continue.`
    },
    restricted: {
      icon: AlertCircle,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      message: `You don&apos;t have permission to use all features of ${appName}.`
    },
    active: {
      icon: CheckCircle,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
      message: `${appName} is connected and active.`
    }
  };

  const { icon: Icon, color, bg, border, message } = config[status];

  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg border ${bg} ${border} mt-3`}>
      <Icon className={`w-4 h-4 ${color} mt-0.5 flex-shrink-0`} />
      <p className={`text-sm ${color}`}>{message}</p>
    </div>
  );
};

// ============================================
// APP PANEL FOOTER
// ============================================

export const AppPanelFooter: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      {children}
    </div>
  );
};

// ============================================
// EXAMPLE APP PANEL USAGE
// ============================================

export const ExampleAppPanel: React.FC<{
  onClose: () => void;
}> = ({ onClose }) => {
  const exampleApp: AppExtension = {
    id: 'analytics-app',
    name: 'Analytics App',
    icon: CheckCircle,
    type: 'verified',
    status: 'active',
    hasSettings: true
  };

  return (
    <AppPanel app={exampleApp} onClose={onClose}>
      <AppPanelHeader
        app={exampleApp}
        description="Track visitor behavior and optimize your website performance."
        onConfigure={() => console.log('Configure')}
        onClose={onClose}
      />

      <AppPanelSection title="Today's Stats" isLoading={false}>
        <AppDataDisplay label="Page Views" value="1,234" helpText="Last 24 hours" />
        <AppDataDisplay label="Unique Visitors" value="892" helpText="Last 24 hours" />
        <AppDataDisplay label="Avg. Session" value="3m 42s" />
        <Separator />
        <AppDataDisplay label="Bounce Rate" value="34%" helpText="Lower is better" />
      </AppPanelSection>

      <AppActionArea>
        <Button variant="outline" className="w-full" size="sm">
          <ExternalLink className="w-4 h-4 mr-2" />
          View Full Dashboard
        </Button>
      </AppActionArea>

      <AppSettingsSection>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Tracking Enabled</div>
            <div className="text-xs text-gray-500">Collect anonymous analytics</div>
          </div>
          <input type="checkbox" defaultChecked className="rounded" />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Real-time Updates</div>
            <div className="text-xs text-gray-500">Live visitor count</div>
          </div>
          <input type="checkbox" defaultChecked className="rounded" />
        </div>
      </AppSettingsSection>
    </AppPanel>
  );
};
