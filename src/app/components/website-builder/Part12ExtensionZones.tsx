/**
 * PART 12: EXTENSION & INTEGRATION UI FOUNDATION
 * Extension Zones - Non-intrusive extension points for future apps/plugins
 * 
 * This file provides:
 * - Right sidebar extension zones
 * - Canvas overlay zones
 * - Top bar extension slots
 * - All hidden by default, shown only when extensions are present
 */

import React from 'react';
import { ChevronDown, ChevronRight, Puzzle, Info, X } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

// ============================================
// TYPES
// ============================================

export interface AppExtension {
  id: string;
  name: string;
  icon: React.ElementType;
  type: 'first-party' | 'third-party' | 'verified';
  status: 'active' | 'inactive' | 'disconnected' | 'restricted';
  hasSettings?: boolean;
  hasCanvasOverlay?: boolean;
  hasTopBarAction?: boolean;
}

export interface ExtensionZoneProps {
  extensions?: AppExtension[];
  devMode?: boolean; // Show placeholders in dev mode
}

// ============================================
// RIGHT SIDEBAR EXTENSION ZONE
// ============================================

export const RightSidebarExtensionZone: React.FC<{
  extension?: AppExtension;
  children?: React.ReactNode;
}> = ({ extension, children }) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  if (!extension) return null;

  return (
    <div className="border-t border-gray-200 pt-4 mt-4">
      {/* Extension Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-colors"
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronRight className="w-4 h-4 text-gray-400" />
          )}
          <extension.icon className="w-4 h-4 text-[#253154]" />
          <span className="font-medium text-sm">{extension.name} Settings</span>
        </div>
        <AppTrustBadge type={extension.type} status={extension.status} />
      </button>

      {/* Divider with subtle indicator */}
      {isExpanded && (
        <>
          <div className="flex items-center gap-2 my-2">
            <Separator className="flex-1" />
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Puzzle className="w-3 h-3" />
              App Section
            </span>
            <Separator className="flex-1" />
          </div>

          {/* Extension Content */}
          <div className="pl-6 space-y-3">
            {children || (
              <div className="text-sm text-gray-500 py-2">
                No settings available
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

// ============================================
// CANVAS OVERLAY ZONE
// ============================================

export const CanvasOverlayZone: React.FC<{
  extension?: AppExtension;
  message?: string;
  onDismiss?: () => void;
}> = ({ extension, message, onDismiss }) => {
  if (!extension || !message) return null;

  return (
    <div className="absolute top-2 right-2 max-w-xs z-10">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 flex items-start gap-2">
        <extension.icon className="w-4 h-4 text-[#253154] mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium">{extension.name}</span>
            <AppTrustBadge type={extension.type} status={extension.status} size="sm" />
          </div>
          <p className="text-xs text-gray-600">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================
// TOP BAR EXTENSION SLOT
// ============================================

export const TopBarExtensionSlot: React.FC<{
  extensions?: AppExtension[];
  onActionClick?: (extensionId: string) => void;
}> = ({ extensions, onActionClick }) => {
  const activeExtensions = extensions?.filter(e => e.hasTopBarAction && e.status === 'active');

  if (!activeExtensions || activeExtensions.length === 0) return null;

  return (
    <div className="flex items-center gap-1 border-l border-gray-200 pl-2 ml-2">
      {activeExtensions.map((ext) => (
        <Tooltip key={ext.id}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onActionClick?.(ext.id)}
              className="relative"
            >
              <ext.icon className="w-4 h-4" />
              {ext.status === 'disconnected' && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <div className="text-xs">
              <div className="font-medium">{ext.name}</div>
              <div className="text-gray-400">Click to open</div>
            </div>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};

// ============================================
// APP TRUST BADGE
// ============================================

export const AppTrustBadge: React.FC<{
  type: AppExtension['type'];
  status: AppExtension['status'];
  size?: 'sm' | 'md';
}> = ({ type, status, size = 'md' }) => {
  const getVariant = () => {
    if (status === 'disconnected') return 'destructive';
    if (status === 'inactive') return 'secondary';
    if (status === 'restricted') return 'outline';
    return 'default';
  };

  const getLabel = () => {
    if (status === 'disconnected') return 'Disconnected';
    if (status === 'inactive') return 'Inactive';
    if (status === 'restricted') return 'Restricted';

    switch (type) {
      case 'first-party':
        return 'Official';
      case 'verified':
        return 'Verified';
      case 'third-party':
        return 'Third-party';
    }
  };

  return (
    <Badge
      variant={getVariant()}
      className={size === 'sm' ? 'text-xs px-1.5 py-0' : 'text-xs'}
    >
      {getLabel()}
    </Badge>
  );
};

// ============================================
// EXTENSION DISCOVERY PLACEHOLDER
// (Hidden by default, shown only in dev mode)
// ============================================

export const ExtensionDiscoveryPlaceholder: React.FC<{
  zone: 'sidebar' | 'canvas' | 'topbar';
  devMode?: boolean;
}> = ({ zone, devMode }) => {
  if (!devMode) return null;

  const messages = {
    sidebar: 'Apps can add settings here',
    canvas: 'Apps can show overlays here',
    topbar: 'Apps can add actions here'
  };

  return (
    <div className="border-2 border-dashed border-purple-200 bg-purple-50/50 rounded-lg p-3">
      <div className="flex items-center gap-2 text-purple-600">
        <Puzzle className="w-4 h-4" />
        <span className="text-xs font-medium">Extension Zone</span>
      </div>
      <p className="text-xs text-purple-500 mt-1">{messages[zone]}</p>
    </div>
  );
};

// ============================================
// EVENT HOOK INDICATOR
// (Visual indicator that an action triggers app automations)
// ============================================

export const EventHookIndicator: React.FC<{
  connectedApps: number;
  eventType: string;
}> = ({ connectedApps, eventType }) => {
  if (connectedApps === 0) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="inline-flex items-center gap-1 text-xs text-purple-600 ml-2">
          <Puzzle className="w-3 h-3" />
          <span>{connectedApps}</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-xs">
          <div className="font-medium mb-1">Connected Automations</div>
          <div className="text-gray-400">
            {connectedApps} app{connectedApps > 1 ? 's' : ''} will receive &quot;{eventType}&quot; events
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};

// ============================================
// APP SETTINGS BOUNDARY
// (Visual separator for app-controlled sections)
// ============================================

export const AppSettingsBoundary: React.FC<{
  appName: string;
  children: React.ReactNode;
}> = ({ appName, children }) => {
  return (
    <div className="relative">
      {/* Top boundary */}
      <div className="flex items-center gap-2 mb-3">
        <Separator className="flex-1" />
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Puzzle className="w-3 h-3" />
          <span>Managed by {appName}</span>
        </div>
        <Separator className="flex-1" />
      </div>

      {/* Content */}
      <div className="space-y-3">
        {children}
      </div>

      {/* Bottom boundary */}
      <Separator className="mt-3" />
    </div>
  );
};

// ============================================
// PERMISSION STATE INDICATOR
// ============================================

export const PermissionStateIndicator: React.FC<{
  state: 'restricted' | 'inactive' | 'disconnected';
  message: string;
}> = ({ state, message }) => {
  const config = {
    restricted: {
      icon: Info,
      color: 'text-orange-600',
      bg: 'bg-orange-50',
      border: 'border-orange-200'
    },
    inactive: {
      icon: Info,
      color: 'text-gray-600',
      bg: 'bg-gray-50',
      border: 'border-gray-200'
    },
    disconnected: {
      icon: Info,
      color: 'text-red-600',
      bg: 'bg-red-50',
      border: 'border-red-200'
    }
  };

  const { icon: Icon, color, bg, border } = config[state];

  return (
    <div className={`flex items-start gap-2 p-3 rounded-lg border ${bg} ${border}`}>
      <Icon className={`w-4 h-4 ${color} mt-0.5 flex-shrink-0`} />
      <p className={`text-sm ${color}`}>{message}</p>
    </div>
  );
};
